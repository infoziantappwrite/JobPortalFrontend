/* eslint-disable no-unused-vars */
import React from 'react';
import Select from 'react-select';

const SelectCategory = ({ form, setForm }) => {
  // 👇 Inline object definition
  const candidateCategories = Object.freeze({
    FRONTEND: "Frontend Development",
    BACKEND: "Backend Development",
    FULLSTACK: "Full Stack Development",
    DEVOPS: "DevOps",
    DATA_SCIENCE: "Data Science",
    MACHINE_LEARNING: "Machine Learning",
    MOBILE: "Mobile App Development",
    QA: "Quality Assurance",
    CYBERSECURITY: "Cybersecurity",
    UI_UX: "UI/UX Design",
    PRODUCT_MANAGEMENT: "Product Management",
    PROJECT_MANAGEMENT: "Project Management",
    CLOUD_ENGINEERING: "Cloud Engineering",
    DIGITAL_MARKETING: "Digital Marketing",
    HUMAN_RESOURCES: "Human Resources",
    BUSINESS_ANALYST: "Business Analysis",
    FINANCE: "Finance",
    RETAIL: "Retail",
    HEALTHCARE: "Healthcare",
    ECOMMERCE: "E-commerce",
    EDUCATION: "Education",
    CONSTRUCTION: "Construction",
    LEGAL: "Legal",
    OTHER: "Other"
  });


  const categoryOptions = Object.entries(candidateCategories).map(([value, label]) => ({
    value: label,
    label,
  }));

  return (
    <Select
      isMulti
      name="categories"
      menuPlacement="top"
      options={categoryOptions}
      className="mt-1"
      classNamePrefix="select"
      value={(form.categories || []).map((cat) => ({
        value: cat,
        label: candidateCategories[cat] || cat,
      }))}
      onChange={(selected) => {
        const values = selected.map((option) => option.value);
        setForm((prev) => ({ ...prev, categories: values }));
      }}
    />
  );
};

export default SelectCategory;
