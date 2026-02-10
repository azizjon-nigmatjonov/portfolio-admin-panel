export const KPIS = [
  { title: "Total Revenue", value: "$2,847,392", change: "+12.5%", trend: "up" as const, icon: "DollarSign", period: "vs last month" },
  { title: "Active Users", value: "18,492", change: "+8.2%", trend: "up" as const, icon: "Users", period: "vs last month" },
  { title: "Transactions", value: "142,857", change: "+23.1%", trend: "up" as const, icon: "ArrowLeftRight", period: "vs last month" },
  { title: "Avg. Balance", value: "$4,231", change: "-2.4%", trend: "down" as const, icon: "Wallet", period: "vs last month" },
];

export const REVENUE_CHART_DATA = [
  { month: "Jan", revenue: 186000, expenses: 120000 },
  { month: "Feb", revenue: 205000, expenses: 135000 },
  { month: "Mar", revenue: 237000, expenses: 128000 },
  { month: "Apr", revenue: 273000, expenses: 142000 },
  { month: "May", revenue: 209000, expenses: 131000 },
  { month: "Jun", revenue: 314000, expenses: 149000 },
  { month: "Jul", revenue: 286000, expenses: 156000 },
  { month: "Aug", revenue: 342000, expenses: 161000 },
  { month: "Sep", revenue: 298000, expenses: 148000 },
  { month: "Oct", revenue: 376000, expenses: 172000 },
  { month: "Nov", revenue: 321000, expenses: 159000 },
  { month: "Dec", revenue: 398000, expenses: 183000 },
];

export const ACTIVITY_CHART_DATA = [
  { day: "Mon", transactions: 1420, volume: 284000 },
  { day: "Tue", transactions: 1620, volume: 312000 },
  { day: "Wed", transactions: 1890, volume: 356000 },
  { day: "Thu", transactions: 1780, volume: 328000 },
  { day: "Fri", transactions: 2100, volume: 412000 },
  { day: "Sat", transactions: 980, volume: 184000 },
  { day: "Sun", transactions: 720, volume: 132000 },
];

export const RECENT_TRANSACTIONS = [
  { id: "TXN-8294", description: "Wire Transfer to Acme Corp", amount: "-$24,500.00", type: "outgoing" as const, status: "completed" as const, time: "2 min ago" },
  { id: "TXN-8293", description: "Payment from GlobalTech", amount: "+$18,750.00", type: "incoming" as const, status: "completed" as const, time: "15 min ago" },
  { id: "TXN-8292", description: "Subscription - Cloud Services", amount: "-$2,499.00", type: "outgoing" as const, status: "pending" as const, time: "1 hr ago" },
  { id: "TXN-8291", description: "Payment from Sterling Ltd", amount: "+$42,100.00", type: "incoming" as const, status: "completed" as const, time: "2 hrs ago" },
  { id: "TXN-8290", description: "Refund - Office Supplies", amount: "+$389.00", type: "incoming" as const, status: "completed" as const, time: "3 hrs ago" },
  { id: "TXN-8289", description: "International Transfer", amount: "-$8,200.00", type: "outgoing" as const, status: "failed" as const, time: "5 hrs ago" },
];
