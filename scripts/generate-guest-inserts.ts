import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type GuestSeed = {
  nome: string;
  grupo: string;
  acompanhantes?: string[];
};

const dataPath = path.join(__dirname, "guests-data.json");
const outPath = path.join(__dirname, "guests-insert.sql");

let guests: GuestSeed[];
try {
  guests = JSON.parse(readFileSync(dataPath, "utf-8"));
} catch {
  throw new Error(
    `Não encontrei ${dataPath}. Esse arquivo tem os dados reais dos convidados e não fica no controle de versão ` +
      `(veja scripts/guests-data.example.json para o formato esperado).`
  );
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlTextArray(values: string[]): string {
  if (values.length === 0) return "ARRAY[]::text[]";
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

const lines: string[] = [
  "-- Gerado por scripts/generate-guest-inserts.ts a partir de scripts/guests-data.json.",
  "-- NÃO versionar este arquivo (contém dados reais de convidados) — rode direto no banco de produção e descarte.",
  "",
  'CREATE EXTENSION IF NOT EXISTS pgcrypto;',
  "",
  "BEGIN;",
  "",
];

for (const guest of guests) {
  const acompanhantes = sqlTextArray(guest.acompanhantes ?? []);
  lines.push(
    `INSERT INTO "Guest" (id, "codigoConvite", nome, grupo, acompanhantes, "acompanhantesConfirmados", status, "createdAt", "updatedAt")`,
    `VALUES (gen_random_uuid()::text, gen_random_uuid()::text, ${sqlString(guest.nome)}, ${sqlString(guest.grupo)}, ${acompanhantes}, ARRAY[]::text[], 'PENDENTE', now(), now());`,
    ""
  );
}

lines.push("COMMIT;", "");

writeFileSync(outPath, lines.join("\n"), "utf-8");

const totalPessoas = guests.reduce((acc, g) => acc + 1 + (g.acompanhantes?.length ?? 0), 0);
console.log(`Gerado ${outPath} com ${guests.length} convites (${totalPessoas} pessoas no total).`);
