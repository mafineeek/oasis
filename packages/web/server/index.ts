import { config } from 'dotenv';
import { join } from 'path';
import next from 'next';
import { createApp } from '@oasis/api';

config({ path: join(__dirname, '../../api/.env') });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: require('../next.config.js') });
const handle = app.getRequestHandler();

(async () => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error("> You must have NEXT_PUBLIC_BASE_URL set in your packages/web/.env file.");
    console.error("> For more information, refer to the oasis.sh developer's wiki: https://github.com/oasis-sh/oasis/wiki/Web-Quick-Start");
    process.exit(1);
  }

  const server = await createApp();
  if (!server) process.exit(1);

  app.prepare().then(() => {
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    const PORT = parseInt(process.env.PORT as string, 10) || 3000;

    try {
      server.listen(PORT, () =>
        console.log(
          `> Ready on http://localhost:${PORT} \n> API: http://localhost:${PORT}/graphql`
        )
      );
    } catch (err) {
      if (err) throw err;
    }
  });
})();
