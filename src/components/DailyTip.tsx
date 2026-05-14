'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const insuranceTips: string[] = [
  "Health insurance ka claim rejection avoid karne ke liye, apni pre-existing diseases ko application mein zaroor disclose karein — IRDAI ke mutabiq chhupane par claim reject ho sakta hai.",
  "Life insurance mein 'Free Look Period' hota hai — policy milne ke 15 din tak aap bina penalty ke policy cancel kar sakte hain agar terms pasand na aayein.",
  "Motor insurance mein Own Damage aur Third Party cover alag alag hote hain — Third Party mandatory hai, Own Damage optional lekin recommended.",
  "Travel insurance mein baggage loss aur trip cancellation bhi cover hota hai — sirr medical emergency nahi, complete protection ke liye comprehensive plan choose karein.",
  "Section 80C ke under life insurance premium par ₹1.5 lakh tak tax deduction milta hai — yeh benefit lene ke liye premium regularly pay karein.",
  "Health insurance portability ka fayda uthayein — agar aapki existing company achhi service nahi de rahi, toh bina waiting period lose kiye dusri company shift ho sakte hain.",
  "No-Claim Bonus (NCB) motor insurance mein discount deta hai — claim-free saal ke baad premium mein 20% se 50% tak ki bachat ho sakti hai.",
  "Term insurance sabse affordable life insurance hai — kam premium mein zyada cover milta hai, lekin maturity benefit nahi hota. Protection ke liye yeh suitable option hai.",
  "Health insurance mein room rent limit check karein — kai policies mein capping hoti hai, jo actual room rent se zyada ho sakti hai aur aapko out-of-pocket pay karna pad sakta hai.",
  "IRDAI ke guidelines ke mutabiq, insurance agent ya company koi bhi 'guaranteed return' ya 'best plan' ka claim nahi kar sakti — aise misleading promises se bachhein.",
  "Family floater health insurance individual plans se affordable hota hai, lekin agar kisi ek member ki medical need zyada ho toh sum insured jaldi exhaust ho sakta hai.",
  "Critical Illness cover aur regular health insurance alag cheezein hain — CI cover diagnosis par lumpsum deta hai, health insurance hospitalization expenses cover karta hai.",
  "Car insurance renewal se pehle IDV (Insured Declared Value) check karein — yeh aapki car ki market value hai, jyada IDV se better claim settlement hota hai.",
  "Life insurance ke liye medical test zaroor karein — bina test wali policies mein claim rejection ka risk zyada hota hai kyunki hidden conditions miss ho sakti hain.",
  "Health insurance mein daycare procedures bhi cover hote hain — aajkal cataract, dialysis jaisi procedures 24 ghante se kam mein hoti hain aur inka claim mil sakta hai.",
  "Travel insurance mein pre-existing conditions cover nahi hote generally — lein koi specialized policy choose karein jo PED cover karti ho, warna emergency mein claim reject ho sakta hai.",
  "Section 80D ke under health insurance premium par ₹25,000 (seniors ke liye ₹50,000) tak tax deduction available hai — apna health cover aur tax dono sath mein plan karein.",
  "Two-wheeler insurance mein Personal Accident cover add karein — yeh minimum ₹15 lakh ka cover deta hai aur chhoti premium mein important protection milta hai.",
  "Insurance ki grace period generally 30 din hoti hai — premium late bhi pay kar sakte hain, lekin iske baad policy lapse ho jayegi aur renewal mein medical test lag sakta hai.",
  "Policy document ko dhyan se padhein — waiting period (2-4 saal pre-existing diseases ke liye), exclusions, aur co-payment clauses samajhne ke liye time lagayein.",
  "Group health insurance (company wali) individual cover se different hoti hai — job change par cover khatam ho jata hai, isliye personal health insurance bhi rakhein.",
  "Insurance ombudsman se complaint kar sakte hain agar company claim reject karti hai — yeh free service hai aur IRDAI dwara establish ki gayi hai policyholders ke liye.",
]

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function DailyTip() {
  const dayIndex = getDayOfYear() % insuranceTips.length
  const [currentIndex, setCurrentIndex] = React.useState(dayIndex)
  const [isSpinning, setIsSpinning] = React.useState(false)

  const handleNextTip = () => {
    setIsSpinning(true)
    setCurrentIndex((prev) => (prev + 1) % insuranceTips.length)
    setTimeout(() => setIsSpinning(false), 500)
  }

  const currentTip = insuranceTips[currentIndex]

  return (
    <Card className="relative overflow-hidden border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/60 via-white to-amber-50/40 dark:from-blue-950/30 dark:via-card dark:to-amber-950/20">
      <CardContent className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Lightbulb className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Aaj Ka Bima Tip
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextTip}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Next tip"
              >
                <RefreshCw
                  className={`size-3.5 transition-transform duration-500 ${
                    isSpinning ? 'rotate-180' : ''
                  }`}
                />
                Next Tip
              </Button>
            </div>

            {/* Tip text */}
            <p className="text-sm leading-relaxed text-foreground/90">
              {currentTip}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="opacity-70">
                Tip {currentIndex + 1} of {insuranceTips.length}
              </span>
              <span className="opacity-60">
                IRDAI compliant — for educational purposes only
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
