export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "analyst" | "viewer";
  status: "active" | "inactive" | "suspended";
  lastActive: string;
  transactions: number;
  initials: string;
}

export const USERS: User[] = [
  { id: "USR-001", name: "Sarah Chen", email: "sarah@apex.io", role: "admin", status: "active", lastActive: "2 min ago", transactions: 342, initials: "SC" },
  { id: "USR-002", name: "Marcus Johnson", email: "marcus@apex.io", role: "manager", status: "active", lastActive: "15 min ago", transactions: 218, initials: "MJ" },
  { id: "USR-003", name: "Elena Kowalski", email: "elena@apex.io", role: "analyst", status: "active", lastActive: "1 hr ago", transactions: 156, initials: "EK" },
  { id: "USR-004", name: "David Park", email: "david@apex.io", role: "viewer", status: "inactive", lastActive: "3 days ago", transactions: 42, initials: "DP" },
  { id: "USR-005", name: "Aisha Rahman", email: "aisha@apex.io", role: "manager", status: "active", lastActive: "30 min ago", transactions: 289, initials: "AR" },
  { id: "USR-006", name: "Tom Bradley", email: "tom@apex.io", role: "analyst", status: "suspended", lastActive: "2 weeks ago", transactions: 87, initials: "TB" },
  { id: "USR-007", name: "Lisa Wang", email: "lisa@apex.io", role: "admin", status: "active", lastActive: "Just now", transactions: 512, initials: "LW" },
  { id: "USR-008", name: "James Okonjo", email: "james@apex.io", role: "viewer", status: "active", lastActive: "5 hrs ago", transactions: 23, initials: "JO" },
  { id: "USR-009", name: "Priya Sharma", email: "priya@apex.io", role: "analyst", status: "active", lastActive: "45 min ago", transactions: 178, initials: "PS" },
  { id: "USR-010", name: "Robert Fischer", email: "robert@apex.io", role: "manager", status: "inactive", lastActive: "1 week ago", transactions: 134, initials: "RF" },
];
