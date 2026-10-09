import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChapterManagePage from '@/views/chapters/ChapterManagePage.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { form, router, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ChapterManagePage.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [] }) }),
    )
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    form.clearErrors()
    vi.clearAllMocks()
    await router.push('/')
  })

  describe('writing a child', () => {
    it('names the chapter being continued, without crediting its author', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({
        name: 'chapter-write',
        params: { slug: parentApi.novel.slug, parentId: parentApi.id },
      })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(ChapterRepository.getById).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(parentApi.id),
      })
      const notice = wrapper.find('.chapter-manage-page__continuing')
      expect(notice.text()).toContain(parentApi.title)
      expect(notice.text()).not.toContain(parentApi.author.username)
    })

    it('reopens the draft already started on this parent instead of a blank form', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const draftApi = chapterSeeder.getChapterApi({
        id: 44,
        parent_id: parentApi.id,
        is_draft: true,
      })
      ChapterRepository.drafts.mockResolvedValueOnce(
        controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [draftApi] }) }),
      )
      const replace = vi.spyOn(router, 'replace').mockResolvedValueOnce()
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({
        name: 'chapter-write',
        params: { slug: parentApi.novel.slug, parentId: parentApi.id },
      })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(ChapterRepository.drafts).toHaveBeenCalledWith({
        params: ChapterDto.toDraftFilters({ parentId: parentApi.id }),
      })
      expect(replace).toHaveBeenCalledWith({ name: 'chapter-edit', params: { id: draftApi.id } })
      expect(ChapterRepository.getById).not.toHaveBeenCalled()
    })

    it('does not publish a child with an empty text', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const formData = chapterSeeder.getWriteForm({ content: '' })
      vi.spyOn(ChapterRepository, 'create')
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({
        name: 'chapter-write',
        params: { slug: parentApi.novel.slug, parentId: parentApi.id },
      })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      await wrapper.find('input[name="chapter.title"]').setValue(formData.title)
      await wrapper.findAll('.chapter-body__section')[1].trigger('click')
      await wrapper.find('textarea[name="chapter.summary"]').setValue(formData.summary)
      await wrapper.findAll('.chapter-body__section')[0].trigger('click')
      await wrapper.find('textarea[name="chapter.content"]').setValue(formData.content)
      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(ChapterRepository.create).not.toHaveBeenCalled()
      expect(form.getError('chapter.content')).toBe('chapter_manage.error_content_required')
    })

    it('sends the child with its parent and opens it for reading on success', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const publishedApi = chapterSeeder.getChapterApi({ id: 55, parent_id: parentApi.id })
      const formData = chapterSeeder.getWriteForm({ parentId: parentApi.id })
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue(
        controllerSuccess({ data: publishedApi }),
      )
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(
        controllerSuccess({ data: parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({
        name: 'chapter-write',
        params: { slug: parentApi.novel.slug, parentId: parentApi.id },
      })
      wrapper = mount(ChapterManagePage)
      await flushPromises()
      const push = vi.spyOn(router, 'push').mockResolvedValueOnce()

      await wrapper.find('input[name="chapter.title"]').setValue(formData.title)
      await wrapper.findAll('.chapter-body__section')[1].trigger('click')
      await wrapper.find('textarea[name="chapter.summary"]').setValue(formData.summary)
      await wrapper.findAll('.chapter-body__section')[0].trigger('click')
      await wrapper.find('textarea[name="chapter.content"]').setValue(formData.content)
      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(ChapterRepository.create).toHaveBeenCalledWith({
        params: ChapterDto.toCreateParams(parentApi.novel.slug),
        body: ChapterDto.toCreate(formData),
      })
      expect(push).toHaveBeenCalledWith({
        name: 'chapter-read',
        params: { slug: parentApi.novel.slug, id: publishedApi.id },
      })
    })
  })

  describe('resuming a draft', () => {
    it('fills the form with the chapter it resumes', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: true,
        title: 'Nuit blanche',
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('input[name="chapter.title"]').element.value).toBe(editedApi.title)
    })

    it('keeps the thread visible, the draft says what it continues', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: true,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__continuing').text()).toContain(parentApi.title)
    })

    it('stays silent about a parent when the chapter opens the novel', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({ id: 44, is_draft: true, parent_id: null })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__continuing').exists()).toBe(false)
      expect(ChapterRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('updates then publishes, and opens the chapter for reading', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: true,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue(
        controllerSuccess({ data: editedApi }),
      )
      vi.spyOn(ChapterRepository, 'publish').mockResolvedValue(
        controllerSuccess({ data: editedApi }),
      )
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()
      const push = vi.spyOn(router, 'push').mockResolvedValueOnce()

      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(ChapterRepository.update).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(editedApi.id),
        body: ChapterDto.toUpdate(ChapterDto.fromShow(editedApi)),
      })
      expect(ChapterRepository.publish).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(editedApi.id),
      })
      expect(push).toHaveBeenCalledWith({
        name: 'chapter-read',
        params: { slug: editedApi.novel.slug, id: editedApi.id },
      })
    })

    it('states that the correction can only be spent once', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: true,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__once').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__spent').exists()).toBe(false)
    })

    it('says the correction is gone once it has been spent', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: false,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__spent').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__remaining').exists()).toBe(false)
    })

    it('counts the words still modifiable while the author types', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: true,
        content: 'la voiture avait quitte la route au troisieme virage',
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__remaining').text()).toContain('5')

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('la voiture avait quitté la route au troisième virage')

      expect(wrapper.find('.chapter-manage-page__remaining').text()).toContain('3')
      expect(wrapper.find('.chapter-manage-page__exceeded').exists()).toBe(false)
    })

    it('warns as soon as the rewrite passes the allowance', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: true,
        content: 'la voiture avait quitte la route au troisieme virage',
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('un tout autre texte ecrit par dessus le precedent sans rien garder')

      expect(wrapper.find('.chapter-manage-page__exceeded').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__remaining').exists()).toBe(false)
    })

    it('blocks the save as soon as the rewrite passes the allowance', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: true,
        content: 'la voiture avait quitte la route au troisieme virage',
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeUndefined()

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('un tout autre texte ecrit par dessus le precedent sans rien garder')

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeDefined()
    })

    it('blocks the save on a chapter whose correction is already spent', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        is_correctable: false,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeDefined()
    })

    it('warns on a published chapter and drops the publish button', async () => {
      const parentApi = chapterSeeder.getChapterApi()
      const editedApi = chapterSeeder.getChapterApi({
        id: 44,
        is_draft: false,
        parent_id: parentApi.id,
      })
      vi.spyOn(ChapterRepository, 'getById').mockImplementation(async ({ params }) =>
        controllerSuccess({ data: params.chapter === editedApi.id ? editedApi : parentApi }),
      )
      useAuthStore().setUser(userSeeder.getUser())
      await router.push({ name: 'chapter-edit', params: { id: editedApi.id } })
      wrapper = mount(ChapterManagePage)
      await flushPromises()

      expect(wrapper.find('.chapter-manage-page__warning').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__publish').exists()).toBe(false)
      expect(wrapper.find('.chapter-manage-page__draft').exists()).toBe(false)
      expect(wrapper.find('.chapter-manage-page__correct').exists()).toBe(true)
    })
  })

  it('offers the same story and summary panels as the novel form', async () => {
    const parentApi = chapterSeeder.getChapterApi()
    vi.spyOn(ChapterRepository, 'getById').mockResolvedValue(controllerSuccess({ data: parentApi }))
    useAuthStore().setUser(userSeeder.getUser())
    await router.push({
      name: 'chapter-write',
      params: { slug: parentApi.novel.slug, parentId: parentApi.id },
    })
    wrapper = mount(ChapterManagePage)
    await flushPromises()

    const sections = wrapper.findAll('.chapter-body__section')
    expect(sections.map(section => section.text())).toEqual([
      t('chapter_body.content'),
      t('chapter_body.summary'),
    ])
    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(false)

    await sections[1].trigger('click')

    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(false)
  })
})
