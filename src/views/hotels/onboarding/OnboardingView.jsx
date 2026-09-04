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
  { id: 1, title: "Basic Information", subtitle: "General property details, star rating & photos", icon: Hotel },
  { id: 2, title: "Owner Details", subtitle: "Primary contact and administrative credentials", icon: User },
  { id: 3, title: "Location", subtitle: "Pinpoint exact address and map coordinates", icon: MapPin },
  { id: 4, title: "Business Settings", subtitle: "Financial year, currency & tax settings", icon: Settings },
  { id: 5, title: "Hotel Details", subtitle: "Room inventory, floors and room types", icon: Building2 },
  { id: 6, title: "Amenities", subtitle: "Select available features & facilities", icon: CheckCircle2 },
  { id: 7, title: "Documents", subtitle: "Upload compliance & verification records", icon: FileText },
  { id: 8, title: "Review & Confirm", subtitle: "Verify information before activation", icon: ShieldCheck },
  { id: 9, title: "Choose Plan", subtitle: "Select your subscription package & pay", icon: CreditCard },
];

const ProgressHeader = ({ step }) => (
  <div className="mb-2 sm:mb-3">
    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
      <span>{STEPS.find((s) => s.id === step)?.title}</span>
    </h2>
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
        if (!formData.ownerFullName || formData.ownerFullName.trim().length < 2) {
          return "Please enter a valid owner full name (minimum 2 characters).";
        }
        if (!formData.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail.trim())) {
          return "Please enter a valid email address.";
        }
        const cleanMobile = String(formData.mobileNumber || "").replace(/\D/g, "");
        if (!cleanMobile || cleanMobile.length !== 10) {
          return "Please enter a valid 10-digit mobile number.";
        }
        if (!editId) {
          if (!formData.password || formData.password.length < 6) {
            return "Please enter a password with at least 6 characters.";
          }
          if (formData.password !== formData.confirmPassword) {
            return "Password and Confirm Password do not match.";
          }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 shrink-0 z-30 sticky top-0">
        {/* Horizontal Modern Stepper Ribbon */}
        <div className="border-t border-slate-800/60 bg-slate-950/40 px-3 sm:px-4 py-2 overflow-x-auto flex items-center gap-1.5 sm:gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            const IconComponent = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => isCompleted && setStep(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-all select-none",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400/40"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 cursor-pointer"
                    : "bg-slate-900/40 text-slate-500 border border-slate-800/50 cursor-not-allowed opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : s.id}
                </div>
                <span className="whitespace-nowrap">{s.title}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="relative bg-slate-900/85 backdrop-blur-2xl border border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/50 overflow-hidden"
              >
                {/* Background ambient light */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Step Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      {React.createElement(STEPS.find((s) => s.id === step)?.icon || Hotel, {
                        className: "w-5 h-5",
                      })}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {STEPS.find((s) => s.id === step)?.title}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {STEPS.find((s) => s.id === step)?.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/60 border border-slate-800 text-slate-300">
                      Step {step} of 9
                    </span>
                  </div>
                </div>

                {/* Step Form Body */}
                <div className="relative z-10">
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
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400">
                    {submitError}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800/80">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1 || isSubmitting}
                    className={cn(
                      "w-full sm:w-auto h-10 px-5 rounded-xl font-semibold border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center gap-2 text-xs sm:text-sm transition-all",
                      step === 1 && "sm:opacity-0 sm:invisible hidden",
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>

                  {step === 9 ? (
                    <div className="w-full sm:w-auto flex items-center gap-2.5">
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={(!editId && !paymentVerified) || isSubmitting}
                        className={cn(
                          "w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm",
                          !editId && !paymentVerified
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/50"
                            : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white shadow-indigo-500/30"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>Complete Setup <Check className="w-4 h-4" /></>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-[0.99]"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
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
