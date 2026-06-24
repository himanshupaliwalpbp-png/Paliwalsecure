'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, ArrowRight, RotateCcw, Sparkles, Phone, User,
  Clock, Trophy, ChevronRight, Zap, Shield, ShieldCheck, Heart, Car,
  Home as HomeIcon, BookOpen, Copy, Share2, CheckCircle2,
  XCircle, Star, ExternalLink, MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { fireConfetti } from '@/components/Confetti';
import { useLanguage } from '@/lib/i18n';

// ============================================================================
// TYPES
// ============================================================================

interface QuizQuestion {
  text: string;
  options: string[];
  correct: number;
  difficulty: string;
  category: string;
}

interface UserAnswer {
  qText: string;
  selected: string;
  correctAns: string;
  isCorrect: boolean;
}

interface AffiliateDeal {
  title: string;
  offer: string;
  code?: string;
  description: string;
  link: string;
  buttonText: string;
  commission: string;
  borderColor: string;
  bgColor: string;
  btnBg: string;
}

type QuizPhase = 'modeSelect' | 'quiz' | 'leadForm' | 'result' | 'review';
type QuizMode = 'singleMix' | 'fullMix' | 'categoryHealth' | 'categoryMotor' | 'categoryLife' | 'categoryHome';

// ============================================================================
// 155+ UNIQUE HINGLISH QUESTION BANK
// health: 37 | motor: 31 | life: 31 | home: 25 | general: 31
// ============================================================================

const healthBank: QuizQuestion[] = [
  {text:"Health insurance mein 'waiting period' kya hota hai?", options:["30 din","2 saal","48 mahine","Koi nahi"], correct:2, difficulty:"medium", category:"health"},
  {text:"'Co-payment' ka matlab kya hai?", options:["Fixed discount","Insured khud % bhare","Insurer extra de","Tax benefit"], correct:1, difficulty:"medium", category:"health"},
  {text:"Cashless claim facility ka matlab?", options:["Insurer direct hospital ko pay kare","Baad mein reimbursement","Khud bharo aur claim karo","Claim hi nahi"], correct:0, difficulty:"easy", category:"health"},
  {text:"Room rent sub-limit kisko affect karta hai?", options:["Doctor fees","Daily room charge","Medicines","Ambulance"], correct:1, difficulty:"medium", category:"health"},
  {text:"Health insurance mein 'No Claim Bonus' kya karta hai?", options:["Sum insured badhata hai","Premium kam karta hai","Dono","Sirf family floater"], correct:2, difficulty:"medium", category:"health"},
  {text:"Family floater plan kise cover karta hai?", options:["Sirf ek individual","Poora family ek sum insured pe","Sirf parents","Sirf spouse"], correct:1, difficulty:"easy", category:"health"},
  {text:"AYUSH treatment mein kya cover hota hai?", options:["Homeopathy, Ayurveda","Sirf Allopathy","Dental","Cosmetic"], correct:0, difficulty:"easy", category:"health"},
  {text:"Top-up health plan kab active hota hai?", options:["Pehle claim pe","Deductible limit cross hone pe","Waiting period ke baad","No claim pe"], correct:1, difficulty:"hard", category:"health"},
  {text:"Restore benefit kya karta hai?", options:["Claim ke baad sum insured wapas","Premium kam","Policy cancel","Co-pay badhta hai"], correct:0, difficulty:"hard", category:"health"},
  {text:"Maternity cover ka waiting period typically?", options:["9 mahine","12-24 mahine","No waiting","3 mahine"], correct:1, difficulty:"medium", category:"health"},
  {text:"Online health policy ka free look period kitna hota hai?", options:["15 din","30 din","7 din","45 din"], correct:0, difficulty:"hard", category:"health"},
  {text:"Pre-existing disease ke liye waiting period (new rules 2025) max kitna hai?", options:["36 mahine","48 mahine","24 mahine","12 mahine"], correct:0, difficulty:"hard", category:"health"},
  {text:"Portability in health insurance means kya?", options:["Insurer badal sakte ho waiting period credit ke saath","Policy cancel","Transfer to family","Sum insured badhao"], correct:0, difficulty:"medium", category:"health"},
  {text:"Critical illness rider kya karta hai?", options:["Bimari hone par lump sum de","Reimbursement","Daily cash","Kuch nahi"], correct:0, difficulty:"medium", category:"health"},
  {text:"Domiciliary hospitalisation kya hai?", options:["Ghar par ilaaj","Hospital mein","Day care","Emergency"], correct:0, difficulty:"medium", category:"health"},
  {text:"Network hospital kyun important hai?", options:["Cashless treatment ke liye","Claim settlement ke liye","Premium payment","Renewal"], correct:0, difficulty:"easy", category:"health"},
  {text:"Day care procedures cover hoti hai bina 24hr admission ke?", options:["Haan","Nahi","Sirf emergency","Sirf surgery"], correct:0, difficulty:"easy", category:"health"},
  {text:"Sub-limit kya hota hai?", options:["Khaas treatments ki limit","Total sum insured","Premium limit","Co-pay limit"], correct:0, difficulty:"medium", category:"health"},
  {text:"Health insurance mein 'cumulative bonus' kya hai?", options:["Claim-free saal par sum insured badhta hai","Premium ghatta hai","Co-pay badhta hai","Waiting period kum"], correct:0, difficulty:"medium", category:"health"},
  {text:"Moratorium period kya hai (new guidelines)?", options:["8 saal baad insurer medical history question nahi kar sakta","4 saal","5 saal","2 saal"], correct:0, difficulty:"hard", category:"health"},
  {text:"Room rent capping ka kya impact hota hai claim pe?", options:["Room rent limit se zyada ka khud bharna padta hai","Koi impact nahi","Premium kam hota hai","Sum insured badhta hai"], correct:0, difficulty:"medium", category:"health"},
  {text:"Corporate health insurance mein kya limitation hoti hai?", options:["Job chhodne par cover khatam","Permanent cover","High sum insured","No waiting period"], correct:0, difficulty:"medium", category:"health"},
  {text:"Group health insurance ka sabse bada fayda kya hai?", options:["Pre-existing diseases bhi cover bina waiting period ke","Premium zero","Unlimited sum insured","No claim rejection"], correct:0, difficulty:"medium", category:"health"},
  {text:"Pre-hospitalization expenses kitne din ke liye cover hote hai?", options:["30-60 din pehle ke","7 din","1 saal","Koi nahi"], correct:0, difficulty:"medium", category:"health"},
  {text:"Post-hospitalization expenses kitne din ke liye cover hote hai?", options:["60-180 din tak","7 din","30 din only","1 saal"], correct:0, difficulty:"medium", category:"health"},
  {text:"Day care treatments ki list mein kitni procedures aati hai (IRDAI)?", options:["500+ listed procedures","Sirf 10","Sirf 50","Koi list nahi"], correct:0, difficulty:"hard", category:"health"},
  {text:"Domiciliary treatment ka kya condition hai cover hone ke liye?", options:["Patient hospital nahi ja sakta aur doctor ne ghar par ilaaj likha","Patient ki marzi","Sirf emergency","Hospital bed nahi mila"], correct:0, difficulty:"hard", category:"health"},
  {text:"Sum insured enhancement kab kar sakte hai health policy mein?", options:["Renewal time par bina claim ke","Kabhi nahi","Har mahine","Mid-term"], correct:0, difficulty:"medium", category:"health"},
  {text:"Zone-based pricing health insurance mein kya hota hai?", options:["Metro cities ka premium zyada hota hai","Sab jagah same","Gaon mein zyada","Zone se koi lena dena nahi"], correct:0, difficulty:"hard", category:"health"},
  {text:"Super top-up plan aur top-up plan mein kya fark hai?", options:["Super top-up saari bills ka aggregate dekhta hai, top-up sirf ek bill","Koi fark nahi","Top-up zyada cover","Super top-up sasta nahi"], correct:0, difficulty:"hard", category:"health"},
  {text:"Cumulative bonus ka calculation kaise hota hai?", options:["Har claim-free saal par sum insured 5-10% badhta hai","Flat ₹5000","Premium reduce","Sum insured half"], correct:0, difficulty:"medium", category:"health"},
  {text:"Kis age ke baad medical checkup zaroori hai health insurance ke liye?", options:["45 saal se upar","18 saal","60 saal","Kabhi nahi"], correct:0, difficulty:"easy", category:"health"},
  {text:"NRI kya India mein health insurance le sakta hai?", options:["Haan, Indian address proof ke saath","Nahi","Sirf travel insurance","Sirf PIO card pe"], correct:0, difficulty:"medium", category:"health"},
  {text:"IRDAI ka standard health product kya kehlata hai?", options:["Arogya Sanjeevani","Swasthya Bima","Standard Health","Niramaya"], correct:0, difficulty:"hard", category:"health"},
  {text:"Corporate buffer group health mein kya hota hai?", options:["Extra fund for high claims beyond individual sum insured","Employee ka PF","Tax saving fund","Bonus pool"], correct:0, difficulty:"hard", category:"health"},
  {text:"OPD cover health insurance mein kya benefit deta hai?", options:["Doctor consultation, pharmacy bina hospitalization ke","Sirf dental","Sirf lab test","Kuch nahi"], correct:0, difficulty:"medium", category:"health"},
  {text:"Star Health aur HDFC ERGO mein network hospitals ka kya matlab?", options:["Cashless treatment ke liye empanelled hospitals","Brand ke apne hospitals","Government hospitals","Only emergency wards"], correct:0, difficulty:"easy", category:"health"},
];

