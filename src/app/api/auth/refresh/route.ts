import { cookies } from 'next/headers';
import cookie from 'cookie';

export async function POST() {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/refresh`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
            Cookie: `refreshToken=${cookieStore.get('refreshToken')?.value}`,
        },
    });

    if (!response.ok) {
        console.log('Refresh failed.');
        return Response.json({ success: false });
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


    return Response.json({ success: true });
}
