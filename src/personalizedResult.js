const DESTINATION_BLURBS = {
  "30A": "beachy, laid-back, and perfect for a stylish coast reset",
  Sarasota: "easy Gulf Coast beauty with culture and family-friendly beaches",
  "Puerto Rico": "a no-passport-needed mix of beaches, food, and culture",
  "US Virgin Islands": "postcard beaches and island energy without long-haul logistics",
  Hawaii: "bucket-list tropical scenery and unforgettable outdoor adventures",

  "Jackson Hole": "an elevated mountain basecamp for adventure, scenery, and ski energy",
  "Glacier National Park": "big alpine views and iconic hiking for true outdoors lovers",
  "Rocky Mountain National Park": "high-altitude trails, wildlife, and classic mountain road views",
  Sedona: "red-rock landscapes, wellness vibes, and unforgettable desert adventures",
  Denver: "city comfort with quick access to mountain/outdoor experiences",

  Vail: "a polished mountain town known for world-class skiing",
  "Park City": "a ski-forward mountain destination with easy town access",
  Aspen: "iconic skiing, upscale stays, and dramatic mountain scenery",
  "Big Sky": "wide-open terrain and serious ski/outdoor adventure",
  "Dude Ranch experiences": "a western-style outdoor getaway with horseback and mountain charm",

  NYC: "an iconic city break packed with food, culture, and nonstop energy",
  Boston: "walkable historic neighborhoods, waterfront charm, and great food",
  Nashville: "live music, nightlife, and high-energy group-trip fun",
  Charleston: "southern charm, food, and a polished city-meets-coast feel",
  "Newport RI": "coastal New England elegance, mansions, and harbor views",
  "Portland Maine": "seafood, cozy coastal streets, and relaxed city vibes",
  "Las Vegas": "all-in entertainment, nightlife, and high-impact weekend energy",

  Orlando: "easy family planning with theme parks and all-ages entertainment",
  "Pigeon Forge": "family-friendly attractions with mountain-town convenience",
  Chattanooga: "kid-friendly attractions and low-stress outdoor options",

  "Pacific Coast Highway": "a classic scenic drive with dramatic ocean viewpoints",
  "Blue Ridge Parkway": "slow, scenic mountain driving with overlooks and small-town stops",
  "Florida Keys": "island-hopping road-trip energy and sunny coastal stops",
  "Utah National Parks": "an epic road-trip loop through bucket-list desert parks",

  Alaska: "a true bucket-list adventure with massive landscapes and wildlife",
};

const RULES = [
  {
    label: "beach",
    keywords: ["beach", "beaches", "coast", "island", "ocean"],
    destinations: ["30A", "Sarasota", "Puerto Rico", "US Virgin Islands", "Hawaii"],
    weight: 3,
  },
  {
    label: "mountains/outdoors",
    keywords: ["mountain", "mountains", "outdoors", "hiking", "nature"],
    destinations: ["Jackson Hole", "Glacier National Park", "Rocky Mountain National Park", "Sedona", "Denver"],
    weight: 3,
  },
  {
    label: "ski or dude ranch",
    keywords: ["ski", "skiing", "snow", "dude ranch", "ranch"],
    destinations: ["Jackson Hole", "Vail", "Park City", "Aspen", "Big Sky", "Dude Ranch experiences"],
    weight: 5,
  },
  {
    label: "city",
    keywords: ["city", "urban", "nightlife", "food scene"],
    destinations: ["NYC", "Boston", "Nashville", "Charleston", "Newport RI", "Portland Maine", "Las Vegas"],
    weight: 3,
  },
  {
    label: "family/theme parks",
    keywords: ["family", "kids", "theme park", "theme parks"],
    destinations: ["Orlando", "Pigeon Forge", "Chattanooga"],
    weight: 4,
  },
  {
    label: "road trip",
    keywords: ["road trip", "drive", "driving", "scenic route"],
    destinations: ["Pacific Coast Highway", "Blue Ridge Parkway", "Florida Keys", "Utah National Parks"],
    weight: 4,
  },
  {
    label: "bucket list",
    keywords: ["bucket list", "once in a lifetime", "dream trip"],
    destinations: ["Alaska", "Hawaii"],
    weight: 4,
  },
];

function flattenAnswers(answers = {}) {
  return Object.values(answers)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

function matchesKeyword(token, keyword) {
  return token.includes(keyword) || keyword.includes(token);
}

function getTopDestinationMatches(answers = {}, limit = 2) {
  const tokens = flattenAnswers(answers);
  const scores = new Map();
  const matchedRuleLabels = [];

  RULES.forEach((rule) => {
    const isMatch = tokens.some((token) => rule.keywords.some((keyword) => matchesKeyword(token, keyword)));
    if (!isMatch) return;

    matchedRuleLabels.push(rule.label);

    rule.destinations.forEach((destination, index) => {
      const currentScore = scores.get(destination) ?? 0;
      const rankBonus = Math.max(rule.destinations.length - index, 1);
      scores.set(destination, currentScore + rule.weight + rankBonus);
    });
  });

  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.max(1, Math.min(2, limit)))
    .map(([destination, score]) => ({
      destination,
      score,
      why: DESTINATION_BLURBS[destination] ?? "a strong match for your travel style",
    }));

  if (!sorted.length) {
    return {
      matches: [{
        destination: "Puerto Rico",
        score: 0,
        why: DESTINATION_BLURBS["Puerto Rico"],
      }],
      matchedRules: [],
    };
  }

  return {
    matches: sorted,
    matchedRules: matchedRuleLabels,
  };
}

function createPersonalizedResult(answers = {}, limit = 2) {
  const { matches, matchedRules } = getTopDestinationMatches(answers, limit);
  const [first, second] = matches;

  const preferenceSummary = matchedRules.length
    ? `You gave ${matchedRules.join(", ")} energy`
    : "You gave flexible travel energy";

  if (!second) {
    return `${first.destination} is so your vibe. ${preferenceSummary}, and this fits because it's ${first.why}.`;
  }

  return `${first.destination} and ${second.destination} are your top matches. ${preferenceSummary}, and these fit because ${first.destination} is ${first.why}, while ${second.destination} is ${second.why}.`;
}

module.exports = {
  createPersonalizedResult,
  getTopDestinationMatches,
  RULES,
  DESTINATION_BLURBS,
};
