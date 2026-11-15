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

  it('leads to the profile of the named user', () => {
    const profile = userSeeder.getProfile()

    wrapper = mount(UserLink, { props: { username: profile.username } })

    expect(wrapper.text()).toBe(profile.username)
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'profile',
      params: { username: profile.username },
    })
  })

  it('credits the user in a byline that keeps the link to their profile', () => {
    const profile = userSeeder.getProfile()

    wrapper = mount(UserLink, {
      props: {
        username: profile.username,
        byline: true,
      },
    })

    expect(wrapper.text()).toBe(t('common.by_author', { author: profile.username }))
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'profile',
      params: { username: profile.username },
    })
  })
})
