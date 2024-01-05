const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { NODE_ENV } = process.env;
const databaseConfig = require('./dbConfig.json');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...1', err);
  console.log(err.name, err.message);
  process.exit(1);
});

NODE_ENV == 'development'
  ? dotenv.config({ path: './config.dev.env' })
  : dotenv.config({ path: './config.prod.env' });

const { DATABASE, DATABASE_PASSWORD, PORT } = process.env;

const dbUri = databaseConfig.TARGET_DB_URL;
// const dbUri = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const app = require('./app');

const port = PORT || 3000;

mongoose.connect(dbUri, dbOptions).then(() => {
  console.log('DB connection successful!');

  app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...2');
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  app.close(() => {
    console.log('💥 Process terminated!');
  });
});
