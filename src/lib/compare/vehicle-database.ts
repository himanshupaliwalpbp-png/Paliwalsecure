// =============================================================================
// Comprehensive Indian Vehicle Database for Motor Insurance Comparator
// 50+ popular cars and bikes with full specification data
// Prices are approximate ex-showroom (Delhi) as of Q1 2026
// =============================================================================

export type VehicleSegment = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Coupe' | 'Scooter' | 'Sports Bike' | 'Cruiser' | 'Commuter';
export type VehicleFuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
export type VehicleCategory = 'Car' | 'Bike' | 'EV_CAR' | 'EV_BIKE';

export interface VehicleModel {
  id: string;                    // unique identifier
  make: string;                  // manufacturer
  model: string;                 // model name
  variant: string;               // variant name
  category: VehicleCategory;     // Car / Bike / EV_CAR / EV_BIKE
  segment: VehicleSegment;
  fuelType: VehicleFuelType;
  exShowroomPrice: number;       // ₹ ex-showroom Delhi
  engineCC: number;              // 0 for EVs
  seatingCapacity: number;
  powerKW?: number;              // for EVs
  batteryKWh?: number;           // for EVs
}

// =============================================================================
// CARS — Petrol / Diesel / CNG
// =============================================================================

const CAR_MODELS: VehicleModel[] = [
  // ─── Maruti Suzuki ──────────────────────────────────────────────────────
  { id: 'maruti-alto-k10-lxi', make: 'Maruti Suzuki', model: 'Alto K10', variant: 'LXi', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 399000, engineCC: 998, seatingCapacity: 5 },
  { id: 'maruti-wagonr-lxi', make: 'Maruti Suzuki', model: 'WagonR', variant: 'LXi', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 559000, engineCC: 998, seatingCapacity: 5 },
  { id: 'maruti-wagonr-zxi-cng', make: 'Maruti Suzuki', model: 'WagonR', variant: 'ZXi CNG', category: 'Car', segment: 'Hatchback', fuelType: 'CNG', exShowroomPrice: 649000, engineCC: 998, seatingCapacity: 5 },
  { id: 'maruti-swift-lxi', make: 'Maruti Suzuki', model: 'Swift', variant: 'LXi', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 649000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'maruti-swift-zxi', make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 959000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'maruti-baleno-zeta', make: 'Maruti Suzuki', model: 'Baleno', variant: 'Zeta', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 799000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'maruti-dzire-zxi', make: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 799000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'maruti-brezza-zxi', make: 'Maruti Suzuki', model: 'Brezza', variant: 'ZXi+', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1034000, engineCC: 1462, seatingCapacity: 5 },
  { id: 'maruti-ertiga-zxi', make: 'Maruti Suzuki', model: 'Ertiga', variant: 'ZXi+', category: 'Car', segment: 'MUV', fuelType: 'Petrol', exShowroomPrice: 1159000, engineCC: 1462, seatingCapacity: 7 },
  { id: 'maruti-xl6-alpha', make: 'Maruti Suzuki', model: 'XL6', variant: 'Alpha', category: 'Car', segment: 'MUV', fuelType: 'Petrol', exShowroomPrice: 1299000, engineCC: 1462, seatingCapacity: 6 },
  { id: 'maruti-fronx-alpha', make: 'Maruti Suzuki', model: 'Fronx', variant: 'Alpha', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1019000, engineCC: 1197, seatingCapacity: 5 },

  // ─── Hyundai ────────────────────────────────────────────────────────────
  { id: 'hyundai-i20-magna', make: 'Hyundai', model: 'i20', variant: 'Magna', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 729000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'hyundai-i20-asta', make: 'Hyundai', model: 'i20', variant: 'Asta(O)', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 1059000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'hyundai-venue-sx', make: 'Hyundai', model: 'Venue', variant: 'SX(O)', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1059000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'hyundai-venue-sx-diesel', make: 'Hyundai', model: 'Venue', variant: 'SX Diesel', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1149000, engineCC: 1493, seatingCapacity: 5 },
  { id: 'hyundai-creta-sx', make: 'Hyundai', model: 'Creta', variant: 'SX(O)', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1599000, engineCC: 1497, seatingCapacity: 5 },
  { id: 'hyundai-creta-sx-diesel', make: 'Hyundai', model: 'Creta', variant: 'SX Diesel', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1799000, engineCC: 1493, seatingCapacity: 5 },
  { id: 'hyundai-verna-sx', make: 'Hyundai', model: 'Verna', variant: 'SX(O)', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 1499000, engineCC: 1497, seatingCapacity: 5 },
  { id: 'hyundai-tucson-signature', make: 'Hyundai', model: 'Tucson', variant: 'Signature', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 2929000, engineCC: 1999, seatingCapacity: 5 },

  // ─── Tata ──────────────────────────────────────────────────────────────
  { id: 'tata-tiago-xm', make: 'Tata', model: 'Tiago', variant: 'XM', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 565000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'tata-punch-accomplished', make: 'Tata', model: 'Punch', variant: 'Accomplished', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 799000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'tata-punch-cng', make: 'Tata', model: 'Punch', variant: 'Accomplished CNG', category: 'Car', segment: 'SUV', fuelType: 'CNG', exShowroomPrice: 879000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'tata-nexon-fearless', make: 'Tata', model: 'Nexon', variant: 'Fearless+', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1099000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'tata-nexon-fearless-diesel', make: 'Tata', model: 'Nexon', variant: 'Fearless+ Diesel', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1259000, engineCC: 1497, seatingCapacity: 5 },
  { id: 'tata-curvv-fearless', make: 'Tata', model: 'Curvv', variant: 'Fearless+', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1299000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'tata-harrier-fearless', make: 'Tata', model: 'Harrier', variant: 'Fearless+', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1999000, engineCC: 1956, seatingCapacity: 5 },
  { id: 'tata-safari-accomplished', make: 'Tata', model: 'Safari', variant: 'Accomplished+', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 2099000, engineCC: 1956, seatingCapacity: 7 },

  // ─── Mahindra ──────────────────────────────────────────────────────────
  { id: 'mahindra-xuv300-w8', make: 'Mahindra', model: 'XUV300', variant: 'W8(O)', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1049000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'mahindra-thar-lx', make: 'Mahindra', model: 'Thar', variant: 'LX', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1399000, engineCC: 1497, seatingCapacity: 4 },
  { id: 'mahindra-xuv700-ax7', make: 'Mahindra', model: 'XUV700', variant: 'AX7', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1799000, engineCC: 2184, seatingCapacity: 7 },
  { id: 'mahindra-scorpio-n-z8', make: 'Mahindra', model: 'Scorpio-N', variant: 'Z8', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 1599000, engineCC: 2184, seatingCapacity: 7 },
  { id: 'mahindra-xuv400-el', make: 'Mahindra', model: 'XUV400', variant: 'EL', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1599000, engineCC: 0, seatingCapacity: 5, powerKW: 39.4, batteryKWh: 39.4 },

  // ─── Honda ──────────────────────────────────────────────────────────────
  { id: 'honda-amaze-vx', make: 'Honda', model: 'Amaze', variant: 'VX', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 889000, engineCC: 1199, seatingCapacity: 5 },
  { id: 'honda-city-zx', make: 'Honda', model: 'City', variant: 'ZX', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 1299000, engineCC: 1498, seatingCapacity: 5 },
  { id: 'honda-city-zx-diesel', make: 'Honda', model: 'City', variant: 'ZX Diesel', category: 'Car', segment: 'Sedan', fuelType: 'Diesel', exShowroomPrice: 1399000, engineCC: 1497, seatingCapacity: 5 },

  // ─── Toyota ──────────────────────────────────────────────────────────────
  { id: 'toyota-glanza-v', make: 'Toyota', model: 'Glanza', variant: 'V', category: 'Car', segment: 'Hatchback', fuelType: 'Petrol', exShowroomPrice: 799000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'toyota-urban-cruiser-hyryder', make: 'Toyota', model: 'Urban Cruiser Hyryder', variant: 'V', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1199000, engineCC: 1462, seatingCapacity: 5 },
  { id: 'toyota-innova-crysta-zx', make: 'Toyota', model: 'Innova Crysta', variant: 'ZX', category: 'Car', segment: 'MUV', fuelType: 'Diesel', exShowroomPrice: 2199000, engineCC: 2393, seatingCapacity: 7 },
  { id: 'toyota-fortuner-sigma', make: 'Toyota', model: 'Fortuner', variant: 'Sigma', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 3399000, engineCC: 2755, seatingCapacity: 7 },

  // ─── Kia ────────────────────────────────────────────────────────────────
  { id: 'kia-sonet-gtx', make: 'Kia', model: 'Sonet', variant: 'GTX+', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1299000, engineCC: 1197, seatingCapacity: 5 },
  { id: 'kia-seltos-gtx', make: 'Kia', model: 'Seltos', variant: 'GTX+', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1699000, engineCC: 1497, seatingCapacity: 5 },
  { id: 'kia-carens-luxury', make: 'Kia', model: 'Carens', variant: 'Luxury+', category: 'Car', segment: 'MUV', fuelType: 'Petrol', exShowroomPrice: 1499000, engineCC: 1497, seatingCapacity: 7 },

  // ─── MG ──────────────────────────────────────────────────────────────────
  { id: 'mg-hector-sharp', make: 'MG', model: 'Hector', variant: 'Sharp', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1599000, engineCC: 1451, seatingCapacity: 5 },
  { id: 'mg-zs-ev-exclusive', make: 'MG', model: 'ZS EV', variant: 'Exclusive', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1999000, engineCC: 0, seatingCapacity: 5, powerKW: 50.3, batteryKWh: 50.3 },

  // ─── Skoda ──────────────────────────────────────────────────────────────
  { id: 'skoda-kushaq-style', make: 'Skoda', model: 'Kushaq', variant: 'Style', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1499000, engineCC: 1498, seatingCapacity: 5 },
  { id: 'skoda-slavia-style', make: 'Skoda', model: 'Slavia', variant: 'Style', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 1499000, engineCC: 1498, seatingCapacity: 5 },

  // ─── Volkswagen ─────────────────────────────────────────────────────────
  { id: 'vw-taigun-gt', make: 'Volkswagen', model: 'Taigun', variant: 'GT Plus', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 1599000, engineCC: 1498, seatingCapacity: 5 },
  { id: 'vw-virtus-gt', make: 'Volkswagen', model: 'Virtus', variant: 'GT Plus', category: 'Car', segment: 'Sedan', fuelType: 'Petrol', exShowroomPrice: 1549000, engineCC: 1498, seatingCapacity: 5 },

  // ─── Jeep ───────────────────────────────────────────────────────────────
  { id: 'jeep-compass-limited', make: 'Jeep', model: 'Compass', variant: 'Limited(O)', category: 'Car', segment: 'SUV', fuelType: 'Diesel', exShowroomPrice: 2249000, engineCC: 1956, seatingCapacity: 5 },

  // ─── BYD ────────────────────────────────────────────────────────────────
  { id: 'byd-atto3-premium', make: 'BYD', model: 'Atto 3', variant: 'Premium', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 2499000, engineCC: 0, seatingCapacity: 5, powerKW: 60.4, batteryKWh: 60.4 },

  // ─── Renault / Nissan ──────────────────────────────────────────────────
  { id: 'renault-triber-rxt', make: 'Renault', model: 'Triber', variant: 'RXZ', category: 'Car', segment: 'MUV', fuelType: 'Petrol', exShowroomPrice: 799000, engineCC: 999, seatingCapacity: 7 },
  { id: 'nissan-magnite-turbo', make: 'Nissan', model: 'Magnite', variant: 'Turbo XV Premium', category: 'Car', segment: 'SUV', fuelType: 'Petrol', exShowroomPrice: 899000, engineCC: 999, seatingCapacity: 5 },
];

