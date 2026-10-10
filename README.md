# API REST de Usuarios

Proyecto NestJS y TypeScript creado en la raíz de esta carpeta. Requiere Node.js 20 o superior y npm. Los datos se almacenan en memoria y vuelven al estado inicial cada vez que se reinicia el servidor.

## Instalación y ejecución

```powershell
npm install
npm run build
npm run start
```

Servidor: http://localhost:3000. Recurso: **/Usuarios**, con U mayúscula; `/usuarios` responde 404. Detén el servidor con Ctrl+C. Para desarrollo puedes usar `npm run start:dev`; para ejecutar la compilación, `npm run start:prod`.

Para verificar automáticamente la secuencia y los errores, con el puerto 3000 libre:

```powershell
npm test
```

`npm test` compila automáticamente el proyecto antes de probarlo. Las pruebas inician y detienen su propio servidor.

## Archivos

| Archivo | Función |
| --- | --- |
| `package.json` | Dependencias y comandos npm. |
| `package-lock.json` | Versiones concretas instaladas para instalaciones reproducibles. |
| `nest-cli.json` | Configuración de compilación de NestJS. |
| `tsconfig.json` / `tsconfig.build.json` | Configuración estricta de TypeScript y compilación. |
| `src/main.ts` | Inicia el servidor en el puerto 3000 y configura validación y rutas sensibles a mayúsculas. |
| `src/app.module.ts` | Módulo principal que importa UsuariosModule. |
| `src/usuarios/usuarios.module.ts` | Registra el controlador y el servicio. |
| `src/usuarios/usuarios.controller.ts` | Define GET, PUT, PATCH y DELETE y valida el id numérico. |
| `src/usuarios/usuarios.service.ts` | Mantiene los usuarios en memoria y realiza las operaciones. |
| `src/usuarios/usuario.interface.ts` | Define los campos id, nombre y edad. |
| `src/usuarios/dto/replace-usuario.dto.ts` | Exige nombre y edad para PUT. |
| `src/usuarios/dto/update-usuario.dto.ts` | Valida los campos opcionales de PATCH. |
| `test/api.test.cjs` | Prueba HTTP de la secuencia, validación y errores. |
| `postman/Usuarios.postman_collection.json` | Colección importable, con las cinco peticiones y verificaciones. |
| `.gitignore` | Excluye dependencias, compilación y archivos locales. |

## Postman: probar en orden

Inicia un servidor nuevo con `npm run start`. En Postman selecciona **Import** y abre `postman/Usuarios.postman_collection.json`. La variable `baseUrl` ya contiene `http://localhost:3000`. Ejecuta las peticiones en orden o usa el Runner de la colección una sola vez. Reinicia el servidor para repetir la secuencia desde el estado inicial.

Para las peticiones PUT y PATCH selecciona **Body → raw → JSON** y usa `Content-Type: application/json`. Todas las peticiones de esta secuencia responden **200 OK**.

### 1. Listar usuarios

Método: `GET`. URL: `http://localhost:3000/Usuarios`. Sin cuerpo.

```json
[{"id":1,"nombre":"Jessica","edad":19},{"id":2,"nombre":"Diego","edad":20}]
```

### 2. Reemplazar los datos de Jessica

Método: `PUT`. URL: `http://localhost:3000/Usuarios/1`.

Cuerpo:
```json
{"nombre":"Jessica Ortiz","edad":20}
```
Respuesta:
```json
{"id":1,"nombre":"Jessica Ortiz","edad":20}
```

### 3. Actualizar solo la edad de Diego

Método: `PATCH`. URL: `http://localhost:3000/Usuarios/2`.

Cuerpo:
```json
{"edad":21}
```
Respuesta:
```json
{"id":2,"nombre":"Diego","edad":21}
```

### 4. Eliminar a Diego

Método: `DELETE`. URL: `http://localhost:3000/Usuarios/2`. Sin cuerpo.

Respuesta en texto:
```text
Usuario #2 eliminado
```

### 5. Comprobar el resultado final

Método: `GET`. URL: `http://localhost:3000/Usuarios`. Sin cuerpo.

```json
[{"id":1,"nombre":"Jessica Ortiz","edad":20}]
```

## Validación y diferencia entre PUT y PATCH

PUT reemplaza todos los datos editables: debes enviar **nombre y edad**; el id se conserva. PATCH modifica solamente los campos enviados; un objeto vacío es válido y no cambia nada. No se pueden modificar los ids ni agregar campos desconocidos.

Nombre debe ser una cadena con al menos un carácter distinto de espacio. Edad debe ser un número entero mayor o igual a cero; no se convierten cadenas numéricas. `null`, campos desconocidos y datos inválidos responden **400 Bad Request**. PUT con `{"edad":20}` devuelve 400; PATCH con ese mismo cuerpo actualiza solo la edad.

Ejemplos para probar errores:

| Método | URL | Cuerpo | Estado |
| --- | --- | --- | --- |
| PUT | `http://localhost:3000/Usuarios/1` | `{"edad":20}` | 400 |
| PATCH | `http://localhost:3000/Usuarios/1` | `{"edad":-1}` | 400 |
| PATCH | `http://localhost:3000/Usuarios/1` | `{"nombre":""}` | 400 |
| PATCH | `http://localhost:3000/Usuarios/1` | `{"edad":null}` | 400 |
| DELETE | `http://localhost:3000/Usuarios/999` | Sin cuerpo | 404 |

PUT, PATCH y DELETE con un id inexistente y datos válidos responden 404, por ejemplo `{"message":"Usuario #999 no encontrado","error":"Not Found","statusCode":404}`. Un id no entero devuelve 400. Si el cuerpo es inválido, la validación devuelve 400 antes de buscar al usuario.
