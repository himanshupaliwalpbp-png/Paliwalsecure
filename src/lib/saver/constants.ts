/**
 * Paliwal Saver — shared constants (client & server safe, pure data).
 * Ported DB-free from the Paliwal Saver app into Paliwal Secure AI.
 * Financial reference data here is INDICATIVE UI copy; authoritative values
 * used in calculations live in the static rulebooks inside
 * src/lib/saver/engines/* (versioned v1, sourced, dated).
 */

// ------------------------------------------------------------------ taxonomy

export const SAVING_CATEGORIES = [
  {
    key: "A",
    code: "A",
    label: "Payment Fee Saving",
    desc: "Merchant discount rate (MDR) and other collection costs you may lawfully reduce by choosing an eligible lower-cost method or qualifying category.",
    color: "text-sky-300",
  },
  {
    key: "B",
    code: "B",
    label: "GST / Input Tax Credit Opportunity",
    desc: "Credit on GST paid for qualifying business inputs/input services — subject to statutory conditions under the CGST Act.",
    color: "text-emerald-300",
  },
  {
    key: "C",
    code: "C",
    label: "Income Tax Optimization",
    desc: "Lawful tax-planning options such as presumptive taxation eligibility, allowable expenses and depreciation — based on the information you entered.",
    color: "text-amber-300",
  },
  {
    key: "D",
    code: "D",
    label: "Business Cost Saving",
    desc: "Operating-cost reduction opportunities: provider charges, duplicate subscriptions, settlement timing and working-capital costs.",
    color: "text-teal-300",
  },
  {
    key: "E",
    code: "E",
    label: "Compliance / Penalty Risk Reduction",
    desc: "Avoiding avoidable interest and penalty exposure: late filings, missing documents, mismatched ITC and unfiled returns.",
    color: "text-rose-300",
  },
] as const;

