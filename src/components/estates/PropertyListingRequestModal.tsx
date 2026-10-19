'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { getCookie } from '@/utils/cookieUtils';
import { useGetProfileQuery } from '@/store/api/authApi';
import {
  useGetListingRequestOptionsQuery,
  useCreateListingRequestMutation,
  useGetMyListingRequestsQuery,
} from '@/store/api/listingRequestApi';
import {
  ListingRequestOption,
  CreateListingRequestDto,
  CreateListingRequestResponse,
  LISTING_STATUS_CONFIG,
} from '@/types/listingRequest';

interface PropertyListingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  ownerType: '',
  referredBy: '',

  category: '',
  constructionStatus: '',
  streetAddress: '',
  city: '',
  state: '',
  expectedPrice: '',
  listingPreference: '',
};

type FormState = typeof initialForm;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const FALLBACK_OWNER_TYPES: ListingRequestOption[] = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'HUF', label: 'HUF' },
  { value: 'TRUST', label: 'Trust' },
];

const FALLBACK_CATEGORIES: ListingRequestOption[] = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL_OFFICE', label: 'Commercial Office' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'WAREHOUSE', label: 'Warehouse / Logistics' },
  { value: 'LAND', label: 'Land' },
  { value: 'HOSPITALITY', label: 'Hospitality / Resort' },
];

const FALLBACK_CONSTRUCTION_STATUSES: ListingRequestOption[] = [
  { value: 'READY', label: 'Ready to Move' },
  { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
];

const FALLBACK_LISTING_PREFERENCES: ListingRequestOption[] = [
  { value: 'SELL_WHOLE', label: 'Sell Whole', description: '100% ownership transfer' },
  { value: 'FRACTIONAL', label: 'Fractional', description: 'Retain partial stake' },
];

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">
      {children}
      {!optional ? (
        <span className="text-red-500 font-bold ml-1">*</span>
      ) : (
        <span className="ml-1 text-[10px] font-medium normal-case text-[#475569] tracking-normal">
          (optional)
        </span>
      )}
    </label>
  );
}

