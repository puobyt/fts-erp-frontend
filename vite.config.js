import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Using the SWC version of React plugin
import tailwindcss from 'tailwindcss';

// Define the server port
const PORT = 3039;

export default defineConfig({
  plugins: [
    react(), // React plugin
    tailwindcss() // Tailwind CSS plugin
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.resolve(__dirname, 'node_modules/$1'),
      },
      {
        find: /^src\/(.+)/,
        replacement: path.resolve(__dirname, 'src/$1'),
      },
    ],
  },
  assetsInclude: ['**/*.css'], // Ensures CSS assets are included
  server: {
    port: PORT, 
    host: true, // Ensures the server can be accessed from any device on the local network
  },
  preview: {
    port: PORT,
    host: true,
  },
  define: {
    'process.env': process.env, // To pass environment variables into your app
  }
});
