import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password, redirect_uri } = await request.json();

        // Login to OAuth server with cookies enabled
        const loginResponse = await fetch(
            `${process.env.OIDC_ISSUER}/api/v1/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            },
        );

        if (!loginResponse.ok) {
            const errorData = await loginResponse.json().catch(() => ({}));
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message:
                            errorData.error?.message || "Invalid credentials",
                    },
                },
                { status: 401 },
            );
        }

        const loginData = await loginResponse.json();

        if (!loginData.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: loginData.error,
                },
                { status: 401 },
            );
        }

        // Store session info and redirect to OAuth authorize URL
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            redirect_url: decodeURIComponent(redirect_uri || "/"),
        });

        // Forward session cookies from OAuth server
        const setCookieHeaders = loginResponse.headers.getSetCookie();
        if (setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie) => {
                // Parse and forward OAuth server cookies
                response.cookies.set(
                    cookie.split("=")[0],
                    cookie.split("=")[1].split(";")[0],
                    {
                        httpOnly: true,
                        secure: false, // Development only
                        sameSite: "lax",
                    },
                );
            });
        }

        return response;
    } catch (error) {
        console.error("OAuth login error:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Server error" },
            },
            { status: 500 },
        );
    }
}
