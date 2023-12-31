# Movie API with Nest.js

Это проект API для фильмов, созданный на Nest.js, в соответствии с техническим заданием, включающим использование Nest.js и хранение данных о фильмах в MongoDB.

## Основные возможности

- `GET /movies` - получает список всех фильмов
- `POST /movies` - добавляет новый фильм
- `GET /movies/{id}` - получает информацию о фильме по его id
- `PUT /movies/{id}` - обновляет информацию о фильме по его id
- `DELETE /movies/{id}` - удаляет фильм по его id

В качестве дополнительных возможностей были добавлены:

- Добавление рейтинга фильма (от 1 до 10) и возможность сортировки фильмов по рейтингу через эндпоинты `PUT movies/:id/rating` и `GET /movies/sort/:rating`
- Авторизация пользователей и возможность добавления/изменения/удаления фильмов и картинок к фильмам только авторизованными пользователями через эндпоинты `POST /users/register`, `POST /auth/login` и на всякий случай сделал получение профиля пользователя `GET /users/profile`
- Добавление изображений к фильмам и возможность их отображения при запросе информации о фильме через эндпоинт `POST movies/:id/image`

## Зависимости

Проект использует следующие основные зависимости:

- `@nestjs/common`, `@nestjs/core`, etc. - основные модули Nest.js
- `@nestjs/mongoose` - модуль Nest.js для работы с MongoDB
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`, `jsonwebtoken` - для аутентификации и авторизации
- `@nestjs/config` - для работы с переменными окружения
- `bcryptjs` - для безопасного хранения паролей пользователей
- `class-transformer`, `class-validator` - для валидации и трансформации входящих данных
- `aws-sdk` - для работы с AWS S3
- `mongoose` - ODM библиотека для работы с MongoDB
- `multer`, `@types/multer` - для обработки multipart/form-data, нужен для загрузки файлов

## AWS S3

Изображения хранятся в AWS S3 Bucket. Применена политика "Block all public access". Изображения можно получить через `GET /movies/{id}`, и затем используя `imageUrl`, их можно отображать в теге `<img>` на клиенте.

## Установка и запуск

1. Клонировать репозиторий: `git clone <URL репозитория>`
2. Установить зависимости: `npm install`
3. Создать файл `.env` и добавить туда необходимые переменные окружения
4. Запустить приложение: `npm run start`

## .env файл

- `MONGO_URL`
- `JWT_SECRET`
- `AWS_S3_BUCKET_NAME`
- `AWS_ACCESS_KEY`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
