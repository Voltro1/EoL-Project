import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Contact Support
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-5">
                  {/* Emergency Hotline */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        24/7 Hotline
                      </h3>
                      <a
                        href="tel:+9611234567"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        +961 1 234 567
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        For urgent power outages
                      </p>
                    </div>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Email Support
                      </h3>
                      <a
                        href="mailto:support@edl.gov.lb"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        support@edl.gov.lb
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Response within 24-48 hours
                      </p>
                    </div>
                  </div>

                  {/* Office Location */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Main Office
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        EDL Headquarters, Beirut
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Mar Mikhael District
                      </p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Office Hours
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Monday - Friday
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    For billing inquiries, please use the chatbot or visit the
                    Finance section
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
