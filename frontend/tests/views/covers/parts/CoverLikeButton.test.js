import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoverLikeButton from '@/views/covers/parts/CoverLikeButton.vue'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { likeSeeder } from '&/utils/seeders/like-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('CoverLikeButton.vue', () => {
  afterEach(() => {
    useAuth().closeLoginDialog()
    useAuthStore().clear()
    useCoverStore().coverStore.clear()
    flash.clearFlashes()
    vi.clearAllMocks()
  })

  it('asks an anonymous reader to log in instead of liking', async () => {
    vi.spyOn(CoverRepository, 'like')
    const wrapper = mount(CoverLikeButton, {
      props: { cover: coverSeeder.getCover() },
    })

    await wrapper.find('button').trigger('click')

    expect(CoverRepository.like).not.toHaveBeenCalled()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('moves the like of the reader to the cover, as the api counted it', async () => {
    const { covers, officialCoverId, coverStore } = useCoverStore()
    const [, alternative] = coverSeeder.getCovers()
    const likeApi = coverSeeder.getLikeApi()
    useAuthStore().setUser(userSeeder.getUser())
    coverStore.setNovelCovers(coverSeeder.getNovelCovers())
    vi.spyOn(CoverRepository, 'like').mockResolvedValue(controllerSuccess({ data: likeApi }))
    const wrapper = mount(CoverLikeButton, {
      props: { cover: alternative },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(covers.value).toEqual([
      CoverDto.fromCover(likeApi.moved_from),
      CoverDto.fromCover(likeApi.cover),
    ])
    expect(officialCoverId.value).toBe(likeApi.official_cover_id)
  })

  it('withdraws the like of a cover the reader already liked', async () => {
    const cover = coverSeeder.getCover({ isLiked: true })
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(CoverRepository, 'unlike').mockResolvedValue(
      controllerSuccess({ data: coverSeeder.getUnlikeApi() }),
    )
    const wrapper = mount(CoverLikeButton, {
      props: { cover },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(CoverRepository.unlike).toHaveBeenCalledWith({
      params: CoverDto.toCoverParams(cover.id),
    })
  })

  it('cannot be pressed on the own cover of the reader', () => {
    const cover = coverSeeder.getCover()
    useAuthStore().setUser(userSeeder.getUser({ id: cover.author.id }))

    const wrapper = mount(CoverLikeButton, {
      props: { cover },
    })

    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('shows the refusal the api gives to a reader who may not like', async () => {
    const refusal = likeSeeder.getRefusalApi()
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(CoverRepository, 'like').mockResolvedValue({
      status: STATUS.FORBIDDEN,
      data: refusal,
    })
    const wrapper = mount(CoverLikeButton, {
      props: { cover: coverSeeder.getCover() },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(flash.getFlashes().at(-1).content).toBe(refusal.message)
  })
})
