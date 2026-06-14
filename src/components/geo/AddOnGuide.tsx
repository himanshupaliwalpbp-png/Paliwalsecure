'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Package, Check } from 'lucide-react';

interface AddonItem {
  name: string;
  cost: string;
  recommended: boolean;
  description: string;
}

interface AddOnGuideProps {
  vehicleName: string;
  addons: AddonItem[];
  className?: string;
}

export function AddOnGuide({ vehicleName, addons, className }: AddOnGuideProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Add-on Guide for {vehicleName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {addons.map((addon) => (
            <div
              key={addon.name}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                addon.recommended
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {addon.recommended && <Check className="h-4 w-4 text-primary" />}
                  <span className="font-semibold text-sm">{addon.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{addon.cost}</span>
                  {addon.recommended && (
                    <Badge variant="default" className="text-xs">Recommended</Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground ml-6">{addon.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          * Add-on prices are indicative. Actual premiums vary by insurer, vehicle age, and location.
        </p>
      </CardContent>
    </Card>
  );
}
