import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoverProposeDialog from '@/views/covers/parts/CoverProposeDialog.vue'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const router = routerPlugin.getRouter()

describe('CoverProposeDialog.vue', () => {
  let wrapper

  beforeAll(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:cover-preview')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  afterAll(() => {
    delete globalThis.URL.createObjectURL
    delete globalThis.URL.revokeObjectURL
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useCoverStore().coverStore.clear()
    flash.clearFlashes()
    form.clearErrors()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('does not upload anything while no image is chosen', async () => {
    vi.spyOn(CoverRepository, 'create')
    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(CoverRepository.create).not.toHaveBeenCalled()
    expect(form.getError('cover.image')).toBe('cover_propose_dialog.error_image_required')
  })

  it('previews the chosen image once cropped', async () => {
    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getImageFile()] })
    await input.trigger('change')

    await vi.waitFor(() =>
      expect(wrapper.find('.cover-image-field__preview').attributes('src')).toBe(
        'blob:cover-preview',
      ),
    )
  })

  it('proposes the chosen image for the novel, then adds it to the novel covers and closes', async () => {
    const novel = novelSeeder.getNovel()
    const storedCoverApi = coverSeeder.getStoredCoverApi({
      cover: coverSeeder.getCoverApi({ id: 9 }),
    })
    vi.spyOn(CoverRepository, 'create').mockResolvedValue({
      status: STATUS.CREATED,
      data: storedCoverApi,
    })
    await router.push({ name: 'novel-covers', params: { slug: novel.slug } })
    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getImageFile()] })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const [options] = CoverRepository.create.mock.calls[0]
    expect(options.params).toEqual(CoverDto.toNovelParams(novel.slug))
    expect(options.body.get('image').type).toBe('image/jpeg')
    expect(useCoverStore().covers.value).toEqual([CoverDto.fromCover(storedCoverApi.cover)])
    expect(useCoverStore().officialCoverId.value).toBe(storedCoverApi.official_cover_id)
    expect(flash.getFlashes().at(-1).content).toBe(t('cover_propose_dialog.proposed'))
    expect(wrapper.find('dialog').element.open).toBe(false)
  })

  it('warns the illustrator that replacing the image loses its likes', () => {
    const { coverStore } = useCoverStore()
    const myCover = coverSeeder.getCover()
    coverStore.setNovelCovers(coverSeeder.getNovelCovers({ myCoverId: myCover.id }))

    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()

    expect(wrapper.find('.cover-propose-dialog__warning').text()).toBe(
      t('cover_propose_dialog.replace_warning', myCover.likeCount),
    )
  })

  it('replaces the image of the cover of the illustrator', async () => {
    const { covers, coverStore } = useCoverStore()
    const myCover = coverSeeder.getCover()
    const storedCoverApi = coverSeeder.getStoredCoverApi({
      cover: coverSeeder.getCoverApi({ like_count: 0 }),
    })
    coverStore.setNovelCovers(coverSeeder.getNovelCovers({ myCoverId: myCover.id }))
    vi.spyOn(CoverRepository, 'replaceImage').mockResolvedValue(
      controllerSuccess({ data: storedCoverApi }),
    )
    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getImageFile()] })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const [options] = CoverRepository.replaceImage.mock.calls[0]
    expect(options.params).toEqual(CoverDto.toCoverParams(myCover.id))
    expect(covers.value[0]).toEqual(CoverDto.fromCover(storedCoverApi.cover))
  })

  it('shows the refusal of a second proposal for the same novel', async () => {
    const refusal = coverSeeder.getRefusalApi()
    vi.spyOn(CoverRepository, 'create').mockResolvedValue({
      status: STATUS.CONFLICT,
      data: refusal,
    })
    await router.push({ name: 'novel-covers', params: { slug: novelSeeder.getNovel().slug } })
    wrapper = mount(CoverProposeDialog)
    wrapper.vm.show()
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getImageFile()] })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.cover-propose-dialog__refusal').text()).toBe(refusal.message)
  })
})
