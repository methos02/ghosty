export const readingConfig = {
  width: {
    min: 45,
    max: 90,
    step: 5,
    default: 50,
    minPixels: 320,
  },
  fontSize: {
    min: 16,
    max: 26,
    step: 2,
    default: 18,
  },
  fontFamily: {
    default: 'system',
    available: [
      { value: 'system', label: 'Par défaut' },
      { value: 'lobster-two', label: 'Lobster Two' },
      { value: 'josefin-slab', label: 'Josefin Slab' },
      { value: 'lato', label: 'Lato' },
      { value: 'nunito', label: 'Nunito' },
      { value: 'open-dyslexic', label: 'Open Dyslexic' },
      { value: 'roboto', label: 'Roboto' },
    ],
  },
  nightMode: {
    default: false,
  },
  storageKey: 'reading-settings',
}
