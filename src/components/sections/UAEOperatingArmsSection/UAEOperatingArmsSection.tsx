'use client';

import { motion } from 'framer-motion';
import {
    fadeUp,
    fadeUpSubtle,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

export default function UAEOperatingArmsSection() {
    const { viewProps } = useLandingMotion();

    return (
        <section
            id="uae-operating-arms"
            className="uae-operating-arms-section w-full bg-white pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 overflow-hidden font-montserrat"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    className="flex flex-col items-center text-center max-w-5xl mx-auto"
                    {...viewProps}
                    variants={staggerContainer(0.08, 0.04)}
                >
                    <motion.h2
                        className="text-[#000000] font-montserrat font-bold text-[26px] sm:text-3xl md:text-4xl lg:text-[46px] leading-[1.18] tracking-tight text-center"
                        variants={fadeUp}
                    >
                        One UAE Company.
                        <br />
                        Two Operating Arms.
                    </motion.h2>

                    <motion.p
                        className="mt-3 sm:mt-3.5 text-[#414141] font-montserrat font-normal text-sm sm:text-[15px] md:text-base leading-relaxed text-center max-w-[860px] mx-auto"
                        variants={fadeUpSubtle}
                    >
                        GloFi Estates UAE bridges sovereign real estate brokerage with institutional technology - driven fractionalisation beneath a single unified operating umbrella.
                    </motion.p>
                </motion.div>

                <div className="mt-10 sm:mt-12 max-w-5xl mx-auto">
                    <motion.div
                        className="max-w-[600px] mx-auto relative"
                        {...viewProps}
                        variants={scaleIn}
                    >
                        <div className="rounded-[28px] sm:rounded-[32px] bg-[#43A982] p-7 sm:p-9 shadow-[0_30px_60px_-12px_rgba(16,68,48,0.52),_0_18px_36px_-18px_rgba(0,0,0,0.36)] text-white text-center">
                            <div className="w-12 h-12 rounded-full bg-[#007E5F] flex items-center justify-center mx-auto mb-3.5 text-white shadow-sm">
                                <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.5" y="2" width="21" height="18" rx="3.5" stroke="white" strokeWidth="2" fill="none" />
                                    <path d="M15 8H22.5V14H15C13.6193 14 12.5 12.8807 12.5 11.5V10.5C12.5 9.11929 13.6193 8 15 8Z" stroke="white" strokeWidth="1.8" fill="none" />
                                    <circle cx="16.5" cy="11" r="1.25" fill="white" />
                                </svg>
                            </div>

                            <div className="text-[10.5px] sm:text-[11.5px] tracking-[0.14em] uppercase text-white/95 font-semibold mb-1.5 font-montserrat">
                                DIFC INSTITUTIONAL FRAMEWORK
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight font-montserrat leading-tight">
                                GloFi Estates UAE
                            </h3>
                            <p className="mt-2 text-white/95 text-xs sm:text-[13.5px] leading-relaxed max-w-md mx-auto font-montserrat font-normal">
                                Direct operational holding controlling localized brokerage execution desks
                                and next-generation asset tokenization protocol engines.
                            </p>

                            <div className="mt-5 flex justify-center">
                                <span className="inline-block px-5 py-2 rounded-full bg-[#052119] text-white text-[9.5px] sm:text-[10.5px] font-bold tracking-wider uppercase shadow-md font-montserrat">
                                    MULTI-JURISDICTIONAL REAL-ESTATE &amp; DIGITAL ASSET VEHICLE
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden md:block w-full relative z-0 mt-3 mb-4" aria-hidden>
                        <div className="grid grid-cols-2 gap-8 lg:gap-10 w-full relative h-[68px]">
                            <div className="relative w-full h-full">
                                <div className="absolute top-[44px] left-1/2 right-[-16px] lg:right-[-20px] h-[2px] bg-[#35A77F]" />
                                <div className="absolute top-[44px] h-[24px] left-1/2 -translate-x-1/2 w-[2px] bg-[#35A77F]" />
                                <div className="absolute top-[68px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#00876D]" />
                            </div>

                            <div className="relative w-full h-full">
                                <div className="absolute top-[44px] right-1/2 left-[-16px] lg:left-[-20px] h-[2px] bg-[#35A77F]" />
                                <div className="absolute top-[44px] h-[24px] left-1/2 -translate-x-1/2 w-[2px] bg-[#35A77F]" />
                                <div className="absolute top-[68px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#00876D]" />
                            </div>

                            <div className="absolute top-0 h-[44px] left-1/2 -translate-x-1/2 w-[2px] bg-[#35A77F]" />
                            <div className="absolute top-[44px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#00876D]" />
                        </div>
                    </div>

                    <div className="md:hidden h-8" />

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                        {...viewProps}
                        variants={staggerContainer(0.12, 0.06)}
                    >
                        <motion.div className="flex flex-col" variants={fadeUp}>
                            <div className="flex justify-center mb-4 sm:mb-5">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#00110C] text-[#99CBBA] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-md font-montserrat">
                                    REAL ESTATE BROKERAGE &rarr; GLOFI BROKERS
                                </span>
                            </div>

                            <div className="rounded-[28px] sm:rounded-[34px] border-[2px] border-[#49AC86] bg-white p-6 sm:p-7 md:p-8 flex flex-col justify-between flex-1 shadow-[0_22px_45px_-12px_rgba(18,70,50,0.18),_0_10px_22px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_28px_56px_-12px_rgba(18,70,50,0.26),_0_12px_24px_-8px_rgba(0,0,0,0.12)]">
                                <div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#032B20] text-white flex items-center justify-center shrink-0">
                                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.5 15.625V7.5L16.25 3.125L10 7.5V9.375H7.5V6.25L16.25 0L25 6.25V15.625H22.5ZM16.875 8.125H18.125V6.875H16.875V8.125ZM14.375 8.125H15.625V6.875H14.375V8.125ZM16.875 10.625H18.125V9.375H16.875V10.625ZM14.375 10.625H15.625V9.375H14.375V10.625ZM7.5 21.25L16.1875 23.625L23.625 21.3125C23.5208 21.125 23.3698 20.9635 23.1719 20.8281C22.974 20.6927 22.75 20.625 22.5 20.625H16.1875C15.625 20.625 15.1771 20.6042 14.8438 20.5625C14.5104 20.5208 14.1667 20.4375 13.8125 20.3125L10.9062 19.3438L11.5938 16.9062L14.125 17.75C14.4792 17.8542 14.8958 17.9375 15.375 18C15.8542 18.0625 16.5625 18.1042 17.5 18.125C17.5 17.8958 17.4323 17.6771 17.2969 17.4688C17.1615 17.2604 17 17.125 16.8125 17.0625L9.5 14.375H7.5V21.25ZM0 25.625V11.875H9.5C9.64583 11.875 9.79167 11.8906 9.9375 11.9219C10.0833 11.9531 10.2188 11.9896 10.3438 12.0312L17.6875 14.75C18.375 15 18.9323 15.4375 19.3594 16.0625C19.7865 16.6875 20 17.375 20 18.125H22.5C23.5417 18.125 24.4271 18.4688 25.1562 19.1562C25.8854 19.8438 26.25 20.75 26.25 21.875V23.125L16.25 26.25L7.5 23.8125V25.625H0ZM2.5 23.125H5V14.375H2.5V23.125Z" fill="white" />
                                            </svg>
                                        </div>
                                        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#032B20] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-montserrat">
                                            REGULATED RERA / DED BROKERAGE
                                        </span>
                                    </div>

                                    <div className="mt-5 text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#121212] font-montserrat">
                                        REAL ESTATE BROKERAGE ARM
                                    </div>
                                    <h4 className="mt-1 text-2xl sm:text-[28px] font-bold text-[#007E5F] tracking-tight font-montserrat">
                                        GloFi Brokers
                                    </h4>

                                    <p className="mt-2.5 text-[#505151] text-xs sm:text-[13px] leading-relaxed font-montserrat font-normal">
                                        Tier-1 prime residential and trophy commercial advisory, off-market
                                        institutional acquisitions, master tenant syndication, and private
                                        mandate transactions across Dubai, Abu Dhabi, and prime emirate
                                        corridors.
                                    </p>

                                    <ul className="mt-5 space-y-2.5 text-xs sm:text-[13px] text-[#209181] font-medium font-montserrat">
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Trophy Asset Brokerage &amp; Private Mandates</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Institutional Placement &amp; Acquisition Desk</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Exclusive Master Developer Off-Plan Allocations</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-7 rounded-2xl bg-[#15382D] text-white p-3.5 sm:p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[9px] sm:text-[10px] tracking-wider text-white/90 font-semibold uppercase font-montserrat">
                                            DIRECT DESK
                                        </div>
                                        <div className="text-xs sm:text-[13px] font-bold text-white mt-0.5 font-montserrat">
                                            Downtown Dubai • DIFC Tower
                                        </div>
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9DD0BE] font-bold font-montserrat">
                                        ACTIVE PIPELINE
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="flex flex-col" variants={fadeUp}>
                            <div className="flex justify-center mb-4 sm:mb-5">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#00110C] text-[#99CBBA] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-md font-montserrat">
                                    FRACTIONALISATION PLATFORM &rarr; GLOFI TECH
                                </span>
                            </div>

                            <div className="rounded-[28px] sm:rounded-[34px] border-[2px] border-[#49AC86] bg-white p-6 sm:p-7 md:p-8 flex flex-col justify-between flex-1 shadow-[0_22px_45px_-12px_rgba(18,70,50,0.18),_0_10px_22px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_28px_56px_-12px_rgba(18,70,50,0.26),_0_12px_24px_-8px_rgba(0,0,0,0.12)]">
                                <div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#032B20] text-white flex items-center justify-center shrink-0">
                                            <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.25 25L0 18.75V6.25L11.25 0L22.5 6.25V18.75L11.25 25ZM7.625 9.0625C8.10417 8.5625 8.65625 8.17708 9.28125 7.90625C9.90625 7.63542 10.5625 7.5 11.25 7.5C11.9375 7.5 12.5938 7.63542 13.2188 7.90625C13.8438 8.17708 14.3958 8.5625 14.875 9.0625L18.625 6.96875L11.25 2.875L3.875 6.96875L7.625 9.0625ZM10 21.4375V17.3438C8.875 17.0521 7.96875 16.4583 7.28125 15.5625C6.59375 14.6667 6.25 13.6458 6.25 12.5C6.25 12.2708 6.26042 12.0573 6.28125 11.8594C6.30208 11.6615 6.34375 11.4583 6.40625 11.25L2.5 9.0625V17.2812L10 21.4375ZM11.25 15C11.9375 15 12.526 14.7552 13.0156 14.2656C13.5052 13.776 13.75 13.1875 13.75 12.5C13.75 11.8125 13.5052 11.224 13.0156 10.7344C12.526 10.2448 11.9375 10 11.25 10C10.5625 10 9.97396 10.2448 9.48438 10.7344C8.99479 11.224 8.75 11.8125 8.75 12.5C8.75 13.1875 8.99479 13.776 9.48438 14.2656C9.97396 14.7552 10.5625 15 11.25 15ZM12.5 21.4375L20 17.2812V9.0625L16.0938 11.25C16.1562 11.4583 16.1979 11.6615 16.2188 11.8594C16.2396 12.0573 16.25 12.2708 16.25 12.5C16.25 13.6458 15.9062 14.6667 15.2188 15.5625C14.5312 16.4583 13.625 17.0521 12.5 17.3438V21.4375Z" fill="white" />
                                            </svg>
                                        </div>
                                        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#032B20] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-montserrat">
                                            FINTECH &amp; DIGITAL ASSET SANDBOX
                                        </span>
                                    </div>

                                    <div className="mt-5 text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#121212] font-montserrat">
                                        FRACTIONALISATION PLATFORM
                                    </div>
                                    <h4 className="mt-1 text-2xl sm:text-[28px] font-bold text-[#007E5F] tracking-tight font-montserrat">
                                        GloFi Estates Technology
                                    </h4>

                                    <p className="mt-2.5 text-[#505151] text-xs sm:text-[13px] leading-relaxed font-montserrat font-normal">
                                        Next-generation institutional tokenization and fractional ownership
                                        rails. Powers algorithmic liquidity distribution, smart-contract SPV
                                        automated yields, and secondary cross-border transfer protocols.
                                    </p>

                                    <ul className="mt-5 space-y-2.5 text-xs sm:text-[13px] text-[#209181] font-medium font-montserrat">
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Smart-Contract SPV Digital Share Issuance</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Sovereign Secondary Liquidity Engine</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.06667 14L3.8 11.8667L1.4 11.3333L1.63333 8.86667L0 7L1.63333 5.13333L1.4 2.66667L3.8 2.13333L5.06667 0L7.33333 0.966667L9.6 0L10.8667 2.13333L13.2667 2.66667L13.0333 5.13333L14.6667 7L13.0333 8.86667L13.2667 11.3333L10.8667 11.8667L9.6 14L7.33333 13.0333L5.06667 14ZM5.63333 12.3L7.33333 11.5667L9.06667 12.3L10 10.7L11.8333 10.2667L11.6667 8.4L12.9 7L11.6667 5.56667L11.8333 3.7L10 3.3L9.03333 1.7L7.33333 2.43333L5.6 1.7L4.66667 3.3L2.83333 3.7L3 5.56667L1.76667 7L3 8.4L2.83333 10.3L4.66667 10.7L5.63333 12.3ZM6.63333 9.36667L10.4 5.6L9.46667 4.63333L6.63333 7.46667L5.2 6.06667L4.26667 7L6.63333 9.36667Z" fill="#209181" />
                                            </svg>

                                            <span>Multi-Currency Institutional Treasury Ledger</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-7 rounded-2xl bg-[#15382D] text-white p-3.5 sm:p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[9px] sm:text-[10px] tracking-wider text-white/90 font-semibold uppercase font-montserrat">
                                            SMART PROTOCOL
                                        </div>
                                        <div className="text-xs sm:text-[13px] font-bold text-white mt-0.5 font-montserrat">
                                            ERC-3643 Sovereign Standard
                                        </div>
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9DD0BE] font-bold font-montserrat">
                                        PRODUCTION READY
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
