import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import axios, { isAxiosError } from 'axios'
import { generatePlainFile } from '../helpers/files'

const configParser = {
  separator: ';'
}

const SITE: string = 'elcomercio'

const routePath = `src/actions/data-search-users-uid.csv`

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

        const newHeaders: any = {
          uid: '',
          email: email || '',
          user_found: 'No encontrado',
          has_error: ''
        }

        const endpoint = 'https://api.piano.io/api/v3/publisher/user/search'
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
          let pianoParams = `?aid=${pianoKeys[SITE]?.aid}&api_token=${pianoKeys[SITE]?.api_token}&offset=0&limit=10&order_direction=asc&email=${email}`

          const response = await axios.get(endpoint + pianoParams)

          const { code, users = [], message } = response.data || {}
          if (code === 0) {
            if (users.length > 0) {
              newHeaders.uid = users[0].uid
              newHeaders.user_found = 'Encontrado'
            }
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

        const rowData = `\n${newHeaders.uid};${email};${newHeaders.user_found};${newHeaders.has_error}`
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
          nameFile: 'search-users-' + SITE
        })
      }
    })
}

main()
