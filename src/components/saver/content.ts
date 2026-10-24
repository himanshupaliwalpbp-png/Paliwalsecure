/**
 * Paliwal Saver — module content (pure data, client-safe).
 * UX/content adapted from the Paliwal Saver rule-book; copy tightened for the
 * flagship showcase. All financial copy is indicative — engines stay authoritative.
 */

export const WHATSAPP_HANDOFF = "https://wa.me/919257877312";

/* ───────────────────────── shared form option sets ───────────────────────── */

export const TRANSACTION_TYPES = [
  {
    value: "P2M",
    label: "P2M",
    hint: "Customer pays a merchant QR/ID tagged as a specified merchant.",
  },
  {
    value: "P2PM",
    label: "P2PM",
    hint: "Small merchant collecting via UPI QR — ₹1L/month zero-MDR allowance.",
  },
  {
    value: "P2P",
    label: "P2P",
    hint: "Person to person — no merchant MDR framework applies.",
  },
] as const;

export const MERCHANT_CLASSIFICATIONS = [
  { value: "small_merchant", label: "Small merchant (UPI QR / P2PM)" },
  { value: "large_merchant", label: "Specified / large merchant (P2M)" },
  { value: "not_sure", label: "Not sure — show both scenarios" },
] as const;

export const BUSINESS_TYPES = [
  { value: "retail_shop", label: "Retail shop / Kirana" },
  { value: "food_beverage", label: "Food & beverage / Café" },
  { value: "services", label: "Services (salon, repair, agency…)" },
  { value: "professional", label: "Professional practice (CA, doctor, lawyer…)" },
  { value: "trader", label: "Trader / Distributor / Wholesale" },
  { value: "manufacturer", label: "Manufacturer / Small unit" },
  { value: "ecommerce", label: "E-commerce / D2C seller" },
  { value: "transport", label: "Transport / Goods carriage operator" },
  { value: "freelancer", label: "Freelancer / Creator" },
  { value: "other", label: "Other" },
] as const;

export const BUSINESS_STRUCTURES = [
  { value: "individual", label: "Individual / Sole person" },
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership firm" },
  { value: "llp", label: "LLP" },
  { value: "company", label: "Private / Public company" },
  { value: "huf", label: "HUF" },
  { value: "trust", label: "Trust / Society" },
  { value: "other", label: "Other" },
] as const;

export const PROFESSIONS_44ADA = [
  { value: "legal", label: "Legal (advocate)" },
  { value: "medical", label: "Medical (doctor, dentist…)" },
  { value: "engineering", label: "Engineering" },
  { value: "architectural", label: "Architecture" },
  { value: "accountancy", label: "Accountancy" },
  { value: "technical_consultancy", label: "Technical consultancy" },
  { value: "interior_decoration", label: "Interior decoration" },
  { value: "other_notified", label: "Other notified profession" },
] as const;

/* ───────────────────────── GST expense categories ───────────────────────── */

export type ExpenseCategoryMeta = {
  key: string;
  label: string;
  typicalGstRate: number;
  eligibility:
    | "LIKELY_ELIGIBLE"
    | "REQUIRES_REVIEW"
    | "NOT_GENERALLY_ELIGIBLE"
    | "BLOCKED_17_5"
    | "NOT_APPLICABLE"
    | "UNKNOWN";
  hint: string;
};

