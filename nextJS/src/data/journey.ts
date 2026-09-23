// "Build My Journey" — the question options and the itinerary engine.
//
// Everything here is pure data + pure functions, so the builder can recompute
// the itinerary on every tap (the live preview) with no server.
//
// How a journey is built:
//   1. Only places that match at least one chosen experience are candidates.
//      (No "famous anyway" stops: a beach trip never gets Kandy slipped in.)
//   2. Places are added one at a time, each time taking the one that adds the
//      most for the interests not yet covered, minus the extra driving it costs
//      to fit it into the route.
//   3. The chosen places are put in the order with the least driving, using
//      real road times (ROADS below), starting from Negombo and ending at the
//      airport.
//   4. Spare days go to the extra experiences that best match the interests.
//   5. The travel month, when known, swaps coasts for the monsoon and drops
//      out-of-season activities.
//
// Sources for times and seasons (checked Sept 2026): asiaexperiences.com
// "Distance and time between cities of Sri Lanka", travellersisle.com "Travel
// times", arugamtaxi.com/routes, Sri Lanka Railways timings via
// thegonegoat.com / rome2rio, srilanka-spirit.com seasonal guides, Yala
// closure notices (Ada Derana, Sunday Times). The result is a starting point;
// the team fine-tunes it on WhatsApp.

export type Interest =
  | "beach" | "wildlife" | "mountains" | "culture"
  | "food" | "train" | "nature" | "romantic";
export type Group = "solo" | "couple" | "family" | "friends";
export type Style = "budget" | "comfortable" | "premium" | "luxury";
export type DaysKey = "3-5" | "6-8" | "9-12" | "13+";

export const DAY_OPTIONS: { key: DaysKey; label: string; sub: string; min: number; max: number; def: number }[] = [
  { key: "3-5", label: "3–5 Days", sub: "A short island escape", min: 3, max: 5, def: 5 },
  { key: "6-8", label: "6–8 Days", sub: "The classic loop", min: 6, max: 8, def: 7 },
  { key: "9-12", label: "9–12 Days", sub: "Highlights, unhurried", min: 9, max: 12, def: 10 },
  { key: "13+", label: "13+ Days", sub: "The grand journey", min: 13, max: 21, def: 14 },
];

export const GROUP_OPTIONS: { key: Group; label: string; sub: string; emoji: string; note: string }[] = [
  { key: "solo", label: "Solo", sub: "Just me", emoji: "🎒", note: "Paced for a solo traveller, with a driver-guide who doubles as your local friend." },
  { key: "couple", label: "Couple", sub: "The two of us", emoji: "💑", note: "Shaped for two: slower mornings, beautiful stays and a few surprises along the way." },
  { key: "family", label: "Family", sub: "With kids or parents", emoji: "👨‍👩‍👧", note: "Family pacing: fewer hotel changes, pool stays and activities kids actually enjoy." },
  { key: "friends", label: "Friends", sub: "A group trip", emoji: "🧑‍🤝‍🧑", note: "Built for a group: more action, shared villas and lively evenings." },
];

export const INTEREST_OPTIONS: { key: Interest; label: string; emoji: string }[] = [
  { key: "beach", label: "Beach & Relaxation", emoji: "🏖️" },
  { key: "wildlife", label: "Wildlife & Safari", emoji: "🐘" },
  { key: "mountains", label: "Mountains & Adventure", emoji: "🏔️" },
  { key: "culture", label: "Culture & History", emoji: "🛕" },
  { key: "food", label: "Food & Local Life", emoji: "🍛" },
  { key: "train", label: "Scenic Train Journeys", emoji: "🚂" },
  { key: "nature", label: "Nature", emoji: "🌿" },
  { key: "romantic", label: "Romantic Experiences", emoji: "❤️" },
];

export const STYLE_OPTIONS: { key: Style; label: string; sub: string; tier: string; stays: string; ride: string }[] = [
  { key: "budget", label: "Budget", sub: "Smart & simple", tier: "$", stays: "Handpicked guesthouses and family-run homestays", ride: "Private car with driver" },
  { key: "comfortable", label: "Comfortable", sub: "Best of both", tier: "$$", stays: "3–4★ boutique hotels with character", ride: "Private air-conditioned car with English-speaking driver" },
  { key: "premium", label: "Premium", sub: "Extra special", tier: "$$$", stays: "4–5★ hotels, tea bungalows and safari lodges", ride: "Private SUV with chauffeur-guide" },
  { key: "luxury", label: "Luxury", sub: "No compromises", tier: "$$$$", stays: "5★ resorts, private villas and luxury tented camps", ride: "Luxury vehicle with senior chauffeur-guide" },
];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ---------------------------------------------------------------------------
// Places
// ---------------------------------------------------------------------------

type Day = { title: string; text: string; tags?: Interest[] };
type Extra = Day & {
  /** Only offered in these months (0 = Jan). Unknown month = offered. */
  months?: number[];
  /** Added to the text in these months. */
  peak?: { months: number[]; text: string };
};

