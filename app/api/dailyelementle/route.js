import { getDailyAnswers } from "@/lib/firebase.js";

export async function POST() {
    try {
        const answers = await getDailyAnswers();
        return Response.json({ answer: answers }, { status: 200 });
    } catch (err) {
        console.error("Error in API route:", err);
        return new Response(
            JSON.stringify({ error: err.message || "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
