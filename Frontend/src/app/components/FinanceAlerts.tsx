import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "./ui/alert-dialog";

// Type based on Finance.tsx bills
type Bill = {
  id: number;
  year: number;
  month: string;
  amount: number;
  status: string;
  dueDate: string;
  usage: number;
};

interface FinanceAlertsProps {
  bills: Bill[];
  onNavigateToPayment: () => void;
}

export function FinanceAlerts({ bills, onNavigateToPayment }: FinanceAlertsProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  
  const [showAnnoyingPopup, setShowAnnoyingPopup] = useState(false);

  // Check for overdue bills
  const overdueBills = bills.filter((bill) => {
    if (bill.status === "paid") return false;
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    return today > dueDate;
  });

  useEffect(() => {
    // If there are overdue bills, trigger the annoying popup
    if (overdueBills.length > 0) {
      // Small timeout to ensure it appears after mount seamlessly
      const timer = setTimeout(() => {
        setShowAnnoyingPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [overdueBills.length]);

  return (
    <div className="space-y-6">
      {/* Alert Preferences */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Alert Preferences</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Alerts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive bills and overdue notices via email</p>
              </div>
            </div>
            <Switch
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">SMS Alerts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get text messages for critical overdue bills</p>
              </div>
            </div>
            <Switch
              checked={smsAlerts}
              onCheckedChange={setSmsAlerts}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">In-App Push</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={pushAlerts}
              onCheckedChange={setPushAlerts}
            />
          </div>
        </div>
      </Card>

      {/* Active Alerts List */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Alerts</h3>
        
        {overdueBills.length > 0 ? (
          <div className="space-y-3">
            {overdueBills.map((bill, i) => (
              <motion.div
                key={`alert-${bill.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-900 dark:text-red-100">
                    Overdue Bill: {bill.month} {bill.year}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Your bill of {bill.amount.toLocaleString()} LBP was due on {bill.dueDate}. 
                    A 5% late fee has been applied. Please pay immediately to avoid further action.
                  </p>
                </div>
                <button 
                  onClick={onNavigateToPayment}
                  className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 whitespace-nowrap"
                >
                  Pay Now
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BellRing className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">You have no active alerts.</p>
          </div>
        )}
      </Card>

      {/* The Annoying Popup */}
      <AlertDialog open={showAnnoyingPopup} onOpenChange={setShowAnnoyingPopup}>
        <AlertDialogContent className="border-red-200 dark:border-red-900 shadow-xl shadow-red-900/10 dark:bg-gray-900">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl text-red-600 dark:text-red-500">
              URGENT: Overdue Payments Detected!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base mt-2 dark:text-gray-300">
              You have {overdueBills.length} unpaid bill(s) that are past their due date. 
              Late fees are accumulating. Ignoring this will result in service disruption.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-6">
            <AlertDialogAction 
              onClick={() => {
                setShowAnnoyingPopup(false);
                onNavigateToPayment();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Resolve Now
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => setShowAnnoyingPopup(false)}
              className="w-full bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border-none shadow-none"
            >
              I will pay later (Not Recommended)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