// =============================================================================
// EV CARS
// =============================================================================

const EV_CAR_MODELS: VehicleModel[] = [
  { id: 'tata-tiago-ev-xz', make: 'Tata', model: 'Tiago EV', variant: 'XZ+', category: 'EV_CAR', segment: 'Hatchback', fuelType: 'Electric', exShowroomPrice: 799000, engineCC: 0, seatingCapacity: 5, powerKW: 26, batteryKWh: 26 },
  { id: 'tata-nexon-ev-fearless', make: 'Tata', model: 'Nexon EV', variant: 'Fearless+', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1499000, engineCC: 0, seatingCapacity: 5, powerKW: 40.5, batteryKWh: 40.5 },
  { id: 'tata-curvv-ev-fearless', make: 'Tata', model: 'Curvv EV', variant: 'Fearless+', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1799000, engineCC: 0, seatingCapacity: 5, powerKW: 45, batteryKWh: 45 },
  { id: 'mg-zs-ev-exclusive', make: 'MG', model: 'ZS EV', variant: 'Exclusive', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1999000, engineCC: 0, seatingCapacity: 5, powerKW: 50.3, batteryKWh: 50.3 },
  { id: 'mahindra-xuv400-el', make: 'Mahindra', model: 'XUV400', variant: 'EL', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 1599000, engineCC: 0, seatingCapacity: 5, powerKW: 39.4, batteryKWh: 39.4 },
  { id: 'byd-atto3-premium-ev', make: 'BYD', model: 'Atto 3', variant: 'Premium', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 2499000, engineCC: 0, seatingCapacity: 5, powerKW: 60.4, batteryKWh: 60.4 },
  { id: 'hyundai-ioniq-5', make: 'Hyundai', model: 'Ioniq 5', variant: 'Long Range', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 3599000, engineCC: 0, seatingCapacity: 5, powerKW: 72.6, batteryKWh: 72.6 },
  { id: 'kia-ev6-gt', make: 'Kia', model: 'EV6', variant: 'GT Line', category: 'EV_CAR', segment: 'SUV', fuelType: 'Electric', exShowroomPrice: 4199000, engineCC: 0, seatingCapacity: 5, powerKW: 77.4, batteryKWh: 77.4 },
];