type Place = {
  id: string;
  name: string;
  /** Where you sleep, for the "Overnight in …" line. */
  sleep: string;
  /** Position on the map's 250×430 viewBox: x = (lon − 79.5)·100, y = (10 − lat)·100. */
  xy: [number, number];
  /** Small tie-breaker for the classics, applied only when the place matches. */
  fame: number;
  /** Most nights we'd plan here. */
  max: number;
  /** "sw" = best Dec–Apr, wet May–Sep. "east" = best May–Sep, wet Nov–Mar. */
  coast?: "sw" | "east";
  /** Only suggested for trips at least this long (it's far away). */
  minTrip?: number;
  weights: Partial<Record<Interest, number>>;
  group?: Partial<Record<Group, number>>;
  style?: Partial<Record<Style, number>>;
  arrive: Day;
  extras: Extra[];
  /** Text for a free day, for places where one makes sense. */
  leisure?: string;
  romance?: string;
  /** Park or site closures by month. */
  closed?: { months: number[]; text: string };
  /** An interest weight that only applies in these months (e.g. whales). */
  onlyIn?: Partial<Record<Interest, number[]>>;
  /** An interest weight multiplied in these months (e.g. The Gathering). */
  boost?: { interest: Interest; months: number[]; factor: number };
};

const NOV_APR = [10, 11, 0, 1, 2, 3];
const MAY_SEP = [4, 5, 6, 7, 8];

