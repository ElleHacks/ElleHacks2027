import { useState } from "react";
import PlaceholderTag from "../PlaceholderTag";
import { placeholderHighlight } from "../placeholderStyles";
import { schedule } from "../dashboardContent";

function Schedule() {
  const [dayIndex, setDayIndex] = useState(0);
  const day = schedule[dayIndex];
  const hasTabs = schedule.length > 1;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Schedule</h1>

      <div>
        {/* Day tabs only appear once there's more than one day */}
        {hasTabs && (
          <div role="tablist" aria-label="Event day" className="mb-6 flex flex-wrap gap-2">
            {schedule.map((d, i) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                id={`day-tab-${i}`}
                aria-selected={i === dayIndex}
                aria-controls="schedule-panel"
                onClick={() => setDayIndex(i)}
                className={`cursor-pointer rounded-full border-0 px-5 py-2 font-['Poppins'] text-base font-semibold transition ${
                  i === dayIndex ? "bg-[#060e22] text-[#fff9f6]" : "bg-[#060e22]/8 text-[#060e22] hover:bg-[#060e22]/15"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>
        )}

        <ol
          id="schedule-panel"
          role={hasTabs ? "tabpanel" : undefined}
          aria-labelledby={hasTabs ? `day-tab-${dayIndex}` : undefined}
          className="m-0 list-none border-l-2 border-[#060e22]/15 p-0 pl-6"
        >
          {day.events.map((event, i) => (
            <li key={i} className="relative pb-4 last:pb-0">
              <span
                className="absolute top-6 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-[#fff9f6] bg-[#060e22]"
                aria-hidden="true"
              />
              <div
                className={`flex flex-col gap-2 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6 ${
                  event.placeholder ? placeholderHighlight : "bg-white"
                }`}
              >
                <time className="w-24 shrink-0 text-base font-bold">{event.time}</time>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-lg font-semibold">{event.title}</p>
                  <p className="m-0 text-base text-[#060e22]/70">{event.location}</p>
                </div>
                {event.placeholder && (
                  <div className="self-start sm:self-center">
                    <PlaceholderTag />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Schedule;
