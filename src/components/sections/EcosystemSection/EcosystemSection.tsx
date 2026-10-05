'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    fadeUp,
    fadeUpSubtle,
    slideFromLeft,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';
import { useI18n } from '@/providers/LocaleProvider';

function FlameIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
            aria-hidden
        >
            <g clipPath="url(#clip0_flame_ecosystem)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25466 13.8359C8.9508 12.8064 9.01495 11.6945 8.4471 10.5002C8.28919 11.1409 8.00033 11.5298 7.5805 11.6669C7.97037 10.5535 7.64459 9.35058 6.60315 8.05818C6.58067 9.39299 6.2599 10.3653 5.64082 10.9752C4.78796 11.8146 4.798 12.7619 5.67089 13.8171C2.04735 11.8888 1.53614 9.30248 4.13718 6.05834C4.29851 6.84206 4.68944 7.32323 5.31004 7.50184C4.63358 4.63127 5.34531 2.18534 7.4452 0.164062C7.45811 4.64972 8.83364 5.04842 10.5728 7.05072C12.4505 9.45358 11.347 12.2265 8.25466 13.8359Z"
                    fill="url(#paint0_flame_ecosystem)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_flame_ecosystem"
                    x1="11.1975"
                    y1="3.91639"
                    x2="3.19803"
                    y2="11.9159"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#EF3E3D" />
                    <stop offset="1" stopColor="#FFC828" />
                </linearGradient>
                <clipPath id="clip0_flame_ecosystem">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default function EcosystemSection() {
    const { viewProps } = useLandingMotion();
    const { t } = useI18n();

    return (
        <section
            id="ecosystem-section"
            className="ecosystem-section w-full bg-white pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 overflow-hidden font-montserrat"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">

                    <motion.div
                        className="w-full h-full flex justify-center lg:justify-start order-2 lg:order-1"
                        {...viewProps}
                        variants={slideFromLeft}
                    >
                        <div className="relative w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-0 rounded-[28px] sm:rounded-[36px] overflow-hidden group">
                            <Image
                                src="/assets/images/globe.webp"
                                alt={t('GloFi Global Ecosystem')}
                                fill
                                className="object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
                                sizes="(max-width: 1023px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-start justify-center w-full order-1 lg:order-2 h-full py-4 lg:py-0"
                        {...viewProps}
                        variants={staggerContainer(0.1, 0.05)}
                    >
                        <motion.span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f6f5] border border-[#e8ecea] text-[#031B1D] font-bold text-[11px] sm:text-xs tracking-wider uppercase"
                            variants={fadeUpSubtle}
                        >
                            <FlameIcon />
                            <span>{t('ECOSYSTEM')}</span>
                        </motion.span>

                        <motion.h2
                            className="mt-4 sm:mt-5 text-[#0A0D14] font-bold text-[32px] sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.1] tracking-tight"
                            variants={fadeUp}
                        >
                            {t('One')} <span className="text-[#01a586] italic font-semibold">{t('Ecosystem.')}</span>
                            <br />
                            {t('Real')} <span className="text-[#01a586] italic font-semibold">{t('Value.')}</span>
                        </motion.h2>

                        <motion.h3
                            className="mt-4 sm:mt-5 text-[#0A0D14] font-bold text-[17px] sm:text-[19px] md:text-[21px] tracking-[-0.01em]"
                            variants={fadeUpSubtle}
                        >
                            {t('Where Global Assets Come Together.')}
                        </motion.h3>

                        <motion.div
                            className="mt-6 sm:mt-7 p-6 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4 font-normal text-[13.5px] sm:text-[14.5px] md:text-[15px] leading-[1.7] text-left text-[#505151] w-full font-inter"
                            variants={fadeUp}
                        >
                            <p>
                                {t('GloFi brings properties, people, and opportunities together through one connected platform. It creates a seamless way to discover curated real-world assets, explore emerging opportunities, and access markets across regions - all within a transparent and connected global ecosystem.')}
                            </p>
                            <p>
                                {t('With a focus on clarity and accessibility, GloFi simplifies the journey from discovering a property to understanding its potential. By connecting diverse markets within one ecosystem, it creates a more informed and seamless way to engage with real-world opportunities.')}
                            </p>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
