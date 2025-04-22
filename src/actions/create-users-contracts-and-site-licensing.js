import csv from 'csv-parser'
import 'dotenv/config'
import fs from 'fs'
import fetch from 'node-fetch'

import config from '../config'
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

const globalParams = `aid=${aid}&api_token=${apiToken}`

const createLicenseeUrl = `${api}/licensee/create?${globalParams}`
const createContractUrl = `${api}/contract/create?${globalParams}`
const createContractUserUrl = `${api}/contractUser/create?${globalParams}`

async function createLicense(
  licenseeName,
  licenseeDescription,
  licenseeRepresentatives
) {
  const body = {
    name: licenseeName,
    description: licenseeDescription,
    manager_uids: 'wv4xZ3yiOG',
    representatives: licenseeRepresentatives
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams(body),
    redirect: 'follow'
  }

  const response = await fetch(createLicenseeUrl, requestOptions)
  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message)
  }

  return result.licensee
}

async function createContract(
  licenseeId,
  contractName,
  contractType,
  contractResourceId,
  contractSeatsNumber,
  contractIsHardSeatsLimitType
) {
  const body = {
    licensee_id: licenseeId,
    contract_name: contractName,
    contract_type: contractType,
    rid: contractResourceId,
    seats_number: contractSeatsNumber,
    is_hard_seats_limit_type: contractIsHardSeatsLimitType
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams(body),
    redirect: 'follow'
  }

  const response = await fetch(createContractUrl, requestOptions)
  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message)
  }

  return result.contract
}

async function createContractUser(
  contractId,
  contractUserEmail,
  contractUserFirstName,
  contractUserLastName
) {
  const body = {
    contract_id: contractId,
    email: contractUserEmail,
    first_name: contractUserFirstName,
    last_name: contractUserLastName
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams(body),
    redirect: 'follow'
  }

  const response = await fetch(createContractUserUrl, requestOptions)
  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message)
  }

  return result.ContractUser
}

async function main() {
  const results = []
  const existingLicensees = new Map()
  const existingContracts = new Map()

  fs.createReadStream('data.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', results.push)
    .on('end', async () => {
      try {
        if (results.length === 0) throw new Error('No se encontraron datos')

        // validaciones de los campos requeridos
        await validateAllRequiredFields(results)

        //  licensee y contrato por cada fila del archivo
        for (let i = 0; i < results.length; i++) {
          const {
            licenseeName,
            licenseeDescription,
            licenseeRepresentatives,
            contractName,
            contractType,
            contractResourceId,
            contractSeatsNumber,
            contractIsHardSeatsLimitType,
            contractUserEmail,
            contractUserFirstName,
            contractUserLastName
          } = results[i]

          // Creacion de licensee
          let resLicenseeId = ''
          if (existingLicensees.has(licenseeName)) {
            resLicenseeId = existingLicensees.get(licenseeName).licensee_id
          } else {
            const resLicensee = await createLicense(
              licenseeName,
              licenseeDescription,
              licenseeRepresentatives
            )
            existingLicensees.set(licenseeName, resLicensee)
            resLicenseeId = resLicensee.licensee_id
          }

          // Creacion de contrato
          let resContractId = ''
          if (existingContracts.has(contractName)) {
            resContractId = existingContracts.get(contractName).contract_id
          } else {
            const resContract = await createContract(
              resLicenseeId,
              contractName,
              contractType,
              contractResourceId,
              contractSeatsNumber,
              contractIsHardSeatsLimitType
            )
            existingContracts.set(contractName, resContract)
            resContractId = resContract.contract_id
          }

          // Creacion de usuario del contrato
          await createContractUser(
            resContractId,
            contractUserEmail,
            contractUserFirstName,
            contractUserLastName
          )

          console.log('Datos procesados correctamente' + `: fila ${i + 2}`)
        }
      } catch (error) {
        console.error(error.message)
      }
    })
}

main()

async function validateAllRequiredFields(results) {
  for (let i = 0; i < results.length - 1; i++) {
    await validateRequiredFields(results[i], i)
  }
  console.log('Todas las validaciones fueron exitosas')
}

async function validateRequiredFields(result, i) {
  const requiredFields = {
    licenseeName: 'El nombre del licenciatario es requerido',
    contractName: 'El nombre del contrato es requerido',
    contractType: 'El tipo de contrato es requerido',
    contractResourceId: 'El recurso del contrato es requerido',
    contractSeatsNumber: 'El número de asientos del contrato es requerido',
    contractIsHardSeatsLimitType:
      'El tipo de límite de asientos del contrato es requerido',
    contractUserEmail: 'El email del usuario del contrato es requerido',
    contractUserFirstName: 'El nombre del usuario del contrato es requerido',
    contractUserLastName: 'El apellido del usuario del contrato es requerido'
  }

  for (const [field, errorMessage] of Object.entries(requiredFields)) {
    if (result[field] === '') {
      throw new Error(errorMessage + `: fila ${i + 2}`)
    }
  }
}
