'use client';

import Link from 'next/link';
import {
  Cookie, Lock, BarChart3, Settings, Globe, Shield, Phone,
  ChevronRight, Mail, MapPin, MessageCircle, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY_800 = '#0A1330';
const NAVY_600 = '#162D5A';
const GOLD = '#C98A1C';

/* ── Translation type ──────────────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

/* ── Inline page text ──────────────────────────────────────────────────── */
const pageText = {
  hero: {
    title: { en: 'Cookie Policy', hi: 'कुकी नीति', hinglish: 'Cookie Policy' },
    subtitle: { en: 'This policy explains how Paliwal Secure AI uses cookies and similar technologies to improve your browsing experience and analyze platform usage.', hi: 'यह नीति बताती है कि Paliwal Secure AI कुकीज़ और समान तकनीकों का उपयोग कैसे करता है ताकि आपका ब्राउज़िंग अनुभव बेहतर हो सके और प्लेटफ़ॉर्म उपयोग का विश्लेषण किया जा सके।', hinglish: 'Yeh policy batati hai ki Paliwal Secure AI cookies aur similar technologies ka use kaise karta hai taaki aapka browsing experience better ho aur platform usage analyze kiya ja sake.' },
    lastUpdated: { en: 'Last Updated: March 2025', hi: 'अंतिम अपडेट: मार्च 2025', hinglish: 'Last Updated: March 2025' },
  },
  toc: { en: 'Table of Contents', hi: 'विषय सूची', hinglish: 'Table of Contents' },
  sections: [
    {
      heading: { en: '1. Cookies Kya Hain (What Are Cookies)', hi: '1. कुकीज़ क्या हैं', hinglish: '1. Cookies Kya Hain' },
      items: [
        { title: { en: 'What are Cookies?', hi: 'कुकीज़ क्या हैं?', hinglish: 'Cookies Kya Hain?' }, desc: { en: 'Cookies are small text files that are saved in your browser when you visit a website. They help the website remember your preferences and work better for you.', hi: 'कुकीज़ छोटी टेक्स्ट फ़ाइलें हैं जो आपके ब्राउज़र में सहेजी जाती हैं जब आप किसी वेबसाइट पर जाते हैं। वे वेबसाइट को आपकी प्राथमिकताएं याद रखने और बेहतर काम करने में मदद करती हैं।', hinglish: 'Cookies chhoti text files hain jo aapke browser mein save hoti hain jab aap kisi website pe jaate hain. Woh website ko aapki preferences yaad rakhne aur better kaam karne mein madad karti hain.' } },
        { title: { en: 'Why We Use Cookies', hi: 'हम कुकीज़ का उपयोग क्यों करते हैं', hinglish: 'Hum Cookies Kyun Use Karte Hain' }, desc: { en: 'We use cookies to keep you logged in, understand how you use our platform, remember your language preference, and improve your overall experience.', hi: 'हम कुकीज़ का उपयोग आपको लॉग इन रखने, आपके प्लेटफ़ॉर्म उपयोग को समझने, आपकी भाषा वरीयता याद रखने, और आपके समग्र अनुभव को बेहतर बनाने के लिए करते हैं।', hinglish: 'Hum cookies ka use aapko logged in rakhne, aapke platform use ko samajhne, aapki language preference yaad rakhne, aur aapke overall experience ko better banane ke liye karte hain.' } },
      ],
    },
    {
      heading: { en: '2. Zaroori Cookies (Essential)', hi: '2. ज़रूरी कुकीज़ (आवश्यक)', hinglish: '2. Zaroori Cookies (Essential)' },
      items: [
        { title: { en: 'Login Session (Firebase Auth)', hi: 'लॉगिन सेशन (Firebase Auth)', hinglish: 'Login Session (Firebase Auth)' }, desc: { en: 'These cookies keep you signed in to your account securely. Without them, you would need to log in again on every page.', hi: 'ये कुकीज़ आपको अपने खाते में सुरक्षित रूप से साइन इन रखती हैं। इनके बिना, आपको हर पेज पर फिर से लॉग इन करना होगा।', hinglish: 'Yeh cookies aapko apne account mein securely signed in rakhti hain. Inke bina, aapko har page pe phir se login karna hoga.' } },
        { title: { en: 'Website Security', hi: 'वेबसाइट सुरक्षा', hinglish: 'Website Security' }, desc: { en: 'Cookies that protect against cross-site request forgery (CSRF) and other security threats.', hi: 'कुकीज़ जो क्रॉस-साइट रिक्वेस्ट फ़ोर्जरी (CSRF) और अन्य सुरक्षा खतरों से सुरक्षा करती हैं।', hinglish: 'Cookies jo cross-site request forgery (CSRF) aur other security threats se protect karti hain.' } },
        { title: { en: 'Cannot Disable', hi: 'अक्षम नहीं किया जा सकता', hinglish: 'Cannot Disable' }, desc: { en: 'These cookies are essential — if you disable them, the website will not function properly. Login, security, and core features will stop working.', hi: 'ये कुकीज़ आवश्यक हैं — यदि आप इन्हें अक्षम करते हैं, तो वेबसाइट ठीक से काम नहीं करेगी। लॉगिन, सुरक्षा, और मुख्य सुविधाएँ बंद हो जाएंगी।', hinglish: 'Yeh cookies essential hain — agar aap inhe disable karte hain, toh website properly kaam nahi karegi. Login, security, aur core features band ho jayenge.' } },
      ],
      important: { en: 'Essential cookies cannot be disabled — the website won\'t work without them.', hi: 'आवश्यक कुकीज़ को अक्षम नहीं किया जा सकता — इनके बिना वेबसाइट काम नहीं करेगी।', hinglish: 'Essential cookies disable nahi ki ja sakti — inke bina website kaam nahi karegi.' },
    },
    {
      heading: { en: '3. Analytics Cookies (Optional)', hi: '3. एनालिटिक्स कुकीज़ (वैकल्पिक)', hinglish: '3. Analytics Cookies (Optional)' },
      items: [
        { title: { en: 'Visit Tracking', hi: 'विज़िट ट्रैकिंग', hinglish: 'Kitne Log Visit Karte Hain' }, desc: { en: 'We track how many users visit our platform, which helps us understand platform popularity and plan improvements.', hi: 'हम ट्रैक करते हैं कि कितने उपयोगकर्ता हमारे प्लेटफ़ॉर्म पर आते हैं, जो हमें प्लेटफ़ॉर्म की लोकप्रियता समझने और सुधार योजना बनाने में मदद करता है।', hinglish: 'Hum track karte hain ki kitne users hamare platform pe aate hain, jo humein platform popularity samajhne aur improvements plan karne mein madad karta hai.' } },
        { title: { en: 'Popular Pages', hi: 'लोकप्रिय पृष्ठ', hinglish: 'Konse Pages Popular' }, desc: { en: 'We analyze which pages are most visited so we can improve content and navigation.', hi: 'हम विश्लेषण करते हैं कि कौन से पृष्ठ सबसे अधिक देखे जाते हैं ताकि हम सामग्री और नेविगेशन में सुधार कर सकें।', hinglish: 'Hum analyze karte hain ki kaun se pages sabse zyada visit hote hain taaki hum content aur navigation improve kar sakein.' } },
        { title: { en: 'Anonymous Data Only', hi: 'केवल गुमनाम डेटा', hinglish: 'Anonymous Data — No Personal Info' }, desc: { en: 'All analytics data is anonymized — we never collect personal information through analytics cookies.', hi: 'सभी एनालिटिक्स डेटा गुमनाम है — हम एनालिटिक्स कुकीज़ के माध्यम से कभी व्यक्तिगत जानकारी एकत्र नहीं करते।', hinglish: 'Saara analytics data anonymized hai — hum analytics cookies ke through kabhi personal info collect nahi karte.' } },
      ],
    },
    {
      heading: { en: '4. Preference Cookies', hi: '4. प्राथमिकता कुकीज़', hinglish: '4. Preference Cookies' },
      items: [
        { title: { en: 'Language Preference', hi: 'भाषा वरीयता', hinglish: 'Language Preference' }, desc: { en: 'Remembers your selected language (English / Hindi / Hinglish) so the platform loads in your preferred language every time.', hi: 'आपकी चयनित भाषा (अंग्रेज़ी / हिंदी / हिंग्लिश) याद रखता है ताकि प्लेटफ़ॉर्म हर बार आपकी पसंदीदा भाषा में लोड हो।', hinglish: 'Aapki selected language (English / Hindi / Hinglish) yaad rakhta hai taaki platform har baar aapki preferred language mein load ho.' } },
        { title: { en: 'Dark / Light Mode Setting', hi: 'डार्क / लाइट मोड सेटिंग', hinglish: 'Dark / Light Mode Setting' }, desc: { en: 'Saves your theme preference so the platform always appears in your chosen mode.', hi: 'आपकी थीम प्राथमिकता सहेजता है ताकि प्लेटफ़ॉर्म हमेशा आपके चुने हुए मोड में दिखे।', hinglish: 'Aapki theme preference save karta hai taaki platform hamesha aapke chosen mode mein dikhe.' } },
        { title: { en: 'Insurance Category Preference', hi: 'बीमा श्रेणी वरीयता', hinglish: 'Insurance Category Preference' }, desc: { en: 'Remembers your preferred insurance categories (health, life, motor, etc.) for personalized recommendations.', hi: 'व्यक्तिगत सिफारिशों के लिए आपकी पसंदीदा बीमा श्रेणियों (स्वास्थ्य, जीवन, मोटर, आदि) को याद रखता है।', hinglish: 'Personalized recommendations ke liye aapki preferred insurance categories (health, life, motor, etc.) ko yaad rakhta hai.' } },
      ],
    },
    {
      heading: { en: '5. Third-Party Cookies', hi: '5. तृतीय-पक्ष कुकीज़', hinglish: '5. Third-Party Cookies' },
      items: [
        { title: { en: 'Firebase Auth Cookies', hi: 'Firebase Auth कुकीज़', hinglish: 'Firebase Auth Cookies' }, desc: { en: 'Used by Google Firebase for authentication. These are essential for login functionality and session management.', hi: 'प्रमाणीकरण के लिए Google Firebase द्वारा उपयोग किए जाते हैं। ये लॉगिन कार्यक्षमता और सेशन प्रबंधन के लिए आवश्यक हैं।', hinglish: 'Google Firebase dwara authentication ke liye use kiye jaate hain. Yeh login functionality aur session management ke liye essential hain.' } },
        { title: { en: 'Vercel Analytics', hi: 'Vercel एनालिटिक्स', hinglish: 'Vercel Analytics' }, desc: { en: 'Used by Vercel (our hosting platform) to collect performance and usage analytics. Data is anonymized and aggregated.', hi: 'Vercel (हमारे होस्टिंग प्लेटफ़ॉर्म) द्वारा प्रदर्शन और उपयोग एनालिटिक्स एकत्र करने के लिए उपयोग किया जाता है। डेटा गुमनाम और एकत्रित है।', hinglish: 'Vercel (hamara hosting platform) dwara performance aur usage analytics collect karne ke liye use kiya jata hai. Data anonymized aur aggregated hai.' } },
        { title: { en: 'Google Analytics (If Enabled)', hi: 'Google Analytics (यदि सक्षम)', hinglish: 'Google Analytics (If Enabled)' }, desc: { en: 'We may enable Google Analytics for deeper usage insights. When active, it uses cookies to track page visits, user flow, and engagement metrics — all anonymized.', hi: 'हम गहन उपयोग अंतर्दृष्टि के लिए Google Analytics सक्षम कर सकते हैं। सक्रिय होने पर, यह पृष्ठ विज़िट, उपयोगकर्ता प्रवाह, और जुड़ाव मेट्रिक्स को ट्रैक करने के लिए कुकीज़ का उपयोग करता है — सभी गुमनाम।', hinglish: 'Hum deeper usage insights ke liye Google Analytics enable kar sakte hain. Jab active hota hai, yeh page visits, user flow, aur engagement metrics track karne ke liye cookies use karta hai — sab anonymized.' } },
      ],
    },
    {
      heading: { en: '6. Cookies Kaise Band Karein (How to Disable Cookies)', hi: '6. कुकीज़ कैसे बंद करें', hinglish: '6. Cookies Kaise Band Karein' },
      items: [
        { title: { en: 'Google Chrome', hi: 'Google Chrome', hinglish: 'Chrome' }, desc: { en: 'Go to Settings → Privacy and Security → Cookies and other site data. Choose "Block all cookies" or manage per-site.', hi: 'Settings → Privacy and Security → Cookies and other site data पर जाएं। "Block all cookies" चुनें या प्रति-साइट प्रबंधित करें।', hinglish: 'Settings → Privacy and Security → Cookies and other site data pe jayein. "Block all cookies" choose karein ya per-site manage karein.' } },
        { title: { en: 'Mozilla Firefox', hi: 'Mozilla Firefox', hinglish: 'Firefox' }, desc: { en: 'Go to Settings → Privacy & Security → Cookies and Site Data. Select "Block cookies and site data" or customize.', hi: 'Settings → Privacy & Security → Cookies and Site Data पर जाएं। "Block cookies and site data" चुनें या अनुकूलित करें।', hinglish: 'Settings → Privacy & Security → Cookies and Site Data pe jayein. "Block cookies and site data" select karein ya customize karein.' } },
        { title: { en: 'Apple Safari', hi: 'Apple Safari', hinglish: 'Safari' }, desc: { en: 'Go to Preferences → Privacy → Manage Website Data. Block cookies or remove stored data.', hi: 'Preferences → Privacy → Manage Website Data पर जाएं। कुकीज़ ब्लॉक करें या संग्रहीत डेटा हटाएं।', hinglish: 'Preferences → Privacy → Manage Website Data pe jayein. Cookies block karein ya stored data remove karein.' } },
      ],
      important: { en: 'Warning: Disabling essential cookies will break login and core functionality. Only non-essential (analytics/preference) cookies should be disabled.', hi: 'चेतावनी: आवश्यक कुकीज़ को अक्षम करने से लॉगिन और मुख्य कार्यक्षमता टूट जाएगी। केवल गैर-आवश्यक (एनालिटिक्स/प्राथमिकता) कुकीज़ को अक्षम किया जाना चाहिए।', hinglish: 'Warning: Essential cookies band karne se login aur core functionality kaam nahi karega. Sirf non-essential (analytics/preference) cookies disable karne chahiye.' },
    },
    {
      heading: { en: '7. Contact', hi: '7. संपर्क', hinglish: '7. Contact' },
      intro: { en: 'If you have questions about our cookie practices, contact us:', hi: 'यदि आपको हमारी कुकीज़ प्रथाओं के बारे में प्रश्न हैं, तो हमसे संपर्क करें:', hinglish: 'Agar aapko hamari cookie practices ke baare mein questions hain, toh humse contact karein:' },
    },
  ],
  cta: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
  },
};

