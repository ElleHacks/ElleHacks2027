import sea from "../../assets/Location/Sea.png";
import fish from "../../assets/Location/fish.png";

const maps = [
  {
    label: "Google Maps",
    title: "Google Map of the Bergeron Centre at York University",
    src: "https://www.google.com/maps?q=Bergeron+Centre+for+Engineering+Excellence,+York+University&z=16&output=embed",
    link: "https://www.google.com/maps/search/?api=1&query=Bergeron+Centre+for+Engineering+Excellence+York+University",
  },
  {
    label: "York Campus Map",
    title: "York University interactive campus map showing the Bergeron Centre",
    src: "https://map.concept3d.com/?id=1200#!m/317129",
    link: "https://map.concept3d.com/?id=1200#!m/317129",
  },
];

function Location() {
  return (
    <section
      className="@container relative w-full overflow-hidden bg-[linear-gradient(180deg,#2D80BB_0%,#2a62a6_45%,#2C488C_100%)]"
      aria-labelledby="location-heading"
    >
      <div className="relative w-full aspect-[2880/1888]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={sea}
            alt=""
            className="absolute top-0 left-0 z-[1] h-auto w-full max-w-none select-none"
          />
          <img
            src={fish}
            alt=""
            className="absolute bottom-[6%] left-[24%] z-[2] h-auto w-[9%] max-w-none select-none"
          />
        </div>

        <div className="absolute top-[54%] left-[7%] z-10 w-[30%]">
          <h2
            id="location-heading"
            className="m-0 font-['Poppins'] text-[3.82cqw] leading-[1.29] font-bold text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]"
          >
            Location
          </h2>
          <p className="m-0 mt-[1.6cqw] font-['Poppins'] text-[1.67cqw] leading-[1.35] font-bold text-[#FFEFD8] [text-shadow:0_2px_4px_rgba(0,0,0,0.25)]">
            Bergeron Centre for Engineering Excellence
          </p>
          <p className="m-0 mt-[0.8cqw] font-['Poppins'] text-[1.39cqw] leading-[1.5] font-semibold text-white">
            York University
            <br />
            4700 Keele St
            <br />
            Toronto, ON M3J 1P3
          </p>
        </div>
      </div>

      <div className="relative z-10 grid gap-5 px-5 pb-10 sm:absolute sm:right-[5%] sm:bottom-[7%] sm:w-[56%] sm:grid-cols-2 sm:gap-[2cqw] sm:p-0">
        {maps.map((map) => (
          <figure
            key={map.label}
            className="m-0 rounded-[1.6rem] bg-[#131c34] p-3 shadow-[0_0.4cqw_1.2cqw_rgba(5,10,30,0.35)] sm:rounded-[2cqw] sm:p-[0.9cqw]"
          >
            <figcaption className="flex items-center justify-between px-2 pb-2 sm:px-[0.6cqw] sm:pb-[0.7cqw]">
              <span className="font-['Poppins'] text-base leading-none font-bold text-white sm:text-[1.39cqw]">
                {map.label}
              </span>
              <a
                href={map.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Poppins'] text-sm leading-none font-semibold text-[#c4ecfd] no-underline hover:text-white sm:text-[1.15cqw]"
              >
                Open full map ↗
              </a>
            </figcaption>
            <iframe
              src={map.src}
              title={map.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block aspect-[4/3] w-full rounded-[1.1rem] border-0 bg-[#273659] sm:rounded-[1.3cqw]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export default Location;
