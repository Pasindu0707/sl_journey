// All site content, ported 1:1 from the static build. Edit here to update copy.
import { asset } from "./site";

export type Package = {
  slug: string;
  name: string;
  dur: string;
  days: string;
  img: string;
  hero: string;
  /** Lead-in price in USD. Kept numeric so Offer schema can use it directly. */
  priceUSD: number;
  /** "pp" = per person; "couple" = total for two. Honeymoon Vibes is per couple. */
  priceUnit: "pp" | "couple";
  route: string;
  intro: string;
  attractions: string[];
};

/** Display price, e.g. "From $640 pp" / "From $1,690 / couple". */
export const priceLabel = (p: Package) =>
  `From $${p.priceUSD.toLocaleString("en-US")} ${
    p.priceUnit === "couple" ? "/ couple" : "pp"
  }`;

/** Spells out the pricing basis for schema descriptions, which have no context. */
export const priceBasis = (p: Package) =>
  p.priceUnit === "couple" ? "per couple" : "per person";

/**
 * Trims prose to `max` characters without cutting mid-word.
 *
 * Prefers to stop on a full sentence when one lands in the back of the budget,
 * and only falls back to a word boundary with an ellipsis. A blunt slice(0, 155)
 * produced descriptions ending "...elephants at Pinnawala," — a dangling comma
 * that reads as a bug to anyone viewing source, and to Google.
 */
const clamp = (s: string, max: number) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  const word = cut.lastIndexOf(" ");
  return `${cut.slice(0, word > 0 ? word : max).replace(/[\s,;:—-]+$/, "")}…`;
};

/**
 * Meta description for a package page: the two facts a searcher is scanning for
 * (how long, how much) before the prose, since Google truncates the tail.
 */
export const packageDescription = (p: Package) => {
  const lead = `${p.dur} · ${priceLabel(p)}. `;
  return lead + clamp(p.intro, 155 - lead.length);
};

