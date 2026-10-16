'use client';

import { ArrowRight } from 'lucide-react';

interface EstatesPartnerCtaProps {
  onOpenModal?: () => void;
}

export default function EstatesPartnerCta({ onOpenModal }: EstatesPartnerCtaProps) {
  return (
    <section className="relative w-full bg-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="relative w-full bg-[#719F8D] rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 lg:p-16 shadow-[0_16px_40px_rgba(0,105,75,0.25)] border-[2px] border-[#00694B] overflow-hidden">

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">

            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15] mb-4">
                Partner with GloFi Estates
              </h2>

              <p className="text-white text-sm sm:text-base lg:text-[17px] leading-relaxed mb-8 sm:mb-10 font-medium">
                Join a growing community of asset owners who are turning their real estate into opportunity.
              </p>

              <button
                type="button"
                onClick={onOpenModal}
                className="group bg-white hover:bg-emerald-50 text-[#00694B] border-[2px] border-[#00694B] font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowRight size={18} className="stroke-[2.5] text-[#00694B] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-col md:items-end text-left md:text-right space-y-2 shrink-0">
              <span className="text-xs sm:text-[14px] font-medium tracking-wide text-white">
                LIQUIDITY
              </span>
              <span className="text-xs sm:text-[14px] font-medium tracking-wide text-white">
                FLEXIBILITY
              </span>
              <span className="text-xs sm:text-[14px] font-medium tracking-wide text-white">
                SECURITY
              </span>
              <span className="text-xs sm:text-[14px] font-medium tracking-wide text-white">
                LONG - TERM VALUE
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
