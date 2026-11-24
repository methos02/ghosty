import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageCropper from '@/views/parts/ImageCropper.vue'
import { ConfigLoader } from '@/config/config-loader.js'

describe('ImageCropper.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('places the image so that the crop fills the frame', () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })

    expect(wrapper.find('.image-cropper__image').attributes('style')).toBe(
      'width: 200%; left: -50%; top: -50%;',
    )
  })

  it('applies the crop zoomed with the slider', async () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
      },
    })

    await wrapper.find('.image-cropper__zoom-input').setValue('2')
    await wrapper.find('.image-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 400, y: 225, width: 800, height: 450 }]])
  })

  it('applies the crop moved by dragging the image', async () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })
    const frame = wrapper.find('.image-cropper__frame')
    Object.defineProperty(frame.element, 'clientWidth', { value: 400 })

    frame.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 200, clientY: 100 }))
    frame.element.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 150 }))
    frame.element.dispatchEvent(new MouseEvent('pointerup'))
    await wrapper.find('.image-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 200, y: 125, width: 800, height: 450 }]])
  })

  it('stops moving the crop once the pointer is released', async () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })
    const frame = wrapper.find('.image-cropper__frame')
    Object.defineProperty(frame.element, 'clientWidth', { value: 400 })

    frame.element.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 150 }))
    await wrapper.find('.image-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 400, y: 225, width: 800, height: 450 }]])
  })

  it('gives up the crop on cancel', async () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
      },
    })

    await wrapper.find('.image-cropper__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('apply')).toBeUndefined()
  })

  it('reports every change of the crop', async () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
      },
    })

    await wrapper.find('.image-cropper__zoom-input').setValue('2')

    expect(wrapper.emitted('change')).toEqual([[{ x: 400, y: 225, width: 800, height: 450 }]])
  })

  it('leaves out the hint and the apply button when the caller saves the crop itself', () => {
    wrapper = mount(ImageCropper, {
      props: {
        imageUrl: 'blob:source',
        source: {
          size: { width: 1600, height: 900 },
          format: ConfigLoader.get('cover'),
        },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
        withHint: false,
        withApply: false,
      },
    })

    expect(
      ['.image-cropper__hint', '.image-cropper__apply', '.image-cropper__cancel'].map(selector =>
        wrapper.find(selector).exists(),
      ),
    ).toEqual([false, false, true])
  })
})