export const PACKAGES: Package[] = [
  {
    slug: "hill-country",
    name: "Hill Country Adventures",
    dur: "3 Nights / 4 Days",
    days: "4 Days · 3 Nights",
    img: "train-ella",
    hero: "nuwara-eliya",
    priceUSD: 640,
    priceUnit: "pp",
    route: "Pinnawala · Kandy · Peradeniya · Nuwara Eliya · Kithulgala · Colombo",
    intro:
      "Discover the magic of Sri Lanka's hill country on a journey filled with beauty, culture, and adventure. Witness the charm of gentle elephants at Pinnawala, pay homage at the Temple of the Sacred Tooth Relic, and wander through lush botanical gardens. Savour the taste of world-famous Ceylon tea, experience the thrill of white-water rafting in Kithulgala, and wrap up your adventure with an exciting tour of Colombo. A perfect escape for those who love both nature and adrenaline.",
    attractions: [
      "Pinnawala Elephant Orphanage", "Spice & Herbal Garden", "Temple of the Tooth Relic",
      "Gem Museum", "Royal Botanical Garden", "Tea Factory Tour", "Pink Post Office",
      "Gregory Lake & Park", "Kithulgala Water Rafting", "Colombo City Tour",
    ],
  },
  {
    slug: "cultural-special",
    name: "Cultural Special",
    dur: "9 Nights / 10 Days",
    days: "10 Days · 9 Nights",
    img: "sigiriya",
    hero: "anuradhapura",
    priceUSD: 1490,
    priceUnit: "pp",
    route: "Pinnawala · Sigiriya · Dambulla · Polonnaruwa · Anuradhapura · Kandy · Nuwara Eliya · Ella · Yala · Mirissa · Galle · Colombo",
    intro:
      "Step into Sri Lanka's living heritage with a ten-day cultural odyssey that captures the island's true spirit. Journey through the ancient cities of Anuradhapura and Polonnaruwa, marvel at the rock fortress of Sigiriya, and soak in the scenic beauty of Ella. Ride the world-famous hill country train, explore sacred temples, and witness the vibrant rhythms of traditional dance. Round off your experience with the wild charm of Yala and the serene beaches of the southern coast. This is more than a holiday — it's a cultural odyssey through Sri Lanka's timeless wonders.",
    attractions: [
      "Pinnawala Elephant Orphanage", "Spice & Herbal Garden", "Sigiriya Lion Rock",
      "Sigiriya Village Tour", "Dambulla Cave Temple", "Polonnaruwa Ancient City",
      "Anuradhapura Sacred City", "Temple of the Tooth Relic", "Gem Museum",
      "Kandy Cultural Dance", "Royal Botanical Garden", "Tea Factory Tour", "Pink Post Office",
      "Gregory Lake & Park", "Tea Train: Nanu Oya to Ella", "Nine Arch Bridge",
      "Little Adam's Peak", "Lipton's Seat", "Adisham Bungalow", "Ravana Falls", "Yala Safari",
      "Coconut Tree Hills", "Parrot Island", "Stilt Fishermen", "Turtle Farm",
      "Galle Dutch Fort", "Natural Gem Mines", "Madu River Safari", "Colombo City Tour",
    ],
  },
  {
    slug: "down-south",
    name: "Down South Explore",
    dur: "7 Nights / 8 Days",
    days: "8 Days · 7 Nights",
    img: "beach-boats",
    hero: "galle-fort",
    priceUSD: 1180,
    priceUnit: "pp",
    route: "Colombo · Balapitiya · Bentota · Hikkaduwa · Galle · Mirissa · Hiriketiya",
    intro:
      "Uncover the tropical beauty of Sri Lanka's southern coast on this unforgettable eight-day journey. Start with the buzzing energy of Colombo and the iconic Lotus Tower before gliding along the tranquil waters of the Madu River. Explore historic coastal forts, relax on golden beaches, and dive into adventure with water sports and whale watching. Along the way, witness traditions like stilt fishing that keep the island's coastal culture alive. A perfect blend of sunshine, adventure, and heritage for every traveller.",
    attractions: [
      "Lotus Tower", "Colombo City Tour", "Madu River Safari", "Natural Gem Mines",
      "Water Sports", "Turtle Farm", "Stilt Fishermen", "Galle Dutch Fort",
      "Tea Plantation Visit", "Whale Watching", "Parrot Island", "Coconut Tree Hills",
      "Surfing in Hiriketiya",
    ],
  },
  {
    slug: "honeymoon",
    name: "Honeymoon Vibes",
    dur: "8 Nights / 9 Days",
    days: "9 Days · 8 Nights",
    img: "beach-sunset",
    hero: "beach-sunset",
    priceUSD: 1690,
    priceUnit: "couple",
    route: "Pinnawala · Sigiriya · Kandy · Nuwara Eliya · Ella · Yala · Mirissa · Galle · Balapitiya · Colombo",
    intro:
      "Begin your new journey together with a romantic escape through Sri Lanka's most dreamy landscapes. Share scenic train rides, drift across peaceful lakes, and embrace the lively charm of Ella, Mirissa, Galle, and Colombo. Discover wonders like Sigiriya and Yala, indulge in golden beach sunsets, and enjoy moments of adventure, culture, and pure relaxation. Designed for couples, this tour is all about creating timeless memories in paradise.",
    attractions: [
      "Pinnawala Elephant Orphanage", "Sigiriya Lion Rock", "Sigiriya Village Tour",
      "Spice & Herbal Garden", "Gem Museum", "Temple of the Tooth Relic", "Tea Factory Tour",
      "Gregory Lake & Park", "Nanu Oya to Ella Train Ride", "Ravana Pool Club",
      "Nine Arch Bridge", "Little Adam's Peak", "Nightlife in Ella", "Yala Safari",
      "Mirissa Beach", "Nightlife in Mirissa", "Galle Dutch Fort", "Nightlife in Galle Fort",
      "Madu River Safari", "Natural Gem Mines", "Colombo City Tour", "Nightlife in Colombo",
    ],
  },
];

export const FEATURES: [string, string, string][] = [
  ["compass", "Superior Service", "Friendly, knowledgeable guides and full support from the first message to the final farewell."],
  ["gift", "Customised Packages", "Every itinerary is shaped around your pace, interests and budget — never off-the-shelf."],
  ["users", "Expert Local Guides", "Discover the island's culture, wildlife and hidden corners with passionate local experts."],
  ["shield", "Safe & Reliable", "Trusted drivers, vetted hotels and 24/7 care so you can travel with complete peace of mind."],
];

export const EXPERIENCES: [string, string, string, string][] = [
  ["leopard", "Wildlife", "Safari in Yala", "Spot leopards, elephants and a wealth of wildlife in Sri Lanka's most iconic national park."],
  ["kandy-temple", "Heritage", "Cultural Exploration", "Discover the island's soul at Sigiriya, Anuradhapura and the sacred Temple of the Tooth in Kandy."],
  ["adams-peak", "Trekking", "Hiking & Trekking", "Conquer Ella Rock, Adam's Peak and the wild ridges of the Knuckles Mountain Range."],
  ["surf-sunset", "Ocean", "Diving & Surfing", "Dive coral reefs and shipwrecks, then surf world-class breaks at Arugam Bay and Hikkaduwa."],
  ["river-safari", "Adventure", "White-Water Rafting", "Ride the Kelani River rapids in Kitulgala — the island's ultimate water adventure."],
  ["train-ella", "Scenic", "Train Journeys", "The Kandy–Ella ride is one of the world's most beautiful, crossing the iconic Nine Arch Bridge."],
  ["cave-view", "Nature", "Rainforest Trails", "Explore Sinharaja, a UNESCO rainforest brimming with endemic birds, life and ancient calm."],
  ["mirissa-bay", "Marine", "Whale Watching", "See blue whales, sperm whales and dolphins off Mirissa — at their best from November to April."],
];

