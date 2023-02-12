export function generateString(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
}

export function extractSettings(text: string): string {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("var SETTINGS =")) {
            return lines[i].substring(15, lines[i].length - 2);
        }
    }
    return "";
}

// deno-lint-ignore no-explicit-any
export function log(message: string, ...data: any[]): void {
    if (Deno.env.get("DEVELOPMENT_MODE") === "1") {
        const timestamp = `** ${new Date().toLocaleTimeString()} **`;
        console.log(timestamp, message, ...data);
    }
}

//Azure authentication links
const azureAuthBaseUrl = "https://thermialogin.b2clogin.com/thermialogin.onmicrosoft.com/b2c_1a_signuporsigninonline";
export const azure: Record<string, string> = {
    authorizeUrl: azureAuthBaseUrl + "/oauth2/v2.0/authorize",
    tokenUrl: azureAuthBaseUrl + "/oauth2/v2.0/token",
    selfAssertedUrl: azureAuthBaseUrl + "/SelfAsserted",
    combinedSigninSignupConfirmedUrl: azureAuthBaseUrl + "/api/CombinedSigninAndSignup/confirmed",
    authScope: "09ea4903-9e95-45fe-ae1f-e3b7d32fa385",
    authClientId: "09ea4903-9e95-45fe-ae1f-e3b7d32fa385",
    authRedirectUrl: "https://online-genesis.thermia.se/login",
};

export const configureUrl = "https://online-genesis.thermia.se/api/configuration";
