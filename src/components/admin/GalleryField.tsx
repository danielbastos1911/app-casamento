"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFileToS3 } from "@/lib/upload-client";

export function GalleryField({ initialUrls }: { initialUrls: string[] }) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(files.map(uploadFileToS3));
      setUrls((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Falha ao enviar uma ou mais imagens. Tente novamente.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div>
      {urls.map((url) => (
        <input key={url} type="hidden" name="galeriaUrls" value={url} />
      ))}

      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {urls.map((url) => (
            <div key={url} className="group relative h-24 overflow-hidden rounded-md bg-neutral-100">
              <Image src={url} alt="Foto da galeria" fill sizes="150px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute right-1 top-1 hidden rounded bg-black/60 px-1.5 text-xs text-white group-hover:block"
              >
                remover
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-rose-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-rose-700 hover:file:bg-rose-100"
      />
      {uploading && <p className="mt-1 text-xs text-neutral-500">Enviando...</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