const PLACES: Place[] = [
  {
    id: "colombo", name: "Colombo", sleep: "Colombo", xy: [35, 307], fame: 0.3, max: 1,
    weights: { food: 3, culture: 2 },
    arrive: { title: "Colombo", text: "Gangaramaya Temple, the colonial Fort district and the colourful bazaars of Pettah, then street-food kottu and sunset on Galle Face Green." },
    extras: [],
  },
  {
    id: "anuradhapura", name: "Anuradhapura", sleep: "Anuradhapura", xy: [90, 169], fame: 0.5, max: 1,
    weights: { culture: 5 },
    arrive: { title: "Anuradhapura", text: "Sri Lanka's first capital, a UNESCO World Heritage city: the sacred Sri Maha Bodhi tree, the great white dagobas of Ruwanwelisaya and Jetavanaramaya, and sunset from Mihintale." },
    extras: [],
  },
  {
    id: "wilpattu", name: "Wilpattu", sleep: "Wilpattu", xy: [55, 155], fame: 0.2, max: 1,
    weights: { wildlife: 4, nature: 3 },
    arrive: { title: "Wilpattu", text: "Safari in Wilpattu, Sri Lanka's largest national park: leopards, sloth bears and dozens of natural 'villu' lakes, with far fewer jeeps than Yala." },
    extras: [],
  },
  {
    id: "sigiriya", name: "Sigiriya", sleep: "Sigiriya", xy: [126, 205], fame: 1.5, max: 3,
    weights: { culture: 5, nature: 2, wildlife: 2, mountains: 1 },
    arrive: { title: "Sigiriya", text: "Via the Dambulla cave temples into the Cultural Triangle. Late afternoon, climb Sigiriya Lion Rock, the 5th-century sky fortress, as the heat eases." },
    extras: [
      { title: "Cultural Experience", text: "Cycle the ruins of Polonnaruwa, the medieval royal capital, and see the giant rock-cut Buddhas of Gal Vihara.", tags: ["culture"] },
      {
        title: "Elephant Safari", text: "Jeep safari in Minneriya, Kaudulla or Hurulu Eco Park, following the wild elephant herds to wherever they are feeding.", tags: ["wildlife", "nature"],
        peak: { months: [6, 7, 8, 9], text: "It's the season of 'The Gathering', when hundreds of elephants meet at the Minneriya reservoir." },
      },
      { title: "Village Life", text: "A village morning near Habarana: bullock-cart ride, a lake crossing by outrigger canoe and a traditional lunch cooked on a clay hearth.", tags: ["food", "culture"] },
    ],
    romance: "Sunrise from Pidurangala Rock, with Sigiriya glowing across the jungle.",
    boost: { interest: "wildlife", months: [6, 7, 8, 9], factor: 2 },
  },
  {
    id: "trinco", name: "Trincomalee", sleep: "Nilaveli", xy: [170, 135], fame: 0.6, max: 4, coast: "east",
    weights: { beach: 5, wildlife: 2, nature: 2, culture: 1 },
    onlyIn: { wildlife: MAY_SEP },
    arrive: { title: "Trincomalee", text: "Across to the east coast and the white sands of Nilaveli, with some of the calmest, clearest sea on the island in summer." },
    extras: [
      { title: "Pigeon Island", text: "Boat out to Pigeon Island National Park to snorkel over coral with blacktip reef sharks and turtles.", tags: ["nature", "beach"] },
      { title: "Whale Watching", text: "Whale and dolphin watching off Trincomalee, where blue whales pass close to shore.", tags: ["wildlife", "nature"], months: MAY_SEP },
      { title: "Trincomalee Town", text: "Koneswaram Temple on Swami Rock and Fort Frederick, where spotted deer wander between the old walls.", tags: ["culture"] },
    ],
    leisure: "A free day on Nilaveli's beach: swim, snorkel, repeat.",
    romance: "A private dinner on the sand at Nilaveli.",
  },
  {
    id: "pasikudah", name: "Pasikudah", sleep: "Pasikudah", xy: [206, 207], fame: 0.2, max: 4, coast: "east",
    weights: { beach: 4, romantic: 2 },
    group: { family: 2, couple: 1 },
    arrive: { title: "Pasikudah", text: "To Pasikudah's long, shallow bay of calm, warm water, one of the gentlest places to swim in Sri Lanka." },
    extras: [
      { title: "Batticaloa", text: "The Dutch fort and lagoon of Batticaloa, famous for its 'singing fish'.", tags: ["culture"] },
    ],
    leisure: "A slow day on the bay, where you can wade out a long way in warm, knee-deep water.",
  },
  {
    id: "knuckles", name: "Knuckles Range", sleep: "Knuckles", xy: [130, 255], fame: 0.2, max: 2,
    weights: { mountains: 4, nature: 5 },
    group: { family: -1 },
    arrive: { title: "Knuckles Range", text: "Into the Knuckles Mountain Range, a UNESCO-listed wilderness of cloud forest, waterfalls and remote villages." },
    extras: [
      { title: "Knuckles Trek", text: "A guided trek across the Pitawala Pathana grasslands to the cliff edge of Mini World's End.", tags: ["mountains", "nature"] },
    ],
  },
  {
    id: "kandy", name: "Kandy", sleep: "Kandy", xy: [113, 271], fame: 1.2, max: 2,
    // train 3: the classic hill-country train starts here.
    weights: { culture: 4, food: 2, nature: 1, train: 3 },
    arrive: { title: "Kandy", text: "Via a spice garden to Kandy, the last royal capital. Evening at the Temple of the Sacred Tooth Relic and a Kandyan dance show." },
    extras: [
      { title: "Kandy Local Life", text: "Peradeniya Royal Botanical Gardens, the bustling central market and a home cooking class: rice and curry from scratch.", tags: ["food", "nature", "culture"] },
    ],
  },
  {
    id: "kitulgala", name: "Kitulgala", sleep: "Kitulgala", xy: [92, 301], fame: 0.3, max: 1,
    weights: { mountains: 4, nature: 2 },
    group: { friends: 2, solo: 1, family: -1 },
    arrive: { title: "Kitulgala", text: "Adventure on the Kelani River, where 'The Bridge on the River Kwai' was filmed: white-water rafting through the rainforest, canyoning and waterfall jumps." },
    extras: [],
  },
  {
    id: "nuwara", name: "Nuwara Eliya", sleep: "Nuwara Eliya", xy: [128, 305], fame: 0.8, max: 2,
    weights: { mountains: 3, nature: 3, romantic: 2, train: 2 },
    arrive: { title: "Nuwara Eliya", text: "Up into tea country. A tea factory visit and tasting, then 'Little England', the colonial hill station at 1,868 m." },
    extras: [
      { title: "Horton Plains", text: "An early start for Horton Plains National Park: a 9 km loop through cloud forest to World's End, a sheer drop of about 870 m, and Baker's Falls.", tags: ["mountains", "nature"] },
      { title: "Adam's Peak", text: "A night climb of Adam's Peak (Sri Pada): about 5,500 steps to watch sunrise from the sacred summit.", tags: ["mountains", "culture"], months: [11, 0, 1, 2, 3, 4] },
    ],
    romance: "High tea for two on the lawn of a colonial-era tea bungalow.",
  },
  {
    id: "ella", name: "Ella", sleep: "Ella", xy: [155, 313], fame: 1.2, max: 3,
    weights: { mountains: 5, train: 4, nature: 3, romantic: 1 },
    group: { friends: 1 },
    arrive: { title: "Ella", text: "Down through the tea hills to Ella, a laid-back mountain village perched above the dramatic Ella Gap." },
    extras: [
      { title: "Ella Experiences", text: "Sunrise on Little Adam's Peak, the Nine Arch Bridge as the train rolls across, and a cool-off at Ravana Falls.", tags: ["mountains", "nature", "train"] },
      { title: "Ella Adventure", text: "Hike Ella Rock through tea estates and cloud forest, or fly over the valley on the Flying Ravana zipline.", tags: ["mountains"] },
    ],
    romance: "Sunset drinks overlooking the Ella Gap.",
  },
  {
    id: "arugam", name: "Arugam Bay", sleep: "Arugam Bay", xy: [226, 316], fame: 0.5, max: 4, coast: "east",
    weights: { beach: 4, wildlife: 1 },
    group: { friends: 3, solo: 2, family: -1 },
    arrive: { title: "Arugam Bay", text: "To Arugam Bay, the east coast's legendary surf town of point breaks, lagoons and beach cafés." },
    extras: [
      { title: "Surf Lesson", text: "A surf lesson at Baby Point or Whiskey Point, then sunset at Elephant Rock.", tags: ["beach"] },
      { title: "Kumana Safari", text: "Safari in Kumana or Lahugala, where elephants graze beside the old tanks and Kumana's wetlands teem with birds.", tags: ["wildlife", "nature"] },
    ],
    leisure: "A free day in Arugam Bay: surf, swim or just watch the waves.",
  },
  {
    id: "udawalawe", name: "Udawalawe", sleep: "Udawalawe", xy: [139, 353], fame: 0.4, max: 1,
    weights: { wildlife: 4, nature: 2 },
    group: { family: 3 },
    arrive: { title: "Udawalawe", text: "Jeep safari in Udawalawe National Park, one of the best places in Asia to see wild elephants, then the Elephant Transit Home at feeding time, where orphaned calves are raised." },
    extras: [],
  },
  {
    id: "yala", name: "Yala", sleep: "Tissamaharama", xy: [190, 363], fame: 1, max: 2,
    weights: { wildlife: 5, nature: 2 },
    arrive: { title: "Yala", text: "To the wild south-east and your safari lodge near Tissamaharama. Afternoon jeep safari in Yala National Park." },
    extras: [
      { title: "Safari", text: "Dawn safari in Yala, home to one of the world's highest densities of leopards, plus elephants, sloth bears and crocodiles.", tags: ["wildlife", "nature"] },
    ],
    closed: { months: [8, 9], text: "Yala's Blocks 1–2 usually close for their annual rest from September to mid-October, so safaris run in the other blocks." },
  },
  {
    id: "sinharaja", name: "Sinharaja", sleep: "Deniyaya", xy: [100, 360], fame: 0.2, max: 1,
    weights: { nature: 5, wildlife: 2 },
    arrive: { title: "Sinharaja", text: "A guided trek in Sinharaja Forest Reserve, a UNESCO World Heritage rainforest full of endemic birds, frogs and giant trees." },
    extras: [],
  },
  {
    id: "tangalle", name: "Tangalle", sleep: "Tangalle", xy: [129, 397], fame: 0.3, max: 4, coast: "sw",
    weights: { beach: 4, romantic: 4, nature: 1 },
    group: { couple: 1 },
    style: { premium: 0.5, luxury: 1 },
    arrive: { title: "Tangalle", text: "To Tangalle's wide, quiet golden beaches, far from the crowds." },
    extras: [
      { title: "Turtle Night", text: "An evening at Rekawa beach, where green turtles come ashore to nest (sightings are never guaranteed).", tags: ["nature", "wildlife"] },
      { title: "Mulkirigala", text: "Climb to the cave temples of Mulkirigala, a rock monastery over 2,000 years old.", tags: ["culture"] },
    ],
    leisure: "A day of doing nothing at all on Tangalle's empty beaches.",
    romance: "A private candle-lit dinner on the sand.",
  },
  {
    id: "mirissa", name: "Mirissa", sleep: "Mirissa", xy: [96, 405], fame: 1, max: 4, coast: "sw",
    weights: { beach: 5, wildlife: 2, romantic: 2, food: 1 },
    onlyIn: { wildlife: NOV_APR },
    group: { friends: 2 },
    arrive: { title: "Mirissa", text: "Along the coast to Mirissa: palm-fringed bays, fresh seafood and your first Indian Ocean sunset." },
    extras: [
      { title: "Whale Watching", text: "An early boat out of Mirissa to look for blue whales and spinner dolphins.", tags: ["wildlife", "nature"], months: NOV_APR },
      { title: "Coconut Tree Hill", text: "Coconut Tree Hill and Secret Beach, then fish grilled on the beach for dinner.", tags: ["beach", "romantic", "food"] },
      { title: "Surf Weligama", text: "A beginner surf lesson in the gentle waves of Weligama Bay.", tags: ["beach"] },
    ],
    leisure: "A slow day of warm sea and golden sand.",
    romance: "Sunset at Coconut Tree Hill.",
  },
  {
    id: "galle", name: "Galle", sleep: "Galle", xy: [72, 397], fame: 1, max: 2, coast: "sw",
    weights: { culture: 3, beach: 3, food: 3, romantic: 1 },
    arrive: { title: "Galle Fort", text: "Wander the ramparts, cafés and boutiques of 17th-century Galle Fort, a UNESCO World Heritage Site, and watch sunset from the lighthouse bastion." },
    extras: [
      { title: "Unawatuna", text: "Swim and snorkel at Unawatuna Bay and hidden Jungle Beach.", tags: ["beach", "nature"] },
      { title: "Koggala", text: "Stilt fishermen at Koggala, a boat trip on Koggala Lake and a sea turtle hatchery.", tags: ["culture", "nature"] },
      { title: "Galle Food Walk", text: "A food walk through the fort and a cooking class with a local family.", tags: ["food"] },
    ],
    leisure: "A free day between Galle Fort's cafés and Unawatuna's beach.",
    romance: "Sunset cocktails on the fort ramparts.",
  },
  {
    id: "hikkaduwa", name: "Hikkaduwa", sleep: "Hikkaduwa", xy: [60, 386], fame: 0.4, max: 2, coast: "sw",
    weights: { beach: 4, nature: 2 },
    group: { friends: 2, solo: 1 },
    arrive: { title: "Hikkaduwa", text: "Hikkaduwa's lively beach, with coral reefs just offshore and sea turtles feeding in the shallows." },
    extras: [
      { title: "Reef & Turtles", text: "Snorkel the Hikkaduwa coral sanctuary and swim alongside green sea turtles.", tags: ["beach", "nature"] },
      { title: "Madu River", text: "A boat safari through the mangroves and cinnamon islands of the Madu River.", tags: ["nature"] },
    ],
    leisure: "A free day on the beach, with sundowners at a beach bar.",
  },
  {
    id: "bentota", name: "Bentota", sleep: "Bentota", xy: [49, 358], fame: 0.4, max: 4, coast: "sw",
    weights: { beach: 4, romantic: 3, nature: 1 },
    group: { family: 2, couple: 1 },
    style: { luxury: 1 },
    arrive: { title: "Bentota", text: "To Bentota's broad golden beach, where the river meets the sea." },
    extras: [
      { title: "River & Water Sports", text: "A Bentota River boat safari through the mangroves, then jet-skis, banana boats or windsurfing.", tags: ["beach", "nature"] },
      { title: "Bawa Gardens", text: "The garden estates of Lunuganga and Brief Garden, shaped by architect Geoffrey Bawa and his brother Bevis.", tags: ["culture", "romantic"] },
    ],
    leisure: "A lazy day by the pool and the sea.",
    romance: "A sunset river cruise with drinks on board.",
  },
  {
    id: "jaffna", name: "Jaffna", sleep: "Jaffna", xy: [52, 34], fame: 0.2, max: 2, minTrip: 13,
    weights: { culture: 4, food: 4 },
    arrive: { title: "Jaffna", text: "North to Jaffna, the heart of Tamil Sri Lanka: Nallur Kandaswamy Temple, the Dutch fort and a fiery Jaffna crab curry." },
    extras: [],
  },
];

