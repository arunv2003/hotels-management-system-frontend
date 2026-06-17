"use client";
import React, { createContext, useContext, useState } from "react";


const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    alternatePhone: "",
    password: "",
    profileImage: null,
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    roleId: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentType: "",
    shift: "",
    salaryType: "",
    salary: "",
    aadharNumber: "",
    panNumber: "",
    documents: {}
  });

  console.log("Employee Form Data:", formData);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const setStep = (step) => setCurrentStep(step);

  return (
    <EmployeeContext.Provider value={{ currentStep, formData, updateFormData, nextStep, prevStep, setStep }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used within an EmployeeProvider");
  }
  return context;
};
