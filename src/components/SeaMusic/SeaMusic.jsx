import { useSyncExternalStore } from "react";
import { isSeaPlaying, subscribeSea, toggleSea } from "../../audio/seaSound";

// Floating sound button. While the music plays, the bars move like a little equalizer.
function SeaMusic() {
  const playing = useSyncExternalStore(subscribeSea, isSeaPlaying);

  return (
    <button
      type="button"
      onClick={toggleSea}
      aria-pressed={playing}
      aria-label={playing ? "Mute sea music" : "Play sea music"}
      title={playing ? "Mute sea music" : "Play sea music"}
      className="group fixed right-4 bottom-4 z-[150] flex h-14 items-center gap-2 rounded-full bg-[#131c34]/90 px-4 font-poppins text-sm font-semibold text-[#c4ecfd] shadow-[0_6px_18px_rgba(5,10,30,0.45)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#273659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd] motion-reduce:hover:translate-y-0 sm:right-6 sm:bottom-6"
    >
      <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
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
