import { populatePierwiastki } from "@/lib/firebase";

export async function POST() {
    await populatePierwiastki();
}
