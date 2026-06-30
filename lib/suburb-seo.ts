export type ServiceSlug = "home-cleaning" | "end-of-lease" | "commercial" | "deep-clean" | "ndis" | "airbnb-cleaning";
export type CitySlug = "perth" | "melbourne" | "sydney" | "launceston";

export interface SuburbConfig {
  name: string;
  slug: string;
}

export interface ServiceConfig {
  slug: ServiceSlug;
  name: string;
  tagline: string;
  icon: string;
  included: string[];
}

export interface CityConfig {
  name: string;
  slug: CitySlug;
  state: string;
  stateCode: string;
  fullService: boolean;
  services: ServiceSlug[];
  suburbs: SuburbConfig[];
  heroImage: string;
  mapQuery: string;
}

export const ALL_SERVICES: ServiceConfig[] = [
  {
    slug: "home-cleaning",
    name: "Home Cleaning",
    tagline: "Regular & one-off residential cleans with a 100% satisfaction guarantee.",
    icon: "🏠",
    included: [
      "Kitchen benchtops, sink & stovetop",
      "All floors vacuumed & mopped",
      "Bathrooms scrubbed & disinfected",
      "Bedrooms dusted & surfaces wiped",
      "Living areas cleaned & tidied",
      "Bins emptied & liners replaced",
    ],
  },
  {
    slug: "end-of-lease",
    name: "End of Lease Cleaning",
    tagline: "Bond-back guarantee. Thorough REIWA-standard checklist, every time.",
    icon: "🔑",
    included: [
      "Full property deep clean top-to-bottom",
      "Oven, stovetop & range hood",
      "All windows & tracks (interior)",
      "Bathrooms, toilets & laundry",
      "Wardrobe interiors & shelving",
      "Wall spot cleaning throughout",
    ],
  },
  {
    slug: "commercial",
    name: "Commercial Cleaning",
    tagline: "Offices, retail spaces & commercial properties — after-hours available.",
    icon: "🏢",
    included: [
      "Workstations & common areas",
      "Kitchen & break room cleaned",
      "Bathrooms serviced & restocked",
      "Reception & meeting rooms",
      "Hard floors mopped & vacuumed",
      "Bins emptied & recycling sorted",
    ],
  },
  {
    slug: "deep-clean",
    name: "Deep Cleaning",
    tagline: "Top-to-bottom intensive clean — perfect for move-ins, pre-sale and spring cleans.",
    icon: "✨",
    included: [
      "Inside oven, racks & trays",
      "Inside fridge & microwave",
      "Behind & under appliances",
      "Grout scrubbing in bathrooms",
      "Blind & window track cleaning",
      "Skirting boards & door frames",
    ],
  },
  {
    slug: "ndis",
    name: "NDIS Cleaning",
    tagline: "Plan, agency and self-managed participants welcome. No complexity, no barriers.",
    icon: "💙",
    included: [
      "Full home cleans to participant needs",
      "Flexible scheduling & routines",
      "Assistance with laundry & tidying",
      "NDIS invoicing & documentation",
      "Consistent, familiar cleaners",
      "Coordination with support coordinators",
    ],
  },
  {
    slug: "airbnb-cleaning",
    name: "Airbnb Cleaning",
    tagline: "Fast guest-ready turnovers between bookings. Professionally cleaned every time.",
    icon: "🏡",
    included: [
      "Full property cleaned between guests",
      "Linen & towel change and fresh presentation",
      "Kitchen reset — dishes, surfaces, appliances",
      "Bathrooms scrubbed, restocked & towels staged",
      "Beds made to hotel standard",
      "Rubbish removed & bins emptied",
    ],
  },
];

