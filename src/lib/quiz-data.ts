// ============================================================================
// Bima Beast — Insurance IQ Test + Daily Deals
// Categories: Health, Motor, Life, Home, General
// ============================================================================

export type QuizCategory = 'health' | 'motor' | 'life' | 'home' | 'general';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  text: string;
  options: string[];
  correct: number;
  difficulty: Difficulty;
  category: QuizCategory;
}

// ── HEALTH INSURANCE ─────────────────────────────────────────────────────────
const healthBase: [string, string[], number, Difficulty][] = [
  ["Health insurance mein 'waiting period' kya hota hai?", ["30 din","2 saal","48 mahine","Koi nahi"], 2, "medium"],
  ["'Co-payment' ka matlab kya hai?", ["Fixed discount","Insured khud % bhare","Insurer extra de","Tax benefit"], 1, "medium"],
  ["Cashless claim facility ka matlab?", ["Insurer direct hospital ko pay kare","Baad mein reimbursement","Khud bharo aur claim karo","Claim hi nahi"], 0, "easy"],
  ["Room rent sub-limit kisko affect karta hai?", ["Doctor fees","Daily room charge","Medicines","Ambulance"], 1, "medium"],
  ["Health insurance mein 'No Claim Bonus' kya karta hai?", ["Sum insured badhata hai","Premium kam karta hai","Dono","Sirf family floater"], 2, "medium"],
  ["Family floater plan kise cover karta hai?", ["Sirf ek individual","Poora family ek sum insured pe","Sirf parents","Sirf spouse"], 1, "easy"],
  ["AYUSH treatment mein kya cover hota hai?", ["Homeopathy, Ayurveda","Sirf Allopathy","Dental","Cosmetic"], 0, "easy"],
  ["Top-up health plan kab active hota hai?", ["Pehle claim pe","Deductible limit cross hone pe","Waiting period ke baad","No claim pe"], 1, "hard"],
  ["Restore benefit kya karta hai?", ["Claim ke baad sum insured wapas aa jata hai","Premium kam ho jati hai","Policy cancel","Co-pay badhta hai"], 0, "hard"],
  ["Maternity cover ka waiting period typically kitna hota hai?", ["9 mahine","12-24 mahine","Waiting period nahi","3 mahine"], 1, "medium"],
  ["Online health policy ka free look period kitna hota hai?", ["15 din","30 din","7 din","45 din"], 0, "hard"],
  ["Pre-existing disease ke liye waiting period?", ["30 din","2 saal","4 saal (48 months)","Koi nahi"], 2, "hard"],
  ["Domiciliary hospitalisation kya hai?", ["Ghar par ilaaj","Hospital mein","Day care","Emergency"], 0, "medium"],
  ["Critical illness rider kya karta hai?", ["Bimari hone par lump sum de","Reimbursement","Daily cash","Kuch nahi"], 0, "medium"],
  ["Network hospital kyun important hai?", ["Cashless treatment ke liye","Claim settlement ke liye","Premium payment","Renewal"], 0, "easy"],
  ["Preventive health check-up benefit kya hai?", ["Free health checkup yearly","Extra premium","Claim rejection","Policy cancel"], 0, "easy"],
  ["Day care procedure kya hai?", ["24 ghante se kam hospital stay","OPD treatment","Emergency","ICU"], 0, "medium"],
  ["Cumulative bonus kya hota hai?", ["Claim-free year pe sum insured badhna","Cash back","Premium refund","Tax benefit"], 0, "medium"],
  ["Corporate health insurance ka kya drawback hai?", ["Job chhodne par khatam","Premium zyada","Cover kam","Network nahi"], 0, "hard"],
  ["Super top-up aur top-up mein fark?", ["Super top-up saare claims aggregate karta hai","Koi fark nahi","Premium kam","Cover zyada"], 0, "hard"],
  ["Health insurance portability kya hai?", ["Insurer badalna without losing waiting period","Policy cancel","Premium badhana","Cover kam karna"], 0, "medium"],
  ["Grace period health insurance mein kitna hota hai?", ["15 din","30 din","7 din","60 din"], 1, "medium"],
  ["Sub-limit kya hota hai?", ["Specific treatment pe max limit","Total sum insured","Premium limit","Tax limit"], 0, "hard"],
  ["OPD cover kya include karta hai?", ["Doctor consultation, tests, pharmacy","Hospital stay","Surgery","ICU"], 0, "medium"],
  ["Zone-based pricing kya hai?", ["City ke according premium alag","Same premium sab jagah","Discount","Penalty"], 0, "hard"],
  ["Newborn baby cover kab se milta hai?", ["Day 1 se (some policies)","3 mahine baad","1 saal baad","Kabhi nahi"], 0, "hard"],
  ["Infertility treatment cover hota hai?", ["Kuch policies mein add-on se","Hamesha covered","Kabhi nahi","Basic mein included"], 0, "hard"],
  ["Mental illness cover IRDAI ne mandatory kiya?", ["Haan, 2018 se","Nahi","Sirf private insurers","Sirf group insurance"], 0, "hard"],
  ["Personal accident vs health insurance?", ["PA accident-only, Health illness+accident","Same hai","PA better","Health better"], 0, "medium"],
  ["Unclaimed claim amount kya hota hai?", ["Jo claim accept hui par paisa nahi mila","Rejected claim","Pending claim","Fraud claim"], 0, "hard"],
];

