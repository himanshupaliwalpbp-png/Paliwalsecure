// ============================================================================
// Paliwal Secure - Cyber Insurance Plans Data
// IRDAI-Compliant | Source: Indian Cyber Insurance Market 2024-25
// Cyber threats se raksha, digital zindagi ki suraksha
// ============================================================================

export interface CyberInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  sumInsured: number;
  premiumMonthly: number;
  features: string[];
  targetAudience: string;
  claimProcess: string;
  waitingPeriod: string;
  taxBenefit: string;
  exclusions: string[];
  rating: number;
  irdaiRegNo: string;
}

export const cyberInsurancePlans: CyberInsuranceProduct[] = [
  {
    id: 'cyber-001',
    name: 'Tata AIG CyberEdge',
    insurer: 'Tata AIG General Insurance Co. Ltd.',
    sumInsured: 1000000,
    premiumMonthly: 850,
    features: [
      'Identity theft cover up to ₹10L',
      'Cyber stalking & harassment protection',
      'Social media account takeover cover',
      'Phishing & online fraud reimbursement',
      'Data breach liability cover',
      'IT consultant costs reimbursement',
      '24/7 cyber helpline support',
    ],
    targetAudience: 'Working professionals & digital-savvy individuals',
    claimProcess: 'Online intimation → Document submission → Investigation → Settlement within 15 days',
    waitingPeriod: '30 days from policy inception',
    taxBenefit: 'Section 80C deduction up to ₹1.5L on premium paid',
    exclusions: [
      'Prior known cyber incidents',
      'Voluntary disclosure of credentials',
      'Business/commercial cyber losses',
      'Losses from unlicensed software',
      'Cryptocurrency trading losses',
    ],
    rating: 4.6,
    irdaiRegNo: 'IRDA/NL584/GI/2018-19',
  },
  {
    id: 'cyber-002',
    name: 'Bajaj Allianz Cyber Safe',
    insurer: 'Bajaj Allianz General Insurance Co. Ltd.',
    sumInsured: 500000,
    premiumMonthly: 500,
    features: [
      'Credit card fraud cover up to ₹5L',
      'Online shopping fraud protection',
      'Email hacking & impersonation cover',
      'Cyber extortion & ransomware protection',
      'Financial loss due to cyber attack',
      'Legal expenses for identity theft',
      'Free credit monitoring for 1 year',
    ],
    targetAudience: 'Frequent online shoppers & banking users',
    claimProcess: 'App-based claim → FIR copy submission → Verification → Reimbursement within 21 days',
    waitingPeriod: '30 days from policy inception',
    taxBenefit: 'Section 80C deduction up to ₹1.5L on premium paid',
    exclusions: [
      'Losses from sharing OTP voluntarily',
      'Pre-existing cyber incidents',
      'Business email compromise (unless covered)',
      'Social engineering without cyber attack',
      'Losses from unauthorized Wi-Fi usage',
    ],
    rating: 4.4,
    irdaiRegNo: 'IRDA/NL495/GI/2017-18',
  },
  {
    id: 'cyber-003',
    name: 'ICICI Lombard Cyber Insurance',
    insurer: 'ICICI Lombard General Insurance Co. Ltd.',
    sumInsured: 1500000,
    premiumMonthly: 1200,
    features: [
      'Comprehensive identity theft cover',
      'Cyber bullying & online harassment protection',
      'Malware & ransomware attack cover',
      'Online investment fraud protection',
      'Digital wallet fraud reimbursement',
      'Data restoration costs',
      'Legal & consulting fees cover',
      'Family floater option available',
    ],
    targetAudience: 'Families & high-net-worth individuals with significant digital footprint',
    claimProcess: 'Online claim → Cyber incident report → Forensic review → Settlement within 14 working days',
    waitingPeriod: '15 days from policy inception',
    taxBenefit: 'Section 80C deduction applicable',
    exclusions: [
      'Losses from voluntary data sharing',
      'Pre-policy cyber incidents',
      'Business & commercial cyber risks',
      'Losses due to negligence in updating software',
      'Cryptocurrency & NFT related losses',
    ],
    rating: 4.5,
    irdaiRegNo: 'IRDA/NL331/GI/2015-16',
  },
  {
    id: 'cyber-004',
    name: 'HDFC ERGO Cyber Sachet',
    insurer: 'HDFC ERGO General Insurance Co. Ltd.',
    sumInsured: 250000,
    premiumMonthly: 250,
    features: [
      'Affordable sachet-based coverage',
      'UPI & digital payment fraud cover',
      'ATM skimming fraud protection',
      'SIM swap fraud reimbursement',
      'Online fraud cover up to ₹2.5L',
      'Quick claim via HDFC ERGO app',
    ],
    targetAudience: 'Young professionals & first-time cyber insurance buyers',
    claimProcess: 'App claim → Minimal documentation → Verification → Settlement within 7 working days',
    waitingPeriod: '7 days from policy inception',
    taxBenefit: 'Section 80C deduction applicable',
    exclusions: [
      'Losses from willingly sharing PIN/password',
      'Prior cyber incidents before policy period',
      'Commercial/business losses',
      'Losses from jailbroken/rooted devices',
    ],
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL264/GI/2014-15',
  },
  {
    id: 'cyber-005',
    name: 'Digit Cyber Insurance',
    insurer: 'Go Digit General Insurance Ltd.',
    sumInsured: 750000,
    premiumMonthly: 650,
    features: [
      'Smartphone-based cyber cover',
      'Social media account hacking cover',
      'Online banking fraud reimbursement',
      'Email phishing protection',
      'Cyber stalking counseling & legal cover',
      'Quick digital-first claim process',
      'No physical documents needed',
    ],
    targetAudience: 'Tech-savvy millennials & Gen-Z users',
    claimProcess: 'WhatsApp/App claim → Screenshot submission → AI verification → Settlement within 5 working days',
    waitingPeriod: '15 days from policy inception',
    taxBenefit: 'Section 80C deduction applicable',
    exclusions: [
      'Voluntary transfer of funds',
      'Pre-existing cyber incidents',
      'Business/commercial cyber risks',
      'Losses from unverified apps/links',
      'Crypto exchange hacks',
    ],
    rating: 4.5,
    irdaiRegNo: 'IRDA/NL699/GI/2021-22',
  },
  {
    id: 'cyber-006',
    name: 'Acko Cyber Cover',
    insurer: 'Acko General Insurance Ltd.',
    sumInsured: 500000,
    premiumMonthly: 400,
    features: [
      'Fully digital cyber insurance',
      'Instant policy issuance',
      'Online transaction fraud cover',
      'Identity theft protection',
      'Social media impersonation cover',
      'Zero paperwork claims',
      'Affordable premium structure',
    ],
    targetAudience: 'Digital-first individuals & gig economy workers',
    claimProcess: 'In-app claim → Digital evidence upload → Quick verification → Settlement within 7 days',
    waitingPeriod: '7 days from policy inception',
    taxBenefit: 'Section 80C deduction applicable',
    exclusions: [
      'Willful sharing of credentials',
      'Pre-policy cyber incidents',
      'Business & enterprise cyber risks',
      'Losses from public Wi-Fi without VPN',
      'Third-party app data breaches',
    ],
    rating: 4.4,
    irdaiRegNo: 'IRDA/NL620/GI/2019-20',
  },
];
