const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.disable('x-powered-by');

app.use((req, res, next) => {
  req.user = {
    _id: '60e9dd06b36d7316103381a6',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  const ERROR = new Error('Запрашиваемый ресурс не найден');
  res.status(404).send({ message: ERROR.message });
});

app.listen(PORT, () => {
});
