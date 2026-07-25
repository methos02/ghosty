const isBorderWidth = property =>
  typeof property === 'string' && /^border(Top|Right|Bottom|Left)Width$/.test(property)

export const computedStyleMock = () => {
  if (globalThis.getComputedStyle === undefined) {
    return
  }

  const nativeGetComputedStyle = globalThis.getComputedStyle.bind(globalThis)

  globalThis.getComputedStyle = element =>
    new Proxy(nativeGetComputedStyle(element), {
      get(target, property) {
        const value = target[property]

        if (typeof value === 'function') {
          return value.bind(target)
        }

        if (isBorderWidth(property) && !String(value).endsWith('px')) {
          return '0px'
        }

        return value
      },
    })
}
