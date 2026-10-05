import { APIError } from "better-auth/api";

const messages: Record<string, string> = {
  USER_ALREADY_EXISTS: "Ese mail ya tiene cuenta. ¿Querés ingresar?",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ese mail ya tiene cuenta. ¿Querés ingresar?",
  INVALID_EMAIL_OR_PASSWORD: "Ese mail y esa contraseña no se conocen. ¿Probás de nuevo?",
};

const fallback = "Algo anda mal. Probá de nuevo en un ratito.";

export function authErrorMessage(error: unknown) {
  if (error instanceof APIError) return messages[error.body?.code ?? ""] ?? fallback;
  return fallback;
}
