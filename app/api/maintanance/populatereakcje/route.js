import { populateReakcje } from "@/lib/firebase";

export async function POST() {
    try{
        await populateReakcje();
        return Response.json({ message: "success" }, { status: 200 });
    }catch (err) {
        console.error("Error in API route:", err);
        return new Response(
          JSON.stringify({ error: err.message || "Internal Server Error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
}