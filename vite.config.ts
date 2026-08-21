import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works unmodified whether it's served from a
  // domain root (Netlify/Vercel) or a GitHub Pages project subpath
  // (https://<user>.github.io/<repo>/) — combined with HashRouter for
  // routing, no per-host config is needed.
  base: './',
})
