import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        TCP_HOST: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
        VALIDATION_WHITELIST: Joi.boolean().default(true),
        FORBID_NON_WHITELISTED: Joi.boolean().default(true),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('The MONGODB_URI environment variable is not defined.');
        }
        return {
          uri: uri,
        };
      },
    }),

    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
