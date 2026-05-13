# Task 6 - ChatBot Component

**Agent:** Code
**Status:** Completed

## Summary
Created the floating AI ChatBot component at `/home/z/my-project/src/components/ChatBot.tsx` for InsureGPT.

## Key Deliverables
- Floating chat button with emerald gradient + pulse animation
- Expandable chat panel with Framer Motion animations
- User/bot message bubbles with proper styling
- Typing indicator with animated dots
- Voice input via Web Speech API (en-IN locale)
- POST to `/api/chat` with message, profile, and history
- Markdown-like rendering (bold, italic, code, lists)
- IRDAI mandatory disclaimer
- Quick suggestion chips
- Mobile responsive (full-screen on small, card on desktop)
- Conversation history in state
- Graceful voice fallback with tooltip

## Dependencies Used
- framer-motion, lucide-react
- shadcn/ui: Button, Input, ScrollArea, Badge, Tooltip
- @/lib/insurance-data: UserProfile, IRDAI_MANDATORY_DISCLAIMER
