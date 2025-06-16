import { AuthDto } from '../../auth/_dtos/auth.dto';

export const AuthDtoStub = (): AuthDto => {
  return {
    email: 'manoj.sethi@manojsethi.com',
    password: 'testingpassword',
  };
};
