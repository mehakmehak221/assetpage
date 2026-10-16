'use client';

import { useState } from 'react';
import EstatesHero from './EstatesHero';
import EstatesBenefits from './EstatesBenefits';
import EstatesWhyPartner from './EstatesWhyPartner';
import EstatesSecurity from './EstatesSecurity';
import EstatesProcess from './EstatesProcess';
import EstatesPartnerCta from './EstatesPartnerCta';
import GlofiCopyrightSection from '@/components/sections/GlofiCopyrightSection/GlofiCopyrightSection';
import PropertyListingRequestModal from './PropertyListingRequestModal';

export default function EstatesLanding() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white text-[#443D3D] selection:bg-[#00694B] selection:text-white font-sans antialiased overflow-x-hidden">

      <main className="w-full">

        <EstatesHero onOpenModal={() => setModalOpen(true)} />

        <EstatesBenefits />

        <EstatesWhyPartner />

        <EstatesSecurity />

        <EstatesProcess />

        <EstatesPartnerCta onOpenModal={() => setModalOpen(true)} />

        <GlofiCopyrightSection />
      </main>

      <PropertyListingRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
