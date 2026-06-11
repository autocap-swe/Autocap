'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  FileText,
  FileSignature,
  Search,
  FileCheck,
  PartyPopper,
} from 'lucide-react';

interface ProcessStepProps {
  step: {
    number: number;
    title: string;
    description: string;
    timeline: string;
  };
  index: number;
  isLast?: boolean;
}

const iconMap = {
  1: MessageCircle,
  2: FileText,
  3: FileSignature,
  4: Search,
  5: FileCheck,
  6: PartyPopper,
};

export function ProcessStep({ step, index, isLast = false }: ProcessStepProps) {
  const Icon = iconMap[step.number as keyof typeof iconMap];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative flex gap-6 md:gap-8"
    >
      {/* Step number circle — sits on top of the vertical line */}
      <div className="relative z-10 flex-shrink-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C8102E] to-[#A00D25] shadow-lg ring-4 ring-[#F5F0EB]">
          <span className="text-2xl font-black text-white">{step.number}</span>
        </div>
      </div>

      {/* Content card */}
      <div className={`flex-1 ${!isLast ? 'pb-6 md:pb-8' : ''}`}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8">
          {/* Icon in top-left of card */}
          {Icon && (
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0EB]">
              <Icon className="h-6 w-6 text-[#C8102E]" strokeWidth={2} />
            </div>
          )}
          <h3 className="mb-3 text-xl font-bold text-[#1C1C1E] md:text-2xl">{step.title}</h3>
          <p className="text-base leading-relaxed text-gray-600 md:text-lg">{step.description}</p>
          {step.timeline && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C8102E]/10 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
              <span className="text-sm font-semibold text-[#C8102E]">{step.timeline}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
