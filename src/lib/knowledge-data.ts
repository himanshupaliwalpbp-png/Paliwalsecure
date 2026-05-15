// ============================================================================
// Knowledge Hub — Shared Data
// Articles, FAQs, Glossary for /knowledge route
// ============================================================================

export type ArticleCategory = 'health' | 'life' | 'motor' | 'general';

export interface KnowledgeArticle {
  slug: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  readTime: number;
  imageGradient: string;
  keyTakeaways: string[];
  body: string;
  relatedSlugs: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: ArticleCategory;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: ArticleCategory;
}

// ── Blog Articles ──────────────────────────────────────────────────────────

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'how-to-file-health-insurance-claim',
    title: 'How to File a Health Insurance Claim',
    summary: 'Step-by-step guide for filing health insurance claims in India. Cashless aur reimbursement dono process cover kiye gaye hain with IRDAI 2025 rules.',
    category: 'health',
    readTime: 8,
    imageGradient: 'from-rose-500 to-pink-600',
    keyTakeaways: [
      'Cashless claim ke liye pre-authorization 1 hour mein approve hona chahiye (IRDAI 2025 rule)',
      'Reimbursement claim mein discharge summary sabse important document hai',
      'Claim intimate karo hospitalization se pehle ya 24 ghante ke andar',
      'TPA (Third Party Administrator) ke through bhi claim process ho sakta hai',
      'Claim rejection ke against IRDAI se complaint kar sakte hain within 30 days',
    ],
    body: `
## Health Insurance Claim Filing — Complete Guide

Insurance claim file karna aksar confusing lagta hai, lekin agar aap sahi steps follow karein toh yeh bilkul aasan hai. Is article mein hum cashless aur reimbursement dono tarah ke claims ko detail mein samjhenge.

### Cashless Claim Process

Cashless claim mein aapko paisa nahi dena padta — hospital aur insurance company directly settle karti hain. Yeh steps follow karein:

1. **Network Hospital Choose Karein** — Pehle confirm karein ki hospital aapki insurance company ka network hospital hai. Nahi toh reimbursement apply karna padega.

2. **Pre-Authorization Form Bharein** — Hospital ki insurance desk pe pre-auth form bharein. IRDAI 2025 rules ke according, pre-auth approval 1 ghante ke andar aana chahiye.

3. **Documents Submit Karein** — Health card, ID proof, aur doctor ki recommendation letter submit karein.

4. **Approval Wait Karein** — Insurance company claim approve ya reject karegi. Agar reject hota hai toh reason bataya jayega.

5. **Discharge** — Approval ke baad aap directly discharge ho sakte hain. Bill insurance company directly pay karegi.

### Reimbursement Claim Process

Agar aap non-network hospital mein treatment karte hain, toh reimbursement claim file karna padega:

1. **Claim Intimate Karein** — Hospitalization ke 24 ghante ke andar insurance company ko inform karein.

2. **Bills Collect Karein** — Original bills, discharge summary, prescription, aur test reports collect karein.

3. **Claim Form Bharein** — Insurance company ki claim form bharein aur saari documents attach karein.

4. **Submit Karein** — Claim form aur documents insurance company ko submit karein within 30-60 days of discharge.

5. **Processing** — Insurance company 15-30 days mein claim process karegi.

### Important Documents Checklist
- Health Insurance Card / Policy Copy
- Identity Proof (Aadhaar / PAN)
- Discharge Summary (MOST IMPORTANT)
- Original Hospital Bills
- Doctor's Prescription & Consultation Notes
- Diagnostic Reports (Blood, X-ray, MRI etc.)
- Pharmacy Bills with Prescriptions
- NEFT / Bank Details for Reimbursement

### Common Reasons for Claim Rejection
- **Waiting Period**: Pre-existing diseases ke liye waiting period (2-4 years) mein claim reject ho sakta hai
- **Incomplete Documents**: Discharge summary ya original bills nahi diye toh reject
- **Policy Exclusions**: Maternity, cosmetic surgery, self-inflicted injuries generally excluded hain
- **Late Intimation**: 24 ghante ke andar claim intimate nahi kiya toh problem ho sakti hai
- **Room Rent Capping**: Agar room rent limit se zyada hai toh proportional deduction hoga
    `,
    relatedSlugs: ['term-insurance-vs-ulip', 'why-csr-matters', 'what-is-cashless-hospitalization'],
  },
  {
    slug: 'term-insurance-vs-ulip',
    title: 'Term Insurance vs ULIP: Which is Better?',
    summary: 'Term insurance aur ULIP mein fark samjhiye — kaunsa aapke liye better hai? Premium, returns, aur risk ka complete comparison.',
    category: 'life',
    readTime: 6,
    imageGradient: 'from-blue-500 to-indigo-600',
    keyTakeaways: [
      'Term insurance sabse sasta pure protection plan hai — no returns, only life cover',
      'ULIP mein investment + insurance dono hai, lekin charges zyada hain',
      'Agar sirf protection chahiye toh Term Plan + Mutual Fund alag se better option hai',
      'ULIP mein 5-year lock-in period hota hai aur market risk hai',
      'Term plan ka claim settlement ratio zyada important hai returns se',
    ],
    body: `
## Term Insurance vs ULIP — Kaunsa Better Hai?

Yeh India mein sabse common sawaal hai — kya hume term plan lena chahiye ya ULIP? Dono mein bahut fark hai. Aaiye detail mein samjhte hain.

### Term Insurance — Pure Protection

Term insurance ek simple plan hai — aap premium dete hain aur agar kuch ho jaaye toh family ko sum assured milta hai. Agar policy period mein kuch nahi hota toh koi return nahi milta.

**Benefits:**
- Bahut kam premium mein bada cover milta hai (₹1 Cr cover ~₹800-1000/month)
- Simple structure — koi confusion nahi
- Tax benefit under Section 80C
- Online khareed sakte hain, medical bhi hota hai

**Drawbacks:**
- Koi maturity benefit nahi — premium "waste" lagta hai (lekin actually nahi hai!)
- Survival benefit zero hai

### ULIP — Insurance + Investment

ULIP (Unit Linked Insurance Plan) mein aapka premium do parts mein divide hota hai — ek part life cover ke liye, doosra part market mein invest hota hai.

**Benefits:**
- Dual benefit — insurance + investment
- Tax benefit under 80C and 10(10D)
- Fund switching option — equity to debt switch kar sakte hain
- Partial withdrawal after 5 years

**Drawbacks:**
- Premium bahut zyada hota hai — same cover ke liye 5-10x
- Multiple charges: fund management, administration, mortality, premium allocation
- Market risk — investment returns guaranteed nahi hain
- 5-year lock-in period
- Insurance cover bhi kam hota hai (premium ka sirf 10x milta hai roughly)

### Our Recommendation

**Best Strategy**: Term Plan + Mutual Fund (SIP) alag se!

- ₹1 Cr Term Plan: ~₹900/month
- ₹5,000/month SIP in Equity Mutual Fund
- Total: ~₹5,900/month

Compare this with ULIP jisme same amount mein sirf ₹10-15 lakh cover milega aur returns bhi uncertain hain.

### Comparison Table

| Feature | Term Insurance | ULIP |
|---------|---------------|------|
| Premium | Low (₹800-1000/mo for ₹1Cr) | High (₹5,000-10,000/mo) |
| Life Cover | High (₹1Cr+) | Low (10x annual premium) |
| Returns | None | Market-linked |
| Charges | Minimal | Multiple charges |
| Flexibility | High | Limited |
| Tax Benefit | 80C | 80C + 10(10D) |
    `,
    relatedSlugs: ['how-to-file-health-insurance-claim', 'why-csr-matters', 'what-is-deductible'],
  },
  {
    slug: 'why-csr-matters',
    title: 'Why CSR Matters When Choosing an Insurer',
    summary: 'CSR (Claim Settlement Ratio) kya hai aur insurance company choose karte waqt kyun important hai? IRDAI data ke saath complete guide.',
    category: 'general',
    readTime: 5,
    imageGradient: 'from-amber-500 to-orange-600',
    keyTakeaways: [
      'CSR = Claims Approved / Total Claims × 100 — higher is better',
      'CSR 95%+ wali company choose karein for peace of mind',
      'CSR alone kaafi nahi — ICR (Incurred Claim Ratio) bhi check karein',
      'IRDAI har saal CSR data publish karta hai — latest data check karein',
      'Claim settlement amount bhi dekhen — sirf number nahi, amount bhi matter karti hai',
    ],
    body: `
## Why CSR (Claim Settlement Ratio) Matters

Jab bhi aap insurance company choose karte hain, sabse pehla number jo dekhna chahiye wo hai CSR — Claim Settlement Ratio. Yeh batata hai ki kitne percent claims company approve karti hai.

### CSR Kya Hota Hai?

**CSR = (Number of Claims Settled / Total Claims Received) × 100**

Agar kisi company ne 1000 claims receive kiye aur 970 settle kiye, toh CSR = 97%.

### CSR Kyun Important Hai?

1. **Trust Indicator**: High CSR matlab company claims reject karna pasand nahi karti — yeh trust ka signal hai.

2. **Peace of Mind**: Jab aap premium pay karte hain, aapko yakeen hona chahiye ki claim pe paisa milega. High CSR yakeen deta hai.

3. **Comparison Tool**: 2 companies mein choose karna ho toh CSR ek objective measure hai.

### CSR Interpretation Guide

| CSR Range | Meaning | Action |
|-----------|---------|--------|
| 99%+ | Excellent | Best choice |
| 95-99% | Good | Reliable |
| 90-95% | Average | Check details |
| Below 90% | Risky | Avoid if possible |

### CSR vs ICR — Dono Check Karein

CSR kitne claims settle huye — ICR kitna paisa claims mein chala gaya.

- **ICR 50-80%**: Good — company profit bhi kama rahi hai aur claims bhi pay kar rahi hai
- **ICR > 90%**: Concern — company ka profit kam hai, future mein premium badh sakta hai
- **ICR < 50%**: Suspicious — claims reject kar rahi ho sakti hai ya premium zyada charge kar rahi hai

### Top Companies by CSR (IRDAI 2024-25 Data)

**Health Insurance:**
- Star Health: 87% CSR
- HDFC ERGO: 92% CSR
- ICICI Lombard: 89% CSR

**Life Insurance:**
- LIC: 98.5% CSR
- Max Life: 99.3% CSR
- HDFC Life: 99.0% CSR

### Pro Tips
- Last 3 saal ka CSR trend dekhen — ek saal ka data misleading ho sakta hai
- CSR ke saath claim amount bhi dekhen — chhote claims settle karna aasan hai
- Repudiation ratio (rejection %) bhi check karein
- IRDAI website se original data verify karein
    `,
    relatedSlugs: ['how-to-file-health-insurance-claim', 'term-insurance-vs-ulip', 'what-is-cashless-hospitalization'],
  },
  {
    slug: 'motor-insurance-comprehensive-guide',
    title: 'Motor Insurance 101: Comprehensive vs Third Party',
    summary: 'Car aur bike insurance mein Third Party aur Comprehensive plan ka fark samjhiye. IDV, NCB, Zero Dep sab cover kiya gaya hai.',
    category: 'motor',
    readTime: 7,
    imageGradient: 'from-amber-500 to-orange-600',
    keyTakeaways: [
      'Third Party insurance legally mandatory hai India mein',
      'Comprehensive plan aapki khud ki gaadi bhi cover karta hai',
      'NCB se 50% tak discount mil sakta hai on premium',
      'Zero Depreciation add-on new cars ke liye must hai',
      'IDV sahi set karein — zyada rakhne se premium badhega, kam rakhne se claim kam milega',
    ],
    body: `
## Motor Insurance — Complete Guide

India mein gaadi chalane ke liye insurance zaroori hai — kam se kam Third Party. Lekin kaunsa plan better hai? Aaiye samjhte hain.

### Third Party Insurance (Mandatory)

Yeh legally required hai. Isme:
- **Tie ke gaadi/insaan ko nuksan** — cover hoga
- **Aapki khud ki gaadi ka nuksan** — NOT covered
- Premium IRDAI fix karta hai (engine capacity ke basis pe)

### Comprehensive Insurance (Recommended)

Isme Third Party + Own Damage dono cover hain:
- Aapki gaadi ka nuksan (accident, theft, natural calamity)
- Third party liability bhi
- Add-ons available: Zero Dep, Engine Cover, RSA, Return to Invoice

### Key Terms

**IDV (Insured Declared Value)**: Aapki gaadi ki market value — yeh maximum amount hai jo claim pe milega. IDV sahi set karna bahut important hai.

**NCB (No Claim Bonus)**: Agar saal mein koi claim nahi kiya toh next year premium mein discount. 20% se start hokar 50% tak jata hai.

**Zero Depreciation**: Normal claim mein depreciation deduct hota hai. Zero Dep add-on mein full amount milta hai — new cars ke liye must.

### Premium Calculation
- OD Premium = IDV × Rate (car: ~3.5%, bike: ~5%)
- NCB Discount apply
- TP Premium (IRDAI fixed)
- Add-ons extra
- GST 18%
    `,
    relatedSlugs: ['why-csr-matters', 'what-is-ncb', 'what-is-idv'],
  },
  {
    slug: 'health-insurance-waiting-period',
    title: 'Waiting Period in Health Insurance Explained',
    summary: 'Initial waiting period, PED waiting period, maternity waiting period — sab types samjhiye aur kaise deal karein.',
    category: 'health',
    readTime: 6,
    imageGradient: 'from-rose-500 to-pink-600',
    keyTakeaways: [
      'Initial waiting period 30 days hota hai (accidents ko chhod ke)',
      'Pre-existing diseases ka waiting period 2-4 saal hai',
      'Maternity cover ka waiting period 9 months se 4 saal tak ho sakta hai',
      'IRDAI 2024 ke baad PED waiting period reduce ho raha hai kuch plans mein',
      'Waiting period mein claim reject ho sakta hai — policy documents dhyan se padhein',
    ],
    body: `
## Waiting Period in Health Insurance — Complete Guide

Waiting period woh time hai jab aap policy le chuke hain lekin abhi claim nahi kar sakte. Yeh insurance companies ka fraud prevention measure hai.

### Types of Waiting Periods

**1. Initial Waiting Period (30 Days)**
Policy start hone ke 30 din tak koi claim nahi kar sakte (accidents ko chhod ke). Yeh sabhi plans mein hota hai.

**2. Pre-Existing Disease (PED) Waiting Period (2-4 Years)**
Agar aapko pehle se koi bimari hai (diabetes, BP, heart disease) toh uska claim 2-4 saal ke baad hi milega. IRDAI 2024 guidelines ke baad yeh period reduce ho raha hai.

**3. Specific Disease Waiting Period (1-2 Years)**
Kuch specific diseases (cataract, hernia, joint replacement) ke liye alag waiting period hota hai — 1-2 saal.

**4. Maternity Waiting Period (9 months - 4 Years)**
Maternity benefits ke liye minimum 9 months se 4 saal tak wait karna pad sakta hai.

### How to Reduce Waiting Period Impact
- Early purchase karein — kam age mein kam bimariyan
- PED waiver add-on lein (available in some plans)
- Corporate plans mein waiting period often waived hota hai
- Portability se waiting period carry forward hota hai
    `,
    relatedSlugs: ['how-to-file-health-insurance-claim', 'what-is-ped', 'can-i-port-my-policy'],
  },
  {
    slug: 'section-80d-tax-saving-guide',
    title: 'Section 80D: Tax Saving with Health Insurance',
    summary: 'Health insurance se kaise tax bachayein? Section 80D ke under ₹75,000 tak deduction ka complete guide with examples.',
    category: 'general',
    readTime: 5,
    imageGradient: 'from-violet-500 to-purple-600',
    keyTakeaways: [
      'Self + family ke liye ₹25,000 deduction under 80D',
      'Senior citizen parents ke liye additional ₹50,000 deduction',
      'Total maximum deduction: ₹75,000 (self + senior parents)',
      'Preventive health checkup ke liye ₹5,000 within overall limit',
      'Premium parents ke naam pe bhi aap claim kar sakte hain',
    ],
    body: `
## Section 80D — Tax Saving Guide

Health insurance sirf health protection nahi — yeh tax bhi bachata hai! Section 80D ke under aap health insurance premium ka deduction claim kar sakte hain.

### Deduction Limits (FY 2025-26)

| For Whom | Deduction Limit |
|----------|----------------|
| Self + Family (below 60) | ₹25,000 |
| Self + Family (above 60) | ₹50,000 |
| Parents (below 60) | ₹25,000 |
| Parents (above 60) | ₹50,000 |

### Maximum Deduction Examples

**Example 1**: You (35) + Parents (65)
- Self: ₹25,000
- Parents: ₹50,000
- **Total: ₹75,000**

**Example 2**: You (65) + Parents (70)
- Self: ₹50,000
- Parents: ₹50,000
- **Total: ₹1,00,000**

### Important Points
- Cash payment pe deduction nahi milta (except preventive checkup)
- Premium employer ne pay kiya toh aapko deduction nahi milega
- Multi-year policy ka deduction proportionally spread hota hai
- Super Top-Up ka premium bhi 80D mein claim hai
    `,
    relatedSlugs: ['why-csr-matters', 'term-insurance-vs-ulip'],
  },
  {
    slug: 'no-claim-bonus-explained',
    title: 'No Claim Bonus (NCB): Complete Guide',
    summary: 'NCB kya hai, kaise kaam karta hai, aur kaise preserve karein — health aur motor dono insurance mein NCB explained.',
    category: 'general',
    readTime: 4,
    imageGradient: 'from-emerald-500 to-teal-600',
    keyTakeaways: [
      'NCB = discount on premium for claim-free years',
      'Motor insurance mein 20% se 50% tak NCB discount milta hai',
      'Health insurance mein NCB sum insured badhata hai (not premium discount)',
      'NCB protect add-on lein — chhote claims ke liye NCB safe rahega',
      'Policy port karte waqt NCB transfer ho jata hai',
    ],
    body: `
## No Claim Bonus (NCB) — Complete Guide

NCB ek reward hai claim-free ke liye — insurance company deti hai jab aap saal bhar koi claim nahi karte. Dono health aur motor insurance mein kaam karta hai, lekin alag tarah se.

### Motor Insurance NCB

| Claim-Free Years | NCB Discount |
|------------------|-------------|
| 1st Year | 20% |
| 2nd Year | 25% |
| 3rd Year | 35% |
| 4th Year | 45% |
| 5th Year+ | 50% |

**Important**: Ek claim se NCB zero ho jata hai! NCB Protect add-on lein chhote claims ke liye.

### Health Insurance NCB

Health mein NCB premium discount nahi — sum insured badhta hai:
- Cumulative Bonus: Har claim-free saal 5-10% sum insured badhta hai
- Maximum 50-100% tak badh sakta hai (plan pe depend karta hai)
- Agar claim kiya toh bonus reduce ho sakta hai (not necessarily zero)

### NCB Preservation Tips
1. Chhote claims mat karein — khud pay karein, NCB save karein
2. NCB Protect add-on lein motor insurance mein
3. Policy port karte waqt NCB certificate lein
4. Renewal pe NCB verify karein
    `,
    relatedSlugs: ['motor-insurance-comprehensive-guide', 'why-csr-matters', 'what-is-ncb'],
  },
  {
    slug: 'maternity-insurance-guide',
    title: 'Maternity Insurance in India: What You Need to Know',
    summary: 'Maternity coverage kaise kaam karta hai, waiting period, sub-limits, aur best plans for expecting parents.',
    category: 'health',
    readTime: 5,
    imageGradient: 'from-pink-500 to-rose-600',
    keyTakeaways: [
      'Maternity benefit ke liye 9 months se 4 saal tak waiting period hota hai',
      'Normal delivery: ₹15,000-₹50,000 cover; C-Section: ₹25,000-₹75,000',
      'Sub-limits apply hote hain — total sum insured se alag',
      'Corporate plans mein maternity cover often better hota hai',
      'Newborn baby cover 90 days ke baad hi available hai generally',
    ],
    body: `
## Maternity Insurance Guide — India

Maternity insurance planning mein important part hai — delivery expenses kabhi kabhi ₹50,000-₹2,00,000 tak ja sakte hain (hospital pe depend karta hai).

### How Maternity Cover Works

Maternity benefit health insurance ka part hota hai (ya add-on ke roop mein). Lekin iske rules alag hain:

1. **Waiting Period**: Minimum 9 months, maximum 4 saal — plan pe depend karta hai
2. **Sub-Limits**: Total sum insured ke andar maternity ke liye alag limit hota hai
3. **Delivery Types**: Normal aur C-Section dono covered, lekin amounts alag hain
4. **Pre/Post Natal**: Doctor visits, tests, ultrasound generally covered

### Best Maternity Insurance Plans

**1. Star Women Care**: Maternity cover from Day 1 (waiting period waiver available)
**2. HDFC ERGO Energy**: Comprehensive maternity with newborn cover
**3. Niva Bupa Health Companion**: Good maternity sub-limits

### Planning Tips
- Plan ahead — pregnancy se pehle policy lein
- Waiting period complete hone tak plan karein
- Corporate insurance check karein — maternity often better hota hai
- Newborn ko bhi jaldi add karein policy mein
    `,
    relatedSlugs: ['how-to-file-health-insurance-claim', 'health-insurance-waiting-period'],
  },
];

