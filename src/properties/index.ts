import config from '../config'
import type { Properties } from '../types'
import { IS_PROD } from '../utils/constants'
const properties: Properties = {
  API_PIANO_V1: `https://${IS_PROD ? 'api' : 'sandbox'}.piano.io/id/api/v1`,
  API_PIANO_V3: `https://${IS_PROD ? 'api' : 'sandbox'}.piano.io/api/v3`,
  AID: {
    elcomercio: IS_PROD ? 'Enoqbpnkpu' : 'PeVZORGJsu',
    gestion: IS_PROD ? 'UmAkgzZ4pu' : 'uqsWkaVNsu',
    trome: IS_PROD ? 'TwXO2pHvpu' : '6UafT9Fjsu',
    depor: IS_PROD ? 'MkdicA21pu' : '1p8zqZlWsu',
    peru21: IS_PROD ? 'wofJpXCxpu' : 'HJmZV7i1su',
    peruquiosco: IS_PROD ? 'pWgh0wFvpu' : 'fq1sSK73su'
  },
  API_TOKEN: {
    elcomercio: config.API_TOKEN_ELCOMERCIO,
    gestion: config.API_TOKEN_GESTION,
    trome: config.API_TOKEN_TROME,
    depor: config.API_TOKEN_DEPOR,
    peru21: config.API_TOKEN_PERU21,
    peruquiosco: config.API_TOKEN_PERUQUIOSCO
  },
}

export default properties
