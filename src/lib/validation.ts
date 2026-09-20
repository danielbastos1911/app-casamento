import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Informe um e-mail válido." }),
  password: z.string().min(1, { message: "Informe a senha." }),
});

export const eventInfoSchema = z.object({
  nomeNoivo: z.string().trim().min(1, "Obrigatório"),
  nomeNoiva: z.string().trim().min(1, "Obrigatório"),
  dataCasamento: z.string().trim().min(1, "Obrigatório"),
  historia: z.string().trim().min(1, "Obrigatório"),
  cerimoniaLocal: z.string().trim().min(1, "Obrigatório"),
  cerimoniaEndereco: z.string().trim().min(1, "Obrigatório"),
  cerimoniaHorario: z.string().trim().min(1, "Obrigatório"),
  recepcaoLocal: z.string().trim().min(1, "Obrigatório"),
  recepcaoEndereco: z.string().trim().min(1, "Obrigatório"),
  recepcaoHorario: z.string().trim().min(1, "Obrigatório"),
  fotoCapaUrl: z.string().trim().optional(),
  fotoCapaPosicao: z
    .string()
    .trim()
    .regex(/^\d{1,3}% \d{1,3}%$/, "Posição inválida")
    .optional(),
});

export const guestSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do convidado."),
  grupo: z.string().trim().optional(),
  telefone: z.string().trim().optional(),
  email: z.string().trim().email("E-mail inválido.").optional().or(z.literal("")),
  acompanhantes: z.array(z.string().trim().min(1)).max(15).optional(),
});

export const rsvpSchema = z.object({
  status: z.enum(["CONFIRMADO", "RECUSADO"]),
  acompanhantesConfirmados: z.array(z.string()).optional(),
  restricaoAlimentar: z.string().trim().optional(),
  mensagem: z.string().trim().optional(),
});

export const giftSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do presente."),
  descricao: z.string().trim().min(1, "Informe uma descrição."),
  imagemUrl: z.string().trim().optional(),
  valor: z.coerce.number().positive("O valor deve ser maior que zero."),
});

export const purchaseSchema = z.object({
  nomeComprador: z.string().trim().min(1, "Informe seu nome."),
  mensagem: z.string().trim().optional(),
});
