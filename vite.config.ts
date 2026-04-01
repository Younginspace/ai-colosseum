import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: { port: 5175 },
    plugins: [
      {
        name: 'battle-api',
        configureServer(server) {
          const parseBody = (req: any): Promise<any> =>
            new Promise((resolve, reject) => {
              let body = '';
              req.on('data', (c: string) => (body += c));
              req.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch { reject(new Error('Invalid JSON')); }
              });
            });

          server.middlewares.use('/api/battle', async (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end();
              return;
            }

            try {
              const data = await parseBody(req);
              const apiKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

              if (!apiKey) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: '请在 .env 文件设置 ANTHROPIC_API_KEY' }));
                return;
              }

              const { default: Anthropic } = await import('@anthropic-ai/sdk');
              const client = new Anthropic({ apiKey });

              const response = await client.messages.create({
                model: data.model || 'claude-haiku-4-5-20251001',
                max_tokens: 400,
                system: data.system,
                messages: data.messages,
              });

              const text =
                response.content[0].type === 'text' ? response.content[0].text : '';

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ content: text }));
            } catch (err: any) {
              console.error('[battle-api]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        },
      },
    ],
  };
});
