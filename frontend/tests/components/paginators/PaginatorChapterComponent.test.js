import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginatorChapterComponent from '@/components/paginators/PaginatorChapterComponent.vue'

describe('PaginatorChapterComponent.vue', () => {
  it('disables the previous button on the first chapter', () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 1, totalChapters: 5 },
    })

    expect(wrapper.find('[aria-label="Chapitre précédent"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[aria-label="Chapitre suivant"]').attributes('disabled')).toBeUndefined()
  })

  it('disables the next button on the last chapter', () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 5, totalChapters: 5 },
    })

    expect(wrapper.find('[aria-label="Chapitre suivant"]').attributes('disabled')).toBeDefined()
  })

  it('emits the previous chapter when clicking previous', async () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 3, totalChapters: 5 },
    })

    await wrapper.find('[aria-label="Chapitre précédent"]').trigger('click')

    expect(wrapper.emitted('p-chapter')).toEqual([[{ chapter: 2 }]])
  })

  it('emits the next chapter when clicking next', async () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 3, totalChapters: 5 },
    })

    await wrapper.find('[aria-label="Chapitre suivant"]').trigger('click')

    expect(wrapper.emitted('p-chapter')).toEqual([[{ chapter: 4 }]])
  })

  it('emits the typed chapter on blur when it is valid', async () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 3, totalChapters: 5 },
    })
    const input = wrapper.find('input')

    await input.setValue(4)
    await input.trigger('blur')

    expect(wrapper.emitted('p-chapter')).toEqual([[{ chapter: 4 }]])
  })

  it('clamps an out-of-range value without emitting', async () => {
    const wrapper = mount(PaginatorChapterComponent, {
      props: { currentChapter: 3, totalChapters: 5 },
    })
    const input = wrapper.find('input')

    await input.setValue(99)
    await input.trigger('blur')

    expect(input.element.value).toBe('5')
    expect(wrapper.emitted('p-chapter')).toBeUndefined()
  })
})
