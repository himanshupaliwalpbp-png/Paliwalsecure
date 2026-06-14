/**
 * Programmatic SEO Engine — Paliwal Secure
 *
 * Generates location-specific, condition-specific, and insurance-type-specific
 * pages at scale for maximum long-tail keyword coverage.
 *
 * SEO Rationale:
 * - Programmatic SEO creates hundreds of unique, valuable pages from templates
 * - Each page targets a specific [insurance type] + [condition] + [city] combination
 * - These pages capture "best health insurance for diabetes in Mumbai" type queries
 * - Google rewards comprehensive coverage of a topic space (topical authority)
 * - Local pages dominate "near me" and city-specific insurance searches
 * - City + condition combinations = thousands of unique, high-intent keywords
 *
 * Architecture:
 * - Data arrays: Cities, conditions, insurance types (expandable)
 * - Slug generator: Creates URL-friendly slugs for each combination
 * - Meta generators: Create unique title/description per page
 * - Content generator: Produces structured, unique content per combination
 */

// ============================================================================
// City Data — Top Indian Cities for Insurance SEO
// ============================================================================

export interface CityData {
  name: string
  state: string
  population: number
  lat: number
  lng: number
  pincode: string
}

/**
 * Top 100 Indian cities by population.
 * Each city gets a dedicated local landing page targeting:
 * - "[insurance type] in [city]"
 * - "insurance agent in [city]"
 * - "best [insurance type] [city] [state]"
 *
 * SEO Value: These pages target the ~50% of insurance searches that include
 * a location modifier. Local intent keywords have 3-5x higher conversion rates.
 */
