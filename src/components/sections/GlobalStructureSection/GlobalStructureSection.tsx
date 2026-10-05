'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    fadeUp,
    fadeUpSubtle,
    scaleIn,
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
            <g clipPath="url(#clip0_flame_global)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25466 13.8359C8.9508 12.8064 9.01495 11.6945 8.4471 10.5002C8.28919 11.1409 8.00033 11.5298 7.5805 11.6669C7.97037 10.5535 7.64459 9.35058 6.60315 8.05818C6.58067 9.39299 6.2599 10.3653 5.64082 10.9752C4.78796 11.8146 4.798 12.7619 5.67089 13.8171C2.04735 11.8888 1.53614 9.30248 4.13718 6.05834C4.29851 6.84206 4.68944 7.32323 5.31004 7.50184C4.63358 4.63127 5.34531 2.18534 7.4452 0.164062C7.45811 4.64972 8.83364 5.04842 10.5728 7.05072C12.4505 9.45358 11.347 12.2265 8.25466 13.8359Z"
                    fill="url(#paint0_flame_global)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_flame_global"
                    x1="11.1975"
                    y1="3.91639"
                    x2="3.19803"
                    y2="11.9159"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#EF3E3D" />
                    <stop offset="1" stopColor="#FFC828" />
                </linearGradient>
                <clipPath id="clip0_flame_global">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default function GlobalStructureSection() {
    const { viewProps } = useLandingMotion();
    const { t } = useI18n();

    const MARKET_NODES = [
        {
            image: '/assets/images/holding1.webp',
            alt: t('India Operating Sub. - India Gate'),
            badge: t('ACTIVE OPERATING SUBSIDIARY'),
            title: t('India Operating Sub.'),
            description: t('Full-spectrum real asset origination, institutional warehousing, and onshore special purpose vehicle capitalization for premium high-growth corridors.'),
        },
        {
            image: '/assets/images/holding2.webp',
            alt: t('US Domestic Ops - Statue of Liberty'),
            badge: t('STRATEGIC MARKET NODE'),
            title: t('US Domestic Ops'),
            description: t('Tier-1 North American commercial towers, biomedical life sciences facilities, and multi-state cold storage infrastructure deployments.'),
        },
        {
            image: '/assets/images/holding4.webp',
            alt: t('UAE Holding Co. - Dubai Museum of the Future'),
            badge: t('ACTIVE OPERATING HUB'),
            title: t('UAE Holding Co.'),
            description: t('Cross-border capital routing, sovereign co-investment syndicates, and master corporate operational vehicle directly driving regional execution entities.'),
        },
        {
            image: '/assets/images/holding3.webp',
            alt: t('Saudi Arabia Node - City and Coastal Skyline'),
            badge: t('STRATEGIC EXPANSION NODE'),
            title: t('Saudi Arabia Node'),
            description: t('Capital syndication and sovereign alignment across Vision2030 giga-projects, hospitality enclaves, and premium real asset joint ventures.'),
        },
        {
            image: '/assets/images/holding5.webp',
            alt: t('Brazil Expansion - Christ the Redeemer'),
            badge: t('STRATEGIC EXPANSION NODE'),
            title: t('Brazil Expansion'),
            description: t('Institutional real estate acquisition, agricultural sovereign reserves, and major logistics gateways spanning South America.'),
        },
        {
            image: '/assets/images/holding6.webp',
            alt: t('London Europe Hub - Big Ben & Westminster'),
            badge: t('STRATEGIC EXPANSION NODE'),
            title: t('London Europe Hub'),
            description: t('Multi-family office capital aggregation, institutional syndication desks, and outbound gateway for prime Western European real estate investments.'),
        },
    ];

    return (
        <section
            id="global-structure"
            className="global-structure-section w-full bg-white pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 overflow-hidden font-montserrat"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="flex flex-col items-center text-center max-w-5xl mx-auto"
                    {...viewProps}
                    variants={staggerContainer(0.08, 0.04)}
                >
                    <motion.span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f6f5] border border-[#e8ecea] text-[#333e38] font-bold text-[11px] sm:text-xs tracking-wider uppercase mb-3.5 sm:mb-4"
                        variants={fadeUpSubtle}
                    >
                        <FlameIcon />
                        <span>{t('GLOBAL STRUCTURE')}</span>
                    </motion.span>

                    <motion.h2
                        className="text-[#000000] font-montserrat font-bold text-[26px] sm:text-3xl md:text-4xl lg:text-[46px] leading-[1.18] tracking-tight text-center"
                        variants={fadeUp}
                    >
                        {t('One Holding Company.')}
                        <br />
                        {t('Six Global Markets.')}
                    </motion.h2>

                    <motion.p
                        className="mt-3 sm:mt-3.5 text-[#414141] font-montserrat font-normal text-sm sm:text-[15px] md:text-base leading-relaxed text-center max-w-[860px] mx-auto"
                        variants={fadeUpSubtle}
                    >
                        {t('GloFi Estates operates within a USA-based holding structure, connecting regional entities, local fiduciary expertise, and sovereign-grade real asset portfolios across strategic liquidity centers.')}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="mt-10 sm:mt-12 max-w-4xl mx-auto"
                    {...viewProps}
                    variants={scaleIn}
                >
                    <div className="flex justify-center -mb-3.5 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#cff7e7] border border-[#7ee5be] text-[#412D00] font-bold text-[10.5px] sm:text-[11px] tracking-wider uppercase shadow-sm">
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1L1.2 2.8V6.6C1.2 9.5 3.2 12.1 6 12.8C8.8 12.1 10.8 9.5 10.8 6.6V2.8L6 1Z" stroke="#412D00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>

                            <span>{t('APEX FIDUCIARY ENTITY')}</span>
                        </span>
                    </div>

                    <div className="relative w-full rounded-[28px] sm:rounded-[32px] bg-[#43A982] p-6 sm:p-8 md:p-9 shadow-[0_28px_60px_-10px_rgba(18,70,50,0.48),_0_15px_30px_-10px_rgba(0,0,0,0.28)] text-white">
                        <div className="text-[11px] sm:text-xs tracking-[0.14em] uppercase text-white/95 font-semibold mb-2">
                            {t('DELAWARE JURISDICTION • LEGAL & CAPITAL NEXUS')}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight leading-snug">
                                {t('GloFi Estates — USA Holding Co.')}
                            </h3>
                            <div className="w-12 h-12 rounded-full bg-[#007E5F] flex items-center justify-center shrink-0 shadow-sm">
                                <svg width="22" height="18" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.5" y="1.5" width="21" height="17" rx="3" stroke="white" strokeWidth="2" fill="none" />
                                    <line x1="1.5" y1="6.5" x2="22.5" y2="6.5" stroke="white" strokeWidth="1.8" />
                                    <path d="M7.5 12.5L10.5 15L16.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            </div>
                        </div>

                        <p className="mt-2.5 text-white/95 text-xs sm:text-[14px] leading-relaxed max-w-2xl">
                            {t('Supreme corporate governing board overseeing inter-entity treasury transfers, master compliance charters, and institutional LP allocations.')}
                        </p>

                        <div className="mt-6 rounded-[22px] bg-[#1D5A45] p-4.5 sm:p-5 md:px-7">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
                                <div>
                                    <div className="text-[10px] sm:text-[11px] tracking-wider text-[#B7FFD6] font-bold uppercase">
                                        {t('INCORPORATION')}
                                    </div>
                                    <div className="text-xs sm:text-[13.5px] md:text-sm font-bold text-white mt-1">
                                        {t('DE, Series C-Corp')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] sm:text-[11px] tracking-wider text-[#B7FFD6] font-bold uppercase">
                                        {t('MASTER ASSETS')}
                                    </div>
                                    <div className="text-xs sm:text-[13.5px] md:text-sm font-bold text-white mt-1">
                                        {t('$1.84B AUM')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] sm:text-[11px] tracking-wider text-[#B7FFD6] font-bold uppercase">
                                        {t('FIDUCIARY VAULT')}
                                    </div>
                                    <div className="text-xs sm:text-[13.5px] md:text-sm font-bold text-white mt-1">
                                        {t('Qualified Custody')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] sm:text-[11px] tracking-wider text-[#B7FFD6] font-bold uppercase">
                                        {t('REGULATORY TIER')}
                                    </div>
                                    <div className="text-xs sm:text-[13.5px] md:text-sm font-bold text-white mt-1">
                                        {t('Reg D / Reg S')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16 mt-16 sm:mt-20 max-w-6xl mx-auto px-2"
                    {...viewProps}
                    variants={staggerContainer(0.08, 0.05)}
                >
                    {MARKET_NODES.map((node, i) => (
                        <motion.div
                            key={i}
                            className="flex flex-col items-center text-center group"
                            variants={fadeUp}
                        >
                            <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-[155px] md:h-[155px] rounded-full overflow-hidden border-[3.5px] border-[#00876D] shadow-[0_16px_30px_-6px_rgba(0,0,0,0.32),_0_6px_12px_-4px_rgba(0,0,0,0.18)] shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_20px_36px_-6px_rgba(0,135,109,0.4)]">
                                <Image
                                    src={node.image}
                                    alt={node.alt}
                                    fill
                                    sizes="(max-width: 768px) 160px, 180px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#023326] text-white font-bold text-[9.5px] sm:text-[10px] tracking-wider uppercase shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F4C4] shrink-0" />
                                    {node.badge}
                                </span>
                            </div>

                            <h4 className="mt-3.5 sm:mt-4 text-xl sm:text-[22px] md:text-2xl font-bold font-montserrat text-[#00876D] tracking-tight">
                                {node.title}
                            </h4>

                            <p className="mt-2.5 text-[#5F6D7E] text-[13px] sm:text-sm leading-relaxed max-w-[320px] font-normal font-montserrat">
                                {node.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
