import sea from "../../assets/Location/Sea.png";
import fish from "../../assets/Location/fish.png";
import Reveal from "../Reveal/Reveal";

const mapQuery = "Bergeron Center for Engineering Excellence, 4700 Keele St, North York, ON M3J 1P3";
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

function Location() {
  return (
    <section
      className="@container relative min-h-[44rem] w-full overflow-hidden bg-[linear-gradient(180deg,#2D81BC_0%,#3967AB_100%)] md:aspect-[2880/1888] md:min-h-0"
      aria-labelledby="location-heading"
    >
      <img
        src={sea}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-auto w-full max-w-none select-none"
      />
      <img
        src={fish}
        alt=""
        className="pointer-events-none absolute bottom-[13%] left-[43%] z-[1] h-auto w-[10%] max-w-none select-none"
      />

      <Reveal className="relative z-10 mx-4 my-8 md:absolute md:top-1/2 md:right-[5%] md:my-0 md:w-[40%] md:-translate-y-1/2">
        <div className="rounded-[1.6rem] bg-[#060E22]/75 px-6 py-7 shadow-[0_0.6cqw_1.6cqw_rgba(5,10,30,0.28)] md:rounded-[1.8cqw] md:px-[2.4cqw] md:py-[2.2cqw]">
          <h2
            id="location-heading"
            className="m-0 font-['Poppins'] text-4xl leading-none font-bold text-[#FFEFD8] md:text-[3.3cqw]"
          >
            Location
          </h2>
          <p className="m-0 mt-5 font-['Poppins'] text-lg leading-none font-bold text-white md:mt-[1.6cqw] md:text-[1.45cqw]">
            Address
          </p>
          <p className="m-0 mt-2 font-['Poppins'] text-base leading-[1.45] font-medium text-white md:mt-[0.7cqw] md:text-[1.15cqw]">
            Bergeron Center for Engineering Excellence
            <br />
            4700 Keele St., 11 Arboretum Lane,
            <br />
            North York, ON, M3J 1P3
          </p>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full bg-[#C4ECFD] px-4 py-2 font-['Poppins'] text-sm leading-none font-semibold text-[#243056] no-underline transition-colors hover:bg-white md:mt-[1.5cqw] md:px-[1.15cqw] md:py-[0.55cqw] md:text-[1.05cqw]"
          >
            View interactive map
          </a>
          <div className="mt-5 overflow-hidden rounded-[1rem] bg-[#d9d9d9] md:mt-[1.6cqw] md:rounded-[1.1cqw]">
            <iframe
              src={mapSrc}
              title="Google Map of the Bergeron Center for Engineering Excellence"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block aspect-[16/7] w-full border-0"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default Location;
