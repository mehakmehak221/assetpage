'use client';

import { Check } from 'lucide-react';

export default function EstatesWhyPartner() {
  const row1Pills = [
    'Retain your stake if you choose',
    'Transparent and professionally managed process',
  ];

  const row2Pills = [
    'Monetize part (or all) of your property',
    'No need to manage multiple investors',
  ];

  const row3Pills = [
    'Access to a wide network of qualified investors',
  ];

  return (
    <div className="w-full bg-white">
      <section
        id="why-glofi"
        className="relative z-10 w-full bg-[#00694BE5] rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px] pt-20 sm:pt-28 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 shadow-xl"
      >

        <div className="absolute inset-0 overflow-hidden rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px] pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#06866187]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1A785D99]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">

          <span className="text-xs sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#FFFFFF] block mb-6 sm:mb-8">
            WHY PARTNER WITH GLOFI
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.18] max-w-3xl mx-auto">
            Real Estate <br className="hidden sm:inline" />
            Works Hard For You
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-6 sm:mt-8 mb-12 sm:mb-14 leading-relaxed font-normal">
            Whether you want to unlock capital, diversify, or plan for the future, GloFi Estates gives you flexibility to achieve your goals - on your terms.
          </p>

          <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 w-full">
              {row1Pills.map((text) => (
                <div
                  key={text}
                  className="flex items-center group hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-[4px_0_12px_rgba(0,0,0,0.12)] z-10 relative shrink-0 border border-[#00694BBF]">
                    <Check className="text-[#00694B] stroke-[3] w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="bg-white py-3 sm:py-3.5 pr-6 sm:pr-8 pl-8 sm:pl-10 -ml-6 sm:-ml-7 rounded-r-full rounded-l-full shadow-sm relative">
                    <span className="text-[#036247] font-medium text-sm sm:text-[15px] tracking-wide">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 w-full">
              {row2Pills.map((text) => (
                <div
                  key={text}
                  className="flex items-center group hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-[4px_0_12px_rgba(0,0,0,0.12)] z-10 relative shrink-0 border border-[#00694BBF]">
                    <Check className="text-[#00694B] stroke-[3] w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="bg-white py-3 sm:py-3.5 pr-6 sm:pr-8 pl-8 sm:pl-10 -ml-6 sm:-ml-7 rounded-r-full rounded-l-full shadow-sm relative">
                    <span className="text-[#036247] font-medium text-sm sm:text-[15px] tracking-wide">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center w-full">
              {row3Pills.map((text) => (
                <div
                  key={text}
                  className="flex items-center group hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-[4px_0_12px_rgba(0,0,0,0.12)] z-10 relative shrink-0 border border-[#00694BBF]">
                    <Check className="text-[#00694B] stroke-[3] w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="bg-white py-3 sm:py-3.5 pr-6 sm:pr-8 pl-8 sm:pl-10 -ml-6 sm:-ml-7 rounded-r-full rounded-l-full shadow-sm relative">
                    <span className="text-[#036247] font-medium text-sm sm:text-[15px] tracking-wide">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
