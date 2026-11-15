import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileChapterItem from '@/views/users/parts/ProfileChapterItem.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('ProfileChapterItem.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('links the chapter to its reading in its novel', () => {
    const chapter = chapterSeeder.getProfileChapter()

    wrapper = mount(ProfileChapterItem, { props: { chapter } })

    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: chapter.novel.slug, id: chapter.id },
    })
    expect(wrapper.find('.profile-chapter-item__counts').text()).toContain(
      t('profile_chapter_item.reads', chapter.readCount),
    )
  })

  it('marks a chapter of the main branch', () => {
    wrapper = mount(ProfileChapterItem, { props: { chapter: chapterSeeder.getProfileChapter() } })

    expect(wrapper.find('.profile-chapter-item__main-branch').text()).toBe(t('common.main_branch'))
    expect(wrapper.find('.profile-chapter-item__archived').exists()).toBe(false)
  })

  it('marks an archived chapter outside the main branch', () => {
    const chapter = chapterSeeder.getProfileChapter({
      isArchived: true,
      isInMainBranch: false,
    })

    wrapper = mount(ProfileChapterItem, { props: { chapter } })

    expect(wrapper.find('.profile-chapter-item__archived').text()).toBe(
      t('profile_chapter_item.archived'),
    )
    expect(wrapper.find('.profile-chapter-item__main-branch').exists()).toBe(false)
  })
})
