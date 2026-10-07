'use client';

import EstatesNavbar from './EstatesNavbar';
import EstatesHero from './EstatesHero';
import EstatesBenefits from './EstatesBenefits';
import EstatesWhyPartner from './EstatesWhyPartner';
import EstatesSecurity from './EstatesSecurity';
import EstatesProcess from './EstatesProcess';
import EstatesPartnerCta from './EstatesPartnerCta';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';
import LandingReferralWidget from '@/components/sections/LandingReferralWidget/LandingReferralWidget';

export default function EstatesLanding() {
  return (
    <div className="min-h-screen w-full bg-white text-[#443D3D] selection:bg-[#00694B] selection:text-white font-sans antialiased overflow-x-hidden">

      <main className="w-full">

        <EstatesHero />

        <EstatesBenefits />

        <EstatesWhyPartner />

        <EstatesSecurity />

        <EstatesProcess />

        <EstatesPartnerCta />

        <GlofiCopyrightSection />

        <LandingReferralWidget />
      </main>
    </div>
  );
}
