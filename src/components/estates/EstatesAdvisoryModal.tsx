'use client';

import { useState } from 'react';
import { X, CheckCircle, Calendar, Phone, Mail, User, Building2 } from 'lucide-react';

interface EstatesAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'advisory' | 'partner';
}

export default function EstatesAdvisoryModal({
  isOpen,
  onClose,
  defaultType = 'advisory',
}: EstatesAdvisoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'Residential',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#83918D99]/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#443D3D] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1A785D99]/20 text-[#00694B] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-bold text-[#00694B] mb-2">Request Received!</h3>
            <p className="text-[#443D3D] mb-6 text-sm">
              Thank you for reaching out. A GloFi Estates property advisor will contact you within 24 hours.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#00694B] hover:bg-[#036247] text-white font-medium px-6 py-2.5 rounded-full transition-all text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#00694B] bg-[#1A785D99]/15 px-3 py-1 rounded-full border border-[#06866187]/40">
                {defaultType === 'partner' ? 'Partner Collaboration' : 'Private Advisory'}
              </span>
              <h2 className="text-2xl font-bold text-[#00694B] mt-3">
                {defaultType === 'partner' ? 'Partner with GloFi Estates' : 'Schedule an Advisory Call'}
              </h2>
              <p className="text-[#443D3D] text-xs sm:text-sm mt-1">
                Unlock flexible capital and retain future appreciation with institutional-grade fractionalization.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-[#83918D99]" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#83918D99]/50 focus:border-[#00694B] focus:ring-1 focus:ring-[#00694B] outline-none transition-all text-[#443D3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-[#83918D99]" size={16} />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 / +971"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#83918D99]/50 focus:border-[#00694B] focus:ring-1 focus:ring-[#00694B] outline-none transition-all text-[#443D3D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1">
                    Work / Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-[#83918D99]" size={16} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#83918D99]/50 focus:border-[#00694B] focus:ring-1 focus:ring-[#00694B] outline-none transition-all text-[#443D3D]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1">
                  Property Category
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 text-[#83918D99]" size={16} />
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#83918D99]/50 focus:border-[#00694B] focus:ring-1 focus:ring-[#00694B] outline-none transition-all text-[#443D3D] bg-white"
                  >
                    <option value="Residential Luxury">Luxury Residential / Penthouse</option>
                    <option value="Commercial Office">Commercial Grade-A Office</option>
                    <option value="Hospitality Resort">Hospitality / Resort / Villa</option>
                    <option value="Industrial Logistics">Warehousing & Logistics</option>
                    <option value="Land Asset">Land Parcel / Sovereign Asset</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1">
                  Note / Valuation Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Estimated valuation, location or key details..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-[#83918D99]/50 focus:border-[#00694B] focus:ring-1 focus:ring-[#00694B] outline-none transition-all text-[#443D3D] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00694B] hover:bg-[#036247] text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <Calendar size={16} />
                Confirm Consultation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
