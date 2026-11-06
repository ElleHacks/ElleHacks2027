// Drop logo files into src/assets/Sponsors/logos/ named after the `logo` key below,
// e.g. logo: 'wealthsimple' -> wealthsimple.png (or .svg / .jpg / .jpeg / .webp).
const logoFiles = import.meta.glob(
  '../../assets/Sponsors/logos/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
);

const logoFor = (name) => {
  if (!name) return undefined;
  const match = Object.entries(logoFiles).find(
    ([path]) => path.split('/').pop().replace(/\.\w+$/, '') === name
  );
  return match?.[1];
};

// Tiers follow the Figma layout:
//   tier 1 -> large top card, tier 2 -> second row, tier 3 -> rows of 4
//   tier 4 -> pill cards in the second frame (rows of 4)
// Until a logo file is uploaded, the card shows the sponsor's name instead.
const sponsorList = [
  // Tier 1
  { name: 'Wealthsimple', url: 'https://www.wealthsimple.com', logo: 'wealthsimple', tier: 1 },

  // Tier 2
  { name: 'York Region', url: 'https://www.york.ca', logo: 'york-region', tier: 2 },

  // Tier 3
  { name: 'Ubisoft Toronto', url: 'https://www.ubisoft.com/en-ca', logo: 'ubisoft-toronto', tier: 3 },
  { name: 'Shopify', url: 'https://www.shopify.com', logo: 'shopify', tier: 3 },
  { name: 'KPM Power', url: 'https://www.kpmpower.com', logo: 'kpm-power', tier: 3 },
  { name: 'Communications Security Establishment Canada', url: 'https://www.cse-cst.gc.ca', logo: 'cse-cst', tier: 3 },
  { name: 'Experience Ventures', url: 'https://www.experienceventures.ca', logo: 'experience-ventures', tier: 3 },
  { name: "Government of Canada's Innovative Work-Integrated Learning Initiative", url: 'https://www.canada.ca/en.html', logo: 'canada-wil', tier: 3 },
  { name: 'FDM Group', url: 'https://www.fdmgroup.com', logo: 'fdm', tier: 3 },

  // Tier 4
  { name: 'Porter Airlines', url: 'https://www.flyporter.com', logo: 'porter', tier: 4 },
  { name: 'CPP Investments', url: 'https://www.cppinvestments.com', logo: 'cpp-investments', tier: 4 },
  { name: 'CodeCrafters', url: 'https://codecrafters.io', logo: 'codecrafters', tier: 4 },
  { name: '.xyz', url: 'https://gen.xyz', logo: 'xyz', tier: 4 },
  { name: 'Pure Buttons', url: 'https://www.purebuttons.com', logo: 'pure-buttons', tier: 4 },
  { name: 'Interview Cake', url: 'https://www.interviewcake.com', logo: 'interview-cake', tier: 4 },
  { name: 'RAN Foods', url: 'https://www.ranfoods.com', logo: 'ran-foods', tier: 4 },
  { name: 'FGF Brands', url: 'https://www.fgfbrands.com', logo: 'fgf', tier: 4 },
  { name: 'Vue School', url: 'https://vueschool.io', logo: 'vue-school', tier: 4 },
  { name: 'Intern Insider', url: 'https://www.interninsider.me', logo: 'intern-insider', tier: 4 },
  { name: '360Kids', url: 'https://www.360kids.ca', logo: '360kids', tier: 4 },
  { name: 'City of Brampton', url: 'https://www.brampton.ca', logo: 'brampton', tier: 4 },
  { name: 'Saily', url: 'https://saily.com', logo: 'saily', tier: 4 },
  // NordVPN's hackathon coupon link comes from last year's site; keep it unless they send a new one.
  { name: 'NordVPN', url: 'https://nordvpn.com/coupon/deal/?coupon=hackathons&utm_medium=affiliate&utm_source=aff92203&utm_campaign=off600', logo: 'nordvpn', tier: 4 },
  { name: 'NordPass', url: 'https://nordpass.com', logo: 'nordpass', tier: 4 },
  { name: 'NordProtect', url: 'https://nordprotect.com', logo: 'nordprotect', tier: 4 },
  { name: 'nexos.ai', url: 'https://nexos.ai', logo: 'nexos-ai', tier: 4 },
  { name: 'Incogni', url: 'https://incogni.com', logo: 'incogni', tier: 4 },
  { name: 'SCALE Without Borders', url: 'https://scalewithoutborders.com', logo: 'scale-without-borders', tier: 4 },
  { name: 'Girl Guides of Canada', url: 'https://www.girlguides.ca', logo: 'girl-guides', tier: 4 },
  { name: 'GitHub', url: 'https://github.com', logo: 'github', tier: 4 },
];

export const sponsors = sponsorList.map((sponsor) => ({
  ...sponsor,
  logo: logoFor(sponsor.logo),
}));

export const sponsorsInTier = (tier) => sponsors.filter((s) => s.tier === tier);