// ---------------------------------------------------------------------------
// Roads: typical private-car hours between neighbouring places. Shortest
// paths are computed from these, so only direct links need listing.
// ---------------------------------------------------------------------------

const ROADS: [string, string, number][] = [
  ["airport", "negombo", 0.5], ["airport", "colombo", 0.6], ["negombo", "colombo", 1],
  ["negombo", "anuradhapura", 3.75], ["negombo", "wilpattu", 3.25], ["negombo", "sigiriya", 3.75],
  ["negombo", "kandy", 3], ["negombo", "kitulgala", 2.75],
  ["colombo", "bentota", 1.25], ["colombo", "galle", 1.5], ["colombo", "mirissa", 2.25],
  ["colombo", "kitulgala", 2.5], ["colombo", "sinharaja", 3.5], ["colombo", "yala", 4],
  ["colombo", "udawalawe", 3.5], ["colombo", "ella", 5], ["colombo", "kandy", 3], ["colombo", "sigiriya", 4],
  ["bentota", "hikkaduwa", 0.75], ["bentota", "galle", 1], ["hikkaduwa", "galle", 0.5],
  ["galle", "mirissa", 0.75], ["galle", "sinharaja", 2.5], ["mirissa", "tangalle", 1],
  ["mirissa", "yala", 2.25], ["mirissa", "udawalawe", 2], ["mirissa", "sinharaja", 2.25], ["mirissa", "ella", 2.75],
  ["tangalle", "yala", 1.5], ["tangalle", "udawalawe", 1.5], ["tangalle", "ella", 2.75],
  ["udawalawe", "yala", 1.75], ["udawalawe", "ella", 2.25], ["udawalawe", "sinharaja", 2.5],
  ["yala", "ella", 2.25], ["yala", "arugam", 3.25], ["ella", "arugam", 3.5],
  ["ella", "nuwara", 1.75], ["nuwara", "kandy", 2.5], ["nuwara", "kitulgala", 2.5],
  ["kandy", "kitulgala", 2.25], ["kandy", "ella", 4.25], ["kandy", "sigiriya", 2.5], ["kandy", "knuckles", 1.75],
  ["sigiriya", "knuckles", 2.5], ["sigiriya", "anuradhapura", 1.5], ["sigiriya", "trinco", 2.75],
  ["sigiriya", "pasikudah", 2.75], ["sigiriya", "ella", 4.25], ["sigiriya", "nuwara", 3.25],
  ["trinco", "pasikudah", 2.5], ["pasikudah", "arugam", 3.5],
  ["anuradhapura", "wilpattu", 1], ["anuradhapura", "trinco", 2.5], ["anuradhapura", "jaffna", 3.5], ["trinco", "jaffna", 4],
];

