export const ROLE_LABEL: Record<string, string> = {
  GENERAL_LEADER: "Líder Geral",
  NUCLEUS_LEADER: "Liderança de Núcleo",
  CELL_LEADER: "Liderança",
  SERVANT: "Servo",
};

export const LEADER_ROLES = ["GENERAL_LEADER", "NUCLEUS_LEADER", "CELL_LEADER"];

export function isLeader(role?: string | null): boolean {
  return !!role && LEADER_ROLES.includes(role);
}

export function roleLabel(role?: string | null): string {
  return (role && ROLE_LABEL[role]) || "Servo";
}
