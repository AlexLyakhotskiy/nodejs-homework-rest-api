const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const contactsRouter = require('./routes/contacts.routes');

class Server {
  async start() {
    this.initServer();
    this.initConfig();
    await this.initDatabase();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initConfig() {
    dotenv.config({ path: path.join(__dirname, '../.env') });
  }

  async initDatabase() {
    try {
      const { DB_URL } = process.env;
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Database connection successful');
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  initMiddlewares() {
    const formatsLogger =
      this.server.get('env') === 'development' ? 'dev' : 'short';

    this.server.use(express.json());
    this.server.use(morgan(formatsLogger));
    this.server.use(cors({ origin: '*' }));
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send({
        name: err.name,
        status: statusCode,
        message: err.message,
      });
    });
  }

  startListening() {
    const PORT = process.env.PORT || 8080;

    this.server.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  }
}

const server = new Server();
server.start();
