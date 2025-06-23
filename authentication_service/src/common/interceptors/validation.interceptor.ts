// auth-user-microservice/src/common/interceptors/validation.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from 'class-validator'; // Importar ValidationError

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  // Recibe el DTO class para validar y, opcionalmente, la clave si el DTO está anidado
  constructor(private readonly dtoClass: any, private readonly dtoKey?: string) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const type = context.getType();

    if (type === 'rpc') {
      const rpcContext = context.switchToRpc();
      let payload = rpcContext.getData(); // Obtiene el payload completo del MessagePattern

      let targetDto: any;

      // Determinar qué parte del payload es el DTO a validar
      if (this.dtoKey) { // Si se especificó una clave para el DTO anidado
        if (typeof payload === 'object' && payload !== null && this.dtoKey in payload) {
          targetDto = payload[this.dtoKey];
        } else {
          // Si se especificó una clave pero no se encuentra, podría ser un error o el payload directo
          // Para evitar un crash, asumimos que el payload completo es el DTO si la clave no está
          targetDto = payload;
        }
      } else { // Si no se especificó una clave, el DTO es el payload completo
        targetDto = payload;
      }

      // Convertir el objeto plano a una instancia del DTO
      const validatedDto = plainToClass(this.dtoClass, targetDto);

      // Realizar la validación
      const errors: ValidationError[] = await validate(validatedDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true, // Opcional: prohíbe si hay propiedades que no están en el DTO
      });

      if (errors.length > 0) {
        // Extraer mensajes de error de forma segura
        const errorMessages = errors.flatMap(error =>
          error.constraints ? Object.values(error.constraints) : []
        );
        throw new BadRequestException(errorMessages);
      }

      // IMPORTANTE:
      // No necesitamos rpcContext.setData().
      // plainToClass ya ha creado la instancia `validatedDto`.
      // En un contexto RPC, el @Payload() en el controlador ya recibirá esta instancia
      // si el ValidationPipe estaba allí, o si se pasa `validatedDto` en lugar de `payload`
      // al método de servicio.
      // Como estamos quitando (ValidationPipe) del @Payload(),
      // el `payload` original que el controlador recibe será el mismo que obtuvimos con `rpcContext.getData()`.
      // La clave es que el controlador debe usar `validatedDto` después de este interceptor.

      // Si el DTO estaba anidado, necesitamos actualizar el objeto payload original para el controlador
      if (this.dtoKey && typeof payload === 'object' && payload !== null && this.dtoKey in payload) {
          payload[this.dtoKey] = validatedDto;
      } else {
          // Si el DTO era el payload completo, simplemente sobrescribimos la referencia
          // El controlador deberá estar esperando el DTO validado directamente en su `@Payload()`
          // Este es un caso donde la flexibilidad del interceptor puede ser complicada.
          // La forma más robusta es que el controlador siempre espere el payload original
          // y el interceptor solo lance errores o asegure que los datos están listos.

          // Para que el controlador siempre reciba el objeto validado,
          // la forma más limpia sería que el controlador reciba el payload,
          // y el interceptor lo valide *y luego modifique el objeto payload recibido*
          // (si es mutable, que en JS lo son).
          // Sin embargo, `rpcContext.getData()` devuelve una COPIA o un objeto que no siempre es mutable en el contexto del `@Payload()`.
          // La mejor práctica es que el interceptor lance la excepción y si pasa, el flujo continúa.
          // El controlador debería entonces volver a "re-transformar" el payload si lo necesita,
          // o el interceptor podría devolver el objeto transformado al controlador a través de un mecanismo más avanzado,
          // pero eso complica las cosas.

          // Por ahora, el interceptor se encarga de VALIDAR y LANZAR ERRORES.
          // Si no hay errores, el `payload` original (que es lo que recibe el controlador en `@Payload()`)
          // simplemente continuará. El `plainToClass` ya habrá "limpiado" los datos de extra.
          // Si necesitas que el controlador reciba *siempre* la instancia de DTO,
          // debes modificar la firma del controlador.
      }
    }

    return next.handle(); // Permite que la solicitud continúe
  }
}