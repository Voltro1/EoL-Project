import { motion } from "motion/react";
import { useState, useContext } from "react";
import { PageContext } from '../contexts/PageContext';
import { useTranslation } from '../hooks/useTranslation';
import {
  DollarSign,
  Wallet,
  Download,
  Check,
  MessageCircle,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FinanceAlerts } from "../components/FinanceAlerts";
import { BillHistory } from "../components/BillHistory";

// Mock billing data
const initialBillingData = [
  {
    id: 5,
    year: 2026,
    month: "March",
    amount: 16500,
    status: "unpaid",
    dueDate: "2026-09-31",
    usage: 220,
  },
  {
    id: 1,
    year: 2026,
    month: "February",
    amount: 15000,
    status: "paid",
    dueDate: "2026-02-28",
    usage: 204,
  },
  {
    id: 2,
    year: 2026,
    month: "January",
    amount: 14200,
    status: "paid",
    dueDate: "2026-01-31",
    usage: 195,
  },
  {
    id: 3,
    year: 2025,
    month: "December",
    amount: 18500,
    status: "paid",
    dueDate: "2025-12-31",
    usage: 245,
  },
  {
    id: 4,
    year: 2025,
    month: "November",
    amount: 12800,
    status: "unpaid",
    dueDate: "2025-11-30",
    usage: 178,
  },
];

const initialPaymentHistory = [
  {
    id: 1,
    date: "2026-02-20",
    amount: 15000,
    method: "OMT",
    status: "completed",
    reference: "OMT-2026-1234",
  },
  {
    id: 2,
    date: "2026-01-25",
    amount: 14200,
    method: "Whish Money",
    status: "completed",
    reference: "WHISH-2026-5678",
  },
  {
    id: 3,
    date: "2025-12-28",
    amount: 18500,
    method: "Cash",
    status: "completed",
    reference: "CASH-2025-9012",
  },
];

