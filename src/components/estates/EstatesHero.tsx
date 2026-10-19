'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import EstatesNavbar from './EstatesNavbar';

interface EstatesHeroProps {
  onOpenModal: () => void;
}

export default function EstatesHero({ onOpenModal }: EstatesHeroProps) {
  return (
    <section className="relative w-full overflow-hidden">

      <div className="relative w-full min-h-[700px] lg:min-h-[880px] bg-[#F7F8F6] rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px] overflow-hidden shadow-sm border-b border-[#83918D99]">

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/assets/images/estates/hero-villa.webp"
            alt="GloFi Estates Luxury Modern Villa at Sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-[80%_center]"
          />

          <div className="block xl:hidden absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </div>

        <EstatesNavbar onOpenModal={onOpenModal} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-20 sm:pb-32 lg:pb-44 flex flex-col justify-center min-h-[700px] lg:min-h-[880px]">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-black tracking-tight leading-[1.12] mb-6">
              Unlock the Value <br className="hidden sm:inline" />
              <span className="text-black">in your property</span>
            </h1>

            <p className="text-[#4B5563] sm:text-lg lg:text-[19px] leading-relaxed max-w-xl mb-10 font-normal">
              Turn your real estate into a flexible financial opportunity through fractional ownership – without selling the entire asset.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-5">

              <button
                onClick={onOpenModal}
                className="bg-[#1A785D99]/25 hover:bg-[#1A785D99]/25 text-[#00694B] font-bold text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-[#06866187] transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0"
              >
                Schedule an Advisory Call
              </button>

              <a
                href="https://www.glofiestates.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#1A785D99]/25 hover:bg-[#1A785D99]/25 text-[#00694B] font-bold text-sm sm:text-base pl-2.5 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-full border border-[#06866187] transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-3.5"
              >
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00694B] group-hover:bg-[#036247] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm">
                  <ArrowUpRight size={20} className="stroke-[2.5]" />
                </span>
                <span>Visit GloFi Estates</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
