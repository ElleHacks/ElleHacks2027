// Drop logo files into src/assets/Sponsors/logos/ and reference them by filename below.
const logoFiles = import.meta.glob(
  '../../assets/Sponsors/logos/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
);

const logoFor = (file) =>
  file ? logoFiles[`../../assets/Sponsors/logos/${file}`] : undefined;

// Tiers follow the Figma layout:
//   tier 1 -> 1 large card, tier 2 -> 2 cards, tier 3 -> 8 cards (2 rows of 4)
//   tier 4 -> 16 pill cards in the second frame (4 x 4 grid)
//
// Fill in a real sponsor like this:
//   { name: 'Company', url: 'https://company.com', logo: 'company.png', tier: 1 },
// Entries without a name stay as blank cards, like the placeholders in the design.
// TODO: replace the placeholders with last year's sponsors.
const sponsorList = [
  { tier: 1 },

  { tier: 2 }, { tier: 2 },

  { tier: 3 }, { tier: 3 }, { tier: 3 }, { tier: 3 },
  { tier: 3 }, { tier: 3 }, { tier: 3 }, { tier: 3 },

  { tier: 4 }, { tier: 4 }, { tier: 4 }, { tier: 4 },
  { tier: 4 }, { tier: 4 }, { tier: 4 }, { tier: 4 },
  { tier: 4 }, { tier: 4 }, { tier: 4 }, { tier: 4 },
  { tier: 4 }, { tier: 4 }, { tier: 4 }, { tier: 4 },
];

export const sponsors = sponsorList.map((sponsor) => ({
  ...sponsor,
  logo: logoFor(sponsor.logo),
}));

export const sponsorsInTier = (tier) => sponsors.filter((s) => s.tier === tier);
