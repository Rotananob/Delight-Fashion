export const ADMIN_EMAILS = [
  "rothvloger@gmail.com",
  "xflowstudio5@gmail.com",
  "nobrothana180703@gmail.com",
  "rotananob@gmail.com",
  "owner@delightfashion.com.kh",
  "delightfashionkh@gmail.com",
];

export function isUserAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  if (ADMIN_EMAILS.some((admin) => clean === admin.toLowerCase().trim())) return true;
  if (clean.includes("admin") || clean.includes("owner") || clean.includes("delight") || clean.includes("rotana")) return true;
  return false;
}
