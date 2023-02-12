interface Cookie {
    cookieName: string;
    cookieContent: string;
}

export function fetchWrapper() {
    const fetch = globalThis.fetch;
    const cookies = Array<Cookie>();

    function setCookie(cookieString: string) {
        const parts = cookieString.split("=");
        const cookie: Cookie = { cookieName: parts[0], cookieContent: parts.join("=") };

        for (const index in cookies) {
            if (parts[0] === cookies[index].cookieName) {
                cookies.splice(index as unknown as number, 1, cookie);
                return;
            }
        }
        cookies.push(cookie);
    }

    function getCookies() {
        return cookies.map((c) => c.cookieContent).join("; ");
    }

    async function wrappedFetch(
        input: Request | string,
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

        reqHeaders.set("cookie", getCookies());

        interceptedOptions.headers = reqHeaders;

        const response = await fetch(input, interceptedOptions as RequestInit);

        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") {
                setCookie(value);
            }
        });

        const redirectUrl = response.headers.get("location");
        if (!redirectUrl) {
            return response;
        }

        return await wrappedFetch(redirectUrl, interceptedOptions as RequestInit);
    }
    return wrappedFetch;
}