const motorBank: QuizQuestion[] = [
  {text:"IDV ka full form kya hai?", options:["Insured Declared Value","Immediate Damage Value","Income Depreciation Value","Insured Depreciation Value"], correct:0, difficulty:"easy", category:"motor"},
  {text:"Comprehensive car insurance mein kya cover hai?", options:["Own damage + Third party","Sirf Third party","Sirf Own damage","Sirf theft"], correct:0, difficulty:"easy", category:"motor"},
  {text:"No Claim Bonus (NCB) kiske liye milta hai?", options:["Claim-free year","Add-on khareedne par","RSA use karne par","High IDV"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Zero depreciation add-on ka fayda?", options:["Full value bina depreciation cut ke","Premium kam","IDV zyada","Extended warranty"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Third-party insurance mein kya cover nahi hota?", options:["Doosre ki gaadi ka damage","Doosre ko injury","Apni gaadi ka damage","Legal liability"], correct:2, difficulty:"medium", category:"motor"},
  {text:"Engine protection cover kis kaam aata hai?", options:["Paani ki entry se engine damage","Accidental repair","Chori","Tyre burst"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Return to Invoice add-on kya karta hai?", options:["Total loss par on-road price","Sirf IDV","Sirf repair","Third party cost"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Car ke liye maximum NCB kitna hota hai?", options:["30%","40%","50%","60%"], correct:2, difficulty:"medium", category:"motor"},
  {text:"Compulsory deductible kis claim pe lagta hai?", options:["Third party claim","Own damage claim","Dono","Koi nahi"], correct:1, difficulty:"hard", category:"motor"},
  {text:"Car bechne par NCB transfer hota hai?", options:["Haan, naye owner ko","Nahi, policyholder ke paas","Sirf same car","Insurer ko"], correct:1, difficulty:"hard", category:"motor"},
  {text:"Third party insurance legal hai?", options:["Haan, zaroori hai","Nahi","Sirf comprehensive","Sirf old cars"], correct:0, difficulty:"easy", category:"motor"},
  {text:"Own damage claim mein depreciation kis part pe lagti hai?", options:["Rubber aur plastic parts","Engine","Glass","Labour"], correct:0, difficulty:"medium", category:"motor"},
  {text:"'Bumper to bumper' cover kya hota hai?", options:["Zero depreciation","Sirf bumper","Comprehensive","Third party"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Roadside assistance mein kya milta hai?", options:["Towing, puncture help","Engine rebuild","Paint job","Windshield repair"], correct:0, difficulty:"easy", category:"motor"},
  {text:"Private car ka IDV kaise decide hota hai?", options:["Ex-showroom price minus depreciation","Market value","Purchase price","Insured ki marzi"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Two-wheeler aur four-wheeler insurance ka main fark kya hai?", options:["TP premium aur IDV calculation alag hai","Koi fark nahi","Same premium","Two-wheeler mein OD nahi"], correct:0, difficulty:"medium", category:"motor"},
  {text:"IRDAI ki motor TP rates 2024-25 mein private car (1000cc) ka kitna TP premium hai?", options:["₹2,094 se ₹3,224 range","₹500","₹10,000","₹1,000"], correct:0, difficulty:"hard", category:"motor"},
  {text:"PUC certificate insurance claim ke liye zaroori hai?", options:["Haan, valid PUC hona chahiye","Nahi","Sirf new car","Sirf commercial vehicle"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Vintage car insurance kya hota hai?", options:["30+ saal purani cars ke liye special policy","Old car ka normal insurance","Sirf third party","Koi special nahi"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Commercial vehicle insurance mein kya extra cover hota hai?", options:["Goods in transit, passenger liability","Sirf third party","Same as private","Kuch nahi"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Motor insurance claim process mein FIR kab zaroori hai?", options:["Third party injury/death aur theft ke case mein","Har accident mein","Kabhi nahi","Sirf scratch pe"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Surveyor ka kya role hai motor insurance claim mein?", options:["Damage assess karta hai aur estimate banata hai","Claim reject karta hai","Premium fix karta hai","Car bechta hai"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Constructive total loss kya hota hai motor insurance mein?", options:["Repair cost IDV se zyada ho jaaye","Chori ho jaaye","Scratch aaye","Engine band ho"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Car ke age ke hisaab se depreciation rate kya hai 0-6 months ke liye?", options:["5%","0%","20%","50%"], correct:0, difficulty:"hard", category:"motor"},
  {text:"NCB protection add-on ka kya fayda hai?", options:["Chhota claim karne par bhi NCB safe rehta hai","NCB double","Premium kam","IDV badhta hai"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Engine protection cover waterlogging mein kaise kaam aata hai?", options:["Paani se engine damage (hydrostatic lock) cover karta hai","Car dho deta hai","Tyre cover","Chori cover"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Key replacement cover kya deta hai?", options:["Chori/honay par car key replace ka kharcha","Duplicate lock","Car alarm","GPS tracking"], correct:0, difficulty:"easy", category:"motor"},
  {text:"Tyre protection cover kya hota hai?", options:["Accidental tyre damage aur burst cover","Normal wear and tear","Puncture repair","Wheel alignment"], correct:0, difficulty:"medium", category:"motor"},
  {text:"Personal accident cover motor mein kitna sum insured hota hai (compulsory)?", options:["₹15 lakh for owner-driver","₹1 lakh","₹50 lakh","₹5 lakh"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Third party property damage ka limit kitna hai motor insurance mein?", options:["₹7.5 lakh for motor vehicle damage","Unlimited","₹1 lakh","₹50,000"], correct:0, difficulty:"hard", category:"motor"},
  {text:"Motor insurance renewal grace period kitna hota hai?", options:["30 din (OD cover ke liye)","90 din","15 din","Koi nahi"], correct:0, difficulty:"medium", category:"motor"},
];

const lifeBank: QuizQuestion[] = [
  {text:"Term insurance kya hai?", options:["Sirf death benefit","Maturity benefit","Savings + investment","Loan facility"], correct:0, difficulty:"easy", category:"life"},
  {text:"Claim Settlement Ratio (CSR) batata hai?", options:["Kitne % claims settle hue","Profitability","Policies ki sankhya","Agent commission"], correct:0, difficulty:"medium", category:"life"},
  {text:"Life insurance offline policy ka free look period?", options:["15 din","30 din","45 din","7 din"], correct:1, difficulty:"medium", category:"life"},
  {text:"Premium payment ke liye grace period?", options:["15 din","30 din","45 din","60 din"], correct:1, difficulty:"medium", category:"life"},
  {text:"Surrender value kab milti hai?", options:["Policy beech mein cancel karne par","Maturity par","Death claim par","Nominee change par"], correct:0, difficulty:"medium", category:"life"},
  {text:"Paid-up policy ka matlab?", options:["Premiums band but reduced sum assured","Policy lapsed","Full sum assured","Loan liya"], correct:0, difficulty:"hard", category:"life"},
  {text:"ULIP aur Term mein market risk kis mein hai?", options:["ULIP","Term plan","Dono","Koi nahi"], correct:0, difficulty:"easy", category:"life"},
  {text:"Section 80C deduction max limit for life insurance premium?", options:["₹1L","₹1.5L","₹2L","No limit"], correct:1, difficulty:"medium", category:"life"},
  {text:"Nominee aur legal heir mein antar?", options:["Nominee ko paisa but legal heir ko bhi haq","Dono same","Nominee maalik","Legal heir claim nahi"], correct:0, difficulty:"hard", category:"life"},
  {text:"Accidental death rider kya karta hai?", options:["Accident se death par extra paisa","Sirf disability","Sirf critical illness","Kuch nahi"], correct:0, difficulty:"easy", category:"life"},
  {text:"Term plan sasta kyun hota hai?", options:["Sirf death cover","Maturity benefit nahi","Investment nahi","Sabhi options"], correct:3, difficulty:"easy", category:"life"},
  {text:"MWP Act kis benefit ke liye hai?", options:["Wife aur children ke liye policy protection","Tax benefit","Loan","Nominee change"], correct:0, difficulty:"hard", category:"life"},
  {text:"Endowment plan aur term plan mein kya fark hai?", options:["Endowment mein maturity benefit + death cover, term mein sirf death cover","Koi fark nahi","Term mein maturity","Endowment mein death cover nahi"], correct:0, difficulty:"medium", category:"life"},
  {text:"Money-back policy ka kya feature hai?", options:["Periodic payments survival par aur death cover","Paise wapas premium ke","Refund of all premiums","Sirf savings"], correct:0, difficulty:"medium", category:"life"},
  {text:"Whole life insurance kya hota hai?", options:["Poore zindagi ka cover, death par sum assured","Sirf 10 saal ka","Retirement tak","Maturity pe paisa"], correct:0, difficulty:"medium", category:"life"},
  {text:"Annuity plan kya hota hai?", options:["Lump sum invest karke regular pension/income paana","One-time payment","Life cover only","Health insurance"], correct:0, difficulty:"medium", category:"life"},
  {text:"Pension plan (NPS) mein kya tax benefit hai?", options:["Section 80CCD mein ₹50,000 extra deduction","Section 80C only","Koi tax benefit nahi","₹2 lakh deduction"], correct:0, difficulty:"hard", category:"life"},
  {text:"Group life insurance kaunsa organizations provide karte hain?", options:["Employer apne employees ke liye","Individual khud","Sirf bank","Sirf government"], correct:0, difficulty:"easy", category:"life"},
  {text:"Keyman insurance kya hota hai?", options:["Company ke key person ke life pe policy, company beneficiary","Car insurance","Health insurance key employee ka","Property insurance"], correct:0, difficulty:"hard", category:"life"},
  {text:"NRI kya India mein life insurance le sakta hai?", options:["Haan, Indian aur foreign currency dono mein","Nahi","Sirf Indian currency mein","Sirf PIO card holders"], correct:0, difficulty:"medium", category:"life"},
  {text:"Return of premium term plan kya karta hai?", options:["Policy period mein death nahi hua toh premium wapas","Premium discount","Double sum assured","Free health checkup"], correct:0, difficulty:"medium", category:"life"},
  {text:"Death claim ke liye kaunse documents zaroori hain?", options:["Death certificate, policy document, nominee ID proof, FIR (accidental)","Sirf policy","Sirf Aadhaar","Koi document nahi"], correct:0, difficulty:"medium", category:"life"},
  {text:"Section 10(10D) ka kya rule hai life insurance pe?", options:["Maturity/death proceed tax-free agar premium 10% sum assured se kam","Sab pe tax","Koi tax benefit nahi","Only health insurance pe"], correct:0, difficulty:"hard", category:"life"},
  {text:"Bachhon ke liye life insurance plan kya kehlata hai?", options:["Child plan – future milestones pe payouts","Child health plan","Education loan","Fixed deposit"], correct:0, difficulty:"easy", category:"life"},
  {text:"Joint life policy mein kya hota hai?", options:["Dono insured ki life cover, pehle death par payout","Sirf ek ki life","Divorce cover","Property insurance"], correct:0, difficulty:"medium", category:"life"},
  {text:"Lapsed policy ko revive kaise karte hain?", options:["Arrears + interest pay karke revival period mein","Nahi kar sakte","New policy leni padegi","Free mein revive"], correct:0, difficulty:"medium", category:"life"},
  {text:"Assignment of life insurance policy kya hai?", options:["Policy ka benefit kisi aur ko transfer (conditional/absolute)","Policy cancel","Premium kam","Sum insured badhana"], correct:0, difficulty:"hard", category:"life"},
  {text:"Critical illness rider life insurance mein kya karta hai?", options:["Diagnosed hone par lump sum payout, policy continue","Hospital bill pay","Free checkup","Premium waive"], correct:0, difficulty:"medium", category:"life"},
  {text:"Waiver of premium rider ka kya fayda hai?", options:["Disability/critical illness pe future premium maaf","Premium discount","Free policy","Double sum assured"], correct:0, difficulty:"medium", category:"life"},
  {text:"Term insurance mein increasing term option kya hai?", options:["Sum assured har saal badhta hai fixed % se","Premium badhta hai","Cover kam hota hai","Policy extend"], correct:0, difficulty:"hard", category:"life"},
  {text:"Life insurance ke loan facility mein kitna % loan mil sakta hai?", options:["Up to 90% of surrender value","100% of sum assured","₹10 lakh fixed","Koi loan nahi"], correct:0, difficulty:"hard", category:"life"},
];

const homeBank: QuizQuestion[] = [
  {text:"Home insurance mein structure aur contents dono cover hote hai?", options:["Haan, dono optional","Sirf building","Sirf contents","Koi nahi"], correct:0, difficulty:"easy", category:"home"},
  {text:"Burglary cover generally kaise aata hai?", options:["Add-on","Mandatory","Basic mein included","Hamesha excluded"], correct:0, difficulty:"medium", category:"home"},
  {text:"Earthquake jaise natural disasters cover hote hai?", options:["Extra premium se","Hamesha excluded","Sirf flood","Auto included"], correct:0, difficulty:"medium", category:"home"},
  {text:"Tenant (kiraayedaar) kya insure kar sakta hai?", options:["Sirf contents","Sirf building","Landlord ki building","Kuch nahi"], correct:0, difficulty:"easy", category:"home"},
  {text:"Reinstatement value ka matlab?", options:["Naye jaane rebuild karne ki cost","Market price","Depreciated cost","Purchase price"], correct:0, difficulty:"hard", category:"home"},
  {text:"Loss of rent bhi cover hota hai?", options:["Add-on se","Basic policy mein","Kabhi nahi","Sirf commercial"], correct:0, difficulty:"hard", category:"home"},
  {text:"Home contents policy mein kya aata hai?", options:["Furniture, electronics, jewellery limited","Sirf building","Sirf walls","Sirf roof"], correct:0, difficulty:"easy", category:"home"},
  {text:"Structure policy kis chiz ko cover karti hai?", options:["Deewarein, chhat, farsh","Andar ka samaan","Jewellery","Car"], correct:0, difficulty:"easy", category:"home"},
  {text:"Kya standard home insurance mein termite cover hota hai?", options:["Nahi, exclusion hai","Haan full cover","Partial","Depends"], correct:0, difficulty:"medium", category:"home"},
  {text:"Fire insurance mein kya kya cover hota hai?", options:["Aag se damage, smoke, explosion","Sirf kitchen fire","Sirf electrical fire","Koi bhi aag nahi"], correct:0, difficulty:"medium", category:"home"},
  {text:"Flood damage home insurance mein cover hota hai?", options:["Natural calamity add-on se haan, basic mein nahi","Haan hamesha","Kabhi nahi","Sirf rooftop flood"], correct:0, difficulty:"medium", category:"home"},
  {text:"Riot aur strike damage cover kaise milta hai?", options:["Basic fire policy mein included ya add-on se","Kabhi nahi","Sirf commercial property","Sirf government building"], correct:0, difficulty:"medium", category:"home"},
  {text:"Terrorism cover home insurance mein kaise aata hai?", options:["Add-on premium pe, standard mein excluded","Free mein included","Hamesha covered","Sirf commercial property"], correct:0, difficulty:"hard", category:"home"},
  {text:"Valuable items cover mein kya aata hai?", options:["Jewellery, art, collectibles with declared value","Sirf furniture","Sirf electronics","Sirf books"], correct:0, difficulty:"medium", category:"home"},
  {text:"Jewellery insurance ke liye kya zaroori hai?", options:["Valuation certificate aur bills","Sirf photo","Koi proof nahi","Shop ka receipt hi kaafi"], correct:0, difficulty:"medium", category:"home"},
  {text:"Rented property ke liye kaunsa home insurance lena chahiye tenant ko?", options:["Contents insurance – apne samaan ke liye","Building insurance","Landlord ka policy","Koi nahi chahiye"], correct:0, difficulty:"easy", category:"home"},
  {text:"Construction type (kutcha/pucca) ka premium pe kya asar padta hai?", options:["Kutcha construction ka premium zyada hota hai risk ke kaaran","Koi fark nahi","Pucca ka zyada","Same rate"], correct:0, difficulty:"medium", category:"home"},
  {text:"Building ki age ka home insurance premium pe kya asar hai?", options:["Purani building ka premium zyada – risk badhta hai","Nayi building ka zyada","Koi fark nahi","Age se koi lena dena nahi"], correct:0, difficulty:"medium", category:"home"},
  {text:"Home insurance claim process mein kya karna padta hai?", options:["Intimation to insurer, surveyor assessment, documents submit","Sirf phone call","Direct repair karwao","Police ka kaam"], correct:0, difficulty:"easy", category:"home"},
  {text:"Sum insured calculation home ke liye kaise hoti hai?", options:["Reinstatement value ya market value basis pe","Arbitrary amount","Purchase price","Circle rate"], correct:0, difficulty:"hard", category:"home"},
  {text:"Underinsurance penalty (average clause) kya hai home insurance mein?", options:["Sum insured kam hai toh claim proportionally reduce hota hai","Penalty ₹1000","Policy cancel","Koi asar nahi"], correct:0, difficulty:"hard", category:"home"},
  {text:"Agricultural building ke liye kya insurance available hai?", options:["Special agricultural farm policy","Normal home insurance","Koi nahi","Sirf crop insurance"], correct:0, difficulty:"medium", category:"home"},
  {text:"Shop ya office ke liye kaunsa insurance lena chahiye?", options:["Commercial property insurance – building + stock + liability","Home insurance","Health insurance","Koi nahi"], correct:0, difficulty:"easy", category:"home"},
  {text:"Warehouse insurance mein kya kya cover hota hai?", options:["Building, stored goods, fire, flood, theft","Sirf building","Sirf goods","Sirf fire"], correct:0, difficulty:"medium", category:"home"},
  {text:"Home insurance mein common exclusion kya hain?", options:["Wear and tear, war, nuclear risk, intentional damage","Fire","Theft","Flood"], correct:0, difficulty:"medium", category:"home"},
];

const generalBank: QuizQuestion[] = [
  {text:"IRDAI full form kya hai?", options:["Insurance Regulatory and Development Authority of India","Indian Regulatory Dept","Insurance Reinsurance Authority","None"], correct:0, difficulty:"easy", category:"general"},
  {text:"Section 41 of Insurance Act 1938 kisko prohibit karta hai?", options:["Cashback/rebate for buying policy","Claim rejection","Agent licensing","Policy nomination"], correct:0, difficulty:"hard", category:"general"},
  {text:"Free look period kya hota hai?", options:["Policy 15-30 din mein return kar sakte ho","Claim faster","Premium kam","No medical test"], correct:0, difficulty:"medium", category:"general"},
  {text:"Car ke liye kaunsa insurance mandatory hai?", options:["Third party insurance","Comprehensive insurance","Zero dep","Engine cover"], correct:0, difficulty:"easy", category:"general"},
  {text:"Portability in health insurance ka matlab?", options:["Insurer badal sakte ho waiting period credit ke saath","Policy cancel","Transfer to family","Sum insured badhao"], correct:0, difficulty:"medium", category:"general"},
  {text:"Rider kya hota insurance mein?", options:["Add-on benefit","Premium discount","Policy cancel","Nominee change"], correct:0, difficulty:"easy", category:"general"},
  {text:"Sum assured kya hai?", options:["Claim par guaranteed amount","Premium","Agent commission","Tax"], correct:0, difficulty:"easy", category:"general"},
  {text:"Premium kya hai?", options:["Insurance cover ke liye bhugtaan","Claim amount","Discount","Bonus"], correct:0, difficulty:"easy", category:"general"},
  {text:"Exclusion kya hota hai?", options:["Situations jo cover nahi","Extra benefit","Discount","Free cover"], correct:0, difficulty:"easy", category:"general"},
  {text:"Underwriting kya hai?", options:["Risk assessment before issuing policy","Claim process","Premium payment","Nomination"], correct:0, difficulty:"medium", category:"general"},
  {text:"Insurance Ombudsman ka kya kaam hai?", options:["Policyholder ki complaint free mein sunna aur resolve karna","Insurance bechna","Premium collect karna","Policy banwana"], correct:0, difficulty:"medium", category:"general"},
  {text:"IRDAI ki grievance redressal process mein pehla step kya hai?", options:["Insurer ko complaint likhkar dena","Direct court jaana","Police complaint","Agent ko bolna"], correct:0, difficulty:"medium", category:"general"},
  {text:"Policyholder ke kya basic rights hain?", options:["Free look cancellation, claim settlement, policy document, grievance redressal","Sirf premium pay karna","Koi rights nahi","Sirf renewal karna"], correct:0, difficulty:"easy", category:"general"},
  {text:"Section 45 of Insurance Act kya kehta hai?", options:["3 saal baad policy non-disclosure pe reject nahi kar sakte (with conditions)","Policy cancel any time","No claim after 1 year","Premium double"], correct:0, difficulty:"hard", category:"general"},
  {text:"Insurance fraud ke kya types hain?", options:["Fake claims, misrepresentation, multiple claims for same incident","Only late payment","Only policy cancellation","Only wrong nominee"], correct:0, difficulty:"medium", category:"general"},
  {text:"TPA (Third Party Administrator) health insurance mein kya karta hai?", options:["Cashless claim processing aur hospital coordination","Policy bechna","Premium collect","Medical checkup"], correct:0, difficulty:"medium", category:"general"},
  {text:"Web aggregator regulations IRDAI ke kya kehte hain?", options:["Comparison site pe quotes dikhana, but rebating prohibited","Free policies dena","Direct selling only","No regulation"], correct:0, difficulty:"hard", category:"general"},
  {text:"Insurance Marketing Firm (IMF) kya hota hai?", options:["IRDAI licensed firm – multiple insurer products sell kar sakti hai","Bank branch","Government office","Hospital counter"], correct:0, difficulty:"hard", category:"general"},
  {text:"POSP (Point of Sales Person) kya hai?", options:["IRDAI certified person – simple insurance products sell kar sakta hai","Insurance company owner","Bank manager","Hospital staff"], correct:0, difficulty:"medium", category:"general"},
  {text:"Corporate agent aur individual agent mein kya fark hai?", options:["Corporate agent company hai, individual agent ek person – dono IRDAI licensed","Koi fark nahi","Same license","Corporate agent sirf life insurance"], correct:0, difficulty:"medium", category:"general"},
  {text:"Bancassurance model kya hai?", options:["Bank insurance partner ke through policies bechti hai","Bank khud insurance karti hai","Sirf loan dena","Insurance company bank kholti hai"], correct:0, difficulty:"medium", category:"general"},
  {text:"Reinsurance kya hota hai?", options:["Insurer apna risk doosre insurer ko transfer karta hai","Double insurance","Policy renewal","Claim rejection"], correct:0, difficulty:"hard", category:"general"},
  {text:"Solvency ratio ka kya matlab hai insurance mein?", options:["Insurer ke paas claims pay karne ke liye enough capital hai ya nahi","Profit ratio","Market share","Claim ratio"], correct:0, difficulty:"hard", category:"general"},
  {text:"Insurance penetration vs density mein kya antar hai?", options:["Penetration = premium/GDP %, Density = premium per capita","Dono same","Penetration = policies ki sankhya","Density = claim ratio"], correct:0, difficulty:"hard", category:"general"},
  {text:"Micro-insurance kya hota hai?", options:["Low-income group ke liye chhota sum insured, sasta premium","Sirf health insurance","Big corporate insurance","Only life insurance"], correct:0, difficulty:"medium", category:"general"},
  {text:"PMJJBY mein kya cover hota hai?", options:["₹2 lakh life cover ₹436/year premium","₹10 lakh cover","Free health insurance","Pension plan"], correct:0, difficulty:"easy", category:"general"},
  {text:"PMSBY mein kya benefit hai?", options:["₹2 lakh accidental death/disability cover ₹12/year","Life insurance","Health insurance","Home insurance"], correct:0, difficulty:"easy", category:"general"},
  {text:"Ayushman Bharat ka kya coverage hai?", options:["₹5 lakh per family per year secondary aur tertiary care","₹50,000","₹10 lakh","Sirf OPD"], correct:0, difficulty:"medium", category:"general"},
  {text:"Pradhan Mantri Fasal Bima Yojana (PMFBY) kya hai?", options:["Crop insurance – natural calamity aur pest attack se crop loss cover","Health insurance for farmers","Life insurance","Vehicle insurance"], correct:0, difficulty:"medium", category:"general"},
  {text:"Marine insurance mein kya cover hota hai?", options:["Cargo, hull, freight – sea transport mein damage/loss","Sirf ship ki painting","Only passenger insurance","Fishing license"], correct:0, difficulty:"medium", category:"general"},
  {text:"Travel insurance mein kya typically cover hota hai?", options:["Medical emergency, trip cancellation, baggage loss, passport loss","Sirf flight delay","Sirf hotel booking","Sirf visa fees"], correct:0, difficulty:"easy", category:"general"},
];

const allBanks: Record<string, QuizQuestion[]> = {
  health: healthBank,
  motor: motorBank,
  life: lifeBank,
  home: homeBank,
  general: generalBank,
};

// ============================================================================
// AFFILIATE DEALS
// ============================================================================

const DEFAULT_DEALS: Record<string, AffiliateDeal> = {
  myntra: {
    title: "👗 Myntra – Quiz Me Myntra Offer",
    offer: "Minimum 70% OFF On Work Wear · 30 Days Return Policy",
    description: "Find a variety of Fashion, Footwear, Accessories, Personal Care & Lifestyle products for Men, Women & Kids. International brands at your doorstep: Tommy Hilfiger, Kelenji, US Polo, H&M, Forever 21, etc.",
    link: "https://myntr.it/OuSsbCW",
    buttonText: "🛍️ Shop Myntra Now →",
    commission: "30 Days Return Policy · Minimum 70% OFF On Work Wear",
    borderColor: "border-l-[#B8482C]",
    bgColor: "bg-[#F4E5DD] dark:bg-[#3A1E14]/30",
    btnBg: "bg-[#B8482C] hover:bg-[#8B3520]",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomQuestions(pool: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function getSingleMix(): QuizQuestion[] {
  const mix = [
    ...getRandomQuestions(healthBank, 1),
    ...getRandomQuestions(motorBank, 1),
    ...getRandomQuestions(lifeBank, 1),
    ...getRandomQuestions(homeBank, 1),
    ...getRandomQuestions(generalBank, 1),
  ];
  for (let i = mix.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mix[i], mix[j]] = [mix[j], mix[i]];
  }
  return mix;
}

function getFullMix(): QuizQuestion[] {
  const mix = [
    ...getRandomQuestions(healthBank, 3),
    ...getRandomQuestions(motorBank, 3),
    ...getRandomQuestions(lifeBank, 3),
    ...getRandomQuestions(generalBank, 1),
  ];
  for (let i = mix.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mix[i], mix[j]] = [mix[j], mix[i]];
  }
  return mix;
}

function getCategoryQuiz(category: string, count = 8): QuizQuestion[] {
  return getRandomQuestions(allBanks[category] || generalBank, count);
}

/**
 * Shuffles options but correctly tracks which index is correct.
 * This is the KEY fix — the correct answer index is recalculated after shuffle.
 */
function shuffleOptions(question: QuizQuestion): QuizQuestion {
  const opts = [...question.options];
  const correctText = opts[question.correct];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const newCorrect = opts.indexOf(correctText);
  return { ...question, options: opts, correct: newCorrect };
}

function generateQuizCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let code = 'QUIZ-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const ddmm = new Date().toLocaleDateString('en-IN').split('/').slice(0, 2).join('');
  return `${code}-${ddmm}`;
}

// ============================================================================
// TIMER COMPONENT
// ============================================================================

function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const radius = 36;
  const stroke = 4;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;
  const isLow = timeLeft <= 5;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={isLow ? '#9B2C2C' : '#B8482C'}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-lg font-display font-medium tabular-nums ${isLow ? 'text-[#9B2C2C]' : 'text-[#0E1116]'}`}>
          {timeLeft}
        </span>
        <span className="text-[8px] text-[#8B9099] uppercase tracking-wider">sec</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function InsuranceBeastQuiz() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [phase, setPhase] = useState<QuizPhase>('modeSelect');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TIMER_DURATION = 20;

  // Lead form
  const [leadName, setLeadName] = useState('');
  const [leadCity, setLeadCity] = useState('');
  const [leadInterest, setLeadInterest] = useState('Health');

  // Result
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentModeName, setCurrentModeName] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Badges & History (localStorage)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [playHistory, setPlayHistory] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedBadges = localStorage.getItem('bima_beast_badges');
      if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
      const savedHistory = localStorage.getItem('bima_beast_play_history');
      if (savedHistory) setPlayHistory(JSON.parse(savedHistory));
    } catch {}
  }, []);

  const saveBadge = useCallback((badge: string) => {
    setEarnedBadges(prev => {
      if (prev.includes(badge)) return prev;
      const updated = [...prev, badge];
      localStorage.setItem('bima_beast_badges', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const trackPlay = useCallback(() => {
    const today = new Date().toDateString();
    setPlayHistory(prev => {
      if (prev.includes(today)) return prev;
      const updated = [...prev, today];
      localStorage.setItem('bima_beast_play_history', JSON.stringify(updated));
      if (updated.length >= 7) saveBadge('Consistent Beast');
      return updated;
    });
  }, [saveBadge]);

  // ── Start Quiz ────────────────────────────────────────────────
  const startQuiz = useCallback((mode: QuizMode) => {
    let questions: QuizQuestion[] = [];
    let modeName = '';

    switch (mode) {
      case 'singleMix':
        questions = getSingleMix();
        modeName = 'Single Mix (5)';
        break;
      case 'fullMix':
        questions = getFullMix();
        modeName = 'Full Mix (10)';
        break;
      case 'categoryHealth':
        questions = getCategoryQuiz('health', 8);
        modeName = 'Health Only (8)';
        break;
      case 'categoryMotor':
        questions = getCategoryQuiz('motor', 8);
        modeName = 'Motor Only (8)';
        break;
      case 'categoryLife':
        questions = getCategoryQuiz('life', 8);
        modeName = 'Life Only (8)';
        break;
      case 'categoryHome':
        questions = getCategoryQuiz('home', 8);
        modeName = 'Home Only (8)';
        break;
    }

    // Fallback
    if (!questions.length) {
      questions = getFullMix();
      modeName = 'Full Mix (10)';
    }

    // CRITICAL: Shuffle options ONCE here and store the shuffled version
    // This ensures handleAnswer always uses the same shuffled options as the UI
    const shuffledQuestions = questions.map(q => shuffleOptions(q));
    setCurrentQuestions(shuffledQuestions);
    setCurrentModeName(modeName);
    setCurrentIndex(0);
    setUserScore(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setShowAnswerFeedback(false);
    setPhase('quiz');

    // First Blood badge
    if (earnedBadges.length === 0) saveBadge('First Blood 🩸');
  }, [earnedBadges, saveBadge]);

  // ── Move to Next Question ──────────────────────────────────────
  const moveToNextQuestion = useCallback(() => {
    setSelectedOption(null);
    setShowAnswerFeedback(false);

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('leadForm');
    }
  }, [currentIndex, currentQuestions.length]);

  // Use ref to always have latest currentQuestions in callbacks (avoids stale closures)
  const currentQuestionsRef = useRef(currentQuestions);
  currentQuestionsRef.current = currentQuestions;

  // ── Handle Answer ────────────────────────────────────────────
  const handleAnswer = useCallback((optionIndex: number) => {
    if (selectedOption !== null) return; // prevent double click
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionIndex);
    setShowAnswerFeedback(true);

    const q = currentQuestionsRef.current[currentIndex];
    if (!q) return;
    const isCorrect = optionIndex === q.correct;

    if (isCorrect) setUserScore(prev => prev + 1);

    setUserAnswers(prev => [...prev, {
      qText: q.text,
      selected: q.options[optionIndex],
      correctAns: q.options[q.correct],
      isCorrect,
    }]);

    // Move to next after a short delay to show feedback
    setTimeout(() => {
      moveToNextQuestion();
    }, 1200);
  }, [selectedOption, currentIndex, moveToNextQuestion]);

  // ── Handle Time Out ──────────────────────────────────────────
  const handleTimeOut = useCallback(() => {
    const q = currentQuestionsRef.current[currentIndex];
    if (!q) return;

    setUserAnswers(prev => [...prev, {
      qText: q.text,
      selected: "Time out ⏰",
      correctAns: q.options[q.correct],
      isCorrect: false,
    }]);
    setShowAnswerFeedback(true);

    setTimeout(() => {
      moveToNextQuestion();
    }, 1200);
  }, [currentIndex, moveToNextQuestion]);

  // ── Timer Logic ──────────────────────────────────────────────
  // Use ref to avoid stale closure
  const handleTimeOutRef = useRef(handleTimeOut);
  handleTimeOutRef.current = handleTimeOut;

  useEffect(() => {
    if (phase !== 'quiz') return;

    setTimeLeft(TIMER_DURATION);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Time's up — auto-answer via ref to avoid stale closure
          handleTimeOutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, phase]);

  // ── Handle Lead Submit ───────────────────────────────────────
  const handleLeadSubmit = useCallback(() => {
    if (!leadName.trim() || !leadCity.trim()) {
      alert(isHindi ? "कृपया नाम और शहर भरें!" : isEnglish ? "Please fill in name and city!" : "Kripya naam aur sheher bharein!");
      return;
    }

    const code = generateQuizCode();
    setGeneratedCode(code);
    trackPlay();

    // Perfect score badges
    if (userScore === currentQuestions.length) {
      saveBadge('Perfect 10');
    }
    if (currentModeName.includes('Only') && userScore === currentQuestions.length) {
      saveBadge('Category Champion');
    }

    // Store lead in localStorage
    try {
      const leads = JSON.parse(localStorage.getItem('bima_beast_leads') || '[]');
      leads.push({
        name: leadName,
        city: leadCity,
        interest: leadInterest,
        score: Math.round((userScore / currentQuestions.length) * 100),
        mode: currentModeName,
        quizCode: code,
        date: new Date().toISOString(),
      });
      localStorage.setItem('bima_beast_leads', JSON.stringify(leads));
    } catch {}

    // Fire confetti for high scores
    const percentScore = (userScore / currentQuestions.length) * 100;
    if (percentScore >= 80) {
      setTimeout(() => fireConfetti(), 500);
    }

    setPhase('result');
  }, [leadName, leadCity, leadInterest, userScore, currentQuestions.length, currentModeName, saveBadge, trackPlay]);

  // ── Reset Quiz ───────────────────────────────────────────────
  const resetQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('modeSelect');
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setUserScore(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setShowAnswerFeedback(false);
    setLeadName('');
    setLeadCity('');
    setLeadInterest('Health');
    setGeneratedCode('');
    setCurrentModeName('');
    setCodeCopied(false);
  }, []);

  // ── WhatsApp Share ───────────────────────────────────────────
  const handleWhatsAppShare = useCallback(() => {
    const percentScore = Math.round((userScore / currentQuestions.length) * 100);
    const msg = isHindi
      ? `नमस्ते! मैंने बीमा बीस्ट क्विज़ खेला।\nमोड: ${currentModeName}\nमेरा स्कोर: ${percentScore}/100\nमेरा क्विज़ कोड: ${generatedCode}\nमुझे ${leadInterest} इंश्योरेंस के बारे में जानना है।\nक्या आप बीट कर सकते हैं?`
      : isEnglish
      ? `Hi! I played the Bima Beast quiz.\nMode: ${currentModeName}\nMy score: ${percentScore}/100\nMy Quiz Code: ${generatedCode}\nI want to know about ${leadInterest} Insurance.\nCan you beat my score?`
      : `Namaste! Maine Bima Beast quiz khela.\nMode: ${currentModeName}\nMera score: ${percentScore}/100\nMera Quiz Code: ${generatedCode}\nMujhe ${leadInterest} Insurance ke baare mein jaanna hai.\nKya aap beat kar sakte ho?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }, [userScore, currentQuestions.length, currentModeName, generatedCode, leadInterest]);

  // ── Copy Code ────────────────────────────────────────────────
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = generatedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  }, [generatedCode]);

  // currentQuestions already has shuffled options (shuffled once in startQuiz)
  const currentQ = currentQuestions[currentIndex];
  const percentScore = currentQuestions.length > 0 ? Math.round((userScore / currentQuestions.length) * 100) : 0;
  const progress = currentQuestions.length > 0 ? ((currentIndex + (phase === 'result' || phase === 'leadForm' || phase === 'review' ? 1 : 0)) / currentQuestions.length) * 100 : 0;

  // ── Score Badge ──
  const getScoreBadge = () => {
    if (percentScore < 40) return { icon: 'beginner', title: isHindi ? 'इंश्योरेंस बिगिनर' : isEnglish ? 'Insurance Beginner' : 'Insurance Beginner', color: 'bg-[#B8482C]' };
    if (percentScore < 61) return { icon: 'aware', title: isHindi ? 'इंश्योरेंस अवेयर' : isEnglish ? 'Insurance Aware' : 'Insurance Aware', color: 'bg-[#8B3520]' };
    if (percentScore < 81) return { icon: 'smart', title: isHindi ? 'इंश्योरेंस स्मार्ट' : isEnglish ? 'Insurance Smart' : 'Insurance Smart', color: 'bg-[#1B4D4A]' };
    return { icon: 'pro', title: isHindi ? 'इंश्योरेंस प्रो' : isEnglish ? 'Insurance Pro' : 'Insurance Pro', color: 'bg-[#0E1116]' };
  };

  const scoreBadge = getScoreBadge();
  const myntra = DEFAULT_DEALS.myntra;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section
      id="insurance-beast-quiz"
      dir="ltr"
      className="relative py-24 overflow-hidden scroll-mt-16 bg-[#FAF7F2]"
    >
      {/* Background */}
      <div className="absolute inset-0" />
      <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-[#F4E5DD]/40 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-[#E6EFEE]/40 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* MODE SELECT SCREEN                                         */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {phase === 'modeSelect' && (
            <motion.div
              key="modeSelect"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Animated Beast Icon */}
              <motion.div
                className="mb-8 inline-block"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#0E1116] flex items-center justify-center shadow-2xl shadow-[#0E1116]/30 mx-auto">
                  <Shield className="w-14 h-14 sm:w-18 sm:h-18 text-[#FAF7F2]" />
                </div>
              </motion.div>

              <Badge className="mb-4 bg-[#F4E5DD] text-[#8B3520] border border-[#B8482C]/30 rounded-full px-4 py-1 text-sm text-caption-premium">
                <Zap className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'बीमा बीस्ट – इंश्योरेंस IQ टेस्ट' : isEnglish ? 'Bima Beast – Insurance IQ Test' : 'Bima Beast – Insurance IQ Test'}
              </Badge>

              <h2 className="text-display-h1 text-[#0E1116] mt-2">
                {isHindi ? 'इंश्योरेंस' : 'Insurance'}{' '}
                <span className="text-accent-gradient">
                  Beast
                </span>{' '}
                {isHindi ? 'क्विज़' : 'Quiz'}
              </h2>

              <p className="mt-4 text-lead-premium text-[#4A4F57]">
                {isHindi ? 'अपना इंश्योरेंस IQ टेस्ट करो' : isEnglish ? 'Test Your Insurance IQ' : 'Apna Insurance IQ Test Karo'}
              </p>

              <motion.div
                className="mt-8 space-y-3 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => startQuiz('singleMix')}
                    size="lg"
                    className="btn-stripe w-full justify-center h-12 px-8 text-base shadow-lg hover:bg-[#B8482C]"
                  >
                    <Zap className="w-4 h-4" /> {isHindi ? 'सिंगल मिक्स (5 सवाल – तेज़)' : isEnglish ? 'Single Mix (5 Questions – Quick)' : 'Single Mix (5 Sawaal – Quick)'}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => startQuiz('fullMix')}
                    size="lg"
                    className="btn-stripe w-full justify-center h-12 px-8 text-base shadow-lg hover:bg-[#B8482C]"
                  >
                    <RotateCcw className="w-4 h-4" /> {isHindi ? 'फुल मिक्स (10 सवाल)' : isEnglish ? 'Full Mix (10 Questions)' : 'Full Mix (10 Sawaal)'}
                  </Button>
                </motion.div>

                {/* Category Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {[
                    { mode: 'categoryHealth' as QuizMode, icon: Heart, label: isHindi ? 'हेल्थ ओनली (8)' : isEnglish ? 'Health Only (8)' : 'Health (8)' },
                    { mode: 'categoryMotor' as QuizMode, icon: Car, label: isHindi ? 'मोटर ओनली (8)' : isEnglish ? 'Motor Only (8)' : 'Motor (8)' },
                    { mode: 'categoryLife' as QuizMode, icon: ShieldCheck, label: isHindi ? 'लाइफ ओनली (8)' : isEnglish ? 'Life Only (8)' : 'Life (8)' },
                    { mode: 'categoryHome' as QuizMode, icon: HomeIcon, label: isHindi ? 'होम ओनली (8)' : isEnglish ? 'Home Only (8)' : 'Home (8)' },
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                    <motion.button
                      key={cat.mode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startQuiz(cat.mode)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(14,17,22,0.08)] bg-white text-[#0E1116] text-sm font-medium hover:bg-[#F4E5DD] hover:border-[#B8482C] transition-all duration-200"
                    >
                      <CatIcon className="w-4 h-4" />
                      {cat.label}
                    </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Badges display */}
              {earnedBadges.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-[#8B9099] font-medium flex items-center gap-1"><Trophy className="w-3 h-3" /> {isHindi ? 'आपके बैज:' : isEnglish ? 'Your Badges:' : 'Aapke Badges:'}</span>
                  {earnedBadges.map((badge, i) => (
                    <Badge key={i} className="bg-[#F4E5DD] text-[#8B3520] border border-[#B8482C]/30 rounded-full px-2.5 py-0.5 text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* QUIZ SCREEN                                                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {phase === 'quiz' && currentQ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-[#8B9099] mb-2">
                  <span>{isHindi ? `सवाल ${currentIndex + 1} / ${currentQuestions.length}` : isEnglish ? `Question ${currentIndex + 1} / ${currentQuestions.length}` : `Sawaal ${currentIndex + 1} / ${currentQuestions.length}`}</span>
                  <span>{Math.round(progress)}% {isHindi ? 'पूरा' : isEnglish ? 'complete' : 'poora'}</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#B8482C] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`q-${currentIndex}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border border-[rgba(14,17,22,0.08)] rounded-2xl shadow-premium">
                    <CardContent className="pt-6 space-y-4">
                      {/* Question Header with Timer */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-8 rounded-full bg-[#F4E5DD] text-[#8B3520] flex items-center justify-center text-sm font-display font-medium shrink-0">
                              {currentIndex + 1}
                            </span>
                            <p className="text-[#0E1116] text-lg sm:text-xl font-display font-medium leading-snug">
                              {currentQ.text}
                            </p>
                          </div>
                          <Badge className="mt-1 bg-white text-[#8B9099] border border-[rgba(14,17,22,0.08)] rounded-full text-[10px]">
                            {currentQ.category === 'health' ? <Heart className="w-3 h-3 mr-1" /> :
                             currentQ.category === 'motor' ? <Car className="w-3 h-3 mr-1" /> :
                             currentQ.category === 'life' ? <ShieldCheck className="w-3 h-3 mr-1" /> :
                             currentQ.category === 'home' ? <HomeIcon className="w-3 h-3 mr-1" /> : <BookOpen className="w-3 h-3 mr-1" />}
                            {currentQ.category === 'health' ? 'Health' :
                             currentQ.category === 'motor' ? 'Motor' :
                             currentQ.category === 'life' ? 'Life' :
                             currentQ.category === 'home' ? 'Home' : 'General'}
                          </Badge>
                        </div>
                        {/* Circular Timer */}
                        <div className="shrink-0">
                          <CircularTimer timeLeft={timeLeft} maxTime={TIMER_DURATION} />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-3 mt-4">
                        {currentQ.options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrectOption = idx === currentQ.correct;
                          const showCorrect = showAnswerFeedback && isCorrectOption;
                          const showWrong = showAnswerFeedback && isSelected && !isCorrectOption;

                          return (
                            <motion.button
                              key={`${option}-${idx}`}
                              whileHover={selectedOption === null ? { scale: 1.015 } : {}}
                              whileTap={selectedOption === null ? { scale: 0.985 } : {}}
                              onClick={() => handleAnswer(idx)}
                              disabled={selectedOption !== null}
                              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 min-h-[48px] ${
                                showCorrect
                                  ? 'border-[#1B4D4A] bg-[#E6EFEE] text-[#0E1116]'
                                  : showWrong
                                  ? 'border-[#9B2C2C] bg-[#9B2C2C]/10 text-[#0E1116]'
                                  : isSelected
                                  ? 'bg-[#F4E5DD] border-[#B8482C] text-[#8B3520]'
                                  : 'border-[rgba(14,17,22,0.08)] bg-white text-[#0E1116] hover:border-[#0E1116]'
                              } ${selectedOption !== null && !isSelected && !showCorrect ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-display font-medium shrink-0 ${
                                  showCorrect ? 'border-[#1B4D4A] text-[#1B4D4A]' :
                                  showWrong ? 'border-[#9B2C2C] text-[#9B2C2C]' :
                                  'border-[rgba(14,17,22,0.08)]'
                                }`}>
                                  {showCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                                   showWrong ? <XCircle className="w-4 h-4" /> :
                                   String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-sm font-medium">{option}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Answer feedback */}
                      {showAnswerFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-center text-sm font-medium py-2 px-4 rounded-xl ${
                            selectedOption !== null && currentQ && selectedOption === currentQ.correct
                              ? 'bg-[#E6EFEE] text-[#1B4D4A]'
                              : 'bg-[#9B2C2C]/10 text-[#9B2C2C]'
                          }`}
                        >
                          {selectedOption !== null && currentQ && selectedOption === currentQ.correct
                            ? <span className="flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> {isHindi ? 'सही जवाब! बहुत अच्छे!' : isEnglish ? 'Correct! Well done!' : 'Sahi jawaab! Well done!'}</span>
                            : <span className="flex items-center justify-center gap-1"><XCircle className="w-4 h-4" /> {isHindi ? `गलत! सही जवाब: ${currentQ.options[currentQ.correct]}` : isEnglish ? `Wrong! Correct answer: ${currentQ.options[currentQ.correct]}` : `Galat! Sahi jawaab: ${currentQ.options[currentQ.correct]}`}</span>}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Question dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {currentQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i < currentIndex
                        ? userAnswers[i]?.isCorrect ? 'bg-[#1B4D4A]' : 'bg-[#9B2C2C]'
                        : i === currentIndex
                        ? 'bg-[#B8482C]/60 scale-125'
                        : 'bg-[rgba(14,17,22,0.08)]'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEAD CAPTURE SCREEN                                         */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {phase === 'leadForm' && (
            <motion.div
              key="leadForm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="bg-white border border-[rgba(14,17,22,0.08)] rounded-2xl shadow-premium">
                <CardContent className="pt-8 pb-8 space-y-6">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#F4E5DD] border border-[#B8482C]/30 flex items-center justify-center mx-auto">
                      <Trophy className="w-10 h-10 text-[#B8482C]" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#0E1116]">
                      {isHindi ? 'क्विज़ पूरा!' : isEnglish ? 'Quiz Complete!' : 'Quiz Complete!'}
                    </h3>
                    <p className="mt-2 text-[#8B9099]">
                      {isHindi ? 'स्कोर देखने के लिए जानकारी भरें' : isEnglish ? 'Fill in your info to see your score' : 'Score dekhne ke liye info bharein'}
                    </p>
                  </motion.div>

                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4 max-w-sm mx-auto"
                  >
                    <div className="space-y-2 text-left">
                      <label className="text-sm text-[#8B9099] font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {isHindi ? 'पूरा नाम *' : isEnglish ? 'Full Name *' : 'Poora Naam *'}
                      </label>
                      <Input
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder={isHindi ? 'अपना नाम डालो' : isEnglish ? 'Enter your name' : 'Apna naam daalo'}
                        className="bg-white border-[rgba(14,17,22,0.08)] text-[#0E1116] placeholder:text-[#8B9099] focus-visible:border-[#B8482C] focus-visible:ring-[#B8482C]/30 h-11"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm text-[#8B9099] font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {isHindi ? 'शहर *' : isEnglish ? 'City *' : 'Sheher *'}
                      </label>
                      <Input
                        value={leadCity}
                        onChange={(e) => setLeadCity(e.target.value)}
                        placeholder={isHindi ? 'अपना शहर डालो' : isEnglish ? 'Enter your city' : 'Apna sheher daalo'}
                        className="bg-white border-[rgba(14,17,22,0.08)] text-[#0E1116] placeholder:text-[#8B9099] focus-visible:border-[#B8482C] focus-visible:ring-[#B8482C]/30 h-11"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm text-[#8B9099] font-medium flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        {isHindi ? 'इंश्योरेंस में दिलचस्पी' : isEnglish ? 'Insurance Interest' : 'Insurance Interest'}
                      </label>
                      <select
                        value={leadInterest}
                        onChange={(e) => setLeadInterest(e.target.value)}
                        className="w-full h-11 rounded-xl bg-white border border-[rgba(14,17,22,0.08)] text-[#0E1116] px-3 text-sm focus:outline-none focus:border-[#B8482C]"
                      >
                        <option value="Health">{isHindi ? 'हेल्थ इंश्योरेंस' : 'Health Insurance'}</option>
                        <option value="Motor">{isHindi ? 'मोटर इंश्योरेंस' : 'Motor Insurance'}</option>
                        <option value="Life">{isHindi ? 'लाइफ इंश्योरेंस' : 'Life Insurance'}</option>
                        <option value="Home">{isHindi ? 'होम इंश्योरेंस' : 'Home Insurance'}</option>
                        <option value="Not sure">{isHindi ? 'पता नहीं' : isEnglish ? 'Not sure' : 'Pata nahi'}</option>
                      </select>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleLeadSubmit}
                        className="btn-stripe w-full justify-center h-11 text-base shadow-lg hover:bg-[#B8482C]"
                      >
                        {isHindi ? 'स्कोर देखो' : isEnglish ? 'See Score' : 'Score Dekho'} <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  <p className="text-xs text-[#8B9099]">
                    <Shield className="w-3 h-3 inline mr-1" /> {isHindi ? 'आपका डेटा सुरक्षित है। कोई स्पैम नहीं।' : isEnglish ? 'Your data is safe. No spam.' : 'Aapka data safe hai. Koi spam nahi.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RESULTS SCREEN                                              */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="bg-white border border-[rgba(14,17,22,0.08)] rounded-2xl shadow-premium">
                <CardContent className="pt-8 pb-8 space-y-6 text-center">
                  {/* Score Display */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#B8482C]/30 flex items-center justify-center relative overflow-hidden mx-auto">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentScore}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#B8482C]/20 to-transparent"
                      />
                      <div className="relative z-10">
                        <p className="text-4xl sm:text-5xl font-display font-medium text-[#0E1116] tabular-nums">{percentScore}</p>
                        <p className="text-xs text-[#8B9099]">/ 100</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Badge className={`${scoreBadge.color} text-[#FAF7F2] border-0 rounded-full px-4 py-1 text-sm font-semibold`}>
                      {scoreBadge.title}
                    </Badge>

                    <p className="mt-3 text-base sm:text-lg font-medium text-[#4A4F57]">
                      {isHindi ? `${currentModeName} में आपका स्कोर: ${userScore}/${currentQuestions.length} सही` : isEnglish ? `Your score in ${currentModeName}: ${userScore}/${currentQuestions.length} correct` : `${currentModeName} mein aapka score: ${userScore}/${currentQuestions.length} sahi`}
                    </p>
                  </motion.div>

                  {/* Score Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-xs mx-auto"
                  >
                    <Progress value={percentScore} className="h-3 bg-border" />
                  </motion.div>

                  {/* Badges earned */}
                  {earnedBadges.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="flex flex-wrap justify-center gap-2"
                    >
                      <span className="text-xs text-[#8B9099] w-full flex items-center justify-center gap-1"><Trophy className="w-3 h-3" /> {isHindi ? 'आपके बैज:' : isEnglish ? 'Your Badges:' : 'Aapke Badges:'}</span>
                      {earnedBadges.map((badge, i) => (
                        <Badge key={i} className="bg-[#F4E5DD] text-[#8B3520] border border-[#B8482C]/30 rounded-full px-2.5 py-0.5 text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </motion.div>
                  )}

                  {/* Unique Quiz Code */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white/80 rounded-2xl p-4 max-w-sm mx-auto border border-[rgba(14,17,22,0.08)]"
                  >
                    <p className="text-xs text-[#8B9099] mb-1"><BookOpen className="w-3 h-3 inline mr-1" /> {isHindi ? 'यूनिक क्विज़ कोड' : isEnglish ? 'Unique Quiz Code' : 'Quiz Code'}</p>
                    <p className="text-xl font-mono font-medium text-[#B8482C] tabular-nums">{generatedCode}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Button
                        onClick={handleCopyCode}
                        size="sm"
                        variant="outline"
                        className="border-[#B8482C]/30 text-[#B8482C] hover:bg-[#F4E5DD] rounded-full gap-1 text-xs"
                      >
                        {codeCopied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {codeCopied ? (isHindi ? 'कॉपी हुआ!' : isEnglish ? 'Copied!' : 'Copied!') : (isHindi ? 'कोड कॉपी करो' : isEnglish ? 'Copy Code' : 'Copy Code')}
                      </Button>
                    </div>
                    <p className="text-[10px] text-[#8B9099] mt-2">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {isHindi ? 'तब तक मान्य:' : 'Valid till:'} {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </p>
                  </motion.div>

                  {/* Answer Review Toggle */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Button
                      onClick={() => setPhase('review')}
                      variant="outline"
                      className="border-[rgba(14,17,22,0.08)] text-[#0E1116] hover:bg-[#F4E5DD] hover:text-[#0E1116] rounded-full gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      {isHindi ? 'जवाब देखें' : isEnglish ? 'Review Answers' : 'Review Answers'}
                    </Button>
                  </motion.div>

                  {/* Retake Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                      className="border-[rgba(14,17,22,0.08)] text-[#0E1116] hover:bg-[#F4E5DD] hover:text-[#0E1116] rounded-full gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {isHindi ? 'फिर से खेलो' : isEnglish ? 'Play Again' : 'Phir Se Khelo'}
                    </Button>
                  </motion.div>

                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* AFFILIATE DEALS — At the VERY END, after all results       */}
              {/* ═══════════════════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-4"
              >
                {/* Exclusive Deals Header */}
                <div className="text-center">
                  <h3 className="text-2xl font-display font-medium text-[#0E1116] flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#B8482C]" /> {isHindi ? 'आपके लिए खास ऑफ़र!' : isEnglish ? 'Special Offers For You!' : 'Special Offers For You!'}</h3>
                  <p className="text-[#8B9099] text-sm mt-1">{isHindi ? 'क्विज़ पूरा — इन खास डील्स का मज़ा लो!' : isEnglish ? 'Quiz complete — enjoy these exclusive deals!' : 'Quiz poora — in deals ka maza lo!'}</p>
                </div>

                {/* Myntra Deal */}
                <Card className={`bg-white border border-[rgba(14,17,22,0.08)] rounded-2xl overflow-hidden border-l-4 ${myntra.borderColor}`}>
                  <CardContent className="p-5">
                    <h4 className="text-[#0E1116] font-display font-medium text-base">{myntra.title}</h4>
                    <p className="text-[#B8482C] font-semibold text-sm mt-1">{myntra.offer}</p>
                    <p className="text-[#8B9099] text-xs mt-2">{myntra.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <a href={myntra.link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className={`${myntra.btnBg} text-white rounded-full gap-1 text-xs`}>
                          {myntra.buttonText} <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    </div>
                    <p className="text-[10px] text-[#8B9099] mt-2">{myntra.commission}</p>
                  </CardContent>
                </Card>

                {/* WhatsApp Share */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleWhatsAppShare}
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full h-12 text-base font-semibold gap-2 shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    {isHindi ? 'WhatsApp पर शेयर करें' : isEnglish ? 'Share on WhatsApp' : 'WhatsApp par share karein'}
                  </Button>
                </motion.div>
              </motion.div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* ANSWER REVIEW SCREEN                                        */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {phase === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-display font-medium text-[#0E1116] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#B8482C]" /> {isHindi ? 'जवाब रिव्यू' : isEnglish ? 'Answer Review' : 'Jawab Review'}</h3>
                <Button
                  onClick={() => setPhase('result')}
                  variant="outline"
                  className="border-[rgba(14,17,22,0.08)] text-[#8B9099] hover:bg-[#F4E5DD] hover:text-[#0E1116] rounded-full gap-2 text-sm"
                >
                  ← {isHindi ? 'परिणामों पर वापस' : isEnglish ? 'Back to Results' : 'Results par wapas'}
                </Button>
              </div>

              {userAnswers.map((answer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`border-l-4 ${answer.isCorrect ? 'border-l-[#1B4D4A] bg-[#E6EFEE]/40' : 'border-l-[#9B2C2C] bg-[#9B2C2C]/5'} border border-[rgba(14,17,22,0.08)] rounded-2xl`}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-medium shrink-0 ${
                          answer.isCorrect ? 'bg-[#E6EFEE] text-[#1B4D4A]' : 'bg-[#9B2C2C]/10 text-[#9B2C2C]'
                        }`}>
                          {answer.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </span>
                        <p className="text-[#0E1116] text-sm font-medium">{answer.qText}</p>
                      </div>
                      <div className="ml-8 space-y-1">
                        <p className={`text-xs ${answer.isCorrect ? 'text-[#1B4D4A]' : 'text-[#9B2C2C]'}`}>
                          {isHindi ? 'आपका जवाब' : isEnglish ? 'Your answer' : 'Your answer'}: {answer.selected}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-xs text-[#1B4D4A]">
                            {isHindi ? 'सही जवाब' : isEnglish ? 'Correct answer' : 'Correct answer'}: {answer.correctAns}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Button
                onClick={() => setPhase('result')}
                className="btn-stripe w-full justify-center h-11 text-base shadow-lg mt-4 hover:bg-[#B8482C]"
              >
                ← {isHindi ? 'परिणामों पर वापस' : isEnglish ? 'Back to Results' : 'Back to Results'}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#8B9099] mt-8">
          <Zap className="w-3 h-3 inline" /> {isHindi ? 'केवल शैक्षिक क्विज़। कोई कैशबैक नहीं। एफ़िलिएट डील्स तीसरे पक्ष की हैं।' : isEnglish ? 'Educational quiz only. No cashback. Affiliate deals are from third parties.' : 'Educational quiz only. No cashback. Affiliate deals are from third parties.'}
        </p>
      </div>
    </section>
  );
}