// Scenic hill-country train legs (hours, including the short hop to/from the
// station). Used instead of the road when the traveller chose trains.
const TRAINS: Record<string, { h: number; from: string }> = {
  "kandy>nuwara": { h: 4, from: "Kandy to Nanu Oya" },
  "nuwara>ella": { h: 3, from: "Nanu Oya to Ella" },
  "kandy>ella": { h: 7, from: "Kandy to Ella" },
  "ella>nuwara": { h: 3, from: "Ella to Nanu Oya" },
  "nuwara>kandy": { h: 4, from: "Nanu Oya to Kandy" },
  "ella>kandy": { h: 7, from: "Ella to Kandy" },
};

const NODES = ["airport", "negombo", ...PLACES.map((p) => p.id)];
const IDX = Object.fromEntries(NODES.map((n, i) => [n, i]));
const HOURS: number[][] = (() => {
  const n = NODES.length;
  const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [a, b, h] of ROADS) {
    d[IDX[a]][IDX[b]] = Math.min(d[IDX[a]][IDX[b]], h);
    d[IDX[b]][IDX[a]] = Math.min(d[IDX[b]][IDX[a]], h);
  }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
})();
export const hours = (a: string, b: string) => HOURS[IDX[a]][IDX[b]];

// Long days hurt: every hour over 5 counts extra, and over 4 on the flight day.
// Set per build: when the traveller chose trains, legs with a scenic train
// count as shorter, so the route runs through Kandy / Nanu Oya / Ella.
let preferTrains = false;
const legCost = (a: string, b: string) => {
  const h = hours(a, b);
  return h + Math.max(0, h - 5) * 1.5 - (preferTrains && TRAINS[`${a}>${b}`] ? 1.5 : 0);
};
const endCost = (a: string) => { const h = hours(a, "airport"); return h + Math.max(0, h - 4) * 2; };
const routeCost = (ids: string[]) =>
  ids.reduce((c, id, i) => c + legCost(i ? ids[i - 1] : "negombo", id), 0) + endCost(ids[ids.length - 1] ?? "negombo");

