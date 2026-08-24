import { onMounted, onUnmounted, ref } from 'vue'

const DEFAULT_THRESHOLD = 4

export const useWindowScrolled = (threshold = DEFAULT_THRESHOLD) => {
  const isScrolled = ref(false)

  const update = () => {
    isScrolled.value = globalThis.scrollY > threshold
  }

  onMounted(() => {
    update()
    globalThis.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => {
    globalThis.removeEventListener('scroll', update)
  })

  return { isScrolled }
}
