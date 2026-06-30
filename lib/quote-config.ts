export interface CityOption {
  id: string;
  label: string;
  stateCode: string;
  icon: string;
  fullService: boolean;
}

export interface ServiceOption {
  id: string;
  label: string;
  icon: string;
}

export interface FrequencyOption {
  id: string;
  label: string;
  detail: string;
  discount: number;
  oneOff: boolean;
}

export const CITY_OPTIONS: CityOption[] = [
  { id: "perth",      label: "Perth",      stateCode: "WA",  icon: "🌅", fullService: true  },
  { id: "melbourne",  label: "Melbourne",  stateCode: "VIC", icon: "🏙️", fullService: false },
  { id: "sydney",     label: "Sydney",     stateCode: "NSW", icon: "🌉", fullService: false },
  { id: "launceston", label: "Launceston", stateCode: "TAS", icon: "🏔️", fullService: true  },
];

/* Perth — all service types */
export const SERVICE_TYPES_ALL: ServiceOption[] = [
  { id: "home",          label: "Home Clean",   icon: "🏠" },
  { id: "end-of-lease",  label: "End of Lease", icon: "🔑" },
  { id: "commercial",    label: "Commercial",   icon: "🏢" },
  { id: "deep-clean",    label: "Deep Clean",   icon: "🧹" },
  { id: "ndis",          label: "NDIS",         icon: "♿" },
];

/* Melbourne, Sydney — recurring only */
export const SERVICE_TYPES_RECURRING: ServiceOption[] = [
  { id: "home",       label: "Home Clean", icon: "🏠" },
  { id: "commercial", label: "Commercial", icon: "🏢" },
  { id: "ndis",       label: "NDIS",       icon: "♿" },
];

/* Perth — once, weekly, fortnightly */
export const FREQUENCY_OPTIONS_ALL: FrequencyOption[] = [
  { id: "once",        label: "One-off",     detail: "No commitment",           discount: 0,    oneOff: true  },
  { id: "weekly",      label: "Weekly",      detail: "Recurring every week",    discount: 0.15, oneOff: false },
  { id: "fortnightly", label: "Fortnightly", detail: "Recurring every 2 weeks", discount: 0.10, oneOff: false },
];

/* Melbourne, Sydney, Launceston — weekly or fortnightly only */
export const FREQUENCY_OPTIONS_RECURRING: FrequencyOption[] = FREQUENCY_OPTIONS_ALL.filter(
  (f) => !f.oneOff,
);

/** Return the available services for a given city id. */
export function getAvailableServices(cityId: string): ServiceOption[] {
  const city = CITY_OPTIONS.find((c) => c.id === cityId);
  return city?.fullService ? SERVICE_TYPES_ALL : SERVICE_TYPES_RECURRING;
}

/** Return the available frequency options for a given city id. */
export function getAvailableFrequencies(cityId: string): FrequencyOption[] {
  const city = CITY_OPTIONS.find((c) => c.id === cityId);
  return city?.fullService ? FREQUENCY_OPTIONS_ALL : FREQUENCY_OPTIONS_RECURRING;
}

/** Return the state code to pre-fill for a given city id, or empty string. */
export function getStateForCity(cityId: string): string {
  return CITY_OPTIONS.find((c) => c.id === cityId)?.stateCode ?? "";
}

/** Return true if the given serviceId is valid for the given city. */
export function isServiceAvailable(cityId: string, serviceId: string): boolean {
  return getAvailableServices(cityId).some((s) => s.id === serviceId);
}

/** Return true if the given frequencyId is valid for the given city. */
export function isFrequencyAvailable(cityId: string, frequencyId: string): boolean {
  return getAvailableFrequencies(cityId).some((f) => f.id === frequencyId);
}