/** The least-driving order, by branch and bound (at most 8 stops). */
function bestOrder(ids: string[]): string[] {
  let best = ids, bestCost = routeCost(ids);
  const used = new Array(ids.length).fill(false);
  const path: string[] = [];
  const walk = (cost: number) => {
    if (cost >= bestCost) return;
    if (path.length === ids.length) {
      const total = cost + endCost(path[path.length - 1]);
      if (total < bestCost) { bestCost = total; best = [...path]; }
      return;
    }
    for (let i = 0; i < ids.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(ids[i]);
      walk(cost + legCost(path.length > 1 ? path[path.length - 2] : "negombo", ids[i]));
      path.pop(); used[i] = false;
    }
  };
  walk(0);
  return best;
}

/** Extra driving to fit `id` into the cheapest spot of an existing route. */
function detour(order: string[], id: string): number {
  const base = routeCost(order);
  let min = Infinity;
  for (let i = 0; i <= order.length; i++) {
    min = Math.min(min, routeCost([...order.slice(0, i), id, ...order.slice(i)]) - base);
  }
  return min;
}

// ---------------------------------------------------------------------------
// Seasons
// ---------------------------------------------------------------------------

const inMonths = (m: number | null, list: number[]) => m === null || list.includes(m);

/** Is this place worth suggesting in this month at all? */
function inSeason(p: Place, m: number | null) {
  // Unknown month: plan for the main season (Dec–Apr), i.e. no east coast.
  if (p.coast === "east") return m !== null && [3, 4, 5, 6, 7, 8, 9].includes(m);
  return true;
}

/** An interest weight, softened when the season is against it. */
function weight(p: Place, i: Interest, m: number | null) {
  let w = p.weights[i] ?? 0;
  if (!w) return 0;
  const only = p.onlyIn?.[i];
  if (only && m !== null && !only.includes(m)) return 0;
  if (p.boost && p.boost.interest === i && m !== null && p.boost.months.includes(m)) w *= p.boost.factor;
  const beachy = i === "beach" || i === "romantic";
  if (p.coast === "sw" && beachy && m !== null && MAY_SEP.includes(m)) w *= 0.25; // SW monsoon: rough seas
  if (p.coast === "east" && beachy && m !== null && MAY_SEP.includes(m)) w *= 1.2; // east coast at its best
  if (p.coast === "east" && m !== null && (m === 3 || m === 9)) w *= 0.7; // shoulder months
  if (p.closed && m !== null && p.closed.months.includes(m) && i === "wildlife") w *= 0.6;
  return w;
}

export function seasonNote(m: number | null): string {
  if (m === null) return "Planned for Sri Lanka's main season (December to April). Travelling between May and September? Choose your travel month below and the route switches to the sunny east coast.";
  const name = MONTHS[m];
  if ([11, 0, 1, 2].includes(m)) return `Planned for ${name}: peak season, dry and sunny on the south and west coasts and in the hill country.`;
  if (m === 3) return `Planned for April: warm and mostly dry across the island, a good month almost everywhere.`;
  if (MAY_SEP.includes(m)) return `Planned for ${name}: the south-west monsoon brings rain to the south and west coasts, so your beach time is on the east coast, which is at its best now.`;
  return `Planned for ${name}: between the monsoons, with showers across the island (usually in the afternoon). A quieter, greener time to travel.`;
}

// ---------------------------------------------------------------------------
// The builder
// ---------------------------------------------------------------------------

export const ALL_STOPS = PLACES.map(({ id, name, xy }) => ({ id, name, xy }));
export const ARRIVAL_XY: [number, number] = [34, 280];

export type Answers = {
  days: number;
  group: Group | null;
  interests: Interest[];
  style: Style | null;
  /** Travel month, 0 = January. Null when not chosen yet. */
  month?: number | null;
};

export type ItineraryDay = {
  n: number;
  title: string;
  text: string;
  sleep?: string;
  romance?: string;
  travel?: string;
  stopId?: string;
};

export type Itinerary = {
  days: ItineraryDay[];
  /** Chosen places in route order, for the map. */
  route: { id: string; name: string; xy: [number, number] }[];
};

const fmtHours = (h: number) => {
  const mins = Math.round(h * 4) * 15;
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60} min` : ""}`;
};
const nameOf = (id: string) => (id === "negombo" ? "Negombo" : PLACES.find((p) => p.id === id)!.name);

