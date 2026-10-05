'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    fadeUp,
    fadeUpSubtle,
    slideFromRight,
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
            <g clipPath="url(#clip0_flame_about)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25466 13.8359C8.9508 12.8064 9.01495 11.6945 8.4471 10.5002C8.28919 11.1409 8.00033 11.5298 7.5805 11.6669C7.97037 10.5535 7.64459 9.35058 6.60315 8.05818C6.58067 9.39299 6.2599 10.3653 5.64082 10.9752C4.78796 11.8146 4.798 12.7619 5.67089 13.8171C2.04735 11.8888 1.53614 9.30248 4.13718 6.05834C4.29851 6.84206 4.68944 7.32323 5.31004 7.50184C4.63358 4.63127 5.34531 2.18534 7.4452 0.164062C7.45811 4.64972 8.83364 5.04842 10.5728 7.05072C12.4505 9.45358 11.347 12.2265 8.25466 13.8359Z"
                    fill="url(#paint0_flame_about)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_flame_about"
                    x1="11.1975"
                    y1="3.91639"
                    x2="3.19803"
                    y2="11.9159"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#EF3E3D" />
                    <stop offset="1" stopColor="#FFC828" />
                </linearGradient>
                <clipPath id="clip0_flame_about">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default function AboutGlofiSection() {
    const { viewProps } = useLandingMotion();
    const { t } = useI18n();

    return (
        <section
            id="about-glofi"
            className="about-glofi-section w-full bg-white pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 overflow-hidden"
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-14 items-stretch">
                    <motion.div
                        className="flex flex-col items-start justify-between w-full h-full"
                        {...viewProps}
                        variants={staggerContainer(0.1, 0.05)}
                    >
                        <div>
                            <motion.span
                                className="font-montserrat inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f6f5] border border-[#e8ecea] text-[#031B1D] font-bold text-[11px] sm:text-xs tracking-wider uppercase"
                                variants={fadeUpSubtle}
                            >
                                <FlameIcon />
                                <span>{t('ABOUT GLOFI')}</span>
                            </motion.span>

                            <motion.h2
                                className="mt-4 sm:mt-5 text-[#0A0D14] font-montserrat font-bold text-[26px] sm:text-3xl md:text-4xl lg:text-[46px] leading-[1.18] tracking-tight"
                                variants={fadeUp}
                            >
                                {t('A')}{' '}
                                <span className="text-[#01a586] italic font-semibold font-montserrat">
                                    {t('Real Asset Bank')}
                                </span>{' '}
                                {t('For')}
                                <br className="hidden sm:inline" /> {t('Global Tomorrow')}
                            </motion.h2>

                            <motion.h3
                                className="mt-3 sm:mt-3.5 text-[#0A0D14] font-bold text-sm sm:text-base md:text-lg tracking-[-0.02em] font-montserrat"
                                variants={fadeUpSubtle}
                            >
                                {t('A New Home for Real-World Value.')}
                            </motion.h3>
                        </div>

                        <motion.div
                            className="mt-5 sm:mt-6 p-6 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4 font-inter font-normal text-sm sm:text-[15px] leading-relaxed text-left text-[#505151] w-full lg:max-w-[489px]"
                            variants={fadeUp}
                        >
                            <p>
                                {t('All your real estate investments in one platform - curated, accessible and transparent. GloFi Estates connects global real assets with global opportunity, enabling you to invest track and grow wealth with confidence.')}
                            </p>
                            <p>
                                {t('From landmark properties to emerging opportunities, GloFi brings real assets into a connected global ecosystem - making discovery, access, and participation simpler.')}
                            </p>
                            <p>
                                {t('A global ecosystem built around real assets - connecting people, properties, and opportunity across markets.')}
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="w-full h-full flex justify-center lg:justify-end"
                        {...viewProps}
                        variants={slideFromRight}
                    >
                        <div className="relative w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-0 rounded-[28px] sm:rounded-[36px] overflow-hidden group transition-transform duration-500 hover:scale-[1.01]">
                            <Image
                                src="/assets/images/secondsection.webp"
                                alt={t('GloFi - A Real Asset Bank For Global Tomorrow')}
                                fill
                                className="object-cover block"
                                sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 48vw, 600px"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
