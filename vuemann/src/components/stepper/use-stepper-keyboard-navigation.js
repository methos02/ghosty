import { onUnmounted } from 'vue'

const LAST_ELEMENT_INDEX = -1

const INTERACTIVE_ELEMENTS_SELECTOR = [
  'input:not([type="hidden"]):not([tabindex="-1"])',
  'select',
  'textarea',
  '[role="switch"]',
  '[role="combobox"]',
  '[role="listbox"]',
  'button.switch',
].join(', ')

const getInteractiveElements = container => {
  if (!container) {
    return []
  }
  return [...container.querySelectorAll(INTERACTIVE_ELEMENTS_SELECTOR)]
}

const isLastInteractiveElement = (container, element) => {
  const interactiveElements = getInteractiveElements(container)
  if (interactiveElements.length === 0) {
    return false
  }
  return interactiveElements.at(LAST_ELEMENT_INDEX) === element
}

const createKeydownHandler = options => {
  return event => {
    const actionButton = options.isLastStep.value ? options.submitButton : options.nextButton

    if (event.key === 'Tab') {
      composableInternal.handleTabKey({
        event,
        container: options.container,
        actionButton,
      })
      return
    }

    if (event.key === 'Enter') {
      composableInternal.handleEnterKey({
        event,
        container: options.container,
        isLastStep: options.isLastStep,
        goToNextStep: options.goToNextStep,
        handleSubmit: options.handleSubmit,
      })
    }
  }
}

const focusFirstElement = container => {
  const containerElement = container.value
  if (!containerElement) {
    return
  }

  const interactiveElements = getInteractiveElements(containerElement)
  if (interactiveElements.length === 0) {
    return
  }

  interactiveElements[0].focus()
}

export const useStepperKeyboardNavigation = options => {
  const keydownHandler = composableInternal.createKeydownHandler(options)

  const startListening = () => {
    const containerElement = options.container.value
    if (!containerElement) {
      return
    }
    containerElement.addEventListener('keydown', keydownHandler)
  }

  const stopListening = () => {
    const containerElement = options.container.value
    if (!containerElement) {
      return
    }
    containerElement.removeEventListener('keydown', keydownHandler)
  }

  onUnmounted(() => {
    stopListening()
  })

  return {
    startListening,
    stopListening,
    focusFirstElement: () => composableInternal.focusFirstElement(options.container),
  }
}

const handleTabKey = ({ event, container, actionButton }) => {
  if (event.shiftKey) {
    return
  }

  const containerElement = container.value
  if (!composableInternal.isLastInteractiveElement(containerElement, event.target)) {
    return
  }

  const button = actionButton.value
  if (!button) {
    return
  }

  event.preventDefault()
  button.focus()
}

const handleEnterKey = ({ event, isLastStep, goToNextStep, handleSubmit, container }) => {
  if (event.target.tagName === 'TEXTAREA') {
    return
  }

  const containerElement = container.value
  if (!composableInternal.isLastInteractiveElement(containerElement, event.target)) {
    return
  }

  event.preventDefault()

  if (isLastStep.value) {
    handleSubmit()
    return
  }
  goToNextStep()
}

export const composableInternal = {
  getInteractiveElements,
  isLastInteractiveElement,
  handleTabKey,
  handleEnterKey,
  createKeydownHandler,
  focusFirstElement,
}
