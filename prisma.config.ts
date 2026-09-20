import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // O CLI (migrate/studio) precisa de conexão direta; o app em runtime usa DATABASE_URL
    // (pode ser uma connection string com pooler, ex: Neon).
    url: env("DIRECT_URL"),
  },
});
