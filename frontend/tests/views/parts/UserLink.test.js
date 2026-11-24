import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserLink from '@/views/parts/UserLink.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('UserLink.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('leads to the profile of the user by its profile slug', () => {
    const profile = userSeeder.getProfile()

    wrapper = mount(UserLink, { props: { user: profile } })

    expect(wrapper.text()).toBe(profile.username)
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'profile',
      params: { profileSlug: profile.profileSlug },
    })
  })

  it('credits the user in a byline that keeps the link to their profile', () => {
    const profile = userSeeder.getProfile()

    wrapper = mount(UserLink, {
      props: {
        user: profile,
        byline: true,
      },
    })

    expect(wrapper.text()).toBe(t('common.by_author', { author: profile.username }))
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'profile',
      params: { profileSlug: profile.profileSlug },
    })
  })

  it('names a deleted account without a link', () => {
    wrapper = mount(UserLink, { props: { user: userSeeder.getProfile({ isDeleted: true }) } })

    expect(wrapper.text()).toBe(t('common.deleted_account'))
    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(false)
  })

  it('credits a deleted account in a byline without a link', () => {
    wrapper = mount(UserLink, {
      props: {
        user: userSeeder.getProfile({ isDeleted: true }),
        byline: true,
      },
    })

    expect(wrapper.text()).toBe(t('common.by_author', { author: t('common.deleted_account') }))
    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(false)
  })
})
