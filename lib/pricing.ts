import { PRICING } from "@/config/business";

export interface Addon {
  id: string;
  label: string;
  icon: string;
  unitPrice: number;
  /** e.g. "per panel" — empty string for flat-fee items */
  unitLabel: string;
  hasQuantity: boolean;
  maxQty: number;
  /** Service IDs for which this addon should NOT appear */
  excludeForServices?: string[];
}

export const BASE_PRICE = PRICING.base;

export const BEDROOM_ADDS: Record<string, number> = {
  studio: 0,
  "1": PRICING.bedrooms[0],
  "2": PRICING.bedrooms[1],
  "3": PRICING.bedrooms[2],
  "4": PRICING.bedrooms[3],
  "5": PRICING.bedrooms[4],
  "6": PRICING.bedrooms[5],
};

export const BATHROOM_ADDS: Record<string, number> = {
  "1": PRICING.bathrooms[0],
  "2": PRICING.bathrooms[1],
  "3": PRICING.bathrooms[2],
  "4": PRICING.bathrooms[3],
  "5": PRICING.bathrooms[4],
  "6": PRICING.bathrooms[5],
};

export const LAUNDRY_OPTIONS: { id: string; label: string; add: number }[] = [
  { id: "none", label: "None",        add: 0  },
  { id: "one",  label: "1 Laundry",   add: 29 },
  { id: "two",  label: "2 Laundries", add: 58 },
];

export const STOREY_OPTIONS: { id: string; label: string; add: number }[] = [
  { id: "single", label: "Single Storey", add: 0  },
  { id: "double", label: "Double Storey", add: 35 },
  { id: "triple", label: "Triple Storey", add: 69 },
];

export const HOURLY_RATE      = PRICING.hourlyRate;
export const NDIS_HOURLY_RATE = PRICING.ndisRate;
export const HOURLY_MIN_HOURS = PRICING.hourlyMinHours;

export const OFFICE_RATE_DURING = PRICING.commercialDuringHours;
export const OFFICE_RATE_AFTER  = PRICING.commercialAfterHours;
export const OFFICE_MIN_HOURS   = PRICING.commercialMinHours;

export const ADDONS: Addon[] = [
  { id: "oven",            label: "Inside the Oven",                      icon: "🔥", unitPrice: 64, unitLabel: "",             hasQuantity: false, maxQty: 1  },
  { id: "fridge",          label: "Inside Fridge (must be empty)",         icon: "🧊", unitPrice: 64, unitLabel: "",             hasQuantity: false, maxQty: 1  },
  { id: "dishwasher",      label: "Inside Dishwasher",                     icon: "🍽️", unitPrice: 62, unitLabel: "",             hasQuantity: false, maxQty: 1  },
  { id: "dryer",           label: "Dryer",                                 icon: "🌀", unitPrice: 56, unitLabel: "",             hasQuantity: false, maxQty: 1  },
  { id: "washing-machine", label: "Washing Machine",                       icon: "🫧", unitPrice: 56, unitLabel: "",             hasQuantity: false, maxQty: 1  },
  { id: "cupboards",       label: "Inside Cupboards (must be empty)",      icon: "🗄️", unitPrice: 64, unitLabel: "per cupboard", hasQuantity: true,  maxQty: 10 },
  { id: "windows",         label: "Inside Windows",                        icon: "🪟", unitPrice: 64, unitLabel: "per panel",    hasQuantity: true,  maxQty: 20 },
  { id: "sliding-doors",   label: "Sliding Glass Doors",                   icon: "🚪", unitPrice: 44, unitLabel: "per set",      hasQuantity: true,  maxQty: 10 },
  { id: "blinds",          label: "Blinds",                                icon: "🪞", unitPrice: 56, unitLabel: "per piece",    hasQuantity: true,  maxQty: 20 },
  { id: "balcony-small",   label: "Small Balcony / Deck / Patio (≤12m²)", icon: "🌿", unitPrice: 64, unitLabel: "",             hasQuantity: true,  maxQty: 5  },
  { id: "balcony-large",   label: "Large Balcony / Deck / Patio (>12m²)", icon: "🌳", unitPrice: 84, unitLabel: "",             hasQuantity: true,  maxQty: 5  },
  { id: "garage",          label: "Garage Sweep & Tidy",                   icon: "🚗", unitPrice: 55, unitLabel: "per car spot", hasQuantity: true,  maxQty: 5  },
  { id: "wall-washing",    label: "Wall Washing",                          icon: "🪣", unitPrice: 89, unitLabel: "per hour",     hasQuantity: true,  maxQty: 8  },
  { id: "carpet",          label: "Carpet Deep Cleaning",                  icon: "🧹", unitPrice: 97, unitLabel: "per room",     hasQuantity: true,  maxQty: 10 },
  { id: "bedsheets",       label: "Change Bedsheets",                      icon: "🛏️", unitPrice: 27, unitLabel: "per set",     hasQuantity: true,  maxQty: 10, excludeForServices: ["end-of-lease", "deep-clean"] },
];

export const FREQUENCY_DISCOUNTS: Record<string, { label: string; discount: number }> = {
  once:        { label: "One-off",     discount: 0 },
  weekly:      { label: "Weekly",      discount: PRICING.weeklyDiscount },
  fortnightly: { label: "Fortnightly", discount: PRICING.fortnightlyDiscount },
  monthly:     { label: "Monthly",     discount: PRICING.monthlyDiscount },
};

export const EOL_SURCHARGE        = PRICING.endOfLeaseMultiplier;
export const DEEP_CLEAN_SURCHARGE = PRICING.deepCleanMultiplier;

export function calculatePrice(params: {
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  laundry?: string;
  storeys?: string;
  hourly?: boolean;
  hours?: number;
  addons: Record<string, number>;
  frequency: string;
}): { base: number; addonsTotal: number; discount: number; total: number } {
  const { serviceType, bedrooms, bathrooms, laundry, storeys, hourly, hours, addons, frequency } = params;

  let base: number;

  if (hourly) {
    const rate = serviceType === "ndis" ? NDIS_HOURLY_RATE : HOURLY_RATE;
    base = Math.round((hours ?? HOURLY_MIN_HOURS) * rate * 100) / 100;
  } else {
    const bedroomAdd  = BEDROOM_ADDS[bedrooms  || "1"] ?? 0;
    const bathroomAdd = BATHROOM_ADDS[bathrooms || "1"] ?? 0;
    base = BASE_PRICE + bedroomAdd + bathroomAdd;

    const laundryAdd = LAUNDRY_OPTIONS.find((l) => l.id === laundry)?.add ?? 0;
    const storeysAdd = STOREY_OPTIONS.find((s) => s.id === storeys)?.add ?? 0;
    base += laundryAdd + storeysAdd;

    if (serviceType === "end-of-lease") base = Math.round(base * (1 + EOL_SURCHARGE));
    if (serviceType === "deep-clean")   base = Math.round(base * (1 + DEEP_CLEAN_SURCHARGE));
  }

  const addonsTotal = Object.entries(addons).reduce((sum, [id, qty]) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon ? addon.unitPrice * qty : 0);
  }, 0);

  const subtotal     = base + addonsTotal;
  const discountRate = FREQUENCY_DISCOUNTS[frequency]?.discount ?? 0;
  const discount     = Math.round(subtotal * discountRate);
  const total        = subtotal - discount;

  return { base, addonsTotal, discount, total };
}
