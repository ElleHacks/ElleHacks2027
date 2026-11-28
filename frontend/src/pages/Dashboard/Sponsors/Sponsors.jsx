const logoFiles = import.meta.glob(
  "../../../assets/Dashboard/Sponsor-logos/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" },
);

const logoFor = (name) => {
  if (!name) return undefined;
  const entry = Object.entries(logoFiles).find(
    ([path]) => path.split("/").pop().replace(/\.\w+$/, "") === name,
  );
  return entry?.[1];
};

const sponsorList = [
  { name: "Wealthsimple", url: "https://www.wealthsimple.com", logo: "wealthsimple", tier: 1 },
  { name: "York Region", url: "https://www.york.ca", logo: "york-region", tier: 2 },
  { name: "Ubisoft Toronto", url: "https://www.ubisoft.com/en-ca", logo: "ubisoft-toronto", tier: 3 },
  { name: "Shopify", url: "https://www.shopify.com", logo: "shopify", tier: 3 },
  { name: "KPM Power", url: "https://www.kpmpower.com", logo: "kpm-power", tier: 3 },
  { name: "Communications Security Establishment Canada", url: "https://www.cse-cst.gc.ca", logo: "cse-cst", tier: 3 },
  { name: "Experience Ventures", url: "https://www.experienceventures.ca", logo: "experience-ventures", tier: 3 },
  { name: "Government of Canada's Innovative Work-Integrated Learning Initiative", url: "https://www.canada.ca/en.html", logo: "canada-wil", tier: 3 },
  { name: "FDM Group", url: "https://www.fdmgroup.com", logo: "fdm", tier: 3 },
  { name: "Porter Airlines", url: "https://www.flyporter.com", logo: "porter", tier: 4 },
  { name: "CPP Investments", url: "https://www.cppinvestments.com", logo: "cpp-investments", tier: 4 },
  { name: "CodeCrafters", url: "https://codecrafters.io", logo: "codecrafters", tier: 4 },
  { name: ".xyz", url: "https://gen.xyz", logo: "xyz", tier: 4 },
  { name: "Pure Buttons", url: "https://www.purebuttons.com", logo: "pure-buttons", tier: 4 },
  { name: "Interview Cake", url: "https://www.interviewcake.com", logo: "interview-cake", tier: 4 },
  { name: "RAN Foods", url: "https://www.ranfoods.com", logo: "ran-foods", tier: 4 },
  { name: "FGF Brands", url: "https://www.fgfbrands.com", logo: "fgf", tier: 4 },
  { name: "Vue School", url: "https://vueschool.io", logo: "vue-school", tier: 4 },
  { name: "Intern Insider", url: "https://www.interninsider.me", logo: "intern-insider", tier: 4 },
  { name: "360Kids", url: "https://www.360kids.ca", logo: "360kids", tier: 4 },
  { name: "City of Brampton", url: "https://www.brampton.ca", logo: "brampton", tier: 4 },
  { name: "Saily", url: "https://saily.com", logo: "saily", tier: 4 },
  { name: "NordVPN", url: "https://nordvpn.com/coupon/deal/?coupon=hackathons&utm_medium=affiliate&utm_source=aff92203&utm_campaign=off600", logo: "nordvpn", tier: 4 },
  { name: "NordPass", url: "https://nordpass.com", logo: "nordpass", tier: 4 },
  { name: "NordProtect", url: "https://nordprotect.com", logo: "nordprotect", tier: 4 },
  { name: "nexos.ai", url: "https://nexos.ai", logo: "nexos-ai", tier: 4 },
  { name: "Incogni", url: "https://incogni.com", logo: "incogni", tier: 4 },
  { name: "SCALE Without Borders", url: "https://scalewithoutborders.com", logo: "scale-without-borders", tier: 4 },
  { name: "Girl Guides of Canada", url: "https://www.girlguides.ca", logo: "girl-guides", tier: 4 },
  { name: "GitHub", url: "https://github.com", logo: "github", tier: 4 },
];

const sponsors = sponsorList.map((sponsor) => ({
  ...sponsor,
  logo: logoFor(sponsor.logo),
}));