export const DESTINATIONS: [string, string][] = [
  ["sigiriya", "Sigiriya"], ["kandy-temple", "Kandy"], ["nuwara-eliya", "Nuwara Eliya"],
  ["ella-ninearch", "Ella"], ["galle-fort", "Galle Fort"], ["safari-jeep", "Yala National Park"],
  ["anuradhapura", "Anuradhapura"], ["beach-sunset", "Mirissa"],
];

export const REVIEWS: [string, string, string, string][] = [
  ["Anne R.", "Italy", "Very good experience — we highly recommend it",
    "Mr. Sudam was a wonderful driver: thoughtful and attentive to everyone, especially the children. We highly recommend SL Journey to anyone visiting Sri Lanka."],
  ["Yasith P.", "Sri Lanka", "The beauty of the deep south",
    "“Ayubowan!” I returned to my motherland after six years and it felt so good. I loved the beautiful environment and the seamless journey. Thank you so much, SL Journey."],
  ["Michelle", "France", "An unforgettable trip to Sri Lanka",
    "Many thanks to our fantastic guide, who with professionalism, kindness and deep knowledge of Sri Lanka made our trip unforgettable. We discovered wonderful places and lived authentic experiences, always feeling safe and well looked after. An impeccable, attentive and beautifully organised tour operator — highly recommended for anyone who wants to experience Sri Lanka in an authentic, stress-free way."],
];

export type Block =
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "quote"; v: string }
  | { t: "list"; v: [string, string][] };

export type Post = {
  slug: string;
  title: string;
  img: string;
  /**
   * Publication date, ISO 8601 (YYYY-MM-DD). Drives both the visible date and
   * BlogPosting.datePublished, so the two can never drift apart.
   *
   * TODO: confirm the real publication dates. The old static site rendered
   * "12 Sep" with no year on all four posts, so the year below is a placeholder
   * and every post currently shares one date — which reads as bulk-published to
   * Google. Give me the real dates and I will drop them straight in.
   */
  date: string;
  excerpt: string;
  prev?: [string, string];
  next?: [string, string];
  body: Block[];
};

// Parsed as UTC so the rendered date can't shift a day by the build machine's
// timezone (a static export bakes in whatever the builder resolved).
const asUTC = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** ["12", "Sep"] — the stacked date badge on post cards. */
export const dateParts = (iso: string): [string, string] => [
  String(asUTC(iso).getUTCDate()),
  asUTC(iso).toLocaleString("en-GB", { month: "short", timeZone: "UTC" }),
];

