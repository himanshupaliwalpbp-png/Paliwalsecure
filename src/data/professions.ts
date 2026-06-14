export interface Profession {
  slug: string;
  name: string;
  category: string;
  healthLoadingFactor: number; // base=1.0, high risk=1.15-1.30, low risk=0.95-1.0
  healthAdvice: string;
}

export const professions: Profession[] = [
  // ============================================================
  // LOW RISK (0.95 – 1.00)
  // ============================================================
  {
    slug: 'student',
    name: 'Student',
    category: 'Education',
    healthLoadingFactor: 0.95,
    healthAdvice: 'Students generally have lower health risks due to young age and active lifestyle. Consider a base health plan with OPD cover for day-to-day medical needs.',
  },
  {
    slug: 'teacher',
    name: 'Teacher',
    category: 'Education',
    healthLoadingFactor: 0.97,
    healthAdvice: 'Teaching is a low-risk profession. However, vocal strain and stress-related issues are common. A standard health plan with wellness benefits is recommended.',
  },
  {
    slug: 'software-engineer',
    name: 'Software Engineer',
    category: 'IT & Technology',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Sedentary lifestyle increases risk of lifestyle diseases (diabetes, cardiac issues). Choose a plan with annual health check-ups and OPD cover. Consider critical illness rider.',
  },
  {
    slug: 'banker',
    name: 'Banker',
    category: 'Finance',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Desk job with moderate stress levels. Standard health insurance with wellness and mental health coverage is recommended. Annual check-ups advised.',
  },
  {
    slug: 'lawyer',
    name: 'Lawyer',
    category: 'Legal',
    healthLoadingFactor: 1.0,
    healthAdvice: 'High-stress profession with long working hours. Consider a comprehensive health plan with mental health and stress-related coverage.',
  },
  {
    slug: 'chartered-accountant',
    name: 'Chartered Accountant',
    category: 'Finance',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Sedentary profession with seasonal high stress. A standard health plan with wellness benefits and tax-saving advantage under Section 80D is ideal.',
  },
  {
    slug: 'freelancer',
    name: 'Freelancer',
    category: 'Self-Employed',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Irregular income and lack of employer cover make personal health insurance essential. Choose a plan with affordable premiums and tax benefits under Section 80D.',
  },
  {
    slug: 'business-owner',
    name: 'Business Owner',
    category: 'Self-Employed',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Business owners should consider both individual and group health plans. A comprehensive plan with high sum insured and restoration benefit is recommended.',
  },
  {
    slug: 'shopkeeper',
    name: 'Shopkeeper',
    category: 'Retail',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Long standing hours and seasonal stress. A standard health plan with OPD and pharmacy benefits is recommended. Consider family floater for dependants.',
  },
  {
    slug: 'it-consultant',
    name: 'IT Consultant',
    category: 'IT & Technology',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Similar to software engineers, sedentary lifestyle risks apply. Choose a plan with annual health check-ups, OPD, and critical illness cover.',
  },
  {
    slug: 'architect',
    name: 'Architect',
    category: 'Construction & Design',
    healthLoadingFactor: 1.0,
    healthAdvice: 'Mixed desk and site work. Standard health insurance with accident cover is recommended. Consider add-on for site-related injuries.',
  },

  // ============================================================
  // MODERATE RISK (1.05)
  // ============================================================
  {
    slug: 'doctor',
    name: 'Doctor',
    category: 'Healthcare',
    healthLoadingFactor: 1.05,
    healthAdvice: 'Exposure to infectious diseases and high stress. Comprehensive health cover with pandemic/communicable disease cover is essential. High sum insured recommended.',
  },
  {
    slug: 'nurse',
    name: 'Nurse',
    category: 'Healthcare',
    healthLoadingFactor: 1.05,
    healthAdvice: 'High exposure to infections and physically demanding shifts. Choose a plan with communicable disease cover and hospitalization benefits.',
  },
  {
    slug: 'journalist',
    name: 'Journalist',
    category: 'Media',
    healthLoadingFactor: 1.05,
    healthAdvice: 'Field work and travel increase accident risk. Comprehensive health and accident cover recommended. Consider critical illness and personal accident riders.',
  },
  {
    slug: 'chef',
    name: 'Chef',
    category: 'Hospitality',
    healthLoadingFactor: 1.05,
    healthAdvice: 'Long hours in high-temperature environments and risk of burns. Health plan with accident cover and OPD benefits for minor injuries recommended.',
  },
  {
    slug: 'salesperson',
    name: 'Salesperson',
    category: 'Sales & Marketing',
    healthLoadingFactor: 1.05,
    healthAdvice: 'Extensive travel increases accident and health risks. Choose a plan with personal accident cover and cashless hospitalization across India.',
  },
  {
    slug: 'civil-engineer',
    name: 'Civil Engineer',
    category: 'Construction & Design',
    healthLoadingFactor: 1.05,
    healthAdvice: 'Site visits expose to dust and construction hazards. Health plan with respiratory coverage and accident benefits recommended.',
  },

  // ============================================================
  // ELEVATED RISK (1.10 – 1.15)
  // ============================================================
  {
    slug: 'farmer',
    name: 'Farmer',
    category: 'Agriculture',
    healthLoadingFactor: 1.10,
    healthAdvice: 'Exposure to pesticides, heavy machinery, and outdoor conditions. Comprehensive health plan with critical illness and accident cover essential. Consider crop insurance alongside.',
  },
  {
    slug: 'driver',
    name: 'Driver',
    category: 'Transportation',
    healthLoadingFactor: 1.10,
    healthAdvice: 'High accident risk and prolonged sitting. Personal accident cover is mandatory. Choose a plan with accident coverage, hospital cash, and OPD benefits.',
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    category: 'Skilled Trades',
    healthLoadingFactor: 1.10,
    healthAdvice: 'Risk of electrical shocks and falls. Personal accident and health cover with occupational hazard benefits is critical. Ensure disability cover is included.',
  },
  {
    slug: 'mechanic',
    name: 'Mechanic',
    category: 'Skilled Trades',
    healthLoadingFactor: 1.10,
    healthAdvice: 'Exposure to chemicals, heavy equipment, and physical strain. Health plan with accident cover and respiratory benefits recommended.',
  },
  {
    slug: 'retired',
    name: 'Retired',
    category: 'Senior Citizen',
    healthLoadingFactor: 1.10,
    healthAdvice: 'Age-related health risks are higher. Senior citizen health plans with pre-existing disease cover, day-care procedures, and domiciliary treatment are recommended.',
  },
  {
    slug: 'pilot',
    name: 'Pilot',
    category: 'Aviation',
    healthLoadingFactor: 1.15,
    healthAdvice: 'Occupational hazards include radiation exposure and irregular sleep. Choose a high-sum-insured plan with critical illness and mental health coverage.',
  },
  {
    slug: 'factory-worker',
    name: 'Factory Worker',
    category: 'Manufacturing',
    healthLoadingFactor: 1.15,
    healthAdvice: 'Exposure to industrial hazards, noise, and chemicals. Comprehensive health and accident cover with occupational disease benefits is essential.',
  },
  {
    slug: 'police',
    name: 'Police',
    category: 'Law Enforcement',
    healthLoadingFactor: 1.15,
    healthAdvice: 'High physical risk and stress-related health issues. Choose a comprehensive plan with personal accident, critical illness, and mental health coverage.',
  },
  {
    slug: 'fisher',
    name: 'Fisher',
    category: 'Agriculture',
    healthLoadingFactor: 1.15,
    healthAdvice: 'Marine hazards and unpredictable weather increase risk. Personal accident cover and health insurance with emergency evacuation benefits are essential.',
  },

  // ============================================================
  // HIGH RISK (1.20 – 1.30)
  // ============================================================
  {
    slug: 'army',
    name: 'Army Personnel',
    category: 'Defence',
    healthLoadingFactor: 1.20,
    healthAdvice: 'Extreme physical risk and combat exposure. ECHS provides base cover, but supplementary private health insurance with high sum insured and critical illness cover is recommended.',
  },
  {
    slug: 'firefighter',
    name: 'Firefighter',
    category: 'Emergency Services',
    healthLoadingFactor: 1.20,
    healthAdvice: 'High risk of burns, smoke inhalation, and physical injury. Comprehensive health plan with accident cover, respiratory benefits, and disability cover is essential.',
  },
  {
    slug: 'construction-worker',
    name: 'Construction Worker',
    category: 'Construction & Design',
    healthLoadingFactor: 1.20,
    healthAdvice: 'Fall hazards, heavy lifting, and exposure to dust. Personal accident and health cover with disability and hospitalization benefits is critical.',
  },
  {
    slug: 'miner',
    name: 'Miner',
    category: 'Mining',
    healthLoadingFactor: 1.30,
    healthAdvice: 'Extreme occupational hazards including respiratory diseases, cave-ins, and chemical exposure. Highest-level health and accident cover with critical illness and disability benefits is mandatory. Regular health check-ups essential.',
  },
];

// Helper function to find profession by slug
export function getProfessionBySlug(slug: string): Profession | undefined {
  return professions.find((p) => p.slug === slug);
}
