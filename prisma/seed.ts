import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  await prisma.eventInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nomeNoivo: "Nome do Noivo",
      nomeNoiva: "Nome da Noiva",
      dataCasamento: new Date("2027-06-12T18:00:00"),
      historia: "Conte aqui a história do casal. Edite este texto no painel admin.",
      cerimoniaLocal: "Nome da igreja/espaço",
      cerimoniaEndereco: "Endereço da cerimônia",
      cerimoniaHorario: "18:00",
      recepcaoLocal: "Nome do espaço de recepção",
      recepcaoEndereco: "Endereço da recepção",
      recepcaoHorario: "20:00",
      galeriaUrls: [],
    },
  });

  console.log(`Usuário admin pronto: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
