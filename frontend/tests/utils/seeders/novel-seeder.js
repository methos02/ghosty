const getNovelApi = (overrides = {}) => ({
  id: 1,
  slug: 'le-roman-fantome',
  title: 'Le Roman Fantôme',
  cover_url: 'https://example.test/covers/1.jpg',
  is_favorite: false,
  chapters_count: 12,
  author: { id: 7, pseudo: 'GhostWriter' },
  genre: { id: 3, name: 'Fantastique' },
  ...overrides,
})

const getNovelsApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getNovelApi({
      id: index + 1,
      slug: `roman-${index + 1}`,
      title: `Roman ${index + 1}`,
    }),
  )
}

export const novelSeeder = { getNovelApi, getNovelsApi }
