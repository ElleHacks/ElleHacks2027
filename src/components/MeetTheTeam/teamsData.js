const photoFiles = import.meta.glob(
  '../../assets/**/team*/*.{png,jpg,jpeg,webp}',
  { eager: true, import: 'default' }
);


const teamMeta = [
  { id: 'team1', name: 'Co-chairs' },
  { id: 'team2', name: 'Community Engagement' },
  { id: 'team3', name: 'Design' },
  { id: 'team4', name: 'IT' },
  { id: 'team5', name: 'Logistics' },
  { id: 'team6', name: 'Sponsorship' },
  { id: 'team7', name: 'Marketing' },
];


const toName = (path) =>
  path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .replace(/^\d+[-_]?/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const teams = teamMeta.map(({ id, name }) => ({
  id,
  name,
  members: Object.entries(photoFiles)
    .filter(([path]) => path.includes(`/${id}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, src]) => ({ name: toName(path), photo: src })),
}));