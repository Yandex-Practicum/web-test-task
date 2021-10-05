const validator = require('validator');
const BadRequest = require('../errors/BadRequest');

module.exports.urlValidation = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequest('Ссылка не обнаружена');
};
// эта регулярка не пропускает неверное значение,
// в частности 'https://www.yandex', вот скрин https://snipboard.io/Ex9VJw.jpg, к тому же тз требует ее использование
module.exports.avatarValidation = (value) => {
  const result = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(value);
  if (result) {
    return value;
  }
  throw new BadRequest('Ссылка не обнаружена');
};
