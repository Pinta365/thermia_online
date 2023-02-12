export type SupportedLocales =
    | "sv-SE"
    | "en-US"
    | "fi-FI"
    | "da-DK"
    | "nb-NO"
    | "cs-CZ"
    | "de-DE"
    | "es-ES"
    | "et-EE"
    | "fr-FR"
    | "it-IT"
    | "nl-NL"
    | "pl-PL"
    | "ru-RU"
    | "sl-SI";

export interface LocaleData {
    culture: SupportedLocales;
    resources: [
        key: string,
        value: string,
    ];
}

export interface TranslationTable {
    [key: string]: string;
}
