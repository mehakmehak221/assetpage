'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface EstatesProcessProps {
  onOpenModal?: () => void;
}

export default function EstatesProcess({ onOpenModal }: EstatesProcessProps) {
  const steps = [
    {
      num: '01',
      title: 'Initial Consultation & Asset Review',
    },
    {
      num: '02',
      title: 'Title & Legal Verification',
    },
    {
      num: '03',
      title: 'Independent Valuation',
    },
    {
      num: '04',
      title: "Structuring Your Asset's Ownership",
    },
    {
      num: '05',
      title: 'Investor Marketing & Fundraising',
    },
  ];

  return (
    <div className="w-full bg-white pb-20">
      <section
        id="process"
        className="relative w-full bg-[#DDEAE4] rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] border-b-[3px] border-[#3BA083] pt-20 sm:pt-28 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#4B5563] block mb-6 sm:mb-8">
              PROCESS
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-black tracking-tight leading-[1.18] max-w-2xl mx-auto">
              A Simpler Way <br />
              Forward
            </h2>

            <p className="text-[#4B5563] text-sm sm:text-base md:text-[17px] max-w-2xl mx-auto mt-6 sm:mt-8 leading-relaxed font-normal">
              From initial consultation to investor on boarding, we make the process clear, professional, and straightforward
            </p>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 my-16 sm:my-28">

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] shrink-0 z-10 lg:translate-x-4">
              <div className="w-full h-full rounded-full overflow-hidden shadow-[0_0_0_3px_#3BA083,0_0_60px_15px_rgba(255,255,255,0.9)] relative z-10">
                <Image
                  src="/assets/images/estates/globe.webp"
                  alt="Fractional Estate Ownership Process Villa"
                  fill
                  priority
                  sizes="(max-width: 768px) 300px, 400px"
                  className="object-cover object-[85%_50%] scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="hidden lg:flex absolute -top-16 left-[75%] -translate-x-[24px] items-center gap-6 z-20">
                <span className="w-12 h-12 rounded-full border-[3px] border-[#3BA083] bg-white text-black font-bold text-[15px] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,105,75,0.55)]">
                  01
                </span>
                <span className="text-black font-bold text-[15px] sm:text-[17px] lg:whitespace-nowrap">
                  Initial Consultation & Asset Review
                </span>
              </div>

              <div className="hidden lg:flex absolute -bottom-16 left-[75%] -translate-x-[24px] items-center gap-6 z-20">
                <span className="w-12 h-12 rounded-full border-[3px] border-[#3BA083] bg-white text-black font-bold text-[15px] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,105,75,0.55)]">
                  05
                </span>
                <span className="text-black font-bold text-[15px] sm:text-[17px] lg:whitespace-nowrap">
                  Investor Marketing & Fundraising
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-14 sm:gap-24 w-full max-w-md mt-10 lg:mt-0 z-20">
              {steps.map((step, idx) => {
                const isMobileOnly = (idx === 0 || idx === 4);
                let marginLeft = '';
                if (idx === 2) {
                  marginLeft = 'lg:ml-12';
                }
                return (
                  <div
                    key={step.num}
                    className={`flex items-center gap-6 group ${isMobileOnly ? 'lg:hidden' : ''} ${marginLeft}`}
                  >
                    <span className="w-12 h-12 rounded-full border-[3px] border-[#3BA083] bg-white text-black font-bold text-[15px] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,105,75,0.55)]">
                      {step.num}
                    </span>
                    <span className="text-black font-bold text-[15px] sm:text-[17px] leading-snug pr-2 lg:whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[28px] z-30">
          <button
            type="button"
            onClick={onOpenModal}
            className="group bg-[#00694B] hover:bg-[#036247] text-white border-[3px] border-[#00694B] hover:border-[#036247] font-bold text-sm sm:text-base px-8 sm:px-12 py-3 sm:py-4 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <span>Start the Conversation</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
