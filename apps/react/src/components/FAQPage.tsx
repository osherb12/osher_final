import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Truck, RefreshCcw, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      icon: <Truck size={24} className="text-primary" />,
      question: "How long is the processing and shipping time?",
      answer: "We typically process and dispatch all orders within 24-48 hours. Standard global shipping usually takes 5-10 business days, depending on your location."
    },
    {
      icon: <RefreshCcw size={24} className="text-accent" />,
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return policy for items in their original, pristine condition. Simply reach out to our support team to initiate an exchange or refund process."
    },
    {
      icon: <ShieldCheck size={24} className="text-secondary" />,
      question: "How secure is the checkout and data storage?",
      answer: "We employ industry-standard encryption protocols. Your data is handled with the utmost care and your payment information is never stored directly on our servers."
    },
    {
      icon: <HelpCircle size={24} className="text-primary" />,
      question: "Do you offer international shipping?",
      answer: "Yes, Oshopper ships to most major international regions. If your location is not available at checkout, please contact us directly for a custom quote."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1000px] mx-auto p-4 md:p-12"
    >
      <div className="text-center mb-24">
        <h1 className="text-6xl font-black text-white mb-6 tracking-tight">Support Center</h1>
        <p className="text-xl text-dracula-comment max-w-2xl mx-auto leading-relaxed font-medium">
          Find answers to common questions about our products, shipping, and security.
        </p>
      </div>

      <div className="grid gap-10">
        {faqs.map((faq, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl group hover:border-primary/20 transition-all"
          >
            <div className="flex items-start gap-8">
              <div className="bg-dracula-bg p-4 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                {faq.icon}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{faq.question}</h3>
                <p className="text-dracula-comment leading-relaxed text-lg">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 p-16 bg-primary/10 rounded-[60px] border border-primary/20 text-center relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 bg-primary/20 w-40 h-40 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all"></div>
        <Mail className="text-primary mx-auto mb-8 animate-bounce" size={48} />
        <h2 className="text-3xl font-black text-white mb-6">Still Need Assistance?</h2>
        <p className="text-dracula-comment text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          If your question isn't listed here, our support artisans are standing by to provide personalized help.
        </p>
        <button className="bg-primary text-dracula-bg px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs mx-auto hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          Open Support Ticket
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};