function SponsorCard({ sponsor }) {
  const logo = sponsor.logo ? (
    <img
      src={sponsor.logo}
      alt=""
      className="block h-[90%] w-[92%] object-contain drop-shadow-[0_1px_2px_rgba(6,14,34,0.16)]"
    />
  ) : (
    <span className="text-center text-sm font-semibold leading-tight text-[#2c488c]">{sponsor.name}</span>
  );

  if (!sponsor.url) {
    return (
      <div className="flex min-h-0 min-w-0 w-full max-w-[clamp(220px,15.3vw,440px)] justify-self-center items-center justify-center overflow-hidden rounded-[clamp(12px,0.83vw,24px)] border border-[rgba(6,14,34,0.08)] bg-white p-[clamp(4px,0.28vw,8px)] shadow-[0_2px_6px_rgba(6,14,34,0.12)] @max-[560px]:rounded-lg">
        {logo}
      </div>
    );
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${sponsor.name} (opens in a new tab)`}
      className="group relative flex min-h-0 min-w-0 w-full max-w-[clamp(220px,15.3vw,440px)] justify-self-center items-center justify-center overflow-hidden rounded-[clamp(12px,0.83vw,24px)] border border-[rgba(6,14,34,0.08)] bg-white p-[clamp(4px,0.28vw,8px)] text-[#2c488c] no-underline shadow-[0_2px_6px_rgba(6,14,34,0.12)] transition-[translate,scale,filter] duration-200 hover:z-10 hover:-translate-y-[3px] hover:scale-[1.03] hover:drop-shadow-[0_4px_5px_rgba(6,14,34,0.22)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#2c488c] focus-visible:outline-offset-2 motion-reduce:transition-none @max-[560px]:rounded-lg"
    >
      {logo}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(57,103,171,0.14)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-full group-focus-visible:translate-x-full motion-reduce:hidden"
      />
    </a>
  );
}

function Sponsors() {
  const firstPanelSponsors = sponsors.slice(0, 6);
  const secondPanelSponsors = sponsors.slice(6, 12);
  const thirdPanelSponsors = sponsors.slice(12);

  return (
    <div className="dashboard-page dashboard-sponsors-page">
      <h1 className="dashboard-page__title">Meet our sponsors!</h1>
      <section
        aria-label="Sponsors"
        className="@container relative h-[max(460px,calc(100vh_-_287px))] w-full overflow-hidden max-[1200px]:h-auto"
      >
        <div className="grid h-full w-full grid-rows-[145fr_145fr_398fr] gap-[clamp(16px,1.11vw,32px)] max-[1200px]:flex max-[1200px]:h-auto max-[1200px]:flex-col max-[1200px]:gap-4">
          <div
            role="region"
            aria-label="First six sponsors"
            className="flex min-h-0 w-full items-center self-stretch overflow-hidden rounded-[clamp(18px,1.67vw,48px)] bg-[#d9d9d9] px-[clamp(16px,1.67vw,48px)] py-[clamp(8px,0.83vw,24px)] max-[1200px]:h-[145px] max-[1200px]:shrink-0 @max-[760px]:px-4 @max-[560px]:rounded-[18px] @max-[560px]:p-[10px]"
          >
            <div className="grid h-full w-full min-h-0 content-center justify-center gap-[clamp(8px,0.55vw,16px)] grid-cols-6 grid-rows-1 @max-[760px]:grid-cols-3 @max-[760px]:grid-rows-2">
              {firstPanelSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} />
              ))}
            </div>
          </div>

          <div
            role="region"
            aria-label="Next six sponsors"
            className="flex min-h-0 w-full items-center self-stretch overflow-hidden rounded-[clamp(18px,1.67vw,48px)] bg-[#d9d9d9] px-[clamp(16px,1.67vw,48px)] py-[clamp(8px,0.83vw,24px)] max-[1200px]:h-[145px] max-[1200px]:shrink-0 @max-[760px]:px-4 @max-[560px]:rounded-[18px] @max-[560px]:p-[10px]"
          >
            <div className="grid h-full w-full min-h-0 content-center justify-center gap-[clamp(8px,0.55vw,16px)] grid-cols-6 grid-rows-1 @max-[760px]:grid-cols-3 @max-[760px]:grid-rows-2">
              {secondPanelSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} />
              ))}
            </div>
          </div>

          <div
            role="region"
            aria-label="Remaining sponsors"
            className="flex min-h-0 w-full items-center self-stretch overflow-hidden rounded-[clamp(18px,1.67vw,48px)] bg-[#d9d9d9] px-[clamp(16px,1.67vw,48px)] py-[clamp(8px,0.83vw,24px)] max-[1200px]:h-auto max-[1200px]:min-h-[398px] @max-[760px]:px-4 @max-[560px]:rounded-[18px] @max-[560px]:p-[10px]"
          >
            <div className="grid h-full w-full min-h-0 content-center justify-center gap-[clamp(8px,0.55vw,16px)] grid-cols-6 grid-rows-3 @max-[900px]:auto-rows-[64px] @max-[900px]:grid-rows-none @max-[900px]:grid-cols-4 @max-[560px]:auto-rows-[52px] @max-[560px]:grid-cols-3">
              {thirdPanelSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sponsors;
