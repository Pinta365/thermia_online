import { configureUrl, log } from './utils.ts';
import { authorize } from './auth_flow.ts';
import * as types from 'types/auth.ts';

export interface requestOptions {
    headers?: Record<string, string>;
    parameters?: Record<string, string>;
}

export class Thermia_base {
    username: string;
    password: string;
    loggedIn: boolean;
    accessToken: string;
    apiBaseUrl: string;
    localeSet: boolean;
    locale: string;
    translationTable: types.TranslationTable;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.loggedIn = false;
        this.accessToken = '';
        this.apiBaseUrl = '';
        this.localeSet = false;
        this.locale = '';
        this.translationTable = <types.TranslationTable> {};

        log('Thermia class instantiated.');
    }

    async initialize(localize?: types.SupportedLocales) {
        //fetching API base url, can possibly also fetch the auth urls from here.
        const conf = await (await fetch(configureUrl)).json();
        this.apiBaseUrl = conf.apiBaseUrl;
        await this.login();

        if (localize) {
            await this.setLocale(localize);
        }
    }

    async login() {
        if (!this.apiBaseUrl) {
            throw new Error(`Missing API base URL, class not initialized?`);
            //Maybe we should just try initializing here instead.
        }

        log(`Authenticating as user '${this.username}'...`);
        const authorization = await authorize(this.username, this.password);
        this.accessToken = authorization.access_token;
        this.loggedIn = true;
        log('Done authenticating.');
        return this.loggedIn;
    }

    async setLocale(culture: types.SupportedLocales): Promise<boolean> {
        log(`Setting localization culture to '${culture}'.`);
        const locData = await this.getLocalizationData(culture);
        this.locale = locData.culture as types.SupportedLocales;

        log(`Generating transaltion table for '${culture}'.`);
        locData.resources.forEach((phrase) => {
            const row = phrase as unknown as types.TranslationTable;
            this.translationTable[row.key] = row.value;
        });
        this.localeSet = true;
        return true;
    }

    getLocale(): types.SupportedLocales {
        if (!this.localeSet) {
            throw new Error(`Not localized, run setLocale().`);
        }
        return this.locale as types.SupportedLocales;
    }

    getTranslationTable(): types.TranslationTable {
        if (!this.localeSet) {
            throw new Error(`Not localized, run setLocale().`);
        }
        return this.translationTable;
    }

    getLocalizationData(culture: types.SupportedLocales): Promise<types.LocaleData> {
        return this.get('/api/v1/localization/' + culture, this.accessToken);
    }

    // deno-lint-ignore no-explicit-any
    async get(url: string, accessToken: string, options?: requestOptions): Promise<any> {
        if (!this.loggedIn) {
            log('Thermia is not logged in.');
            await this.login();
        }

        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
        };

        if (options?.headers) {
            Object.assign(defaultOptions.headers, options?.headers);
        }

        const finalizedUrl = this.apiBaseUrl + url +
            (options?.parameters ? '?' + (new URLSearchParams(options?.parameters)).toString() : '');
        log(`Fetching '${finalizedUrl}'`);
        const response = await fetch(finalizedUrl, defaultOptions);

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Problem fetching data. ${response.status} - ${response.statusText}`);
    }

    async post(
        url: string,
        accessToken: string,
        body: Record<string, string | number | symbol>,
        options?: requestOptions,
        // deno-lint-ignore no-explicit-any
    ): Promise<any> {
        if (!this.loggedIn) {
            log('Thermia is not logged in.');
            await this.login();
        }

        const defaultOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(body),
        };

        if (options?.headers) {
            Object.assign(defaultOptions.headers, options?.headers);
        }

        const finalizedUrl = this.apiBaseUrl + url +
            (options?.parameters ? '?' + (new URLSearchParams(options?.parameters)).toString() : '');
        log(`Fetching '${finalizedUrl}'`);
        const response = await fetch(finalizedUrl, defaultOptions);

        if (response.ok) {
            return await response.text();
        }

        throw new Error(`${response.status} - ${response.statusText}`);
    }
}