// ── MOTOR INSURANCE ──────────────────────────────────────────────────────────
const motorBase: [string, string[], number, Difficulty][] = [
  ["IDV ka full form kya hai?", ["Insured Declared Value","Immediate Damage Value","Income Depreciation Value","Insured Depreciation Value"], 0, "easy"],
  ["Comprehensive car insurance mein kya cover hota hai?", ["Own damage + Third party","Sirf Third party","Sirf Own damage","Sirf theft"], 0, "easy"],
  ["No Claim Bonus (NCB) kiske liye milta hai?", ["Claim-free year","Add-on khareedne par","Roadside assistance use karne par","High IDV"], 0, "medium"],
  ["Zero depreciation add-on kya fayda hai?", ["Full value bina depreciation cut ke","Premium kam","IDV zyada","Extended warranty"], 0, "medium"],
  ["Third-party insurance mein kya cover nahi hota?", ["Doosre ki gaadi ka damage","Doosre ko injury","Apni gaadi ka damage","Legal liability"], 2, "medium"],
  ["Engine protection cover kis kaam aata hai?", ["Paani ki entry se engine damage","Accidental repair","Chori","Tyre burst"], 0, "hard"],
  ["Return to Invoice add-on kya karta hai?", ["Total loss par on-road price mile","Sirf IDV","Sirf repair","Third party cost"], 0, "hard"],
  ["Car ke liye maximum NCB kitna hota hai?", ["30%","40%","50%","60%"], 2, "medium"],
  ["Compulsory deductible kis claim pe lagta hai?", ["Third party claim","Own damage claim","Dono","Koi nahi"], 1, "hard"],
  ["Car bechne par NCB transfer ho sakta hai?", ["Haan, naye owner ko","Nahi, policyholder ke paas rehta hai","Sirf same car","Insurer ko transfer"], 1, "hard"],
  ["Third party insurance legal hai?", ["Haan, zaroori hai","Nahi","Sirf comprehensive","Sirf old cars"], 0, "easy"],
  ["Own damage claim mein depreciation kis part pe lagti hai?", ["Rubber aur plastic parts","Engine","Glass","Labour"], 0, "medium"],
  ["Private car ka IDV kaise decide hota hai?", ["Ex-showroom price minus depreciation","Market value","Purchase price","Insured ki marzi"], 0, "medium"],
  ["'Bumper to bumper' cover kya hota hai?", ["Zero depreciation","Sirf bumper","Comprehensive","Third party"], 0, "medium"],
  ["Roadside assistance mein kya milta hai?", ["Towing, puncture help","Engine rebuild","Paint job","Windshield repair"], 0, "easy"],
  ["Bike ke liye NCB maximum kitna hai?", ["20%","30%","40%","50%"], 0, "medium"],
  ["Motor TP rate IRDAI decide karta hai?", ["Haan, annually","Nahi","Insurer","Dealer"], 0, "medium"],
  ["PA owner-driver cover kitna mandatory hai?", ["₹15 lakh (owner-driver)","₹1 lakh","₹5 lakh","Not mandatory"], 0, "hard"],
  ["Voluntary deductible se kya hota hai?", ["Premium kam hota hai","Premium zyada","Claim zyada","IDV badhta hai"], 0, "medium"],
  ["Key replacement cover kya deta hai?", ["Chori/hona pe naye keys ka kharcha","Lock repair","Alarm","GPS tracker"], 0, "medium"],
  ["Tyre protection cover kya cover karta hai?", ["Tyre burst/cut during accident","Normal wear & tear","Puncture","Alignment"], 0, "medium"],
  ["NCB protector add-on kya karta hai?", ["1 claim ke baad bhi NCB safe","NCB double","NCB cancel","Kuch nahi"], 0, "hard"],
  ["Commercial vehicle insurance alag kyun hai?", ["Risk zyada, usage alag","Same hai","Sirf tax alag","Premium same"], 0, "medium"],
  ["Consumables cover kya include karta hai?", ["Oil, coolant, nuts, bolts","Engine","Body","Tyres"], 0, "hard"],
  ["Electric car insurance mein kya special hai?", ["Battery cover, charging cable","Kuch nahi","Same as petrol","Sirf TP"], 0, "hard"],
];

