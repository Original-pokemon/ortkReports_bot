# Инструкция по настойке и запуске бота

Для настройки бота существует файлы config.txt и .env  
В config.txt есть переменные к примеру ROOT_PATH=D:\bot\  
В .env переменные, которые не должны попасть в общий доступ

## Перед запуском

Т.к бот работает на node.js, надо установить сам node.js:  
https://nodejs.org/en/  
Используется mongodb так что стоит установить GUI:  
https://www.mongodb.com/products/compass

## Про confing.txt :

_Файл генерируется автоматически_  
ROOT_PATH - это название переменной, то что идет после равно - значение переменной

```
ROOT_PATH = //путь к файлу
START_TIME = //время, когда приходит первое уведомелние(Напомние о отправе отчетов) приходит пользователям и администраторам
STOP_TIME = //время, когда приходит второе уведомление(Информация о том, кто скинул отчеты) приходит только администраторам
FOLDER_CLEANER_TIME = //Сколько дней хранить папку
FILE_COUNTER = //кол-во фотографий, которое будет требовать бот от пользователей, при отправке фотографий
PHOTO_LIMIT = //ограничени фотографий(больше этого кол-во бот не будет сохранять фотографии)
```

Время отправки сообщения выстраиваеться вот в таком формате:

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

second - не обязтельный параметр, можно писать и так:  
30 20 \* \* \* - означает, что таймер сработает в 20:30

## Про .env :

_Файл надо создать в корне и заполнить вручную_

```
BOT_TOKEN= //Токен бота
MONGODB_CONNECTION_STRING=  //Cсылка для подключения к базе данных
MAIN_ADMIN_ID= //Ваш чат id (можно получить в боте @myidbot)
CONTACT_ADDRESS= //Ваш телеграм, для связи
```
