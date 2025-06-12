import { writeFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const letzterPath = path.join(process.cwd(), "public", "crs", "sample_letzter_stand.json");
  const aktuellPath = path.join(process.cwd(), "public", "crs", "sample_aktueller_stand.json");

  try {
    // Backup zuerst
    writeFileSync(letzterPath, JSON.stringify(body, null, 2));
  } catch (err) {
    return NextResponse.json({
      success: false,
      step: "writing sample_letzter_stand.json",
      error: err.message
    }, { status: 500 });
  }

  try {
    // Dann aktueller Stand
    writeFileSync(aktuellPath, JSON.stringify(body, null, 2));
  } catch (err) {
    return NextResponse.json({
      success: false,
      step: "writing sample_aktueller_stand.json",
      error: err.message
    }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