export function buildItinerary(a: Answers): Itinerary {
  const total = Math.max(3, a.days);
  const middle = total - 2; // day 1 is arrival (night in Negombo), the last day departure
  const m = a.month ?? null;
  const romantic = a.group === "couple" || a.interests.includes("romantic");
  // Nothing chosen yet (the live preview on the first screens): show the
  // classic first-timer's mix.
  const interests: Interest[] = a.interests.length ? a.interests : ["culture", "mountains", "beach"];
  preferTrains = interests.includes("train");

  const interestScore = (p: Place) => interests.reduce((s, i) => s + weight(p, i, m), 0);

  // 1) Pick the places.
  const candidates = PLACES.filter(
    (p) => inSeason(p, m) && (!p.minTrip || total >= p.minTrip) && interestScore(p) > 0
  );
  // Beach-and-relax trips move less; families change hotels less often.
  const relaxed = interests.every((i) => i === "beach" || i === "romantic" || i === "food");
  let pace = relaxed ? 0.42 : 0.6;
  if (a.group === "family") pace -= 0.08;
  if (a.group === "friends" || a.group === "solo") pace += 0.04;
  if (a.style === "luxury") pace -= 0.05;
  const target = Math.max(1, Math.min(8, middle, Math.round(middle * pace)));
  // Short trips can't afford long detours.
  const lambda = middle <= 4 ? 0.6 : middle <= 8 ? 0.25 : 0.18;

  // Coverage model. For beach and romance one great place is the point, so a
  // place earns only what it improves on the best so far (plus a little for
  // depth): a second beach barely counts. For everything else more is the
  // point (Sigiriya *and* Kandy for culture), so value fades gently instead.
  const ONE_IS_ENOUGH: Interest[] = ["beach", "romantic"];
  const bestW: Partial<Record<Interest, number>> = {};
  const covered: Partial<Record<Interest, number>> = {};
  const offSeason = (p: Place) =>
    m !== null && ((p.coast === "sw" && MAY_SEP.includes(m)) || (p.coast === "east" && (m === 3 || m === 9)));
  const value = (p: Place, order: string[]) => {
    const gain = interests.reduce((s, i) => {
      const w = weight(p, i, m);
      if (ONE_IS_ENOUGH.includes(i)) return s + Math.max(0, w - (bestW[i] ?? 0)) + 0.1 * w;
      return s + w / (1 + 1.5 * (covered[i] ?? 0));
    }, 0);
    // Group and style fit scale the gain rather than stand on their own, so
    // they can tip a choice but never add a place by themselves.
    const fit = 1 + 0.15 * (a.group ? p.group?.[a.group] ?? 0 : 0) + 0.1 * (a.style ? p.style?.[a.style] ?? 0 : 0);
    const fame = offSeason(p) ? 0 : p.fame * Math.min(1, gain / 3);
    // Every trip has to drive somewhere, so the first pick's distance counts
    // for less; after that, detours count in full.
    return gain * fit + fame - lambda * (order.length ? 1 : 0.4) * detour(order, p.id);
  };

  let order: string[] = [];
  while (order.length < target) {
    let best: Place | null = null, bestVal = -Infinity;
    for (const p of candidates) {
      if (order.includes(p.id)) continue;
      const v = value(p, order);
      if (v > bestVal) { bestVal = v; best = p; }
    }
    // Stop rather than add a place that isn't worth the drive, unless the
    // places so far can't fill the trip (each has a sensible maximum stay).
    const capacity = order.reduce((c, id) => c + PLACES.find((p) => p.id === id)!.max, 0);
    if (!best || (order.length > 0 && capacity >= middle && bestVal < 1)) break;
    for (const i of interests) {
      const w = weight(best, i, m);
      bestW[i] = Math.max(bestW[i] ?? 0, w);
      covered[i] = (covered[i] ?? 0) + w / 5;
    }
    order = bestOrder([...order, best.id]);
  }

  // Break up very long drives with a night on the way, as a driver would
  // (e.g. Negombo to the east coast via the Cultural Triangle).
  const stopovers = new Set<string>();
  for (let i = 0; i <= order.length && order.length < middle; i++) {
    const from = i ? order[i - 1] : "negombo", to = order[i] ?? "airport";
    const h = hours(from, to);
    if (h <= 5) continue;
    let via: Place | null = null, viaVal = -Infinity;
    for (const p of PLACES) {
      if (order.includes(p.id) || !inSeason(p, m)) continue;
      const x = hours(from, p.id), y = hours(p.id, to);
      if (x + y > h + 1.5 || Math.max(x, y) > 4.5) continue;
      const v = interestScore(p) + p.fame - Math.max(x, y) * 0.5;
      if (v > viaVal) { viaVal = v; via = p; }
    }
    if (via) { order.splice(i, 0, via.id); stopovers.add(via.id); i++; }
  }
  const chosen = order.map((id) => PLACES.find((p) => p.id === id)!);

  // 2) Spend the spare days.
  const nights: Record<string, Day[]> = Object.fromEntries(chosen.map((p) => [p.id, []]));
  let spare = middle - chosen.length;
  const used = new Set<Extra>();
  const matchValue = (p: Place, tags: Interest[] = []) =>
    tags.filter((t) => interests.includes(t)).reduce((s, t) => s + (weight(p, t, m) || 2) * 3, 0);
  while (spare > 0) {
    let pick: { p: Place; d: Day; extra?: Extra } | null = null, pickVal = -Infinity;
    for (const p of chosen) {
      const stayed = 1 + nights[p.id].length;
      if (stayed >= p.max) continue;
      const spread = nights[p.id].length * 2;
      p.extras.forEach((e, k) => {
        if (used.has(e) || (e.months && !inMonths(m, e.months))) return;
        const v = matchValue(p, e.tags) + interestScore(p) * 0.3 - k * 1.5 - spread;
        if (v > pickVal) { pickVal = v; pick = { p, d: e, extra: e }; }
      });
      if (p.leisure && (interests.includes("beach") || interests.includes("romantic"))) {
        const v = (interests.includes("beach") ? weight(p, "beach", m) * 2 : 0) + interestScore(p) * 0.2 - 4 - spread;
        if (v > pickVal) { pickVal = v; pick = { p, d: { title: p.coast ? "Beach at Leisure" : "At Leisure", text: p.leisure } }; }
      }
    }
    const chosenPick = pick as { p: Place; d: Day; extra?: Extra } | null;
    if (!chosenPick) {
      // Everything is full: rest days wherever the trip lingers longest.
      const host = chosen.find((p) => p.leisure) ?? chosen[chosen.length - 1];
      nights[host.id].push({ title: "At Leisure", text: host.leisure ?? "A free day to explore at your own pace, or simply rest." });
    } else {
      if (chosenPick.extra) used.add(chosenPick.extra);
      nights[chosenPick.p.id].push(chosenPick.d);
    }
    spare--;
  }

  // 3) Lay the days out.
  const days: ItineraryDay[] = [
    { n: 1, title: "Airport → Negombo", text: "Welcome to Sri Lanka! Your driver meets you at arrivals for the 30-minute transfer to Negombo. Unwind by the lagoon and beach after the flight.", sleep: "Negombo" },
  ];
  const wantsTrain = interests.includes("train");
  let prev = "negombo";
  for (const p of chosen) {
    const train = wantsTrain ? TRAINS[`${prev}>${p.id}`] : undefined;
    const h = hours(prev, p.id);
    const travel = train
      ? `🚂 About ${fmtHours(train.h)} by scenic train, ${train.from}`
      : `🚗 About ${fmtHours(h)} from ${nameOf(prev)}${h > 5 ? ", a long travel day with stops on the way" : ""}`;
    const first: Day = train
      ? { title: `Scenic Train → ${p.name}`, text: `Ride one of the world's most beautiful rail journeys through misty tea estates and mountain tunnels. ${p.arrive.text}` }
      : p.arrive;
    const closure = p.closed && m !== null && p.closed.months.includes(m) ? ` ${p.closed.text}` : "";
    const breakUp = stopovers.has(p.id) ? " A night here breaks up the long drive." : "";
    [first, ...nights[p.id]].forEach((d, k) => {
      const ex = d as Extra;
      const peak = ex.peak && m !== null && ex.peak.months.includes(m) ? ` ${ex.peak.text}` : "";
      days.push({
        n: days.length + 1,
        title: d.title,
        text: d.text + peak + (k === 0 ? closure + breakUp : ""),
        sleep: p.sleep,
        stopId: p.id,
        travel: k === 0 ? travel : undefined,
        romance: romantic && k === 0 ? p.romance : undefined,
      });
    });
    prev = p.id;
  }
  const out = hours(prev, "airport");
  days.push({
    n: days.length + 1,
    title: "Departure",
    text: `Transfer ${prev === "negombo" ? "" : `from ${nameOf(prev)} `}to Bandaranaike International Airport for your flight home.${out > 4 ? " We'll time the drive around your flight, or add a last night nearer the airport." : ""}`,
    travel: `🚗 About ${fmtHours(out)} to the airport`,
  });

  return { days, route: chosen.map((p) => ({ id: p.id, name: p.name, xy: p.xy })) };
}

