# Real-Time Chat Backend (NestJS)
*Масштабируемый бэкенд для обмена сообщениями в реальном времени, построенный на основе NestJS + WebSocket (Socket.IO), аутентификации JWT, PostgreSQL и Redis. Разработан для горизонтального масштабирования, безопасных соединений и готового к использованию в производственной среде обмена сообщениями.*

---

## Технологии

- NestJS (backend framework)
- WebSockets & Socket.IO
- PostgreSQL (TypeORM)
- Redis
- Docker & Docker Compose

## Начало работы

##### 1. Склонировать репозиторий:
```bash
https://github.com/DinarMin/Real-Time-Chat_backend-Nestjs.git
```
##### 2. Заполнить данные в .env.example и переименовать в .env.

##### 3. Убедиться об наличии docker и docker-compose на вашем OC:

```bash
docker -v
docker-compose -v
```

##### Если версии не отображаются, установите:

##### Docker:
___
##### (Windows)
```
https://docs.docker.com/desktop/setup/install/windows-install/
```

##### (Linux)
```
https://docs.docker.com/desktop/setup/install/linux/
```

##### (Mac)
```
https://docs.docker.com/desktop/setup/install/mac-install/
```
##### Docker-compose: 
____
##### (General)
```
https://docs.docker.com/compose/install/
```

##### 4. Установить npm пакеты:
```bash
npm install
```

##### 5. В директории ./docker заполните .env.example. Для того, чтобы поднять базу данных и redis, выполнить команду:
```bash
docker compose up
```

##### 6. Создайте базу данных и выполните миграцию:
```bash
npm run db:create
```
```bash
npm run db:init
```

##### 7. Запустить приложение:
```bash 
npm run start
```

## Документация swagger доступна по адресу

##### http://localhost:3000/api



