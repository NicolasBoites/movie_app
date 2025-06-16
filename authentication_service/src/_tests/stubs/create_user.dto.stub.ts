import { CreateUserDto } from '../../user/_dtos/create_user.dto';

export const CreateUserDtoStub = (): CreateUserDto => {
  return {
    email: 'manoj.sethi@manojsethi.com',
    username: 'Manoj Sethi',
    password: 'testingpassword',
  };
};
