'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
    fadeUp,
    fadeUpSubtle,
    slideFromLeft,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';
import { useI18n } from '@/providers/LocaleProvider';

const ChartIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_3px_rgba(4,120,87,0.4)]">
        <rect x="4" y="12" width="4.5" height="9" rx="1.5" fill="#047857" stroke="white" strokeWidth="1" />
        <rect x="10" y="7" width="4.5" height="14" rx="1.5" fill="#047857" stroke="white" strokeWidth="1" />
        <rect x="16" y="3" width="4.5" height="18" rx="1.5" fill="#047857" stroke="white" strokeWidth="1" />
    </svg>
);

const DocIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_3px_rgba(4,120,87,0.4)]">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#047857" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8" y="13" width="8" height="1.5" rx="0.5" fill="white" />
        <rect x="8" y="17" width="5" height="1.5" rx="0.5" fill="white" />
    </svg>
);

const LayersIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_3px_rgba(4,120,87,0.4)]">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#047857" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" fill="#059669" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" fill="#10b981" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
);

const MapPinIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_3px_rgba(4,120,87,0.4)]">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 21.5C12 21.5 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21.5 12 21.5ZM12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z" fill="#047857" stroke="white" strokeWidth="1" />
    </svg>
);

const FEATURES = [
    {
        icon: <ChartIcon />,
        title: 'Investor Relations & Capital Updates',
        desc: 'A dedicated space for our capital raise, investor updates, and key documents.',
    },
    {
        icon: <DocIcon />,
        title: 'Regulatory & Structure Transparency',
        desc: 'Clear information on our SPV / SM-REIT structure, KYC process, and jurisdiction-specific disclosures.',
    },
    {
        icon: <LayersIcon />,
        title: 'Live Asset Inventory',
        desc: 'Our explore section is being enhanced with live institutional assets and real opportunities across markets.',
    },
    {
        icon: <MapPinIcon />,
        title: 'Relevant Market Filters',
        desc: "We're refining location filters to show only active and verified markets, so you see relevant opportunities.",
    },
];

export default function CompleteExperienceSection() {
    const { viewProps } = useLandingMotion();
    const { t } = useI18n();

    return (
        <section className="relative w-full overflow-hidden bg-[#f9fafb] lg:bg-white font-montserrat lg:min-h-[720px] lg:flex lg:items-center" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
            {/* Background image for desktop - fading from white on the left to image on right */}
            <div className="absolute inset-0 z-0 hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 w-[55%]" />
                <Image 
                    src="/assets/images/opportunitybg.webp" 
                    alt={t('Building a more complete experience')} 
                    fill 
                    className="object-cover object-right"
                    quality={100}
                    sizes="100vw"
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-16 sm:py-20 lg:py-16">
                <motion.div 
                    className="max-w-[680px]"
                    {...viewProps}
                    variants={staggerContainer(0.1, 0.05)}
                >
                    <motion.div variants={fadeUpSubtle} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f9f6] mb-6">
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#82d0be]">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#047857]" />
                        </div>
                        <span className="text-[#6b7280] font-medium text-[10px] sm:text-[11px] tracking-wider uppercase font-inter">
                            {t('MORE OPPORTUNITIES AHEAD')}
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-[#0A0D14] font-bold text-[36px] sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.1] tracking-tight mb-5"
                        variants={fadeUp}
                    >
                        {t('Building a')}
                        <br />
                        <span className="text-[#01a586] italic font-semibold">
                            {t('More Complete')}
                        </span>{' '}
                        {t('Experience')}
                    </motion.h2>

                    <motion.p
                        className="text-[#505151] text-[15px] sm:text-[17px] leading-[1.6] mb-10 max-w-[540px] font-inter"
                        variants={fadeUpSubtle}
                    >
                        {t("We're continuously enhancing the platform to bring you greater transparency, deeper insights, and a more seamless way to explore real-world opportunities.")}
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="group bg-white border border-[#f3f4f6] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[20px] p-5 lg:p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 flex items-start gap-3 lg:gap-4 h-full"
                            >
                                <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-[#d9f1ea] via-[#eaf7f3] to-white border border-[#c4e8de] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(1,165,134,0.15)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <div className="flex flex-col h-full w-full">
                                    <h3 className="text-[#0A0D14] font-bold text-[16px] leading-[1.3] mb-1.5 font-montserrat">
                                        {t(feature.title)}
                                    </h3>
                                    <p className="text-[#6b7280] text-[13px] leading-[1.5] font-inter flex-grow mb-4 pr-2">
                                        {t(feature.desc)}
                                    </p>
                                    <div className="mt-auto self-end">
                                        <div className="w-[28px] h-[28px] rounded-full border border-[#01a586] flex items-center justify-center text-[#01a586] group-hover:bg-[#01a586] group-hover:text-white transition-colors duration-300">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
