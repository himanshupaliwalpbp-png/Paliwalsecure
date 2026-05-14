# Task 6 — Design Enhancement Agent

## Task: AI Chatbot Personalisation (localStorage Memory) + Scroll-Triggered 3D Shield + Parallax Effects

### Files Created
- `src/lib/chat-memory.ts` — Full localStorage personalization utility
- `src/components/HeroShield3D.tsx` — 3D scroll-linked shield with orbiting icons
- `src/components/HeroParallaxParticles.tsx` — Parallax floating particles

### Files Modified
- `src/components/EmbeddedChatBot.tsx` — Added chat memory personalization
- `src/components/ChatBot.tsx` — Added chat memory personalization
- `src/app/api/chat/route.ts` — Accepts memory context in system prompt
- `src/lib/validation.ts` — Added `memory` field to chatMessageSchema
- `src/app/page.tsx` — Replaced hero shield with HeroShield3D + added parallax particles

### Key Implementation Details

#### Chat Memory System
- `extractInfoFromMessage` uses keyword detection for: names (Hindi/English patterns), budget (₹ patterns), insurance interests (health/life/motor/travel/term/car/bike), age, PEDs (diabetes/bp/heart/thyroid/asthma/etc), language (Hindi script → 'hi', mixed → 'hinglish', English → 'en'), discussion topics
- Returning users (visitCount > 0) get personalized greeting: "Welcome back, {name}! 🙏 Last time we discussed {topic}..."
- Memory context string sent to AI API: "User's name is Rajesh. They are interested in health insurance with a budget of ₹5000/month. They have diabetes. They prefer Hinglish responses."
- Memory arrays (interests, ped, previousTopics) merge instead of replace

#### 3D Shield
- Uses Framer Motion `useScroll` + `useTransform` for scroll-linked rotateY (0→15°) and rotateX (0→-5°)
- Animated conic gradient border (rotating 360° over 8s)
- 3 pulsing rings at different sizes/delays
- 4 orbiting insurance icons (Heart, Shield, Car, Plane) with absolute positioning
- Mobile: disables 3D rotation, uses subtle breathing scale animation instead
- Desktop: perspective: 1000px, transformStyle: preserve-3d

#### Parallax Particles
- 10 particles with varying sizes (2-6px), colors, speeds, and opacities
- Each particle moves at different speed on scroll via `useTransform`
- Opacity pulses for depth effect
- Dynamically imported with ssr: false (no mounted state needed)

### Lint: PASS (0 errors, 0 warnings)
### Dev Server: Running correctly
