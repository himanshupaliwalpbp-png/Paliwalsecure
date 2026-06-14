'use client';

import { Switch } from '@/components/ui/switch';

interface ElasticToggleProps {
  label: string;
  description?: string;
  defaultOn?: boolean;
  onChange?: (isOn: boolean) => void;
}

export default function ElasticToggle({
  label,
  description,
  defaultOn = false,
  onChange,
}: ElasticToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        defaultChecked={defaultOn}
        onCheckedChange={onChange}
        className="h-6 w-11 data-[state=checked]:bg-[#00A9A6] data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600 shrink-0"
      />
    </div>
  );
}