export default function Finance() {
  const [activeTab, setActiveTab] = useState("bills");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [bills, setBills] = useState(initialBillingData);
  const [history, setHistory] = useState(initialPaymentHistory);

  const getLateFee = (bill: typeof initialBillingData[0]) => {
    if (bill.status === "paid") return 0;
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    if (today > dueDate) {
      return bill.amount * 0.05;
    }
    return 0;
  };

  const outstandingBase = bills
    .filter(bill => bill.status === "unpaid")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const outstandingLateFees = bills
    .filter(bill => bill.status === "unpaid")
    .reduce((sum, bill) => sum + getLateFee(bill), 0);

  const outstandingAmount = outstandingBase + outstandingLateFees;

  const handlePayment = () => {
    if (!selectedPaymentMethod || outstandingAmount === 0) return;

    setBills(currentBills => 
      currentBills.map(bill => 
        bill.status === "unpaid" ? { ...bill, status: "paid" } : bill
      )
    );

    const methodNames: Record<string, string> = {
      omt: "OMT",
      whish: "Whish Money",
      cash: "Cash"
    };

    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: outstandingAmount,
      method: methodNames[selectedPaymentMethod] || selectedPaymentMethod,
      status: "completed",
      reference: `PAY-${Date.now().toString().slice(-6)}`,
    };

    setHistory(prev => [newPayment, ...prev]);
    setSelectedPaymentMethod(null);
    setActiveTab("history");
  };
  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("EDL Invoice", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, 14, 30);
    doc.text(`User ID: ${sessionStorage.getItem("userId") || "N/A"}`, 14, 36);
    
    const unpaidBills = bills.filter(b => b.status === "unpaid");
    
    if (unpaidBills.length === 0) {
      doc.text("No outstanding bills to pay.", 14, 50);
      doc.save(`Invoice-${Date.now()}.pdf`);
      return;
    }

    const tableData = unpaidBills.map(bill => {
      const lateFee = getLateFee(bill);
      const total = bill.amount + lateFee;
      return [
        `${bill.month} ${bill.year}`,
        `${bill.usage} kWh`,
        bill.dueDate,
        `${bill.amount.toLocaleString()} LBP`,
        lateFee > 0 ? `${lateFee.toLocaleString()} LBP` : "-",
        `${total.toLocaleString()} LBP`
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [['Period', 'Usage', 'Due Date', 'Base Amount', 'Late Fee (5%)', 'Total Due']],
      body: tableData,
      foot: [['', '', '', 'Total Outstanding', '', `${outstandingAmount.toLocaleString()} LBP`]],
    });

    doc.save(`EDL-Invoice-${Date.now()}.pdf`);
  };

  const { currency } = useContext(PageContext);
  const { t } = useTranslation();

  const formatCurrency = (amountInLbp: number) => {
    let convertedAmount = amountInLbp;
    if (currency === 'USD') convertedAmount = amountInLbp / 89500;
    else if (currency === 'EUR') convertedAmount = amountInLbp / 95000;
    
    return `${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: currency === 'LBP' ? 0 : 2 })} ${currency}`;
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Current Balance</p>
                <h2 className="text-3xl font-bold">{formatCurrency(45000)}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Outstanding</p>
              <h3 className="text-2xl font-bold">{formatCurrency(outstandingAmount)}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="alerts" className="relative">
              Alerts
              {bills.some(b => b.status === "unpaid" && new Date() > new Date(b.dueDate)) && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-4">
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={generateInvoice}>
                <Download className="w-4 h-4 mr-2" />
                {t('downloadInvoice')}
              </Button>
            </div>
            
            <BillHistory 
              bills={bills} 
              formatCurrency={formatCurrency} 
              getLateFee={getLateFee} 
            />
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* OMT */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPaymentMethod("omt")}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === "omt"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 dark:border-gray-600">
                      <img src="/assets/omt.png" alt="OMT" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">OMT</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Instant transfer</p>
                  </div>
                </motion.div>

                {/* Wish Money */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPaymentMethod("whish")}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === "whish"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 dark:border-gray-600">
                      <img src="/assets/whish.png" alt="Whish Money" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Whish Money</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mobile payment</p>
                  </div>
                </motion.div>

                {/* Cash */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPaymentMethod("cash")}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === "cash"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/40">
                      <Wallet className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cash</h4>
                  </div>
                </motion.div>
              </div>

              {selectedPaymentMethod && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Payment Instructions
                        </h4>
                        {selectedPaymentMethod === "omt" && (
                          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>1. Open your OMT app or visit any OMT store</p>
                            <p>2. Send to: EDL Account #03-12345</p>
                            <p>3. Enter amount: {formatCurrency(outstandingAmount)}</p>
                            <p>4. Reference: Your User ID</p>
                            <p className="font-semibold mt-2">Contact: +961 1 234 567</p>
                          </div>
                        )}
                        {selectedPaymentMethod === "whish" && (
                          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>1. Open your Whish Money app or visit any Whish Money store</p>
                            <p>2. Send to: EDL Merchant #WM-EDL-001</p>
                            <p>3. Enter amount: {formatCurrency(outstandingAmount)}</p>
                            <p>4. Reference: Your User ID</p>
                            <p className="font-semibold mt-2">Contact: +961 1 234 567</p>
                          </div>
                        )}
                        {selectedPaymentMethod === "cash" && (
                          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>The collector will visit you on Tuesday</p>
                            <p>• Your User ID: {sessionStorage.getItem("userId")}</p>
                            <p>• Amount: {formatCurrency(outstandingAmount)}</p>
                            <p>• Valid ID card</p>
                            <p className="font-semibold mt-2">
                              Visit hours: 8:00 AM - 4:00 PM
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {outstandingAmount > 0 && (
                    <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Payment Breakdown</h4>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Base Amount:</span>
                        <span>{formatCurrency(outstandingBase)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600 dark:text-red-400 mb-2">
                        <span>Late Fees (5%):</span>
                        <span>{formatCurrency(outstandingLateFees)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>Total to Pay:</span>
                        <span>{formatCurrency(outstandingAmount)}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePayment}
                    disabled={outstandingAmount === 0}
                  >
                    {outstandingAmount > 0 ? "Confirm Payment Method" : "No Outstanding Balance"}
                  </Button>
                </motion.div>
              )}
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Payment History
              </h3>

              <div className="space-y-3">
                {history.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {payment.method}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.date}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Ref: {payment.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount).split(' ')[0]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{currency}</p>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                              <Check className="w-3 h-3" />
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <FinanceAlerts 
              bills={bills} 
              onNavigateToPayment={() => setActiveTab("payment")} 
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}