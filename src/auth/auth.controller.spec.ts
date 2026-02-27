import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let app: INestApplication;
  let usersService: UsersService;

  /* Тестовые данные */
  const data = {
    username: 'test',
    email: 'testjest5@gmail.com',
    password: 'testjestpassword',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.init();

    usersService = module.get<UsersService>(UsersService);
    /* Очищаем таблицу */
    await usersService.clearUserTable();
  });

  it('/auth/signUp - Регистрация, должна возвращать статус 201 и обьект с свойствами message и email при успешной регистрации ', () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .send(data)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.email).toEqual(data.email);
      });
  });

  it('/auth/signIn - Авторизация, должна возвращать статус 201 и вернуть обьект с accessToken', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: data.email, password: data.password })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
