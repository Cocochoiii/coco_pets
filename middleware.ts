import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
    return NextResponse.next()
}

// Only match a path that doesn't exist to effectively disable middleware
export const config = {
    matcher: [],
}