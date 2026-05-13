# Paliwal Secure - Smart Insurance for Every Indian

AI-powered insurance recommendation platform targeting the 700 million uninsured/underinsured people in India. Built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Hyper-Personalized AI Engine**: Multi-step onboarding flow collecting Age, Income, Pincode, Medical History, Lifestyle, and more for personalized recommendations
- **IRDAI-Compliant Recommendations**: Automatic prohibited word filtering, mandatory disclaimers, and explainable scoring breakdowns
- **RAG Implementation**: Retrieval-Augmented Generation using a comprehensive insurance knowledge base for fact-based, non-hallucinated answers
- **Voice-First Interaction**: Web Speech API integration for voice input in the AI chatbot (supports `en-IN` locale)
- **Gamification & Micro-Interactions**: Interactive "Game of Life" demo illustrating insurance importance through 8 life scenarios
- **State-of-the-Art UI**: Fully responsive, mobile-first design with premium micro-interactions and smooth Framer Motion animations
- **Comprehensive Product Data**: 16 insurance plans across Health, Life, Motor, Travel, and Home categories with real Indian market data
- **Contact Form & Lead Collection**: Secure form with validation and serverless API endpoint

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **AI SDK**: z-ai-web-dev-sdk (backend only)
- **Icons**: Lucide React
- **Forms**: React Hook Form compatible with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/paliwal-secure.git
cd paliwal-secure

# Install dependencies
npm install
# or
bun install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# AI SDK (for chat functionality - z-ai-web-dev-sdk)
# No additional API keys needed - the SDK works out of the box

# Optional: Email service for contact form
# SENDGRID_API_KEY=your_sendgrid_api_key
# CONTACT_EMAIL=your-email@example.com
```

### Development

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # AI chatbot API with RAG + IRDAI compliance
│   │   └── contact/
│   │       └── route.ts          # Contact form / lead collection API
│   ├── globals.css               # Global styles + custom animations
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main landing page (single-page app)
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── ChatBot.tsx               # AI chatbot with voice input
│   ├── GameOfLife.tsx            # Interactive life scenario demo
│   └── OnboardingFlow.tsx        # Multi-step personalization quiz
├── hooks/
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
└── lib/
    ├── insurance-data.ts         # Comprehensive Indian insurance product data
    ├── scoring-engine.ts         # Personalized recommendation scoring + RAG
    ├── db.ts                     # Prisma database client
    └── utils.ts                  # Utility functions
```

## Key Architecture Decisions

### RAG (Retrieval-Augmented Generation)

The chat API implements RAG by:
1. Searching the local knowledge base (`insurance-data.ts`) for relevant entries
2. Building a rich context prompt with user profile, relevant knowledge, and available plans
3. Sending the enhanced prompt to the LLM (via z-ai-web-dev-sdk)
4. Post-processing the response for IRDAI compliance

### IRDAI Compliance

- **Prohibited Word Filter**: Automatically removes words like "guaranteed", "assured", "risk-free", etc.
- **Mandatory Disclaimers**: Appended to all responses discussing specific plans
- **Claim Settlement Ratio**: Displayed with proper context (past performance disclaimer)
- **Tax Benefit Disclaimers**: Noted that tax benefits are subject to change

### Scoring Engine

Personalized recommendations use a weighted scoring system:
- **Income Fit (20%)**: Premium affordability relative to income
- **Claim History (20%)**: Claim Settlement Ratio weighting
- **Age Match (15%)**: Eligibility and age optimization
- **Coverage Fit (15%)**: Medical history and dependent coverage matching
- **Priority Match (15%)**: User's stated priority alignment
- **Lifestyle Match (10%)**: Smoking, exercise, sedentary work factors
- **Network Score (5%)**: Hospital network size for health plans

### Voice Input

Uses the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with:
- `en-IN` locale for Indian English
- Graceful fallback when API is not supported
- Visual recording indicator
- Automatic transcription into chat input

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Paliwal Secure insurance platform"
git branch -M main
git remote add origin https://github.com/your-username/paliwal-secure.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (if any)
5. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain (e.g., `paliwalsecure.in`)
3. Update DNS records as instructed

### Vercel Configuration

The project includes `next.config.ts` with `output: "standalone"` for optimized deployment. No additional Vercel configuration needed.

## API Endpoints

### POST /api/chat

AI chatbot endpoint with RAG and IRDAI compliance.

**Request:**
```json
{
  "message": "What is health insurance?",
  "profile": {
    "age": 30,
    "income": "5-10l",
    "dependents": 2,
    "priority": "health"
  },
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! I'm Paliwal Secure AI..." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "Health insurance is...",
  "complianceChecked": true
}
```

### POST /api/contact

Contact form / lead collection endpoint.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "insuranceType": "health",
  "message": "I need health insurance advice"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! Our insurance advisor will contact you within 24 hours."
}
```

## Insurance Data Coverage

| Category | Plans | Providers | Avg CSR |
|----------|-------|-----------|---------|
| Health   | 6     | Star Health, HDFC ERGO, Care Health, Niva Bupa, ICICI Lombard, SBI General | 87.5% |
| Life     | 5     | LIC, HDFC Life, SBI Life, Tata AIA, Max Life | 98.7% |
| Motor    | 3     | Bajaj Allianz, ICICI Lombard, New India Assurance | 86.8% |
| Travel   | 2     | ICICI Lombard, Bajaj Allianz | 87.0% |
| Home     | 2     | HDFC ERGO, Bajaj Allianz | 88.8% |

## License

MIT

## Disclaimer

This application is for educational and demonstration purposes only. Insurance recommendations should not be considered as financial advice. Always consult a licensed IRDAI-registered insurance advisor before making insurance decisions. All insurance data shown is based on publicly available information and may not reflect current terms.
