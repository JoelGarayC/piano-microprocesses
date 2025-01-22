import { regexDocumentType, regexFirstName, regexPhoneNumber } from './regex'

export const formatHeaderKeys = (data: {}) => {
  let headers: any = {}
  Object.keys(data).map((key, indexKey) => {
    Object.values(data).map((value, indexValue) => {
      if (indexKey === indexValue) {
        if (key.includes('uid')) {
          headers.uid = value
        } else {
          headers[key] = value
        }
      }
    })
  })
  return headers
}

export const formatDateYYYYMMDD = (date: string) => {
  let newDate = date
  if (date.includes('/') || date.includes('-')) {
    if (/^[0-9]{1,2}(\/|\-)[0-9]{2}(\/|\-)[0-9]{4}$/.test(date)) {
      const separators = date.includes('/') ? date.split(/\//) : date.split('-')
      if ((separators[0] || '').length < 2) {
        separators[0] = `0${separators[0]}`
      }
      newDate = `${separators[2]}-${separators[1]}-${separators[0]}`
    }
  }
  return newDate
}

export const formatDocumentType = (document: string) => {
  if (document.includes('["') && document.includes('"]')) {
    return document
  } else {
    switch (document.toLowerCase()) {
      case 'dni':
        return `["DNI"]`
      case 'carnet de extranjeria':
      case 'cex':
        return `["CEX"]`
      case 'cdi':
        return `["CDI"]`
      default:
        return document
    }
  }
}

const convertDocumentNumber = (length: number, document: string) => {
  if (document.length < length) {
    let residue = length - document.length
    for (let i = 0; i < residue; i++) {
      document = `0${document}`
    }
    return document
  } else {
    return document
  }
}

export const formatDocumentNumberForDocumentType = (
  documentNumber: string,
  documentType: string
) => {
  const formatType = documentType.replace('["', '').replace('"]', '')
  if (regexDocumentType?.includes(formatType.toUpperCase())) {
    switch (formatType.toUpperCase()) {
      case 'DNI':
        return convertDocumentNumber(8, documentNumber)
      case 'CEX':
        return convertDocumentNumber(12, documentNumber)
      case 'CDI':
        return convertDocumentNumber(12, documentNumber)
      default:
        return documentNumber
    }
  } else {
    return documentNumber
  }
}

export const formatGender = (gender: string) => {
  if (gender.includes('["') && gender.includes('"]')) {
    return gender
  } else {
    switch (gender.toLowerCase()) {
      case 'masculino':
      case 'hombre':
        return `["Hombre"]`
      case 'mujer':
      case 'femenino':
        return `["Mujer"]`
      case 'prefiero no decirlo':
        return `["Prefiero no decirlo"]`
      case 'otro':
        return `["Otro"]`
      default:
        return gender
    }
  }
}

export const formatCivilStatus = (civilStatus: string) => {
  if (civilStatus.includes('["') && civilStatus.includes('"]')) {
    return civilStatus
  } else {
    civilStatus = civilStatus.replace('(a)', '').replace(' ', '')
    switch (civilStatus.toLowerCase()) {
      case 'soltero':
        return `["Soltero(a)"]`
      case 'casado':
        return `["Casado(a)"]`
      case 'divorciado':
        return `["Divorciado(a)"]`
      case 'viudo':
        return `["Viudo(a)"]`
      default:
        return civilStatus
    }
  }
}

export const formatOriginDevice = (origin: string) => {
  if (origin.includes('["') && origin.includes('"]')) {
    return origin
  } else {
    switch (origin.toLowerCase()) {
      case 'mobile':
        return `["mobile"]`
      case 'desktop':
        return `["desktop"]`
      case 'tablet':
        return `["tablet"]`
      default:
        return origin
    }
  }
}

export const formatContactPhone = (phone: string) => {
  let newPhone = ''
  if (!regexPhoneNumber.test(phone)) {
    phone = phone.replace('+51', '').replace('PE', '')
    Array.from(phone).map((chat) => {
      if (!['+', '-', ' ', ':', ')', '('].includes(chat)) {
        newPhone = `${newPhone}${chat}`
      }
    })
  } else {
    newPhone = phone
  }
  return newPhone
}

export const formatNames = (name: string) => {
  let newName = ''
  if (!regexFirstName.test(name)) {
    Array.from(name).map((chat) => {
      if ('-' === chat) {
        newName = `${newName} `
      } else if (!['.', '-'].includes(chat)) {
        newName = `${newName}${chat}`
      }
    })
    newName = newName?.trim() || newName
  } else {
    newName = name
  }
  return newName
}

export const formatBooleanValues = (data: string) => {
  if (!/true|false/.test(data)) {
    switch (data.toLowerCase()) {
      case 'si':
      case 'sí':
        return 'true'
      case 'no':
        return 'false'
      default:
        return data
    }
  } else {
    return data
  }
}

export const formatRowData = (data = {}, separator = ',') => {
  let row = ''
  Object.values(data).map((value: any) => {
    if (value.includes('["') && value.includes('"]')) {
      let newValue = ''
      const valueArray = Array.from(value)
      valueArray.map((char) => {
        if (char === '"') {
          newValue = `${newValue}\"${char}`
        } else {
          newValue = `${newValue}${char}`
        }
      })
      row = `${row}\"${newValue}\"${separator}`
    } else {
      row = `${row}${value}${separator}`
    }
    return
  })
  row = `\n${row.substring(0, row.length - 1)}`
  return row
}
