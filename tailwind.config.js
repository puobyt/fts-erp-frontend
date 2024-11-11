/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('https://coloredbrain.com/wp-content/uploads/2016/07/login-background.jpg')",
      }
    },
  },
  plugins: [],
}