export const EXPENSE_CATEGORIES: ExpenseCategoryMeta[] = [
  { key: "rent", label: "Rent (business premises)", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Commercial rent from a GST-registered landlord." },
  { key: "internet", label: "Internet / Telephone", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Business connection, tax invoice with GSTIN." },
  { key: "software", label: "Software / SaaS", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Business-use software; imports may need reverse charge." },
  { key: "advertising", label: "Advertising & marketing", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Agency or platform invoices with GST." },
  { key: "professional_fees", label: "Professional fees (CA, legal, design)", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "For course of business; personal-use portion excluded." },
  { key: "office_supplies", label: "Office supplies / consumables", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Consumables and stationery for business." },
  { key: "raw_materials", label: "Raw materials", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Used in furtherance of business." },
  { key: "inventory", label: "Inventory / goods purchased", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Resale or input goods." },
  { key: "equipment", label: "Equipment / Capital goods", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Computers, machinery — ITC spread over life rules." },
  { key: "business_travel", label: "Business travel & stay", typicalGstRate: 5, eligibility: "REQUIRES_REVIEW", hint: "Certain travel benefits/food are blocked u/s 17(5)." },
  { key: "repairs", label: "Repairs & maintenance", typicalGstRate: 18, eligibility: "REQUIRES_REVIEW", hint: "Premises repairs usually eligible; vehicle repairs may be blocked." },
  { key: "insurance", label: "Insurance premiums", typicalGstRate: 18, eligibility: "REQUIRES_REVIEW", hint: "Health/life insurance generally blocked u/s 17(5)." },
  { key: "fuel", label: "Fuel (petrol/diesel)", typicalGstRate: 0, eligibility: "NOT_GENERALLY_ELIGIBLE", hint: "Motor fuel largely outside/blocked GST credit." },
  { key: "food_beverages", label: "Food & beverages / staff welfare", typicalGstRate: 5, eligibility: "BLOCKED_17_5", hint: "Blocked credit u/s 17(5) — not claimable." },
  { key: "electricity", label: "Electricity", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "Outside GST — no ITC arises." },
  { key: "salary", label: "Salary / Wages", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "No GST on salaries — no ITC." },
  { key: "loan_interest", label: "Loan interest", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "Financial services largely exempt — no ITC." },
];

export const ITC_ELIGIBILITY_META: Record<
  string,
  { label: string; tone: "good" | "warn" | "bad" | "neutral"; short: string }
> = {
  LIKELY_ELIGIBLE: { label: "Likely eligible", tone: "good", short: "Eligible" },
  REQUIRES_REVIEW: { label: "Requires review", tone: "warn", short: "Review" },
  NOT_GENERALLY_ELIGIBLE: { label: "Not generally eligible", tone: "bad", short: "Ineligible" },
  BLOCKED_17_5: { label: "Blocked credit u/s 17(5)", tone: "bad", short: "Blocked" },
  NOT_APPLICABLE: { label: "Not applicable", tone: "neutral", short: "N/A" },
  UNKNOWN: { label: "Unknown — verify", tone: "neutral", short: "Verify" },
};

/* ───────────────────────── smart search tool registry ───────────────────────── */

export type SaverToolTarget = "paydesk" | "tax" | "gst" | "ai" | null;

export type SaverTool = {
  id: string;
  title: string;
  benefit: string;
  category: "Payments" | "GST" | "Tax" | "Assistant" | "Business";
  target: SaverToolTarget;
  keywords: string;
};

export const SAVER_TOOLS: SaverTool[] = [
  { id: "upi-fee-finder", title: "UPI Fee Finder", benefit: "Will this payment attract MDR? Exact fee, by date & merchant class.", category: "Payments", target: "paydesk", keywords: "upi mdr fee charges p2m p2pm merchant payment 2000 0.4%" },
  { id: "zero-mdr", title: "Zero-MDR Route Finder", benefit: "Which zero-fee UPI categories your business actually qualifies for.", category: "Payments", target: "paydesk", keywords: "zero mdr small merchant qr 1 lakh monthly limit free upi" },
  { id: "44ad", title: "44AD Presumptive Checker", benefit: "6% / 8% deemed income vs regular books — see your tax both ways.", category: "Tax", target: "tax", keywords: "44ad presumptive deemed turnover 6% 8% 2 crore 3 crore audit" },
  { id: "regime-compare", title: "New vs Old Regime", benefit: "Slab-by-slab comparison with 87A rebate — your crossover point.", category: "Tax", target: "tax", keywords: "new old regime slab rebate 87a deductions compare income tax" },
  { id: "44ada", title: "44ADA for Professionals", benefit: "50% deemed income for specified professions — eligibility + limits.", category: "Tax", target: "tax", keywords: "44ada professional 50% gross receipts 50 lakh 75 lakh ca doctor lawyer" },
  { id: "gst-itc", title: "GST ITC Scanner", benefit: "Recoverable input tax credit on your real expenses — with documents.", category: "GST", target: "gst", keywords: "gst itc input tax credit claim recover expenses 17(5) blocked gstr-2b" },
  { id: "blocked-credits", title: "Blocked Credit Checker", benefit: "Section 17(5) list — food, insurance, travel: what you can't claim.", category: "GST", target: "gst", keywords: "blocked 17(5) food beverages insurance catering claim notice" },
  { id: "split-bill", title: "Split a Shared Bill", benefit: "Genuine multi-payer splits, on the record — the legal way.", category: "Payments", target: "paydesk", keywords: "split bill shared multiple payers friends restaurant group" },
  { id: "annual-impact", title: "Annual Impact Summary", benefit: "UPI fees + tax + ITC — one number: your total legal saving.", category: "Business", target: null, keywords: "annual total summary savings aggregate impact dashboard" },
  { id: "saver-ai", title: "Ask Saver AI", benefit: "Natural-language answers on fees, 44AD, ITC — EN / हिं / Hinglish.", category: "Assistant", target: "ai", keywords: "ai chat assistant ask question hindi hinglish help" },
  { id: "cash-flow", title: "Fee Impact on Cash Flow", benefit: "Monthly & annual cost of your collection mix above thresholds.", category: "Business", target: "paydesk", keywords: "monthly impact annual cost cash flow receipts collections" },
  { id: "doc-checklist", title: "Document Checklist", benefit: "Invoices, GSTR-2B, proofs — what to keep before you claim.", category: "GST", target: "gst", keywords: "documents checklist invoice gstr-2b payment proof records" },
];

export const TOOL_CATEGORY_TONE: Record<SaverTool["category"], string> = {
  Payments: "gold",
  GST: "emerald",
  Tax: "gold",
  Assistant: "emerald",
  Business: "neutral",
};

/* ───────────────────────────── chat quick prompts ───────────────────────────── */

export const CHAT_QUICK_PROMPTS = [
  "UPI fees kaise bachaye?",
  "44AD vs regular slab?",
  "GST ITC checklist do",
  "New vs old regime?",
];

export const CHAT_CAPABILITIES = [
  {
    icon: "Landmark",
    title: "Rule-sourced, never invented",
    body: "Answers cite RBI / NPCI / Income-tax / GST source rules — no guessed numbers, ever.",
  },
  {
    icon: "Languages",
    title: "Speaks your language",
    body: "English, हिंदी and Hinglish — ask the way you think.",
  },
  {
    icon: "ShieldCheck",
    title: "Evasion-proof by design",
    body: "Every reply is screened against 10 absolute rules — it will refuse to help hide income or split payments.",
  },
];

/* ───────────────────────────────── FAQs ───────────────────────────────── */

export const SAVER_FAQS = [
  {
    q: "Is this tax evasion?",
    a: "Emphatically no. Paliwal Saver only surfaces options the law already gives you: zero-MDR categories RBI/NPCI define, presumptive taxation Parliament wrote (44AD/44ADA/44AE), and input tax credit the CGST Act allows. Nothing here hides income, splits payments, or fakes documents — the assistant actively refuses such requests.",
  },
  {
    q: "How much business money can I legally save?",
    a: "It depends on your real numbers. Typical combined potential for a small GST-registered business: ₹15k–₹50k/yr in recovered ITC, a similar band via regime/44AD choice, plus avoided UPI MDR where your collections qualify for zero-fee categories. Run all three calculators and the Annual Impact Summary will total it for you.",
  },
  {
    q: "Will UPI payments above ₹2,000 really attract a fee?",
    a: "Under the announced framework, a 0.4% MDR applies to specified UPI P2M merchant transactions above ₹2,000 from 15 October 2026, with category-specific conditions and possible caps. Customers are not charged — it is a merchant-side collection cost. Your applicability depends on merchant classification; the PayDesk shows your exact scenarios by date.",
  },
  {
    q: "Can I split a ₹10,000 payment into ₹2,000 pieces to avoid MDR?",
    a: "No — and we will not help with that. Artificially splitting one payment to dodge applicable charges can breach payment-network and acquirer rules. What we do help with: legitimate method comparison, small-merchant QR eligibility (₹1 lakh/month zero-MDR, subject to conditions), and genuine multi-payer bill splitting.",
  },
  {
    q: "Is the GST input tax credit shown to me guaranteed?",
    a: "No. ITC depends on statutory conditions: GST registration, a valid tax invoice, receipt of goods/services, the supplier having deposited the tax, your return being filed on time, and the expense not being blocked under Section 17(5). Every item is marked with its eligibility state and the documents you need.",
  },
  {
    q: "Which sources do you use for rules?",
    a: "Primary government sources only — Income Tax Department, CBIC, GST Portal, NPCI, RBI, Finance Ministry/PIB notifications. Every result shows its source and verification date. Random blogs are never used for core rules.",
  },
  {
    q: "Do you file my taxes or GST returns?",
    a: "No. Paliwal Saver estimates and organises. Filing, representation and advisory remain with qualified professionals — your CA can verify every figure from the source links we show.",
  },
  {
    q: "How is this free?",
    a: "The calculators are genuinely free — no login, no card. We're an IRDAI-registered insurance practice (POSP IP429834); the Saver earns trust, and if you later want protection for what you've built, that conversation is on WhatsApp, not behind a paywall. No data leaves your browser except the numbers needed for calculations.",
  },
];

/* ───────────────────────────── hero ticker ───────────────────────────── */

export const HERO_TICKER_STATS = [
  { value: 18400, prefix: "₹", suffix: "/yr", label: "UPI fees saved", note: "small-merchant QR route" },
  { value: 46800, prefix: "₹", suffix: "", label: "via 44AD", note: "presumptive vs books" },
  { value: 32200, prefix: "₹", suffix: "/yr", label: "GST ITC recovered", note: "invoices already in your drawer" },
];
