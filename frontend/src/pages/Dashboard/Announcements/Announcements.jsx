import PlaceholderTag from "../PlaceholderTag";
import { placeholderHighlight } from "../placeholderStyles";
import { announcements } from "../dashboardContent";

const formatPosted = (iso) =>
  new Date(iso).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
  });

// Newest first
const sorted = [...announcements].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

function Announcements() {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Announcements</h1>

      {sorted.length === 0 ? (
        <p className="dashboard-page__placeholder">No announcements yet. Check back soon!</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-6 p-0">
          {sorted.map((item) => (
            <li key={item.id}>
              <article className={`overflow-hidden rounded-2xl ${item.placeholder ? placeholderHighlight : "bg-white"}`}>
                <header className="flex items-center gap-3 rounded-full bg-[#3B3F4E] px-6 py-3 text-[#fff9f6]">
                  <h2 className="m-0 flex-1 text-lg font-semibold">{item.title}</h2>
                  {item.placeholder && <PlaceholderTag />}
                </header>
                <div className="px-6 py-4">
                  <p className="m-0 text-lg leading-relaxed font-medium">{item.body}</p>
                  <time dateTime={item.postedAt} className="mt-3 block text-sm text-[#060e22]/60">
                    {formatPosted(item.postedAt)}
                  </time>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Announcements;
