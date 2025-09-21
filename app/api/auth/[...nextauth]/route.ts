import { handlers } from "@/lib/auth/auth";
import { NextRequest } from "next/server";

async function GET(request: NextRequest) {
    console.log("=== NEXTAUTH GET HANDLER ===");
    console.log("URL:", request.url);
    console.log("Method:", request.method);
    console.log("Headers:", Object.fromEntries(request.headers.entries()));

    // Extract URL parts for debugging
    const url = new URL(request.url);
    console.log("Path:", url.pathname);
    console.log(
        "Search params:",
        Object.fromEntries(url.searchParams.entries()),
    );

    try {
        const response = await handlers.GET(request);
        console.log("Response status:", response.status);
        console.log(
            "Response headers:",
            Object.fromEntries(response.headers.entries()),
        );

        // Log redirect location if it's a redirect
        if (response.status >= 300 && response.status < 400) {
            console.log("REDIRECT TO:", response.headers.get("location"));
        }

        console.log("=============================");
        return response;
    } catch (error) {
        console.error("=== NEXTAUTH GET ERROR ===");
        console.error("Error:", error);
        console.error("===========================");
        throw error;
    }
}

async function POST(request: NextRequest) {
    console.log("=== NEXTAUTH POST HANDLER ===");
    console.log("URL:", request.url);
    console.log("Method:", request.method);
    const response = await handlers.POST(request);
    console.log("Response status:", response.status);
    console.log("==============================");
    return response;
}

export { GET, POST };
