'use client';

import { healthRiders } from '@/data/healthRiders';
import { termRiders } from '@/data/termRiders';
import { motorAddons } from '@/data/motorAddons';
import AddonSelector, { type Addon } from './AddonSelector';

interface SmartAddonSelectorProps {
  type: 'health' | 'term' | 'motor';
  selectedAddons: string[];
  onToggle: (addonId: string) => void;
  showCost?: boolean;
}

export default function SmartAddonSelector({
  type,
  selectedAddons,
  onToggle,
  showCost = true,
}: SmartAddonSelectorProps) {
  let addons: Addon[] = [];

  if (type === 'health') {
    addons = healthRiders.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      avgCost: `₹${r.avgCost.toLocaleString()}/yr`,
      waitingPeriod: r.waitingPeriod,
      bestFor: r.bestFor,
    }));
  } else if (type === 'term') {
    addons = termRiders.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      avgCost: r.avgCostIncrease,
      bestFor: r.bestFor,
    }));
  } else if (type === 'motor') {
    addons = motorAddons.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      avgCost: a.avgCost,
      bestFor: a.bestForVehicleAge,
      recommended: a.recommended,
    }));
  }

  const titles: Record<'health' | 'term' | 'motor', string> = {
    health: 'Health Riders & Add-ons',
    term: 'Term Life Riders',
    motor: 'Motor Insurance Add-ons',
  };

  return (
    <AddonSelector
      addons={addons}
      selectedAddons={selectedAddons}
      onToggle={onToggle}
      type={type}
      title={titles[type]}
      showCost={showCost}
    />
  );
}
