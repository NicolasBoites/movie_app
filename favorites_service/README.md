# Favorites Service

Microservicio de favoritos construido con NestJS para despliegue en AWS Lambda.

## Descripción

Este servicio permite a los usuarios gestionar sus películas favoritas. Los favoritos se almacenan como una lista de IDs de películas en el campo `favoriteMovieIds` dentro de cada documento de usuario en la colección `users`. Proporciona endpoints para agregar, listar, buscar y eliminar películas favoritas.

## Características

- ✅ Agregar películas a favoritos (solo ID requerido)
- ✅ Obtener lista de IDs de películas favoritas
- ✅ Verificar si una película está en favoritos
- ✅ Eliminar películas específicas de favoritos
- ✅ Limpiar todos los favoritos
- ✅ Contador de favoritos
- ✅ Actualiza directamente la colección de usuarios existente
- ✅ **Sin autenticación (fines didácticos)**
- ✅ Endpoints públicos con userId en URL
- ✅ Documentación Swagger
- ✅ Validación de datos
- ✅ Configurado para AWS Lambda

## Tecnologías

- NestJS
- MongoDB con Mongoose
- JWT Authentication
- Swagger/OpenAPI
- AWS Lambda (Serverless)
- TypeScript

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
```

3. Ejecutar en desarrollo:
```bash
npm run start:dev
```

## Variables de Entorno

```env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://localhost:27017/favorites_db
JWT_ACCESS_SECRET=your_jwt_access_secret_here
```

## API Endpoints

### Favoritos

- `POST /api/v1/favorites/:userId` - Agregar película a favoritos
- `GET /api/v1/favorites/:userId` - Obtener documento de favoritos del usuario
- `GET /api/v1/favorites/:userId/list` - Obtener lista de IDs de películas favoritas
- `GET /api/v1/favorites/:userId/count` - Obtener contador de favoritos
- `GET /api/v1/favorites/:userId/check/:movieId` - Verificar si película está en favoritos
- `DELETE /api/v1/favorites/:userId/movie/:movieId` - Eliminar película de favoritos
- `DELETE /api/v1/favorites/:userId/clear` - Limpiar todos los favoritos

### Documentación

- `GET /api/docs` - Documentación Swagger

## Despliegue en AWS Lambda

1. Instalar Serverless Framework:
```bash
npm install -g serverless
```

2. Configurar credenciales AWS:
```bash
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
```

3. Desplegar:
```bash
npm run deploy
```

## Esquema de Datos

### User (Colección existente)
```typescript
{
  _id: ObjectId;          // ID del usuario (usado en endpoints)
  email: string;
  username: string;
  password: string;
  favoriteMovieIds: string[];  // Array de IDs de películas favoritas
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateFavoriteDto
```typescript
{
  movieId: string;
}
```

## Scripts

- `npm run build` - Compilar proyecto
- `npm run start` - Ejecutar en producción
- `npm run start:dev` - Ejecutar en desarrollo
- `npm run test` - Ejecutar pruebas
- `npm run lint` - Ejecutar linter
- `npm run deploy` - Desplegar en AWS Lambda

## Desarrollo

El servicio está configurado para funcionar tanto en desarrollo local como en AWS Lambda. Para desarrollo local, usa `npm run start:dev`. Para despliegue en Lambda, usa `npm run deploy`.

## Uso

No se requiere autenticación. Todos los endpoints son públicos. Ejemplo de uso:

```bash
# Agregar película a favoritos (userId es el _id del documento user)
POST http://localhost:3003/api/v1/favorites/507f1f77bcf86cd799439011
{
  "movieId": "movie456"
}

# Obtener favoritos de un usuario
GET http://localhost:3003/api/v1/favorites/507f1f77bcf86cd799439011/list

# Verificar si una película está en favoritos
GET http://localhost:3003/api/v1/favorites/507f1f77bcf86cd799439011/check/movie456
``` 