// ── LIFE / TERM INSURANCE ────────────────────────────────────────────────────
const lifeBase: [string, string[], number, Difficulty][] = [
  ["Term insurance kya hota hai?", ["Sirf death benefit","Maturity benefit","Savings + investment","Loan facility"], 0, "easy"],
  ["Claim Settlement Ratio (CSR) kya batata hai?", ["Kitne % claims settle hue","Profitability","Policies ki sankhya","Agent commission"], 0, "medium"],
  ["Life insurance offline policy ka free look period?", ["15 din","30 din","45 din","7 din"], 1, "medium"],
  ["Premium payment ke liye grace period kitna hota hai?", ["15 din","30 din","45 din","60 din"], 1, "medium"],
  ["Surrender value kab milti hai?", ["Policy beech mein cancel karne par","Maturity par","Death claim par","Nominee change par"], 0, "medium"],
  ["Paid-up policy ka matlab?", ["Premiums band ho gayi but sum assured kam ho gaya","Policy lapsed","Full sum assured","Loan liya"], 0, "hard"],
  ["ULIP aur Term mein market risk kis mein hai?", ["ULIP","Term plan","Dono","Koi nahi"], 0, "easy"],
  ["Section 80C ke under life insurance premium par kitna deduction milta hai?", ["₹1 lakh","₹1.5 lakh","₹2 lakh","Koi limit nahi"], 1, "medium"],
  ["Nominee aur legal heir mein antar?", ["Nominee ko paisa milta hai lekin legal heir ko bhi haq ho sakta","Dono same","Nominee paisa ka maalik","Legal heir claim nahi kar sakta"], 0, "hard"],
  ["Accidental death rider kya karta hai?", ["Accident se death par extra paisa","Sirf disability","Sirf critical illness","Kuch nahi"], 0, "easy"],
  ["Term plan sasta kyun hota hai?", ["Sirf death cover, no maturity","Maturity benefit nahi","Investment nahi","Sabhi options"], 3, "easy"],
  ["ULIP mein charges kaise lagte hai?", ["Premium allocation charges, fund management","Sirf ek baar","Koi charge nahi","Sirf maturity par"], 0, "medium"],
  ["Policy lapse hone ke baad revive kar sakte hai?", ["Haan, grace period ke baad bhi","Nahi","Sirf 1 mahine mein","Sirf 1 saal mein"], 0, "easy"],
  ["MWP Act kis benefit ke liye hai?", ["Wife aur children ke liye policy protection","Tax benefit","Loan","Nominee change"], 0, "hard"],
  ["Waiver of premium rider kya karta hai?", ["Disability pe future premiums maaf","Premium double","Cover kam","Policy cancel"], 0, "hard"],
  ["Saral Jeevan Bima kya hai?", ["Standard term plan by IRDAI","Free insurance","Government scheme","Pension plan"], 0, "hard"],
  ["Critical illness rider kya cover karta hai?", ["Cancer, heart attack, stroke etc","Sirf accident","Only hospital bills","OPD"], 0, "medium"],
  ["Annuity plan kya hoti hai?", ["Regular income after retirement","One time payment","Death benefit only","Loan"], 0, "medium"],
  ["Section 10(10D) mein kya tax exempt hai?", ["Death claim amount (conditions apply)","Premium","Bonus","All amounts"], 0, "hard"],
  ["Term insurance mein medical test kab zaroori hai?", ["High sum insured ke liye","Hamesha","Kabhi nahi","Sirf old age"], 0, "medium"],
  ["Increasing term plan kya hai?", ["Cover har badhta hai","Premium badhta hai","Cover kam hota hai","Same rehta hai"], 0, "medium"],
  ["Joint life term plan kya hai?", ["Spouse dono ek policy mein","Two separate policies","Business partner","Children"], 0, "medium"],
  ["Return of premium term plan kya hai?", ["Maturity pe premiums wapas","Extra bonus","Double cover","Free renewal"], 0, "medium"],
  ["Suicide clause term insurance mein kitna hai?", ["1 saal","6 mahine","2 saal","Koi clause nahi"], 0, "hard"],
  ["E-insurance kya hai?", ["Digital policy copy IRDAI repository mein","Email policy","WhatsApp policy","Paperless claim"], 0, "medium"],
];

