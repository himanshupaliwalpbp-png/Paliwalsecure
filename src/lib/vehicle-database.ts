// lib/vehicle-database.ts
// India's Popular Vehicles Database — 100+ vehicles with ex-showroom prices

import { IDV_DEP } from './motor-rates-calibrated';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  type: 'BIKE' | 'EV_BIKE' | 'CAR' | 'EV_CAR' | 'SCOOTER';
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  cc?: number;
  kw?: number;
  watt?: number;
  exShowroom2026: number;
  popular: boolean;
}

export const VEHICLE_DB: Vehicle[] = [
  // ══ TWO WHEELERS — PETROL ══
  // Honda
  { id: 'honda_activa6g', make: 'Honda', model: 'Activa 6G', type: 'SCOOTER', fuelType: 'PETROL', cc: 110, exShowroom2026: 87000, popular: true },
  { id: 'honda_activa125', make: 'Honda', model: 'Activa 125', type: 'SCOOTER', fuelType: 'PETROL', cc: 124, exShowroom2026: 95000, popular: true },
  { id: 'honda_shine125', make: 'Honda', model: 'SP Shine 125', type: 'BIKE', fuelType: 'PETROL', cc: 124, exShowroom2026: 82000, popular: true },
  { id: 'honda_unicorn', make: 'Honda', model: 'Unicorn', type: 'BIKE', fuelType: 'PETROL', cc: 162, exShowroom2026: 105000, popular: false },

  // Hero MotoCorp
  { id: 'hero_splendor_plus', make: 'Hero', model: 'Splendor Plus', type: 'BIKE', fuelType: 'PETROL', cc: 97, exShowroom2026: 75000, popular: true },
  { id: 'hero_splendor_xtec', make: 'Hero', model: 'Splendor Plus X TEC', type: 'BIKE', fuelType: 'PETROL', cc: 97, exShowroom2026: 82000, popular: true },
  { id: 'hero_hf_deluxe', make: 'Hero', model: 'HF Deluxe', type: 'BIKE', fuelType: 'PETROL', cc: 97, exShowroom2026: 68000, popular: true },
  { id: 'hero_passion_pro', make: 'Hero', model: 'Passion Pro', type: 'BIKE', fuelType: 'PETROL', cc: 113, exShowroom2026: 82000, popular: true },
  { id: 'hero_glamour', make: 'Hero', model: 'Glamour', type: 'BIKE', fuelType: 'PETROL', cc: 125, exShowroom2026: 90000, popular: true },
  { id: 'hero_xpulse200', make: 'Hero', model: 'XPulse 200', type: 'BIKE', fuelType: 'PETROL', cc: 199, exShowroom2026: 145000, popular: false },

  // Bajaj
  { id: 'bajaj_pulsar_ns160', make: 'Bajaj', model: 'Pulsar NS160', type: 'BIKE', fuelType: 'PETROL', cc: 160, exShowroom2026: 130000, popular: true },
  { id: 'bajaj_pulsar_150', make: 'Bajaj', model: 'Pulsar 150', type: 'BIKE', fuelType: 'PETROL', cc: 149, exShowroom2026: 120000, popular: true },
  { id: 'bajaj_pulsar_n250', make: 'Bajaj', model: 'Pulsar N250', type: 'BIKE', fuelType: 'PETROL', cc: 250, exShowroom2026: 165000, popular: true },
  { id: 'bajaj_platina110', make: 'Bajaj', model: 'Platina 110', type: 'BIKE', fuelType: 'PETROL', cc: 115, exShowroom2026: 70000, popular: true },
  { id: 'bajaj_avenger160', make: 'Bajaj', model: 'Avenger Street 160', type: 'BIKE', fuelType: 'PETROL', cc: 160, exShowroom2026: 125000, popular: false },

  // TVS
  { id: 'tvs_jupiter', make: 'TVS', model: 'Jupiter 125', type: 'SCOOTER', fuelType: 'PETROL', cc: 124, exShowroom2026: 88000, popular: true },
  { id: 'tvs_apache_rtr160', make: 'TVS', model: 'Apache RTR 160 4V', type: 'BIKE', fuelType: 'PETROL', cc: 160, exShowroom2026: 130000, popular: true },
  { id: 'tvs_ntorq', make: 'TVS', model: 'NTORQ 125', type: 'SCOOTER', fuelType: 'PETROL', cc: 124, exShowroom2026: 92000, popular: true },
  { id: 'tvs_radeon', make: 'TVS', model: 'Radeon', type: 'BIKE', fuelType: 'PETROL', cc: 110, exShowroom2026: 72000, popular: true },
  { id: 'tvs_raider', make: 'TVS', model: 'Raider 125', type: 'BIKE', fuelType: 'PETROL', cc: 124, exShowroom2026: 95000, popular: true },

  // Royal Enfield
  { id: 're_classic350', make: 'Royal Enfield', model: 'Classic 350', type: 'BIKE', fuelType: 'PETROL', cc: 349, exShowroom2026: 220000, popular: true },
  { id: 're_meteor350', make: 'Royal Enfield', model: 'Meteor 350', type: 'BIKE', fuelType: 'PETROL', cc: 349, exShowroom2026: 235000, popular: true },
  { id: 're_hunter350', make: 'Royal Enfield', model: 'Hunter 350', type: 'BIKE', fuelType: 'PETROL', cc: 349, exShowroom2026: 180000, popular: true },
  { id: 're_bullet350', make: 'Royal Enfield', model: 'Bullet 350', type: 'BIKE', fuelType: 'PETROL', cc: 349, exShowroom2026: 195000, popular: true },

  // Yamaha
  { id: 'yamaha_fz_v3', make: 'Yamaha', model: 'FZ V3.0', type: 'BIKE', fuelType: 'PETROL', cc: 149, exShowroom2026: 115000, popular: true },
  { id: 'yamaha_r15v4', make: 'Yamaha', model: 'R15 V4', type: 'BIKE', fuelType: 'PETROL', cc: 155, exShowroom2026: 185000, popular: true },
  { id: 'yamaha_fascino', make: 'Yamaha', model: 'Fascino 125', type: 'SCOOTER', fuelType: 'PETROL', cc: 124, exShowroom2026: 88000, popular: true },

  // Suzuki
  { id: 'suzuki_access125', make: 'Suzuki', model: 'Access 125', type: 'SCOOTER', fuelType: 'PETROL', cc: 124, exShowroom2026: 92000, popular: true },
  { id: 'suzuki_gixxer150', make: 'Suzuki', model: 'Gixxer 150', type: 'BIKE', fuelType: 'PETROL', cc: 155, exShowroom2026: 120000, popular: false },

  // ══ TWO WHEELERS — ELECTRIC ══
  { id: 'bajaj_chetak_3503', make: 'Bajaj', model: 'Chetak 3503', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 3.5, exShowroom2026: 118000, popular: true },
  { id: 'bajaj_chetak_2901', make: 'Bajaj', model: 'Chetak 2901', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 2.9, exShowroom2026: 110000, popular: true },
  { id: 'tvs_iqube_st', make: 'TVS', model: 'iQube ST', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 4.4, exShowroom2026: 145000, popular: true },
  { id: 'tvs_iqube_s', make: 'TVS', model: 'iQube S', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 3.0, exShowroom2026: 130000, popular: true },
  { id: 'ola_s1_pro', make: 'Ola', model: 'S1 Pro Gen 2', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 6.0, exShowroom2026: 155000, popular: true },
  { id: 'ola_s1_air', make: 'Ola', model: 'S1 Air', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 2.5, exShowroom2026: 105000, popular: true },
  { id: 'ather_450x', make: 'Ather', model: '450X Gen 4', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 6.0, exShowroom2026: 160000, popular: true },
  { id: 'ather_450s', make: 'Ather', model: '450S', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 6.0, exShowroom2026: 130000, popular: true },
  { id: 'hero_vidaV2', make: 'Hero', model: 'Vida V2', type: 'EV_BIKE', fuelType: 'ELECTRIC', kw: 3.9, exShowroom2026: 110000, popular: true },
  { id: 'comptech_mars', make: 'Comptech', model: 'Mars 1.5', type: 'EV_BIKE', fuelType: 'ELECTRIC', watt: 250, kw: 0.25, exShowroom2026: 58000, popular: false },

  // ══ CARS — PETROL ══
  // Maruti Suzuki
  { id: 'ms_swift', make: 'Maruti Suzuki', model: 'Swift', type: 'CAR', fuelType: 'PETROL', cc: 1197, exShowroom2026: 680000, popular: true },
  { id: 'ms_baleno', make: 'Maruti Suzuki', model: 'Baleno', type: 'CAR', fuelType: 'PETROL', cc: 1197, exShowroom2026: 780000, popular: true },
  { id: 'ms_dzire', make: 'Maruti Suzuki', model: 'Dzire', type: 'CAR', fuelType: 'PETROL', cc: 1197, exShowroom2026: 700000, popular: true },
  { id: 'ms_wagonr', make: 'Maruti Suzuki', model: 'WagonR', type: 'CAR', fuelType: 'PETROL', cc: 998, exShowroom2026: 620000, popular: true },
  { id: 'ms_brezza', make: 'Maruti Suzuki', model: 'Brezza', type: 'CAR', fuelType: 'PETROL', cc: 1462, exShowroom2026: 1000000, popular: true },
  { id: 'ms_ertiga', make: 'Maruti Suzuki', model: 'Ertiga', type: 'CAR', fuelType: 'PETROL', cc: 1462, exShowroom2026: 920000, popular: true },
  { id: 'ms_alto_k10', make: 'Maruti Suzuki', model: 'Alto K10', type: 'CAR', fuelType: 'PETROL', cc: 998, exShowroom2026: 540000, popular: true },
  { id: 'ms_fronx', make: 'Maruti Suzuki', model: 'Fronx', type: 'CAR', fuelType: 'PETROL', cc: 1197, exShowroom2026: 900000, popular: true },
  { id: 'ms_grand_vitara', make: 'Maruti Suzuki', model: 'Grand Vitara', type: 'CAR', fuelType: 'PETROL', cc: 1490, exShowroom2026: 1200000, popular: true },

  // Hyundai
  { id: 'hyundai_i20', make: 'Hyundai', model: 'i20', type: 'CAR', fuelType: 'PETROL', cc: 1197, exShowroom2026: 820000, popular: true },
  { id: 'hyundai_creta', make: 'Hyundai', model: 'Creta', type: 'CAR', fuelType: 'PETROL', cc: 1497, exShowroom2026: 1200000, popular: true },
  { id: 'hyundai_venue', make: 'Hyundai', model: 'Venue', type: 'CAR', fuelType: 'PETROL', cc: 998, exShowroom2026: 850000, popular: true },
  { id: 'hyundai_verna', make: 'Hyundai', model: 'Verna', type: 'CAR', fuelType: 'PETROL', cc: 1497, exShowroom2026: 1100000, popular: true },
  { id: 'hyundai_exter', make: 'Hyundai', model: 'Exter', type: 'CAR', fuelType: 'PETROL', cc: 998, exShowroom2026: 750000, popular: true },

  // Tata
  { id: 'tata_tiago', make: 'Tata', model: 'Tiago', type: 'CAR', fuelType: 'PETROL', cc: 1199, exShowroom2026: 620000, popular: true },
  { id: 'tata_punch', make: 'Tata', model: 'Punch', type: 'CAR', fuelType: 'PETROL', cc: 1199, exShowroom2026: 780000, popular: true },
  { id: 'tata_nexon', make: 'Tata', model: 'Nexon', type: 'CAR', fuelType: 'PETROL', cc: 1199, exShowroom2026: 920000, popular: true },
  { id: 'tata_harrier', make: 'Tata', model: 'Harrier', type: 'CAR', fuelType: 'PETROL', cc: 1956, exShowroom2026: 1600000, popular: true },
  { id: 'tata_safari', make: 'Tata', model: 'Safari', type: 'CAR', fuelType: 'PETROL', cc: 1956, exShowroom2026: 1700000, popular: true },

  // Kia
  { id: 'kia_sonet', make: 'Kia', model: 'Sonet', type: 'CAR', fuelType: 'PETROL', cc: 998, exShowroom2026: 850000, popular: true },
  { id: 'kia_seltos', make: 'Kia', model: 'Seltos', type: 'CAR', fuelType: 'PETROL', cc: 1497, exShowroom2026: 1150000, popular: true },
  { id: 'kia_carens', make: 'Kia', model: 'Carens', type: 'CAR', fuelType: 'PETROL', cc: 1497, exShowroom2026: 1100000, popular: true },

  // Honda Cars
  { id: 'honda_city', make: 'Honda', model: 'City', type: 'CAR', fuelType: 'PETROL', cc: 1498, exShowroom2026: 1250000, popular: true },
  { id: 'honda_amaze', make: 'Honda', model: 'Amaze', type: 'CAR', fuelType: 'PETROL', cc: 1199, exShowroom2026: 750000, popular: true },
  { id: 'honda_elevate', make: 'Honda', model: 'Elevate', type: 'CAR', fuelType: 'PETROL', cc: 1498, exShowroom2026: 1150000, popular: true },

  // Toyota
  { id: 'toyota_innova_hycross', make: 'Toyota', model: 'Innova Hycross', type: 'CAR', fuelType: 'PETROL', cc: 1987, exShowroom2026: 2100000, popular: true },
  { id: 'toyota_hyryder', make: 'Toyota', model: 'Urban Cruiser Hyryder', type: 'CAR', fuelType: 'PETROL', cc: 1490, exShowroom2026: 1200000, popular: true },

  // ══ CARS — DIESEL ══
  { id: 'mahindra_thar', make: 'Mahindra', model: 'Thar', type: 'CAR', fuelType: 'DIESEL', cc: 2184, exShowroom2026: 1800000, popular: true },
  { id: 'mahindra_scorpio_n', make: 'Mahindra', model: 'Scorpio N', type: 'CAR', fuelType: 'DIESEL', cc: 2184, exShowroom2026: 1500000, popular: true },
  { id: 'mahindra_bolero', make: 'Mahindra', model: 'Bolero', type: 'CAR', fuelType: 'DIESEL', cc: 1493, exShowroom2026: 1000000, popular: true },
  { id: 'mahindra_xuv300', make: 'Mahindra', model: 'XUV 3XO', type: 'CAR', fuelType: 'DIESEL', cc: 1497, exShowroom2026: 900000, popular: true },
  { id: 'tata_nexon_diesel', make: 'Tata', model: 'Nexon (Diesel)', type: 'CAR', fuelType: 'DIESEL', cc: 1497, exShowroom2026: 1050000, popular: true },

  // ══ CARS — ELECTRIC ══
  { id: 'tata_tiago_ev', make: 'Tata', model: 'Tiago EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 21, exShowroom2026: 895000, popular: true },
  { id: 'tata_nexon_ev', make: 'Tata', model: 'Nexon EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 30, exShowroom2026: 1450000, popular: true },
  { id: 'tata_punch_ev', make: 'Tata', model: 'Punch EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 25, exShowroom2026: 1000000, popular: true },
  { id: 'tata_curvv_ev', make: 'Tata', model: 'Curvv EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 55, exShowroom2026: 1800000, popular: true },
  { id: 'mg_windsor', make: 'MG', model: 'Windsor EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 52, exShowroom2026: 1500000, popular: true },
  { id: 'mg_comet', make: 'MG', model: 'Comet EV', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 17, exShowroom2026: 750000, popular: true },
  { id: 'hyundai_creta_ev', make: 'Hyundai', model: 'Creta Electric', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 51, exShowroom2026: 1800000, popular: true },
  { id: 'mahindra_be6', make: 'Mahindra', model: 'BE 6', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 59, exShowroom2026: 1900000, popular: true },
  { id: 'kia_ev6', make: 'Kia', model: 'EV6', type: 'EV_CAR', fuelType: 'ELECTRIC', kw: 77, exShowroom2026: 6500000, popular: false },
];

// Get vehicle category for rate lookup
export function getVehicleCategory(vehicle: Vehicle): string {
  if (vehicle.type === 'BIKE' || vehicle.type === 'SCOOTER') return 'BIKE_PETROL';
  if (vehicle.type === 'EV_BIKE') {
    if ((vehicle.watt && vehicle.watt < 1000) || (vehicle.kw && vehicle.kw < 1)) return 'BIKE_EV_kw_below_1';
    if (vehicle.kw && vehicle.kw <= 4) return 'BIKE_EV_kw_1_to_4';
    return 'BIKE_EV_kw_above_4';
  }
  if (vehicle.type === 'EV_CAR') {
    if (vehicle.kw && vehicle.kw < 30) return 'CAR_EV_kw_below_30';
    if (vehicle.kw && vehicle.kw <= 65) return 'CAR_EV_kw_30_to_65';
    return 'CAR_EV_kw_above_65';
  }
  if (vehicle.type === 'CAR') {
    if (vehicle.cc && vehicle.cc < 1000) return 'CAR_PETROL_DIESEL_cc_below_1000';
    if (vehicle.cc && vehicle.cc <= 1500) return 'CAR_PETROL_DIESEL_cc_1000_to_1500';
    return 'CAR_PETROL_DIESEL_cc_above_1500';
  }
  return 'BIKE_PETROL';
}

// Get age band for rate lookup
export function getAgeBand(age: number): string {
  if (age <= 1) return 'age_0_to_1';
  if (age <= 3) return 'age_1_to_3';
  if (age <= 5) return 'age_3_to_5';
  if (age <= 10) return 'age_5_to_10';
  return 'age_above_10';
}

// Get TP band for vehicle
export function getTPBand(vehicle: Vehicle): string {
  if (vehicle.type === 'EV_BIKE') {
    if ((vehicle.kw ?? 0) <= 4) return 'upto4kW';
    return 'above4kW';
  }
  if (vehicle.type === 'EV_CAR') {
    if ((vehicle.kw ?? 0) <= 30) return 'upto30kW';
    if ((vehicle.kw ?? 0) <= 65) return '30to65kW';
    return 'above65kW';
  }
  if (vehicle.type === 'CAR') {
    if ((vehicle.cc ?? 0) <= 1000) return 'upto1000cc';
    if ((vehicle.cc ?? 0) <= 1500) return '1001to1500cc';
    return 'above1500cc';
  }
  // BIKE or SCOOTER
  if ((vehicle.cc ?? 0) <= 75) return 'upto75cc';
  if ((vehicle.cc ?? 0) <= 150) return '76to150cc';
  if ((vehicle.cc ?? 0) <= 350) return '151to350cc';
  return 'above350cc';
}

// Calculate IDV
export function calculateIDV(vehicle: Vehicle, year: number): number {
  const age = new Date().getFullYear() - year;
  const depKey = Math.min(age, 5);
  const dep = IDV_DEP[depKey] ?? 0.40;
  return Math.round(vehicle.exShowroom2026 * (1 - dep));
}

// Search vehicles
export function searchVehicles(query: string): Vehicle[] {
  const q = query.toLowerCase();
  return VEHICLE_DB.filter(v =>
    v.make.toLowerCase().includes(q) ||
    v.model.toLowerCase().includes(q) ||
    v.id.toLowerCase().includes(q)
  ).slice(0, 12);
}

// Get popular vehicles
export function getPopularVehicles(type?: string): Vehicle[] {
  return VEHICLE_DB.filter(v => {
    if (!v.popular) return false;
    if (type === 'bike') return v.type === 'BIKE' || v.type === 'SCOOTER';
    if (type === 'ev_bike') return v.type === 'EV_BIKE';
    if (type === 'car') return v.type === 'CAR';
    if (type === 'ev_car') return v.type === 'EV_CAR';
    return true;
  });
}

// Format currency in INR
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}
