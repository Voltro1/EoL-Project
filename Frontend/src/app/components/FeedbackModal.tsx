import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Send } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
    const [feedback, setFeedback] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;
        setFeedback("");
        onSubmit();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md"
                    >
                        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 shadow-2xl">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feedback</h2>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Share your thoughts with Voltro</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            How can we improve?
                                        </p>
                                        <Input
                                            autoFocus
                                            placeholder="Write your feedback here..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12"
                                        disabled={!feedback.trim()}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Feedback
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}