export const CITIES: CityConfig[] = [
  {
    name: "Perth",
    slug: "perth",
    state: "Western Australia",
    stateCode: "WA",
    fullService: true,
    services: ["home-cleaning", "end-of-lease", "commercial", "deep-clean", "ndis", "airbnb-cleaning"],
    heroImage: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1920&q=80",
    mapQuery: "Perth+WA+Australia",
    suburbs: [
      { name: "Perth CBD", slug: "perth-cbd" },
      { name: "East Perth", slug: "east-perth" },
      { name: "West Perth", slug: "west-perth" },
      { name: "Northbridge", slug: "northbridge" },
      { name: "Leederville", slug: "leederville" },
      { name: "Mount Lawley", slug: "mount-lawley" },
      { name: "Subiaco", slug: "subiaco" },
      { name: "Claremont", slug: "claremont" },
      { name: "Cottesloe", slug: "cottesloe" },
      { name: "Fremantle", slug: "fremantle" },
      { name: "Mosman Park", slug: "mosman-park" },
      { name: "Scarborough", slug: "scarborough" },
      { name: "Karrinyup", slug: "karrinyup" },
      { name: "Joondalup", slug: "joondalup" },
      { name: "Wanneroo", slug: "wanneroo" },
      { name: "Balcatta", slug: "balcatta" },
      { name: "Stirling", slug: "stirling" },
      { name: "Victoria Park", slug: "victoria-park" },
      { name: "Bentley", slug: "bentley" },
      { name: "Cannington", slug: "cannington" },
      { name: "Canning Vale", slug: "canning-vale" },
      { name: "Willetton", slug: "willetton" },
      { name: "Rockingham", slug: "rockingham" },
      { name: "Mandurah", slug: "mandurah" },
      { name: "Cockburn", slug: "cockburn" },
      { name: "Midland", slug: "midland" },
      { name: "Bassendean", slug: "bassendean" },
      { name: "Bayswater", slug: "bayswater" },
      { name: "Morley", slug: "morley" },
      { name: "Armadale", slug: "armadale" },
      { name: "Thornlie", slug: "thornlie" },
      { name: "Gosnells", slug: "gosnells" },
      { name: "Balga", slug: "balga" },
      { name: "Mirrabooka", slug: "mirrabooka" },
      { name: "Belmont", slug: "belmont" },
    ],
  },
  {
    name: "Melbourne",
    slug: "melbourne",
    state: "Victoria",
    stateCode: "VIC",
    fullService: false,
    services: ["home-cleaning", "commercial", "ndis", "airbnb-cleaning"],
    heroImage: "https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=1920&q=80",
    mapQuery: "Melbourne+VIC+Australia",
    suburbs: [
      { name: "Melbourne CBD", slug: "melbourne-cbd" },
      { name: "South Yarra", slug: "south-yarra" },
      { name: "St Kilda", slug: "st-kilda" },
      { name: "Richmond", slug: "richmond" },
      { name: "Fitzroy", slug: "fitzroy" },
      { name: "Collingwood", slug: "collingwood" },
      { name: "Brunswick", slug: "brunswick" },
      { name: "Northcote", slug: "northcote" },
      { name: "Footscray", slug: "footscray" },
      { name: "Toorak", slug: "toorak" },
      { name: "Hawthorn", slug: "hawthorn" },
      { name: "Camberwell", slug: "camberwell" },
      { name: "Box Hill", slug: "box-hill" },
      { name: "Dandenong", slug: "dandenong" },
      { name: "Springvale", slug: "springvale" },
      { name: "Lynbrook", slug: "lynbrook" },
      { name: "Cranbourne", slug: "cranbourne" },
      { name: "Clayton", slug: "clayton" },
      { name: "Oakleigh", slug: "oakleigh" },
      { name: "Frankston", slug: "frankston" },
    ],
  },
  {
    name: "Sydney",
    slug: "sydney",
    state: "New South Wales",
    stateCode: "NSW",
    fullService: false,
    services: ["home-cleaning", "commercial", "ndis", "airbnb-cleaning"],
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80",
    mapQuery: "Sydney+NSW+Australia",
    suburbs: [
      { name: "Sydney CBD", slug: "sydney-cbd" },
      { name: "Bondi", slug: "bondi" },
      { name: "Bondi Junction", slug: "bondi-junction" },
      { name: "Manly", slug: "manly" },
      { name: "Mosman", slug: "mosman" },
      { name: "Newtown", slug: "newtown" },
      { name: "Surry Hills", slug: "surry-hills" },
      { name: "Darlinghurst", slug: "darlinghurst" },
      { name: "Paddington", slug: "paddington" },
      { name: "Glebe", slug: "glebe" },
      { name: "Parramatta", slug: "parramatta" },
      { name: "Chatswood", slug: "chatswood" },
      { name: "North Sydney", slug: "north-sydney" },
      { name: "Neutral Bay", slug: "neutral-bay" },
      { name: "Strathfield", slug: "strathfield" },
    ],
  },
  {
    name: "Launceston",
    slug: "launceston",
    state: "Tasmania",
    stateCode: "TAS",
    fullService: true,
    services: ["home-cleaning", "end-of-lease", "commercial", "deep-clean", "ndis", "airbnb-cleaning"],
    heroImage: "https://images.unsplash.com/photo-1598393700990-5e98f3d27eb7?w=1920&q=80",
    mapQuery: "Launceston+TAS+Australia",
    suburbs: [
      { name: "Launceston CBD", slug: "launceston-cbd" },
      { name: "Invermay", slug: "invermay" },
      { name: "Newnham", slug: "newnham" },
      { name: "Prospect", slug: "prospect" },
      { name: "South Launceston", slug: "south-launceston" },
      { name: "Riverside", slug: "riverside" },
      { name: "Trevallyn", slug: "trevallyn" },
      { name: "Newstead", slug: "newstead" },
      { name: "Rocherlea", slug: "rocherlea" },
      { name: "Mayfield", slug: "mayfield" },
      { name: "Mowbray", slug: "mowbray" },
      { name: "Norwood", slug: "norwood" },
      { name: "Punchbowl", slug: "punchbowl" },
      { name: "Ravenswood", slug: "ravenswood" },
      { name: "Kings Meadows", slug: "kings-meadows" },
      { name: "Youngtown", slug: "youngtown" },
      { name: "St Leonards", slug: "st-leonards" },
      { name: "Summerhill", slug: "summerhill" },
      { name: "Waverley", slug: "waverley" },
      { name: "Blackstone Heights", slug: "blackstone-heights" },
      { name: "Legana", slug: "legana" },
      { name: "Hadspen", slug: "hadspen" },
      { name: "Relbia", slug: "relbia" },
      { name: "Perth", slug: "perth-tas" },
      { name: "Longford", slug: "longford" },
    ],
  },
];

