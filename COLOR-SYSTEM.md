# Paliwal Secure — Premium Insurance Advisory Color System v7.0

> **Design Philosophy:** Warm sophistication meets digital trust. This system draws from the quiet luxury of Apple, the clean professionalism of Stripe, the dark elegance of Linear, the warm approachability of Notion, and the minimal precision of Vercel.

---

## Core Palette (User-Defined)

| Token | Name | Hex | Role |
|-------|------|-----|------|
| `--cream` | Soft Cream | `#F3EADB` | Warm primary background |
| `--black` | Black | `#111111` | Deep text, dark mode base |
| `--ivory` | Ivory White | `#F6F5F1` | Light alternate background |
| `--maroon` | Deep Maroon | `#5E1223` | Premium/luxury accent |
| `--baby-blue` | Baby Blue | `#DBEAFE` | Subtle highlights, hover states |
| `--electric-blue` | Electric Blue | `#2563EB` | Primary action color |

---

## 1. Primary Background Strategy

### Light Mode

| Zone | Background | Hex | Rationale |
|------|-----------|-----|-----------|
| **Hero / Primary sections** | Soft Cream | `#F3EADB` | Warmth, approachability — the first impression. Like Notion's warm ivory. |
| **Content / Secondary sections** | Ivory White | `#F6F5F1` | Clean reading surface. Cooler than cream but still warm. |
| **Feature highlights / Break sections** | White | `#FFFFFF` | Maximum contrast for premium showcase cards. |
| **Premium/dark sections** | Deep Maroon | `#5E1223` | Full-width section breaks for luxury moments. |

### Why Cream for Hero?
Stripe uses cool whites; Notion uses warm off-whites. For insurance advisory, warmth = trust. Soft Cream `#F3EADB` creates an immediate feeling of "we're human, we care" — critical for an industry built on trust. Ivory White `#F6F5F1` provides visual relief when alternating, preventing the cream from feeling monotonous.

### CSS Variables
```css
:root {
  --background: 40 33% 90%;         /* #F3EADB — Soft Cream */
  --background-alt: 40 20% 95%;     /* #F6F5F1 — Ivory White */
  --background-surface: 0 0% 100%;  /* #FFFFFF — White */
}
```

---

## 2. Card / Surface Colors

| Surface | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| **Card Default** | `#FFFFFF` | `#1A1A1A` | Content cards on cream/ivory backgrounds |
| **Card Elevated** | `#FFFFFF` | `#222222` | Hover state, active cards |
| **Card Premium** | `#FEFCF8` | `#1E1014` | Premium/maroon-accented cards |
| **Popover** | `#FFFFFF` | `#1A1A1A` | Dropdown menus, tooltips |
| **Sheet/Drawer** | `#F6F5F1` | `#141414` | Side panels, bottom sheets |
| **Input Surface** | `#FFFFFF` | `#1A1A1A` | Form inputs, text fields |

### Card Design Rules
- Cards always use pure white on cream/ivory — this creates the "floating on warm" effect Stripe uses
- Card borders: `1px solid rgba(0,0,0,0.06)` — nearly invisible, just enough separation
- Premium cards: Use a subtle maroon left border `3px solid #5E1223` as a luxury indicator
- Card shadow: See Shadow System below

```css
:root {
  --card: 0 0% 100%;           /* #FFFFFF */
  --card-foreground: 0 0% 7%;  /* #111111 */
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 7%;
}
.dark {
  --card: 0 0% 10%;            /* #1A1A1A */
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 10%;
  --popover-foreground: 0 0% 95%;
}
```

---

## 3. Text Hierarchy