// =============================================================================
// BIKES — Petrol
// =============================================================================

const BIKE_MODELS: VehicleModel[] = [
  // ─── Hero ───────────────────────────────────────────────────────────────
  { id: 'hero-hf-deluxe', make: 'Hero', model: 'HF Deluxe', variant: 'Self Start', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 60000, engineCC: 97, seatingCapacity: 2 },
  { id: 'hero-splendor-plus', make: 'Hero', model: 'Splendor Plus', variant: 'Xtec', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 75000, engineCC: 97, seatingCapacity: 2 },
  { id: 'hero-glamour', make: 'Hero', model: 'Glamour', variant: 'Xtec', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 92000, engineCC: 124, seatingCapacity: 2 },
  { id: 'hero-xtreme-160r', make: 'Hero', model: 'Xtreme 160R', variant: 'Pro', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 128000, engineCC: 163, seatingCapacity: 2 },
  { id: 'hero-karizma-xmr', make: 'Hero', model: 'Karizma XMR', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 180000, engineCC: 210, seatingCapacity: 2 },

  // ─── Honda ───────────────────────────────────────────────────────────────
  { id: 'honda-shine-100', make: 'Honda', model: 'Shine 100', variant: 'Standard', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 65000, engineCC: 98, seatingCapacity: 2 },
  { id: 'honda-cb-shine', make: 'Honda', model: 'CB Shine', variant: 'SP', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 82000, engineCC: 124, seatingCapacity: 2 },
  { id: 'honda-sp160', make: 'Honda', model: 'SP160', variant: 'Dual Disc', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 120000, engineCC: 162, seatingCapacity: 2 },
  { id: 'honda-hornet-2.0', make: 'Honda', model: 'Hornet 2.0', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 140000, engineCC: 184, seatingCapacity: 2 },
  { id: 'honda-cb350', make: 'Honda', model: 'CB350', variant: 'Hness', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 200000, engineCC: 348, seatingCapacity: 2 },

  // ─── Bajaj ───────────────────────────────────────────────────────────────
  { id: 'bajaj-platina-100', make: 'Bajaj', model: 'Platina 100', variant: 'ES', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 68000, engineCC: 102, seatingCapacity: 2 },
  { id: 'bajaj-pulsar-150', make: 'Bajaj', model: 'Pulsar 150', variant: 'Dual Disc', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 112000, engineCC: 149, seatingCapacity: 2 },
  { id: 'bajaj-pulsar-ns200', make: 'Bajaj', model: 'Pulsar NS200', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 159000, engineCC: 199, seatingCapacity: 2 },
  { id: 'bajaj-pulsar-n250', make: 'Bajaj', model: 'Pulsar N250', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 165000, engineCC: 249, seatingCapacity: 2 },
  { id: 'bajaj-dominar-400', make: 'Bajaj', model: 'Dominar 400', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 222000, engineCC: 373, seatingCapacity: 2 },

  // ─── TVS ─────────────────────────────────────────────────────────────────
  { id: 'tvs-raider-125', make: 'TVS', model: 'Raider 125', variant: 'Disc', category: 'Bike', segment: 'Commuter', fuelType: 'Petrol', exShowroomPrice: 97000, engineCC: 124, seatingCapacity: 2 },
  { id: 'tvs-apache-rtr-160', make: 'TVS', model: 'Apache RTR 160', variant: '4V', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 130000, engineCC: 160, seatingCapacity: 2 },
  { id: 'tvs-apache-rtr-200', make: 'TVS', model: 'Apache RTR 200', variant: '4V', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 148000, engineCC: 198, seatingCapacity: 2 },
  { id: 'tvs-ronin', make: 'TVS', model: 'Ronin', variant: 'TD', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 150000, engineCC: 223, seatingCapacity: 2 },

  // ─── Yamaha ──────────────────────────────────────────────────────────────
  { id: 'yamaha-fz-s', make: 'Yamaha', model: 'FZ-S', variant: 'V4 Deluxe', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 132000, engineCC: 149, seatingCapacity: 2 },
  { id: 'yamaha-r15', make: 'Yamaha', model: 'R15', variant: 'V4', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 182000, engineCC: 155, seatingCapacity: 2 },
  { id: 'yamaha-mt-15', make: 'Yamaha', model: 'MT-15', variant: 'V2', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 168000, engineCC: 155, seatingCapacity: 2 },

  // ─── Royal Enfield ───────────────────────────────────────────────────────
  { id: 're-bullet-350', make: 'Royal Enfield', model: 'Bullet 350', variant: 'Standard', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 173000, engineCC: 349, seatingCapacity: 2 },
  { id: 're-classic-350', make: 'Royal Enfield', model: 'Classic 350', variant: 'Signals', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 195000, engineCC: 349, seatingCapacity: 2 },
  { id: 're-hunter-350', make: 'Royal Enfield', model: 'Hunter 350', variant: 'Rebel', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 150000, engineCC: 349, seatingCapacity: 2 },
  { id: 're-meteor-350', make: 'Royal Enfield', model: 'Meteor 350', variant: 'Stellar', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 210000, engineCC: 349, seatingCapacity: 2 },
  { id: 're-himalayan', make: 'Royal Enfield', model: 'Himalayan', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 249000, engineCC: 411, seatingCapacity: 2 },
  { id: 're-gt-650', make: 'Royal Enfield', model: 'Continental GT 650', variant: 'Standard', category: 'Bike', segment: 'Cruiser', fuelType: 'Petrol', exShowroomPrice: 315000, engineCC: 648, seatingCapacity: 2 },

  // ─── KTM ─────────────────────────────────────────────────────────────────
  { id: 'ktm-duke-200', make: 'KTM', model: 'Duke 200', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 183000, engineCC: 199, seatingCapacity: 2 },
  { id: 'ktm-duke-390', make: 'KTM', model: 'Duke 390', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 295000, engineCC: 373, seatingCapacity: 2 },
  { id: 'ktm-rc-200', make: 'KTM', model: 'RC 200', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 220000, engineCC: 199, seatingCapacity: 2 },

  // ─── Kawasaki ────────────────────────────────────────────────────────────
  { id: 'kawasaki-ninja-300', make: 'Kawasaki', model: 'Ninja 300', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 343000, engineCC: 296, seatingCapacity: 2 },
  { id: 'kawasaki-z650', make: 'Kawasaki', model: 'Z650', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 665000, engineCC: 649, seatingCapacity: 2 },

  // ─── Suzuki ──────────────────────────────────────────────────────────────
  { id: 'suzuki-access-125', make: 'Suzuki', model: 'Access 125', variant: 'Special Edition', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 89000, engineCC: 124, seatingCapacity: 2 },
  { id: 'suzuki-gixxer-sf', make: 'Suzuki', model: 'Gixxer SF', variant: '250', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 192000, engineCC: 249, seatingCapacity: 2 },
  { id: 'suzuki-v-strom-sx', make: 'Suzuki', model: 'V-Strom SX', variant: 'Standard', category: 'Bike', segment: 'Sports Bike', fuelType: 'Petrol', exShowroomPrice: 215000, engineCC: 249, seatingCapacity: 2 },
];

