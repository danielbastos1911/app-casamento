"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFileToS3 } from "@/lib/upload-client";

export function GiftImageField({ initialUrl }: { initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadFileToS3(file);
      setUrl(publicUrl);
    } catch {
      setError("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="imagemUrl" value={url} />
      {url && (
        <div className="relative mb-3 h-40 w-40 overflow-hidden rounded-md bg-neutral-100">
          <Image src={url} alt="Foto do presente" fill sizes="160px" className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-rose-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-rose-700 hover:file:bg-rose-100"
      />
      {uploading && <p className="mt-1 text-xs text-neutral-500">Enviando...</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
