// ============================================================================
// Paliwal Secure - Programmatic SEO Engine
// Generates comprehensive SEO page data for every meaningful combination
// of product categories × locations × conditions
// ============================================================================

// ============================================================================
// PRODUCT CATEGORIES (all insurance verticals)
// ============================================================================
export interface SEOProductCategory {
  slug: string;
  name: string;
  nameHindi: string;
  description: string;
  keywords: string[];
  icon: string;
  avgPremium: string;
  sumInsuredRange: string;
  featuredPlans: string[];
  faqs: { q: string; a: string }[];
}

export const productCategories: SEOProductCategory[] = [
  {
    slug: 'health-insurance',
    name: 'Health Insurance',
    nameHindi: 'स्वास्थ्य बीमा',
    description: 'Compare the best health insurance plans in India. Cashless treatment at 10,000+ hospitals, coverage for pre-existing diseases, maternity benefits, and Ayushman Bharat top-up options.',
    keywords: ['health insurance india', 'medical insurance plans', 'family floater health plan', 'cashless health insurance', 'health insurance premium calculator', 'best health insurance 2026', 'IRDAI health insurance'],
    icon: '🏥',
    avgPremium: '₹499/mo',
    sumInsuredRange: '₹3L – ₹1Cr',
    featuredPlans: ['Acko Health', 'HDFC ERGO Optima Secure', 'Star Health Comprehensive', 'Niva Bupa ReAssure'],
    faqs: [
      { q: 'What is the waiting period for health insurance in India?', a: 'Initial waiting period is 30 days. Pre-existing diseases have 24-48 months waiting period as per IRDAI guidelines. Day 1 PED cover is available from select insurers like Aditya Birla.' },
      { q: 'Can I get health insurance with pre-existing diabetes?', a: 'Yes! IRDAI mandates that pre-existing diseases must be covered after the waiting period (max 36 months under 2024 guidelines). Some plans like Aditya Birla Activ One offer Day 1 PED cover.' },
      { q: 'What is the claim settlement ratio for health insurance?', a: 'Top insurers like Niva Bupa (100%), Acko (99.98%), and Star Health (99.81%) have excellent claim settlement ratios. Always check the IRDAI annual report for latest CSR data.' },
    ],
  },
  {
    slug: 'life-insurance',
    name: 'Life Insurance',
    nameHindi: 'जीवन बीमा',
    description: 'Protect your family with the best term insurance plans in India. Compare claim settlement ratios, premium rates, and riders from LIC, HDFC Life, Max Life, and more.',
    keywords: ['term insurance india', 'life insurance plans', 'best term plan 2026', 'LIC term insurance', 'HDFC Life Click2Protect', 'claim settlement ratio life insurance', 'cheap term insurance'],
    icon: '🧬',
    avgPremium: '₹999/mo',
    sumInsuredRange: '₹25L – ₹10Cr',
    featuredPlans: ['HDFC Life Click2Protect', 'Max Life Smart Term', 'SBI Life eShield', 'LIC Jeevan Amar'],
    faqs: [
      { q: 'How much term insurance cover do I need?', a: 'A general rule is 10-15 times your annual income. For example, if you earn ₹10L/year, aim for ₹1-1.5 Cr cover. Consider liabilities, dependents, and future goals.' },
      { q: 'Which life insurance company has the highest claim settlement ratio?', a: 'HDFC Life (99.97%), Max Life (99.08%), and SBI Life (98.50%) have the highest CSR as per IRDAI 2024-25 report. LIC has 95.55% CSR but massive AUM of ₹50L Cr.' },
      { q: 'Is term insurance better than endowment plans?', a: 'For pure protection, term insurance is far better — lower premium, higher cover. Endowment plans mix insurance + savings but offer lower returns (4-6%) compared to mutual funds (12-15% avg).', },
    ],
  },
  {
    slug: 'motor-insurance',
    name: 'Motor Insurance',
    nameHindi: 'मोटर बीमा',
    description: 'Compare comprehensive car and bike insurance plans. Zero depreciation add-ons, engine protection, roadside assistance, and instant claims from top Indian insurers.',
    keywords: ['car insurance india', 'two wheeler insurance', 'bike insurance online', 'zero depreciation cover', 'comprehensive motor insurance', 'third party insurance', 'NCB discount motor'],
    icon: '🚗',
    avgPremium: '₹1,599/yr',
    sumInsuredRange: '₹30K – ₹50L',
    featuredPlans: ['Acko Car Insurance', 'HDFC ERGO Motor', 'ICICI Lombard Motor', 'Digit Motor'],
    faqs: [
      { q: 'Is third party insurance mandatory in India?', a: 'Yes! Under the Motor Vehicles Act 1988, third party insurance is compulsory for all vehicles. Driving without it can result in fines up to ₹2,000 and/or imprisonment up to 3 months.' },
      { q: 'What is zero depreciation in car insurance?', a: 'Zero depreciation (bumper-to-bumper) cover ensures you get full claim amount without any depreciation deduction on parts. Essential for new cars (0-5 years old).' },
      { q: 'How does No Claim Bonus work in motor insurance?', a: 'NCB gives 20-50% discount on own damage premium for claim-free years. It transfers to new car/insurer. NCB protection add-on preserves NCB even after small claims.' },
    ],
  },
  {
    slug: 'travel-insurance',
    name: 'Travel Insurance',
    nameHindi: 'यात्रा बीमा',
    description: 'International and domestic travel insurance starting ₹449/trip. Covers medical emergencies, baggage loss, trip cancellation, passport loss, and COVID-19 treatment abroad.',
    keywords: ['travel insurance india', 'international travel insurance', 'schengen visa insurance', 'trip cancellation cover', 'baggage loss insurance', 'travel health insurance', 'cheapest travel insurance'],
    icon: '✈️',
    avgPremium: '₹449/trip',
    sumInsuredRange: '$50K – $10L',
    featuredPlans: ['Tata AIG Travel Guard', 'ICICI Lombard Travel', 'Digit Travel Insurance', 'Bajaj Allianz Travel Companion'],
    faqs: [
      { q: 'Do I need travel insurance for Schengen visa?', a: 'Yes! Schengen countries require travel insurance with minimum €30,000 medical coverage. Tata AIG, Bajaj Allianz, and Digit offer Schengen-compliant plans.' },
      { q: 'Does travel insurance cover COVID-19?', a: 'Most comprehensive travel insurance plans now cover COVID-19 treatment abroad. Digit Travel and ICICI Lombard specifically include pandemic coverage.' },
      { q: 'What is not covered in travel insurance?', a: 'Common exclusions: pre-existing conditions (without rider), adventure sports (without add-on), self-inflicted injuries, travelling against medical advice, and war/nuclear risks.' },
    ],
  },
  {
    slug: 'home-insurance',
    name: 'Home Insurance',
    nameHindi: 'गृह बीमा',
    description: 'Protect your home and belongings against fire, theft, natural disasters, and burglary. Cover both structure and contents with affordable premiums starting ₹150/month.',
    keywords: ['home insurance india', 'house insurance', 'property insurance', 'fire insurance', 'burglary insurance', 'earthquake insurance', 'renters insurance india'],
    icon: '🏠',
    avgPremium: '₹150/mo',
    sumInsuredRange: '₹5L – ₹5Cr',
    featuredPlans: ['HDFC ERGO Home', 'ICICI Lombard Home', 'Bajaj Allianz Home', 'New India Assurance Home'],
    faqs: [
      { q: 'What does home insurance cover in India?', a: 'Home insurance covers the building structure and/or contents against fire, theft, natural disasters (with add-on), burglary, riot, and terrorism. Both structure and contents can be insured separately.' },
      { q: 'Can tenants buy home insurance?', a: 'Yes! Tenants should buy contents insurance to protect their belongings. The building structure is the landlord\'s responsibility.' },
      { q: 'Is earthquake damage covered in home insurance?', a: 'Earthquake cover is available as an add-on or part of the natural disaster extension. It\'s not included in basic fire insurance — you must specifically opt for it.' },
    ],
  },
  {
    slug: 'cyber-insurance',
    name: 'Cyber Insurance',
    nameHindi: 'साइबर बीमा',
    description: 'Protect yourself from online fraud, identity theft, cyber stalking, and digital payment fraud. Cyber insurance plans starting ₹250/month for individuals and small businesses.',
    keywords: ['cyber insurance india', 'online fraud protection', 'identity theft insurance', 'cyber security insurance', 'digital payment fraud cover', 'cyber liability insurance', 'UPI fraud insurance'],
    icon: '🔒',
    avgPremium: '₹400/mo',
    sumInsuredRange: '₹2.5L – ₹15L',
    featuredPlans: ['Tata AIG CyberEdge', 'Bajaj Allianz Cyber Safe', 'ICICI Lombard Cyber', 'Digit Cyber Insurance'],
    faqs: [
      { q: 'What does cyber insurance cover?', a: 'Cyber insurance covers identity theft, online fraud, phishing attacks, social media hacking, cyber stalking, UPI/digital payment fraud, and data breach liability.' },
      { q: 'Is cyber insurance needed for individuals?', a: 'With rising UPI fraud (₹63K Cr lost in 2023-24), cyber insurance is essential for anyone using digital payments, online banking, or social media. Plans start from just ₹250/month.' },
      { q: 'How to claim cyber insurance?', a: 'Report the incident → File FIR → Submit digital evidence (screenshots, transaction IDs) → Insurer investigation → Settlement. Digital-first insurers like Acko and Digit settle within 5-7 days.' },
    ],
  },
  {
    slug: 'micro-insurance',
    name: 'Micro Insurance',
    nameHindi: 'सूक्ष्म बीमा',
    description: 'Government-backed affordable insurance schemes: PMJJBY (₹436/yr), PMSBY (₹20/yr), Ayushman Bharat (Free ₹5L cover). Small premium, big protection for every Indian.',
    keywords: ['micro insurance india', 'PMJJBY', 'PMSBY', 'Ayushman Bharat', 'government insurance schemes', 'jan dhan insurance', 'pradhan mantri bima yojana'],
    icon: '🌾',
    avgPremium: '₹36/mo',
    sumInsuredRange: '₹1L – ₹5L',
    featuredPlans: ['PMJJBY – ₹2L Life Cover', 'PMSBY – ₹2L Accident Cover', 'Ayushman Bharat – Free ₹5L Health', 'Atal Pension Yojana'],
    faqs: [
      { q: 'How to enroll in PMJJBY?', a: 'PMJJBY enrollment is through your bank account. Visit your bank branch or use net banking to opt in. Premium ₹436/year is auto-debited from your savings account.' },
      { q: 'Is Ayushman Bharat really free?', a: 'Yes! Ayushman Bharat provides ₹5 lakh per family per year health cover completely free for eligible families. Check eligibility at pmjay.gov.in using your Aadhaar/Ration card.' },
      { q: 'What is the difference between PMJJBY and PMSBY?', a: 'PMJJBY covers death from any cause (₹2L for ₹436/yr). PMSBY covers accidental death/disability (₹2L for ₹20/yr). Both are auto-debited from bank accounts.' },
    ],
  },
  {
    slug: 'pet-insurance',
    name: 'Pet Insurance',
    nameHindi: 'पालतू बीमा',
    description: 'Insurance for your furry family members. Cover veterinary expenses, surgeries, hospitalization, and accidents for dogs and cats. Starting ₹300/month.',
    keywords: ['pet insurance india', 'dog insurance', 'cat insurance', 'veterinary insurance', 'pet health plan', 'animal insurance india'],
    icon: '🐾',
    avgPremium: '₹300/mo',
    sumInsuredRange: '₹30K – ₹5L',
    featuredPlans: ['Future Generali Pet', 'Digit Pet Insurance', 'Bajaj Allianz Pet', 'Pawtect Pet Cover'],
    faqs: [
      { q: 'Is pet insurance available in India?', a: 'Yes! Several insurers now offer pet insurance including Future Generali, Bajaj Allianz, and Digit. Coverage includes veterinary expenses, surgeries, and accidental injury.' },
      { q: 'What animals are covered under pet insurance?', a: 'Most Indian pet insurance plans cover dogs and cats. Some plans are breed-specific. Exotic pets may require specialized coverage.' },
      { q: 'Does pet insurance cover pre-existing conditions?', a: 'Generally no. Pre-existing conditions are excluded. However, some insurers cover them after a waiting period of 12-24 months.' },
    ],
  },
  {
    slug: 'crop-insurance',
    name: 'Crop Insurance',
    nameHindi: 'फसल बीमा',
    description: 'Protect your crops against drought, flood, pest attack, and natural calamities with PMFBY and weather-based crop insurance. Kisan ki mehnat ka insured fasal.',
    keywords: ['crop insurance india', 'PMFBY', 'fasal bima', 'kisan insurance', 'weather based crop insurance', 'agriculture insurance', 'pradhan mantri fasal bima'],
    icon: '🌾',
    avgPremium: '2% of SI',
    sumInsuredRange: '₹50K – ₹5L/acre',
    featuredPlans: ['PMFBY – Government Subsidized', 'WBCIS – Weather Based', 'Revenue Insurance', 'Parametric Insurance'],
    faqs: [
      { q: 'How to apply for PMFBY crop insurance?', a: 'Apply through your bank branch, CSC center, or the PMFBY portal before the season cut-off date. Kharif: June-July, Rabi: October-November.' },
      { q: 'What is the premium rate under PMFBY?', a: 'Kharif crops: 2% of sum insured, Rabi crops: 1.5%, Commercial/horticulture: 5%. Government subsidizes the remaining premium.' },
      { q: 'What risks are covered under crop insurance?', a: 'Drought, flood, hailstorm, pest attack, cyclone, landslide, and post-harvest losses (up to 14 days). WBCIS also covers adverse weather parameters.' },
    ],
  },
  {
    slug: 'marine-insurance',
    name: 'Marine Insurance',
    nameHindi: 'समुद्री बीमा',
    description: 'Comprehensive marine cargo and hull insurance for importers, exporters, and shipping businesses. Cover transit risks, cargo damage, and freight losses.',
    keywords: ['marine insurance india', 'cargo insurance', 'transit insurance', 'hull insurance', 'shipping insurance', 'import export insurance', 'freight insurance'],
    icon: '🚢',
    avgPremium: '0.1-0.5% of SI',
    sumInsuredRange: '₹1L – ₹100Cr',
    featuredPlans: ['New India Assurance Marine', 'ICICI Lombard Marine', 'Tata AIG Marine', 'Bajaj Allianz Marine'],
    faqs: [
      { q: 'What does marine insurance cover?', a: 'Marine insurance covers loss/damage to cargo during transit (sea, air, road, rail), hull damage, freight liability, and warehouse-to-warehouse risks.' },
      { q: 'Is marine insurance mandatory for imports/exports?', a: 'While not legally mandatory, it is strongly recommended and often required by banks for letter of credit. CIF contracts require the seller to arrange marine insurance.' },
      { q: 'What types of marine insurance are available?', a: 'Three main types: Cargo Insurance (goods in transit), Hull Insurance (ship/vessel), and Freight Insurance (loss of freight revenue). Open cover for regular shipments.' },
    ],
  },
  {
    slug: 'senior-citizen-insurance',
    name: 'Senior Citizen Insurance',
    nameHindi: 'वरिष्ठ नागरिक बीमा',
    description: 'Specialized health insurance for senior citizens (60+ years). Cover pre-existing diseases, chronic conditions, and hospitalization with dedicated senior plans.',
    keywords: ['senior citizen health insurance', 'health insurance for parents', 'old age insurance', 'senior citizen mediclaim', 'insurance above 60 years', 'Varistha Mediclaim'],
    icon: '👴',
    avgPremium: '₹1,200/mo',
    sumInsuredRange: '₹1L – ₹25L',
    featuredPlans: ['Star Health Senior', 'New India Assurance Senior', 'Bajaj Allianz Silver Health', 'Oriental Varistha'],
    faqs: [
      { q: 'Can I get health insurance at age 65+?', a: 'Yes! Several insurers offer plans up to age 80-90. Star Health, New India Assurance, and Bajaj Allianz have dedicated senior citizen plans with entry age up to 80.' },
      { q: 'What is the co-payment clause for senior citizens?', a: 'Most senior citizen plans have 10-30% co-payment. This means you pay a percentage of the claim amount. Compare co-pay percentages before choosing a plan.' },
      { q: 'Does Section 80D give extra tax benefit for senior citizens?', a: 'Yes! Under Section 80D, senior citizens get ₹50,000 deduction for health insurance premium (vs ₹25,000 for others). Additional ₹50,000 for parents\' health insurance.' },
    ],
  },
  {
    slug: 'critical-illness-insurance',
    name: 'Critical Illness Insurance',
    nameHindi: 'गंभीर बीमारी बीमा',
    description: 'Lumpsum payout on diagnosis of critical illnesses like cancer, heart disease, kidney failure, and stroke. Independent of hospitalization expenses.',
    keywords: ['critical illness insurance', 'cancer insurance india', 'heart disease insurance', 'lumpsum illness cover', 'dread disease insurance', 'CI rider'],
    icon: '⚕️',
    avgPremium: '₹600/mo',
    sumInsuredRange: '₹5L – ₹1Cr',
    featuredPlans: ['HDFC Life Critical Illness', 'Max Life CI Rider', 'ICICI Pru Heart/Cancer', 'Aditya Birla CI Cover'],
    faqs: [
      { q: 'What diseases are covered under critical illness insurance?', a: 'Commonly covered: Cancer, Heart Attack, Stroke, Kidney Failure, Organ Transplant, Paralysis, Multiple Sclerosis, and Coronary Artery Bypass Surgery. Typically 15-40 conditions listed.' },
      { q: 'How is critical illness insurance different from health insurance?', a: 'Health insurance pays hospital bills (reimbursement). CI insurance pays a lumpsum on diagnosis regardless of treatment cost. You can use the money for anything — treatment, lifestyle, income replacement.' },
      { q: 'Can I buy critical illness as a standalone plan?', a: 'Yes! CI insurance is available as both a standalone policy and a rider with life/health insurance. Standalone plans typically offer higher sum insured and more covered conditions.' },
    ],
  },
];

