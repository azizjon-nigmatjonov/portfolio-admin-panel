export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "incoming" | "outgoing";
  status: "completed" | "pending" | "failed";
  category: string;
  date: string;
  counterparty: string;
}

export const TRANSACTIONS: Transaction[] = [
  { id: "TXN-8294", description: "Wire Transfer", amount: 24500, type: "outgoing", status: "completed", category: "Transfer", date: "2026-02-09", counterparty: "Acme Corp" },
  { id: "TXN-8293", description: "Invoice Payment", amount: 18750, type: "incoming", status: "completed", category: "Payment", date: "2026-02-09", counterparty: "GlobalTech" },
  { id: "TXN-8292", description: "Cloud Services", amount: 2499, type: "outgoing", status: "pending", category: "Subscription", date: "2026-02-08", counterparty: "AWS" },
  { id: "TXN-8291", description: "Client Payment", amount: 42100, type: "incoming", status: "completed", category: "Payment", date: "2026-02-08", counterparty: "Sterling Ltd" },
  { id: "TXN-8290", description: "Office Supplies Refund", amount: 389, type: "incoming", status: "completed", category: "Refund", date: "2026-02-08", counterparty: "OfficeMax" },
  { id: "TXN-8289", description: "International Transfer", amount: 8200, type: "outgoing", status: "failed", category: "Transfer", date: "2026-02-07", counterparty: "Nexus GmbH" },
  { id: "TXN-8288", description: "Payroll Disbursement", amount: 156000, type: "outgoing", status: "completed", category: "Payroll", date: "2026-02-07", counterparty: "Internal" },
  { id: "TXN-8287", description: "Licensing Revenue", amount: 34200, type: "incoming", status: "completed", category: "Revenue", date: "2026-02-06", counterparty: "TechStart Inc" },
  { id: "TXN-8286", description: "Equipment Lease", amount: 4800, type: "outgoing", status: "completed", category: "Lease", date: "2026-02-06", counterparty: "FleetCo" },
  { id: "TXN-8285", description: "Consulting Fee", amount: 12500, type: "incoming", status: "pending", category: "Revenue", date: "2026-02-05", counterparty: "Orion Capital" },
  { id: "TXN-8284", description: "Marketing Campaign", amount: 7800, type: "outgoing", status: "completed", category: "Marketing", date: "2026-02-05", counterparty: "AdVantage" },
  { id: "TXN-8283", description: "Software License", amount: 1200, type: "outgoing", status: "completed", category: "Subscription", date: "2026-02-04", counterparty: "Figma" },
  { id: "TXN-8282", description: "Partner Commission", amount: 9400, type: "incoming", status: "completed", category: "Revenue", date: "2026-02-04", counterparty: "DataBridge" },
  { id: "TXN-8281", description: "Insurance Premium", amount: 3200, type: "outgoing", status: "completed", category: "Insurance", date: "2026-02-03", counterparty: "SecureShield" },
  { id: "TXN-8280", description: "API Usage Fee", amount: 650, type: "outgoing", status: "pending", category: "Subscription", date: "2026-02-03", counterparty: "Stripe" },
];
