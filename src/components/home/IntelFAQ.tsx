'use client';

/**
 * IntelFAQ — Design Bible v9.0 FAQ Section
 * Per Blueprint Section 8:
 *   - Centered accordion, max-width 800px
 *   - 6 questions covering core objections
 */

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'q1',
    question: 'What exactly is a Protection Score?',
    answer:
      'Your Protection Score is a comprehensive rating (0-100) that measures how well your family is protected across health, life, motor, and home insurance. It analyzes your existing policies, identifies gaps, compares you to similar families, and provides a personalized improvement plan. Think of it like a credit score — but for your insurance.',
  },
  {
    id: 'q2',
    question: 'Is Paliwal Secure an insurance company?',
    answer:
      'No. We are an insurance intelligence platform. We don\'t create or underwrite insurance policies. We analyze policies from 51+ IRDAI-registered insurers and recommend the optimal coverage for your specific situation. When you purchase a policy, you buy directly from the insurer — we just ensure you buy the right one.',
  },
  {
    id: 'q3',
    question: 'How do you make money if your service is free?',
    answer:
      'We receive a standard brokerage commission from insurers when you purchase a policy through our platform. This doesn\'t increase your premium — you pay the same price whether you buy through us, another broker, or directly from the insurer. The difference is that we use AI to ensure you buy the RIGHT policy, not just any policy.',
  },
  {
    id: 'q4',
    question: 'Is my data safe with you?',
    answer:
      'Absolutely. We are fully compliant with India\'s Digital Personal Data Protection Act (DPDP) 2023. Your data is encrypted using bank-level AES-256 encryption. We never sell your data to third parties. We never share your information without explicit consent. And you can request complete data deletion at any time.',
  },
  {
    id: 'q5',
    question: 'What happens when I need to file a claim?',
    answer:
      'This is where Paliwal Secure truly differs. Our Claim Intelligence system guides you through every step: document preparation, filing process, follow-up reminders, and status tracking. If your claim is unfairly rejected, our advisors help you appeal. We\'re with you from purchase to payout.',
  },
  {
    id: 'q6',
    question: 'How long does it take to get my Protection Score?',
    answer:
      'Most users complete the analysis in 2-3 minutes. You\'ll answer a few questions about your existing policies, family situation, and assets. Our AI then analyzes your coverage against millions of data points to generate your score and personalized recommendations.',
  },
];

export default function IntelFAQ() {
  const [openId, setOpenId] = useState<string | null>('q1');

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section className="intel-section intel-bg-surface-dark">
      <div className="intel-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <div className="intel-label">QUESTIONS ANSWERED</div>
          <h2 className="intel-headline intel-headline-h1">
            Everything You Need to{' '}
            <span style={{ color: 'var(--color-intel-gold)' }}>Know</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] mx-auto"
        >
          {FAQS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="intel-faq-item">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="intel-faq-question w-full text-left"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <Plus
                    className="w-5 h-5 shrink-0 transition-transform duration-300"
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                      color: isOpen
                        ? 'var(--color-intel-gold)'
                        : 'var(--color-intel-gold)',
                    }}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="intel-faq-answer">{item.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
