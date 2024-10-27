import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import jwtConstants from '../shared/security/constants';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        roles: ['user'],
      };
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toEqual({ id: 1, username: 'testuser', roles: ['user'] });
    });

    it('should return null when user is not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        roles: ['user'],
      };
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'wrongpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        roles: ['user'],
      };
      const mockReq = { user: mockUser };
      const mockToken = 'mockJwtToken';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(mockReq);

      expect(result).toEqual({ token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { name: 'testuser', sub: 1, roles: ['user'] },
        {
          privateKey: jwtConstants.JWT_SECRET,
          expiresIn: jwtConstants.JWT_EXPIRES_IN,
        }
      );
    });
  });
});