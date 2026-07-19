import { ref, watch } from 'vue'

export const useKeyboardNavigation = ({ items, dropdown, toggleDropdown, isOpen }) => {
  const DEFAULT_INDEX = -1
  const selectedIndex = ref(DEFAULT_INDEX)

  watch(items, () => {
    selectedIndex.value = DEFAULT_INDEX
  })

  const getDropdownItems = () => {
    const dropdownElement = dropdown.value?.$el
    if (!dropdownElement) {
      return []
    }
    return dropdownElement.querySelectorAll(':scope [data-items] li')
  }

  const applySelectedClass = liElements => {
    for (const li of liElements) {
      li.classList.remove('input-search--selected')
    }
    if (selectedIndex.value < 0) {
      return
    }
    if (selectedIndex.value >= liElements.length) {
      return
    }
    liElements[selectedIndex.value].classList.add('input-search--selected')
  }

  const handleEscape = () => {
    selectedIndex.value = DEFAULT_INDEX
    toggleDropdown(false)
  }

  const handleEnter = event => {
    if (!isOpen.value) {
      return
    }

    const liElements = getDropdownItems()
    if (liElements.length === 0) {
      return
    }

    event.preventDefault()

    const targetIndex = selectedIndex.value === DEFAULT_INDEX ? 0 : selectedIndex.value
    if (targetIndex >= liElements.length) {
      return
    }

    liElements[targetIndex].click()
    selectedIndex.value = DEFAULT_INDEX
  }

  const handleArrowDown = event => {
    event.preventDefault()
    const liElements = getDropdownItems()
    if (liElements.length === 0) {
      return
    }

    const newIndex = selectedIndex.value + 1
    if (newIndex >= liElements.length) {
      return
    }

    selectedIndex.value = newIndex
    applySelectedClass(liElements)
  }

  const handleArrowUp = event => {
    event.preventDefault()
    const liElements = getDropdownItems()
    if (liElements.length === 0) {
      return
    }

    const newIndex = selectedIndex.value - 1
    if (newIndex < 0) {
      return
    }

    selectedIndex.value = newIndex
    applySelectedClass(liElements)
  }

  const handleKeydown = event => {
    if (event.key === 'Escape') {
      handleEscape()
      return
    }
    if (event.key === 'Enter') {
      handleEnter(event)
      return
    }
    if (event.key === 'ArrowDown') {
      handleArrowDown(event)
      return
    }
    if (event.key === 'ArrowUp') {
      handleArrowUp(event)
    }
  }

  const resetSelection = () => {
    selectedIndex.value = DEFAULT_INDEX
  }

  return {
    selectedIndex,
    handleKeydown,
    resetSelection,
  }
}
