'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface EstatesNavbarProps {
  onOpenModal?: () => void;
}

export default function EstatesNavbar({ onOpenModal }: EstatesNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Key Benefits', href: '#key-benefits' },
    { label: 'Why GloFi', href: '#why-glofi' },
    { label: 'Security', href: '#security' },
    { label: 'Process', href: '#process' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full z-50 pt-6 sm:pt-8 pb-4 px-6 sm:px-10 lg:px-16 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group transition-transform">
          <Image
            src="/assets/images/branding/light-logo.png"
            alt="GloFi Estates"
            width={160}
            height={52}
            className="h-10 sm:h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-[#00694B] hover:text-[#036247] font-medium text-sm lg:text-[15px] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#00694B] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="bg-[#00694B] hover:bg-[#036247] text-white font-medium text-sm lg:text-[15px] px-6 lg:px-7 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Partner with us
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#83918D99] text-[#00694B] flex items-center justify-center transition-colors shadow-sm"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-3 -mb-16 p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#83918D99] animate-fade-in flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-[#00694B] font-semibold text-base py-1 px-2 rounded-lg hover:bg-[#1A785D99]/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenModal?.();
            }}
            className="w-full bg-[#00694B] hover:bg-[#036247] text-white font-medium text-sm py-3 rounded-full mt-2 shadow-sm text-center cursor-pointer"
          >
            Partner with us
          </button>
        </div>
      )}
    </header>
  );
}
