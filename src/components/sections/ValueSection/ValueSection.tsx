'use client';

import { motion } from 'framer-motion';
import {
    fadeIn,
    fadeUpSubtle,
    scaleIn,
    staggerContainer,
    useLandingMotion,
} from '@/lib/landingAnimations';

const STATS = [
    { value: '20,000+', label: 'Retail Waitlist Signups' },
    { value: '$250M+', label: 'Assets Signed & Under MOU' },
    { value: 'Beta Live', label: 'iOS & Android App' },
] as const;

export default function ValueSection() {
    const { viewProps } = useLandingMotion();

    return (
        <section
            id="values"
            className="bg-[#004852] w-full flex justify-center overflow-hidden border-t border-b border-[#00F4C4]/25"
        >
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 md:py-8 z-10">
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between sm:justify-around gap-6 sm:gap-4"
                    {...viewProps}
                    variants={staggerContainer(0.12, 0.04)}
                >
                    {/* Stat 1 */}
                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.04 }}>
                            <span className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight block leading-none">
                                {STATS[0].value}
                            </span>
                            <span className="text-xs sm:text-sm md:text-[15px] text-white/90 mt-1.5 font-normal block tracking-normal">
                                {STATS[0].label}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Separator Dot 1 */}
                    <motion.div
                        className="hidden sm:block w-2.5 h-2.5 rounded-full bg-white shrink-0"
                        variants={fadeIn}
                        aria-hidden
                    />

                    {/* Stat 2 */}
                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.04 }}>
                            <span className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight block leading-none">
                                {STATS[1].value}
                            </span>
                            <span className="text-xs sm:text-sm md:text-[15px] text-white/90 mt-1.5 font-normal block tracking-normal">
                                {STATS[1].label}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Separator Dot 2 */}
                    <motion.div
                        className="hidden sm:block w-2.5 h-2.5 rounded-full bg-white shrink-0"
                        variants={fadeIn}
                        aria-hidden
                    />

                    {/* Stat 3 */}
                    <motion.div
                        className="flex flex-col items-center text-center"
                        variants={fadeUpSubtle}
                    >
                        <motion.div variants={scaleIn} whileHover={{ scale: 1.04 }}>
                            <span className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-tight block leading-none">
                                {STATS[2].value}
                            </span>
                            <span className="text-xs sm:text-sm md:text-[15px] text-white/90 mt-1.5 font-normal block tracking-normal">
                                {STATS[2].label}
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
