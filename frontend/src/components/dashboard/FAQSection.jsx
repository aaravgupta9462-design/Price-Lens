import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does PriceLens detect fake festive discounts on Amazon & Flipkart?',
    a: 'During major sales, sellers often inflate the listed MRP right before applying a discount badge. PriceLens continuously archives 365-day historical prices and compares the current offer against the 60-day and 90-day moving average, flagging artificial markups immediately.',
  },
  {
    q: 'Are the prices and bank offers updated in real time?',
    a: 'Yes. Our dual-engine surveillance architecture monitors live listings across Amazon India and Flipkart Plus around the clock, tracking base prices, Lightning Deals, SuperCoin rewards, and instant credit card discounts (HDFC, ICICI, SBI, Axis).',
  },
  {
    q: 'Is PriceLens free to use, and how do you stay unbiased?',
    a: 'PriceLens is 100% free for shoppers. When you click through to Amazon or Flipkart and complete a purchase, we may earn a standard affiliate commission at zero extra cost to you. Stores never pay for placement—rankings are strictly sorted by real net price.',
  },
  {
    q: 'When will Croma, Reliance Digital, Tata CLiQ, and Vijay Sales be added?',
    a: 'Live API adapters and verification engines for Croma and Reliance Digital are currently in active development as part of our Phase 2 expansion, followed by Tata CLiQ and Vijay Sales.',
  },
  {
    q: 'How do instant WhatsApp and Email price drop alerts work?',
    a: 'Set your target price on any product in one click. The moment our tracker detects a price drop at or below your threshold—including flash drops—you receive an instant notification with a direct checkout link.',
  },
];

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq-section" className="pl-faq-section" aria-label="Frequently Asked Questions">
      <div className="pl-faq-container">
        <div className="pl-section-header-row text-center">
          <div className="pl-section-title-col pl-mx-auto">
            <div className="pl-section-eyebrow-pill">
              <HelpCircle size={13} className="pl-eyebrow-shield" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="pl-section-title">Everything you need to know</h2>
            <p className="pl-section-subtitle">
              Transparent answers on how we audit prices, protect shopper privacy, and maintain zero sponsored bias
            </p>
          </div>
        </div>

        <div className="pl-faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`pl-faq-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="pl-faq-question-btn"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="pl-faq-question-text">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`pl-faq-chevron ${isOpen ? 'rotated' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="pl-faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="pl-faq-trust-note">
          <ShieldCheck size={15} color="#119B67" />
          <span>Built with privacy-first telemetry &bull; Compliant with Indian DPDP &amp; Amazon Associates standards</span>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
