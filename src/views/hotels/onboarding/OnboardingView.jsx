"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HotelRoute } from "@/routes/saas/hotels/hotels.route";
import { PaymentRoute } from "@/routes/saas/payment/payment.route";
import { loadRazorpayScript } from "@/lib/razorpay";
import {
  Hotel,
  User,
  MapPin,
  Settings,
  CreditCard,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  Bell,
  Search,
  MoreVertical,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/providers/ToastProvider";
import Step1BasicInfo from "./onboardingsteps/Step1BasicInfo";
import Step2OwnerDetails from "./onboardingsteps/Step2OwnerDetails";
import Step3Location from "./onboardingsteps/Step3Location";
import Step4BusinessSettings from "./onboardingsteps/Step4BusinessSettings";
import Step5Plan from "./onboardingsteps/Step5Plan";
import Step6HotelDetails from "./onboardingsteps/Step6HotelDetails";
import Step7Amenities from "./onboardingsteps/Step7Amenities";
import Step8Documents from "./onboardingsteps/Step8Documents";
import Step9Review from "./onboardingsteps/Step9Review";

const STEPS = [
  { id: 1, title: "Basic Information", icon: Hotel },
  { id: 2, title: "Owner Details", icon: User },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Business Settings", icon: Settings },
  { id: 5, title: "Hotel Details", icon: Building2 },
  { id: 6, title: "Amenities", icon: CheckCircle2 },
  { id: 7, title: "Documents", icon: FileText },
  { id: 8, title: "Review & Confirm", icon: ShieldCheck },
  { id: 9, title: "Choose Plan", icon: CreditCard },
];

const ProgressHeader = ({ step }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
        {STEPS.find((s) => s.id === step)?.title}
      </h2>
      <p className="text-sm font-bold text-slate-400">
        Step {step} of 9{" "}
        <span className="ml-2 text-indigo-600">
          {Math.round((step / 9) * 100)}%
        </span>
      </p>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(step / 9) * 100}%` }}
        className="h-full bg-indigo-600"
      />
    </div>
  </div>
);

const WhySection = ({ title, items }) => (
  <div className="hidden xl:block w-[300px] shrink-0">
    <div className="glass-card p-6 rounded-lg border-indigo-100 dark:border-indigo-500/10 bg-indigo-50/30">
      <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-600" />
        {title}
      </h4>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm text-slate-600 dark:text-slate-400"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-6 border-t border-indigo-100/50">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          &quot;Your information is safe with us and will never be shared.&quot;
        </p>
      </div>
    </div>
  </div>
);

function OnboardingContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { formData, updateFormData, resetFormData } = useOnboarding();
  const { notify } = useToast();

  const step = parseInt(searchParams.get("step") || "1");
  const editId = searchParams.get("edit");
  const [isInitializing, setIsInitializing] = useState(!!editId);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Razorpay payment state for final step
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Auto-reset form data and move to step 1 on page refresh or initial visit
    if (!editId) {
      resetFormData();
    }
    if (step !== 1) {
      setStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editId) return;

    let isMounted = true;
    const fetchHotelForEdit = async () => {
      try {
        const response = await HotelRoute.getHotelById(editId);
        const data = response?.data || response;
        if (isMounted && data) {
          const mapDoc = (doc) => 
            doc?.cloudUrl ? { 
              cloudUrl: doc.cloudUrl, 
              publicId: doc.publicId, 
              previewUrl: doc.cloudUrl, 
              type: doc.cloudUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg", 
              name: "Uploaded Document" 
            } : null;

          const mappedData = {
            hotelName: data.hotelName || "",
            hotelType: data.hotelType || "Hotel",
            brandName: data.brandName || "",
            hotelDescription: data.hotelDescription || "",
            establishedYear: data.establishedYear?.toString() || "",
            starRating: data.starRating?.toString() || "3",
            gstNumber: data.gstNumber || "",
            panNumber: data.panNumber || "",
            taxType: data.taxType || "GST",
            website: data.website || "",
            email: data.email || "",
            ownerFullName: data.ownerFullName || "",
            ownerEmail: data.ownerEmail || "",
            mobileNumber: data.mobileNumber || "",
            alternateNumber: data.alternateNumber || "",
            country: data.country || "India",
            state: data.state || "",
            city: data.city || "",
            fullAddress: data.fullAddress || "",
            pincode: data.pincode || "",
            mapLocation: data.mapLocation || "",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            timezone: data.timezone || "Asia/Kolkata",
            currency: data.currency || "INR",
            checkInTime: data.checkInTime || "12:00",
            checkOutTime: data.checkOutTime || "11:00",
            invoicePrefix: data.invoicePrefix || "INV-",
            financialYear: data.financialYear || "April-March (FY)",
            dateFormat: data.dateFormat || "DD-MM-YYYY",
            planSelected: data.planSelected?._id || data.planSelected || "premium",
            billingCycle: data.billingCycle || "half-yearly",
            couponCode: data.couponCode || "",
            totalRooms: data.totalRooms?.toString() || "",
            totalFloors: data.totalFloors?.toString() || "",
            maxGuests: data.maxGuests?.toString() || "",
            roomTypes: data.roomTypes?.map(r => r._id || r) || [],
            amenities: data.amenities || [],
            staff: data.staff || [],
            hotelImages: Array.isArray(data.hotelImages) ? data.hotelImages.map(mapDoc).filter(Boolean) : [],
            hotelLogo: mapDoc(data.hotelLogo),
            documents: {
              gstCertificate: mapDoc(data.documents?.gstCertificate),
              panCard: mapDoc(data.documents?.panCard),
              hotelLicense: mapDoc(data.documents?.hotelLicense),
              ownerId: mapDoc(data.documents?.ownerId),
            }
          };
          updateFormData(mappedData);
        }
      } catch (err) {
        console.error("Failed to load hotel details for edit:", err);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };
    fetchHotelForEdit();

    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const setStep = (newStep) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.hotelName || !formData.hotelType || !formData.hotelDescription || !formData.hotelLogo || !formData.hotelImages?.length) {
          return "Please fill out all required fields (Hotel Name, Type, Description, Logo, and at least 1 Image).";
        }
        break;
      case 2:
        if (!formData.mobileNumber || !formData.ownerFullName || !formData.ownerEmail || (!editId && !formData.password)) {
          return "Please fill out all required contact fields" + (!editId ? " including a password." : ".");
        }
        break;
      case 3:
        if (!formData.country || !formData.state || !formData.city || !formData.fullAddress || !formData.pincode || !formData.latitude || !formData.longitude) {
          return "Please fill out all required location fields, including selecting a location on the map.";
        }
        break;
      case 4:
        if (!formData.currency || !formData.financialYear || !formData.taxType) {
          return "Please fill out all required settings fields.";
        }
        break;
      case 5:
        if (!formData.totalRooms || !formData.totalFloors || !formData.roomTypes?.length) {
          return "Please enter total rooms, floors, and add at least one room type.";
        }
        break;
      case 6:
        if (!formData.amenities?.length) {
          return "Please select at least one amenity.";
        }
        break;
      case 7:
        if (!formData.documents?.gstCertificate || !formData.documents?.panCard || !formData.documents?.hotelLicense || !formData.documents?.ownerId) {
          return "Please upload all required documents.";
        }
        break;
      case 8:
        // Review step: no validation required
        break;
      case 9:
        if (!formData.planSelected || !formData.billingCycle) {
          return "Please select a plan and billing cycle.";
        }
        break;
      default:
        return null;
    }
    return null;
  };

  // Initiate Razorpay payment modal
  const handleInitiatePayment = async () => {
    if (!formData.planSelected || !formData.billingCycle) {
      notify("Please select a plan and billing cycle first.", "error");
      return;
    }

    setIsProcessingPayment(true);
    setSubmitError("");
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const orderRes = await PaymentRoute.createPlanOrder({
        planId: formData.planSelected,
        billingCycle: formData.billingCycle || "yearly",
        hotelName: formData.hotelName,
        ownerEmail: formData.ownerEmail,
      });

      const orderData = orderRes?.data;
      if (!orderData?.orderId) {
        throw new Error("Failed to initialize payment order.");
      }

      const razorpayOptions = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RqJtOyGfDiW0vw",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "VEDANTA TECH SaaS",
        description: `${orderData.planName || "Plan"} - ${orderData.billingCycle || "Yearly"} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.ownerFullName,
          email: formData.ownerEmail,
          contact: formData.mobileNumber,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: function (razorpayResponse) {
          setPaymentVerified(true);
          setPaymentDetails({
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
            amount: orderData.amount / 100,
          });
          setIsProcessingPayment(false);
          notify(`Payment of ₹${orderData.amount / 100} successful! You can now click Complete Setup.`, "success");
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            notify("Payment window closed. Please complete payment to enable Complete Setup.", "info");
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on("payment.failed", function (failResponse) {
        setIsProcessingPayment(false);
        setSubmitError(failResponse?.error?.description || "Payment failed.");
        notify("Payment failed: " + (failResponse?.error?.description || "Transaction declined"), "error");
      });
      rzp.open();
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Payment initiation failed.";
      setSubmitError(message);
      notify(message, "error");
      setIsProcessingPayment(false);
    }
  };

  const nextStep = async () => {
    const errorMsg = validateStep(step);
    if (errorMsg) {
      notify(errorMsg, "error");
      return;
    }

    if (step === 9) {
      if (!editId && !paymentVerified) {
        notify("Payment required: Please click 'Pay with Razorpay' to complete payment first.", "error");
        return;
      }

      setIsSubmitting(true);
      setSubmitError("");
      try {
        // Build payload matching the backend Hotel schema
        const payload = {
          hotelName: formData.hotelName,
          hotelType: formData.hotelType,
          brandName: formData.brandName,
          hotelDescription: formData.hotelDescription,
          establishedYear: formData.establishedYear ? Number(formData.establishedYear) : undefined,
          starRating: formData.starRating,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
          taxType: formData.taxType,
          website: formData.website,
          email: formData.email,
          ownerFullName: formData.ownerFullName,
          ownerEmail: formData.ownerEmail,
          mobileNumber: formData.mobileNumber,
          alternateNumber: formData.alternateNumber,
          password: formData.password,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          fullAddress: formData.fullAddress,
          pincode: formData.pincode,
          mapLocation: formData.mapLocation,
          latitude: formData.latitude ? Number(formData.latitude) : undefined,
          longitude: formData.longitude ? Number(formData.longitude) : undefined,
          timezone: formData.timezone,
          currency: formData.currency,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
          invoicePrefix: formData.invoicePrefix,
          financialYear: formData.financialYear,
          dateFormat: formData.dateFormat,
          planSelected: formData.planSelected,
          billingCycle: formData.billingCycle,
          couponCode: formData.couponCode,
          totalRooms: formData.totalRooms ? Number(formData.totalRooms) : undefined,
          totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
          maxGuests: formData.maxGuests ? Number(formData.maxGuests) : undefined,
          roomTypes: formData.roomTypes,
          amenities: formData.amenities,
          staff: formData.staff,
          documents: {
            gstCertificate: formData.documents?.gstCertificate
              ? { cloudUrl: formData.documents.gstCertificate.cloudUrl, publicId: formData.documents.gstCertificate.publicId }
              : null,
            panCard: formData.documents?.panCard
              ? { cloudUrl: formData.documents.panCard.cloudUrl, publicId: formData.documents.panCard.publicId }
              : null,
            hotelLicense: formData.documents?.hotelLicense
              ? { cloudUrl: formData.documents.hotelLicense.cloudUrl, publicId: formData.documents.hotelLicense.publicId }
              : null,
            ownerId: formData.documents?.ownerId
              ? { cloudUrl: formData.documents.ownerId.cloudUrl, publicId: formData.documents.ownerId.publicId }
              : null,
          },
          hotelImages: Array.isArray(formData.hotelImages)
            ? formData.hotelImages.map((img) => ({ cloudUrl: img.cloudUrl, publicId: img.publicId }))
            : [],
          hotelLogo: formData.hotelLogo
            ? { cloudUrl: formData.hotelLogo.cloudUrl, publicId: formData.hotelLogo.publicId }
            : null,
        };

        if (editId) {
          if (!payload.password) { delete payload.password; }
          await HotelRoute.updateHotel(editId, payload);
          notify("Hotel details updated successfully!", "success");
          resetFormData();
          router.push("/super-admin/hotels");
          setIsSubmitting(false);
          return;
        }

        // Register new hotel
        const registerResult = await HotelRoute.registerHotel(payload);
        const createdHotelId = registerResult?.data?._id || registerResult?.data?.id;

        // Verify payment and record subscription
        if (paymentDetails) {
          try {
            await PaymentRoute.verifyPlanPayment({
              ...paymentDetails,
              hotelId: createdHotelId,
              planId: formData.planSelected,
              billingCycle: formData.billingCycle,
            });
          } catch (verErr) {
            console.warn("Payment verification API warning:", verErr);
          }
        }

        notify("Hotel onboarded & subscription activated successfully!", "success");
        resetFormData();
        router.push("/super-admin/hotels");
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Registration failed. Please try again.";
        setSubmitError(message);
        notify(message, "error");
        console.error("Hotel registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  // Handle location change from map
  const handleLocationChange = (locationData) => {
    updateFormData({
      latitude: locationData.latitude?.toString() || "",
      longitude: locationData.longitude?.toString() || "",
      fullAddress: locationData.address || formData.fullAddress,
      city: locationData.city || formData.city,
      state: locationData.state || formData.state,
      country: locationData.country || formData.country,
      pincode: locationData.pincode || formData.pincode,
    });
  };

  // Handle address search using Google Places
  const handleAddressSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: query,
            types: ["geocode", "establishment"],
          },
          (predictions, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              const geocoder = new window.google.maps.Geocoder();
              const results = [];

              predictions.slice(0, 5).forEach((pred) => {
                geocoder.geocode(
                  { placeId: pred.place_id },
                  (geoResults, geoStatus) => {
                    if (
                      geoStatus === window.google.maps.GeocoderStatus.OK &&
                      geoResults &&
                      geoResults[0]
                    ) {
                      results.push(geoResults[0]);
                      if (
                        results.length === Math.min(5, predictions.length)
                      ) {
                        setSearchResults(results);
                        setShowSearchResults(true);
                      }
                    }
                  },
                );
              });
            } else {
              setSearchResults([]);
              setShowSearchResults(false);
            }
          },
        );
      }
    } catch (error) {
      console.error("Error searching address:", error);
    }
  };

  // Handle search result selection
  const handleSelectLocation = (result) => {
    const lat = result.geometry.location.lat();
    const lng = result.geometry.location.lng();

    handleLocationChange({
      latitude: lat,
      longitude: lng,
      address: result.formatted_address,
      city:
        result.address_components?.find((c) => c.types.includes("locality"))
          ?.long_name || "",
      state:
        result.address_components?.find((c) =>
          c.types.includes("administrative_area_level_1"),
        )?.long_name || "",
      country:
        result.address_components?.find((c) => c.types.includes("country"))
          ?.long_name || "",
      pincode:
        result.address_components?.find((c) => c.types.includes("postal_code"))
          ?.long_name || "",
    });

    setShowSearchResults(false);
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading hotel details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 border-r border-slate-100 dark:border-slate-800 flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">VEDANTA TECH</span>
        </div>

        <nav className="space-y-1">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => isCompleted && setStep(s.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20"
                    : isCompleted
                      ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400",
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className="text-sm font-semibold truncate">
                  {s.title}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 mb-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Need Help?
            </p>
            <p className="text-xs text-slate-400">
              Contact our setup team 24/7
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-bold rounded-xl"
            onClick={() => window.open("/customer-support", "_blank")}
          >
            Contact Support
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-400">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 dark:text-white">Onboarding</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="text-slate-400 hover:text-indigo-600"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="text-slate-400 hover:text-indigo-600 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {formData.ownerFullName || "Admin"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  Owner
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
                {(formData.ownerFullName || "HM").slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-12">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressHeader step={step} />

                  {step === 1 && (
                    <Step1BasicInfo
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 2 && (
                    <Step2OwnerDetails
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 3 && (
                    <Step3Location
                      formData={formData}
                      updateFormData={updateFormData}
                      showSearchResults={showSearchResults}
                      setShowSearchResults={setShowSearchResults}
                      searchResults={searchResults}
                      handleAddressSearch={handleAddressSearch}
                      handleSelectLocation={handleSelectLocation}
                      handleLocationChange={handleLocationChange}
                    />
                  )}
                  {step === 4 && (
                    <Step4BusinessSettings
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 5 && (
                    <Step6HotelDetails
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 6 && (
                    <Step7Amenities
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 7 && (
                    <Step8Documents
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                  {step === 8 && (
                    <Step9Review
                      formData={formData}
                      nextStep={nextStep}
                      setStep={setStep}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {step === 9 && (
                    <Step5Plan
                      formData={formData}
                      updateFormData={updateFormData}
                      isFinalStep={true}
                      onInitiatePayment={handleInitiatePayment}
                      isProcessingPayment={isProcessingPayment}
                      paymentVerified={paymentVerified}
                      paymentDetails={paymentDetails}
                    />
                  )}

                  {/* Error Banner */}
                  {submitError && (
                    <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400">
                      {submitError}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={step === 1 || isSubmitting}
                      className={cn(
                        "h-14 px-8 rounded-xl font-bold text-slate-400 flex gap-2",
                        step === 1 && "opacity-0 invisible",
                      )}
                    >
                      <ArrowLeft className="w-5 h-5" /> Back
                    </Button>

                    {step === 9 ? (
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={(!editId && !paymentVerified) || isSubmitting}
                          className={cn(
                            "h-14 px-12 rounded-xl font-bold shadow-xl flex items-center gap-2 transition-all",
                            !editId && !paymentVerified
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30"
                          )}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>Complete Setup <Check className="w-5 h-5" /></>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="h-14 px-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-500/30 flex gap-2"
                      >
                        Next <ArrowRight className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Why Section Sidebar - Only show on register page */}
            {pathname === "/register" && (
              <>
                {step === 1 && (
                  <WhySection
                    title="Why add basic information?"
                    items={[
                      "Guest Trust & Recognition: A complete profile with real property photos builds immediate confidence.",
                      "Custom Invoices & Branding: Your hotel logo and identity are automatically featured across guest bills.",
                      "Listing Accuracy: Categorizing your property ensures relevant booking options and workflows.",
                    ]}
                  />
                )}
                {step === 2 && (
                  <WhySection
                    title="Why owner details?"
                    items={[
                      "Account Security: Direct verification protects property ownership.",
                      "Important Alerts: Critical notifications regarding bookings and billing.",
                      "Tax Invoicing: Legal compliance requires verified owner details.",
                    ]}
                  />
                )}
                {step === 3 && (
                  <WhySection
                    title="Why precise location?"
                    items={[
                      "Guest Directions: Google Maps integration helps guests reach easily.",
                      "Local Tax Rules: Automatic tax calculation based on jurisdiction.",
                      "Timezone Sync: Accurate check-in and check-out scheduling.",
                    ]}
                  />
                )}
                {step === 4 && (
                  <WhySection
                    title="Why business settings?"
                    items={[
                      "Automated Billing: Customized invoice prefixes and serials.",
                      "Financial Reports: Align reports with your country's financial year.",
                      "Multi-Currency: Display rates in your local operating currency.",
                    ]}
                  />
                )}
                {step === 5 && (
                  <WhySection
                    title="Why room setup?"
                    items={[
                      "Real-time Availability: Prevent double bookings across channels.",
                      "Rate Management: Set different base prices for each room category.",
                      "Housekeeping Flow: Automatic room cleaning assignments.",
                    ]}
                  />
                )}
                {step === 6 && (
                  <WhySection
                    title="Why list amenities?"
                    items={[
                      "Guest Expectation: Clear feature list avoids check-in surprises.",
                      "Feature Matching: Helps corporate and leisure travelers choose your hotel.",
                      "In-room Ordering: Match amenities with POS and room service catalogs.",
                    ]}
                  />
                )}
                {step === 7 && (
                  <WhySection
                    title="Why documents upload?"
                    items={[
                      "Legal Compliance: Mandatory government KYC and business verification.",
                      "Fast Approval: Accelerated onboarding with verified paperwork.",
                      "Security: Encrypted cloud vault exclusively accessible to administrators.",
                    ]}
                  />
                )}
                {step === 8 && (
                  <WhySection
                    title="Why review details?"
                    items={[
                      "Zero Errors: Confirm everything is accurate before activating the hotel.",
                      "Instant Setup: Verify room counts, documents, and contact numbers.",
                      "Smooth Launch: Ready to choose subscription plan in the next step.",
                    ]}
                  />
                )}
                {step === 9 && (
                  <WhySection
                    title="Why choose plan & payment?"
                    items={[
                      "Instant Workspace Activation: Razorpay instant payment verification initializes your multi-tenant portal.",
                      "Transparent Pricing: No hidden setup fees or surprise charges.",
                      "Secure Processing: Protected with 256-bit SSL encryption.",
                    ]}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export function OnboardingView() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

export default OnboardingView;
