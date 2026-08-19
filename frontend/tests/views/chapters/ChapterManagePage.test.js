import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChapterManagePage from '@/views/chapters/ChapterManagePage.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form, router } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ChapterManagePage.vue', () => {
  let wrapper

  const parent = () => chapterSeeder.getChapter({ id: 10, title: 'Le virage' })

  beforeEach(() => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: [],
    })
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    form.clearErrors()
    vi.restoreAllMocks()
    await router.push('/')
  })

  const mountWriting = async () => {
    vi.spyOn(ChapterController, 'getById').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapter: parent(),
    })
    useAuthStore().setUser(userSeeder.getUser())
    await router.push({
      name: 'chapter-write',
      params: { slug: 'nuit-virage', parentId: 10 },
    })
    wrapper = mount(ChapterManagePage)
    await flushPromises()
    return wrapper
  }

  const mountEditing = async edited => {
    vi.spyOn(ChapterController, 'getById').mockImplementation(async id =>
      id === 44
        ? { status: STATUS.SUCCESS, chapter: edited }
        : { status: STATUS.SUCCESS, chapter: parent() },
    )
    useAuthStore().setUser(userSeeder.getUser())
    await router.push({ name: 'chapter-edit', params: { id: 44 } })
    wrapper = mount(ChapterManagePage)
    await flushPromises()
    return wrapper
  }

  const fillForm = async formData => {
    await wrapper.find('input[name="chapter.title"]').setValue(formData.title)
    await wrapper.findAll('.chapter-body__section')[1].trigger('click')
    await wrapper.find('textarea[name="chapter.summary"]').setValue(formData.summary)
    await wrapper.findAll('.chapter-body__section')[0].trigger('click')
    await wrapper.find('textarea[name="chapter.content"]').setValue(formData.content)
  }

  describe('writing a continuation', () => {
    it('names the chapter being continued, without crediting its author', async () => {
      await mountWriting()

      expect(ChapterController.getById).toHaveBeenCalledWith(10)
      const notice = wrapper.find('.chapter-manage-page__continuing')
      expect(notice.text()).toContain('Le virage')
      expect(notice.text()).not.toContain('GhostWriter')
    })

    it('reopens the draft already started on this parent instead of a blank form', async () => {
      ChapterController.drafts.mockResolvedValue({
        status: STATUS.SUCCESS,
        chapters: [chapterSeeder.getChapter({ id: 44, parentId: 10, isDraft: true })],
      })
      const replace = vi.spyOn(router, 'replace').mockResolvedValue()

      await mountWriting()

      expect(ChapterController.drafts).toHaveBeenCalledWith({ parentId: 10 })
      expect(replace).toHaveBeenCalledWith({ name: 'chapter-edit', params: { id: 44 } })
      expect(ChapterController.getById).not.toHaveBeenCalled()
    })

    it('does not publish a continuation with an empty text', async () => {
      const create = vi.spyOn(ChapterController, 'create')
      await mountWriting()

      await fillForm(chapterSeeder.getWriteForm({ content: '' }))
      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(create).not.toHaveBeenCalled()
      expect(form.getError('chapter.content')).toBe('chapter_manage.error_content_required')
    })

    it('sends the continuation with its parent and returns to the novel on success', async () => {
      const create = vi.spyOn(ChapterController, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        chapter: chapterSeeder.getChapter(),
      })
      const formData = chapterSeeder.getWriteForm({
        content: 'La voiture repartit en sens inverse, phares éteints. '.repeat(5),
      })
      await mountWriting()
      const push = vi.spyOn(router, 'push').mockResolvedValue()

      await fillForm(formData)
      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(create).toHaveBeenCalledWith('nuit-virage', formData)
      expect(push).toHaveBeenCalledWith({ name: 'novel-detail', params: { slug: 'nuit-virage' } })
    })
  })

  describe('resuming a draft', () => {
    it('fills the form with the chapter it resumes', async () => {
      await mountEditing(
        chapterSeeder.getChapter({ id: 44, isDraft: true, title: 'Nuit blanche', parentId: 10 }),
      )

      expect(wrapper.find('input[name="chapter.title"]').element.value).toBe('Nuit blanche')
    })

    it('keeps the thread visible, the draft says what it continues', async () => {
      await mountEditing(chapterSeeder.getChapter({ id: 44, isDraft: true, parentId: 10 }))

      expect(wrapper.find('.chapter-manage-page__continuing').text()).toContain('Le virage')
    })

    it('stays silent about a parent when the chapter opens the novel', async () => {
      await mountEditing(chapterSeeder.getChapter({ id: 44, isDraft: true, parentId: undefined }))

      expect(wrapper.find('.chapter-manage-page__continuing').exists()).toBe(false)
      expect(ChapterController.getById).toHaveBeenCalledTimes(1)
    })

    it('updates then publishes, and opens the novel', async () => {
      const update = vi
        .spyOn(ChapterController, 'update')
        .mockResolvedValue({ status: STATUS.SUCCESS })
      const publish = vi
        .spyOn(ChapterController, 'publish')
        .mockResolvedValue({ status: STATUS.SUCCESS })
      await mountEditing(chapterSeeder.getChapter({ id: 44, isDraft: true, parentId: 10 }))
      const push = vi.spyOn(router, 'push').mockResolvedValue()

      await wrapper.find('.chapter-manage-page__form').trigger('submit')
      await flushPromises()

      expect(update).toHaveBeenCalledWith(44, expect.objectContaining({ title: 'Le virage' }))
      expect(publish).toHaveBeenCalledWith(44)
      expect(push).toHaveBeenCalledWith({ name: 'novel-detail', params: { slug: 'nuit-virage' } })
    })

    it('states that the correction can only be spent once', async () => {
      await mountEditing(
        chapterSeeder.getChapter({ id: 44, isDraft: false, isCorrectable: true, parentId: 10 }),
      )

      expect(wrapper.find('.chapter-manage-page__once').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__spent').exists()).toBe(false)
    })

    it('says the correction is gone once it has been spent', async () => {
      await mountEditing(
        chapterSeeder.getChapter({ id: 44, isDraft: false, isCorrectable: false, parentId: 10 }),
      )

      expect(wrapper.find('.chapter-manage-page__spent').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__remaining').exists()).toBe(false)
    })

    it('counts the words still modifiable while the author types', async () => {
      await mountEditing(
        chapterSeeder.getChapter({
          id: 44,
          isDraft: false,
          isCorrectable: true,
          content: 'la voiture avait quitte la route au troisieme virage',
          parentId: 10,
        }),
      )

      expect(wrapper.find('.chapter-manage-page__remaining').text()).toContain('5')

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('la voiture avait quitté la route au troisième virage')

      expect(wrapper.find('.chapter-manage-page__remaining').text()).toContain('3')
      expect(wrapper.find('.chapter-manage-page__exceeded').exists()).toBe(false)
    })

    it('warns as soon as the rewrite passes the allowance', async () => {
      await mountEditing(
        chapterSeeder.getChapter({
          id: 44,
          isDraft: false,
          isCorrectable: true,
          content: 'la voiture avait quitte la route au troisieme virage',
          parentId: 10,
        }),
      )

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('un tout autre texte ecrit par dessus le precedent sans rien garder')

      expect(wrapper.find('.chapter-manage-page__exceeded').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__remaining').exists()).toBe(false)
    })

    it('blocks the save as soon as the rewrite passes the allowance', async () => {
      await mountEditing(
        chapterSeeder.getChapter({
          id: 44,
          isDraft: false,
          isCorrectable: true,
          content: 'la voiture avait quitte la route au troisieme virage',
          parentId: 10,
        }),
      )

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeUndefined()

      await wrapper
        .find('textarea[name="chapter.content"]')
        .setValue('un tout autre texte ecrit par dessus le precedent sans rien garder')

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeDefined()
    })

    it('blocks the save on a chapter whose correction is already spent', async () => {
      await mountEditing(
        chapterSeeder.getChapter({ id: 44, isDraft: false, isCorrectable: false, parentId: 10 }),
      )

      expect(wrapper.find('.chapter-manage-page__correct').attributes('disabled')).toBeDefined()
    })

    it('warns on a published chapter and drops the publish button', async () => {
      await mountEditing(chapterSeeder.getChapter({ id: 44, isDraft: false, parentId: 10 }))

      expect(wrapper.find('.chapter-manage-page__warning').exists()).toBe(true)
      expect(wrapper.find('.chapter-manage-page__publish').exists()).toBe(false)
      expect(wrapper.find('.chapter-manage-page__draft').exists()).toBe(false)
      expect(wrapper.find('.chapter-manage-page__correct').exists()).toBe(true)
    })
  })

  it('offers the same story and summary panels as the novel form', async () => {
    await mountWriting()

    const sections = wrapper.findAll('.chapter-body__section')
    expect(sections.map(section => section.text())).toEqual(['Récit', 'Résumé'])
    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(false)

    await sections[1].trigger('click')

    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(false)
  })
})
