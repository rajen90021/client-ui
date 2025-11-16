'use server';

import cookie from 'cookie';
import { cookies } from 'next/headers';

export default async function login(prevState: any, formdata: FormData) {
    const email = formdata.get('email');
    const password = formdata.get('password');

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            let text = await response.text();
            try {
                const parsed = JSON.parse(text);
                return {
                    type: 'error',
                    message: parsed.errors?.[0]?.msg || parsed.message || 'Login failed',
                };
            } catch {
                return {
                    type: 'error',
                    message: text,
                };
            }
        }

        // ------ COOKIES FROM BACKEND ------
        const setCookies = response.headers.getSetCookie();

        const accessRaw = setCookies.find((c) => c.includes('accessToken'));
        const refreshRaw = setCookies.find((c) => c.includes('refreshToken'));

        if (!accessRaw || !refreshRaw) {
            return { type: 'error', message: 'No cookies were returned' };
        }

        const accessParsed = cookie.parse(accessRaw);
        const refreshParsed = cookie.parse(refreshRaw);

        if (!accessParsed.accessToken || !refreshParsed.refreshToken) {
            return { type: 'error', message: 'Invalid cookie data' };
        }

        // ------ IMPORTANT: AWAIT cookies() ------
        const cookieStore = await cookies();
        console.log("accessParsed", accessParsed);
        console.log("refreshParsed", refreshParsed);

        cookieStore.set('accessToken', accessParsed.accessToken, {
            httpOnly: (accessParsed.httpOnly as unknown as boolean) || true,
            path: accessParsed.Path || '/',
          expires: accessParsed.Expires ? new Date(accessParsed.Expires) : new Date(),

            sameSite: accessParsed.SameSite as 'strict',
            domain: accessParsed.Domain,
        });

        cookieStore.set('refreshToken', refreshParsed.refreshToken, {
            httpOnly:  (refreshParsed.httpOnly as unknown as boolean) || true,
            path: refreshParsed.Path || '/',
            expires: refreshParsed.Expires ? new Date(refreshParsed.Expires) : new Date(),
            sameSite: refreshParsed.SameSite as 'strict',
            domain: refreshParsed.Domain,
        });

        return {
            type: 'success',
            message: 'Login successful!',
        };

    } catch (err: any) {
        return {
            type: 'error',
            message: err.message,
        };
    }
}
