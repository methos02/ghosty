import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NovelManageForm from '@/views/novels/NovelManageForm.vue'
import { GenreRepository } from '@/apis/genres/repositories/genre-repository.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { form, router, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('NovelManageForm.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(GenreRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: genreSeeder.getGenresApi(3) }),
    )
    vi.spyOn(router, 'push').mockResolvedValue()
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [] }) }),
    )
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
    vi.spyOn(NovelRepository, 'create')
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    expect(NovelRepository.create).not.toHaveBeenCalled()
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
    const novelApi = novelSeeder.getNovelApi()
    vi.spyOn(NovelRepository, 'create').mockResolvedValue(controllerSuccess({ data: novelApi }))
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

    expect(NovelRepository.create).toHaveBeenCalledWith({
      body: NovelDto.toCreate({
        novel: formData.novel,
        chapter: { ...formData.chapter, isDraft: false },
      }),
    })
    expect(router.push).toHaveBeenCalledWith({
      name: 'novel-detail',
      params: { slug: novelApi.slug },
    })
  })

  it('saves a draft and sends the reader to the drafts', async () => {
    vi.spyOn(NovelRepository, 'create').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getNovelApi() }),
    )
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

    expect(NovelRepository.create).toHaveBeenCalledWith({
      body: NovelDto.toCreate({
        novel: formData.novel,
        chapter: { ...formData.chapter, isDraft: true },
      }),
    })
    expect(router.push).toHaveBeenCalledWith({ name: 'drafts' })
  })

  it('fills the form with the novel and chapter it resumes', async () => {
    const resumedApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
      controllerSuccess({ data: resumedApi }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: resumedApi.id } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    expect(wrapper.find('input[name="novel.title"]').element.value).toBe(resumedApi.novel.title)
    expect(wrapper.find('input[name="chapter.title"]').element.value).toBe(resumedApi.title)
    expect(wrapper.find('select[name="novel.genreId"]').element.value).toBe(
      String(resumedApi.novel.genre_id),
    )
  })

  it('updates the resumed novel instead of creating a second one', async () => {
    const resumedApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    const resumed = ChapterDto.fromShow(resumedApi)
    vi.spyOn(NovelRepository, 'create')
    vi.spyOn(NovelRepository, 'update').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getNovelApi() }),
    )
    vi.spyOn(ChapterRepository, 'update').mockResolvedValue(controllerSuccess({ data: resumedApi }))
    vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
      controllerSuccess({ data: resumedApi }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: resumedApi.id } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__draft').trigger('click')
    await flushPromises()

    expect(NovelRepository.create).not.toHaveBeenCalled()
    expect(NovelRepository.update).toHaveBeenCalledWith({
      params: NovelDto.toShowParams(resumed.novel.slug),
      body: NovelDto.toUpdate(resumed.novel),
    })
    expect(ChapterRepository.update).toHaveBeenCalledWith({
      params: ChapterDto.toChapterParams(resumed.id),
      body: ChapterDto.toUpdate(resumed),
    })
    expect(router.push).toHaveBeenCalledWith({ name: 'drafts' })
  })

  it('publishes the resumed draft and opens the novel', async () => {
    const resumedApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    vi.spyOn(NovelRepository, 'update').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getNovelApi() }),
    )
    vi.spyOn(ChapterRepository, 'update').mockResolvedValue(controllerSuccess({ data: resumedApi }))
    vi.spyOn(ChapterRepository, 'publish').mockResolvedValue(
      controllerSuccess({ data: resumedApi }),
    )
    vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
      controllerSuccess({ data: resumedApi }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: resumedApi.id } })
    wrapper = mount(NovelManageForm)
    await flushPromises()

    await wrapper.find('.novel-manage__form').trigger('submit')
    await flushPromises()

    expect(ChapterRepository.publish).toHaveBeenCalledWith({
      params: ChapterDto.toChapterParams(resumedApi.id),
    })
    expect(router.push).toHaveBeenCalledWith({
      name: 'novel-detail',
      params: { slug: resumedApi.novel.slug },
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
      const draftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
      ChapterRepository.drafts.mockResolvedValueOnce(
        controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [draftApi] }) }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()

      expect(ChapterRepository.drafts).toHaveBeenCalledWith({
        params: ChapterDto.toDraftFilters({ isRoot: true }),
      })
      const labels = wrapper
        .findAll('.novel-manage__draft-select option')
        .map(item => item.text())
        .filter(Boolean)
      expect(labels).toEqual([t('novel_manage.draft_new'), draftApi.novel.title])
    })

    it('resumes the picked draft through the edit route', async () => {
      const draftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
      ChapterRepository.drafts.mockResolvedValueOnce(
        controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [draftApi] }) }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()

      await wrapper.find('.novel-manage__draft-select select').setValue(draftApi.id)

      expect(router.push).toHaveBeenCalledWith({ name: 'novel-edit', params: { id: draftApi.id } })
    })

    it('starts a new novel when picking the first entry', async () => {
      const draftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
      ChapterRepository.drafts.mockResolvedValueOnce(
        controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [draftApi] }) }),
      )
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: draftApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      wrapper = mount(NovelManageForm)
      await flushPromises()
      await routerPlugin.getRouter().push({ name: 'novel-edit', params: { id: draftApi.id } })
      await flushPromises()

      await wrapper.find('.novel-manage__draft-select select').setValue(undefined)

      expect(router.push).toHaveBeenCalledWith({ name: 'novel-create' })
    })
  })
})
