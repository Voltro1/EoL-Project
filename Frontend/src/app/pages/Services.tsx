import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import {
  Zap,
  Send,
  HelpCircle,
  MessageSquare,
  User,
  Bot,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ContactModal from "../components/ContactModal";
import FeedbackModal from "../components/FeedbackModal";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const quickActions = [
  { id: 1, label: "Extra Help", icon: HelpCircle },
  { id: 2, label: "Feedback", icon: MessageSquare },
];

const botResponses: { [key: string]: string } = {
  hello: "Hello! I'm Voltro, your EDL assistant. How can I help you today?",
  hi: "Hi there! I'm Voltro. What can I assist you with?",
  help: "I can help you with:\n• Bill inquiries\n• Usage information\n• Payment options\n• Report outages\n• General questions\n Be mindful that i am preprogrammed, i can help with basic needs",
  bill: "To view your bills, please visit the Finance tab. You'll find detailed billing history with monthly breakdowns.",
  payment: "We accept payments via OMT, Wish Money, and Cash. Visit the Finance tab > Payment section for detailed instructions.",
  usage: "Your current usage is 8.5 kW out of 12 kW maximum capacity. You can monitor real-time usage on the Home dashboard.",
  outage: "To report a power outage, please provide your area/location while contacting one of our human support staff",
  contact: "For urgent matters or more human help, check out the \"Extra Help\" section",
  default: "I'm here to help! You can ask me about bills, payments, usage, outages, or contact information.",
};

export default function Services() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Voltro ⚡, your EDL virtual assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return botResponses.hello;
    }
    if (lowerMessage.includes("help")) {
      return botResponses.help;
    }
    if (lowerMessage.includes("bill") || lowerMessage.includes("invoice")) {
      return botResponses.bill;
    }
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      return botResponses.payment;
    }
    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      return botResponses.usage;
    }
    if (lowerMessage.includes("outage") || lowerMessage.includes("power")) {
      return botResponses.outage;
    }
    if (lowerMessage.includes("contact") || lowerMessage.includes("phone")) {
      return botResponses.contact;
    }

    return botResponses.default;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    if (action === "Extra Help") {
      setIsContactModalOpen(true);
    } else if (action === "Feedback") {
      setIsFeedbackModalOpen(true);
    }
  };

  const handleFeedbackSubmit = () => {
    setIsFeedbackModalOpen(false);
    setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: "Thank you for your feedback! We appreciate your input and will use it to improve our services.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
      <div className="flex flex-col h-[calc(100vh-190px)] max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex-shrink-0"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Voltro</h1>
                <p className="text-sm text-emerald-100">EDL Virtual Assistant</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => handleQuickAction(action.label)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 w-full justify-start text-xs h-8"
                >
                  <action.icon className="w-3.5 h-3.5 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "bot"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                    }`}
                >
                  {message.sender === "bot" ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] ${message.sender === "user" ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                >
                  <Card
                    className={`p-4 ${message.sender === "bot"
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-yellow-700 dark:text-white"
                      : "bg-emerald-500 text-white border-0"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </Card>
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <Card className="p-4 bg-white dark:bg-gray-800 dark:border-yellow-700">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 h-12"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="h-12 w-12 p-0 bg-emerald-500 hover:bg-emerald-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}