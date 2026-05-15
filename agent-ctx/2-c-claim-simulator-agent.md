# Task 2-c: Interactive Claim Simulator

## Agent: Claim Simulator Agent

## Work Completed:
- Created `/home/z/my-project/src/components/ClaimSimulator.tsx` with full interactive claim probability simulation
- Integrated into `page.tsx` with dynamic import, new section, and nav link
- ESLint: PASS (0 errors)
- Dev server: Running (HTTP 200)

## Key Files Modified:
- `/home/z/my-project/src/components/ClaimSimulator.tsx` (NEW)
- `/home/z/my-project/src/app/page.tsx` (added import, section, nav link)
- `/home/z/my-project/worklog.md` (appended work log)

## Calculation Logic:
- baseProbability = insurer CSR
- PED + waiting NOT completed: -20%
- PED + waiting completed: -5%
- Claim >80% SI: -5%
- Claim <20% SI: +2%
- Age >60: -5%
- Final = clamp(base + adjustments, 10, 99)

## Design:
- Emerald/teal gradient header
- Two-column desktop layout (form left, results right)
- Framer Motion animations
- Color-coded progress bar (green/amber/red)
- 6 tips cards with Hinglish text
- Disclaimer in Hinglish
