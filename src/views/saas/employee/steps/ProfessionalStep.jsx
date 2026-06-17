"use client";
import React, { useEffect, useState } from "react";
import { useEmployeeContext } from "@/context/employee.contex";
import { Roles } from "../../../../routes/saas/role/role.route";
export default function ProfessionalStep() {
  const { formData, updateFormData } = useEmployeeContext();
 const [allRole, setAllRole] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

    const getAllRoles = async () => {
      const result = await Roles.getAllRoles();
      setAllRole(result?.data || []);
      console.log("All Roles:", result);
    };
  
    useEffect(() => {
      const fetchRoles = async () => {
        await getAllRoles();
      };

      fetchRoles();
    }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Role</label>
          <select 
            name="roleId"
            value={formData.roleId || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select a role</option>
            {allRole.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Department</label>
          <select 
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select Department</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Front Desk">Front Desk</option>
            <option value="Management">Management</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Marketing">Marketing</option>
            <option value="Support">Support</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Designation</label>
          <input 
            type="text" 
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="Senior Housekeeper"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Joining Date</label>
          <input 
            type="date" 
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
          <select 
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Shift</label>
          <select 
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select Shift</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Salary Type</label>
          <select 
            name="salaryType"
            value={formData.salaryType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select Salary Type</option>
            <option value="Hourly">Hourly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Salary Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400">$</span>
            <input 
              type="number" 
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
