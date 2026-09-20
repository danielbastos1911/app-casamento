import type { NextConfig } from "next";

const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const nextConfig: NextConfig = {
  output: "standalone",
  // Permite acessar o servidor de dev via túnel (ngrok) para testar back_urls/webhooks do Mercado Pago com HTTPS.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
    },
  },
  images: {
    remotePatterns:
      bucket && region
        ? [
            {
              protocol: "https",
              hostname: `${bucket}.s3.${region}.amazonaws.com`,
            },
          ]
        : [],
  },
};

export default nextConfig;
