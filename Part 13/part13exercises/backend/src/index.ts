import app from './app.js';
import { connectToDabase } from './utils/database.js';
import _Blog from './models/Blog.js';
import config from './utils/config.js';

(async () => {
  try {
    await connectToDabase();
    app.listen(config.PORT, '0.0.0.0', () =>
      console.log(`express escutando na porta ${config.PORT}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
