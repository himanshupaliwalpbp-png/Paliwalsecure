export interface City {
  slug: string;
  name: string;
  state: string;
  tier: 'metro' | 'tier2' | 'tier3';
  healthLoadingFactor: number; // metro: 1.15, tier2: 1.0, tier3: 0.92
  basePremium?: number; // optional — computed if missing
  hospitalCount?: number; // optional — computed if missing
  networkHospitals?: { name: string; type: string }[]; // optional
}

export const cities: City[] = [
  // ============================================================
  // METRO (10 cities) — healthLoadingFactor: 1.15
  // ============================================================
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'surat', name: 'Surat', state: 'Gujarat', tier: 'metro', healthLoadingFactor: 1.15 },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', tier: 'metro', healthLoadingFactor: 1.15 },

  // ============================================================
  // TIER 2 (40 cities) — healthLoadingFactor: 1.0
  // ============================================================
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'patna', name: 'Patna', state: 'Bihar', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'vadodara', name: 'Vadodara', state: 'Gujarat', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'ludhiana', name: 'Ludhiana', state: 'Punjab', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'nashik', name: 'Nashik', state: 'Maharashtra', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'mysore', name: 'Mysore', state: 'Karnataka', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'guwahati', name: 'Guwahati', state: 'Assam', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'madurai', name: 'Madurai', state: 'Tamil Nadu', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'amritsar', name: 'Amritsar', state: 'Punjab', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'ranchi', name: 'Ranchi', state: 'Jharkhand', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'raipur', name: 'Raipur', state: 'Chhattisgarh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'kota', name: 'Kota', state: 'Rajasthan', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'faridabad', name: 'Faridabad', state: 'Haryana', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'prayagraj', name: 'Prayagraj', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'solapur', name: 'Solapur', state: 'Maharashtra', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'tiruchirappalli', name: 'Tiruchirappalli', state: 'Tamil Nadu', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'mangalore', name: 'Mangalore', state: 'Karnataka', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'hubli-dharwad', name: 'Hubli-Dharwad', state: 'Karnataka', tier: 'tier2', healthLoadingFactor: 1.0 },
  { slug: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', tier: 'tier2', healthLoadingFactor: 1.0 },

  // ============================================================
  // TIER 3 (50 cities) — healthLoadingFactor: 0.92
  // ============================================================
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'moradabad', name: 'Moradabad', state: 'Uttar Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'saharanpur', name: 'Saharanpur', state: 'Uttar Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'gorakhpur', name: 'Gorakhpur', state: 'Uttar Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bhiwandi', name: 'Bhiwandi', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'kolhapur', name: 'Kolhapur', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'sangli', name: 'Sangli', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'jalgaon', name: 'Jalgaon', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'akola', name: 'Akola', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'nanded', name: 'Nanded', state: 'Maharashtra', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'udaipur', name: 'Udaipur', state: 'Rajasthan', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'ajmer', name: 'Ajmer', state: 'Rajasthan', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bikaner', name: 'Bikaner', state: 'Rajasthan', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bilaspur', name: 'Bilaspur', state: 'Chhattisgarh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'jamshedpur', name: 'Jamshedpur', state: 'Jharkhand', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bokaro', name: 'Bokaro', state: 'Jharkhand', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'cuttack', name: 'Cuttack', state: 'Odisha', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'rourkela', name: 'Rourkela', state: 'Odisha', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'tirunelveli', name: 'Tirunelveli', state: 'Tamil Nadu', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'salem', name: 'Salem', state: 'Tamil Nadu', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'erode', name: 'Erode', state: 'Tamil Nadu', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'vellore', name: 'Vellore', state: 'Tamil Nadu', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'thanjavur', name: 'Thanjavur', state: 'Tamil Nadu', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'kozhikode', name: 'Kozhikode', state: 'Kerala', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'thrissur', name: 'Thrissur', state: 'Kerala', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'kannur', name: 'Kannur', state: 'Kerala', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'kollam', name: 'Kollam', state: 'Kerala', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'palakkad', name: 'Palakkad', state: 'Kerala', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'belgaum', name: 'Belgaum', state: 'Karnataka', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'shimoga', name: 'Shimoga', state: 'Karnataka', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'davanagere', name: 'Davanagere', state: 'Karnataka', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'tumkur', name: 'Tumkur', state: 'Karnataka', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'warangal', name: 'Warangal', state: 'Telangana', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'nizamabad', name: 'Nizamabad', state: 'Telangana', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'karimnagar', name: 'Karimnagar', state: 'Telangana', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'rajahmundry', name: 'Rajahmundry', state: 'Andhra Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'kakinada', name: 'Kakinada', state: 'Andhra Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'guntur', name: 'Guntur', state: 'Andhra Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'nellore', name: 'Nellore', state: 'Andhra Pradesh', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'darbhanga', name: 'Darbhanga', state: 'Bihar', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'bhagalpur', name: 'Bhagalpur', state: 'Bihar', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'muzaffarpur', name: 'Muzaffarpur', state: 'Bihar', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'jalandhar', name: 'Jalandhar', state: 'Punjab', tier: 'tier3', healthLoadingFactor: 0.92 },
  { slug: 'siliguri', name: 'Siliguri', state: 'West Bengal', tier: 'tier3', healthLoadingFactor: 0.92 },
];

// Helper functions
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}

export function getTierMultiplier(tier: 'metro' | 'tier2' | 'tier3'): number {
  const city = cities.find(c => c.tier === tier);
  return city?.healthLoadingFactor ?? 1.0;
}

export function getCitiesByTier(tier: 'metro' | 'tier2' | 'tier3'): City[] {
  return cities.filter(c => c.tier === tier);
}
