import { NextResponse, type NextRequest } from 'next/server';
const legacy = /^(?:\/archive(?:\/|$)|\/deep-dive(?:\/|$)|\/ai-updates(?:\/|$)|\/book(?:\/|$)|\/library(?:\/|$)|\/en\/archive(?:\/|$)|\/en\/deep-dive(?:\/|$)|\/issues(?:\/|$)|\/guestbook(?:\/|$)|\/feed\.xml$|\/en\/feed\.xml$)/;
export function proxy(request: NextRequest) { if (legacy.test(request.nextUrl.pathname)) return new NextResponse('Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8' } }); return NextResponse.next(); }
export const config={matcher:['/archive/:path*','/deep-dive/:path*','/ai-updates/:path*','/book/:path*','/library/:path*','/en/archive/:path*','/en/deep-dive/:path*','/issues/:path*','/guestbook/:path*','/feed.xml','/en/feed.xml']};
