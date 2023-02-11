import { base64, wrapFetch } from '../depts.ts';
import { azure, extractSettings, generateString } from './utils.ts';

interface AuthorizationInfo {
    access_token: string;
    id_token: string;
    token_type: string;
    not_before: number;
    expires_in: number;
    expires_on: number;
    resource: string;
    id_token_expires_in: number;
    profile_info: string;
    scope: string;
    refresh_token: string;
    refresh_token_expires_in: number;
}

export async function authorize(user: string, password: string): Promise<AuthorizationInfo> {
    const fetch = wrapFetch();
    const codeChallenge: string = generateString(43);
    const codeChallengeB64url: string = base64.fromArrayBuffer(
        await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeChallenge)),
        true,
    );

    const preAuthData = {
        'client_id': azure.authClientId,
        'scope': azure.authScope,
        'redirect_uri': azure.authRedirectUrl,
        'response_type': 'code',
        'code_challenge': codeChallengeB64url,
        'code_challenge_method': 'S256',
    };

    const fetchPreAuth: Response = await fetch(
        azure.authorizeUrl + '?' + (new URLSearchParams(preAuthData)).toString(),
    );
    const sourceText: string = await fetchPreAuth.text();
    const settings: Record<string, string> = JSON.parse(extractSettings(sourceText));
    const csrf: string = settings.csrf;
    const transId: string = settings.transId.split('=')[1];

    const selfAssertedParams = {
        'tx': 'StateProperties=' + transId,
        'p': 'B2C_1A_SignUpOrSigninOnline',
    };
    const selfAssertedBuildUrl = azure.selfAssertedUrl + '?' + (new URLSearchParams(selfAssertedParams)).toString();
    await fetch(selfAssertedBuildUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Csrf-Token': csrf,
        },
        body: new URLSearchParams({
            'request_type': 'RESPONSE',
            'signInName': user,
            'password': password,
        }),
    });

    const SigninConfirmedParams = {
        'csrf_token': csrf,
        'tx': 'StateProperties=' + transId,
        'p': 'B2C_1A_SignUpOrSigninOnline',
    };
    const fetchSigninConfirmed: Response = await fetch(
        azure.combinedSigninSignupConfirmedUrl + '?' + (new URLSearchParams(SigninConfirmedParams)).toString(),
    );

    const fetchToken: Response = await fetch(azure.tokenUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'client_id': azure.authClientId,
            'redirect_uri': azure.authRedirectUrl,
            'scope': azure.authClientId,
            'code': fetchSigninConfirmed.url.split('code=')[1],
            'code_verifier': codeChallenge,
            'grant_type': 'authorization_code',
        }),
    });
    const tokenResult: AuthorizationInfo = await fetchToken.json() as AuthorizationInfo;
    return tokenResult;
}
