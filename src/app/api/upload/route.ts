import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createPresignedUploadUrl } from "@/lib/s3";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_NAME_LENGTH = 200;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fileName = typeof body?.fileName === "string" ? body.fileName : "";
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";

  if (!fileName || fileName.length > MAX_FILE_NAME_LENGTH || !ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Arquivo inválido. Envie JPEG, PNG ou WEBP." }, { status: 400 });
  }

  const { uploadUrl, publicUrl } = await createPresignedUploadUrl(fileName, contentType);

  return NextResponse.json({ uploadUrl, publicUrl });
}
