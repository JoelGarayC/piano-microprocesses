import axios, { isAxiosError } from 'axios'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import config from '../config'
import { ExtensionType, generateDataFile } from '../helpers/files'
import props from '../properties'
import { formatHeaderKeys, formatRowData } from '../utils/formats'

const configParser = {
  separator: ';'
}

/*
 *  FORMATO DE CSV: CABECERAS
 *  uid *;email *
 *  xxxx;xxxxx
 *  Nota: (*) requerido
 */

const ARC_SITE: string = config.ARC_SITE
const routePath = `src/data/inputs/${ARC_SITE}/usuarios_suscriptores_ge_20_01_25.csv`

/*
 * en false devuelve la información de manera detallada a nivel de campo
 * en true muestra toda la información de los cambios en un solo campo
 */
const ONLY_ROW_BY_USER = false

const main = async () => {
  const dataArray: any[] = []

  createReadStream(routePath)
    .pipe(csvParser(configParser))
    .on('data', async (data) => {
      dataArray.push(data)
    })
    .on('end', async () => {
      let newFileData = ''
      for (let index = 0; index < dataArray.length; index++) {
        let formatData = formatHeaderKeys(dataArray[index])

        try {
          const result = await axios.get(
            `${props.API_PIANO_V1}/publisher/audit/user`,
            {
              params: {
                api_token: props.API_TOKEN[ARC_SITE],
                aid: props.AID[ARC_SITE],
                uid: formatData.uid
              }
            }
          )
          const {
            data: { error_code_list, data: user_history = [] }
          } = result

          if (error_code_list) {
            console.log(`falló en ${formatData.uid} ${formatData.email}`)
          } else {
            console.log(
              'verificando usuario',
              index + 1,
              formatData.email,
              '...'
            )
            const hasChangedEmail = user_history.some(
              (history: any) => history.action_type === 'EMAIL_CHANGED'
            )

            if (hasChangedEmail) {
              const changes = user_history.filter(
                (history: any) => history.action_type === 'EMAIL_CHANGED'
              )

              const cleanChanges = changes.map((change: any) => {
                let newChange = { ...change }
                delete newChange.aid
                delete newChange.entity_id
                delete newChange.entity_type
                delete newChange.action_type
                delete newChange.context_entity_type
                delete newChange.context_entity_id

                return newChange
              })

              console.log(
                `${formatData.uid} cambió de correo ${JSON.stringify(
                  cleanChanges
                )}`
              )

              if (ONLY_ROW_BY_USER) {
                const newHeaders = {
                  uid: formatData.uid.toString(),
                  email: formatData.email.toString(),
                  quantity_changes: cleanChanges.length.toString(),
                  description: JSON.stringify(cleanChanges).replaceAll(';', ' ')
                }

                let rowData = formatRowData(newHeaders, configParser.separator)
                newFileData = `${newFileData}${rowData}`
              } else {
                cleanChanges.forEach((change: any) => {
                  const newHeaders = {
                    uid: formatData.uid.toString(),
                    email: formatData.email.toString(),
                    quantity_changes: cleanChanges.length.toString(),
                    actor_id: change.actor_id || '',
                    actor_type: change.actor_type || '',
                    country: change.country || '',
                    city: change.city || '',
                    user_agent: change.user_agent?.replaceAll(';', ',') || '',
                    ip_address: change.ip_address || '',
                    date: change.date || '',
                    previous_value: change.changes[0]?.previous_value || '',
                    new_value: change.changes[0]?.new_value || ''
                  }

                  let rowData = formatRowData(
                    newHeaders,
                    configParser.separator
                  )
                  newFileData = `${newFileData}${rowData}`
                })
              }
            }
          }
        } catch (error) {
          if (isAxiosError(error)) {
            console.log(
              `Solicitud errónea en fila ${index + 1}: ${formatData.uid} - ${
                formatData.email
              }`
            )
            console.log(error.message)
          } else {
            console.log(error)
          }
        }
      }

      const currentDate = new Date()

      console.log('new file data:', newFileData)

      // genera nueva data actualizada
      if (newFileData) {
        let headers: Object | undefined
        if (ONLY_ROW_BY_USER) {
          headers = {
            uid: '',
            email: '',
            quantity_changes: '',
            description: ''
          }
        } else {
          headers = {
            uid: '',
            email: '',
            quantity_changes: '',
            actor_id: '',
            actor_type: '',
            country: '',
            city: '',
            user_agent: '',
            ip_address: '',
            date: '',
            previous_value: '',
            new_value: ''
          }
        }

        generateDataFile({
          arcSite: ARC_SITE,
          separator: configParser.separator,
          headers: headers,
          outputDir: `outputs/${ARC_SITE}`,
          description: newFileData,
          extension: ExtensionType.CSV,
          nameFile: 'users-audit',
          exportDate: `${currentDate.toDateString()} ${currentDate
            .toTimeString()
            .replaceAll(':', ' ')}`
        })
      }
    })
}

main()
