import axios, { isAxiosError } from 'axios'

import config from '../config'
import { generateExcelFile } from '../helpers/files'
import props from '../properties'

const aid = props.AID[config.ARC_SITE]
const apiToken = props.API_TOKEN[config.ARC_SITE]
const api = props.API_PIANO_V3 + '/publisher/licensing'

/*
 * limitLicensees (number): Delimitador para indicar el límite de licencias
 * limitContracts (number): Delimitador para indicar el límite de contratos por licencia
 * limitContractUsers (number): Delimitador para indicar el límite de resultados de usuarios por contrato
 * licenseeName (string): Nombre específico de x contrato, en caso de dejarse vacío se ignora este parámetro
 */
const limitLicensees = 10
const limitContracts = 9999999
const limitContractUsers = 9999999
const licenseeName = ''

const globalParams = `aid=${aid}&api_token=${apiToken}`
const licenseeListUrl = `${api}/licensee/list?${globalParams}&offset=0&limit=${limitLicensees}${
  licenseeName ? `&q=${licenseeName}` : ''
}`

const contractListUrl = `${api}/contract/list?${globalParams}&limit=${limitContracts}&licensee_id=`

const contractUserListUrl = `${api}/contractUser/list?${globalParams}&limit=${limitContractUsers}&contract_id=`

function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

async function fetchLicenseeList() {
  const { data: licenseeListData } = await axios.get(licenseeListUrl)

  const licensees = licenseeListData?.licensees

  if (typeof licensees === 'undefined') {
    throw new Error(licenseeListData?.message)
  }
  return licensees
}

async function fetchContractList(licenseeId: string) {
  const { data: contractListData } = await axios.get(
    contractListUrl + licenseeId
  )

  const contracts = contractListData?.contracts

  if (typeof contracts === 'undefined') {
    throw new Error(contractListData?.message)
  }
  return contracts
}

async function fetchContractUserList(contractId: string) {
  const { data: contractUserListData } = await axios.get(
    contractUserListUrl + contractId
  )

  const contractUserList = contractUserListData?.ContractUserList

  if (typeof contractUserList === 'undefined') {
    throw new Error(contractUserListData?.message)
  }
  return contractUserList
}

async function main() {
  try {
    const licensees = await fetchLicenseeList()

    const headers = [
      'Licensee ID',
      'Licensee Name',
      'Contract ID',
      'Period Name',
      'Create Date',
      'End Date',
      'Status',
      'Contract User ID',
      'User Status',
      'User Email',
      'User First Name',
      'User Last Name'
    ]

    const contractUserRows: any[][] = []

    for (
      let licenseeIndex = 0;
      licenseeIndex < licensees.length;
      licenseeIndex++
    ) {
      const { licensee_id: licenseeId, name: licenseeName } =
        licensees[licenseeIndex]

      console.log(
        'Revisando licencia',
        licenseeIndex + 1,
        `${licenseeId} ${licenseeName}...`
      )
      const contracts = await fetchContractList(licenseeId)

      for (const contract of contracts) {
        const contractId = contract?.contract_id
        const contractPeriods = contract?.contract_periods
        const createDate = formatDate(contract?.create_date)

        for (const contractPeriod of contractPeriods) {
          const periodName = contractPeriod?.name
          const endDate = formatDate(contractPeriod?.end_date)
          const status = contractPeriod?.status

          const contractUserList = await fetchContractUserList(contractId)

          for (const contractUser of contractUserList) {
            const contractUserId = contractUser?.contract_user_id
            const contractUserStatus = contractUser?.status
            const contractUserEmail = contractUser?.email
            const contractUserFirstName = contractUser?.first_name
            const contractUserLastName = contractUser?.last_name

            contractUserRows.push([
              licenseeId,
              licenseeName,
              contractId,
              periodName,
              createDate,
              endDate,
              status,
              contractUserId,
              contractUserStatus,
              contractUserEmail,
              contractUserFirstName,
              contractUserLastName
            ])
          }
        }
      }
    }

    await generateExcelFile({
      sheetName: 'Datos',
      headers: headers,
      workbookName: 'users-of-each-contract-of-each-site-licensee',
      rows: contractUserRows,
      outputDir: `outputs/${config.ARC_SITE}`
    })
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Ocurrió un error:', error?.message)
    } else {
      console.log('Ocurrió un error inesperado:', error)
    }
  }
}

main()
