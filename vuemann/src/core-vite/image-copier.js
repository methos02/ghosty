import fs from 'node:fs'
import path from 'node:path'

const copyImages = (sourceDirectory, destinationDirectory) => {
  const files = fs.readdirSync(sourceDirectory, { withFileTypes: true })
  for (const file of files) {
    const sourcePath = path.join(sourceDirectory, file.name)

    if (file.isDirectory()) {
      imageCopier.copyImages(sourcePath, destinationDirectory)
      return
    }

    const destinationPath = path.join(destinationDirectory, file.name)
    fs.copyFileSync(sourcePath, destinationPath)
  }
}

const copyVuemannImages = (vuemannDirectory, destinationDirectory) => {
  const vuemannImagesFolder = path.resolve(vuemannDirectory, './assets/images')
  if (!fs.existsSync(vuemannImagesFolder)) {
    return
  }

  imageCopier.copyImages(vuemannImagesFolder, destinationDirectory)
}

const copyServiceImages = (vuemannDirectory, destinationDirectory) => {
  const servicesPath = path.resolve(vuemannDirectory, './services')
  const entries = fs.readdirSync(servicesPath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const serviceImagesFolderPath = path.join(servicesPath, entry.name + '/images')
    if (!fs.existsSync(serviceImagesFolderPath)) {
      continue
    }

    imageCopier.copyImages(serviceImagesFolderPath, destinationDirectory)
  }
}

export const imageCopier = {
  copyImages,
  copyVuemannImages,
  copyServiceImages,
}
