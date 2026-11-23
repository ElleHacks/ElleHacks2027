// Content for the hacker dashboard's Schedule, Announcements and Event Info pages.
// There's no backend for these yet, so organizers edit this file directly.
// Entries marked `placeholder: true` are stand-ins shown with a yellow PLACEHOLDER tag; replace them with real content.

export const announcements = [
  {
    id: "placeholder-1",
    title: "Announcement title",
    postedAt: "2026-11-21T12:00:00-05:00",
    body: "Announcement text goes here.",
    placeholder: true,
  },
];

export const schedule = [
  {
    day: "Day 1",
    events: [
      { time: "Time", title: "Event name", location: "Location", placeholder: true },
      { time: "Time", title: "Event name", location: "Location", placeholder: true },
    ],
  },
];

export const eventInfo = {
  date: "January 2027",
  format: "In-person event",
  venue: "York University",
  campus: "Keele Campus",
  address: ["198 York Blvd", "Toronto, ON M3J 1P3"],
  mapLink: "https://www.google.com/maps/search/?api=1&query=York+University+Keele+Campus",
  email: "questions@ellehacks.com",
  // Sections we don't have details for yet
  extra: [{ title: "Section title", body: "Details go here.", placeholder: true }],
};