// ============================================================================
// TOP 100 INDIAN CITIES (for location-based SEO pages)
// ============================================================================
export const locations: { slug: string; name: string; state: string; population: string; tier: string }[] = [
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', population: '12.5M', tier: 'Tier-1' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi', population: '11M', tier: 'Tier-1' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', population: '8.4M', tier: 'Tier-1' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', population: '6.8M', tier: 'Tier-1' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', population: '7.1M', tier: 'Tier-1' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', population: '4.5M', tier: 'Tier-1' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', population: '3.1M', tier: 'Tier-1' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', population: '5.6M', tier: 'Tier-1' },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', population: '3.1M', tier: 'Tier-1' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat', population: '4.5M', tier: 'Tier-1' },
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', population: '2.8M', tier: 'Tier-1' },
  { slug: 'kota', name: 'Kota', state: 'Rajasthan', population: '1M', tier: 'Tier-2' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra', population: '2.4M', tier: 'Tier-2' },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh', population: '2M', tier: 'Tier-2' },
  { slug: 'thane', name: 'Thane', state: 'Maharashtra', population: '1.8M', tier: 'Tier-2' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', population: '1.8M', tier: 'Tier-2' },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', population: '1.7M', tier: 'Tier-2' },
  { slug: 'patna', name: 'Patna', state: 'Bihar', population: '1.7M', tier: 'Tier-2' },
  { slug: 'vadodara', name: 'Vadodara', state: 'Gujarat', population: '1.7M', tier: 'Tier-2' },
  { slug: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', population: '1.6M', tier: 'Tier-2' },
  { slug: 'ludhiana', name: 'Ludhiana', state: 'Punjab', population: '1.6M', tier: 'Tier-2' },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh', population: '1.6M', tier: 'Tier-2' },
  { slug: 'nashik', name: 'Nashik', state: 'Maharashtra', population: '1.5M', tier: 'Tier-2' },
  { slug: 'faridabad', name: 'Faridabad', state: 'Haryana', population: '1.4M', tier: 'Tier-2' },
  { slug: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', population: '1.3M', tier: 'Tier-2' },
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat', population: '1.3M', tier: 'Tier-2' },
  { slug: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', population: '1.2M', tier: 'Tier-2' },
  { slug: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', population: '1.2M', tier: 'Tier-2' },
  { slug: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra', population: '1.2M', tier: 'Tier-2' },
  { slug: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', population: '1.2M', tier: 'Tier-2' },
  { slug: 'amritsar', name: 'Amritsar', state: 'Punjab', population: '1.1M', tier: 'Tier-2' },
  { slug: 'navi-mumbai', name: 'Navi Mumbai', state: 'Maharashtra', population: '1.1M', tier: 'Tier-2' },
  { slug: 'allahabad', name: 'Prayagraj', state: 'Uttar Pradesh', population: '1.1M', tier: 'Tier-2' },
  { slug: 'ranchi', name: 'Ranchi', state: 'Jharkhand', population: '1.1M', tier: 'Tier-2' },
  { slug: 'howrah', name: 'Howrah', state: 'West Bengal', population: '1.1M', tier: 'Tier-2' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', population: '1.6M', tier: 'Tier-2' },
  { slug: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', population: '1.1M', tier: 'Tier-2' },
  { slug: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', population: '1.1M', tier: 'Tier-2' },
  { slug: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', population: '1M', tier: 'Tier-2' },
  { slug: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', population: '1M', tier: 'Tier-2' },
  { slug: 'madurai', name: 'Madurai', state: 'Tamil Nadu', population: '1M', tier: 'Tier-2' },
  { slug: 'raipur', name: 'Raipur', state: 'Chhattisgarh', population: '1M', tier: 'Tier-2' },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala', population: '600K', tier: 'Tier-2' },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', population: '960K', tier: 'Tier-2' },
  { slug: 'guwahati', name: 'Guwahati', state: 'Assam', population: '960K', tier: 'Tier-2' },
  { slug: 'solapur', name: 'Solapur', state: 'Maharashtra', population: '950K', tier: 'Tier-2' },
  { slug: 'hubli', name: 'Hubli-Dharwad', state: 'Karnataka', population: '940K', tier: 'Tier-2' },
  { slug: 'mysore', name: 'Mysore', state: 'Karnataka', population: '920K', tier: 'Tier-2' },
  { slug: 'tiruchirappalli', name: 'Tiruchirappalli', state: 'Tamil Nadu', population: '910K', tier: 'Tier-2' },
  { slug: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', population: '880K', tier: 'Tier-2' },
  { slug: 'salem', name: 'Salem', state: 'Tamil Nadu', population: '830K', tier: 'Tier-2' },
  { slug: 'warangal', name: 'Warangal', state: 'Telangana', population: '810K', tier: 'Tier-3' },
  { slug: 'mangalore', name: 'Mangalore', state: 'Karnataka', population: '500K', tier: 'Tier-3' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana', population: '880K', tier: 'Tier-2' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh', population: '640K', tier: 'Tier-2' },
  { slug: 'bhiwadi', name: 'Bhiwadi', state: 'Rajasthan', population: '300K', tier: 'Tier-3' },
  { slug: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', population: '580K', tier: 'Tier-3' },
  { slug: 'haridwar', name: 'Haridwar', state: 'Uttarakhand', population: '230K', tier: 'Tier-3' },
  { slug: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', population: '100K', tier: 'Tier-3' },
  { slug: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', population: '170K', tier: 'Tier-3' },
  { slug: 'darjeeling', name: 'Darjeeling', state: 'West Bengal', population: '120K', tier: 'Tier-3' },
  { slug: 'udaipur', name: 'Udaipur', state: 'Rajasthan', population: '450K', tier: 'Tier-3' },
  { slug: 'pushkar', name: 'Pushkar', state: 'Rajasthan', population: '22K', tier: 'Tier-3' },
  { slug: 'ajmer', name: 'Ajmer', state: 'Rajasthan', population: '540K', tier: 'Tier-3' },
  { slug: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', population: '2.8M', tier: 'Tier-2' },
  { slug: 'bikaner', name: 'Bikaner', state: 'Rajasthan', population: '640K', tier: 'Tier-3' },
  { slug: 'jhansi', name: 'Jhansi', state: 'Uttar Pradesh', population: '500K', tier: 'Tier-3' },
  { slug: 'gorakhpur', name: 'Gorakhpur', state: 'Uttar Pradesh', population: '670K', tier: 'Tier-3' },
  { slug: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh', population: '900K', tier: 'Tier-3' },
  { slug: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh', population: '870K', tier: 'Tier-3' },
  { slug: 'moradabad', name: 'Moradabad', state: 'Uttar Pradesh', population: '890K', tier: 'Tier-3' },
  { slug: 'panipat', name: 'Panipat', state: 'Haryana', population: '440K', tier: 'Tier-3' },
  { slug: 'karnal', name: 'Karnal', state: 'Haryana', population: '300K', tier: 'Tier-3' },
  { slug: 'ambala', name: 'Ambala', state: 'Haryana', population: '200K', tier: 'Tier-3' },
  { slug: 'hisar', name: 'Hisar', state: 'Haryana', population: '300K', tier: 'Tier-3' },
  { slug: 'rohtak', name: 'Rohtak', state: 'Haryana', population: '370K', tier: 'Tier-3' },
  { slug: 'trivandrum', name: 'Thiruvananthapuram', state: 'Kerala', population: '960K', tier: 'Tier-2' },
  { slug: 'calicut', name: 'Kozhikode', state: 'Kerala', population: '550K', tier: 'Tier-3' },
  { slug: 'thrissur', name: 'Thrissur', state: 'Kerala', population: '320K', tier: 'Tier-3' },
  { slug: 'pondicherry', name: 'Puducherry', state: 'Puducherry', population: '250K', tier: 'Tier-3' },
  { slug: 'vellore', name: 'Vellore', state: 'Tamil Nadu', population: '500K', tier: 'Tier-3' },
  { slug: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh', population: '380K', tier: 'Tier-3' },
  { slug: 'nellore', name: 'Nellore', state: 'Andhra Pradesh', population: '600K', tier: 'Tier-3' },
  { slug: 'trichy', name: 'Tiruchirappalli', state: 'Tamil Nadu', population: '910K', tier: 'Tier-2' },
  { slug: 'erode', name: 'Erode', state: 'Tamil Nadu', population: '520K', tier: 'Tier-3' },
  { slug: 'durgapur', name: 'Durgapur', state: 'West Bengal', population: '580K', tier: 'Tier-3' },
  { slug: 'asansol', name: 'Asansol', state: 'West Bengal', population: '560K', tier: 'Tier-3' },
  { slug: 'siliguri', name: 'Siliguri', state: 'West Bengal', population: '520K', tier: 'Tier-3' },
  { slug: 'jamshedpur', name: 'Jamshedpur', state: 'Jharkhand', population: '630K', tier: 'Tier-3' },
  { slug: 'bokaro', name: 'Bokaro', state: 'Jharkhand', population: '410K', tier: 'Tier-3' },
  { slug: 'cuttack', name: 'Cuttack', state: 'Odisha', population: '610K', tier: 'Tier-3' },
  { slug: 'rourkela', name: 'Rourkela', state: 'Odisha', population: '490K', tier: 'Tier-3' },
  { slug: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh', population: '630K', tier: 'Tier-3' },
  { slug: 'bilaspur', name: 'Bilaspur', state: 'Chhattisgarh', population: '350K', tier: 'Tier-3' },
  { slug: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', population: '1.1M', tier: 'Tier-2' },
  { slug: 'gandhinagar', name: 'Gandhinagar', state: 'Gujarat', population: '210K', tier: 'Tier-3' },
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat', population: '1.3M', tier: 'Tier-2' },
  { slug: 'jamnagar', name: 'Jamnagar', state: 'Gujarat', population: '480K', tier: 'Tier-3' },
  { slug: 'bhavnagar', name: 'Bhavnagar', state: 'Gujarat', population: '530K', tier: 'Tier-3' },
];

// ============================================================================
// CONDITIONS (for condition-based SEO pages)
// ============================================================================
export const conditions: { slug: string; name: string; nameHindi: string; relatedProducts: string[]; description: string }[] = [
  { slug: 'diabetes', name: 'Diabetes', nameHindi: 'मधुमेह', relatedProducts: ['health-insurance', 'critical-illness-insurance', 'senior-citizen-insurance'], description: 'Get insurance coverage even with diabetes. Compare plans that cover diabetes-related hospitalization, complications, and pre-existing disease waiting periods.' },
  { slug: 'hypertension', name: 'Hypertension', nameHindi: 'उच्च रक्तचाप', relatedProducts: ['health-insurance', 'critical-illness-insurance', 'senior-citizen-insurance'], description: 'Hypertension-friendly insurance plans with reasonable waiting periods. Cover heart attacks, strokes, and BP-related complications.' },
  { slug: 'heart-disease', name: 'Heart Disease', nameHindi: 'हृदय रोग', relatedProducts: ['health-insurance', 'critical-illness-insurance', 'life-insurance'], description: 'Insurance for heart patients. Critical illness cover for heart attacks, bypass surgery, and cardiovascular conditions with lumpsum payout.' },
  { slug: 'cancer', name: 'Cancer', nameHindi: 'कैंसर', relatedProducts: ['health-insurance', 'critical-illness-insurance', 'life-insurance'], description: 'Cancer insurance plans covering chemotherapy, radiation, surgery, and hospitalization. Lumpsum payout on diagnosis of any stage cancer.' },
  { slug: 'kidney-disease', name: 'Kidney Disease', nameHindi: 'गुर्दा रोग', relatedProducts: ['health-insurance', 'critical-illness-insurance'], description: 'Insurance coverage for kidney failure, dialysis, and transplant. Critical illness plans provide lumpsum on diagnosis of end-stage renal disease.' },
  { slug: 'asthma', name: 'Asthma', nameHindi: 'अस्थमा', relatedProducts: ['health-insurance'], description: 'Health insurance plans that cover asthma treatment, hospitalization, and respiratory complications. Declare asthma during application for smooth claims.' },
  { slug: 'covid-recovery', name: 'COVID-19 Recovery', nameHindi: 'कोविड-19 से उबरने', relatedProducts: ['health-insurance', 'life-insurance'], description: 'Post-COVID health insurance plans. Cover long COVID complications, lung damage, and related hospitalization. Most insurers now cover COVID-19 treatment.' },
  { slug: 'thyroid', name: 'Thyroid Disorder', nameHindi: 'थायरॉइड', relatedProducts: ['health-insurance', 'critical-illness-insurance'], description: 'Health insurance covering thyroid disorders, medication, and surgery. Declare thyroid condition during policy purchase to avoid claim rejection.' },
  { slug: 'maternity', name: 'Maternity & Pregnancy', nameHindi: 'गर्भावस्था', relatedProducts: ['health-insurance'], description: 'Maternity cover in health insurance: delivery expenses, newborn cover, C-section, and pre/post-natal care. Waiting period typically 12-36 months.' },
  { slug: 'senior-citizens', name: 'Senior Citizens (60+)', nameHindi: 'वरिष्ठ नागरिक', relatedProducts: ['health-insurance', 'senior-citizen-insurance', 'life-insurance', 'critical-illness-insurance'], description: 'Specialized insurance for people above 60 years. Higher sum insured, PED cover, co-payment options, and dedicated senior citizen health plans.' },
  { slug: 'students', name: 'Students', nameHindi: 'छात्र', relatedProducts: ['health-insurance', 'travel-insurance'], description: 'Affordable insurance for college students: health cover, travel insurance for study abroad, and personal accident plans at student-friendly premiums.' },
  { slug: 'nri', name: 'NRI / OCI', nameHindi: 'एनआरआई', relatedProducts: ['health-insurance', 'life-insurance', 'travel-insurance'], description: 'Insurance options for Non-Resident Indians and OCI card holders. Health, life, and travel insurance with Indian address proof.' },
  { slug: 'self-employed', name: 'Self-Employed', nameHindi: 'स्वरोजगार', relatedProducts: ['health-insurance', 'life-insurance', 'cyber-insurance'], description: 'Insurance for freelancers, business owners, and gig workers. No corporate cover = you need personal insurance. Tax benefits under Section 80C/80D.' },
  { slug: 'farmers', name: 'Farmers', nameHindi: 'किसान', relatedProducts: ['crop-insurance', 'micro-insurance', 'health-insurance'], description: 'Kisan insurance: PMFBY crop insurance, Ayushman Bharat free health, PMJJBY life cover, and PMSBY accident cover — all at subsidized rates.' },
  { slug: 'women', name: 'Women-Specific', nameHindi: 'महिला', relatedProducts: ['health-insurance', 'life-insurance', 'critical-illness-insurance'], description: 'Insurance plans designed for women: maternity cover, breast/cervical cancer cover, lower premiums, and women-specific critical illness riders.' },
];

// ============================================================================
// SEO PAGE GENERATION FUNCTIONS
// ============================================================================

export interface SEOPageData {
  url: string;
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  schemaMarkup: Record<string, unknown>;
}

const BASE_URL = 'https://paliwalsecure.in';

/**
 * Generate SEO data for a product landing page
 * URL format: /{product-slug}
 */
export function generateProductPageSEO(product: SEOProductCategory): SEOPageData {
  const url = `/${product.slug}`;
  return {
    url,
    title: `${product.name} India 2026: Best Plans, Coverage & Premium | Paliwal Secure`,
    description: product.description,
    canonical: `${BASE_URL}${url}`,
    keywords: product.keywords,
    ogTitle: `${product.name} Plans India 2026 — Compare & Save | Paliwal Secure`,
    ogDescription: product.description,
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.name} Plans India 2026`,
      description: product.description,
      brand: { '@type': 'Brand', name: 'Paliwal Secure' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: '20',
        highPrice: '15000',
        offerCount: product.featuredPlans.length,
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '2500',
      },
    },
  };
}

/**
 * Generate SEO data for a product × location page
 * URL format: /{product-slug}/{location-slug}
 */
export function generateLocationPageSEO(product: SEOProductCategory, location: typeof locations[0]): SEOPageData {
  const url = `/${product.slug}/${location.slug}`;
  const locationName = location.name;
  return {
    url,
    title: `${product.name} in ${locationName} 2026: Best Plans & Premium | Paliwal Secure`,
    description: `Compare the best ${product.name.toLowerCase()} plans in ${locationName}, ${location.state}. ${product.description} Local network hospitals, agents, and ${location.tier} city premium rates.`,
    canonical: `${BASE_URL}${url}`,
    keywords: [
      ...product.keywords,
      `${product.name.toLowerCase()} ${locationName}`,
      `${product.name.toLowerCase()} ${location.state}`,
      `best ${product.name.toLowerCase()} in ${locationName}`,
      `${product.name.toLowerCase()} ${location.tier} city`,
    ],
    ogTitle: `${product.name} in ${locationName} — Best Plans 2026`,
    ogDescription: `Find the best ${product.name.toLowerCase()} plans in ${locationName}. Compare premiums, coverage, and claim settlement ratios from top insurers.`,
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.name} in ${locationName}`,
      description: `Best ${product.name.toLowerCase()} plans available in ${locationName}, ${location.state}`,
      brand: { '@type': 'Brand', name: 'Paliwal Secure' },
      areaServed: {
        '@type': 'City',
        name: locationName,
        containedInPlace: { '@type': 'State', name: location.state },
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: '20',
        highPrice: '15000',
        availability: 'https://schema.org/InStock',
      },
    },
  };
}

/**
 * Generate SEO data for a product × condition page
 * URL format: /{product-slug}/for-{condition-slug}
 */
export function generateConditionPageSEO(product: SEOProductCategory, condition: typeof conditions[0]): SEOPageData {
  const url = `/${product.slug}/for-${condition.slug}`;
  return {
    url,
    title: `${product.name} for ${condition.name} Patients India 2026 | Paliwal Secure`,
    description: condition.description,
    canonical: `${BASE_URL}${url}`,
    keywords: [
      ...product.keywords,
      `${product.name.toLowerCase()} for ${condition.name.toLowerCase()}`,
      `${product.name.toLowerCase()} ${condition.name.toLowerCase()} india`,
      `${condition.name.toLowerCase()} ${product.name.toLowerCase()} coverage`,
      `best ${product.name.toLowerCase()} ${condition.name.toLowerCase()} patients`,
    ],
    ogTitle: `${product.name} for ${condition.name} — Get Covered 2026`,
    ogDescription: condition.description,
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.name} for ${condition.name} Patients`,
      description: condition.description,
      brand: { '@type': 'Brand', name: 'Paliwal Secure' },
      audience: {
        '@type': 'PeopleAudience',
        suggestedMinAge: '18',
        healthCondition: condition.name,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: '100',
        highPrice: '15000',
        availability: 'https://schema.org/InStock',
      },
    },
  };
}

/**
 * Generate FAQ schema markup for any page
 */
export function generateFAQSchema(faqs: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/**
 * Generate Offer schema markup
 */
export function generateOfferSchema(product: SEOProductCategory): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: `${product.name} — Free Comparison & Quote`,
    description: `Compare ${product.name.toLowerCase()} plans from top Indian insurers. Free AI-powered recommendations.`,
    priceCurrency: 'INR',
    price: '0',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'Paliwal Secure' },
    url: `${BASE_URL}/${product.slug}`,
  };
}

// ============================================================================
// SITEMAP GENERATOR
// ============================================================================

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

/**
 * Generate all sitemap entries for the entire site
 */
export function generateSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // Home page
  entries.push({
    url: BASE_URL,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // Product landing pages
  for (const product of productCategories) {
    entries.push({
      url: `${BASE_URL}/${product.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Product × Location pages (only for top 30 cities to keep sitemap manageable)
    const topLocations = locations.slice(0, 30);
    for (const location of topLocations) {
      // Only generate for relevant product-location combos
      if (product.slug !== 'marine-insurance' || location.tier === 'Tier-1') {
        entries.push({
          url: `${BASE_URL}/${product.slug}/${location.slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // Product × Condition pages
    const relevantConditions = conditions.filter(c => c.relatedProducts.includes(product.slug));
    for (const condition of relevantConditions) {
      entries.push({
        url: `${BASE_URL}/${product.slug}/for-${condition.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Static pages
  entries.push({ url: `${BASE_URL}/policyholder-rights`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.6 });
  entries.push({ url: `${BASE_URL}/knowledge`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7 });

  return entries;
}

/**
 * Generate sitemap XML string
 */
export function generateSitemapXML(): string {
  const entries = generateSitemapEntries();
  const urlset = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTXT(): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml

# Paliwal Secure - India's AI-Powered Insurance Advisor
# Crawl-delay: 1
`;
}

// ============================================================================
// GENERATE STATIC PARAMS (for Next.js pre-rendering)
// ============================================================================

/**
 * Get top N high-priority product page params for pre-rendering
 */
export function getProductStaticParams() {
  return productCategories.map(p => ({ slug: p.slug }));
}

/**
 * Get top N high-priority location page params for pre-rendering
 */
export function getLocationStaticParams(maxLocations = 20) {
  const topProducts = productCategories.slice(0, 6); // Health, Life, Motor, Travel, Home, Cyber
  const topLocs = locations.slice(0, maxLocations);
  const params: { product: string; location: string }[] = [];

  for (const product of topProducts) {
    for (const loc of topLocs) {
      params.push({ product: product.slug, location: loc.slug });
    }
  }
  return params;
}

/**
 * Get condition page params for pre-rendering
 */
export function getConditionStaticParams() {
  const params: { product: string; condition: string }[] = [];
  for (const product of productCategories) {
    const relevantConditions = conditions.filter(c => c.relatedProducts.includes(product.slug));
    for (const condition of relevantConditions) {
      params.push({ product: product.slug, condition: condition.slug });
    }
  }
  return params;
}

/**
 * Count total generated SEO pages
 */
export function getSEOPageCount(): { products: number; locations: number; conditions: number; total: number } {
  const products = productCategories.length;
  const locationPages = productCategories.length * Math.min(locations.length, 30);
  const conditionPages = conditions.reduce((acc, c) => acc + c.relatedProducts.length, 0);
  return {
    products,
    locations: locationPages,
    conditions: conditionPages,
    total: products + locationPages + conditionPages,
  };
}
