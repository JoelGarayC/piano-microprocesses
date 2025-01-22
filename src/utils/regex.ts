// SYSTEM DATA
export const regexFirstName = new RegExp(
  /^[A-Za-zñÑÁÉÍÓÚÀÂÊÔÃÕÜÇáéíóúêàâêôãõüç’'\-\s]*$/
);
export const regexLastName = new RegExp(
  /^[A-Za-zñÑÁÉÍÓÚÀÂÊÔÃÕÜÇáéíóúêàâêôãõüç’'\-\s]*$/
);

// PERSONAL DATA
export const regexSecondLastName = new RegExp(
  /^[A-Za-zñÑÁÉÍÓÚÀÂÊÔÃÕÜÇáéíóúêàâêôãõüç’'\-\s]*$/
);
export const regexPhoneNumber = new RegExp(/^\d{6,12}$/);
export const regexDocumentNumber = new RegExp(/^(?:\d{8}|[a-zA-Z0-9]{9,15})$/);
export const regexDocumentType = ["DNI", "CDI", "CEX"];
export const regexCivilStatus = [
  "Soltero(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viudo(a)",
];
export const regexGender = ["Hombre", "Mujer", "Prefiero no decirlo", "Otro"];
export const regexBirthDay = new RegExp(
  /^[1-2]{1}[0-9]{3}-(0([1-9]{1})|1([0-2]{1}))-(0([1-9]{1})|(1|2)([0-9]{1})|3(0|1))$/
);

// UBICATION DATA
export const regexCountryCode = new RegExp(/^\d{1,6}$/);
export const regexDepartamentCode = new RegExp(/^\d{1,6}$/);
export const regexProvinceCode = new RegExp(/^\d{1,6}$/);
export const regexDistrictCode = new RegExp(/^\d{1,6}$/);

// ORIGIN DATA
export const regexOriginDevice = ["mobile", "desktop", "tablet"];
export const regexOriginAction = [
  "authfia",
  "landing",
  "mailing",
  "premium",
  "relogin",
  "resetpass",
  "students",
  "verify",
];
export const regexOriginMethod = ["Password", "Facebook", "Google"];

// LEGACY INFO
export const regexSource = ["MPP", "ECOID", "ARC", "PIANO","PROMOCIONES"];
export const regexCreateDate = new RegExp(
  /^[1-2]{1}[0-9]{3}-(0([1-9]{1})|1([0-2]{1}))-(0([1-9]{1})|(1|2)([0-9]{1})|3(0|1))$/
);
export const regexUpdateDate = new RegExp(
  /^[1-2]{1}[0-9]{3}-(0([1-9]{1})|1([0-2]{1}))-(0([1-9]{1})|(1|2)([0-9]{1})|3(0|1))$/
);
export const regexEmailVerified = new RegExp(/(true|false)/);
export const regexOldSubscriber = new RegExp(/(true|false)/);

// CALL CENTER
export const regexAssignedTeleoperator = [
  "Jessica Portilla Pardave",
  "Abraham Brizuela Arenas",
  "Sandy Bardales Portocarrero",
  "Oswaldo Monge Villa",
  "Luis Vega Medoza",
  "Kimberly Chipana Ruiz",
  "Crucila Cayo Lavado",
  "Maria Del Pilar Sifuentes Rueda",
  "Alicia Panizo Vargas",
  "Susan Gonzales Soria",
  "Norma Montenegro Arroyo",
  "Edward De la Cruz Rosas",
  "Pedro Leveau Villanueva",
];

export const regexGrantAccessReason = {
  elcomercio: [
    "Cortesía Suscripción impresa El Comercio",
    "Cortesía Retención",
    "Cortesía Call Center",
    "Cortesía Digital + Impreso 3 días",
    "Cortesía Digital + Impreso 7 días",
  ],
  gestion: [
    "Cortesía Suscripción impresa Gestión",
    "Cortesía Retención",
    "Cortesía Call Center",
    "Cortesía Digital + Impreso",
  ],
};

// consent fields
export const regexDataTreatment = new RegExp(
  /(true|false)/
);

export const regexTermsAndPrivacyPolicy = new RegExp(
  /(true|false)/
);