/* ── Section Icons mapping ─────────────────────────────────────────────── */
const sectionIcons = [Cookie, Lock, BarChart3, Settings, Globe, Shield, Phone];

/* ── Section Divider ─────────────────────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

export default function CookiePolicyClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  return (
    <>
      {/* ═══════════════════ PAGE HEADER ═══════════════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, ${NAVY_800} 0%, ${NAVY_600} 50%, #082247 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{pt(pageText.hero.title)}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {pt(pageText.hero.title)}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-4">
            {pt(pageText.hero.subtitle)}
          </p>
          <p className="text-xs font-medium text-white/50">
            {pt(pageText.hero.lastUpdated)}
          </p>
        </div>
      </section>

      {/* ═══════════════════ MAIN CONTENT + SIDEBAR ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Table of Contents */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="glass-card p-5" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Cookie className="w-4 h-4" style={{ color: GOLD }} /> {pt(pageText.toc)}
                </h3>
                <nav className="space-y-1">
                  {pageText.sections.map((s, i) => (
                    <a key={i} href={`#section-${i}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors group">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 group-hover:text-white transition-colors"
                        style={{ background: 'rgba(201,138,28,0.1)', color: GOLD }}
                      >
                        {i + 1}
                      </span>
                      <span className="truncate">{pt(s.heading)}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content Sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {pageText.sections.map((section, sIdx) => {
              const SIcon = sectionIcons[sIdx];
              return (
                <div key={sIdx} id={`section-${sIdx}`} className="glass-card p-6 sm:p-8 scroll-mt-24 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300" style={{ border: '1px solid rgba(201,138,28,0.12)' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${NAVY_800}, ${NAVY_600})` }}>
                      <SIcon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{pt(section.heading)}</h2>
                  </div>

                  {/* Items list */}
                  {'items' in section && section.items && (
                    <div className="space-y-3">
                      {'intro' in section && section.intro && (
                        <p className="text-sm text-white/60 mb-4">{pt(section.intro as Tr)}</p>
                      )}
                      {section.items.map((item: Record<string, Tr>, i: number) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.04)' }}>
                          {'title' in item && <h3 className="text-sm font-semibold text-white mb-1">{pt(item.title)}</h3>}
                          {'desc' in item && <p className="text-sm text-white/60">{pt(item.desc)}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Important notice */}
                  {'important' in section && (
                    <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                      <p className="text-sm font-semibold flex items-center gap-2 text-white">
                        <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} /> {pt(section.important as Tr)}
                      </p>
                    </div>
                  )}

                  {/* Contact section specifics */}
                  {sIdx === 6 && (
                    <>
                      <p className="text-sm text-white/60 mb-5">{pt(pageText.sections[6].intro as Tr)}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                          className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                          <h3 className="text-sm font-bold text-white">WhatsApp</h3>
                          <p className="text-xs" style={{ color: GOLD }}>+91 9257877312</p>
                        </a>
                        <a href="mailto:himanshupaliwalpbp@gmail.com"
                          className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md"
                          style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                          <Mail className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                          <h3 className="text-sm font-bold text-white">Email</h3>
                          <p className="text-xs" style={{ color: GOLD }}>himanshupaliwalpbp@gmail.com</p>
                        </a>
                        <div className="rounded-xl p-4 text-center"
                          style={{ background: 'rgba(201,138,28,0.06)', border: '1px solid rgba(201,138,28,0.15)' }}>
                          <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: GOLD }} />
                          <h3 className="text-sm font-bold text-white">Location</h3>
                          <p className="text-xs" style={{ color: GOLD }}>Kota, Rajasthan</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════ BACK TO HOME ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.backToHome)}</span>
            </ShinyButton>
          </Link>
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.chatLabel)}</span>
            </ShinyButton>
          </a>
        </div>
      </section>
    </>
  );
}