export const BUSINESS_TYPES = [
  { value: "retail_shop", label: "Retail shop / Kirana" },
  { value: "food_beverage", label: "Food & beverage / Restaurant / Café" },
  { value: "services", label: "Services (salon, repair, agency…)" },
  { value: "professional", label: "Professional practice (CA, doctor, lawyer, consultant…)" },
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

export const MERCHANT_CLASSIFICATIONS = [
  { value: "small_merchant", label: "Small merchant (UPI QR, P2PM category)" },
  { value: "large_merchant", label: "Specified / large merchant (P2M)" },
  { value: "not_sure", label: "Not sure — show both scenarios" },
] as const;

export const TRANSACTION_TYPES = [
  { value: "P2M", label: "P2M — Customer pays a merchant" },
  { value: "P2PM", label: "P2PM — Small merchant via UPI QR" },
  { value: "P2P", label: "P2P — Person to person" },
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli", "Jammu & Kashmir",
  "Ladakh", "Lakshadweep", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Puducherry", "Sikkim", "Tripura",
] as const;

/** Specified professions recognised for section 44ADA (UI copy). */
export const PROFESSIONS_44ADA = [
  "legal", "medical", "engineering", "architectural", "accountancy",
  "technical_consultancy", "interior_decoration", "other_notified",
] as const;

export const PROFESSION_LABELS: Record<string, string> = {
  legal: "Legal (advocate, legal practitioner)",
  medical: "Medical (doctor, dentist, physiotherapist…)",
  engineering: "Engineering",
  architectural: "Architecture",
  accountancy: "Accountancy",
  technical_consultancy: "Technical consultancy",
  interior_decoration: "Interior decoration",
  other_notified: "Other notified profession (film artist, company secretary, registered valuer…)",
};

// ------------------------------------------------------------- expense data

export type ItcEligibility =
  | "LIKELY_ELIGIBLE"
  | "REQUIRES_REVIEW"
  | "NOT_GENERALLY_ELIGIBLE"
  | "BLOCKED_17_5"
  | "NOT_APPLICABLE"
  | "UNKNOWN";

export const ITC_ELIGIBILITY_META: Record<
  ItcEligibility,
  { label: string; tone: "good" | "warn" | "bad" | "neutral"; short?: string }
> = {
  LIKELY_ELIGIBLE: { label: "Likely eligible", tone: "good" },
  REQUIRES_REVIEW: { label: "Requires review", tone: "warn" },
  NOT_GENERALLY_ELIGIBLE: { label: "Not generally eligible", tone: "bad" },
  BLOCKED_17_5: { label: "Blocked credit u/s 17(5)", tone: "bad", short: "Blocked 17(5)" },
  NOT_APPLICABLE: { label: "Not applicable (no GST charged)", tone: "neutral" },
  UNKNOWN: { label: "Unknown — verify", tone: "neutral" },
};

/** UI mirror of the static GST_ITC_MAP rulebook (engine validates against the same values). */
export const EXPENSE_CATEGORIES: Array<{
  key: string;
  label: string;
  typicalGstRate: number;
  eligibility: ItcEligibility;
  hint: string;
}> = [
  { key: "rent", label: "Rent (business premises)", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Commercial rent from a GST-registered landlord." },
  { key: "electricity", label: "Electricity", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "Electricity is outside GST — no ITC arises." },
  { key: "internet", label: "Internet / Telephone", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Business connection, tax invoice with GSTIN." },
  { key: "software", label: "Software / SaaS subscriptions", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Business-use software; import services may need reverse charge." },
  { key: "advertising", label: "Advertising & marketing", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Agency or platform invoices with GST." },
  { key: "professional_fees", label: "Professional fees (CA, legal, design)", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "For course of business; personal-use portion is excluded." },
  { key: "office_supplies", label: "Office supplies / consumables", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Consumables and stationery for business." },
  { key: "business_travel", label: "Business travel & stay", typicalGstRate: 5, eligibility: "REQUIRES_REVIEW", hint: "Certain employee travel benefits/food are blocked credits u/s 17(5)." },
  { key: "fuel", label: "Fuel (petrol/diesel)", typicalGstRate: 0, eligibility: "NOT_GENERALLY_ELIGIBLE", hint: "Motor fuel largely outside/blocked GST credit." },
  { key: "repairs", label: "Repairs & maintenance", typicalGstRate: 18, eligibility: "REQUIRES_REVIEW", hint: "Premises repairs usually eligible; motor-vehicle repairs may be blocked." },
  { key: "salary", label: "Salary / Wages", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "No GST on salaries — no ITC." },
  { key: "raw_materials", label: "Raw materials", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Used in furtherance of business." },
  { key: "inventory", label: "Inventory / goods purchased", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Resale or input goods." },
  { key: "equipment", label: "Equipment / Capital goods", typicalGstRate: 18, eligibility: "LIKELY_ELIGIBLE", hint: "Computers, machinery — ITC spread over useful life rules." },
  { key: "loan_interest", label: "Loan interest", typicalGstRate: 0, eligibility: "NOT_APPLICABLE", hint: "Financial services largely exempt — no ITC." },
  { key: "insurance", label: "Insurance premiums", typicalGstRate: 18, eligibility: "REQUIRES_REVIEW", hint: "Health/life insurance generally blocked u/s 17(5); statutory workmen insurance may differ." },
  {
    key: "food_beverages",
    label: "Food & beverages / staff welfare",
    typicalGstRate: 5,
    eligibility: "BLOCKED_17_5",
    hint: "Food, beverages, catering and outdoor hospitality are blocked credits under Section 17(5) — the GST paid is not claimable as ITC (statutory canteen exception aside).",
  },
  { key: "other", label: "Other", typicalGstRate: 18, eligibility: "UNKNOWN", hint: "Tell us the nature of the expense to classify it." },
];

export const PAYMENT_MODES = [
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank transfer (NEFT/IMPS/RTGS)" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "gateway", label: "Payment gateway / online" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
] as const;

// --------------------------------------------------- payment method compare

/** Indicative reference table — authoritative rules come from the engine rulebook. */
export const PAYMENT_METHODS = [
  {
    method: "UPI",
    fee: "₹0 up to ₹2,000; ~0.4% MDR above ₹2,000 for specified P2M merchants (as announced, from 15 Oct 2026)",
    settlement: "Usually same-day / T+0–T+1",
    merchantCost: "Low — zero-MDR framework up to the threshold; small-merchant QR category may stay zero within limits",
    convenience: "Very high — customers don't pay extra",
    conditions: "Merchant category & classification apply; caps and exclusions per the applicable circular",
    low: true,
  },
  {
    method: "Bank transfer (NEFT / IMPS / RTGS)",
    fee: "Often ₹0 online (many banks); IMPS ~₹2.5–6; RTGS ~₹24.5–55 above ₹2 lakh",
    settlement: "IMPS: instant · NEFT: ~30–60 min batches · RTGS: ~30 min",
    merchantCost: "Flat fee — predictable for large B2B payments",
    convenience: "Medium — needs account details; strong audit trail",
    conditions: "Per-bank schedule; GST applies on charges",
    low: true,
  },
  {
    method: "Debit card (POS)",
    fee: "~0.4%–0.9%, capped (indicatively ~₹200 for smaller merchants)",
    settlement: "T+1 – T+2",
    merchantCost: "Moderate — percentage fee with caps",
    convenience: "High for in-store customers",
    conditions: "MDR caps depend on merchant turnover slab",
    low: false,
  },
  {
    method: "Credit card",
    fee: "~1.5%–3% + GST on the fee",
    settlement: "T+1 – T+3",
    merchantCost: "High — highest acceptance cost",
    convenience: "Very high for customers",
    conditions: "Rate varies by provider, card type and plan",
    low: false,
  },
  {
    method: "Payment gateway (online)",
    fee: "~2%–2.5% on cards/netbanking; UPI route usually ₹0 (within UPI rules)",
    settlement: "T+2 typical",
    merchantCost: "High for cards — UPI route can be far cheaper",
    convenience: "Very high for online sales",
    conditions: "Setup + per-transaction pricing; GST on fees",
    low: false,
  },
  {
    method: "Cash",
    fee: "No network fee — but counting, deposit and security costs are real",
    settlement: "Immediate",
    merchantCost: "Hidden handling cost; no digital trail",
    convenience: "High offline; no receipts unless you issue them",
    conditions: "Must still be recorded in books — suppression is illegal",
    low: false,
  },
] as const;

// ------------------------------------------------------------- tools hub

export type ToolMeta = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: "payments" | "gst" | "tax" | "business";
  server: boolean;
  icon: string;
};

/** Tool registry for the /saver tools hub (anchors into the /saver page). */
export const TOOLS: ToolMeta[] = [
  { slug: "payment-cost-calculator", title: "UPI Payment Fee Calculator", h1: "Will This Payment Cost You a Fee?", description: "Estimate MDR on UPI P2M payments above ₹2,000 under the announced 0.4% framework — free, instant, with sources.", category: "payments", server: true, icon: "calculator" },
  { slug: "upipayments-calculator", title: "UPI Charges Calculator for Merchants", h1: "UPI Charges Calculator for Merchant Payments", description: "Work out what UPI charges may apply to your monthly collections — small-merchant QR limits, thresholds and caps.", category: "payments", server: true, icon: "zap" },
  { slug: "upi-mix-calculator", title: "UPI Collection Mix Analyzer", h1: "How Much of Your UPI Collections Sit Above ₹2,000?", description: "Map your monthly UPI collection mix against the ₹2,000 threshold — estimated MDR exposure, fee-free share and legitimate cost-reduction routes.", category: "payments", server: true, icon: "chart-pie" },
  { slug: "zero-mdr-checker", title: "Zero-MDR Eligibility Checker", h1: "Which Zero-MDR Routes Is Your Business Actually Eligible For?", description: "Answer 3 questions about your UPI collections — see which legitimate zero-MDR categories apply to you: the small-merchant QR allowance, the ₹2,000 P2M threshold and bank-transfer routing.", category: "payments", server: true, icon: "shield-check" },
  { slug: "gst-itc-checker", title: "GST Input Tax Credit Checker", h1: "GST Savings & ITC Check", description: "Check which business expenses may carry claimable input tax credit — with eligibility states, documents and risk flags.", category: "gst", server: true, icon: "badge-check" },
  { slug: "income-tax-saver", title: "Income Tax Saver for Small Business", h1: "Income Tax Saver", description: "Discover lawful income-tax planning options — expenses, depreciation, presumptive eligibility and regime comparison.", category: "tax", server: true, icon: "piggy-bank" },
  { slug: "44ad-calculator", title: "Section 44AD Calculator (Presumptive Taxation)", h1: "44AD Calculator — Presumptive Taxation for Businesses", description: "Compare deemed income at 6%/8% vs regular books for turnover up to ₹2–3 crore. Estimate tax both ways.", category: "tax", server: true, icon: "scale" },
  { slug: "44ada-calculator", title: "Section 44ADA Calculator for Professionals", h1: "44ADA Calculator — Presumptive Tax for Professionals", description: "Professionals: compare 50% deemed income vs regular taxation for gross receipts up to ₹50–75 lakh.", category: "tax", server: true, icon: "briefcase" },
  { slug: "44ae-calculator", title: "Section 44AE Calculator (Goods Carriages)", h1: "44AE Calculator — Presumptive Income for Goods Carriages", description: "Truck operators: per-vehicle monthly presumptive income — heavy and other goods vehicles.", category: "tax", server: true, icon: "truck" },
  { slug: "gst-calculator", title: "GST Calculator (Inclusive / Exclusive)", h1: "GST Calculator — Add or Remove GST", description: "Add GST to a price or extract it from an inclusive amount across 5%, 12%, 18% and 28% slabs.", category: "gst", server: true, icon: "percent" },
  { slug: "profit-margin-calculator", title: "Profit Margin Calculator", h1: "Profit Margin Calculator", description: "Cost price, selling price, margin and markup — see what every rupee of discount really costs you.", category: "business", server: true, icon: "trending-up" },
  { slug: "business-expense-calculator", title: "Business Expense Recorder & Tax Impact", h1: "Are You Recording All Legitimate Business Expenses?", description: "Log expenses by category with business-use % — see GST, deductibility and documentation gaps in one view.", category: "business", server: true, icon: "receipt" },
  { slug: "invoice-generator", title: "Invoice Generator (India)", h1: "Invoice Generator for Indian Businesses", description: "Create a GST-style invoice with your details, line items and totals — print or save as PDF.", category: "business", server: false, icon: "file-text" },
  { slug: "receipt-generator", title: "Receipt Generator (India)", h1: "Payment Receipt Generator", description: "Issue professional payment receipts for cash, UPI or bank transfers in seconds.", category: "business", server: false, icon: "receipt-indian-rupee" },
  { slug: "cash-flow-calculator", title: "Monthly Cash Flow Calculator", h1: "Cash Flow Calculator", description: "Map monthly inflows and outflows — see surplus months and stress months before they surprise you.", category: "business", server: true, icon: "waves" },
  { slug: "break-even-calculator", title: "Break-Even Calculator", h1: "Break-Even Point Calculator", description: "Fixed costs, variable costs and price — find the units and revenue where your business stops losing.", category: "business", server: true, icon: "equal" },
  { slug: "payment-reminder-generator", title: "Payment Reminder Generator", h1: "Polite Payment Reminder Generator", description: "Generate professional, escalating payment reminder messages for WhatsApp, SMS or email.", category: "business", server: true, icon: "bell" },
  { slug: "business-savings-calculator", title: "Business Savings Calculator", h1: "Total Business Savings Map", description: "One view of potential payment-fee savings, GST ITC, income-tax optimization and cost savings — estimated, sourced, dated.", category: "business", server: true, icon: "map" },
];

// ------------------------------------------------------------------ FAQ

/** Core Paliwal Saver FAQs (adapted for the Paliwal Secure AI website). */
export const SAVER_FAQS = [
  {
    q: "Is Paliwal Saver a tax-saving product that guarantees savings?",
    a: "No. Paliwal Saver is an information and estimation tool by Paliwal Secure AI. It identifies legal opportunities — payment-fee savings, potential GST input tax credit, lawful income-tax planning options and cost reductions — and explains eligibility conditions. Every number is labelled 'estimated' or 'potential'. Final treatment depends on applicable law, eligibility, documentation and your bank or payment provider.",
  },
  {
    q: "Will UPI payments above ₹2,000 really attract a fee?",
    a: "Under the announced framework, a 0.4% MDR applies to specified UPI P2M merchant transactions above ₹2,000 from 15 October 2026, with category-specific conditions and possible caps. Customers continue to pay via UPI without being charged this fee — it is a merchant-side collection cost. Your own applicability depends on your merchant classification and acquirer terms. Use the payment calculator to estimate under currently configured rules.",
  },
  {
    q: "Can I split a ₹10,000 payment into ₹2,000 pieces to avoid MDR?",
    a: "No — and we will not help with that. Artificially splitting one payment to avoid applicable payment charges may not comply with payment-network or merchant-acquirer rules. What we can do: compare legitimate payment methods, and check whether your business qualifies for a zero-MDR category such as the small-merchant UPI QR framework (up to ₹1 lakh/month, subject to conditions).",
  },
  {
    q: "Is the GST input tax credit shown to me guaranteed?",
    a: "No. ITC depends on statutory conditions: GST registration, a valid tax invoice, receipt of goods/services, the supplier having deposited the tax, your return being filed, and the expense not being a blocked credit under Section 17(5). We mark every item as 'likely eligible', 'requires review', 'not generally eligible', 'blocked credit u/s 17(5)' (food & beverages, catering, certain insurance — no ITC) or 'unknown', and list the documents you need.",
  },
  {
    q: "Do you file my taxes or GST returns?",
    a: "No. Paliwal Saver estimates and organises. Filing, representation and advisory remain with qualified professionals. For insurance needs, Paliwal Secure AI (Himanshu Paliwal, IRDAI Registered POSP IP429834) can help you with a free consultation.",
  },
  {
    q: "Which sources do you use for rules?",
    a: "The calculation engine prefers primary government sources — Income Tax Department, CBIC, GST Portal, NPCI, RBI, Finance Ministry / PIB notifications. Each result shows its source and a 'last verified' date. Random blogs are never used for core rules.",
  },
  {
    q: "Is my data safe? Do you ask for bank passwords or UPI PINs?",
    a: "We never ask for UPI PINs, OTPs, bank passwords or card PINs — ever. You only enter business-level estimates (turnover, expense categories, collection patterns). Nothing sensitive is required for any estimate.",
  },
  {
    q: "What does 'Paliwal Saver' cost?",
    a: "The calculators, checks and tools on the /saver page are free to use without registration. Optional Paliwal Secure AI services (insurance, protection) are offered separately — never forced before you get value.",
  },
];

/** Per-tool FAQ sets for the engine-backed calculators (values mirror the static rule payloads). */
export const TOOL_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  "payment-cost-calculator": [
    {
      q: "Who actually pays the MDR — me or my customer?",
      a: "Your customer keeps paying via UPI without being charged this fee. The announced 0.4% MDR on specified UPI P2M payments above ₹2,000 is a merchant-side collection cost — deducted from what lands in your account by your acquirer, like card MDR has always been. The calculator shows it from the merchant's side.",
    },
    {
      q: "Does the 0.4% apply to the whole payment or only the amount above ₹2,000?",
      a: "Under the currently configured rule set, once a specified UPI P2M payment crosses the ₹2,000 per-payment threshold, the rate applies to the full payment amount — the calculator mirrors that configured basis (e.g., ₹2,501 → ₹10.00 at 0.4%). If the final circular prescribes a different basis or caps, the rulebook is updated and the calculator follows automatically.",
    },
    {
      q: "Is my UPI QR covered by this calculator?",
      a: "It depends on your merchant classification, which your bank or payment service provider assigns. Small merchants in the P2PM category have a separate allowance (up to ₹1 lakh/month at zero MDR, subject to conditions) before any fallback rate applies. For a classification-aware view, use the Zero-MDR Eligibility questions inside the calculator.",
    },
    {
      q: "How do I legally reduce this cost instead of splitting payments?",
      a: "We will never help split one payment into smaller pieces — that artificial-splitting pattern can breach acquirer and payment-network rules. Legitimate levers: check your zero-MDR category eligibility, steer invoiced B2B amounts to bank transfers, and see where your collection mix naturally sits.",
    },
  ],
  "upipayments-calculator": [
    {
      q: "What counts as 'monthly UPI collections' for the small-merchant check?",
      a: "All money credited to your merchant QR code or merchant UPI ID in a calendar month — across every customer and every payment size. The ₹1 lakh/month zero-MDR allowance for small merchants in the P2PM category is measured on that monthly total, not per payment. Include everything; a rough figure is fine for planning.",
    },
    {
      q: "My collections crossed ₹1 lakh this month — what happens now?",
      a: "Under the configured fallback rule, collections beyond the ₹1 lakh monthly allowance attract an indicative 0.4% MDR. Crossing it usually means your business has grown into the specified-merchant (P2M) framework — a good problem to have. Plan payment routes and pricing around it rather than trying to dodge the category.",
    },
    {
      q: "Are UPI Lite, wallets and cards charged the same way?",
      a: "No. The configured rules here cover UPI P2M and P2PM classifications. Wallets and UPI Lite follow separate acquirer terms, and card MDR has its own RBI-capped schedule. For a side-by-side comparison of what each method costs your business, see the payment methods comparison.",
    },
    {
      q: "How can I lower my UPI charges without breaking the rules?",
      a: "Three legitimate levers: (1) verify your merchant classification with your acquirer — you may qualify for a zero-MDR category; (2) route invoiced B2B amounts to bank transfers; (3) understand which of your payments naturally sit at ₹2,000 and below.",
    },
  ],
  "gst-itc-checker": [
    {
      q: "What documents do I need to actually claim the credit?",
      a: "The statutory chain: a valid tax invoice from a GST-registered supplier, receipt of the goods or services, the supplier having deposited the tax in their GSTR-3B, and your own return being filed within time so the credit appears in your GSTR-2B. The result table lists the documents per expense state — treat it as your document checklist before you file.",
    },
    {
      q: "Why does food & beverages show as 'Blocked credit u/s 17(5)'?",
      a: "Section 17(5) of the CGST Act blocks input tax credit on food and beverages, outdoor catering, beauty treatment, health services, club memberships and certain insurance — even when consumed for business, with narrow exceptions (like a statutory canteen obligation). The checker shows these as a dedicated blocked state with ₹0 credit so you can track the spend without being tempted to claim it. Claiming blocked credits is a common GST-notice trigger.",
    },
    {
      q: "I'm not GST-registered — why does the tool still show potential ITC?",
      a: "Registration is a precondition for claiming any credit. If you're below the registration threshold you cannot claim ITC today, so the tool shows the truthful ₹0 — plus the potential figure you'd unlock if your turnover moves you into mandatory or voluntary registration. That's a planning signal, not a recommendation to register unnecessarily.",
    },
    {
      q: "My supplier didn't deposit the tax — is my credit lost?",
      a: "Possibly. ITC follows the supplier's deposit through GSTR-2B matching, and notices for mismatched credits are common. The risk flags on each row tell you which categories typically need a follow-up with the supplier. The legal fix is supplier compliance — never a workaround invoice.",
    },
  ],
  "income-tax-saver": [
    {
      q: "New regime or old regime — which should I pick?",
      a: "Neither is universally better — it depends on your deductions. The engine computes both: the new regime with its slabs and the Section 87A rebate (up to ₹60,000 where total income is up to ₹12 lakh), and the old regime with its deduction stack (80C, 80D, HRA and the ₹12,500 87A rebate at up to ₹5 lakh). The comparison shows the crossover point for your numbers.",
    },
    {
      q: "Is presumptive taxation 'avoiding' tax?",
      a: "No — it's a statutory option. Sections 44AD, 44ADA and 44AE let eligible small businesses and professionals declare income at a fixed deemed rate instead of maintaining full books. Parliament built it to reduce compliance burden. What it is not: a licence to suppress income, hide cash receipts, or claim it when you're ineligible. The engine checks eligibility conditions and shows the compliance trade-offs both ways.",
    },
    {
      q: "Can I use presumptive taxation and still deduct all my business expenses?",
      a: "No — that's the trade-off. Under presumptive taxation, the deemed profit replaces the regular profit computation, so you don't separately deduct business expenses to compute income under that section. The comparison tool shows both outcomes honestly: deemed income at 6%/8% (44AD) or 50% (44ADA) versus your books-based computation. Churn the numbers before choosing.",
    },
    {
      q: "Does this tool file my return or replace my CA?",
      a: "No. It maps lawful options — regime comparison, presumptive eligibility, deductible expense gaps — with sources and dates. Filing and representation stay with qualified professionals.",
    },
  ],
  "44ad-calculator": [
    {
      q: "Who is eligible for Section 44AD presumptive taxation?",
      a: "Resident individuals, Hindu undivided families, and partnership firms (not LLPs) with annual turnover up to ₹2 crore — rising to ₹3 crore where total cash receipts (and cash payments) stay at or below 5% of turnover. Companies are not eligible. The calculator applies these limits from the versioned rule set and flags eligibility in the comparison.",
    },
    {
      q: "What's the difference between the 6% and 8% deemed rates?",
      a: "6% of turnover for the portion received through prescribed digital modes or account payee instruments; 8% for the cash portion. Your digital-receipt share drives the blend — that's why the calculator splits receipts into digital and cash before computing deemed income.",
    },
    {
      q: "Do I escape bookkeeping and audit entirely under 44AD?",
      a: "You're relieved of maintaining regular books and tax audit (while turnover stays within the limits), and advance tax collapses to a single instalment by 15 March. You still need basic records — bank statements, turnover support, GST filings if registered — and declaring at least the deemed income keeps you out of the books/audit requirement.",
    },
    {
      q: "What happens if I declare less than the deemed rate?",
      a: "Declaring below the deemed income (6%/8%) triggers the requirement to maintain books and get them audited — the exact compliance burden 44AD exists to relieve. The calculator shows the deemed income line so you can see the floor before deciding.",
    },
  ],
  "44ada-calculator": [
    {
      q: "Which professions qualify for Section 44ADA?",
      a: "The specified professions: legal, medical, engineering, architectural, accountancy, technical consultancy, interior decoration and any other notified profession. If your work sits outside that list, the calculator will show 44ADA as unavailable — it checks the eligibility conditions from the rule set, not just the math.",
    },
    {
      q: "What are the ₹50 lakh and ₹75 lakh limits?",
      a: "Gross receipts up to ₹50 lakh qualify for 44ADA, rising to ₹75 lakh where total cash receipts are at or below 5% of gross receipts — the digital-receipt boost mirrors Section 44AD's ₹2/₹3 crore structure. The calculator applies whichever limit your receipts pattern supports.",
    },
    {
      q: "Deemed income is 50% — can I declare a higher profit?",
      a: "Yes. 50% is the floor presumable income for eligible professionals — you may voluntarily declare a higher profit, and some do to strengthen loan applications or carry-forward credibility. What you cannot do is declare lower than the deemed rate without triggering books and audit requirements.",
    },
    {
      q: "Does 44ADA apply to my company or LLP?",
      a: "No. 44ADA covers resident individuals and partnership firms other than LLPs — companies and LLPs compute taxable income under regular provisions. The structure field in the calculator guards this automatically.",
    },
  ],
  "44ae-calculator": [
    {
      q: "What is the ten-vehicle ownership limit in Section 44AE?",
      a: "44AE applies to assessees who own not more than ten goods carriages at any time during the year. Cross that line and 44AE stops applying — regular books (and possibly audit) apply instead. The calculator cross-checks your fleet against the limit before computing deemed income.",
    },
    {
      q: "Why are there two rates — ₹7,500 and ₹3,500 per vehicle?",
      a: "Per the configured Income-tax Rules (Rule 7F): heavy goods vehicles (gross vehicle weight / laden capacity above 12 tonnes) carry deemed income of ₹7,500 per vehicle per month; other goods carriages carry ₹3,500. The rate is per month or part thereof of ownership.",
    },
    {
      q: "I lease my trucks to a transport company — does 44AE still apply?",
      a: "The section keys on ownership of the goods carriages, so a fleet you own can qualify even when a transporter operates it. But mixed arrangements (owned + leased-in vehicles) change the count and the analysis — verify your specific ownership pattern against the Act text before relying on the estimate.",
    },
    {
      q: "Is per-vehicle presumptive income all I pay tax on?",
      a: "The deemed income (rate × vehicles × months) replaces profit computation for the carriage business under 44AE — no separate expense deductions for that income. Other business income you may have is taxed normally. Advance tax for 44AE assessees is due by 15 March in a single instalment.",
    },
  ],
};

/** Generic FAQ set for any engine tool without a TOOL_FAQS entry (fallback). */
export const ENGINE_FAQS_FALLBACK: Array<{ q: string; a: string }> = [
  {
    q: "Is this calculator free?",
    a: "Yes — free, unlimited, and no sign-up required on the /saver page.",
  },
  {
    q: "Are the rules hard-coded?",
    a: "Rules live in a versioned static rulebook with effective dates, sources and verification stamps. Each result records the rule version used — 'Calculated using rules verified on DD/MM/YYYY'.",
  },
  {
    q: "Can it tell me my exact fee or tax?",
    a: "It produces estimates based on the information you provide. Actual fees depend on your acquirer, merchant classification and category-specific caps; actual tax depends on your books and the Finance Act applicable to your year.",
  },
  {
    q: "Will it help me avoid charges by splitting payments?",
    a: "No — artificially splitting one payment to avoid applicable charges can breach payment-network and acquirer rules. We compare legitimate methods and check your zero-MDR category eligibility instead.",
  },
];

// ------------------------------------------------------------------ misc

export const DISCLAIMERS = {
  estimate:
    "Estimate based on the information provided. Final treatment depends on current law, eligibility, documentation and your financial institution.",
  rules:
    "Estimated under current configured rules. Rules change — always confirm the applicable circular, notification or Act text before acting.",
  ai: "Saver AI is an information assistant, not a tax advisor. It never invents your numbers and never recommends evasion — only legal optimization paths.",
} as const;