// ── FAQ Data ───────────────────────────────────────────────────────────────

export const faqItems: FAQItem[] = [
  {
    id: 'faq-01',
    question: 'What is waiting period in insurance?',
    answer: 'Waiting period woh time hai jab aap policy le chuke hain lekin abhi certain claims nahi kar sakte. Initial waiting period 30 days hota hai, PED (Pre-existing Disease) ke liye 2-4 saal, aur maternity ke liye 9 months se 4 saal tak. Accidents ka waiting period nahi hota — turant claim kar sakte hain.',
    category: 'health',
  },
  {
    id: 'faq-02',
    question: 'Can I port my health insurance policy?',
    answer: 'Haan! IRDAI ke rules ke under aap apni health insurance policy port kar sakte hain bina waiting period lose kiye. Portability ke liye renewal date se 45 din pehle application deni padti hai. Aapki accumulated NCB aur waiting period benefits nayi company mein transfer ho jayengi.',
    category: 'health',
  },
  {
    id: 'faq-03',
    question: 'What is No Claim Bonus (NCB)?',
    answer: 'NCB ek reward hai claim-free saal ke liye. Motor insurance mein premium par 20-50% discount milta hai. Health insurance mein sum insured 5-10% badhta hai har claim-free saal. Ek claim se motor NCB zero ho jata hai, lekin health mein reduction gradual hota hai.',
    category: 'general',
  },
  {
    id: 'faq-04',
    question: 'What documents are needed to file a claim?',
    answer: 'Claim filing ke liye ye documents zaroori hain: Health Insurance Card, ID Proof (Aadhaar/PAN), Discharge Summary (sabse important), Original Hospital Bills, Doctor ki Prescription, Diagnostic Reports (Blood test, X-ray, MRI), aur Pharmacy Bills. Reimbursement mein NEFT details bhi chahiye.',
    category: 'health',
  },
  {
    id: 'faq-05',
    question: 'What is cashless hospitalization?',
    answer: 'Cashless hospitalization mein aapko paisa nahi dena padta — hospital aur insurance company directly settle karti hain. Yeh sirf network hospitals mein possible hai. IRDAI 2025 rule ke according pre-auth approval 1 ghante mein aana chahiye. Non-network hospital mein reimbursement karna padta hai.',
    category: 'health',
  },
  {
    id: 'faq-06',
    question: 'Can I have multiple health insurance policies?',
    answer: 'Haan, aap multiple health insurance policies rakh sakte hain! Lekin total claim amount actual expense se zyada nahi ho sakta. Contribution clause ke under expenses dono companies proportionally share karengi. Second policy ke liye first ki claim settlement copy submit karni padti hai.',
    category: 'health',
  },
  {
    id: 'faq-07',
    question: 'What is a deductible in insurance?',
    answer: 'Deductible woh amount hai jo aapko khud pay karni hoti hai before insurance kicks in. Example: Agar ₹10,000 deductible hai aur claim ₹50,000 ka hai, toh aap ₹10,000 pay kareinge aur insurance ₹40,000 dega. Higher deductible = lower premium. Yeh mostly top-up plans aur international travel insurance mein hota hai.',
    category: 'general',
  },
  {
    id: 'faq-08',
    question: 'How does maternity coverage work?',
    answer: 'Maternity cover health insurance mein available hai lekin waiting period ke saath — 9 months se 4 saal tak. Normal delivery ke liye ₹15,000-₹50,000 aur C-Section ke liye ₹25,000-₹75,000 cover milta hai. Sub-limits apply hote hain. Pregnancy se pehle policy lein taaki waiting period complete ho jaye.',
    category: 'health',
  },
  {
    id: 'faq-09',
    question: 'What is the difference between term and whole life insurance?',
    answer: 'Term insurance pure protection hai — kam premium mein bada cover, lekin maturity benefit nahi. Whole life insurance (endowment) mein insurance + savings dono hain, premium zyada hai, aur maturity benefit milta hai. Financial advisors recommend: Term Plan + Mutual Fund SIP separate — ULIPs aur endowment plans se better returns milte hain.',
    category: 'life',
  },
  {
    id: 'faq-10',
    question: 'Is COVID-19 covered in health insurance?',
    answer: 'Haan, IRDAI ne clear kiya hai ki COVID-19 treatment health insurance mein covered hai. Hospitalization expenses, ICU charges, oxygen support — sab covered. Home isolation treatment bhi kuch plans mein cover hai. Waiting period apply nahi hota COVID ke liye. Lekin quarantine expenses generally covered nahi hain.',
    category: 'health',
  },
  {
    id: 'faq-11',
    question: 'What is a floater policy?',
    answer: 'Floater policy ek single policy hai jo poore family ko cover karti hai — ek sum insured sabke beech shared hota hai. Example: ₹10 Lakh family floater mein 4 members covered hain. Yeh individual plans se sasta padta hai, lekin agar ek member zyada use kare toh doosron ke liye kam bachega. Small families ke liye floater better hai.',
    category: 'general',
  },
  {
    id: 'faq-12',
    question: 'Can I buy insurance for my parents?',
    answer: 'Bilkul! Aap apne parents ke liye health insurance khareed sakte hain aur premium aap bhi pay kar sakte hain. Senior citizen plans available hain (60+ age) jo pre-existing diseases bhi cover karte hain after waiting period. Section 80D mein parents ke premium ke liye additional ₹25,000-₹50,000 ka tax deduction bhi milta hai.',
    category: 'health',
  },
];

