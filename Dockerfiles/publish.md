# Добавление на сервер
1. Принцип такой же как и с ytineres_web
2. Создаем образ ytineres_data
    2.1 Копируем докер файл из текущей директории на сервер
    2.2 Выполняем команду `docker build --network=host . -t ytineres_data`

# Классическое обновление кода
1. На машине разработчика выполняем команду `npx tsc`
2. Архивируем следующие директорию dist
3. Отправляем полученный архив на сервер в папку `data`
4. Останавливаем docker-compose
5. Удаляем текущую директорию `rm -r data_service/dist`
6. Разархивируем архив `unzip dist.zip -d data_service`
7. Проверяем по гиту, добавлялись ли зависимости и если да, то
    7.1 Копируем package.json и package-lock.json в папку `data/data_service`
    7.2 Запускаем контейнер с ytineres_nodejs образом, который сразу удалится после выполнения
    `docker run --rm -it -v /var/www/ytineres/data:/home/data  ytineres_nodejs bash`
    7.3 Переходим в папку с package.json и вызываем `npm ci --only=prod`
 8. Запускаем docker-compose




