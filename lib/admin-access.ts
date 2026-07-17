export function isAdminEmail(
  email: string | null | undefined,
): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = (
    process.env.ADMIN_EMAILS ?? ""
  )
    .split(",")
    .map((adminEmail) =>
      adminEmail.trim().toLowerCase(),
    )
    .filter(Boolean);

  return adminEmails.includes(
    email.trim().toLowerCase(),
  );
}