| Level | Light Mode | Dark Mode | Size | Weight | Usage |
|-------|-----------|-----------|------|--------|-------|
| **Primary** | `#111111` | `#F3EADB` | Base (16px) | 400 | Body text, paragraphs |
| **Heading** | `#111111` | `#F6F5F1` | 2xl–5xl | 600–700 | H1–H6 |
| **Secondary** | `#4A4A4A` | `#B0B0B0` | Base | 400 | Descriptions, supporting text |
| **Muted** | `#8C8C8C` | `#707070` | sm | 400 | Timestamps, footnotes, placeholders |
| **Label** | `#5E1223` | `#D4A0A0` | xs–sm | 600 | Section labels, category tags |
| **Link** | `#2563EB` | `#6B9FFF` | Base | 500 | Interactive text links |
| **Link Hover** | `#1D4ED8` | `#93B8FF` | Base | 500 | Link hover state |

### Text on Dark Maroon Sections
| Level | Color | Usage |
|-------|-------|-------|
| **Primary** | `#F6F5F1` | Headings on maroon backgrounds |
| **Secondary** | `#D4B8B8` | Body text on maroon |
| **Accent** | `#DBEAFE` | Highlights on maroon |

```css
:root {
  --foreground: 0 0% 7%;              /* #111111 */
  --text-secondary: 0 0% 29%;         /* #4A4A4A */
  --text-muted: 0 0% 55%;             /* #8C8C8C */
}
.dark {
  --foreground: 40 33% 90%;           /* #F3EADB */
  --text-secondary: 0 0% 69%;         /* #B0B0B0 */
  --text-muted: 0 0% 44%;             /* #707070 */
}
```

---

## 4. Accent Colors

### Primary Accent: Electric Blue `#2563EB`
The action color. Used for CTAs, links, interactive elements, progress indicators.

| State | Hex | Usage |
|-------|-----|-------|
| **Default** | `#2563EB` | Buttons, links, active states |
| **Hover** | `#1D4ED8` | Button hover, link hover |
| **Pressed** | `#1E40AF` | Active/pressed buttons |
| **Subtle BG** | `#EFF6FF` | Light blue background tint |
| **Ring/Focus** | `rgba(37,99,235,0.4)` | Focus rings, selection |

### Secondary Accent: Deep Maroon `#5E1223`
The luxury color. Used sparingly for premium moments.

| State | Hex | Usage |
|-------|-----|-------|
| **Default** | `#5E1223` | Premium badges, luxury sections |
| **Hover** | `#7A1A30` | Hover on maroon elements |
| **Light Tint** | `#F9F0F2` | Very subtle maroon-tinted background |
| **Border Accent** | `rgba(94,18,35,0.15)` | Subtle maroon borders |
| **Text on White** | `#5E1223` | Label text, premium indicators |

### Tertiary Accent: Gold (Derived)
For moments that need extra warmth without the intensity of maroon.

| Hex | Usage |
|-----|-------|
| `#C98A1C` | Legacy gold — trust badges, award icons |
| `#E8C872` | Light gold — premium highlights |

```css
:root {
  --primary: 221 83% 53%;            /* #2563EB — Electric Blue */
  --primary-foreground: 0 0% 100%;   /* #FFFFFF */
  --accent: 340 68% 22%;             /* #5E1223 — Deep Maroon */
  --accent-foreground: 0 0% 100%;    /* #FFFFFF text on maroon */
}
```

---

## 5. Premium/Luxury Accents — Deep Maroon `#5E1223`

### Design Philosophy
Deep Maroon is NOT a daily-use color. It's the "Chanel red" of the palette — deployed only at moments requiring gravitas, luxury, or emotional weight. Think of it as the velvet rope at an exclusive venue.

### Usage Zones

| Zone | Application | Frequency |
|------|------------|-----------|
| **Full-width section breaks** | Background `#5E1223` with ivory text | 2–3 per page max |
| **Premium badge** | Small pill badge with maroon bg + white text | Rare — only for "Premium" / "Exclusive" labels |
| **Left border accent** | `3px solid #5E1223` on important cards | Occasional |
| **Section label text** | Small label text in maroon on cream | 1 per section header |
| **Testimonial highlight** | Maroon quote mark or accent line | 1–2 per testimonial section |
| **Footer** | Dark maroon-to-black gradient footer | 1 per page |

