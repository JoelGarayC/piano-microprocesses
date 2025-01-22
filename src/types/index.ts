export type Sites = {
  trome?: string
  peru21?: string
  elcomercio?: string
  depor?: string
  gestion?: string
}

export type Properties = {
  API_PIANO_V1: string
  API_PIANO_V3: string
  AID: Sites | any
  API_TOKEN: Sites | any
}

export type SystemFieldsData = {
  uid?: string
  email?: string
  first_name?: string
  last_name?: string
}

export type CustomFieldsData = {
  second_last_name?: string
  profile_image?: string
  document_type?: string
  document_number?: string
  birthday?: string
  gender?: string
  contact_phone?: string
  civil_status?: string
  country_code?: string
  departament_code?: string
  province_code?: string
  district_code?: string
  origin_domain?: string
  origin_referer?: string
  origin_user_agent?: string
  origin_device?: string
  origin_action?: string
  origin_method?: string
  old_email_hash?: string
  source?: string
  create_date?: string
  update_date?: string
  email_verified?: string
  old_subscriber?: string
  assigned_teleoperator?: string
  grant_access_reason?: string

  // customfields de peruquiosco
  migrated?: boolean
  ecoid?: string
}

export type ConsentFieldsData = {
  data_treatment?: string
  terms_and_privacy_policy?: string
}

export type SavedFieldsData = {
  registered?: string
  custom_updated?: string
  consent_updated?: string
}

export type ProfileUserData = SystemFieldsData &
  CustomFieldsData &
  ConsentFieldsData

export type ExtendsFieldsData = ProfileUserData & SavedFieldsData

export type MenuProps = {
  arcSite: string
  env: string
  routePath: string
  configParser?: { separator: string }
}
