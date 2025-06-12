import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "crs", "sample_aktueller_stand.json");
  const data = readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}
