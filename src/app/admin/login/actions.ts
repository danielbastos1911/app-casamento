"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Preencha e-mail e senha corretamente." };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !isValid) {
    return { error: "E-mail ou senha inválidos." };
  }

  await setSessionCookie(user.id, user.email);
  redirect("/admin");
}