function Input({
  icon: Icon,
  error,
  style,
  onFocus,
  onBlur,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none" />
        )}
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={{
            color: '#0F172A',
            WebkitTextFillColor: '#0F172A',
            caretColor: '#00694B',
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderColor: error ? '#EF4444' : isFocused ? '#00694B' : '#94A3B8',
            boxShadow: isFocused
              ? '0 0 0 3px rgba(0, 105, 75, 0.15)'
              : error
                ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
                : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            ...style,
          }}
          className={`property-modal-input w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 sm:py-3 text-base sm:text-sm font-medium rounded-xl transition-all text-[#0F172A] bg-white placeholder:text-[#94A3B8] placeholder:opacity-100 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

function Select({
  icon: Icon,
  error,
  children,
  style,
  onFocus,
  onBlur,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
          />
        )}
        <select
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={{
            color: props.value ? '#0F172A' : '#94A3B8',
            WebkitTextFillColor: props.value ? '#0F172A' : '#94A3B8',
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderColor: error ? '#EF4444' : isFocused ? '#00694B' : '#94A3B8',
            boxShadow: isFocused
              ? '0 0 0 3px rgba(0, 105, 75, 0.15)'
              : error
                ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
                : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            ...style,
          }}
          className={`property-modal-input w-full ${Icon ? 'pl-10' : 'pl-4'} pr-9 py-2.5 sm:py-3 text-base sm:text-sm font-medium rounded-xl transition-all text-[#0F172A] bg-white appearance-none outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        >
          {children}
        </select>
        <ChevronRight
          size={14}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] rotate-90"
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

function formatINR(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === '') return '—';
  const num = typeof val === 'string' ? Number(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export default function PropertyListingRequestModal({
  isOpen,
  onClose,
}: PropertyListingRequestModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'my-requests'>('form');


  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getCookie('access_token') || localStorage.getItem('access_token');
      setHasToken(Boolean(token));
    }
  }, [isOpen]);

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);


  const [submitSuccess, setSubmitSuccess] = useState<CreateListingRequestResponse | null>(null);

  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isOpen || !hasToken,
  });


  const userRole = (
    profileData?.role ||
    (typeof window !== 'undefined' ? localStorage.getItem('userType') : '') ||
    getCookie('userType') ||
    ''
  ).toUpperCase();

  const isAdmin =
    hasToken &&
    (userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      profileData?.isAdmin === true);


  const isLoggedIn = hasToken && !isAdmin;

  const {
    data: optionsData,
    isLoading: isOptionsLoading,
  } = useGetListingRequestOptionsQuery(undefined, {
    skip: !isOpen || isAdmin,
  });

  const [createListingRequest, { isLoading: isSubmitting }] = useCreateListingRequestMutation();

  const {
    data: myRequestsData,
    isLoading: isMyRequestsLoading,
    refetch: refetchMyRequests,
  } = useGetMyListingRequestsQuery(
    { page: 1, limit: 20 },
    { skip: !isOpen || !isLoggedIn || activeTab !== 'my-requests' }
  );

  useEffect(() => {
    if (!isLoggedIn && activeTab === 'my-requests') {
      setActiveTab('form');
    }
  }, [isLoggedIn, activeTab]);

  const ownerTypes = useMemo(
    () => (optionsData?.ownerTypes?.length ? optionsData.ownerTypes : FALLBACK_OWNER_TYPES),
    [optionsData]
  );
  const categories = useMemo(
    () => (optionsData?.categories?.length ? optionsData.categories : FALLBACK_CATEGORIES),
    [optionsData]
  );
  const constructionStatuses = useMemo(
    () => (optionsData?.constructionStatuses?.length ? optionsData.constructionStatuses : FALLBACK_CONSTRUCTION_STATUSES),
    [optionsData]
  );
  const listingPreferences = useMemo(
    () => (optionsData?.listingPreferences?.length ? optionsData.listingPreferences : FALLBACK_LISTING_PREFERENCES),
    [optionsData]
  );

  useEffect(() => {
    if (isOpen) {
      let initialRef = '';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        initialRef =
          urlParams.get('referralCode') ||
          urlParams.get('ref') ||
          urlParams.get('referredBy') ||
          localStorage.getItem('glofi_referral_code') ||
          '';
      }

      if (profileData) {
        const p = profileData.partnerProfile || profileData.investorProfile || profileData.agentProfile || {};
        const prefillName = profileData.fullName || p.fullName || profileData.name || p.name || '';
        const prefillEmail = profileData.email || p.email || '';
        const prefillPhone = profileData.phone || profileData.phoneNumber || p.phone || p.phoneNumber || '';

        setForm((prev) => ({
          ...prev,
          fullName: prev.fullName || prefillName,
          email: prev.email || prefillEmail,
          phone: prev.phone || prefillPhone,
          referredBy: prev.referredBy || initialRef,
        }));
      } else if (initialRef) {
        setForm((prev) => ({
          ...prev,
          referredBy: prev.referredBy || initialRef,
        }));
      }
    }
  }, [isOpen, profileData]);


  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setForm(initialForm);
        setErrors({});
        setGeneralError(null);
        setSubmitSuccess(null);
        setActiveTab('form');
        setCopiedRef(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);


  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (generalError) setGeneralError(null);
  };

  const validate = (s: 1 | 2): FieldErrors => {
    const e: FieldErrors = {};
    if (s === 1) {
      if (!form.fullName.trim()) {
        e.fullName = 'Full Name is required';
      } else if (form.fullName.trim().length > 100) {
        e.fullName = 'Full Name cannot exceed 100 characters';
      }

      if (!form.phone.trim()) {
        e.phone = 'Phone number is required';
      } else {
        const clean = form.phone.replace(/[\s\-\(\)]/g, '');
        const indianPhoneRegex = /^(\+?91)?[6789]\d{9}$/;
        if (!indianPhoneRegex.test(clean)) {
          e.phone = 'Enter a valid mobile number (e.g. +91 98765 43210 or 9876543210)';
        }
      }

      if (!form.email.trim()) {
        e.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        e.email = 'Please enter a valid email address';
      }

      if (!form.ownerType) {
        e.ownerType = 'Please select owner type';
      }

      if (form.referredBy && form.referredBy.trim().length > 100) {
        e.referredBy = 'Referred by cannot exceed 100 characters';
      }
    }

    if (s === 2) {
      if (!form.category) {
        e.category = 'Please select a category';
      }
      if (!form.constructionStatus) {
        e.constructionStatus = 'Please select construction status';
      }
      if (!form.streetAddress.trim()) {
        e.streetAddress = 'Street address is required';
      } else if (form.streetAddress.trim().length > 300) {
        e.streetAddress = 'Street address cannot exceed 300 characters';
      }
      if (!form.city.trim()) {
        e.city = 'City is required';
      } else if (form.city.trim().length > 100) {
        e.city = 'City cannot exceed 100 characters';
      }
      if (!form.state.trim()) {
        e.state = 'State is required';
      } else if (form.state.trim().length > 100) {
        e.state = 'State cannot exceed 100 characters';
      }
    }
    return e;
  };

  const handleNext = () => {
    const e = validate(1);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setGeneralError(null);
    setStep(2);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setGeneralError(null);

    if (step === 1) {
      handleNext();
      return;
    }

    const e = validate(2);
    if (Object.keys(e).length) {
      setErrors(e);
      return;

    }

    const payload: CreateListingRequestDto = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      ownerType: form.ownerType,
      category: form.category,
      constructionStatus: form.constructionStatus,
      streetAddress: form.streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
    };

    if (form.referredBy && form.referredBy.trim()) {
      payload.referredBy = form.referredBy.trim();
    }

    if (form.expectedPrice && form.expectedPrice.trim()) {
      const cleanNum = Number(form.expectedPrice.replace(/,/g, ''));
      payload.expectedPrice = !isNaN(cleanNum) && cleanNum > 0 ? cleanNum : form.expectedPrice.trim();
    }

    if (form.listingPreference && form.listingPreference.trim()) {
      payload.listingPreference = form.listingPreference.trim();
    }

    try {
      const res = await createListingRequest(payload).unwrap();
      setSubmitSuccess(res);
    } catch (err: any) {
      const status = err?.status || err?.originalStatus;
      const data = err?.data;

      if (status === 400) {
        const messages: string[] = Array.isArray(data?.message)
          ? data.message
          : typeof data?.message === 'string'
            ? [data.message]
            : ['Validation failed. Please verify your fields.'];

        const serverErrors: FieldErrors = {};
        const unmapped: string[] = [];

        messages.forEach((msg) => {
          const lower = msg.toLowerCase();
          if (lower.includes('full name') || (lower.includes('name') && !lower.includes('owner'))) {
            serverErrors.fullName = msg;
          } else if (lower.includes('phone') || lower.includes('mobile')) {
            serverErrors.phone = msg;
          } else if (lower.includes('email')) {
            serverErrors.email = msg;
          } else if (lower.includes('owner') || lower.includes('ownertype')) {
            serverErrors.ownerType = msg;
          } else if (lower.includes('refer')) {
            serverErrors.referredBy = msg;
          } else if (lower.includes('category')) {
            serverErrors.category = msg;
          } else if (lower.includes('construction') || lower.includes('status')) {
            serverErrors.constructionStatus = msg;
          } else if (lower.includes('street') || lower.includes('address')) {
            serverErrors.streetAddress = msg;
          } else if (lower.includes('city')) {
            serverErrors.city = msg;
          } else if (lower.includes('state')) {
            serverErrors.state = msg;
          } else if (lower.includes('price')) {
            serverErrors.expectedPrice = msg;
          } else if (lower.includes('preference')) {
            serverErrors.listingPreference = msg;
          } else {
            unmapped.push(msg);
          }
        });

        setErrors(serverErrors);
        if (unmapped.length > 0) {
          setGeneralError(unmapped.join('. '));
        }

        if (
          serverErrors.fullName ||
          serverErrors.phone ||
          serverErrors.email ||
          serverErrors.ownerType ||
          serverErrors.referredBy
        ) {
          setStep(1);
        }
      } else if (status === 401) {
        const msg = data?.message || 'Unauthorized. Please try again or submit directly.';
        setGeneralError(msg);
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: msg,
              type: 'error',
            },
          })
        );
      } else if (status === 403) {
        const msg = data?.message || 'Property listing requests are not available for admin accounts.';
        setGeneralError(msg);
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: msg,
              type: 'error',
            },
          })
        );
      } else if (status === 429) {
        const msg =
          (typeof data?.message === 'string' && data.message.trim())
            ? data.message
            : Array.isArray(data?.message) && data.message.length > 0
              ? data.message.join('. ')
              : 'Too many requests. You can submit up to 5 listing requests per hour.';
        setGeneralError(msg);
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: msg,
              type: 'error',
            },
          })
        );
      } else {
        const errorMsg = data?.message || 'Failed to submit listing request. Please try again.';
        setGeneralError(errorMsg);
      }
    }
  };

  const copyReferenceNo = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[calc(100dvh-1.25rem)] sm:max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(ev) => ev.stopPropagation()}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          .property-modal-input,
          input.property-modal-input,
          select.property-modal-input {
            color: #0F172A !important;
            -webkit-text-fill-color: #0F172A !important;
            caret-color: #00694B !important;
          }
          .property-modal-input:-webkit-autofill,
          .property-modal-input:-webkit-autofill:hover,
          .property-modal-input:-webkit-autofill:focus,
          .property-modal-input:-webkit-autofill:active {
            -webkit-text-fill-color: #0F172A !important;
            -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
            box-shadow: 0 0 0 1000px #FFFFFF inset !important;
            color: #0F172A !important;
            caret-color: #00694B !important;
          }
          .property-modal-input::placeholder,
          input.property-modal-input::placeholder {
            color: #94A3B8 !important;
            -webkit-text-fill-color: #94A3B8 !important;
            opacity: 1 !important;
          }
        ` }} />

        <div className="bg-gradient-to-br from-[#00694B] to-[#025C42] px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-3.5 sm:pb-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 bg-white/10 px-2.5 py-1 rounded-full">
                  Property Listing Request
                </span>
                {isLoggedIn && !submitSuccess && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(activeTab === 'form' ? 'my-requests' : 'form');
                      setGeneralError(null);
                    }}
                    className="text-[10px] font-semibold tracking-wider uppercase text-emerald-100 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {activeTab === 'form' ? 'View My Requests' : '← Back to Form'}
                  </button>
                )}
              </div>

              <h2 className="text-base sm:text-lg md:text-[22px] font-bold text-white mt-1.5 sm:mt-2.5 leading-snug">
                {isAdmin
                  ? 'Listing Request'
                  : activeTab === 'my-requests'
                    ? 'My Listing Requests'
                    : submitSuccess
                      ? 'Listing Request Received'
                      : step === 1
                        ? 'Your Contact Details'
                        : 'Property Information'}
              </h2>
              <p className="text-white/75 text-[11px] sm:text-xs mt-0.5 line-clamp-1 sm:line-clamp-none">
                {isAdmin
                  ? 'Not available for administrator accounts'
                  : activeTab === 'my-requests'
                    ? 'Track the real-time status of your submitted properties'
                    : submitSuccess
                      ? 'We have recorded your details securely'
                      : `Step ${step} of 2`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {activeTab === 'form' && !submitSuccess && !isAdmin && (
            <>
              <div className="flex gap-2 mt-3 sm:mt-4">
                {[
                  { id: 1, label: 'Contact Details', icon: User },
                  { id: 2, label: 'Property Info', icon: Building2 },
                ].map((s) => {
                  const SIcon = s.icon;
                  const done = step > s.id;
                  const active = step === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (s.id < step) {
                          setErrors({});
                          setGeneralError(null);
                          setStep(s.id as 1 | 2);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex-shrink-0 transition-all ${active
                        ? 'bg-white text-[#00694B] shadow'
                        : done
                          ? 'bg-white/20 text-white cursor-pointer hover:bg-white/30'
                          : 'bg-white/10 text-white/50 cursor-default'
                        }`}
                    >
                      {done ? <CheckCircle size={12} /> : <SIcon size={12} />}
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 sm:mt-3.5 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
            </>
          )}
        </div>

        <div className="overflow-y-auto flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6">

          {generalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}


          {isAdmin ? (
            <div className="py-8 text-center flex flex-col items-center animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-base font-bold text-[#443D3D]">Not Available for Admin Accounts</h3>
              <p className="text-xs text-[#83918D] max-w-sm mt-1.5 mb-6 leading-relaxed">
                Property listing requests cannot be submitted from administrator accounts. Please use an investor, partner, or agent account, or log out to submit anonymously.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#00694B] text-white text-xs font-semibold hover:bg-[#025C42] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : activeTab === 'my-requests' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-[#443D3D]">
                  Submitted Listing Requests
                </span>
                <button
                  type="button"
                  onClick={() => refetchMyRequests()}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#00694B] hover:text-[#025C42] transition-colors"
                >
                  <RefreshCw size={11} className={isMyRequestsLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {isMyRequestsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-[#83918D]">
                  <Loader2 size={28} className="animate-spin text-[#00694B] mb-2" />
                  <p className="text-xs">Loading your listing requests…</p>
                </div>
              ) : myRequestsData?.data && myRequestsData.data.length > 0 ? (
                <div className="space-y-3">
                  {myRequestsData.data.map((req) => {
                    const statusConfig = LISTING_STATUS_CONFIG[req.status] || {
                      label: req.status,
                      badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
                    };
                    return (
                      <div
                        key={req.id || req.referenceNo}
                        className="p-4 rounded-2xl border border-gray-200 hover:border-[#00694B]/40 bg-white hover:bg-gray-50/50 transition-all shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#00694B]">
                                {req.referenceNo}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.badgeClass}`}
                              >
                                {statusConfig.label}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-[#443D3D] mt-1.5">
                              {req.category?.replace(/_/g, ' ') || 'Property'} • {req.city}, {req.state}
                            </h4>
                          </div>

                          {req.expectedPrice && (
                            <div className="text-right">
                              <span className="text-[10px] text-[#83918D] block uppercase font-medium">
                                Expected Price
                              </span>
                              <span className="text-xs font-bold text-[#00694B]">
                                {formatINR(req.expectedPrice)}
                              </span>
                            </div>
                          )}
                        </div>

                        {req.listingPreference && (
                          <div className="mt-2 text-[11px] text-[#83918D]">
                            Preference:{' '}
                            <span className="font-medium text-[#443D3D]">
                              {req.listingPreference === 'SELL_WHOLE' ? 'Sell Whole' : req.listingPreference === 'FRACTIONAL' ? 'Fractional' : req.listingPreference}
                            </span>
                          </div>
                        )}

                        {req.referredBy && (
                          <div className="mt-1 text-[11px] text-[#83918D]">
                            Referred by:{' '}
                            <span className="font-medium text-[#443D3D]">{req.referredBy}</span>
                          </div>
                        )}

                        {req.status === 'REJECTED' && req.rejectionReason && (
                          <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
                            <strong>Reason:</strong> {req.rejectionReason}
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                          <span>
                            Submitted on {new Date(req.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyReferenceNo(req.referenceNo)}
                            className="inline-flex items-center gap-1 hover:text-[#00694B] transition-colors"
                          >
                            <Copy size={11} />
                            Copy Ref
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#00694B]/10 text-[#00694B] flex items-center justify-center mb-3">
                    <Building2 size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-[#443D3D]">No Requests Yet</h4>
                  <p className="text-xs text-[#83918D] max-w-xs mt-1 mb-4">
                    You haven’t submitted any property listing requests yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('form')}
                    className="text-xs font-semibold px-4 py-2 bg-[#00694B] text-white rounded-full hover:bg-[#025C42] transition-colors"
                  >
                    Submit a Request
                  </button>
                </div>
              )}
            </div>
          ) : submitSuccess ? (
            <div className="py-2 sm:py-4 text-center flex flex-col items-center animate-in fade-in duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#00694B]/10 text-[#00694B] flex items-center justify-center mb-2.5 sm:mb-4 ring-4 ring-[#00694B]/15">
                <CheckCircle size={28} className="sm:w-9 sm:h-9" />
              </div>

              <h3 className="text-base sm:text-xl font-bold text-[#00694B] mb-1 sm:mb-1.5">
                Listing Request Submitted!
              </h3>

              <p className="text-[#334155] text-xs sm:text-sm max-w-sm mb-3.5 sm:mb-4 leading-relaxed font-medium px-1 sm:px-2">
                {submitSuccess.message ||
                  'Your listing request has been submitted. Our team will contact you soon.'}
              </p>

              <div className="w-full bg-[#F7F8F6] border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3.5 sm:mb-4 text-left shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-gray-500 tracking-wider">
                    Reference Number
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {submitSuccess.status || 'NEW'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 mt-2 sm:mt-2.5">
                  <span className="font-mono text-xs sm:text-base font-bold text-[#00694B] tracking-tight sm:tracking-wide select-all break-all">
                    {submitSuccess.referenceNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyReferenceNo(submitSuccess.referenceNo)}
                    className="self-stretch sm:self-auto justify-center flex items-center gap-1.5 text-xs text-[#00694B] hover:text-[#025C42] font-semibold bg-white border border-[#00694B]/30 px-3 py-1.5 rounded-lg hover:bg-[#00694B]/5 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedRef ? (
                      <>
                        <Check size={12} className="text-[#00694B]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[#475569] text-xs max-w-xs mb-4 sm:mb-6 font-medium px-1 sm:px-2">
                A confirmation has been recorded for{' '}
                <span className="font-semibold text-[#1E293B] break-all">{form.email}</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full justify-center">
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('my-requests');
                      setSubmitSuccess(null);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#00694B] text-[#00694B] font-semibold text-xs hover:bg-[#00694B]/5 transition-all cursor-pointer text-center"
                  >
                    View My Requests
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#00694B] hover:bg-[#025C42] text-white font-semibold px-8 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg text-xs cursor-pointer text-center"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (step === 1) {
                    handleNext();
                  }
                }
              }}
              noValidate
            >

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      icon={User}
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Rahul Sharma"
                      value={form.fullName}
                      onChange={set('fullName')}
                      error={errors.fullName}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        icon={Phone}
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set('phone')}
                        error={errors.phone}
                      />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={set('email')}
                        error={errors.email}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Owner Type</Label>
                    <Select
                      icon={User}
                      value={form.ownerType}
                      onChange={set('ownerType')}
                      error={errors.ownerType}
                      disabled={isOptionsLoading}
                    >
                      <option value="">
                        {isOptionsLoading ? 'Loading owner types…' : 'Select owner type'}
                      </option>
                      {ownerTypes.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label optional>Referred By</Label>
                    <Input
                      icon={UserCheck}
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Agent name or referral code"
                      value={form.referredBy}
                      onChange={set('referredBy')}
                      error={errors.referredBy}
                    />
                  </div>
                </div>
              )}


              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Property Category</Label>
                      <Select
                        icon={Building2}
                        value={form.category}
                        onChange={set('category')}
                        error={errors.category}
                        disabled={isOptionsLoading}
                      >
                        <option value="">
                          {isOptionsLoading ? 'Loading categories…' : 'Select category'}
                        </option>
                        {categories.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label>Construction Status</Label>
                      <Select
                        value={form.constructionStatus}
                        onChange={set('constructionStatus')}
                        error={errors.constructionStatus}
                        disabled={isOptionsLoading}
                      >
                        <option value="">
                          {isOptionsLoading ? 'Loading statuses…' : 'Select status'}
                        </option>
                        {constructionStatuses.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Street Address</Label>
                    <Input
                      icon={MapPin}
                      type="text"
                      maxLength={300}
                      placeholder="e.g. Flat 12B, MG Road"
                      value={form.streetAddress}
                      onChange={set('streetAddress')}
                      error={errors.streetAddress}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        type="text"
                        maxLength={100}
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={set('city')}
                        error={errors.city}
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        type="text"
                        maxLength={100}
                        placeholder="Maharashtra"
                        value={form.state}
                        onChange={set('state')}
                        error={errors.state}
                      />
                    </div>
                  </div>

                  <div>
                    <Label optional>Expected Price (₹)</Label>
                    <Input
                      icon={IndianRupee}
                      type="text"
                      placeholder="e.g. 5,00,00,000"
                      value={form.expectedPrice}
                      onChange={set('expectedPrice')}
                      error={errors.expectedPrice}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label optional>Listing Preference</Label>
                      {form.listingPreference && (
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, listingPreference: '' }))}
                          className="text-[10px] text-[#475569] font-medium hover:text-[#00694B] underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {listingPreferences.map((opt) => {
                        const isChecked = form.listingPreference === opt.value;
                        return (
                          <label
                            key={opt.value}
                            style={{
                              borderWidth: '1.5px',
                              borderStyle: 'solid',
                              borderColor: isChecked ? '#00694B' : '#94A3B8',
                            }}
                            className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl transition-all cursor-pointer shadow-xs ${isChecked
                              ? 'bg-[#00694B]/5 ring-2 ring-[#00694B]/20'
                              : 'bg-white hover:bg-gray-50/50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="listingPreference"
                              value={opt.value}
                              checked={isChecked}
                              onChange={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  listingPreference: prev.listingPreference === opt.value ? '' : opt.value,
                                }))
                              }
                              className="mt-0.5 accent-[#00694B] flex-shrink-0"
                            />
                            <div>
                              <div
                                className={`font-semibold text-xs ${isChecked ? 'text-[#00694B]' : 'text-[#1E293B]'
                                  }`}
                              >
                                {opt.label}
                              </div>
                              {opt.description && (
                                <div
                                  className={`text-[11px] mt-0.5 font-medium ${isChecked ? 'text-[#025C42]' : 'text-[#4B5563]'
                                    }`}
                                >
                                  {opt.description}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.listingPreference && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">
                        {errors.listingPreference}
                      </p>
                    )}
                  </div>
                </div>
              )}


              <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 border-t border-gray-200 gap-3">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setGeneralError(null);
                      setStep(1);
                    }}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-[#00694B] hover:bg-[#025C42] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 rounded-full bg-[#00694B] hover:bg-[#025C42] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Request
                        <CheckCircle size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
