import { useSyncExternalStore } from "react";
import { isSeaPlaying, subscribeSea, toggleSea } from "../../audio/seaSound";

// Floating sound button. Mobile matches the nav menu circle + headphones;
// from sm up it keeps the equalizer bars and label.
function SeaMusic() {
  const playing = useSyncExternalStore(subscribeSea, isSeaPlaying);

  return (
    <button
      type="button"
      onClick={toggleSea}
      aria-pressed={playing}
      aria-label={playing ? "Mute sea music" : "Play sea music"}
      title={playing ? "Mute sea music" : "Play sea music"}
      className="group fixed right-4 bottom-4 z-[150] flex h-[13.7cqw] w-[13.7cqw] items-center justify-center rounded-full bg-[#131c34]/90 font-poppins text-sm font-semibold text-[#c4ecfd] shadow-[0_6px_18px_rgba(5,10,30,0.45)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#273659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd] motion-reduce:hover:translate-y-0 sm:right-6 sm:bottom-6 sm:h-14 sm:w-auto sm:gap-2 sm:px-4"
    >
      {/* Mobile: headphones */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-[6.2cqw] w-[6.2cqw] sm:hidden ${playing ? "opacity-100" : "opacity-80"}`}
      >
        <path
          d="M4 13v3.5A2.5 2.5 0 0 0 6.5 19H8v-6H6.5A2.5 2.5 0 0 0 4 15.5V13Z"
          fill="currentColor"
        />
        <path
          d="M20 13v2.5a2.5 2.5 0 0 1-2.5 2.5H16v-6h1.5A2.5 2.5 0 0 1 20 15.5V13Z"
          fill="currentColor"
        />
        <path
          d="M4 13a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* sm+: equalizer bars */}
      <span aria-hidden="true" className="hidden h-5 items-end gap-[3px] sm:flex">
        {[0, 0.25, 0.5, 0.15].map((delay, i) => (
          <span
            key={i}
            style={{ animationDelay: `${delay}s` }}
            className={`w-[3px] origin-bottom rounded-full bg-current ${
              playing
                ? "h-5 animate-[eq-bar_0.9s_ease-in-out_infinite] motion-reduce:animate-none"
                : "h-1.5"
            }`}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{playing ? "Sea music on" : "Play sea music"}</span>
    </button>
  );
}

export default SeaMusic;
