import fs from 'node:fs';
import path from 'node:path';

export const InitApi = folderName => {
  const targetDir = path.join(process.cwd(), 'src', 'apis', folderName)

  if (fs.existsSync(targetDir)) {
    throw new Error(`⚠️ Le dossier "${folderName}" existe déjà dans "src/apis/".`)
  }

  const fileTypes = { controller: 'controllers', repository: 'repositories', dto: 'dtos', store: 'stores' }
  for( const fileType of Object.keys(fileTypes)) {
    const directoryPath = path.join(targetDir, fileTypes[fileType])
    const fileContent = getFileContent(fileType, folderName)

    fs.mkdirSync(directoryPath, { recursive: true })
    fs.writeFileSync(path.join(directoryPath, `${folderName}-${fileType}.js`), fileContent)
  }
}


const getFileContent = (fileType, folderName) =>  {
  const ucfirstFolderName = folderName.charAt(0).toUpperCase() + folderName.slice(1)

  const templatePath = path.join(process.cwd(), 'bin', 'initApi', 'templates', `${fileType}.template`)
  let templateContent = fs.readFileSync(templatePath, 'utf8')

  templateContent = templateContent
  .replaceAll('__FOLDER_NAME__', folderName)
  .replaceAll('__UC_FOLDER_NAME__', ucfirstFolderName)

  return templateContent
}