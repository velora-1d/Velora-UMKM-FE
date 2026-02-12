import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const host = request.headers.get('host') || ''

    // Set the project domain
    const domain = 'umkm.ve-lora.my.id'

    // Extract subdomain
    const subdomain = host.endsWith(`.${domain}`)
        ? host.replace(`.${domain}`, '')
        : null

    // Routing logic based on subdomain
    if (subdomain) {
        if (subdomain === 'owner') {
            // Internal Owner Dashboard
            url.pathname = `/owner${url.pathname}`
        } else if (subdomain !== 'www') {
            // Tenant Application
            url.pathname = `/_tenant/${subdomain}${url.pathname}`
        }
    }

    return NextResponse.rewrite(url)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