// =============================================================================
// EV BIKES / SCOOTERS
// =============================================================================

const EV_BIKE_MODELS: VehicleModel[] = [
  { id: 'ola-s1-air', make: 'Ola Electric', model: 'S1 Air', variant: 'Standard', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 107000, engineCC: 0, seatingCapacity: 2, powerKW: 3, batteryKWh: 3 },
  { id: 'ola-s1-pro', make: 'Ola Electric', model: 'S1 Pro', variant: 'Standard', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 139000, engineCC: 0, seatingCapacity: 2, powerKW: 8, batteryKWh: 4 },
  { id: 'ather-450s', make: 'Ather Energy', model: '450S', variant: 'Standard', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 130000, engineCC: 0, seatingCapacity: 2, powerKW: 4.3, batteryKWh: 3.7 },
  { id: 'ather-450x', make: 'Ather Energy', model: '450X', variant: 'Gen 3', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 150000, engineCC: 0, seatingCapacity: 2, powerKW: 5.4, batteryKWh: 3.7 },
  { id: 'tvs-iqube', make: 'TVS', model: 'iQube', variant: 'S', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 125000, engineCC: 0, seatingCapacity: 2, powerKW: 3.1, batteryKWh: 3.04 },
  { id: 'bajaj-chetak', make: 'Bajaj', model: 'Chetak', variant: 'Premium', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 148000, engineCC: 0, seatingCapacity: 2, powerKW: 4.08, batteryKWh: 3.8 },
  { id: 'hero-vida-v1', make: 'Hero', model: 'Vida V1', variant: 'Pro', category: 'EV_BIKE', segment: 'Scooter', fuelType: 'Electric', exShowroomPrice: 145000, engineCC: 0, seatingCapacity: 2, powerKW: 6, batteryKWh: 3.94 },
];