/** "12 September" — the pill on the post page. */
export const dateLong = (iso: string) =>
  asUTC(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

export const BLOG: Post[] = [
  {
    slug: "best-time",
    title: "Best Time to Visit Sri Lanka",
    img: "ella-ninearch",
    date: "2025-09-12",
    excerpt: "A year-round island with two monsoons — here's how to pick the perfect season for your coast and your kind of adventure.",
    next: ["cuisine", "Sri Lankan Cuisine: A Taste of Authentic Flavours"],
    body: [
      { t: "p", v: "Sri Lanka is a year-round destination, but the best time to visit truly depends on the region you wish to explore. With two distinct monsoons crossing the island, there is almost always sunshine somewhere." },
      { t: "h2", v: "West & South Coasts + Hill Country" },
      { t: "p", v: "From December to April, the west and south coasts and the central hill country enjoy sunny, dry weather — ideal for beach holidays, whale watching and exploring tea country." },
      { t: "h2", v: "East Coast" },
      { t: "p", v: "From May to September, the east comes alive. This is the ideal window for surfing, diving and beach relaxation in Trincomalee, Arugam Bay and Pasikudah." },
      { t: "quote", v: "With its tropical climate, Sri Lanka welcomes travellers with sunshine almost throughout the year — a versatile destination for every season." },
    ],
  },
  {
    slug: "cuisine",
    title: "Sri Lankan Cuisine: A Taste of Authentic Flavours",
    img: "cuisine",
    date: "2025-09-12",
    excerpt: "Spices, coconut and rice come together in one of Asia's most underrated food cultures. These are the dishes you simply must try.",
    prev: ["best-time", "Best Time to Visit Sri Lanka"],
    next: ["things-to-do", "Top Things to Do in Sri Lanka"],
    body: [
      { t: "p", v: "Sri Lankan food is a burst of flavours, shaped by centuries of culture and trade. Known for its generous use of spices, coconut and rice, every meal here is a feast for the senses." },
      { t: "list", v: [
        ["Rice & Curry", "The island's staple — fragrant rice served with an array of vegetable, fish or meat curries."],
        ["Hoppers (Appa)", "Crispy, bowl-shaped pancakes, often enjoyed for breakfast with an egg cracked in the centre."],
        ["Kottu Roti", "A beloved street food of chopped roti stir-fried with vegetables, egg and spices to a rhythmic clatter."],
        ["Ceylon Tea", "World-famous tea grown in the misty central highlands — best enjoyed with a hilltop view."],
      ]},
      { t: "quote", v: "No trip to Sri Lanka is complete without surrendering to the island's culinary delights." },
    ],
  },
  {
    slug: "things-to-do",
    title: "Top Things to Do in Sri Lanka",
    img: "sigiriya",
    date: "2025-09-12",
    excerpt: "From ancient rock fortresses to leopard safaris and the world's most scenic train ride — the experiences that define the island.",
    prev: ["cuisine", "Sri Lankan Cuisine: A Taste of Authentic Flavours"],
    next: ["discover", "Discover Sri Lanka: The Pearl of the Indian Ocean"],
    body: [
      { t: "p", v: "Sri Lanka offers something for every traveller. Whether you're an adventurer, a history lover or a beach enthusiast, these are the must-do experiences." },
      { t: "list", v: [
        ["Climb Sigiriya Rock Fortress", "A world-famous UNESCO site with ancient frescoes and breathtaking summit views."],
        ["Safari at Yala National Park", "Spot leopards, elephants and exotic birds in their natural habitat."],
        ["Ride the Scenic Train to Ella", "One of the most beautiful train journeys on earth, winding through tea-clad hills."],
        ["Visit Sacred Kandy", "Home to the Temple of the Tooth Relic, one of Buddhism's most revered sites."],
        ["Relax on the Beaches", "Mirissa, Arugam Bay and Unawatuna are perfect for sun, surf and sea."],
      ]},
    ],
  },
  {
    slug: "discover",
    title: "Discover Sri Lanka: The Pearl of the Indian Ocean",
    img: "beach-sunset",
    date: "2025-09-12",
    excerpt: "Golden beaches, lush tea plantations, ancient ruins and warm hospitality — why this little island leaves such a lasting impression.",
    prev: ["things-to-do", "Top Things to Do in Sri Lanka"],
    body: [
      { t: "p", v: "Sri Lanka, often called the “Pearl of the Indian Ocean,” is a tropical paradise that blends golden beaches, lush tea plantations, ancient ruins and vibrant culture. From the sacred city of Anuradhapura to the misty hills of Nuwara Eliya, every corner of the island tells a story of history and beauty." },
      { t: "p", v: "Visitors can enjoy a wonderful variety of experiences — exploring UNESCO World Heritage sites, embarking on wildlife safaris in Yala, or simply relaxing along the palm-fringed beaches of Mirissa and Bentota." },
      { t: "quote", v: "With warm hospitality and mouth-watering cuisine, Sri Lanka is not just a destination — it's an experience that stays with you forever." },
    ],
  },
];

export const GALLERY: [string, string][] = [
  ["sigiriya", "Sigiriya Rock Fortress"], ["ella-ninearch", "Nine Arch Bridge, Ella"],
  ["leopard", "Leopard, Yala"], ["kandy-temple", "Temple of the Tooth, Kandy"],
  ["beach-boats", "Southern Coast"], ["nuwara-eliya", "Misty Hills of Nuwara Eliya"],
  ["galle-fort", "Galle Lighthouse"], ["anuradhapura", "Sacred Anuradhapura"],
  ["train-ella", "Hill Country Train"], ["cuisine", "Authentic Rice & Curry"],
  ["surf-sunset", "Surfing the South"], ["red-mosque", "Red Mosque, Colombo"],
  ["buddha-statues", "Golden Buddhas"], ["cave-view", "Rainforest Trails"],
  ["safari-jeep", "On Safari"], ["harbor-dusk", "Harbour at Dusk"],
  ["adams-peak", "Above the Clouds"], ["ancient-ruins", "Ancient Ruins"],
  ["beach-sunset", "Mirissa Sunset"], ["colombo-night", "Colombo by Night"],
  ["hill-lake", "Hill Country Lake"], ["mirissa-bay", "Tropical Bay"],
  ["river-safari", "Madu River Safari"], ["colonial", "Colonial Heritage"],
];

export const img = (name: string) => asset(`/assets/img/lib/${name}.jpg`);
