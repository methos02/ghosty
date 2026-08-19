export const dialogMock = () => {
  if (typeof HTMLDialogElement === 'undefined') {
    return
  }
  if (typeof HTMLDialogElement.prototype.showModal === 'function') {
    return
  }
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.show = function show() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
