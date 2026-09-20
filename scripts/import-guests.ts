import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type GuestSeed = {
  nome: string;
  grupo: string;
  acompanhantes?: string[];
};

const dataPath = path.join(__dirname, "guests-data.json");

let guests: GuestSeed[];
try {
  guests = JSON.parse(readFileSync(dataPath, "utf-8"));
} catch {
  throw new Error(
    `Não encontrei ${dataPath}. Esse arquivo tem os dados reais dos convidados e não fica no controle de versão ` +
      `(veja scripts/guests-data.example.json para o formato esperado) — copie-o manualmente para o servidor antes de rodar este script.`
  );
}

async function main() {
  let totalPessoas = 0;

  for (const guest of guests) {
    await prisma.guest.create({
      data: {
        nome: guest.nome,
        grupo: guest.grupo,
        acompanhantes: guest.acompanhantes ?? [],
      },
    });
    totalPessoas += 1 + (guest.acompanhantes?.length ?? 0);
  }

  console.log(`Importados ${guests.length} convites (${totalPessoas} pessoas no total).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
