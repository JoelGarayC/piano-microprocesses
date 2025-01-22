import axios, { isAxiosError } from 'axios'

import config from '../config'
import { generatePlainFile } from '../helpers/files'
import props from '../properties'
import { errorMessage } from '../utils/alerts'

const ARC_SITE = config.ARC_SITE

interface TeamMember {
  first_name: string | null
  last_name: string | null
  personal_name: string | null
  email: string | null
  uid: string | null
  create_date: number | null
  last_login: number | null
  permissions: string[]
}

interface TeamListResponse {
  code: number
  ts: number
  limit: number
  offset: number
  total: number
  count: number
  team_members: TeamMember[]
}

/*
 * searchPermissions (Array[string]):
 * Arreglo que indica los permisos que tengan los usuarios a filtrar (todos o alguno).
 * Ejemplo: ['publisher_admin', 'global_admin', 'manage_api', 'manage_business']
 */
const searchPermissions = ['manage_team']

async function main() {
  try {
    const { data: teamData } = await axios.get<TeamListResponse>(
      `${props.API_PIANO_V3}/publisher/team/list`,
      {
        params: {
          aid: props.AID[ARC_SITE],
          api_token: props.API_TOKEN[ARC_SITE]
        }
      }
    )

    let fileDescription = `Piano Users ${ARC_SITE} ${new Date().toDateString()}`

    teamData.team_members.forEach((member) => {
      const activePermissions: string[] = []

      member.permissions.forEach((per) => {
        if (searchPermissions.includes(per)) {
          activePermissions.push(per)
        }
      })

      if (activePermissions.length) {
        const text = `${member.email} ${member.first_name} ${
          member.last_name
        } tiene ${activePermissions.join(', ')}`

        fileDescription = `${fileDescription}\n${text}`
        console.log(text)
      }
    })

    generatePlainFile({
      outputDir: `outputs/${ARC_SITE}`,
      hasDate: false,
      text: fileDescription,
      extension: 'txt',
      nameFile: 'team-members-by-permissions'
    })
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(
        errorMessage(`Error al realizar la consulta: ${error.message}`)
      )
    } else {
      console.log('Error inesperado:', error)
    }
  }
}

main()
