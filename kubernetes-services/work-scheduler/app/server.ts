import express from 'express';
import env from './util/env';
import log from '../../../app/util/log';
import router from './routers/router';
import { Server } from 'http';
import Scheduler from './workers/scheduler';

/**
 *
 * @param config - The configuration Record from the environment variables
 * @returns An object containing the running components
 */
export default function start(_config: Record<string, string>): Server {

  // start the scheduler
  const scheduler = new Scheduler();
  scheduler.start().catch((e) => {
    log.error('Scheduler start failed');
    throw e;
  });

  const app = express();

  app.use(express.json());
  app.use('/', router());

  return app.listen(env.port, '0.0.0.0', () => {
    log.info(`Application listening on port ${env.port}`);
  });
}

if (require.main === module) {
  start(process.env);
}
