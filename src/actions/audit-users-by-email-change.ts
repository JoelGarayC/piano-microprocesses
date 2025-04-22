import axios, { isAxiosError } from 'axios'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'

import config from '../config'
import { generatePlainFile } from '../helpers/files'
import props from '../properties'
import { errorMessage } from '../utils/alerts'
import { formatHeaderKeys, formatRowData } from '../utils/formats'

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
const onlyRowByUser = false
const routePath = `src/data/inputs/${ARC_SITE}/subscriptions-2025-03-24-gestion.csv`

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
        // if (index > 5000) break

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
              'Verificando usuario',
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

              if (onlyRowByUser) {
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
              errorMessage(
                `Solicitud errónea en fila ${index + 1}: ${formatData.uid} - ${
                  formatData.email
                }`
              )
            )
            console.log(errorMessage(error.message))
          } else {
            console.log(errorMessage(error))
          }
        }
      }

      // genera nueva data actualizada
      if (newFileData) {
        let headers: string[] = []
        if (onlyRowByUser) {
          headers = ['uid', 'email', 'quantity_changes', 'description']
        } else {
          headers = [
            'uid',
            'email',
            'quantity_changes',
            'actor_id',
            'actor_type',
            'country',
            'city',
            'user_agent',
            'ip_address',
            'date',
            'previous_value',
            'new_value'
          ]
        }

        const text = `${headers.join(configParser.separator)}${newFileData}`

        generatePlainFile({
          outputDir: `outputs/${ARC_SITE}`,
          text,
          extension: 'csv',
          nameFile: 'audit-users-by-email-change'
        })
      }
    })
}

main()