// =============================================================================
// SCOOTERS (ICE)
// =============================================================================

const SCOOTER_MODELS: VehicleModel[] = [
  { id: 'honda-activa-6g', make: 'Honda', model: 'Activa 6G', variant: 'Standard', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 77000, engineCC: 109, seatingCapacity: 2 },
  { id: 'tvs-jupiter', make: 'TVS', model: 'Jupiter', variant: '125', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 85000, engineCC: 124, seatingCapacity: 2 },
  { id: 'tvs-ntorq-125', make: 'TVS', model: 'Ntorq 125', variant: 'Race Edition', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 94000, engineCC: 124, seatingCapacity: 2 },
  { id: 'hero-destini-125', make: 'Hero', model: 'Destini 125', variant: 'Xtec', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 82000, engineCC: 124, seatingCapacity: 2 },
  { id: 'yamaha-fascino-125', make: 'Yamaha', model: 'Fascino 125', variant: 'Hybrid', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 86000, engineCC: 124, seatingCapacity: 2 },
  { id: 'tvs-scooty-pep-plus', make: 'TVS', model: 'Scooty Pep+', variant: 'Standard', category: 'Bike', segment: 'Scooter', fuelType: 'Petrol', exShowroomPrice: 57000, engineCC: 87, seatingCapacity: 2 },
];