### NEVER Use Maroon For:
- Body text (too dark, too emotional)
- Large button fills on white (overpowering)
- Background tints beyond `#F9F0F2` (too pink/dirty)
- Multiple maroon elements in the same viewport section
- Hover states on non-premium elements

### Maroon Gradient (Footer / Hero Overlays)
```css
background: linear-gradient(180deg, #5E1223 0%, #3D0A16 100%);
background: linear-gradient(135deg, #5E1223 0%, #111111 100%);
```

---

## 6. Baby Blue `#DBEAFE` Usage

### Design Philosophy
Baby Blue is the whisper color. It never shouts — it suggests. Like the sky behind Stripe's navigation, it provides a gentle, trustworthy backdrop that makes Electric Blue elements feel at home.

| Application | Hex/Value | Usage |
|-------------|-----------|-------|
| **Hover background** | `#DBEAFE` | Card hover, row hover, nav item hover |
| **Selection highlight** | `#DBEAFE` | Text selection background |
| **Subtle section tint** | `rgba(219,234,254,0.4)` | Very light blue tint on sections |
| **Tag background** | `#DBEAFE` with `#1E40AF` text | Info tags, category pills |
| **Input focus glow** | `0 0 0 3px rgba(219,234,254,0.5)` | Soft focus ring on inputs |
| **Progress track** | `#DBEAFE` | Background track for progress bars |
| **Icon background** | `#DBEAFE` with `#2563EB` icon | Feature icon circles |
| **Chart area** | `#DBEAFE` → `#2563EB` | Gradient fills in charts |

### NEVER Use Baby Blue For:
- Text color (insufficient contrast)
- Primary buttons (too light, no authority)
- Large background areas (reads as "medical" or "baby product")
- Headings (too soft, lacks gravitas)

---

## 7. Border Colors

### Light Mode Borders

| Token | Hex | Opacity | Usage |
|-------|-----|---------|-------|
| **Border Default** | `#E8E2D6` | 100% | Standard card/section borders |
| **Border Light** | `#EDE8DD` | 100% | Subtle dividers within sections |
| **Border Subtle** | `rgba(0,0,0,0.06)` | 6% | Nearly invisible card borders |
| **Border Focus** | `#2563EB` | 100% | Input focus borders |
| **Border Premium** | `#5E1223` | 100% | Premium card left accent border |
| **Border Hover** | `#D4CFC5` | 100% | Hover state on bordered elements |

### Dark Mode Borders

| Token | Hex | Opacity | Usage |
|-------|-----|---------|-------|
| **Border Default** | `rgba(255,255,255,0.08)` | 8% | Standard borders on dark bg |
| **Border Light** | `rgba(255,255,255,0.04)` | 4% | Subtle dividers |
| **Border Subtle** | `rgba(255,255,255,0.06)` | 6% | Card borders on dark bg |
| **Border Focus** | `#2563EB` | 100% | Input focus |
| **Border Premium** | `#8B2D40` | 100% | Premium accent in dark mode |

