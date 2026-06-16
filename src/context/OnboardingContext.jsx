"use client";
import React, { createContext, useContext, useState } from "react";

const initialState = {
  hotelName: "",
  hotelType: "Hotel",
  brandName: "",
  hotelDescription: "",
  establishedYear: "",
  gstNumber: "",
  panNumber: "",
  starRating: "3",
  website: "",
  email: "",
  ownerFullName: "",
  ownerEmail: "",
  mobileNumber: "",
  alternateNumber: "",
  password: "",
  confirmPassword: "",
  country: "India",
  state: "",
  city: "",
  fullAddress: "",
  pincode: "",
  mapLocation: "",
  latitude: "",
  longitude: "",
  timezone: "Asia/Kolkata",
  currency: "INR",
  checkInTime: "12:00",
  checkOutTime: "11:00",
  taxType: "GST",
  invoicePrefix: "INV-",
  financialYear: "April-March (FY)",
  dateFormat: "DD-MM-YYYY",
  planSelected: "premium",
  billingCycle: "half-yearly",
  couponCode: "",
  totalRooms: "",
  totalFloors: "",
  maxGuests: "",
  roomTypes: [],
  amenities: ["WiFi", "Parking", "Restaurant", "Laundry", "Room Service"],
  documents: {
    gstCertificate: null,
    panCard: null,
    hotelLicense: null,
    ownerId: null,
  },
  hotelImages: [],
  hotelLogo: null,
  staff: [
    { fullName: "", role: "Receptionist", email: "", phone: "" },
    { fullName: "", role: "Manager", email: "", phone: "" },
    { fullName: "", role: "Accountant", email: "", phone: "" },
  ],
};

const OnboardingContext = createContext(undefined);

export const OnboardingProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialState);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialState);
  };

  return (
    <OnboardingContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
