import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import axios, { isAxiosError } from 'axios'
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
// const routePath = `src/actions/data-print-users-exists.csv`
const routePath = `src/data/inputs/elcomercio/data-users-print-v3-to-asign-custom-term.csv`

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
        const {
          uid = '',
          email = '',
          resource_id = '',
          term_id = '',
          brand = ''
        } = dataArray[index]

        const newHeaders: any = {
          uid: uid || '',
          email: email || '',
          resource_id: resource_id || '',
          term_id: term_id || '',
          asign_term: 'false',
          has_error: ''
        }

        const endpoint =
          'https://api.piano.io/api/v3/publisher/conversion/custom/create'
        const pianoKeys: any = {
          elcomercio: {
            aid: 'Enoqbpnkpu',
            api_token: 'pmKfyyPL5R59wAoNV0uR92Cp1y7bXnQMl1H4YGLN'
          },
          gestion: {
            aid: 'UmAkgzZ4pu',
            api_token: 'zu1KjQ6Y2MeGn5rHWWl9Rt6cRF2XAzzI7XqMTeEd'
          }
        }
        let asignTerm = 'false'
        try {
          let pianoParams = `?aid=${pianoKeys[brand]?.aid}&api_token=${pianoKeys[brand]?.api_token}&uid=${uid}&term_id=${term_id}&extend_existing=false`
          const response = await axios.post(endpoint + pianoParams, null, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const { code, message } = response.data || {}
          if (code === 0) {
            asignTerm = 'true'
          } else {
            newHeaders.has_error =
              typeof message === 'object'
                ? JSON.stringify(message)
                : message || ''
          }
        } catch (error) {
          if (isAxiosError(error)) {
            newHeaders.has_error = error.message
          } else {
            newHeaders.has_error = 'Ocurrió un error desconocido'
          }
        }

        newHeaders.asign_term = asignTerm

        const rowData = `\n${uid};${email};${resource_id};${term_id};${asignTerm};${newHeaders.has_error}`
        console.log(rowData)
        newFileData = `${newFileData}${rowData}`
      }
      // genera nueva data actualizada
      if (newFileData) {
        const headers = [
          'uid',
          'email',
          'resource_id',
          'term_id',
          'asign_term',
          'has_error'
        ]
        const text = `${headers.join(configParser.separator)}${newFileData}`
        generatePlainFile({
          outputDir: `outputs/${ARC_SITE}`,
          text,
          extension: 'csv',
          // nameFile: 'format-print-users-exists'
          nameFile: 'format-print-users-v3'
        })
      }
    })
}

main()
