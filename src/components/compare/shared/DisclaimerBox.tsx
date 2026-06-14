'use client';

import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type DisclaimerCategory = 'motor' | 'health' | 'life' | 'travel' | 'home' | 'general';

interface DisclaimerBoxProps {
  category: DisclaimerCategory;
  className?: string;
}

export const DISCLAIMERS: Record<string, { title: string; text: string; note: string }> = {
  MOTOR: {
    title: "Motor Insurance Disclaimer",
    text: "⚠️ IRDAI मंजूर दरों पर आधारित। TP प्रीमियम सभी बीमाकर्ताओं के लिए समान है (MoRTH GSR 354(E), 28.03.2024)। OD प्रीमियम और ऐड-ऑन दरें संकेत हैं और वास्तविक खरीद पर भिन्न हो सकती हैं। IRDAI ने FY 2025-26 के लिए 18-25% TP वृद्धि प्रस्तावित की है — अंतिम अधिसूचना अपेक्षित।",
    note: "बीमा विषय वस्तु का निमंत्रण है। जोखिम कारकों, नियमों और शर्तों के लिए पॉलिसी दस्तावेज़ पढ़ें।",
  },
  HEALTH: {
    title: "Health Insurance Disclaimer",
    text: "⚠️ प्रीमियम उम्र, SI और स्थान पर आधारित संकेत हैं। GST 0% लागू (22 सितंबर 2025 से, GST परिषद 56वीं बैठक)। वास्तविक प्रीमियम चिकित्सा अंडरराइटिंग पर निर्भर। प्रतीक्षा अवधि, उप-सीमा और बहिष्करण लागू।",
    note: "सेक्शन 80D के तहत कर लाभ लागू। पॉलिसी दस्तावेज़ ध्यान से पढ़ें।",
  },
  LIFE: {
    title: "Life Insurance Disclaimer",
    text: "⚠️ टर्म प्रीमियम संकेत हैं (GST 0% लागू 22 सितंबर 2025 से)। वास्तविक प्रीमियम चिकित्सा अंडरराइटिंग और जीवनशैली घोषणा के अधीन। मृत्यु लाभ पॉलिसी शर्तों और जांच के अधीन।",
    note: "सेक्शन 80C के तहत कर लाभ (₹1.5L सीमा) लागू।",
  },
  TRAVEL: {
    title: "Travel Insurance Disclaimer",
    text: "⚠️ प्रीमियम संकेत हैं (18% GST शामिल)। कवर पॉलिसी शर्तों और गंतव्य-विशिष्ट प्रतिबंधों के अधीन। साहसिक खेल, आतंकवाद और युद्ध बहिष्करण लागू जब तक विशेष रूप से कवर न किया गया हो।",
    note: "COVID-19 कवरेज पॉलिसी अनुसार भिन्न। पॉलिसी शर्तें पढ़ें।",
  },
  HOME: {
    title: "Home Insurance Disclaimer",
    text: "⚠️ प्रीमियम संकेत हैं (18% GST शामिल)। वास्तविक प्रीमियम संपत्ति निरीक्षण, निर्माण गुणवत्ता और स्थान जोखिम मूल्यांकन पर निर्भर। बाढ़ और भूकंप कवरेज जोन वर्गीकरण के अधीन।",
    note: "मूल्यांकन रिपोर्ट आवश्यक हो सकती है। पॉलिसी शर्तें पढ़ें।",
  },
  GENERAL: {
    title: "General Disclaimer",
    text: "Paliwal Secure (POSP Code: IP429834) is an IRDAI-registered insurance intermediary. Insurance is subject matter of solicitation. Rates sourced from IRDAI Annual Report FY 2024-25 and insurer filed rates. Data accuracy date: May 2026.",
    note: "For exact quotes, please contact your agent at +91 9257877312.",
  },
};

// Map lowercase category keys to uppercase DISCLAIMER keys
const CATEGORY_KEY_MAP: Record<DisclaimerCategory, string> = {
  motor: 'MOTOR',
  health: 'HEALTH',
  life: 'LIFE',
  travel: 'TRAVEL',
  home: 'HOME',
  general: 'GENERAL',
};

export function DisclaimerBox({ category, className }: DisclaimerBoxProps) {
  const key = CATEGORY_KEY_MAP[category] ?? 'GENERAL';
  const data = DISCLAIMERS[key];

  if (!data) return null;

  return (
    <Card className={`border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 ${className ?? ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {data.title}
              </span>
              {category !== 'general' && (
                <Badge
                  variant="outline"
                  className="border-amber-400 text-amber-700 dark:border-amber-600 dark:text-amber-400 text-[10px]"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              )}
              {category === 'motor' && (
                <Badge className="bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 text-[10px]">
                  TP rates fixed by IRDAI
                </Badge>
              )}
              {(category === 'health' || category === 'life') && (
                <Badge className="bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100 text-[10px]">
                  0% GST from 22 Sept 2025
                </Badge>
              )}
            </div>

            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              {data.text}
            </p>

            <div className="mt-2 border-t border-amber-200 dark:border-amber-800 pt-2 flex items-start gap-1.5">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 shrink-0">📌</span>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">
                {data.note}
              </p>
            </div>

            <div className="border-t border-amber-200 dark:border-amber-800 pt-2 mt-2">
              <p className="text-[10px] text-amber-700 dark:text-amber-400">
                Paliwal Secure (POSP: IP429834) • IRDAI Reg No: IP429834
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