// ── Glossary Data ──────────────────────────────────────────────────────────

export const glossaryTerms: GlossaryTerm[] = [
  { term: 'Annuity', definition: 'Regular income payment from insurance company, typically after retirement. Pension plans mein annuity milti hai — lump sum invest karo, monthly income paao.', category: 'life' },
  { term: 'Bonus', definition: 'Insurance company dwara declared additional benefit on with-profit policies. Reversionary bonus har saal add hota hai, terminal bonus maturity pe milta hai.', category: 'life' },
  { term: 'Cashless', definition: 'Network hospital mein treatment ke liye paisa nahi dena padta — hospital aur insurer directly settle karte hain. IRDAI 2025 rule: pre-auth 1 hour mein approve hona chahiye.', category: 'health' },
  { term: 'Co-payment', definition: 'Policyholder ko har claim ka fixed percentage khud pay karna padta hai. Example: 10% co-pay hai toh ₹1 lakh claim mein aap ₹10,000 pay kareinge. Co-pay se premium kam hota hai.', category: 'health' },
  { term: 'Critical Illness', definition: 'Serious diseases (cancer, heart attack, stroke) ke liye lump sum payment. Yeh health insurance se alag hai — diagnosis pe paisa milta hai, hospitalization zaroori nahi.', category: 'health' },
  { term: 'CSR (Claim Settlement Ratio)', definition: 'Total claims settled / Total claims received × 100. Higher CSR better hai — matlab company claims approve karti hai. 95%+ CSR wali company reliable hai.', category: 'general' },
  { term: 'Deductible', definition: 'Claim se pehle aapko khud jo amount pay karna padta hai. Higher deductible = lower premium. Top-up plans mein deductible hota hai.', category: 'general' },
  { term: 'Endowment', definition: 'Life insurance + savings plan — maturity pe guaranteed amount milta hai aur death benefit bhi hai. Premium term insurance se zyada hai lekin returns bhi hain.', category: 'life' },
  { term: 'Floater', definition: 'Ek policy mein poora family covered — sum insured sabke beech shared hota hai. Individual plans se sasta, lekin ek member zyada use kare toh doosron ke liye kam bachega.', category: 'health' },
  { term: 'Free Look Period', definition: 'Policy milne ke 15-30 din ke andar agar aapko policy pasand nahi aaye toh cancel kar sakte hain with full refund (minus medical test charges). IRDAI ka mandatory rule hai.', category: 'general' },
  { term: 'Grace Period', definition: 'Premium payment ke baad extra time (15-30 days) jab tak policy active rehti hai. Grace period mein claim kar sakte hain, lekin premium with interest pay karna padega.', category: 'general' },
  { term: 'ICR (Incurred Claim Ratio)', definition: 'Total claims paid / Total premium collected × 100. 50-80% ICR healthy hai — company profit bhi kama rahi hai aur claims bhi pay kar rahi hai. 90%+ se zyada concern hai.', category: 'general' },
  { term: 'IDV (Insured Declared Value)', definition: 'Motor insurance mein gaadi ki current market value — yeh maximum amount hai jo theft/total loss claim pe milega. IDV zyada rakhne se premium badhega, kam rakhne se claim kam milega.', category: 'motor' },
  { term: 'Loading', definition: 'Extra premium charge for high-risk individuals — smokers, pre-existing diseases, ya hazardous occupation wale logon ke liye. Loading 10-100% tak ho sakta hai base premium pe.', category: 'general' },
  { term: 'Maternity Cover', definition: 'Pregnancy aur delivery expenses ka cover — normal aur C-section dono. Waiting period 9 months se 4 saal, aur sub-limits apply hote hain. Newborn cover bhi available hai.', category: 'health' },
  { term: 'Moratorium', definition: 'IRDAI ka rule: 8 saal continuous renewal ke baad insurer claim reject nahi kar sakta (fraud ko chhod ke). Yeh policyholder protection measure hai — long-term policyholders ke liye security.', category: 'general' },
  { term: 'NCB (No Claim Bonus)', definition: 'Claim-free saal ka reward — motor mein premium par 20-50% discount, health mein sum insured 5-10% badhta hai. Policy port karte waqt NCB transfer hota hai.', category: 'motor' },
  { term: 'OD (Own Damage)', definition: 'Motor insurance mein aapki khud ki gaadi ka nuksan cover — accident, theft, fire, natural calamity. Comprehensive plan = OD + Third Party. Standalone OD bhi available hai now.', category: 'motor' },
  { term: 'PED (Pre-Existing Disease)', definition: 'Policy se pehle se existing bimari — diabetes, BP, heart disease etc. Inka claim 2-4 saal waiting period ke baad hi milta hai. IRDAI 2024 ke baad yeh period reduce ho raha hai.', category: 'health' },
  { term: 'Portability', definition: 'Bina benefits lose kiye dusri insurance company mein shift hona. Waiting period aur NCB transfer ho jate hain. Renewal se 45 din pehle application deni hoti hai IRDAI ke rules ke according.', category: 'general' },
  { term: 'Premium', definition: 'Insurance cover ke liye pay karna padta hai — monthly, quarterly, ya annually. Premium depend karta hai: age, health, sum insured, occupation, aur add-ons pe.', category: 'general' },
  { term: 'Reimbursement', definition: 'Pehle aap hospital bills pay karein, baad mein insurance company se claim karein. Non-network hospitals mein yeh process hota hai. Original bills aur discharge summary submit karni padti hai.', category: 'health' },
  { term: 'Rider', definition: 'Base policy ke saath add-on benefit — Critical Illness, Accidental Death, Hospital Cash, Waiver of Premium. Riders se extra protection milti hai chhote premium mein.', category: 'life' },
  { term: 'Room Rent Capping', definition: 'Hospital room rent ke liye maximum limit — usually sum insured ka 1-2%. Isse zyada room liya toh proportional deduction hoga SAARI expenses mein (doctor fees, surgery, etc.).', category: 'health' },
  { term: 'Sub-limit', definition: 'Total sum insured ke andar specific treatments ke liye maximum amount. Example: ₹5 Lakh policy mein cataract ke liye ₹40,000 sub-limit. Sub-limits dhyan se check karein before buying.', category: 'health' },
  { term: 'Sum Insured', definition: 'Maximum amount insurance company pay karegi ek policy year mein. Yeh aapka total coverage hai. Health mein ₹3-25 Lakh common hai, term mein ₹50 Lakh-₹5 Crore.', category: 'general' },
  { term: 'Surrender Value', definition: 'Life insurance policy bechne pe jo amount milta hai after minimum 3 years premium payment. Guaranteed surrender value = 30% of total premium paid minus first year premium.', category: 'life' },
  { term: 'Survival Benefit', definition: 'Endowment/money-back plans mein policy period ke dauran periodic payment — har 5 saal mein kuch percent sum insured ka. Yeh maturity benefit se alag hai.', category: 'life' },
  { term: 'TP (Third Party)', definition: 'Motor insurance mein dusre ko hua nuksan cover — bodily injury/death aur property damage. Yeh legally mandatory hai India mein. Premium IRDAI fix karta hai engine capacity ke basis pe.', category: 'motor' },
  { term: 'ULIP', definition: 'Unit Linked Insurance Plan — insurance + investment dono. Premium ka ek part life cover ke liye, doosra market mein invest. 5-year lock-in, market risk hai, charges bhi zyada hain.', category: 'life' },
  { term: 'Paid-up Value', definition: 'Agar premium payments band ho gaye toh policy paid-up ho jati hai — reduced sum insured milti hai. Minimum 3 years premium pay karne ke baad hi paid-up hota hai.', category: 'life' },
];

// ── Helper Functions ───────────────────────────────────────────────────────

export function getArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return knowledgeArticles.find(a => a.slug === slug);
}

export function getRelatedArticles(slugs: string[]): KnowledgeArticle[] {
  return knowledgeArticles.filter(a => slugs.includes(a.slug));
}

export function getCategoryStyle(category: ArticleCategory): string {
  switch (category) {
    case 'health':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'life':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'motor':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700';
  }
}

export function getCategoryGradient(category: ArticleCategory): string {
  switch (category) {
    case 'health':
      return 'from-rose-500 to-pink-600';
    case 'life':
      return 'from-blue-500 to-indigo-600';
    case 'motor':
      return 'from-amber-500 to-orange-600';
    default:
      return 'from-violet-500 to-purple-600';
  }
}

export function getCategoryIcon(category: ArticleCategory): string {
  switch (category) {
    case 'health': return '❤️';
    case 'life': return '🛡️';
    case 'motor': return '🚗';
    default: return '📋';
  }
}
