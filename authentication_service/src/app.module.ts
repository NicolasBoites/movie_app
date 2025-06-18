import { Module, Logger } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as mongoose from 'mongoose'; // Import mongoose to use mongoose.set()

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('The MONGODB_URI environment variable is not defined.');
        }

        mongoose.set('debug', false);

        Logger.log(`Attempting to connect to MongoDB...`, 'MongooseModule');
        return {
          uri: uri,
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: 'MONGO_CONNECTION_MONITOR',
      useFactory: (connection: mongoose.Connection) => {
        const logger = new Logger('MongoDB Connection');

        connection.on('connected', () => {
          logger.log('Connection to MongoDB established successfully.');
        });

        connection.on('error', (err) => {
          logger.error(`MongoDB connection error: ${err.message}`, err.stack);
        });

        connection.on('disconnected', () => {
          logger.warn('Connection to MongoDB disconnected. Attempting to reconnect...');
        });

        return connection;
      },
      inject: [getConnectionToken()],
    },
  ],
})
export class AppModule {}