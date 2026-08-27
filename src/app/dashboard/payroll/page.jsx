import React from "react";
import PayrollView from "@/views/admin/payroll/PayrollView";

export const metadata = {
  title: "Payroll Management | Hotel Management System",
  description: "Manage monthly staff payroll, salary slips, allowances, deductions, and disbursals.",
};

export default function DashboardPayrollPage() {
  return <PayrollView />;
}
