export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Large Transaction Alert", message: "Wire transfer of $156,000 to Internal (Payroll) has been processed successfully.", type: "warning", time: "5 min ago", read: false },
  { id: "2", title: "Failed Transaction", message: "International transfer of $8,200 to Nexus GmbH has failed. Insufficient routing details.", type: "error", time: "2 hrs ago", read: false },
  { id: "3", title: "New User Added", message: 'James Okonjo (james@apex.io) has been added to the team with "Viewer" role.', type: "info", time: "5 hrs ago", read: false },
  { id: "4", title: "Monthly Report Ready", message: "Your January 2026 financial report has been generated and is ready for download.", type: "success", time: "1 day ago", read: true },
  { id: "5", title: "Compliance Review Required", message: "Quarterly KYC/AML compliance review is due by February 15, 2026. Please review flagged accounts.", type: "warning", time: "2 days ago", read: true },
  { id: "6", title: "API Rate Limit Warning", message: "Payment gateway API usage is at 85% of the monthly quota. Consider upgrading your plan.", type: "warning", time: "3 days ago", read: true },
  { id: "7", title: "System Update Complete", message: "Platform has been updated to v3.8.2 with improved transaction processing speeds.", type: "success", time: "4 days ago", read: true },
  { id: "8", title: "User Suspended", message: "Tom Bradley (tom@apex.io) has been automatically suspended due to suspicious activity.", type: "error", time: "2 weeks ago", read: true },
];
