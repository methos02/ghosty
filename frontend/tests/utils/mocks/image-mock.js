const readSize = async blob => JSON.parse(await blob.text())

class OffscreenCanvasMock {
  constructor(width, height) {
    this.width = width
    this.height = height
  }

  getContext() {
    return { drawImage: () => {} }
  }

  async convertToBlob({ type }) {
    return new Blob([JSON.stringify({ width: this.width, height: this.height })], { type })
  }
}

export const imageMock = () => {
  globalThis.createImageBitmap = async blob => {
    const size = await readSize(blob)

    return { width: size.width, height: size.height, close: () => {} }
  }
  globalThis.OffscreenCanvas = OffscreenCanvasMock
}
