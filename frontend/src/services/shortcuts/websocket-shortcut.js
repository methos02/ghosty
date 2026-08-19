const noop = () => {}

export const ws = {
  clear: noop,
  clearQueue: noop,
  close: noop,
  exist: () => false,
  get: noop,
  lastEvent: noop,
  open: noop,
  register: noop,
}