// ---- Sharing: answers <-> URL hash, so a built journey has a link. ----

export function encodeAnswers(a: Answers): string {
  const p = new URLSearchParams();
  p.set("d", String(a.days));
  if (a.group) p.set("g", a.group);
  if (a.interests.length) p.set("i", a.interests.join("."));
  if (a.style) p.set("s", a.style);
  if (a.month !== null && a.month !== undefined) p.set("m", String(a.month + 1));
  return p.toString();
}

export function decodeAnswers(hash: string): Answers | null {
  const p = new URLSearchParams(hash.replace(/^#/, ""));
  const days = Number(p.get("d"));
  const group = p.get("g") as Group | null;
  const style = p.get("s") as Style | null;
  const month = Number(p.get("m"));
  const interests = (p.get("i") ?? "").split(".").filter((i): i is Interest =>
    INTEREST_OPTIONS.some((o) => o.key === i)
  );
  if (!days || days < 3 || days > 30) return null;
  if (!GROUP_OPTIONS.some((o) => o.key === group)) return null;
  if (!STYLE_OPTIONS.some((o) => o.key === style)) return null;
  if (!interests.length) return null;
  return { days, group, interests, style, month: month >= 1 && month <= 12 ? month - 1 : null };
}

export const rangeFor = (days: number) =>
  DAY_OPTIONS.find((o) => days >= o.min && days <= o.max) ?? DAY_OPTIONS[DAY_OPTIONS.length - 1];
