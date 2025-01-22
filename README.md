# MICROPROCESOS POR PIANO APIS

El proyecto de microprocesos de piano por apis se encarga de realizar procesos pequeños para cierto fin.

## IMPORTANTE

En el ambiente local crear el archivo .env con las variables creadas ejemplo en el archivo .env.example

## Tecnologías

- Node (20.0.0)

Nota en Ubuntu 18 o superior instalar ts-node de forma global:

```bash
npm install -g ts-node
```

## Horarios

Se recomienda realizar las búsquedas masivas a primeras horas de la mañana (4am - 7am aprox) debido a la demanda y alto tráfico de red dúrante el día.

## Dependencias npm de desarrollo

- "ts-node": "^10.9.2"
- "typescript": "^5.7.3"

## Dependencias npm de producción

- "axios": "^1.7.9"
- "csv-parser": "^3.1.0"
- "dotenv": "^16.4.7"
- "exceljs": "^4.4.0"

## Estructura del proyecto

| Carpeta       | Descripción                                                      |
| ------------- | ---------------------------------------------------------------- |
| node_modules  | Librerias de JS.                                                 |
| src           | Contiene la estructura de carpetas del proyecto.                 |
| config        | Contiene la configuración obtenida por las variables de entorno. |
| actions       | Contiene los actions de la app.                                  |
| helpers       | Contiene los helpers de la app.                                  |
| data          | Contiene los archivos de entrada y salida de la app.             |
| properties    | Contiene las propiedades de la app.                              |
| types         | Contiene los types de la app.                                    |
| utils         | Contiene los utils de la app.                                    |
| .env          | Variables de entorno.                                            |
| .env.example  | Variables de entorno de ejemplo.                                 |
| .gitignore    | Archivo de git para ignorar archivos y/o carpetas.               |
| index.ts      | Archivo inicializador de la app.                                 |
| package.json  | Archivo de configuración del proyecto.                           |
| README.md     | Archivo de documentación de la app.                              |
| tsconfig.json | Archivo de configuración de typescript.                          |

## Inicialización

Ejecute los siguientes pasos desde la raíz (/) del proyecto:

1. Instalar dependencias

```bash
npm install
```

2. Ejecutar acción/proceso (ir a los casos de uso)

## Casos de uso

### 1. Auditoría de usuarios por cambio de correo

`npm run audit-users-by-email-change`

### 2. Obtener usuarios con acceso a PIANO por cierto permiso

`npm run team-members-by-permissions`

### 3. Obtener los usuarios por cada contrato de las licencias de sitio

`npm run users-of-each-contract-of-each-site-licensee`