export function getCity(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getSuburb(city: CityConfig, slug: string): SuburbConfig | undefined {
  return city.suburbs.find((s) => s.slug === slug);
}

export function getService(slug: string): ServiceConfig | undefined {
  return ALL_SERVICES.find((s) => s.slug === slug);
}

export function cityServices(city: CityConfig): ServiceConfig[] {
  return ALL_SERVICES.filter((s) => (city.services as string[]).includes(s.slug));
}

export function nearbySuburbs(city: CityConfig, currentSlug: string, count = 5): SuburbConfig[] {
  const idx = city.suburbs.findIndex((s) => s.slug === currentSlug);
  const all = city.suburbs.filter((s) => s.slug !== currentSlug);
  const start = Math.max(0, idx - 2);
  return all.slice(start, start + count);
}

export function totalSuburbPages(): number {
  return CITIES.reduce((acc, city) => acc + city.suburbs.length, 0);
}

export function totalServiceSuburbPages(): number {
  return CITIES.reduce((acc, city) => acc + city.suburbs.length * city.services.length, 0);
}

export function allSuburbParams() {
  return CITIES.flatMap((city) =>
    city.suburbs.map((suburb) => ({ city: city.slug, suburb: suburb.slug }))
  );
}

export function allServiceSuburbParams() {
  return CITIES.flatMap((city) =>
    city.suburbs.flatMap((suburb) =>
      city.services.map((service) => ({ city: city.slug, suburb: suburb.slug, service }))
    )
  );
}
