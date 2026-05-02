import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Zap
} from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

type Bill = {
  id: number;
  year: number;
  month: string;
  amount: number;
  status: string;
  dueDate: string;
  usage: number;
};

interface BillHistoryProps {
  bills: Bill[];
  formatCurrency: (amount: number) => string;
  getLateFee: (bill: Bill) => number;
}

export function BillHistory({ bills, formatCurrency, getLateFee }: BillHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid" | "Overdue">("All");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Filter and sort bills
  const filteredBills = bills
    .filter((bill) => {
      // 1. Apply Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        bill.month.toLowerCase().includes(searchLower) ||
        bill.year.toString().includes(searchLower) ||
        bill.amount.toString().includes(searchLower);

      if (!matchesSearch) return false;

      // 2. Apply Category Filter
      const isOverdue = bill.status === "unpaid" && new Date() > new Date(bill.dueDate);
      
      if (filter === "Paid") return bill.status === "paid";
      if (filter === "Unpaid") return bill.status === "unpaid";
      if (filter === "Overdue") return isOverdue;
      return true; // "All"
    })
    .sort((a, b) => {
      // Sort by date descending (rough sort by year then month)
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateB - dateA;
    });

  const getStatusDisplay = (bill: Bill) => {
    if (bill.status === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Paid
        </span>
      );
    }
    
    const isOverdue = new Date() > new Date(bill.dueDate);
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium">
        <XCircle className="w-3.5 h-3.5" />
        Unpaid
      </span>
    );
  };

  return (
    <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white flex-1 text-lg">
          Bill History
        </h3>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search month, year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-gray-900"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {(["All", "Paid", "Unpaid", "Overdue"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === f
                  ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bill List */}
      <div className="space-y-3">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill, index) => (
            <motion.button
              key={bill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedBill(bill)}
              className="w-full text-left group p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      {bill.month} {bill.year}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                      {bill.usage} kWh usage
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(bill.amount + getLateFee(bill))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Due: {bill.dueDate}
                    </p>
                  </div>
                  <div className="w-24 flex justify-end">
                    {getStatusDisplay(bill)}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No bills found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Bill Detail Modal */}
      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        {selectedBill && (
          <DialogContent className="sm:max-w-md dark:bg-gray-900">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    {selectedBill.month} {selectedBill.year} Bill
                  </DialogTitle>
                  <DialogDescription>
                    Statement details and usage history
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Status</span>
                {getStatusDisplay(selectedBill)}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Charges Breakdown
                </h4>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Base Energy Charge</span>
                  <span>{formatCurrency(selectedBill.amount)}</span>
                </div>
                {getLateFee(selectedBill) > 0 && (
                  <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                    <span>Late Payment Fee (5%)</span>
                    <span>{formatCurrency(getLateFee(selectedBill))}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Amount Due</span>
                  <span>{formatCurrency(selectedBill.amount + getLateFee(selectedBill))}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Usage Information
                </h4>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Total Consumption</span>
                  <span>{selectedBill.usage} kWh</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Due Date</span>
                  <span>{selectedBill.dueDate}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBill(null)}
                  className="w-full sm:w-auto"
                >
                  Close Details
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}
