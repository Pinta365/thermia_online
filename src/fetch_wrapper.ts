const cookies = Array<Cookie>();

function getCookieString() {
    const cookiesToSend = cookies
        .map((c) => c.getThisCookieString())
        .join("; ");
    return cookiesToSend;
}

class Cookie {
    cookie: string | undefined;

    constructor(cookie?: string) {
        if (cookie) {
            this.cookie = cookie;
        }
    }

    getThisCookieString() {
        return `${this.cookie || ""}`;
    }
}

export function wrapFetch(): typeof fetch {
    const fetch = globalThis.fetch;

    async function wrappedFetch(
        input: RequestInfo | URL,
        options?: RequestInit,
    ): Promise<Response> {
        const interceptedOptions = {
            ...options,
        };

        const reqHeaders = new Headers((input as Request).headers || {});

        if (options?.headers) {
            new Headers(options.headers).forEach((value, key) => {
                reqHeaders.set(key, value);
            });
        }

        reqHeaders.set("cookie", getCookieString());

        interceptedOptions.headers = reqHeaders;

        const response = await fetch(input, interceptedOptions as RequestInit);

        if (cookies.length < 4) {
            response.headers.forEach((value, key) => {
                if (key.toLowerCase() === "set-cookie") {
                    cookies.push(new Cookie(value));
                }
            });
        }

        const redirectUrl = response.headers.get("location");
        if (!redirectUrl) {
            return response;
        }
        return await wrappedFetch(redirectUrl, interceptedOptions as RequestInit);
    }
    return wrappedFetch;
}
