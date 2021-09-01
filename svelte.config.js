import sveltePreprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess(),
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: vercel(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    vite: {
      optimizeDeps: {
        include: ['clipboard-copy']
      }
    }
  }
};

export default config;
