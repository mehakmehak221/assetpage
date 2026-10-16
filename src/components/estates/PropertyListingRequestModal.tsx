'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
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
  // Step 1 – Contact
  fullName: '',
  phone: '',
  email: '',
  ownerType: '',

  // Step 2 – Property
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

// Fallbacks in case options API is still loading or offline
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

/* ── tiny helpers ── */
function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#443D3D] uppercase tracking-wider mb-1.5">
      {children}
      {optional && (
        <span className="ml-1 text-[10px] font-normal normal-case text-[#83918D] tracking-normal">
          (optional)
        </span>
      )}
    </label>
  );
}

function Input({
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83918D]" />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm rounded-xl border ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-[#83918D]/40 focus:border-[#00694B] focus:ring-[#00694B]/20'
          } focus:ring-1 outline-none transition-all text-[#443D3D] bg-white placeholder:text-[#83918D]/50 disabled:bg-[#F7F8F6] disabled:cursor-not-allowed`}
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1 font-medium">{error}</p>}
    </div>
  );
}

function Select({
  icon: Icon,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83918D] pointer-events-none"
          />
        )}
        <select
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-8 py-2.5 text-sm rounded-xl border ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-[#83918D]/40 focus:border-[#00694B] focus:ring-[#00694B]/20'
          } focus:ring-1 outline-none transition-all text-[#443D3D] bg-white appearance-none disabled:bg-[#F7F8F6] disabled:cursor-not-allowed`}
        >
          {children}
        </select>
        <ChevronRight
          size={13}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#83918D] rotate-90"
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1 font-medium">{error}</p>}
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
  const router = useRouter();

  // Active view tab: Form or My Requests
  const [activeTab, setActiveTab] = useState<'form' | 'my-requests'>('form');

  // Form states
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Success response
  const [submitSuccess, setSubmitSuccess] = useState<CreateListingRequestResponse | null>(null);

  // RTK Query: Profile for pre-filling contact details
  const { data: profileData } = useGetProfileQuery(undefined, { skip: !isOpen });

  // RTK Query: Options from GET /listing-requests/options
  const {
    data: optionsData,
    isLoading: isOptionsLoading,
  } = useGetListingRequestOptionsQuery(undefined, {
    skip: !isOpen,
  });

  // RTK Query: Submit mutation POST /listing-requests
  const [createListingRequest, { isLoading: isSubmitting }] = useCreateListingRequestMutation();

  // RTK Query: My listing requests GET /listing-requests/my
  const {
    data: myRequestsData,
    isLoading: isMyRequestsLoading,
    refetch: refetchMyRequests,
  } = useGetMyListingRequestsQuery(
    { page: 1, limit: 20 },
    { skip: !isOpen || activeTab !== 'my-requests' }
  );

  // Resolved option lists (using API data or fallbacks)
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

  // Pre-fill Full Name, Phone, Email from logged-in user profile while keeping editable
  useEffect(() => {
    if (isOpen && profileData) {
      const p = profileData.partnerProfile || profileData.investorProfile || profileData.agentProfile || {};
      const prefillName = profileData.fullName || p.fullName || profileData.name || p.name || '';
      const prefillEmail = profileData.email || p.email || '';
      const prefillPhone = profileData.phone || profileData.phoneNumber || p.phone || p.phoneNumber || '';

      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || prefillName,
        email: prev.email || prefillEmail,
        phone: prev.phone || prefillPhone,
      }));
    }
  }, [isOpen, profileData]);

  // Reset form when modal closes
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

  // Scroll lock
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
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (generalError) setGeneralError(null);
  };

  /* ── Client Validation ── */
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
        // Indian mobile check: "+91 98765 43210" or "9876543210"
        const clean = form.phone.replace(/[\s\-\(\)]/g, '');
        const indianPhoneRegex = /^(\+?91)?[6789]\d{9}$/;
        if (!indianPhoneRegex.test(clean)) {
          e.phone = 'Enter a valid Indian mobile number (e.g. +91 98765 43210 or 9876543210)';
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
    setStep(2);
  };

  /* ── Submit Handler ── */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setGeneralError(null);

    const e = validate(2);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    // Prepare payload conforming to API specification
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

    // Send optional fields only if filled; don't send ""
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
        // Validation failed: message is an array of strings, e.g. ["City is required", "Please select a category"]
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

        // If step 1 fields failed validation, return to step 1
        if (
          serverErrors.fullName ||
          serverErrors.phone ||
          serverErrors.email ||
          serverErrors.ownerType
        ) {
          setStep(1);
        }
      } else if (status === 401) {
        // Not logged in / session expired -> Redirect to login
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'Please log in to submit a property listing request.',
              type: 'error',
            },
          })
        );
        router.push('/sign-in');
      } else if (status === 403) {
        // Admin account -> "Not available for this account"
        setGeneralError('Not available for this account');
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              message: 'Not available for this account',
              type: 'error',
            },
          })
        );
      } else if (status === 429) {
        // More than 5 submissions in an hour, or 3 requests already under review
        const msg = data?.message || 'More than 5 submissions in an hour or 3 requests already under review.';
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
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#83918D]/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(ev) => ev.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="bg-gradient-to-br from-[#00694B] to-[#025C42] px-6 sm:px-8 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                  Property Listing Request
                </span>
                {profileData && (
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

              <h2 className="text-xl sm:text-[22px] font-bold text-white mt-2.5 leading-tight">
                {activeTab === 'my-requests'
                  ? 'My Listing Requests'
                  : submitSuccess
                  ? 'Listing Request Received'
                  : step === 1
                  ? 'Your Contact Details'
                  : 'Property Information'}
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                {activeTab === 'my-requests'
                  ? 'Track the real-time status of your submitted properties'
                  : submitSuccess
                  ? 'We have recorded your details securely'
                  : `Step ${step} of 2`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors flex-shrink-0 ml-4 mt-1"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>

          {activeTab === 'form' && !submitSuccess && (
            <>
              {/* Step pills */}
              <div className="flex gap-2 mt-4">
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
                        if (s.id < step) setStep(s.id as 1 | 2);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                        active
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

              {/* Progress bar */}
              <div className="mt-3.5 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
            </>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
          {/* General Error Banner */}
          {generalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* VIEW: MY REQUESTS TAB */}
          {activeTab === 'my-requests' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#83918D]/15">
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
                        className="p-4 rounded-2xl border border-[#83918D]/20 hover:border-[#00694B]/30 bg-white hover:bg-[#F7F8F6]/40 transition-all shadow-sm"
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

                        {req.status === 'REJECTED' && req.rejectionReason && (
                          <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
                            <strong>Reason:</strong> {req.rejectionReason}
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-[#83918D]/10 flex items-center justify-between text-[10px] text-[#83918D]">
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
            /* ══ SUCCESS SCREEN ══ */
            <div className="py-6 text-center flex flex-col items-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#00694B]/10 text-[#00694B] flex items-center justify-center mb-4 ring-4 ring-[#00694B]/15">
                <CheckCircle size={36} />
              </div>

              <h3 className="text-xl font-bold text-[#00694B] mb-1.5">
                Listing Request Submitted!
              </h3>

              {/* Server Message */}
              <p className="text-[#443D3D] text-sm max-w-sm mb-4 leading-relaxed font-medium">
                {submitSuccess.message ||
                  'Your listing request has been submitted. Our team will contact you soon.'}
              </p>

              {/* Reference Number Card */}
              <div className="w-full bg-[#F7F8F6] border border-[#83918D]/25 rounded-2xl p-4 mb-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-[#83918D] tracking-wider">
                    Reference Number
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {submitSuccess.status || 'NEW'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono text-base font-bold text-[#00694B] tracking-wide select-all">
                    {submitSuccess.referenceNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyReferenceNo(submitSuccess.referenceNo)}
                    className="flex items-center gap-1 text-xs text-[#00694B] hover:text-[#025C42] font-semibold bg-white border border-[#00694B]/20 px-2.5 py-1 rounded-lg hover:bg-[#00694B]/5 transition-all"
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

              <p className="text-[#83918D] text-xs max-w-xs mb-6">
                A confirmation has been recorded for{' '}
                <span className="font-semibold text-[#443D3D]">{form.email}</span>.
              </p>

              <div className="flex items-center gap-3 w-full justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('my-requests');
                    setSubmitSuccess(null);
                  }}
                  className="px-5 py-2.5 rounded-full border border-[#00694B] text-[#00694B] font-semibold text-xs hover:bg-[#00694B]/5 transition-all"
                >
                  View My Requests
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#00694B] hover:bg-[#025C42] text-white font-semibold px-8 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ══ FORM WORKFLOW ══ */
            <form onSubmit={handleSubmit} noValidate>
              {/* ══ STEP 1 — CONTACT ══ */}
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
                </div>
              )}

              {/* ══ STEP 2 — PROPERTY ══ */}
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

                  <div className="grid grid-cols-2 gap-4">
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
                          className="text-[10px] text-[#83918D] hover:text-[#00694B] underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {listingPreferences.map((opt) => {
                        const isChecked = form.listingPreference === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={`flex items-start gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'border-[#00694B] bg-[#00694B]/5 ring-1 ring-[#00694B]'
                                : 'border-[#83918D]/35 hover:border-[#00694B]/40 bg-white'
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
                                className={`font-semibold text-xs ${
                                  isChecked ? 'text-[#00694B]' : 'text-[#443D3D]'
                                }`}
                              >
                                {opt.label}
                              </div>
                              {opt.description && (
                                <div className="text-[10px] text-[#83918D] mt-0.5">
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

              {/* ── FOOTER NAVIGATION ── */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#83918D]/15">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#83918D]/40 text-[#443D3D] text-sm font-medium hover:bg-[#F7F8F6] transition-all disabled:opacity-50"
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
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#00694B] hover:bg-[#025C42] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#00694B] hover:bg-[#025C42] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
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