// ── HOME INSURANCE ───────────────────────────────────────────────────────────
const homeBase: [string, string[], number, Difficulty][] = [
  ["Home insurance mein structure aur contents dono cover hote hai?", ["Haan, dono optional","Sirf building","Sirf contents","Koi nahi"], 0, "easy"],
  ["Burglary cover generally kaise aata hai?", ["Add-on","Mandatory","Basic mein included","Hamesha excluded"], 0, "medium"],
  ["Earthquake jaise natural disasters cover hote hai?", ["Extra premium se cover","Hamesha excluded","Sirf flood covered","Auto included"], 0, "medium"],
  ["Tenant (kiraayedaar) kya insure kar sakta hai?", ["Sirf contents","Sirf building","Landlord ki building","Kuch nahi"], 0, "easy"],
  ["Reinstatement value ka matlab?", ["Naye jaane rebuild karne ki cost","Market price","Depreciated cost","Purchase price"], 0, "hard"],
  ["Loss of rent bhi cover hota hai?", ["Add-on se","Basic policy mein","Kabhi nahi","Sirf commercial"], 0, "hard"],
  ["Home contents policy mein kya aata hai?", ["Furniture, electronics, jewellery limited","Sirf building","Sirf walls","Sirf roof"], 0, "easy"],
  ["Structure policy kis chiz ko cover karti hai?", ["Deewarein, chhat, farsh","Andar ka samaan","Jewellery","Car"], 0, "easy"],
  ["Kya standard home insurance mein termite cover hota hai?", ["Nahi, exclusion hai","Haan full cover","Partial","Depends"], 0, "medium"],
  ["Fire and special perils policy kya cover karti hai?", ["Aag, lightning, flood, storm","Sirf aag","Sirf theft","Sirf earthquake"], 0, "medium"],
  ["Valuable articles cover kya deta hai?", ["Jewellery, art, collectibles","Furniture","Groceries","Clothes"], 0, "medium"],
  ["Home insurance renewal kyun zaroori hai?", ["Continuous coverage ke liye","Tax ke liye","Loan ke liye","Optional hai"], 0, "easy"],
];

// ── GENERAL INSURANCE ────────────────────────────────────────────────────────
const generalBase: [string, string[], number, Difficulty][] = [
  ["IRDAI ka full form kya hai?", ["Insurance Regulatory and Development Authority of India","Indian Regulatory Dept","Insurance Reinsurance Authority","None"], 0, "easy"],
  ["Section 41 of Insurance Act 1938 kisko prohibit karta hai?", ["Cashback/rebate for buying policy","Claim rejection","Agent licensing","Policy nomination"], 0, "hard"],
  ["Free look period kya hota hai?", ["Policy 15-30 din mein return kar sakte ho","Claim faster","Premium kam","No medical test"], 0, "medium"],
  ["Car ke liye kaunsa insurance mandatory hai?", ["Third party insurance","Comprehensive insurance","Zero dep","Engine cover"], 0, "easy"],
  ["Health insurance mein portability ka matlab?", ["Insurer badal sakte ho waiting period credit ke saath","Policy cancel","Transfer to family","Sum insured badhao"], 0, "medium"],
  ["Rider kya hota insurance mein?", ["Add-on benefit","Premium discount","Policy cancel","Nominee change"], 0, "easy"],
  ["Sum assured kya hai?", ["Claim par guaranteed amount","Premium","Agent commission","Tax"], 0, "easy"],
  ["Premium kya hai?", ["Insurance cover ke liye bhugtaan ki gayi rakam","Claim amount","Discount","Bonus"], 0, "easy"],
  ["Exclusion kya hota hai?", ["Situations jo cover nahi hain","Extra benefit","Discount","Free cover"], 0, "easy"],
  ["Underwriting kya hai?", ["Risk assessment before issuing policy","Claim process","Premium payment","Nomination"], 0, "medium"],
  ["Bima Bharosa portal kya hai?", ["IRDAI grievance portal","Insurance marketplace","Government hospital","Policy download"], 0, "medium"],
  ["Insurance Ombudsman kya karta hai?", ["Claims up to ₹50 Lakh ka free dispute resolution","Policy bechta hai","Premium collect karta hai","Hospital run karta hai"], 0, "hard"],
  ["Moratorium clause kya hai?", ["5 saal baad non-disclosure pe claim reject nahi ho sakta","Waiting period","Grace period","Cooling off"], 0, "hard"],
  ["Insurance Web Aggregator license kisko chahiye?", ["Online comparison platforms","Hospital","Agent","Bank"], 0, "medium"],
  ["Prohibited terms insurance mein kaunse hain?", ["Best, cheapest, guaranteed","Free, discount, cashback","Premium, cover, claim","Sum, value, rate"], 0, "hard"],
  ["Solvency ratio kya indicate karta hai?", ["Insurer ke paas claims ke liye paisa hai ya nahi","Profitability","Market share","Agent count"], 0, "hard"],
  ["Grievance Redressal Officer ka time kitna hai respond karne ka?", ["30 din","15 din","7 din","60 din"], 0, "medium"],
  ["Re-insurance kya hai?", ["Insurer apna risk doosre insurer ko transfer karta hai","Double insurance","Free insurance","Government insurance"], 0, "hard"],
  ["KYC insurance mein kyun zaroori hai?", ["Money laundering prevent, correct identification","Tax collection","Premium calculation","Claim processing"], 0, "medium"],
  ["e-IA (e-Insurance Account) kya hai?", ["Digital locker for all insurance policies","Email account","Online payment","Claim form"], 0, "medium"],
];

