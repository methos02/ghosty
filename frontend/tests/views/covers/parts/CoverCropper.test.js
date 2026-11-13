import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CoverCropper from '@/views/covers/parts/CoverCropper.vue'

describe('CoverCropper.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('places the image so that the crop fills the frame', () => {
    wrapper = mount(CoverCropper, {
      props: {
        imageUrl: 'blob:source',
        size: { width: 1600, height: 900 },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })

    expect(wrapper.find('.cover-cropper__image').attributes('style')).toBe(
      'width: 200%; left: -50%; top: -50%;',
    )
  })

  it('applies the crop zoomed with the slider', async () => {
    wrapper = mount(CoverCropper, {
      props: {
        imageUrl: 'blob:source',
        size: { width: 1600, height: 900 },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
      },
    })

    await wrapper.find('.cover-cropper__zoom-input').setValue('2')
    await wrapper.find('.cover-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 400, y: 225, width: 800, height: 450 }]])
  })

  it('applies the crop moved by dragging the image', async () => {
    wrapper = mount(CoverCropper, {
      props: {
        imageUrl: 'blob:source',
        size: { width: 1600, height: 900 },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })
    const frame = wrapper.find('.cover-cropper__frame')
    Object.defineProperty(frame.element, 'clientWidth', { value: 400 })

    frame.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 200, clientY: 100 }))
    frame.element.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 150 }))
    frame.element.dispatchEvent(new MouseEvent('pointerup'))
    await wrapper.find('.cover-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 200, y: 125, width: 800, height: 450 }]])
  })

  it('stops moving the crop once the pointer is released', async () => {
    wrapper = mount(CoverCropper, {
      props: {
        imageUrl: 'blob:source',
        size: { width: 1600, height: 900 },
        initialCrop: { x: 400, y: 225, width: 800, height: 450 },
      },
    })
    const frame = wrapper.find('.cover-cropper__frame')
    Object.defineProperty(frame.element, 'clientWidth', { value: 400 })

    frame.element.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 150 }))
    await wrapper.find('.cover-cropper__apply').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[{ x: 400, y: 225, width: 800, height: 450 }]])
  })

  it('gives up the crop on cancel', async () => {
    wrapper = mount(CoverCropper, {
      props: {
        imageUrl: 'blob:source',
        size: { width: 1600, height: 900 },
        initialCrop: { x: 0, y: 0, width: 1600, height: 900 },
      },
    })

    await wrapper.find('.cover-cropper__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('apply')).toBeUndefined()
  })
})
