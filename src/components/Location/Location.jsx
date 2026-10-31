import sea from "../../assets/Location/Sea.png";
import fish from "../../assets/Location/fish.png";

const mapSrc =
  "https://www.google.com/maps?q=Bergeron+Centre+for+Engineering+Excellence,+York+University&z=16&output=embed";
const mapLink =
  "https://www.google.com/maps/search/?api=1&query=Bergeron+Centre+for+Engineering+Excellence+York+University";

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
            className="absolute bottom-[10%] left-[11%] z-[2] h-auto w-[9%] max-w-none select-none"
          />
        </div>

      </div>

      <div className="relative z-10 px-5 pb-10 sm:absolute sm:right-[6%] sm:bottom-[8%] sm:w-[66%] sm:p-0">
        <div className="grid gap-5 rounded-[1.6rem] bg-[#131c34] p-5 shadow-[0_0.4cqw_1.2cqw_rgba(5,10,30,0.35)] sm:grid-cols-[2fr_3fr] sm:items-center sm:gap-[2.4cqw] sm:rounded-[2cqw] sm:p-[2cqw]">
          <div>
            <h2
              id="location-heading"
              className="m-0 font-['Poppins'] text-3xl leading-[1.29] font-bold text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] sm:text-[3.82cqw]"
            >
              Location
            </h2>
            <p className="m-0 mt-3 font-['Poppins'] text-lg leading-[1.35] font-bold text-[#FFEFD8] sm:mt-[1.2cqw] sm:text-[1.67cqw]">
              Bergeron Centre for Engineering Excellence
            </p>
            <p className="m-0 mt-2 font-['Poppins'] text-base leading-[1.5] font-semibold text-white sm:mt-[0.8cqw] sm:text-[1.39cqw]">
              York University
              <br />
              4700 Keele St
              <br />
              Toronto, ON M3J 1P3
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-['Poppins'] text-sm leading-none font-semibold text-[#c4ecfd] no-underline hover:text-white sm:mt-[1.2cqw] sm:text-[1.15cqw]"
            >
              Open full map ↗
            </a>
          </div>
          <iframe
            src={mapSrc}
            title="Google Map of the Bergeron Centre at York University"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block aspect-[4/3] w-full rounded-[1.1rem] border-0 bg-[#273659] sm:rounded-[1.3cqw]"
          />
        </div>
      </div>
    </section>
  );
}

export default Location;
