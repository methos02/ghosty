// jsdom n'implémente pas la Popover API, utilisée par FlashComponent.
export const popoverMock = () => {
  if (typeof HTMLElement === 'undefined') {
    return
  }
  if (typeof HTMLElement.prototype.showPopover === 'function') {
    return
  }
  HTMLElement.prototype.showPopover = () => {}
  HTMLElement.prototype.hidePopover = () => {}
}
