import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Toolbar from '@/views/parts/Toolbar.vue'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'

describe('Toolbar.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('green bar', () => {
    it('carries the only two gestures of the site', () => {
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres: genreSeeder.getGenres(2),
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })

      const labels = wrapper.findAll('.toolbar__mode').map(mode => mode.text())
      expect(labels).toEqual(['Nouveau', 'Lire / continuer'])
    })

    it('switches to novel writing when clicking « Nouveau »', async () => {
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres: genreSeeder.getGenres(2),
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })

      const [newMode] = wrapper.findAll('.toolbar__mode')
      await newMode.trigger('click')

      expect(wrapper.emitted('update:mode')).toEqual([['create']])
    })

    it('highlights the reading mode based on the model', () => {
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres: genreSeeder.getGenres(2),
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })

      const readMode = wrapper.findAll('.toolbar__mode')[1]
      expect(readMode.classes()).toContain('toolbar__mode--active')
    })
  })

  describe('filters', () => {
    it('hides sorting and genre while writing, they only concern a grid', async () => {
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres: genreSeeder.getGenres(2),
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })
      expect(wrapper.findAll('.toolbar__side')).toHaveLength(2)

      await wrapper.setProps({ mode: 'create' })

      expect(wrapper.findAll('.toolbar__side')).toHaveLength(0)
    })
  })

  describe('sort placeholder', () => {
    it('shows the sort as disabled, no support count exists to rank on yet', () => {
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres: genreSeeder.getGenres(2),
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })

      const sort = wrapper.find('.toolbar__dropdown--disabled')
      expect(sort.text()).toBe('Top 10')
      expect(sort.attributes('disabled')).toBeDefined()
    })
  })

  describe('genre dropdown', () => {
    it('offers the genres the api knows, preceded by « Tous »', async () => {
      const genres = genreSeeder.getGenres(2)
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres,
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })
      await flushPromises()

      const labels = wrapper.findAll('.dropdown-item').map(item => item.text())
      expect(labels).toEqual(['Tous', ...genres.map(genre => genre.label)])
    })

    it('filters the novels on the picked genre', async () => {
      const genres = genreSeeder.getGenres(2)
      vi.spyOn(GenreController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        genres,
      })
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(1),
        pagination: paginationSeeder.getPagination(),
      })
      const store = createNovelFilterStore()
      const wrapper = mount(Toolbar, {
        props: { mode: 'read' },
        global: {
          provide: {
            [NOVEL_FILTER_STORE_KEY]: store,
            [NOVEL_STORE_KEY]: createNovelStore(),
          },
        },
      })
      await flushPromises()

      const [, pickedGenre] = genres
      const genre = wrapper
        .findAll('.dropdown-item')
        .find(item => item.text() === pickedGenre.label)
      await genre.trigger('click')
      await flushPromises()

      expect(store.genreId.value).toBe(pickedGenre.id)
      expect(NovelController.list).toHaveBeenCalledWith({
        page: 1,
        search: '',
        genreId: pickedGenre.id,
      })
    })
  })
})
