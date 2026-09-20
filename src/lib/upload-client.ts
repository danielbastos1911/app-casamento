"use client";

export async function uploadFileToS3(file: File): Promise<string> {
  const presignRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  });

  if (!presignRes.ok) {
    throw new Error("Não foi possível preparar o upload.");
  }

  const { uploadUrl, publicUrl } = (await presignRes.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Falha ao enviar a imagem para o storage.");
  }

  return publicUrl;
}
