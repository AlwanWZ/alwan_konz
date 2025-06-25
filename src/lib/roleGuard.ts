export function checkRole(allowedRoles: string[]): boolean {
  if (typeof window === "undefined") return false;
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  const user = JSON.parse(userStr);
  return allowedRoles.includes(user.role);
}