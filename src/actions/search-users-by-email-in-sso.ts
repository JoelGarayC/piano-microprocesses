import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import axios, { isAxiosError } from 'axios'
import { generatePlainFile } from '../helpers/files'

const configParser = {
  separator: ';'
}

const SITE: string = 'elcomercio'

const routePath = `src/data/inputs/elcomercio/carga_correcta_total_search_by_email-sso.csv`

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
        const { email = '' } = dataArray[index]
        // const { uid = '' } = dataArray[index]

        const newHeaders: any = {
          uid: '',
          // uid: uid || '',
          email: email || '',
          // email: '',
          user_found: 'No encontrado',
          has_error: ''
        }

        const endpoint = 'https://api.piano.io/id/api/v1/publisher/users/get'
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

        try {
          let pianoParams = `?aid=${pianoKeys[SITE]?.aid}&api_token=${pianoKeys[SITE]?.api_token}&email=${email}`
          // let pianoParams = `?aid=${pianoKeys[SITE]?.aid}&api_token=${pianoKeys[SITE]?.api_token}&uid=${uid}`

          const response = await axios.post(endpoint + pianoParams, null, {
            headers: {
              'Content-Type': 'application/json'
            }
          })

          const {
            uid: response_uid,
            email: response_email,
            error_code_list = []
          } = response.data || {}
          if (response_uid && email) {
            newHeaders.uid = response_uid
            newHeaders.user_found = 'Encontrado'
          }
          // if (response_uid && response_email) {
          // newHeaders.email = response_email
          // newHeaders.user_found = 'Encontrado'
          // }
          else {
            newHeaders.has_error =
              typeof error_code_list === 'object'
                ? JSON.stringify(error_code_list)
                : error_code_list || ''
          }
        } catch (error) {
          if (isAxiosError(error)) {
            const { error_code_list } = error.response?.data
            if (error_code_list) {
              newHeaders.has_error =
                typeof error_code_list === 'object'
                  ? JSON.stringify(error_code_list)
                  : error_code_list || ''
            } else {
              newHeaders.has_error = error.message
            }
          } else {
            newHeaders.has_error = 'Ocurrió un error desconocido'
          }
        }

        const rowData = `\n${newHeaders.uid};${email};${newHeaders.user_found};${newHeaders.has_error}`
        // const rowData = `\n${uid};${newHeaders.email};${newHeaders.user_found};${newHeaders.has_error}`
        console.log(rowData)
        newFileData = `${newFileData}${rowData}`
      }
      // genera nueva data actualizada
      if (newFileData) {
        const headers = ['uid', 'email', 'user_found', 'has_error']
        const text = `${headers.join(configParser.separator)}${newFileData}`
        generatePlainFile({
          outputDir: `outputs/${SITE}`,
          text,
          extension: 'csv',
          nameFile: 'search-users-sso-by-email'
        })
      }
    })
}

main()
