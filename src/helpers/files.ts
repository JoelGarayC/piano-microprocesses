import { writeFile } from 'fs'
import { errorMessage, warningMessage } from '../utils/alerts'
import { IS_PROD } from '../utils/constants'

export enum ExtensionType {
  CSV = 'csv',
  TXT = 'txt'
}

export enum ActionType {
  REGISTER = 'register',
  UPDATE = 'update'
}

export enum LogType {
  ERROR = 'errors',
  SUCCESS = 'success'
}

type GenerateFile = {
  arcSite: string
  headers?: { [key: string]: any }
  description: string
  extension: ExtensionType
  action?: string
  actionType?: ActionType
  separator?: string
  logType?: LogType
  outputDir?: string
  exportDate?: string
  nameFile?: string
}

const ENV: string = IS_PROD ? 'prod' : 'dev'

export const generateDataFile = ({
  arcSite = '',
  headers = {},
  description = '',
  extension = ExtensionType.CSV,
  separator = ',',
  outputDir = 'outputs',
  exportDate = '',
  nameFile = 'data'
}: GenerateFile) => {
  let keys = ''
  Object.keys(headers).map((key) => {
    keys = `${keys}${key}${separator}`
  })
  keys = keys.substring(0, keys.length - 1)

  const text = `${keys}${description}`
  try {
    writeFile(
      `src/data/${outputDir}/${nameFile}-${arcSite}-${ENV} ${exportDate}.${extension}`,
      text,
      'utf8',
      (err) => {
        if (err) throw err
        console.log(warningMessage(`DATA CREADA EN LA CARPETA '${outputDir}'`))
      }
    )
  } catch (error) {
    console.log(errorMessage(error))
  }
}
