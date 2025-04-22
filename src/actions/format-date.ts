import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import config from '../config'
import { generatePlainFile } from '../helpers/files'

const configParser = {
  separator: ';'
}

const ARC_SITE: string = config.ARC_SITE

/*
 *  FORMATO DE CSV: CABECERAS
 *  uid *;email *
 *  xxxx;xxxxx
 *  Nota: (*) requerido
 */

/*
 * onlyRowByUser (boolean):
 * - false => Devuelve la información de manera detallada a nivel de campo
 * - true => Muestra toda la información de los cambios en un solo campo
 * routePath (string): path relativo del archivo a usar como input
 */
const routePath = `src/actions/fechas.csv`

function transformDate(date: string) {
  if (!date) return ''

  const parts = date.split('/')
  const day = parts[0].length === 1 ? `0${parts[0]}` : parts[0]
  const month = parts[1].length === 1 ? `0${parts[1]}` : parts[1]
  const year = parts[2]
  return `${year}-${month}-${day}`
}

const main = async () => {
  const dataArray: any[] = []

  createReadStream(routePath)
    .pipe(csvParser(configParser))
    .on('data', async (data) => {
      const newData: { [key: string]: any } = {}
      Object.entries(data).forEach(([key, value = '']) => {
        const keyTrim = key.trim()
        newData[keyTrim] = value
      })
      dataArray.push(newData)
    })
    .on('end', async () => {
      let newFileData = ''
      for (let index = 0; index < dataArray.length; index++) {
        const newDate = transformDate(dataArray[index].date)
        // console.log(newDate)
        const newHeaders = {
          date: dataArray[index]?.date || '',
          transform: newDate
        }

        const rowData = `\n${newHeaders.date};${newHeaders.transform}`
        console.log(rowData)
        newFileData = `${newFileData}${rowData}`
      }
      // genera nueva data actualizada
      if (newFileData) {
        let headers = ['date', 'transform']
        const text = `${headers.join(configParser.separator)}${newFileData}`
        generatePlainFile({
          outputDir: `outputs/${ARC_SITE}`,
          text,
          extension: 'csv',
          nameFile: 'format-date'
        })
      }
    })
}

main()