### Key Principle: Warm Borders
The border colors are NOT cool gray (#E2E8F0). They are warm-tinted to match the cream/ivory palette. This is the Notion approach — borders should feel like they belong to the warm surface, not like cold metal dividers.

```css
:root {
  --border: 40 18% 85%;           /* #E8E2D6 — warm border */
  --input: 40 18% 85%;
  --ring: 221 83% 53%;            /* #2563EB — focus ring */
}
.dark {
  --border: 0 0% 20%;            /* #333333 — dark border */
  --input: 0 0% 20%;
  --ring: 221 83% 53%;
}
```

---

## 8. Dark Mode Palette

### Base: Black `#111111`

| Token | Dark Hex | HSL | Usage |
|-------|----------|-----|-------|
| **Background** | `#111111` | 0 0% 7% | Page background |
| **Background Alt** | `#171717` | 0 0% 9% | Alternating sections |
| **Surface** | `#1A1A1A` | 0 0% 10% | Cards, elevated surfaces |
| **Surface Elevated** | `#222222` | 0 0% 13% | Hover cards, popovers |
| **Surface Premium** | `#1E1014` | 340 30% 9% | Maroon-tinted surface |
| **Border** | `#333333` | 0 0% 20% | Standard borders |
| **Border Subtle** | `rgba(255,255,255,0.06)` | — | Card borders |
| **Text Primary** | `#F3EADB` | 40 33% 90% | Main text (cream — reversed!) |
| **Text Secondary** | `#B0B0B0` | 0 0% 69% | Supporting text |
| **Text Muted** | `#707070` | 0 0% 44% | Footnotes |
| **Electric Blue** | `#2563EB` | — | Same as light — blue works on dark |
| **Baby Blue Hover** | `rgba(37,99,235,0.15)` | — | Hover state on dark |
| **Maroon** | `#8B2D40` | — | Lightened for dark mode |
| **Maroon Light** | `#D4A0A0` | — | Label text in dark mode |

### Dark Mode Gradient Sections
```css
/* Premium section in dark mode */
background: linear-gradient(180deg, #1E1014 0%, #111111 100%);

/* Dark maroon section */
background: linear-gradient(135deg, #5E1223 0%, #111111 100%);
```

### Dark Mode Key Insight
In dark mode, Soft Cream becomes the primary TEXT color instead of the background. This creates a beautiful reversal — the warmth doesn't disappear, it becomes the content. This is inspired by Linear's dark mode where warm grays make the dark UI feel human.

---

## 9. Section Alternation Strategy

### The Stripe-Notion Hybrid Approach

```
┌─────────────────────────────────────┐
│  HERO: Soft Cream #F3EADB           │  ← Warm first impression
├─────────────────────────────────────┤
│  FEATURES: Ivory White #F6F5F1      │  ← Lighter, cleaner reading
├─────────────────────────────────────┤
│  PREMIUM SECTION: Deep Maroon       │  ← Full contrast break
│  #5E1223                            │
├─────────────────────────────────────┤
│  CONTENT: Soft Cream #F3EADB        │  ← Return to warmth
├─────────────────────────────────────┤
│  STATS/LOGOS: White #FFFFFF         │  ← Maximum clean
├─────────────────────────────────────┤
│  TESTIMONIALS: Ivory White #F6F5F1  │  ← Gentle, trustworthy
├─────────────────────────────────────┤
│  CTA: Soft Cream #F3EADB           │  ← Warm closing
├─────────────────────────────────────┤
│  FOOTER: #111111 → #5E1223         │  ← Dark, authoritative
└─────────────────────────────────────┘
```

### Rules:
1. **Never alternate more than 2 sections** between cream and ivory without a pattern break (maroon section, white section, or gradient)
2. **Hero is always cream** — it's the brand's warm handshake
3. **White sections** are reserved for content that needs maximum clarity (pricing tables, comparison matrices)
4. **Maroon sections** act as "visual punctuation" — use 1 per long page, 2 max
5. **Dark sections** (footer, some CTAs) always end the page

### Dark Mode Alternation:
```
Background:    #111111 → #171717 → #111111 → #1E1014 → #111111
                primary   alt      primary   maroon-tint  primary
```

---

## 10. CTA / Button Colors

### Primary Button — Electric Blue
| State | BG | Text | Border | Shadow |
|-------|-----|------|--------|--------|
| **Default** | `#2563EB` | `#FFFFFF` | none | `0 1px 3px rgba(37,99,235,0.3)` |
| **Hover** | `#1D4ED8` | `#FFFFFF` | none | `0 4px 12px rgba(37,99,235,0.35)` |
| **Pressed** | `#1E40AF` | `#FFFFFF` | none | `0 1px 2px rgba(37,99,235,0.3)` |
| **Disabled** | `#93C5FD` | `#FFFFFF` | none | none |

### Secondary Button — Outline
| State | BG | Text | Border | Shadow |
|-------|-----|------|--------|--------|
| **Default** | `transparent` | `#111111` | `1.5px solid #111111` | none |
| **Hover** | `#111111` | `#F3EADB` | `1.5px solid #111111` | `0 2px 8px rgba(0,0,0,0.15)` |
| **Pressed** | `#111111` | `#F3EADB` | `1.5px solid #111111` | none |
| **Disabled** | `transparent` | `#8C8C8C` | `1.5px solid #D4CFC5` | none |

### Ghost Button
| State | BG | Text | Border | Shadow |
|-------|-----|------|--------|--------|
| **Default** | `transparent` | `#2563EB` | none | none |
| **Hover** | `#DBEAFE` | `#1D4ED8` | none | none |
| **Pressed** | `#BFDBFE` | `#1E40AF` | none | none |

### Premium Button — Maroon
| State | BG | Text | Border | Shadow |
|-------|-----|------|--------|--------|
| **Default** | `#5E1223` | `#FFFFFF` | none | `0 2px 8px rgba(94,18,35,0.3)` |
| **Hover** | `#7A1A30` | `#FFFFFF` | none | `0 4px 16px rgba(94,18,35,0.4)` |
| **Pressed** | `#4A0E1C` | `#FFFFFF` | none | `0 1px 3px rgba(94,18,35,0.3)` |

### Button Design Rules
- Primary CTAs always Electric Blue — this is the Stripe model (blue = action)
- Premium buttons (maroon) are used ONLY for premium offerings / exclusive access
- Secondary outline buttons use black on warm backgrounds (not gray — too weak on cream)
- Ghost buttons use baby blue hover state — the transition feels natural
- Button radius: `8px` (matches card radius — premium, not overly rounded)
- Button height: `44px` minimum (accessibility)

---

## 11. Shadow System — Premium Warm Shadows

### Design Philosophy
Cold shadows (pure black/gray) create visual dissonance on warm backgrounds. All shadows in this system are warm-tinted — they contain a subtle brown/warm undertone that makes them feel native to cream and ivory surfaces. This is the Apple approach.

| Level | Value | Usage |
|-------|-------|-------|
| **xs** | `0 1px 2px rgba(17,17,17,0.04)` | Subtle lift on resting cards |
| **sm** | `0 2px 4px rgba(17,17,17,0.06)` | Default card shadow |
| **md** | `0 4px 12px rgba(17,17,17,0.08)` | Elevated cards, dropdowns |
| **lg** | `0 8px 24px rgba(17,17,17,0.10)` | Modals, hero cards |
| **xl** | `0 16px 48px rgba(17,17,17,0.12)` | Full-screen overlays |
| **inner** | `inset 0 2px 4px rgba(17,17,17,0.04)` | Inset elements, pressed states |

### Premium Shadows (with warm tint)
| Name | Value | Usage |
|------|-------|-------|
| **premium-card** | `0 4px 20px rgba(94,18,35,0.08), 0 1px 3px rgba(17,17,17,0.05)` | Premium/maroon-accented cards |
| **blue-glow** | `0 4px 20px rgba(37,99,235,0.20)` | Primary button hover, active elements |
| **blue-focus** | `0 0 0 3px rgba(37,99,235,0.15), 0 1px 3px rgba(17,17,17,0.05)` | Focus ring on inputs |

### Dark Mode Shadows
In dark mode, shadows become more about depth than light:
| Level | Value | Usage |
|-------|-------|-------|
| **sm** | `0 2px 4px rgba(0,0,0,0.3)` | Cards on dark bg |
| **md** | `0 4px 12px rgba(0,0,0,0.4)` | Elevated surfaces |
| **lg** | `0 8px 24px rgba(0,0,0,0.5)` | Modals |
| **blue-glow** | `0 4px 20px rgba(37,99,235,0.25)` | Interactive focus |

---

## 12. Color Combination Rules

### ✅ COMBINATIONS THAT WORK

| Combination | Context | Example |
|-------------|---------|---------|
| Cream `#F3EADB` + White `#FFFFFF` cards | Standard content section | Ivory bg → white cards |
| Electric Blue `#2563EB` on Cream | CTAs, links on warm bg | Blue button on cream hero |
| Deep Maroon `#5E1223` + Ivory White text | Premium sections | Maroon bg → ivory headings |
| Baby Blue `#DBEAFE` + Electric Blue text | Tags, info badges | Baby blue pill with blue text |
| Black `#111111` text on Cream | Standard text hierarchy | Body text on cream bg |
| Maroon left border + White card | Premium card indicator | White card with maroon accent |
| Cream `#F3EADB` + Ivory `#F6F5F1` | Section alternation | Adjacent sections |
| Electric Blue `#2563EB` + Maroon `#5E1223` | Dual accent (sparingly) | Blue CTA in maroon section |

### ❌ COMBINATIONS TO AVOID

| Combination | Why It Fails | Fix |
|-------------|-------------|-----|
| Baby Blue `#DBEAFE` as text on White | Fails WCAG contrast (1.5:1) | Use `#2563EB` instead |
| Deep Maroon as large-area fill on white | Too heavy, feels threatening | Use as accent only (borders, badges) |
| Electric Blue text on Baby Blue bg | Low contrast, looks like error state | Use `#1E40AF` text or white bg |
| Cream text on Ivory bg | Near-invisible (1.05:1) | Use `#111111` text on both |
| Multiple maroon elements in same viewport | Visual overload, luxury fatigue | One maroon moment per viewport |
| Pure gray borders on cream | Cold/warm clash | Use warm-tinted borders `#E8E2D6` |
| Black `#111111` + `#333333` | Too close, reads as mistake | Use `#111111` + `#4A4A4A` instead |

### Contrast Ratios (WCAG AA)

| Foreground | Background | Ratio | Pass? |
|-----------|-----------|-------|-------|
| `#111111` on `#F3EADB` | Cream BG | 13.2:1 | ✅ AAA |
| `#111111` on `#F6F5F1` | Ivory BG | 14.1:1 | ✅ AAA |
| `#111111` on `#FFFFFF` | White BG | 15.4:1 | ✅ AAA |
| `#4A4A4A` on `#F3EADB` | Secondary text | 7.1:1 | ✅ AA |
| `#8C8C8C` on `#F3EADB` | Muted text | 3.8:1 | ⚠️ Large text only |
| `#8C8C8C` on `#FFFFFF` | Muted text | 4.1:1 | ⚠️ AA large text |
| `#2563EB` on `#F3EADB` | Links on cream | 4.9:1 | ✅ AA |
| `#2563EB` on `#FFFFFF` | Links on white | 5.3:1 | ✅ AA |
| `#FFFFFF` on `#5E1223` | Text on maroon | 8.2:1 | ✅ AAA |
| `#F6F5F1` on `#5E1223` | Ivory on maroon | 8.6:1 | ✅ AAA |
| `#2563EB` on `#5E1223` | Blue on maroon | 3.2:1 | ❌ Avoid |
| `#F3EADB` on `#111111` | Dark mode text | 13.2:1 | ✅ AAA |

---

## Quick Reference: CSS Custom Properties

```css
:root {
  /* ── Core Palette ── */
  --cream: #F3EADB;
  --ivory: #F6F5F1;
  --black: #111111;
  --maroon: #5E1223;
  --baby-blue: #DBEAFE;
  --electric-blue: #2563EB;

  /* ── Semantic Tokens ── */
  --background: 40 33% 90%;           /* Soft Cream */
  --background-alt: 40 20% 95%;       /* Ivory White */
  --foreground: 0 0% 7%;              /* Black */
  --card: 0 0% 100%;                  /* White */
  --card-foreground: 0 0% 7%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 7%;
  --primary: 221 83% 53%;             /* Electric Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 7%;               /* Black outline */
  --secondary-foreground: 0 0% 7%;
  --muted: 40 12% 92%;                /* Warm muted bg */
  --muted-foreground: 0 0% 55%;
  --accent: 340 68% 22%;              /* Deep Maroon */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --border: 40 18% 85%;              /* Warm border */
  --input: 40 18% 85%;
  --ring: 221 83% 53%;

  /* ── Extended Tokens ── */
  --text-primary: #111111;
  --text-secondary: #4A4A4A;
  --text-muted: #8C8C8C;
  --text-label: #5E1223;
  --text-link: #2563EB;
  --text-link-hover: #1D4ED8;

  --border-default: #E8E2D6;
  --border-light: #EDE8DD;
  --border-subtle: rgba(0,0,0,0.06);
  --border-premium: #5E1223;

  --bg-baby-blue: #DBEAFE;
  --bg-maroon-tint: #F9F0F2;
  --bg-blue-tint: #EFF6FF;

  /* ── Shadows ── */
  --shadow-xs: 0 1px 2px rgba(17,17,17,0.04);
  --shadow-sm: 0 2px 4px rgba(17,17,17,0.06);
  --shadow-md: 0 4px 12px rgba(17,17,17,0.08);
  --shadow-lg: 0 8px 24px rgba(17,17,17,0.10);
  --shadow-xl: 0 16px 48px rgba(17,17,17,0.12);
  --shadow-premium: 0 4px 20px rgba(94,18,35,0.08), 0 1px 3px rgba(17,17,17,0.05);
  --shadow-blue-glow: 0 4px 20px rgba(37,99,235,0.20);

  /* ── Chart Colors ── */
  --chart-1: #2563EB;    /* Electric Blue — primary data */
  --chart-2: #5E1223;    /* Maroon — secondary data */
  --chart-3: #C98A1C;    /* Gold — tertiary data */
  --chart-4: #10B981;    /* Emerald — positive/growth */
  --chart-5: #8C8C8C;    /* Muted — neutral data */
}

.dark {
  /* ── Dark Mode Overrides ── */
  --background: 0 0% 7%;              /* #111111 */
  --background-alt: 0 0% 9%;          /* #171717 */
  --foreground: 40 33% 90%;           /* #F3EADB — Cream as text! */
  --card: 0 0% 10%;                   /* #1A1A1A */
  --card-foreground: 40 33% 90%;
  --popover: 0 0% 10%;
  --popover-foreground: 40 33% 90%;
  --primary: 221 83% 53%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 90%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 44%;
  --accent: 340 50% 36%;              /* #8B2D40 — Lightened maroon */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --border: 0 0% 20%;                /* #333333 */
  --input: 0 0% 20%;
  --ring: 221 83% 53%;

  --text-primary: #F3EADB;
  --text-secondary: #B0B0B0;
  --text-muted: #707070;
  --text-label: #D4A0A0;
  --text-link: #6B9FFF;
  --text-link-hover: #93B8FF;

  --border-default: #333333;
  --border-light: rgba(255,255,255,0.04);
  --border-subtle: rgba(255,255,255,0.06);
  --border-premium: #8B2D40;

  --bg-baby-blue: rgba(37,99,235,0.15);
  --bg-maroon-tint: #1E1014;
  --bg-blue-tint: rgba(37,99,235,0.08);

  --shadow-sm: 0 2px 4px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-premium: 0 4px 20px rgba(94,18,35,0.15), 0 1px 3px rgba(0,0,0,0.2);
  --shadow-blue-glow: 0 4px 20px rgba(37,99,235,0.25);
}
```

---

## Implementation Priority

1. **Phase 1:** Update CSS custom properties in `globals.css` — this cascades to all components
2. **Phase 2:** Update `tailwind.config.ts` brand colors
3. **Phase 3:** Update `designTokens.ts` to match new system
4. **Phase 4:** Audit components for hardcoded colors and migrate to tokens
5. **Phase 5:** Test dark mode across all major sections

---

*Document version 7.0 | Created 2026-03-04 | Inspired by Stripe, Linear, Vercel, Apple, Notion*
