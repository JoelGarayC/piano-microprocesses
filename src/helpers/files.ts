import ExcelJS from 'exceljs'
import { writeFileSync } from 'fs'

import { errorMessage, successMessage } from '../utils/alerts'
import { IS_PROD } from '../utils/constants'

export type ExtensionType = 'csv' | 'txt'

export enum LogType {
  ERROR = 'errors',
  SUCCESS = 'success'
}

type GeneratePlainFile = {
  text: string
  extension: ExtensionType
  separator?: string
  outputDir?: string
  nameFile: string
  hasDate?: boolean
}

const ENV: string = IS_PROD ? 'prod' : 'dev'

const newExportDate = () => {
  const currentDate = new Date()
  return `${currentDate.toDateString()} ${currentDate
    .toTimeString()
    .replaceAll(':', ' ')}`
}

export const generatePlainFile = ({
  text,
  extension,
  outputDir = 'outputs',
  nameFile,
  hasDate = true
}: GeneratePlainFile) => {
  const fullFileName = `${nameFile}-${ENV}${
    hasDate ? ` ${newExportDate()}` : ''
  }.${extension}`

  try {
    writeFileSync(`src/data/${outputDir}/${fullFileName}`, text, 'utf8')
    console.log(
      successMessage(
        `${extension.toUpperCase()} ${fullFileName} generado correctamente en la carpeta '${outputDir}'`
      )
    )
  } catch (error) {
    console.log(errorMessage(error))
  }
}

type GenerateExcelFile = {
  headers: string[]
  rows: any[]
  outputDir?: string
  workbookName: string
  sheetName: string
  hasDate?: boolean
}

export const generateExcelFile = async ({
  headers,
  rows,
  outputDir = 'outputs',
  workbookName,
  sheetName,
  hasDate = true
}: GenerateExcelFile) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  if (headers.length) {
    worksheet.addRow(headers)
  }

  rows.forEach((row) => worksheet.addRow(row))

  const fullFileName = `${workbookName}-${ENV}${
    hasDate ? ` ${newExportDate()}` : ''
  }.xlsx`

  try {
    await workbook.xlsx.writeFile(`src/data/${outputDir}/${fullFileName}`)

    console.log(
      successMessage(
        `Excel ${fullFileName} generado correctamente en la carpeta '${outputDir}'`
      )
    )
  } catch (error) {
    console.log(errorMessage(error))
  }
}
