"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadFileToS3 } from "@/lib/upload-client";

function parsePosition(position: string): { x: number; y: number } {
  const [x, y] = position
    .split(" ")
    .map((part) => parseFloat(part.replace("%", "")))
    .filter((n) => !Number.isNaN(n));
  return { x: x ?? 50, y: y ?? 50 };
}

export function CoverImageField({
  initialUrl,
  initialPosition,
}: {
  initialUrl: string | null;
  initialPosition: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [position, setPosition] = useState(() => parsePosition(initialPosition));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadFileToS3(file);
      setUrl(publicUrl);
      setPosition({ x: 50, y: 50 });
    } catch {
      setError("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  function handlePreviewClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setPosition({ x: Math.round(x), y: Math.round(y) });
  }

  const objectPosition = `${position.x}% ${position.y}%`;

  return (
    <div>
      <input type="hidden" name="fotoCapaUrl" value={url} />
      <input type="hidden" name="fotoCapaPosicao" value={objectPosition} />

      {url && (
        <div className="mb-3">
          <div
            ref={previewRef}
            onClick={handlePreviewClick}
            className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-md bg-neutral-100"
            title="Clique para escolher o ponto central da foto"
          >
            <Image
              src={url}
              alt="Foto de capa"
              fill
              sizes="400px"
              className="object-cover"
              style={{ objectPosition }}
            />
            <div
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rose-500/80 shadow"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Clique na foto para escolher o que fica centralizado no site.
          </p>
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
