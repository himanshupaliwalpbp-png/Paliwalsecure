# Task 2-a: PlanComparison.tsx Component

## Agent: full-stack-developer

## Task
Build PlanComparison.tsx - a Side-by-Side Comparison Table for insurance plans.

## Work Completed
- Created `/home/z/my-project/src/components/PlanComparison.tsx` with full functionality
- Component is standalone and ready for integration into page.tsx
- ESLint passes with 0 errors on the component
- Dev server running correctly

## Key Features
1. Category filter tabs (All, Health, Life, Motor) with animated pill buttons
2. Search input for plan filtering
3. Plan selector grid (responsive 2-6 cols) with clickable cards, max 4 selection
4. Selected plan chips bar with remove and "Compare Karein" CTA
5. Comparison table with sticky header & first column
6. 10 comparison rows (Insurer, Premium, CSR, Waiting PED, Network, Add-ons, Rating, etc.)
7. CSR color coding: green (>95%), amber (90-95%), red (<90%)
8. Category gradient headers (rose=health, blue=life, amber=motor)
9. Apply Now button per column → navigates to InsureGPT chat
10. Empty state, Clear All, IRDAI disclaimer
11. Hinglish labels, Indian number formatting, Framer Motion animations

## Dependencies Used
- `@/lib/insurance-data` for plan data
- `@/lib/premiumUtils` for formatIndianCurrency/formatRupees
- shadcn/ui: Card, CardContent, Button, Badge, Input, ScrollArea, Separator
- lucide-react icons
- framer-motion for animations
