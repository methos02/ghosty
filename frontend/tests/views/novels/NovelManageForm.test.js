import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NovelManageForm from '@/views/novels/NovelManageForm.vue'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form, router } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('NovelManageForm.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(GenreController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      genres: genreSeeder.getGenres(3),
    })
    vi.spyOn(router, 'push').mockResolvedValue()
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: [],
    })
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    useAuth().closeDialogs()
    form.clearErrors()
    await routerPlugin.getRouter().push('/')
    vi.clearAllMocks()
  })

  it('leaves every field open before a genre is chosen', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    expect(wrapper.find('input[name="novel.title"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('input[name="chapter.title"]').attributes('disabled')).toBeUndefined()
  })

  it('refuses to publish an empty form and flags every required field', async () => {
    const create = vi.spyOn(NovelController, 'create')
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    expect(create).not.toHaveBeenCalled()
    expect(form.getError('novel.genreId')).toBe('novel_manage.error_genre_required')
    expect(form.getError('novel.title')).toBe('novel_manage.error_title_required')
    expect(form.getError('chapter.title')).toBe('novel_manage.error_chapter_title_required')
    expect(form.getError('chapter.content')).toBe('novel_manage.error_chapter_content_required')
    expect(form.getError('chapter.summary')).toBe('novel_manage.error_chapter_summary_required')
  })

  it('reddens the section holding the error without leaving the open one', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.findAll('.chapter-body__section')[1].trigger('click')
    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    const [content, summary] = wrapper.findAll('.chapter-body__section')
    expect(content.classes()).toContain('btn-danger-alt')
    expect(summary.classes()).toContain('btn-danger')
    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
  })

  it('keeps a section green while its own field is filled', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('textarea[name="chapter.content"]').setValue('Il pleut.')
    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    const [content, summary] = wrapper.findAll('.chapter-body__section')
    expect(content.classes()).toContain('btn-primary')
    expect(summary.classes()).toContain('btn-danger-alt')
  })

  it('publishes the novel however short its chapter and opens it', async () => {
    const novel = novelSeeder.getNovel()
    const create = vi.spyOn(NovelController, 'create').mockResolvedValue({
      status: STATUS.SUCCESS,
      novel,
    })
    const formData = novelSeeder.getCreateForm({ chapter: { content: 'Il pleut.' } })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('select[name="novel.genreId"]').setValue(formData.novel.genreId)
    await wrapper.find('input[name="novel.title"]').setValue(formData.novel.title)
    await wrapper.find('input[name="chapter.title"]').setValue(formData.chapter.title)
    await wrapper.find('textarea[name="chapter.content"]').setValue(formData.chapter.content)
    await wrapper.findAll('.chapter-body__section')[1].trigger('click')
    await wrapper.find('textarea[name="chapter.summary"]').setValue(formData.chapter.summary)
    await wrapper.findAll('.chapter-body__section')[0].trigger('click')
    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    expect(create).toHaveBeenCalledWith({
      novel: formData.novel,
      chapter: { ...formData.chapter, isDraft: false },
    })
    expect(router.push).toHaveBeenCalledWith({
      name: 'novel-detail',
      params: { slug: novel.slug },
    })
  })

  it('saves a draft and sends the reader to the drafts', async () => {
    const create = vi.spyOn(NovelController, 'create').mockResolvedValue({
      status: STATUS.SUCCESS,
      novel: novelSeeder.getNovel(),
    })
    const formData = novelSeeder.getCreateForm()
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('select[name="novel.genreId"]').setValue(formData.novel.genreId)
    await wrapper.find('input[name="novel.title"]').setValue(formData.novel.title)
    await wrapper.find('input[name="chapter.title"]').setValue(formData.chapter.title)
    await wrapper.find('textarea[name="chapter.content"]').setValue(formData.chapter.content)
    await wrapper.findAll('.chapter-body__section')[1].trigger('click')
    await wrapper.find('textarea[name="chapter.summary"]').setValue(formData.chapter.summary)
    await wrapper.findAll('.chapter-body__section')[0].trigger('click')
    await wrapper.find('.novel-manage__draft').trigger('click')
    await flushPromises()

    expect(create).toHaveBeenCalled()
    expect(create.mock.calls[0][0].chapter.isDraft).toBe(true)
    expect(router.push).toHaveBeenCalledWith({ name: 'drafts' })
  })

  it('fills the form with the novel and chapter it resumes', async () => {
    vi.spyOn(ChapterController, 'getById').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapter: chapterSeeder.getChapter({
        id: 12,
        isDraft: true,
        isRoot: true,
        title: 'Le virage',
      }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: 12 } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    expect(wrapper.find('input[name="novel.title"]').element.value).toBe('Nuit virage')
    expect(wrapper.find('input[name="chapter.title"]').element.value).toBe('Le virage')
    expect(wrapper.find('select[name="novel.genreId"]').element.value).toBe('3')
  })

  it('updates the resumed novel instead of creating a second one', async () => {
    const resumed = chapterSeeder.getChapter({
      id: 12,
      isDraft: true,
      isRoot: true,
      title: 'Le virage',
    })
    const create = vi.spyOn(NovelController, 'create')
    const updateNovel = vi
      .spyOn(NovelController, 'update')
      .mockResolvedValue({ status: STATUS.SUCCESS, novel: novelSeeder.getNovel() })
    const updateChapter = vi
      .spyOn(ChapterController, 'update')
      .mockResolvedValue({ status: STATUS.SUCCESS, chapter: resumed })
    vi.spyOn(ChapterController, 'getById').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapter: resumed,
    })
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: 12 } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__draft').trigger('click')
    await flushPromises()

    expect(create).not.toHaveBeenCalled()
    expect(updateNovel).toHaveBeenCalledWith('nuit-virage', {
      genreId: 3,
      title: 'Nuit virage',
    })
    expect(updateChapter).toHaveBeenCalledWith(12, {
      title: 'Le virage',
      content: resumed.content,
      summary: resumed.summary,
      isDraft: true,
    })
    expect(router.push).toHaveBeenCalledWith({ name: 'drafts' })
  })

  it('publishes the resumed draft and opens the novel', async () => {
    const resumed = chapterSeeder.getChapter({
      id: 12,
      isDraft: true,
      isRoot: true,
      title: 'Le virage',
    })
    vi.spyOn(NovelController, 'update').mockResolvedValue({
      status: STATUS.SUCCESS,
      novel: novelSeeder.getNovel(),
    })
    vi.spyOn(ChapterController, 'update').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapter: resumed,
    })
    const publish = vi
      .spyOn(ChapterController, 'publish')
      .mockResolvedValue({ status: STATUS.SUCCESS, chapter: resumed })
    vi.spyOn(ChapterController, 'getById').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapter: resumed,
    })
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: 12 } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    expect(publish).toHaveBeenCalledWith(12)
    expect(router.push).toHaveBeenCalledWith({
      name: 'novel-detail',
      params: { slug: 'nuit-virage' },
    })
  })

  describe('draft picker', () => {
    it('stays hidden when the author has no novel draft', async () => {
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()

      expect(wrapper.find('.novel-manage__draft-select').exists()).toBe(false)
    })

    it('asks the api for novel drafts only, a chapter draft belongs to another form', async () => {
      ChapterController.drafts.mockResolvedValueOnce({
        status: STATUS.SUCCESS,
        chapters: [
          chapterSeeder.getChapter({
            id: 12,
            isDraft: true,
            isRoot: true,
            novel: novelSeeder.getNovel({ title: 'Nuit virage' }),
          }),
        ],
      })
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()

      expect(ChapterController.drafts).toHaveBeenCalledWith({ isRoot: true })
      const labels = wrapper
        .findAll('.novel-manage__draft-select option')
        .map(item => item.text())
        .filter(Boolean)
      expect(labels).toEqual(['Nouveau roman', 'Nuit virage'])
    })

    it('resumes the picked draft through the edit route', async () => {
      ChapterController.drafts.mockResolvedValueOnce({
        status: STATUS.SUCCESS,
        chapters: [
          chapterSeeder.getChapter({
            id: 12,
            isDraft: true,
            isRoot: true,
            novel: novelSeeder.getNovel({ title: 'Nuit virage' }),
          }),
        ],
      })
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()

      await wrapper.find('.novel-manage__draft-select select').setValue(12)

      expect(router.push).toHaveBeenCalledWith({ name: 'novel-edit', params: { id: 12 } })
    })

    it('starts a new novel when picking the first entry', async () => {
      ChapterController.drafts.mockResolvedValueOnce({
        status: STATUS.SUCCESS,
        chapters: [
          chapterSeeder.getChapter({
            id: 12,
            isDraft: true,
            isRoot: true,
            novel: novelSeeder.getNovel({ title: 'Nuit virage' }),
          }),
        ],
      })
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: chapterSeeder.getChapterApi({ id: 12, is_draft: true }) }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()
      await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: 12 } })
      await flushPromises()

      await wrapper.find('.novel-manage__draft-select select').setValue(undefined)

      expect(router.push).toHaveBeenCalledWith({ name: 'novel-create' })
    })
  })
})
