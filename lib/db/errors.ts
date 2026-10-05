function errorCode(error: unknown): unknown {
  if (typeof error !== "object" || error === null) return undefined;
  if ("code" in error) return error.code;
  return "cause" in error ? errorCode(error.cause) : undefined;
}

export function isUniqueViolation(error: unknown) {
  return errorCode(error) === "23505";
}
