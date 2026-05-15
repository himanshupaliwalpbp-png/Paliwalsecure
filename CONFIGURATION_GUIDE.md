# Paliwal Secure — Configuration & Setup Guide

## 📞 Mobile Number Change karna ho toh

Apna WhatsApp/Phone number change karne ke liye **3 files** edit karni hain:

### File 1: `src/app/page.tsx`
| Line | Current Value | Kya hai |
|------|--------------|---------|
| **336** | `wa.me/919999999999` | Navbar WhatsApp click |
| **1695** | `+91 99999 99999` | Contact section phone display |

**Search karke replace karein:**
- `919999999999` → apna number (jaise `919876543210`)
- `+91 99999 99999` → apna formatted number (jaise `+91 98765 43210`)

### File 2: `src/components/EmbeddedChatBot.tsx`
| Line | Current Value | Kya hai |
|------|--------------|---------|
| **459** | `tel:+919999999999` | Live Agent call link |
| **467** | `+91-9999-999-999` | Live Agent number display |
| **474** | `wa.me/919999999999` | WhatsApp escalation link |
| **484** | `wa.me/919999999999` | WhatsApp number display |
| **892** | `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER \|\| '919999999999'` | WhatsApp env variable |

**Search karke replace karein:**
- Sab jagah `919999999999` ko apne number se replace karein
- `+91-9999-999-999` ko apne formatted number se replace karein

### File 3: `.env.local` (Environment Variable — BEST METHOD)
```
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```
Yeh variable line 892 pe use hota hai. Agar yeh set hai toh code automatically yeh use karega.

---

## 📧 Email Change karna ho toh

### File 1: `src/app/page.tsx`
| Line | Current Value | Kya hai |
|------|--------------|---------|
| **1709** | `hello@paliwalsecure.com` | Contact section email display |

### File 2: `src/components/EmbeddedChatBot.tsx`
| Line | Current Value | Kya hai |
|------|--------------|---------|
| **491** | `mailto:support@paliwalsecure.com` | Email escalation link |
| **499** | `support@paliwalsecure.com` | Email display |
| **898** | `mailto:support@paliwalsecure.com` | Callback email link |

**Search karke replace karein:**
- `hello@paliwalsecure.com` → apna email
- `support@paliwalsecure.com` → apna support email

---

## 📍 Office Address Change karna ho toh

### File: `src/app/page.tsx`
| Line | Current Value | Kya hai |
|------|--------------|---------|
| **1721** | `New Delhi, India` | Contact section office address |

---

## 📊 Google Analytics Setup Karna

Analytics ke liye **code change ki zaroorat NAHI** hai! Sirf Admin Dashboard se setup karein:

### Step-by-Step:
1. **Google Analytics account banao**: https://analytics.google.com
2. **New property banao** → Website → `paliwalsecure.in`
3. **Measurement ID copy karo** (format: `G-XXXXXXXXXX`)
4. **Admin Dashboard pe jao**: https://your-domain.com/admin/dashboard/settings
5. **Login**: `admin@paliwalsecure.com` / `Admin@123`
6. **Settings page** pe **"Google Analytics"** section mein ID paste karein
7. **Save** click karein ✅

**Yeh automatic kaam karega:**
- Page views track hongi
- Button clicks track honge (Get Started, Calculate, WhatsApp, etc.)
- Chat interactions track honge
- Contact form submissions track honge

### Analytics Events (Already coded):
| Event | Kya track karta hai |
|-------|---------------------|
| `nav_click` | Navbar link clicks |
| `get_started` | "Get Started" button |
| `category_select` | Insurance category click |
| `calculator_use` | Premium calculate click |
| `whatsapp_click` | WhatsApp button click |
| `chat_message` | InsureGPT chat message |
| `contact_form` | Contact form submit |
| `onboarding` | Profile onboarding |
| `policy_upload` | Policy document upload |
| `review_vote` | Review helpful vote |

### Analytics Dashboard kahan dekhein:
- Admin Dashboard → **Analytics** tab
- Ya directly Google Analytics website pe

---

## 📄 Policy Document Upload — Kaise kaam karta hai

### User Flow:
1. User **"Analyze"** section pe jata hai (nav bar se)
2. **Drag & Drop** ya **Click** karke PDF upload karta hai (max 10MB)
3. "AI se Analyze Karein" button click karta hai
4. Backend pe PDF ka text extract hota hai (`pdf-parse` library)
5. Text **InsureGPT LLM** ko jaata hai → structured data nikalta hai
6. **Hinglish summary** generate hota hai
7. Result 3 steps mein dikhta hai:
   - **Step 1**: Upload
   - **Step 2**: AI Summary (insurer, premium, waiting periods, exclusions, missing benefits)
   - **Step 3**: Compare with Top 3 Plans (scoring engine se)

### Files involved:
| File | Purpose |
|------|---------|
| `src/components/PolicyUpload.tsx` | Drag & drop UI component |
| `src/components/PolicySummary.tsx` | AI summary display (6 sections) |
| `src/components/PolicyComparison.tsx` | Compare with top 3 plans |
| `src/components/PolicyAnalysisSection.tsx` | 3-step wizard (Upload → Summary → Compare) |
| `src/app/api/upload-policy/route.ts` | Backend API (PDF parse + LLM extract + DB store) |
| `src/lib/scoring-engine.ts` | Trust Score + Compatibility Score engine |
| `src/lib/insurance-data.ts` | 23 insurance plans data |

### Document Upload change karna ho toh:
- **Max file size**: `PolicyUpload.tsx` line 50 → `const MAX_FILE_SIZE = 10 * 1024 * 1024;`
- **Accepted formats**: `PolicyUpload.tsx` line 247-249 → `accept: { 'application/pdf': ['.pdf'] }`
- **Rate limit**: `src/lib/server-rate-limiter.ts` → `uploadRateLimiter.check(clientIp, 5, 60 * 1000)` (5 per minute)
- **LLM prompt**: `src/app/api/upload-policy/route.ts` line 194-224 → System prompt for extraction

---

## 🔐 Admin Login
- **URL**: `/admin/login`
- **Email**: `admin@paliwalsecure.com`
- **Password**: `Admin@123`
- **Change password**: Admin Dashboard → Settings → Change Password

---

## 🌐 Domain/URL Change karna ho toh

### File: `src/app/layout.tsx`
| Line | Current Value |
|------|--------------|
| **58** | `url: "https://paliwalsecure.in"` |

---

## Quick Reference — Search & Replace Table

| Kya change karna hai | Search keyword | Files |
|----------------------|----------------|-------|
| Mobile/WhatsApp Number | `919999999999` | page.tsx, EmbeddedChatBot.tsx |
| Display Phone | `+91 99999 99999` | page.tsx |
| Email | `hello@paliwalsecure.com` | page.tsx |
| Support Email | `support@paliwalsecure.com` | EmbeddedChatBot.tsx |
| Office Address | `New Delhi, India` | page.tsx |
| Domain URL | `paliwalsecure.in` | layout.tsx |
| Admin Email | `admin@paliwalsecure.com` | admin/login/page.tsx |
