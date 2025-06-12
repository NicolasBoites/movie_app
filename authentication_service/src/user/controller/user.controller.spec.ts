import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenGuard } from '../../common/gaurds/gaurd.access_token';
import { User, UserSchema } from '../_schemas/user.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../_tests/utils/mongo/mongo_in_memory';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    userController = app.get<UserController>(UserController);
  });
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  it('should ensure the AccessTokenGuard is applied to the controller', async () => {
    const guards = Reflect.getMetadata('__guards__', UserController);
    const guard = new guards[0]();
    expect(guard).toBeInstanceOf(AccessTokenGuard);
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
