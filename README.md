# Тайный Санта
Проект вдохновлен [АДМ хабра](https://habra-adm.ru)

# Запуск проекта на продакшене
1) Вначале вам необходимо заполнить все поля в `docker-compose.prod.yml`, используя production-ключи. Все возможные ключи можно найти в [Config.kt](https://github.com/glitchless/SecretSanta/blob/master/backend/src/main/kotlin/ru/glitchless/santa/utils/Config.kt)
2) Затем [установить Docker на сервере](https://docs.docker.com/engine/install/) и [Docker Compose](https://docs.docker.com/compose/install/)
3) Загрузить docker-compose.prod.yml на сервер и выполнить 
```
docker-compose docker-compose.prod.yml up
```
4) По адресу `YOUR_SERVER_IP:80` в браузере у вас должен открываться рабочий сайт
