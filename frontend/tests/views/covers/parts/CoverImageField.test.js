import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoverImageField from '@/views/covers/parts/CoverImageField.vue'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('CoverImageField.vue', () => {
  let wrapper

  beforeAll(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:cover-preview')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  afterAll(() => {
    delete globalThis.URL.createObjectURL
    delete globalThis.URL.revokeObjectURL
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
    vi.clearAllMocks()
  })

  it('invites to choose an image while none is chosen', () => {
    wrapper = mount(CoverImageField)

    expect(wrapper.find('.cover-image-field__dropzone').exists()).toBe(true)
    expect(wrapper.find('.cover-image-field__preview').exists()).toBe(false)
  })

  it('hands over the image already cropped in 16/9 and shows it', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [coverSeeder.getImageFile({ width: 1600, height: 1200 })],
    })

    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))

    const image = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(image.type).toBe('image/jpeg')
    expect(JSON.parse(await image.text())).toEqual({ width: 1600, height: 900 })
    expect(wrapper.find('.cover-image-field__preview').attributes('src')).toBe('blob:cover-preview')
  })

  it('shrinks a large image to the maximum width', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [coverSeeder.getImageFile({ width: 4000, height: 2250 })],
    })

    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.emitted('update:modelValue')).toHaveLength(2))

    const image = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(JSON.parse(await image.text())).toEqual({ width: 1920, height: 1080 })
  })

  it('takes an image dropped on the zone', async () => {
    wrapper = mount(CoverImageField)

    await wrapper.find('.cover-image-field__dropzone').trigger('drop', {
      dataTransfer: { files: [coverSeeder.getImageFile()] },
    })

    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))
  })

  it('refuses a file that is not an image', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getUnreadableFile()] })

    await input.trigger('change')
    await flushPromises()

    expect(form.getError('cover.image')).toBe('cover_image_field.error_unreadable')
    expect(wrapper.emitted('update:modelValue')).toEqual([[]])
    expect(wrapper.find('.cover-image-field__dropzone').exists()).toBe(true)
  })

  it('refuses an image too small for an illustration', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [coverSeeder.getImageFile({ width: 600, height: 400 })],
    })

    await input.trigger('change')
    await flushPromises()

    expect(form.getError('cover.image')).toBe('cover_image_field.error_too_small')
    expect(wrapper.emitted('update:modelValue')).toEqual([[]])
  })

  it('hands over the image again once recropped', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [coverSeeder.getImageFile({ width: 1600, height: 900 })],
    })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__crop').exists()).toBe(true))

    await wrapper.find('.cover-image-field__crop').trigger('click')
    await wrapper.find('.cover-cropper__zoom-input').setValue('2')
    await wrapper.find('.cover-cropper__apply').trigger('click')
    await vi.waitFor(() => expect(wrapper.emitted('update:modelValue')).toHaveLength(3))

    const image = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(JSON.parse(await image.text())).toEqual({ width: 800, height: 450 })
    expect(wrapper.find('.cover-cropper').exists()).toBe(false)
  })

  it('goes back to the empty zone once the form forgets the image', async () => {
    wrapper = mount(CoverImageField)
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [coverSeeder.getImageFile()] })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.cover-image-field__preview').exists()).toBe(true))
    await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue').at(-1)[0] })

    await wrapper.setProps({ modelValue: undefined })

    expect(wrapper.find('.cover-image-field__dropzone').exists()).toBe(true)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:cover-preview')
  })
})