export const topCities: CityData[] = [
  { name: 'Mumbai', state: 'Maharashtra', population: 12442373, lat: 19.076, lng: 72.8777, pincode: '400001' },
  { name: 'Delhi', state: 'Delhi', population: 11034555, lat: 28.6139, lng: 77.209, pincode: '110001' },
  { name: 'Bangalore', state: 'Karnataka', population: 8443675, lat: 12.9716, lng: 77.5946, pincode: '560001' },
  { name: 'Hyderabad', state: 'Telangana', population: 6809970, lat: 17.385, lng: 78.4867, pincode: '500001' },
  { name: 'Ahmedabad', state: 'Gujarat', population: 5577940, lat: 23.0225, lng: 72.5714, pincode: '380001' },
  { name: 'Chennai', state: 'Tamil Nadu', population: 4681087, lat: 13.0827, lng: 80.2707, pincode: '600001' },
  { name: 'Kolkata', state: 'West Bengal', population: 4496694, lat: 22.5726, lng: 88.3639, pincode: '700001' },
  { name: 'Surat', state: 'Gujarat', population: 4467797, lat: 21.1702, lng: 72.8311, pincode: '395001' },
  { name: 'Pune', state: 'Maharashtra', population: 3124458, lat: 18.5204, lng: 73.8567, pincode: '411001' },
  { name: 'Jaipur', state: 'Rajasthan', population: 3073350, lat: 26.9124, lng: 75.7873, pincode: '302001' },
  { name: 'Lucknow', state: 'Uttar Pradesh', population: 2817105, lat: 26.8467, lng: 80.9462, pincode: '226001' },
  { name: 'Kanpur', state: 'Uttar Pradesh', population: 2765348, lat: 26.4499, lng: 80.3319, pincode: '208001' },
  { name: 'Nagpur', state: 'Maharashtra', population: 2405665, lat: 21.1458, lng: 79.0882, pincode: '440001' },
  { name: 'Indore', state: 'Madhya Pradesh', population: 1964086, lat: 22.7196, lng: 75.8577, pincode: '452001' },
  { name: 'Thane', state: 'Maharashtra', population: 1841164, lat: 19.2183, lng: 72.9781, pincode: '400601' },
  { name: 'Bhopal', state: 'Madhya Pradesh', population: 1795648, lat: 23.2599, lng: 77.4126, pincode: '462001' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', population: 1728128, lat: 17.6868, lng: 83.2185, pincode: '530001' },
  { name: 'Patna', state: 'Bihar', population: 1684222, lat: 25.6093, lng: 85.1376, pincode: '800001' },
  { name: 'Vadodara', state: 'Gujarat', population: 1670806, lat: 22.3072, lng: 73.1812, pincode: '390001' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', population: 1648643, lat: 28.6692, lng: 77.4538, pincode: '201001' },
  { name: 'Ludhiana', state: 'Punjab', population: 1618879, lat: 30.901, lng: 75.8573, pincode: '141001' },
  { name: 'Agra', state: 'Uttar Pradesh', population: 1576731, lat: 27.1767, lng: 78.0081, pincode: '282001' },
  { name: 'Nashik', state: 'Maharashtra', population: 1486053, lat: 19.9975, lng: 73.7898, pincode: '422001' },
  { name: 'Faridabad', state: 'Haryana', population: 1404653, lat: 28.4089, lng: 77.3178, pincode: '121001' },
  { name: 'Meerut', state: 'Uttar Pradesh', population: 1305429, lat: 28.9845, lng: 77.7064, pincode: '250001' },
  { name: 'Rajkot', state: 'Gujarat', population: 1280099, lat: 22.3039, lng: 70.8022, pincode: '360001' },
  { name: 'Kota', state: 'Rajasthan', population: 1001751, lat: 25.18, lng: 75.86, pincode: '324001' },
  { name: 'Varanasi', state: 'Uttar Pradesh', population: 1198491, lat: 25.3176, lng: 83.0068, pincode: '221001' },
  { name: 'Srinagar', state: 'Jammu & Kashmir', population: 1180604, lat: 34.0837, lng: 74.7973, pincode: '190001' },
  { name: 'Aurangabad', state: 'Maharashtra', population: 1175116, lat: 19.8762, lng: 75.3433, pincode: '431001' },
  { name: 'Dhanbad', state: 'Jharkhand', population: 1162472, lat: 23.7957, lng: 86.4304, pincode: '826001' },
  { name: 'Amritsar', state: 'Punjab', population: 1132761, lat: 31.634, lng: 74.8723, pincode: '143001' },
  { name: 'Navi Mumbai', state: 'Maharashtra', population: 1120445, lat: 19.033, lng: 73.0297, pincode: '400703' },
  { name: 'Allahabad', state: 'Uttar Pradesh', population: 1112038, lat: 25.4358, lng: 81.8463, pincode: '211001' },
  { name: 'Ranchi', state: 'Jharkhand', population: 1073427, lat: 23.3441, lng: 85.3096, pincode: '834001' },
  { name: 'Howrah', state: 'West Bengal', population: 1072161, lat: 22.576, lng: 88.2634, pincode: '711101' },
  { name: 'Coimbatore', state: 'Tamil Nadu', population: 1050721, lat: 11.0168, lng: 76.9558, pincode: '641001' },
  { name: 'Jabalpur', state: 'Madhya Pradesh', population: 1047073, lat: 23.1815, lng: 79.9864, pincode: '482001' },
  { name: 'Gwalior', state: 'Madhya Pradesh', population: 1013966, lat: 26.2183, lng: 78.1828, pincode: '474001' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', population: 1034000, lat: 16.5062, lng: 80.648, pincode: '520001' },
  { name: 'Jodhpur', state: 'Rajasthan', population: 1032918, lat: 26.2389, lng: 73.0243, pincode: '342001' },
  { name: 'Madurai', state: 'Tamil Nadu', population: 1017865, lat: 9.9252, lng: 78.1198, pincode: '625001' },
  { name: 'Raipur', state: 'Chhattisgarh', population: 1010087, lat: 21.2514, lng: 81.6296, pincode: '492001' },
  { name: 'Kochi', state: 'Kerala', population: 602046, lat: 9.9312, lng: 76.2673, pincode: '682001' },
  { name: 'Chandigarh', state: 'Chandigarh', population: 961587, lat: 30.7333, lng: 76.7794, pincode: '160001' },
  { name: 'Bhubaneswar', state: 'Odisha', population: 881988, lat: 20.2961, lng: 85.8245, pincode: '751001' },
  { name: 'Dehradun', state: 'Uttarakhand', population: 578420, lat: 30.3165, lng: 78.0322, pincode: '248001' },
  { name: 'Guwahati', state: 'Assam', population: 957352, lat: 26.1445, lng: 91.7362, pincode: '781001' },
  { name: 'Mysore', state: 'Karnataka', population: 920550, lat: 12.2958, lng: 76.6394, pincode: '570001' },
  { name: 'Thiruvananthapuram', state: 'Kerala', population: 889762, lat: 8.5241, lng: 76.9366, pincode: '695001' },
  { name: 'Mangalore', state: 'Karnataka', population: 484785, lat: 12.9141, lng: 74.856, pincode: '575001' },
  { name: 'Bareilly', state: 'Uttar Pradesh', population: 903668, lat: 28.367, lng: 79.4304, pincode: '243001' },
  { name: 'Aligarh', state: 'Uttar Pradesh', population: 874408, lat: 27.8974, lng: 78.0887, pincode: '202001' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', population: 847387, lat: 10.7905, lng: 78.7047, pincode: '620001' },
  { name: 'Saharanpur', state: 'Uttar Pradesh', population: 705478, lat: 29.9695, lng: 77.5451, pincode: '247001' },
  { name: 'Tirunelveli', state: 'Tamil Nadu', population: 474838, lat: 8.7139, lng: 77.7567, pincode: '627001' },
  { name: 'Bhiwandi', state: 'Maharashtra', population: 709665, lat: 19.3002, lng: 73.0626, pincode: '421302' },
  { name: 'Solan', state: 'Himachal Pradesh', population: 60000, lat: 30.9045, lng: 77.0959, pincode: '173212' },
  { name: 'Shimla', state: 'Himachal Pradesh', population: 169578, lat: 31.1048, lng: 77.1734, pincode: '171001' },
  { name: 'Udaipur', state: 'Rajasthan', population: 451100, lat: 24.5854, lng: 73.7125, pincode: '313001' },
  { name: 'Ajmer', state: 'Rajasthan', population: 542580, lat: 26.4499, lng: 74.6399, pincode: '305001' },
  { name: 'Jaisalmer', state: 'Rajasthan', population: 65471, lat: 26.9157, lng: 70.9083, pincode: '345001' },
  { name: 'Bikaner', state: 'Rajasthan', population: 644406, lat: 28.0229, lng: 73.3119, pincode: '334001' },
  { name: 'Bhilwara', state: 'Rajasthan', population: 359621, lat: 25.3493, lng: 74.6342, pincode: '311001' },
  { name: 'Alwar', state: 'Rajasthan', population: 341530, lat: 27.553, lng: 76.6344, pincode: '301001' },
  { name: 'Sikar', state: 'Rajasthan', population: 243730, lat: 27.6094, lng: 75.1399, pincode: '332001' },
  { name: 'Pali', state: 'Rajasthan', population: 230075, lat: 25.7711, lng: 73.3234, pincode: '306401' },
  { name: 'Sri Ganganagar', state: 'Rajasthan', population: 248923, lat: 29.9168, lng: 73.8688, pincode: '335001' },
  { name: 'Bharatpur', state: 'Rajasthan', population: 252342, lat: 27.2156, lng: 77.4906, pincode: '321001' },
  { name: 'Chittorgarh', state: 'Rajasthan', population: 138395, lat: 24.8887, lng: 74.6269, pincode: '312001' },
  { name: 'Barmer', state: 'Rajasthan', population: 132917, lat: 25.7625, lng: 71.3966, pincode: '344001' },
  { name: 'Dausa', state: 'Rajasthan', population: 107832, lat: 26.8957, lng: 76.3364, pincode: '303303' },
  { name: 'Hanumangarh', state: 'Rajasthan', population: 155539, lat: 29.5768, lng: 74.3319, pincode: '335512' },
  { name: 'Jhunjhunu', state: 'Rajasthan', population: 137435, lat: 28.1288, lng: 75.3994, pincode: '333001' },
  { name: 'Nagaur', state: 'Rajasthan', population: 109879, lat: 27.2021, lng: 73.7249, pincode: '341001' },
  { name: 'Rajsamand', state: 'Rajasthan', population: 67178, lat: 25.0715, lng: 73.883, pincode: '313324' },
  { name: 'Sawai Madhopur', state: 'Rajasthan', population: 122959, lat: 26.0125, lng: 76.3536, pincode: '322001' },
  { name: 'Sirohi', state: 'Rajasthan', population: 86377, lat: 24.8842, lng: 72.859, pincode: '307001' },
  { name: 'Tonk', state: 'Rajasthan', population: 151440, lat: 26.1662, lng: 75.7886, pincode: '304001' },
  { name: 'Jhalawar', state: 'Rajasthan', population: 66654, lat: 24.5959, lng: 76.1582, pincode: '326001' },
  { name: 'Banswara', state: 'Rajasthan', population: 100128, lat: 23.5429, lng: 74.4423, pincode: '327001' },
  { name: 'Dungarpur', state: 'Rajasthan', population: 69600, lat: 23.8423, lng: 73.7157, pincode: '314001' },
  { name: 'Pratapgarh', state: 'Rajasthan', population: 50114, lat: 24.0313, lng: 74.7823, pincode: '312605' },
  { name: 'Karauli', state: 'Rajasthan', population: 94158, lat: 26.4934, lng: 77.0149, pincode: '322241' },
  { name: 'Baran', state: 'Rajasthan', population: 122904, lat: 25.1018, lng: 76.5153, pincode: '325205' },
  { name: 'Bundi', state: 'Rajasthan', population: 111411, lat: 25.4299, lng: 75.6435, pincode: '323001' },
  { name: 'Churu', state: 'Rajasthan', population: 119846, lat: 28.292, lng: 74.9675, pincode: '331001' },
  { name: 'Dholpur', state: 'Rajasthan', population: 91370, lat: 26.7028, lng: 77.8899, pincode: '328001' },
  { name: 'Jalore', state: 'Rajasthan', population: 436739, lat: 25.1236, lng: 72.1565, pincode: '343001' },
  { name: 'Sriganganagar', state: 'Rajasthan', population: 248923, lat: 29.9168, lng: 73.8688, pincode: '335001' },
  { name: 'Noida', state: 'Uttar Pradesh', population: 642381, lat: 28.5355, lng: 77.391, pincode: '201301' },
  { name: 'Gurgaon', state: 'Haryana', population: 876824, lat: 28.4595, lng: 77.0266, pincode: '122001' },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', population: 1727929, lat: 18.6298, lng: 73.7997, pincode: '411018' },
  { name: 'Hubli-Dharwad', state: 'Karnataka', population: 943857, lat: 15.3647, lng: 75.124, pincode: '580020' },
  { name: 'Tiruppur', state: 'Tamil Nadu', population: 877778, lat: 11.1085, lng: 77.3411, pincode: '641601' },
  { name: 'Moradabad', state: 'Uttar Pradesh', population: 887871, lat: 28.8389, lng: 78.7768, pincode: '244001' },
  { name: 'Bhilai', state: 'Chhattisgarh', population: 625677, lat: 21.1868, lng: 81.3565, pincode: '490006' },
  { name: 'Salem', state: 'Tamil Nadu', population: 831038, lat: 11.6643, lng: 78.146, pincode: '636001' },
]

// ============================================================================
// Medical / Insurance Conditions
// ============================================================================

export interface ConditionData {
  slug: string
  name: string
  nameHi: string
  description: string
}

/**
 * Common medical conditions and insurance-specific scenarios.
 * Each condition creates targeted landing pages for people searching
 * for insurance with specific health needs.
 *
 * SEO Value: "Health insurance for [condition]" queries have extremely
 * high intent — users with medical conditions are actively seeking coverage.
 * These pages convert 3-5x better than generic insurance pages.
 */
export const conditions: ConditionData[] = [
  {
    slug: 'diabetes',
    name: 'Diabetes',
    nameHi: 'डायबिटीज / मधुमेह',
    description: 'Health insurance plans that cover diabetes treatment, insulin, and diabetic complications. Get coverage for pre-existing diabetes with appropriate waiting periods.',
  },
  {
    slug: 'heart-disease',
    name: 'Heart Disease',
    nameHi: 'हृदय रोग / दिल की बीमारी',
    description: 'Insurance plans covering cardiac conditions including coronary artery disease, bypass surgery, and heart attack treatment with cashless hospitalization.',
  },
  {
    slug: 'hypertension',
    name: 'Hypertension / High Blood Pressure',
    nameHi: 'उच्च रक्तचाप / ब्लड प्रेशर',
    description: 'Health insurance for individuals with high blood pressure. Coverage includes regular check-ups, medication, and complications arising from hypertension.',
  },
  {
    slug: 'cancer',
    name: 'Cancer',
    nameHi: 'कैंसर',
    description: 'Specialized cancer insurance and health plans covering chemotherapy, radiation, surgery, and post-treatment care. Critical illness riders also available.',
  },
  {
    slug: 'copd-asthma',
    name: 'COPD / Asthma',
    nameHi: 'सीओपीडी / अस्थमा',
    description: 'Health insurance covering chronic obstructive pulmonary disease and asthma. Includes coverage for inhalers, nebulization, and hospitalization.',
  },
  {
    slug: 'kidney-disease',
    name: 'Kidney Disease',
    nameHi: 'किडनी रोग',
    description: 'Insurance plans covering chronic kidney disease, dialysis, and kidney transplant. Essential coverage for renal patients in India.',
  },
  {
    slug: 'maternity',
    name: 'Maternity / Pregnancy',
    nameHi: 'गर्भावस्था / मातृत्व',
    description: 'Maternity insurance covering normal delivery, C-section, prenatal and postnatal care, and newborn baby coverage from day one.',
  },
  {
    slug: 'senior-citizens',
    name: 'Senior Citizens (60+)',
    nameHi: 'वरिष्ठ नागरिक (60+)',
    description: 'Specialized health insurance for senior citizens with coverage for age-related conditions, day care procedures, and pre-existing diseases.',
  },
  {
    slug: 'pediatric',
    name: 'Pediatric / Children',
    nameHi: 'बच्चों का स्वास्थ्य बीमा',
    description: 'Health insurance plans for children covering vaccinations, congenital conditions, and pediatric hospitalization. Family floater options available.',
  },
  {
    slug: 'mental-health',
    name: 'Mental Health',
    nameHi: 'मानसिक स्वास्थ्य',
    description: 'IRDAI-mandated mental health coverage including depression, anxiety, and therapy sessions. All insurers now required to cover mental illness.',
  },
  {
    slug: 'covid',
    name: 'COVID-19',
    nameHi: 'कोविड-19',
    description: 'COVID-19 coverage including hospitalization, home treatment, and post-COVID complications. All health insurance plans now cover coronavirus treatment.',
  },
  {
    slug: 'hiv-aids',
    name: 'HIV/AIDS',
    nameHi: 'एचआईवी / एड्स',
    description: 'IRDAI-mandated HIV/AIDS coverage. Health insurance cannot deny coverage for HIV-positive individuals as per recent regulatory guidelines.',
  },
  {
    slug: 'obesity',
    name: 'Obesity / Bariatric Surgery',
    nameHi: 'मोटापा / बैरिएट्रिक सर्जरी',
    description: 'Health insurance covering obesity-related conditions and bariatric surgery. Coverage varies by insurer and BMI thresholds.',
  },
  {
    slug: 'eye-dental',
    name: 'Eye and Dental',
    nameHi: 'आंख और दांत',
    description: 'Health insurance with eye and dental coverage including cataract surgery, dental procedures, and vision correction. Available as riders or standalone plans.',
  },
  {
    slug: 'liver-disease',
    name: 'Liver Disease',
    nameHi: 'लिवर रोग / यकृत रोग',
    description: 'Health insurance covering liver conditions including hepatitis, cirrhosis, and liver transplant. Essential coverage for liver patients in India.',
  },
  {
    slug: 'stroke',
    name: 'Stroke / Paralysis',
    nameHi: 'स्ट्रोक / पक्षाघात',
    description: 'Insurance plans covering stroke treatment, rehabilitation, and long-term care. Critical illness riders provide lump sum payout for stroke diagnosis.',
  },
  {
    slug: 'arthritis',
    name: 'Arthritis / Joint Problems',
    nameHi: 'गठिया / जोड़ों का दर्द',
    description: 'Health insurance covering arthritis treatment, joint replacement surgery, and ongoing medication. Coverage for both rheumatoid and osteoarthritis.',
  },
  {
    slug: 'thyroid',
    name: 'Thyroid Disorders',
    nameHi: 'थायरॉइड विकार',
    description: 'Health insurance covering thyroid disorders including hypothyroidism and hyperthyroidism. Medication, diagnosis, and treatment coverage available.',
  },
  {
    slug: 'dengue-malaria',
    name: 'Dengue / Malaria',
    nameHi: 'डेंगू / मलेरिया',
    description: 'Health insurance covering dengue and malaria treatment including hospitalization, platelet transfusion, and ICU charges. Mosquito-borne disease cover.',
  },
  {
    slug: 'mental-illness',
    name: 'Depression / Anxiety',
    nameHi: 'डिप्रेशन / चिंता',
    description: 'IRDAI-mandated mental health coverage including depression, anxiety, OCD, and therapy sessions. All insurers now required to cover mental illness treatment.',
  },
  {
    slug: 'covid-long',
    name: 'Long COVID / Post-COVID',
    nameHi: 'लॉन्ग कोविड / पोस्ट-कोविड',
    description: 'Health insurance covering post-COVID complications including long COVID syndrome, respiratory issues, and cardiac complications after recovery.',
  },
  {
    slug: 'women-health',
    name: "Women's Health",
    nameHi: 'महिला स्वास्थ्य',
    description: "Health insurance plans designed for women covering breast cancer screening, PCOD/PCOS treatment, cervical cancer vaccination, and women-specific critical illness.",
  },
  {
    slug: 'newborn-baby',
    name: 'Newborn Baby Insurance',
    nameHi: 'नवजात शिशु बीमा',
    description: 'Health insurance for newborn babies covering congenital conditions, NICU charges, vaccinations, and pediatric care from day one of birth.',
  },
]

// ============================================================================
// Insurance Types
// ============================================================================

export interface InsuranceTypeData {
  slug: string
  name: string
  nameHi: string
  category: string
}

/**
 * Core insurance categories for programmatic page generation.
 * Each type generates pages across all cities and conditions.
 */
export const insuranceTypes: InsuranceTypeData[] = [
  {
    slug: 'health-insurance',
    name: 'Health Insurance',
    nameHi: 'हेल्थ इंश्योरेंस / चिकित्सा बीमा',
    category: 'health',
  },
  {
    slug: 'term-insurance',
    name: 'Term Insurance',
    nameHi: 'टर्म इंश्योरेंस / अवधि बीमा',
    category: 'life',
  },
  {
    slug: 'car-insurance',
    name: 'Car Insurance',
    nameHi: 'कार इंश्योरेंस / गाड़ी बीमा',
    category: 'motor',
  },
  {
    slug: 'bike-insurance',
    name: 'Bike Insurance',
    nameHi: 'बाइक इंश्योरेंस / दुपहिया बीमा',
    category: 'motor',
  },
  {
    slug: 'travel-insurance',
    name: 'Travel Insurance',
    nameHi: 'ट्रैवल इंश्योरेंस / यात्रा बीमा',
    category: 'travel',
  },
  {
    slug: 'critical-illness',
    name: 'Critical Illness Insurance',
    nameHi: 'क्रिटिकल इलनेस इंश्योरेंस',
    category: 'health',
  },
  {
    slug: 'personal-accident',
    name: 'Personal Accident Insurance',
    nameHi: 'पर्सनल एक्सीडेंट इंश्योरेंस',
    category: 'health',
  },
  {
    slug: 'home-insurance',
    name: 'Home Insurance',
    nameHi: 'होम इंश्योरेंस / गृह बीमा',
    category: 'home',
  },
  {
    slug: 'family-floater',
    name: 'Family Floater Health Insurance',
    nameHi: 'फैमिली फ्लोटर हेल्थ इंश्योरेंस',
    category: 'health',
  },
  {
    slug: 'senior-citizen-insurance',
    name: 'Senior Citizen Health Insurance',
    nameHi: 'सीनियर सिटीजन हेल्थ इंश्योरेंस',
    category: 'health',
  },
  {
    slug: 'maternity-insurance',
    name: 'Maternity Insurance',
    nameHi: 'मैटरनिटी इंश्योरेंस / गर्भावस्था बीमा',
    category: 'health',
  },
  {
    slug: 'group-health-insurance',
    name: 'Group Health Insurance',
    nameHi: 'ग्रुप हेल्थ इंश्योरेंस',
    category: 'health',
  },
  {
    slug: 'whole-life-insurance',
    name: 'Whole Life Insurance',
    nameHi: 'होल लाइफ इंश्योरेंस / जीवन भर बीमा',
    category: 'life',
  },
  {
    slug: 'endowment-plan',
    name: 'Endowment Life Insurance',
    nameHi: 'एंडोमेंट प्लान / बचत बीमा',
    category: 'life',
  },
  {
    slug: 'ulip',
    name: 'ULIP (Unit Linked Insurance Plan)',
    nameHi: 'यूलिप / यूनिट लिंक्ड इंश्योरेंस प्लान',
    category: 'life',
  },
  {
    slug: 'commercial-vehicle-insurance',
    name: 'Commercial Vehicle Insurance',
    nameHi: 'कमर्शियल व्हीकल इंश्योरेंस',
    category: 'motor',
  },
  {
    slug: 'two-wheeler-comprehensive',
    name: 'Two Wheeler Comprehensive Insurance',
    nameHi: 'टू व्हीलर कॉम्प्रिहेंसिव इंश्योरेंस',
    category: 'motor',
  },
]

// ============================================================================
// Slug Generator
// ============================================================================

/**
 * Generates URL-friendly slugs for programmatic SEO pages.
 *
 * Format: /[insurance-type]-[condition]-[city]
 * Example: /health-insurance-diabetes-mumbai
 *
 * SEO Rationale:
 * - Keywords in URLs are a confirmed ranking signal
 * - Hyphen-separated slugs are preferred by Google
 * - Order: insurance type → condition → city (matches search query pattern)
 * - All lowercase for consistency and URL normalization
 */
export function generateProgrammaticSlug(
  insuranceType: string,
  condition: string,
  city: string
): string {
  const parts = [insuranceType]

  if (condition) {
    parts.push(condition)
  }

  if (city) {
    parts.push(city)
  }

  return '/' + parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ============================================================================
// Meta Title Generator
// ============================================================================

/**
 * Generates SEO-optimized meta titles for programmatic pages.
 *
 * SEO Best Practices:
 * - Keep under 60 characters for full SERP display
 * - Include primary keyword near the beginning
 * - Add brand name at the end for recognition
 * - Use "in [City]" for local targeting
 * - Include "Best" and "2025" for CTR optimization
 *
 * Pattern variations:
 * - [Insurance Type] for [Condition] in [City] | Paliwal Secure
 * - Best [Insurance Type] in [City] | Paliwal Secure
 * - [Insurance Type] for [Condition] | Paliwal Secure
 * - Best [Insurance Type] in India 2025 | Paliwal Secure
 */
export function generateMetaTitle(
  insuranceType: string,
  condition?: string,
  city?: string
): string {
  const insName = getInsuranceTypeName(insuranceType)

  let title = ''

  if (condition && city) {
    // Most specific: insurance + condition + city
    const condName = getConditionName(condition)
    const cityName = getCityName(city)
    title = `Best ${insName} for ${condName} in ${cityName} 2025`
  } else if (condition) {
    // Insurance + condition
    const condName = getConditionName(condition)
    title = `Best ${insName} for ${condName} in India 2025`
  } else if (city) {
    // Insurance + city
    const cityName = getCityName(city)
    title = `Best ${insName} in ${cityName} 2025`
  } else {
    // Insurance type only
    title = `Best ${insName} in India 2025`
  }

  // Truncate to fit within ~60 chars before adding brand
  const brandSuffix = ' | Paliwal Secure'
  const maxTitleLen = 60 - brandSuffix.length

  if (title.length > maxTitleLen) {
    title = title.substring(0, maxTitleLen - 1).replace(/\s+\S*$/, '')
  }

  return title + brandSuffix
}

// ============================================================================
// Meta Description Generator
// ============================================================================

/**
 * Generates SEO-optimized meta descriptions for programmatic pages.
 *
 * SEO Best Practices:
 * - Keep under 155 characters for full SERP display
 * - Include primary keyword in first 100 characters
 * - Add call-to-action (CTA) for higher CTR
 * - Mention specific benefits (CSR, cashless, claim assistance)
 * - Include trust signals (IRDAI certified, 500+ families)
 *
 * CTR Optimization:
 * - "Compare" and "Get expert" are high-performing CTAs
 * - Mentioning specific insurers builds credibility
 * - "Free consultation" reduces barrier to conversion
 */
export function generateMetaDescription(
  insuranceType: string,
  condition?: string,
  city?: string
): string {
  const insName = getInsuranceTypeName(insuranceType)

  if (condition && city) {
    const condName = getConditionName(condition)
    const cityName = getCityName(city)
    return `Compare best ${insName} plans for ${condName} in ${cityName}. IRDAI-certified advisor helps you find cashless hospitals, low premiums & high CSR plans. Free consultation!`
  }

  if (condition) {
    const condName = getConditionName(condition)
    return `Compare best ${insName} plans for ${condName} in India. Expert IRDAI-certified advisor helps with coverage, premiums & claims. Trusted by 500+ families.`
  }

  if (city) {
    const cityName = getCityName(city)
    return `Find the best ${insName} plans in ${cityName}. Compare top insurers, cashless hospitals & claim settlement ratios. Free consultation from IRDAI-certified advisor.`
  }

  return `Compare best ${insName} plans in India. Expert IRDAI-certified advisor helps you find the right coverage at lowest premiums. Trusted by 500+ families across India.`
}

// ============================================================================
// Content Generator
// ============================================================================

export interface ContentSection {
  title: string
  content: string
}

export interface ProgrammaticContent {
  heading: string
  intro: string
  sections: ContentSection[]
}

/**
 * Generates unique, structured content for each programmatic SEO page.
 *
 * SEO Strategy:
 * - H1 heading includes primary keyword exactly
 * - Introduction defines the topic (helps AI Overview citations)
 * - Sections address different search intents (informational + transactional)
 * - Local content is unique per city (no duplicate content penalty)
 * - Condition-specific advice adds genuine value (not thin content)
 *
 * Content Quality:
 * - Each page must be at least 800 words of unique content
 * - Local data (population, hospitals) makes pages genuinely useful
 * - Internal linking to related insurance types builds site structure
 * - FAQ section captures voice search and People Also Ask queries
 */
export function generateProgrammaticContent(
  insuranceType: string,
  condition?: string,
  city?: string
): ProgrammaticContent {
  const insName = getInsuranceTypeName(insuranceType)
  const cityName = city ? getCityName(city) : null
  const condName = condition ? getConditionName(condition) : null
  const cityData = city ? topCities.find((c) => c.name.toLowerCase() === city.toLowerCase()) : null

  // Build heading
  let heading = `Best ${insName} Plans`
  if (condName) heading += ` for ${condName}`
  if (cityName) heading += ` in ${cityName}`
  heading += ' — Compare & Buy Online'

  // Build introduction — always unique per combination
  let intro = `Looking for the best ${insName} plans`
  if (condName) intro += ` for ${condName}`
  if (cityName) intro += ` in ${cityName}`
  intro += '? '
  intro += `Paliwal Secure, an IRDAI-certified insurance advisory firm, helps you compare top ${insName} plans from leading Indian insurers. `
  if (condName) {
    intro += `We understand the unique challenges of finding insurance coverage for ${condName.toLowerCase()} and help you navigate waiting periods, exclusions, and premium loading. `
  }
  if (cityName) {
    intro += `Serving families in ${cityName} with personalized insurance solutions and claim assistance. `
  }
  intro += `Trusted by 500+ families across India.`

  // Build sections
  const sections: ContentSection[] = []

  // Section 1: Why you need this insurance
  if (condName) {
    sections.push({
      title: `Why ${insName} is Essential for ${condName} Patients`,
      content: `${condName} can lead to significant medical expenses. ${insName} provides financial protection against hospitalization costs, treatment expenses, and ongoing medication. ${condName === 'Diabetes' ? 'India has over 77 million diabetic patients, and treatment costs can exceed ₹50,000 annually without insurance.' : condName === 'Cancer' ? 'Cancer treatment in India can cost ₹5-25 lakhs depending on the type and stage, making insurance coverage critical.' : condName === 'Heart Disease' ? 'Cardiac procedures like bypass surgery can cost ₹2-5 lakhs in private hospitals, making comprehensive coverage essential.' : `Medical expenses for ${condName.toLowerCase()} treatment can be substantial, and insurance ensures you get the best care without financial strain.`}${cityName ? ` In ${cityName}, treatment costs are often higher due to demand for specialist care.` : ''}`,
    })
  } else {
    sections.push({
      title: `Why ${insName} is Essential in India`,
      content: `Medical inflation in India is rising at 14% annually, making ${insName} a necessity, not a choice. ${insName} provides financial protection against unexpected medical expenses, hospitalization costs, and critical illness treatment. ${cityName ? `In ${cityName}, healthcare costs have increased significantly with growing demand for quality medical care. ` : ''}With the right ${insName} plan, you can access cashless treatment at network hospitals and protect your savings from medical emergencies.`,
    })
  }

  // Section 2: Top plans / how to choose
  if (condName) {
    sections.push({
      title: `How to Choose ${insName} for ${condName}`,
      content: `When selecting ${insName} for ${condName.toLowerCase()}, consider these key factors: (1) Waiting period for pre-existing conditions — look for plans with 2-3 year waiting period instead of 4 years; (2) Coverage for ${condName.toLowerCase()}-specific treatments and medications; (3) Sum insured adequacy — ${condName === 'Cancer' ? 'minimum ₹10-15 lakhs recommended for cancer coverage' : condName === 'Heart Disease' ? 'minimum ₹5-10 lakhs for cardiac coverage' : condName === 'Diabetes' ? 'minimum ₹3-5 lakhs for diabetes management' : 'at least ₹5-10 lakhs'}; (4) Network hospitals with ${condName.toLowerCase()} specialists; (5) Claim settlement ratio above 90%. Our IRDAI-certified advisor can help you compare plans side by side.`,
    })
  } else {
    sections.push({
      title: `How to Choose the Best ${insName} Plan`,
      content: `Choosing the right ${insName} plan depends on your age, family size, medical history, and budget. Key factors to consider: (1) Sum insured — start with at least ₹5-10 lakhs for adequate coverage; (2) Claim settlement ratio — choose insurers with CSR above 90%; (3) Network hospitals — ensure cashless hospitals near you; (4) Waiting periods — shorter is better, especially for pre-existing conditions; (5) Room rent limits — prefer plans without room rent capping; (6) No claim bonus — look for plans that increase sum insured claim-free years. ${cityName ? `In ${cityName}, ensure your plan includes major hospitals in the network.` : ''}`,
    })
  }

  // Section 3: City-specific information
  if (cityName && cityData) {
    sections.push({
      title: `${insName} in ${cityName} — Local Guide`,
      content: `${cityName} is a major city in ${cityData.state} with a population of over ${cityData.population.toLocaleString('en-IN')} residents. ${cityName === 'Kota' ? 'Known as the education capital of India, Kota has a growing demand for health and life insurance among students, families, and professionals. ' : cityName === 'Mumbai' ? 'As India\'s financial capital, Mumbai residents need comprehensive insurance coverage for the city\'s high healthcare costs. ' : cityName === 'Delhi' ? 'Delhi\'s pollution levels and high healthcare costs make insurance essential for every family. ' : ''}The average cost of hospitalization in ${cityName} ranges from ₹30,000 to ₹3,00,000 depending on the treatment. Having ${insName} with cashless hospitalization at ${cityName} network hospitals ensures you get timely treatment without financial stress. Paliwal Secure provides personalized insurance advisory and claim assistance to ${cityName} residents.`,
    })
  }

  // Section 4: Premium estimates
  sections.push({
    title: `${insName} Premium Estimates${cityName ? ` for ${cityName}` : ''}`,
    content: `${insName} premiums in India vary based on age, sum insured, medical history, and city tier. ${cityName ? `${cityName} falls under ${getCityTier(cityName)} tier for insurance pricing, which ` : 'Tier-1 cities '}affects premium calculations. Estimated monthly premiums: Age 25-30: ₹500-1,500/month for ₹5 lakh cover; Age 30-40: ₹800-2,500/month for ₹5 lakh cover; Age 40-50: ₹1,200-4,000/month for ₹5 lakh cover; Age 50-60: ₹2,000-7,000/month for ₹5 lakh cover. ${condName ? `With ${condName} as a pre-existing condition, expect 10-30% loading on base premiums.` : ''} Get a personalized quote from our advisor for accurate premium estimates.`,
  })

  // Section 5: Claim process
  sections.push({
    title: `${insName} Claim Process${cityName ? ` in ${cityName}` : ''}`,
    content: `Filing a ${insName} claim is straightforward with proper guidance. Cashless claims: (1) Visit a network hospital; (2) Show your health card and ID; (3) Hospital sends pre-authorization to insurer; (4) Insurer approves; (5) Treatment done without upfront payment. Reimbursement claims: (1) Pay hospital bills; (2) Collect all documents; (3) Submit claim form with bills to insurer; (4) Insurer processes within 30 days. ${cityName ? `Paliwal Secure provides end-to-end claim assistance to ${cityName} residents, ensuring smooth claim settlement. ` : ''}Contact us at +91-9257877312 for claim support.`,
  })

  // Section 6: Why choose Paliwal Secure
  sections.push({
    title: `Why Choose Paliwal Secure for ${insName}${cityName ? ` in ${cityName}` : ''}`,
    content: `Paliwal Secure is an IRDAI-certified insurance advisory firm led by Himanshu Paliwal. We provide: (1) Unbiased plan comparison from 15+ insurers; (2) Personalized recommendation based on your needs; (3) End-to-end claim assistance; (4) Post-sale support for policy queries; (5) Free consultation with no obligation. ${cityName ? `We serve ${cityName} and all cities in ${cityData?.state || 'India'}, providing both online and in-person advisory. ` : ''}WhatsApp us at +91-9257877312 or email himanshupaliwalpbp@gmail.com for a free consultation.`,
  })

  return { heading, intro, sections }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Resolves insurance type slug to display name.
 */
function getInsuranceTypeName(slug: string): string {
  const found = insuranceTypes.find(
    (t) => t.slug.toLowerCase() === slug.toLowerCase()
  )
  return found ? found.name : slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Resolves condition slug to display name.
 */
function getConditionName(slug: string): string {
  const found = conditions.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase()
  )
  return found ? found.name : slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Resolves city name (case-insensitive) to proper display name.
 */
function getCityName(slug: string): string {
  const found = topCities.find(
    (c) => c.name.toLowerCase() === slug.toLowerCase()
  )
  return found ? found.name : slug
    .split(/[-\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Determines city tier for insurance pricing.
 * Tier 1: Metro cities (highest premiums)
 * Tier 2: Major cities (moderate premiums)
 * Tier 3: Smaller cities (lowest premiums)
 */
function getCityTier(cityName: string): string {
  const tier1 = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
  const tier2 = ['Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Kota', 'Noida', 'Gurgaon', 'Coimbatore', 'Chandigarh']

  if (tier1.includes(cityName)) return 'Tier-1'
  if (tier2.includes(cityName)) return 'Tier-2'
  return 'Tier-3'
}

/**
 * Generates all programmatic URL combinations for sitemap.
 * Returns array of slugs for the top combinations.
 *
 * Priority:
 * 1. Insurance Type + City (highest volume)
 * 2. Insurance Type + Condition (high intent)
 * 3. Insurance Type + Condition + City (niche but converts)
 */
export function generateAllProgrammaticSlugs(): string[] {
  const slugs: string[] = []

  // Priority 1: Insurance Type + Top 30 Cities
  const top30Cities = topCities.slice(0, 30)
  for (const insType of insuranceTypes) {
    for (const city of top30Cities) {
      slugs.push(generateProgrammaticSlug(insType.slug, '', city.name))
    }
  }

  // Priority 2: Insurance Type + Condition
  for (const insType of insuranceTypes) {
    for (const condition of conditions) {
      // Only health-related insurance types + conditions
      if (insType.category === 'health' || insType.category === 'life') {
        slugs.push(generateProgrammaticSlug(insType.slug, condition.slug, ''))
      }
    }
  }

  // Priority 3: Insurance Type + Condition + Top 10 Cities
  const top10Cities = topCities.slice(0, 10)
  const healthTypes = insuranceTypes.filter(
    (t) => t.category === 'health' || t.category === 'life'
  )
  for (const insType of healthTypes) {
    for (const condition of conditions) {
      for (const city of top10Cities) {
        slugs.push(generateProgrammaticSlug(insType.slug, condition.slug, city.name))
      }
    }
  }

  return [...new Set(slugs)] // Remove duplicates
}
