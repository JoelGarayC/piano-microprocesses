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
const routePath = `src/data/inputs/elcomercio/data-users-to-patch-customfields.csv`

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
        const { uid = '', favorite_team } = dataArray[index]

        const newHeaders: any = {
          uid: uid || '',
          updated: 'false',
          has_error: ''
        }

        const endpoint = 'https://api.piano.io/api/v3/publisher/user/update'
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
        let updated = 'false'
        const brand = 'elcomercio'
        try {
          let pianoParams = `?aid=${pianoKeys[brand]?.aid}&api_token=${pianoKeys[brand]?.api_token}&uid=${uid}`
          const response = await axios.post(
            endpoint + pianoParams,
            {
              favorite_team: favorite_team
                ? JSON.stringify([favorite_team])
                : null
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          const { code, validation_errors } = response.data || {}

          if (code === 0) {
            updated = 'true'
          } else {
            newHeaders.has_error =
              typeof validation_errors === 'object'
                ? JSON.stringify(validation_errors)
                : validation_errors || ''
          }
        } catch (error) {
          if (isAxiosError(error)) {
            console.log('llego aqui catc')
            newHeaders.has_error =
              typeof error.response?.data?.validation_errors === 'object'
                ? JSON.stringify(error.response?.data.validation_errors)
                : error.response?.data || ''
          } else {
            newHeaders.has_error = 'Ocurrió un error desconocido'
          }
        }

        newHeaders.updated = updated

        const rowData = `\n${uid};${updated};${newHeaders.has_error}`
        console.log(rowData)
        newFileData = `${newFileData}${rowData}`
      }
      // genera nueva data actualizada
      if (newFileData) {
        const headers = ['uid', 'updated', 'has_error']
        const text = `${headers.join(configParser.separator)}${newFileData}`
        generatePlainFile({
          outputDir: `outputs/${ARC_SITE}`,
          text,
          extension: 'csv',
          nameFile: 'format-users-updated'
        })
      }
    })
}

main()