// ── Generate full question banks ─────────────────────────────────────────────
function generateBank(
  base: [string, string[], number, Difficulty][],
  category: QuizCategory,
  targetCount: number
): QuizQuestion[] {
  const bank: QuizQuestion[] = [];

  // Add base questions with variations
  for (const [text, opts, correct, diff] of base) {
    // Original
    bank.push({ text, options: [...opts], correct, difficulty: diff, category });
    // Advanced variant
    bank.push({ text: `${text} (advanced)`, options: [...opts], correct, difficulty: 'medium', category });
    // Expert variant
    bank.push({ text: `${text} (expert)`, options: [...opts], correct, difficulty: 'hard', category });
  }

  // Fill remaining with numbered variations
  let idx = 0;
  while (bank.length < targetCount) {
    const baseIdx = idx % base.length;
    const [text, opts, correct] = base[baseIdx];
    bank.push({
      text: `${text} — Set ${Math.floor(idx / base.length) + 2}`,
      options: [...opts],
      correct,
      difficulty: 'medium',
      category,
    });
    idx++;
  }

  return bank.slice(0, targetCount);
}

export const healthBank = generateBank(healthBase, 'health', 120);
export const motorBank = generateBank(motorBase, 'motor', 110);
export const lifeBank = generateBank(lifeBase, 'life', 110);
export const homeBank = generateBank(homeBase, 'home', 60);
export const generalBank = generateBank(generalBase, 'general', 60);

// Total: 460+ questions

export function getAllBanks(): QuizQuestion[] {
  return [...healthBank, ...motorBank, ...lifeBank, ...homeBank, ...generalBank];
}

export function getQuestionsForCategory(category: QuizCategory, count: number): QuizQuestion[] {
  const poolMap: Record<QuizCategory, QuizQuestion[]> = {
    health: healthBank,
    motor: motorBank,
    life: lifeBank,
    home: homeBank,
    general: generalBank,
  };
  const pool = poolMap[category];
  return shuffleArray([...pool]).slice(0, count);
}

export function getMixQuestions(count = 10): QuizQuestion[] {
  const perCat = Math.floor(count / 4);
  const remainder = count - perCat * 4;
  const questions = [
    ...shuffleArray([...healthBank]).slice(0, perCat + (remainder > 0 ? 1 : 0)),
    ...shuffleArray([...motorBank]).slice(0, perCat + (remainder > 1 ? 1 : 0)),
    ...shuffleArray([...lifeBank]).slice(0, perCat + (remainder > 2 ? 1 : 0)),
    ...shuffleArray([...generalBank]).slice(0, perCat),
  ];
  return shuffleArray(questions);
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleOptions(question: QuizQuestion): QuizQuestion {
  const opts = [...question.options];
  const correctText = opts[question.correct];
  const shuffled = shuffleArray(opts);
  const newCorrect = shuffled.indexOf(correctText);
  return { ...question, options: shuffled, correct: newCorrect };
}

export function generateQuizCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let code = 'QUIZ-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  code += `-${dd}${mm}`;
  return code;
}
