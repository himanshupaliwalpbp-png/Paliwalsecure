/**
 * SEO FAQ Data — Paliwal Secure
 *
 * Comprehensive FAQ data for:
 * - FAQPage JSON-LD schema (Google Rich Results)
 * - Visible FAQ accordion section on homepage
 * - Voice search optimization ("People Also Ask" targeting)
 *
 * Categories:
 * 1. Health Insurance (10 questions)
 * 2. Term / Life Insurance (10 questions)
 * 3. Motor Insurance (5 questions)
 * 4. Claims Process (5 questions)
 * 5. Tax Benefits (5+ questions)
 *
 * All answers are factually accurate about Indian insurance as of 2025.
 * Hinglish/English mix matches the site's communication style.
 */

export interface SEOFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'health' | 'term-life' | 'motor' | 'claims' | 'tax';
  categoryLabel: string;
}

export const seoFAQs: SEOFAQItem[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // HEALTH INSURANCE FAQ (10 questions)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'health-waiting-period',
    question: 'Health insurance mein waiting period kya hoti hai aur kitni hoti hai?',
    answer: 'Waiting period woh time hota hai jab aap policy lete hain lekin kuch specific illnesses ka claim nahi kar sakte. India mein generally 4 tarah ki waiting periods hoti hain: (1) Initial waiting period — 30 days (accidents ko chhod ke), (2) Pre-existing diseases (PED) waiting period — 2 se 4 saal, (3) Specific disease waiting period — 1 se 2 saal (cataract, hernia, piles, etc.), (4) Maternity waiting period — 9 months se 2 saal. Kuch insurers jaise Star Health aur Care Health PED waiting period 2 saal tak reduce karte hain. Paliwal Secure aapko aisi policy dhundhne mein madad karta hai jahan waiting period sabse kam ho.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-cashless',
    question: 'Cashless health insurance claim kaise kaam karti hai?',
    answer: 'Cashless claim mein aapko hospital bill khud nahi dena padta — hospital directly insurer ke saath settle karta hai. Process: (1) Network hospital mein admit hone ke baat 24 ghante ke andar insurer ko inform karein, (2) Hospital TPA (Third Party Administrator) ko pre-authorization form bhejta hai, (3) Insurer 2-4 ghante mein approval/rejection deta hai, (4) Treatment ke baad final bill insurer directly hospital ko pay karta hai. Important: Cashless claim ke liye aapko insurer ke network hospital mein jaana padega. Paliwal Secure aapko aise insurers dhundhne mein help karta hai jinke maximum network hospitals hain aapke shehar mein.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-ped',
    question: 'Pre-existing disease (PED) wale log health insurance le sakte hain kya?',
    answer: 'Haan, PED wale log bilkul insurance le sakte hain — yeh unka legal right hai. IRDAI ke according: (1) Insurance company PED wale applicants ko reject nahi kar sakti, (2) PED-related claims ke liye 2-4 saal ka waiting period serve karna padta hai, (3) 8 saal continuous renewal ke baad PED automatically cover ho jata hai (IRDAI 2019 guidelines), (4) Kuch insurers PED cover bhi dete hain with loading (10-30% extra premium). Conditions jaise Diabetes, Hypertension, Heart Disease sab cover hoti hain waiting period ke baad. Paliwal Secure aapko aise plans dhundhne mein help karta hai jahan PED cover jaldi mil sake.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-floater',
    question: 'Family floater aur individual health insurance mein kya fark hai?',
    answer: 'Family floater mein ek hi sum insured poore family share karta hai (self, spouse, children) — premium kam hota hai lekin agar ek member ka bahut expense ho jaye toh baaki ke liye cover kam reh jata hai. Individual plan mein har member ka alag sum insured hota hai — premium zyada hota hai lekin har member ko poori cover guarantee hai. Recommendation: (1) Young families (30-45 saal) ke liye floater plan best hai, (2) Senior citizens ke liye individual plan better hai, (3) Agar kisi member ko ongoing treatment chal raha hai toh uske liye alag individual plan lo. Paliwal Secure aapki family size aur needs ke hisaab se best option suggest karta hai.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-room-rent',
    question: 'Room rent capping health insurance mein kya hoti hai aur kyun important hai?',
    answer: 'Room rent capping matlab insurer sirf ek limit tak ka room rent pay karega — jaise "1% of sum insured per day" ya "AC room tak". Agar aap expensive room choose karte hain toh baaki ka khud dena padta hai, aur yeh proportionally DOCTORS FEES aur surgery charges bhi badha deta hai. Example: Agar ₹5 lakh ki policy hai aur room rent cap 1% hai (₹5,000/day), aur aap ₹10,000/day ka room lete hain toh sirf room nahi — doctor fees bhi 50% aapko dena padega. Tip: Hamesha "No Room Rent Capping" wali policy choose karein — yeh long mein bahut useful hoti hai.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-portability',
    question: 'Health insurance portability kya hai aur kaise kaam karti hai?',
    answer: 'Portability ka matlab hai aap apni existing health insurance ko dusre insurer ke paas shift kar sakte hain — bina waiting period ka nuksan. IRDAI ke rules ke according: (1) Portability request renewal se 45 din pehle karna hota hai, (2) New insurer aapki claim history aur medical records review karega, (3) Agar approve hota hai toh purani policy ka credit (waiting period served) new policy mein transfer ho jayega, (4) Sum insured badhana bhi possible hai portability ke saath. Portability ka fayda: Better plan, better CSR, better network hospitals — bina shuru se waiting period serve kiye.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-maternity',
    question: 'Maternity insurance India mein kaunsi cheezein cover karta hai?',
    answer: 'Maternity cover health insurance mein generally include karta hai: (1) Normal delivery expenses, (2) C-section delivery, (3) Pre aur postnatal care (30-60 days), (4) Newborn baby cover from day 1 (30-90 days), (5) Complications during pregnancy. Important points: (1) Waiting period 9 months se 2 saal hoti hai, (2) C-section ka cover generally zyada hota hai, (3) Sub-limits lag sakti hain (jaise ₹30,000-50,000 for normal delivery), (4) Kuch plans IVF treatment bhi cover karte hain. Tip: Agar aap planning kar rahe hain toh minimum 1 saal pehle maternity wali policy lein taaki waiting period complete ho jaye.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-topup',
    question: 'Top-up aur super top-up health insurance kya hai aur kyun lena chahiye?',
    answer: 'Top-up plan aapki existing policy ke upar extra cover deta hai — lekin sirf jab expenses ek threshold (deductible) se upar jayen. Example: Agar aapke paas ₹5 lakh ki base policy hai aur ₹15 lakh ki top-up hai with ₹5 lakh deductible, toh pehle ₹5 lakh base policy se, aur agar total bill ₹20 lakh hai toh baaki ₹15 lakh top-up se. Super top-up isse better hai — yeh cumulative deductible calculate karta hai saal bhar ke total expenses ka, har claim ka nahi. Benefits: (1) Bahut sasta premium (₹2,000-5,000/year for ₹15 lakh cover), (2) Medical inflation se protection, (3) Critical illness ke liye backup.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-mental',
    question: 'Kya health insurance mental illness cover karta hai India mein?',
    answer: 'Haan! IRDAI ke 2018 ke guidelines ke according, sabhi health insurance plans ko mental illness cover karna mandatory hai. Yeh cover karta hai: (1) Depression aur anxiety disorders, (2) Therapy/counseling sessions, (3) Psychiatric consultation, (4) Hospitalization for mental health conditions, (5) OCD, PTSD, bipolar disorder. Important points: (1) Waiting period apply hota hai (30 days initial, 2 years PED), (2) OPD therapy sessions ki limit ho sakti hai, (3) Substance abuse related treatment generally excluded hai. Paliwal Secure aapko best mental health coverage wali plans dhundhne mein help karta hai.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'health-senior',
    question: 'Senior citizens (60+) ke liye best health insurance kaise choose karein?',
    answer: 'Senior citizens ke liye health insurance choose karte waqt ye factors dekhein: (1) Entry age — Kuch plans 65+ mein entry allow karte hain (Star Health Red Care, Niva Bupa Health Companion), (2) PED coverage — Kam waiting period wale plans, (3) Day care procedures cover — Cataract, angioplasty etc. (4) Co-payment — Senior plans mein 10-20% co-pay hota hai, kam wale better, (5) Room rent — No capping wale plans choose karein, (6) Sum insured — Minimum ₹5-10 lakh recommended. Section 80D ke under senior citizens ₹50,000 tak deduction le sakte hain. Paliwal Secure special senior citizen plans compare karta hai.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TERM / LIFE INSURANCE FAQ (10 questions)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'term-vs-whole',
    question: 'Term insurance aur whole life insurance mein kya fark hai?',
    answer: 'Term insurance ek specific period (10-40 saal) ke liye hota hai — agar policyholder is period mein expire ho jata hai toh sum insured milta hai, warna kuch nahi. Yeh sabse sasta life insurance hai (₹489/month se shuru). Whole life insurance zindagi bhar ka cover deta hai (100 years tak) lekin premium 5-10 guna zyada hota hai. Key differences: (1) Term: Pure protection, no maturity benefit, very affordable. (2) Whole life: Lifelong cover + savings component, expensive. Paliwal Secure recommend karta hai ki 95% families ke liye term insurance best option hai — zyada cover, kam premium. Baaki paisa FD ya mutual fund mein invest karein.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-how-much',
    question: 'Kitne ka term insurance lena chahiye? (Sum assured kaise calculate karein?)',
    answer: 'Sum assured calculate karne ka simple formula: 10-15 times your annual income. Example: Agar aapki salary ₹8 lakh/year hai toh minimum ₹80 lakh - ₹1.2 crore ka term plan lein. Consider karein: (1) Outstanding loans (Home loan, car loan), (2) Children ki education cost (₹20-50 lakh), (3) Daily household expenses (5-10 saal ke liye), (4) Inflation — aaj ke ₹1 crore ki value 20 saal mein ₹25-30 lakh hogi. Tip: Better hai zyada cover lo — ₹1 crore ka term plan sirf ₹500-800/month mein milta hai 25 saal ke liye. Paliwal Secure aapke liye best coverage amount calculate karke deta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-riders',
    question: 'Term insurance ke important riders kaunse hain aur kyun chahiye?',
    answer: 'Riders term insurance mein extra benefits hain jo additional premium par milte hain. Important riders: (1) Critical Illness Rider — 40+ illnesses (cancer, heart attack, stroke) diagnosis par lump sum payment, (2) Accidental Death Benefit — Accident se death par additional sum insured, (3) Waiver of Premium — Disability ya critical illness ke baad premium maaf, policy chalti rehti hai, (4) Income Benefit — Death ke baad family ko monthly income (sum insured ka 0.5-1%), (5) Terminal Illness Benefit — Diagnosis par advance payout. Recommendation: Critical Illness + Waiver of Premium sabse useful riders hain. Cost: Sirf ₹100-300/month extra.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-csr',
    question: 'Claim Settlement Ratio (CSR) kya hai aur term insurance choose karte waqt kyun important hai?',
    answer: 'CSR batata hai ki kitne percent claims insurer ne settle kiye. Example: Agar CSR 98% hai matlab 100 mein se 98 claims approve hui. IRDAI yearly CSR data publish karta hai. CSR importance: (1) Higher CSR = zyada trust worthy insurer, (2) CSR 95%+ hona chahiye minimum, (3) Sirf CSR nahi — claim amount ratio bhi dekhein, (4) Consistency important hai — 3-5 saal ka average dekhein. Top insurers by CSR: LIC (98.5%), HDFC Life (98.1%), Tata AIA (98.0%), SBI Life (97.8%). Paliwal Secure aapko latest CSR data ke saath insurers compare karne mein help karta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-vs-ulip',
    question: 'Term insurance aur ULIP mein kya fark hai? Kya ULIP better hai?',
    answer: 'Term insurance = Pure protection, kam premium, no returns. ULIP = Insurance + Investment, high premium, market-linked returns. Key differences: (1) Premium: Term ₹500/mo vs ULIP ₹3,000-5,000/mo for same cover, (2) Returns: ULIP mein market risk hai — returns guaranteed nahi, (3) Charges: ULIP mein fund management charges (1-2%), premium allocation charges, admin charges — yeh returns kha jaate hain, (4) Flexibility: Term mein aap separately better mutual funds mein invest kar sakte hain. Recommendation: Insurance aur investment alag rakhein — Term insurance + Mutual Fund SIP ULIP se better combination hai. Paliwal Secure is approach ko recommend karta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-claim-reject',
    question: 'Term insurance claim reject kyun hoti hai aur kaise bachenge?',
    answer: 'Common reasons for claim rejection: (1) Non-disclosure of medical history — sabse common reason, (2) Wrong information in proposal form (age, income, habits), (3) Policy lapse — premium time par nahi di, (4) Death within first 2 years (investigation hota hai), (5) Excluded causes (suicide within first year, adventure sports, etc.). Bachne ke upay: (1) SAARI medical conditions disclose karein — chhoti bhi ho, (2) Annual income aur lifestyle correct bataiye, (3) Premium time par pay karein (auto-debit setup karein), (4) Medical test honestly dein, (5) Policy documents carefully padhein. Paliwal Secure application process mein poori guidance deta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-freelook',
    question: 'Free look period kya hoti hai life/term insurance mein?',
    answer: 'Free look period woh 15-30 din ka time hota hai jab aap nayi policy lete hain aur usse bina penalty cancel kar sakte hain. IRDAI rules: (1) 15 days for regular policies, 30 days for policies bought online/through distance mode, (2) Is period mein policy document carefully padhein, (3) Agar terms pasand nahi aaye toh cancellation request karein, (4) Refund: Premium minus proportionate risk cover charges minus medical test expenses, (5) NO impact on future insurance buying. Tip: Hamesha policy document free look period mein padhein — Kuch hidden conditions ya exclusions ho sakti hain.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-nominee',
    question: 'Term insurance mein nominee kaise choose karein aur kya rules hain?',
    answer: 'Nominee woh person hai jo aapke death ke baad claim amount receive karega. Rules: (1) Koi bhi family member nominee ho sakta hai, (2) Multiple nominees rakh sakte hain with percentage allocation, (3) Minor nominee ke liye appointee (guardian) name karna padega, (4) Nominee change kar sakte hain policy duration mein — insurer ko inform karna padega, (5) Beneficial nominee (spouse, children, parents) ko legal preference milti hai. Tips: (1) Hamesha 2+ nominees rakhein, (2) Percentage clearly define karein, (3) Annual review karein — life events (marriage, child birth) ke baad update karein. Paliwal Secure nominee planning mein help karta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-women',
    question: 'Kya women ko term insurance mein koi discount ya special benefits milte hain?',
    answer: 'Haan! Insurance companies women ko generally lower premium offer karte hain kyunki statistically women live longer aur healthier lifestyle rakhte hain. Benefits: (1) Premium 10-15% lower than men for same cover, (2) Some insurers have women-specific critical illness riders (breast cancer, cervical cancer cover), (3) Maternity benefit riders available, (4) Working women ko home loan ke saath term plan mandatory hai. Example: 30-year-old male ke liye ₹1 crore term plan = ₹700/month, same age female ke liye = ₹600/month. Paliwal Secure women-specific plans aur discounts ke baare mein detailed comparison provide karta hai.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'term-online-offline',
    question: 'Online term insurance aur offline (agent se) mein kya fark hai?',
    answer: 'Online term plans 30-50% saste hote hain kyunki: (1) Agent commission nahi hota (15-30% of premium), (2) Admin costs kam, (3) Direct insurer se buy hota hai. Offline plans ke benefits: (1) Personal guidance milta hai, (2) Complex cases mein help, (3) Document collection agent karta hai. Reality: Claim settlement ratio online aur offline mein same hai — IRDAI ka rule hai ki policy type ke basis par claim reject nahi kar sakte. Best approach: Online buy karein (save money) lekin Paliwal Secure jaisa IRDAI-certified advisor se compare aur consult karein — free of cost! Aapko best plan mil jayega aur premium bhi kam lagega.',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MOTOR INSURANCE FAQ (5 questions)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'motor-comprehensive-tp',
    question: 'Comprehensive aur third-party motor insurance mein kya antar hai?',
    answer: 'Third-party (TP) insurance legally mandatory hai aur sirf dusre party ko hua nuksan cover karta hai — aapki gaadi ka nuksan nahi. Comprehensive insurance aapki gaadi ka nuksan bhi cover karta hai plus third-party cover. Key differences: (1) TP: Only other party damage, cheap, legally required, (2) Comprehensive: Your car + other party + theft + natural calamity + fire, higher premium. TP premium IRDAI fix karta hai (engine capacity based). Comprehensive premium IDV (Insured Declared Value) par based hota hai. Paliwal Secure recommend karta hai comprehensive policy le kyunki isme Zero Dep, Engine Cover, RSA jaise add-ons bhi mil sakte hain jo TP mein nahi milte.',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },
  {
    id: 'motor-ncb',
    question: 'No Claim Bonus (NCB) kya hai aur kaise save karein?',
    answer: 'NCB ek discount hai jo aapko claim-free year ke baad milta hai — yeh premium ka 20% se 50% tak ho sakta hai. NCB slabs: (1) 1st claim-free year: 20%, (2) 2nd year: 25%, (3) 3rd year: 35%, (4) 4th year: 45%, (5) 5th+ year: 50%. Important rules: (1) NCB gaadi se nahi, owner se linked hota hai — gaadi bechne par NCB transfer hota hai, (2) Small claims (₹5,000-10,000) ke liye NCB lose karna padta hai — better khud pay karo, (3) NCB Protector add-on lein — 2 claims tak NCB safe rahega, (4) NCB certificate 90 days ke andar transfer karein. 50% NCB = bahut bada saving!',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },
  {
    id: 'motor-zerodep',
    question: 'Zero Depreciation (Zero Dep) add-on kya hai aur kyun zaroori hai?',
    answer: 'Normal comprehensive insurance mein claim karte waqt depreciation deduct hoti hai — plastic parts 50%, metal 5-10%, rubber 30-40%. Zero Dep add-on se yeh depreciation WAIVE ho jata hai — insurer full cost pay karta hai. Example: ₹30,000 ka plastic part replacement — Normal policy: ₹15,000 milega, Zero Dep: ₹30,000 milega. Benefits: (1) Full claim amount, (2) Best for new cars (0-5 years), (3) Generally 2 claims per year allowed. Cost: Sirf 10-20% extra premium. Strong recommendation: New car ke liye Zero Dep ZAROOR lein — yeh premium se zyada save karega. Paliwal Secure best Zero Dep plans compare karta hai.',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },
  {
    id: 'motor-idv',
    question: 'IDV (Insured Declared Value) kya hai aur kaise set karein?',
    answer: 'IDV aapki gaadi ki current market value hai — yeh maximum amount hai jo insurer theft ya total loss ke case mein pay karega. IDV calculation: Ex-showroom price minus depreciation (age-based). Depreciation slabs: (1) 0-6 months: 5%, (2) 6 months-1 year: 15%, (3) 1-2 years: 20%, (4) 2-3 years: 30%, (5) 3-4 years: 40%, (6) 4-5 years: 50%. Tips: (1) Higher IDV = Higher premium but better claim, (2) Lower IDV = Lower premium but insufficient cover, (3) 5+ saal ki gaadi ke liye IDV negotiate kar sakte hain insurer ke saath, (4) IDV adjustment range generally ±5% hoti hai. Never underinsure your vehicle!',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },
  {
    id: 'motor-renewal',
    question: 'Motor insurance renewal ke time kya check karna chahiye?',
    answer: 'Renewal ke time ye 7 points zaroor check karein: (1) IDV sahi hai ya nahi — insurer IDV automatically kam kar dete hain, verify karein, (2) NCB correct hai — previous insurer se NCB certificate match karein, (3) Add-ons review — Zero Dep, Engine Cover, RSA still needed?, (4) Compare karein — renewal offer vs market rate (Paliwal Secure se compare karein), (5) Deductibles check — Compulsory aur voluntary deductible amounts, (6) Network garages — Aapke area mein cashless garages available hain?, (7) New rules — IRDAI 2025 rules ke according long-term motor policies bhi available hain (3-year TP, 1-year OD). Tip: 30 din pehle renewal start karein — better negotiation aur no break in coverage.',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CLAIMS PROCESS FAQ (5 questions)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'claim-file',
    question: 'Insurance claim kaise file karein — step by step process?',
    answer: 'Insurance claim file karne ki step-by-step process: Step 1 — Intimate insurer within 24-48 hours (call helpline or app), Step 2 — Choose claim type (cashless ya reimbursement), Step 3 — Cashless: Hospital sends pre-auth to insurer, approval in 2-4 hours, Step 4 — Collect documents (policy copy, ID proof, hospital bills, discharge summary, doctor reports, prescription bills), Step 5 — Submit claim form with documents (online ya offline), Step 6 — Track claim status online, IRDAI mandates settlement within 30 days. Motor claims ke liye: FIR copy (accident), repair estimate, photos. Paliwal Secure aapko poori claim process mein guide karta hai — call 9257877312 for free claim assistance.',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },
  {
    id: 'claim-rejected',
    question: 'Insurance claim reject ho gaya toh kya karein?',
    answer: 'Agar claim reject ho jaye, ye steps follow karein: (1) Insurer se written rejection reason maangein — yeh aapka right hai, (2) Review karein — kya genuine reason hai ya unfair rejection?, (3) Grievance redressal: Insurer ki internal grievance cell mein complaint karein, (4) Escalation: Agar 15 days mein resolve nahi hota toh IRDAI Bima Bharosa portal (https://bimabharosa.irdai.gov.in) pe complain karein, (5) Insurance Ombudsman — Free service hai, 2 saal tak ki complaints sunta hai, (6) Consumer Forum — Last resort, legal action. Prevention tips: (1) All medical conditions disclose karein, (2) Documents complete rakhein, (3) Time par intimation karein. Paliwal Secure claim rejection cases mein free guidance deta hai.',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },
  {
    id: 'claim-reimbursement',
    question: 'Reimbursement claim kaise kaam karti hai aur kya documents chahiye?',
    answer: 'Reimbursement claim mein aap pehle hospital bill khud pay karte hain, baad mein insurer se claim karte hain. Process: (1) Any hospital mein treatment le sakte hain (network ya non-network), (2) 24-48 hours mein insurer ko inform karein, (3) Treatment ke baad sab documents collect karein, (4) Claim form submit karein 15-30 days ke andar. Required documents: (1) Duly filled claim form, (2) Original hospital bills with payment receipts, (3) Discharge summary, (4) Doctor consultation papers, (5) Investigation reports (blood, X-ray, MRI), (6) Pharmacy bills with prescriptions, (7) ID proof and policy copy, (8) NEFT details for payment. Settlement time: 15-30 days. Tip: Har bill aur report ka photocopy rakhein!',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },
  {
    id: 'claim-time',
    question: 'Insurance claim file karne ka time limit kya hai?',
    answer: 'IRDAI ke according time limits: (1) Health insurance: Intimation within 24-48 hours of hospitalization, final claim submission within 15-30 days of discharge, (2) Motor insurance: Accident claim within 48-72 hours, theft claim immediately with FIR, (3) Term insurance: Death claim within 90 days of death, (4) Travel insurance: Claim within 30 days of return. Important: Late intimation se claim reject ho sakta hai, lekin IRDAI ke according reasonable delay (genuine reason) ke liye claim reject nahi kar sakte. Emergency mein pehle treatment, baad mein intimation — yeh bhi allowed hai. Paliwal Secure ki 24/7 helpline aapko claim intimation mein help karti hai.',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },
  {
    id: 'claim-multiple',
    question: 'Kya main ek saath do insurance policies se claim kar sakta hoon?',
    answer: 'Haan, aap multiple policies se claim kar sakte hain lekin rules alag hain: (1) Health insurance — Contribution principle: Dono insurers proportionately share the claim. Aap ek insurer se pura claim nahi kar sakte, dono se proportional claim hoga, (2) Term insurance — Benefit principle: Har policy se FULL sum insured milta hai! Multiple term plans = multiple payouts, (3) Motor insurance — Sirf ek policy se claim, doosra nahi hoga. Tips: (1) Health: Multiple policies ke fayde — wider coverage, less out-of-pocket, (2) Term: Multiple policies useful — different milestones ke liye different covers, (3) Hamesha sab policies declare karein claim ke time.',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TAX BENEFITS FAQ (5+ questions)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'tax-80d',
    question: 'Section 80D ke under health insurance se kitna tax bach sakta hai?',
    answer: 'Section 80D ke under health insurance premium par deduction limits: (1) Self, spouse, children: ₹25,000 (under 60 years), ₹50,000 (senior citizens 60+), (2) Parents: Additional ₹25,000 (parents under 60), ₹50,000 (parents 60+), (3) Maximum total deduction: ₹1,00,000 per year. Example: Aap (30) + spouse (28) + parents (65): ₹25,000 + ₹50,000 = ₹75,000 deduction. (4) Preventive health check-up: ₹5,000 within overall limit. Tax saving calculation: ₹75,000 deduction × 30% tax bracket = ₹22,500 actual tax saved! Additional benefits: (5) Super top-up premium bhi 80D mein eligible, (6) Critical illness rider premium bhi deductible.',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
  {
    id: 'tax-80c',
    question: 'Section 80C ke under life/term insurance se kya tax benefits milte hain?',
    answer: 'Section 80C ke under life insurance premium par deduction: (1) Maximum deduction: ₹1.5 lakh per year (includes ALL 80C investments — PPF, ELSS, life insurance, etc.), (2) Term insurance premium fully deductible within limit, (3) ULIP premium bhi 80C mein aata hai, (4) Condition: Premium should not exceed 10% of sum assured (policies issued after 1 April 2012), (5) If premium exceeds 10% of sum assured — deduction limited proportionately. Tax saving example: ₹30,000 term premium × 30% bracket = ₹9,000 tax saved. Maturity/Death benefit: Section 10(10D) ke under death benefit fully tax-free hai. Note: 80C limit shared hai — plan karein ki kitna insurance ke liye use karein.',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
  {
    id: 'tax-new-old',
    question: 'New tax regime mein insurance ka kya fayda hai?',
    answer: 'New tax regime (FY 2025-26) mein: (1) Section 80C deductions NOT available — life insurance premium ka direct tax fayda nahi, (2) Section 80D deductions NOT available — health insurance premium ka bhi direct deduction nahi, (3) Standard deduction ₹75,000 milta hai (sab ko). Par INSURANCE ABHI BHI ZAROORI HAI: (1) Tax saving insurance ka ek fayda hai, protection main purpose hai, (2) New regime mein bhi employer-provided health insurance premium tax-free hai (Section 17), (3) Term insurance death benefit Section 10(10D) ke under dono regimes mein tax-free hai. Recommendation: Tax regime se independent rah ke insurance lei — medical emergency ka risk toh tax regime se nahi kam hota!',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
  {
    id: 'tax-hra',
    question: 'Kya health insurance premium HRA ke saath claim ho sakta hai?',
    answer: 'Nahi, HRA (House Rent Allowance) aur health insurance alag sections hain: (1) HRA: Section 10(13A) — rent payment ke liye exemption, (2) Health insurance: Section 80D — premium ke liye deduction. Dono independently claim ho sakte hain — ek dusre se connected nahi. However: (1) Medical allowance (if provided by employer): ₹15,000/year tax-free with medical bills, (2) Employer-provided health insurance: Premium tax-free as perquisite, (3) Medical reimbursement: Up to ₹15,000 from employer is tax-free with bills. Strategy: Employer-provided group health + individual health plan for family = Best combination with maximum tax benefit.',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
  {
    id: 'tax-senior',
    question: 'Senior citizens ke liye insurance se kya special tax benefits hain?',
    answer: 'Senior citizens (60+) ke liye special tax benefits: Section 80D: (1) Apne health insurance premium: ₹50,000 deduction (vs ₹25,000 for others), (2) Parents ke premium (if they are 60+): Additional ₹50,000, (3) Medical expenditure (without insurance): ₹50,000 deduction for very senior citizens (80+), (4) Preventive health check-up: ₹5,000 within limits. Section 80DDB: (1) Specified disease treatment (cancer, AIDS, neurological): ₹40,000 (under 60), ₹60,000 (60-79), ₹80,000 (80+). Section 80C: (1) Life insurance premium deduction same as others within ₹1.5 lakh, (2) Senior Citizens Savings Scheme: ₹1.5 lakh extra under 80C. Total potential saving: Senior citizen couple can save up to ₹50,000-75,000 in taxes through insurance!',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
  {
    id: 'tax-employergroup',
    question: 'Employer ka group health insurance kaunse tax benefits deta hai?',
    answer: 'Employer-provided group health insurance ke tax benefits: (1) Employer side: Premium paid by employer is a business expense — fully tax-deductible for company, (2) Employee side: Premium paid by employer is NOT taxable as perquisite — no income tax on this benefit, (3) Employee contribution: If you contribute to group premium, that contribution qualifies for Section 80D deduction, (4) No waiting period: Group policies generally have no waiting period — immediate coverage. Limitations: (1) Coverage ends when you leave the job, (2) Sum insured usually limited (₹3-5 lakh), (3) Not customizable. Recommendation: Group health + Individual health plan for family = Best strategy. Paliwal Secure aapke group cover ke gaps identify karke individual plan suggest karta hai.',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // VOICE SEARCH OPTIMIZED FAQ (6 questions)
  // These are designed for natural language queries spoken to voice
  // assistants like Google Assistant, Siri, and Alexa.
  // Target: "Ok Google, best insurance agent near me" type queries
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'voice-best-advisor',
    question: 'Best insurance advisor near me kaun hai?',
    answer: 'Paliwal Secure India ka sabse trusted AI-powered insurance advisor hai, led by Himanshu Paliwal — IRDAI certified insurance advisor. Hum 51+ IRDAI-registered insurers se compare karte hain aur aapke liye best plan recommend karte hain. Hum Kota, Rajasthan mein based hain lekin poore India mein online advisory provide karte hain. 500+ families humpe trust karti hain. Free consultation ke liye call karein 9257877312 ya WhatsApp karein. InsureGPT AI se aap 24/7 insurance questions pooch sakte hain.',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'voice-health-insurance-kya',
    question: 'Health insurance kya hota hai aur kyun lena chahiye?',
    answer: 'Health insurance ek aisa agreement hai jisme aap premium pay karte hain aur insurance company aapke hospitalization aur medical expenses cover karta hai. India mein health insurance lena zaroori hai kyunki: (1) Medical inflation 14% annually badh rahi hai, (2) ICU charges ₹25,000-1,00,000/day tak jaati hain, (3) Emergency mein aapko paise jama nahi karne padte, (4) Section 80D ke under ₹75,000 tak tax bhi bacha sakte hain. Paliwal Secure aapke budget aur needs ke hisaab se best health insurance plan dhundhta hai — bilkul free consultation!',
    category: 'health',
    categoryLabel: 'Health Insurance',
  },
  {
    id: 'voice-term-insurance-kitna',
    question: 'Term insurance kitna lena chahiye aur kaunsa best hai?',
    answer: 'Term insurance ka sum insured aapki annual income ka 10-15 guna hona chahiye. Example: ₹8 lakh salary = ₹80 lakh - ₹1.2 crore cover. Best term plan choose karne ke liye: (1) Claim Settlement Ratio 95%+ hona chahiye — LIC (98.5%), HDFC Life (98.1%), Tata AIA (98.0%), (2) Premium affordable hona — ₹1 crore cover sirf ₹500-800/month mein milta hai, (3) Riders add karein — Critical Illness + Waiver of Premium sabse useful hain. Paliwal Secure aapke liye best term plan calculate karke deta hai — call 9257877312 for free advice!',
    category: 'term-life',
    categoryLabel: 'Term / Life Insurance',
  },
  {
    id: 'voice-car-insurance-renew',
    question: 'Car insurance renewal kaise karein online?',
    answer: 'Car insurance renewal online karna bahut aasan hai: (1) Apni existing policy details taiyar rakhein — policy number, car registration number, (2) Paliwal Secure se compare karein — 51+ insurers ke quotes ek saath, (3) IDV verify karein — insurer automatically IDV kam karte hain, check karein sahi hai ya nahi, (4) NCB certificate lagao — previous insurer se, (5) Add-ons decide karein — Zero Dep, Engine Cover, RSA, (6) Payment karein — instant policy PDF mil jayega. Tip: 30 din pehle renewal start karein for better rates. Paliwal Secure free mein compare karke best renewal offer deta hai!',
    category: 'motor',
    categoryLabel: 'Motor Insurance',
  },
  {
    id: 'voice-claim-kaise-file',
    question: 'Insurance claim kaise file karein agar reject ho gaya ho?',
    answer: 'Agar insurance claim reject ho jaye toh: (1) Insurer se written rejection reason maangein — yeh aapka legal right hai, (2) Review karein — kya genuine reason hai ya unfair rejection?, (3) Grievance redressal: Insurer ki internal cell mein complaint karein, (4) Escalation: IRDAI Bima Bharosa portal (bimabharosa.irdai.gov.in) pe complain karein, (5) Insurance Ombudsman — Free service, 2 saal tak ki complaints sunta hai, (6) Consumer Forum — Last resort. Prevention: Saari medical conditions disclose karein, documents complete rakhein. Paliwal Secure claim rejection cases mein FREE guidance deta hai — call 9257877312!',
    category: 'claims',
    categoryLabel: 'Claims Process',
  },
  {
    id: 'voice-tax-bachao',
    question: 'Insurance se tax kaise bachaya ja sakta hai?',
    answer: 'Insurance se tax bachane ke 2 main ways: (1) Section 80D — Health insurance premium par: Self/family ke liye ₹25,000 (under 60) ya ₹50,000 (60+), Parents ke liye additional ₹25,000/₹50,000. Maximum ₹1,00,000/year deduction! Example: Aap (30) + parents (65) = ₹75,000 deduction × 30% tax = ₹22,500 saved!, (2) Section 80C — Term/life insurance premium par ₹1.5 lakh tak deduction (PPF, ELSS etc. ke saath shared). Death benefit Section 10(10D) ke under fully tax-free hai. Paliwal Secure aapko maximum tax saving wali insurance strategy banata hai — free consultation!',
    category: 'tax',
    categoryLabel: 'Tax Benefits',
  },
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: SEOFAQItem['category']): SEOFAQItem[] {
  return seoFAQs.filter((faq) => faq.category === category);
}

/**
 * Get all unique categories
 */
export function getFAQCategories(): { value: SEOFAQItem['category']; label: string }[] {
  return [
    { value: 'health', label: 'Health Insurance' },
    { value: 'term-life', label: 'Term / Life Insurance' },
    { value: 'motor', label: 'Motor Insurance' },
    { value: 'claims', label: 'Claims Process' },
    { value: 'tax', label: 'Tax Benefits' },
  ];
}

/**
 * Generate FAQ schema data for JSON-LD
 */
export function generateFAQSchemaData(): { question: string; answer: string }[] {
  return seoFAQs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));
}