// =============================================================================
// Combined & Indexed
// =============================================================================

export const ALL_VEHICLES: VehicleModel[] = [
  ...CAR_MODELS,
  ...EV_CAR_MODELS,
  ...BIKE_MODELS,
  ...EV_BIKE_MODELS,
  ...SCOOTER_MODELS,
];

// Quick lookup by ID
const vehicleMap = new Map<string, VehicleModel>();
for (const v of ALL_VEHICLES) {
  vehicleMap.set(v.id, v);
}

export function getVehicleById(id: string): VehicleModel | undefined {
  return vehicleMap.get(id);
}

// Get vehicles by category (for form dropdowns)
export function getVehiclesByCategory(category: VehicleCategory): VehicleModel[] {
  return ALL_VEHICLES.filter((v) => v.category === category);
}

// Get grouped list for form: "Make Model (Variant) — ₹X.XX L"
export function getVehicleDisplayList(category: VehicleCategory): Array<{ id: string; label: string; vehicle: VehicleModel }> {
  const vehicles = getVehiclesByCategory(category);
  return vehicles.map((v) => {
    const priceLakh = (v.exShowroomPrice / 100000).toFixed(2);
    const ccInfo = v.engineCC > 0 ? `${v.engineCC}cc` : `${v.powerKW}kW`;
    return {
      id: v.id,
      label: `${v.make} ${v.model} (${v.variant}) — ₹${priceLakh}L · ${ccInfo} · ${v.fuelType}`,
      vehicle: v,
    };
  });
}

// Get unique makes for a category
export function getUniqueMakes(category: VehicleCategory): string[] {
  const makes = new Set<string>();
  for (const v of ALL_VEHICLES) {
    if (v.category === category) makes.add(v.make);
  }
  return Array.from(makes).sort();
}

// Get models filtered by make and category
export function getModelsByMake(category: VehicleCategory, make: string): VehicleModel[] {
  return ALL_VEHICLES.filter((v) => v.category === category && v.make === make);
}
