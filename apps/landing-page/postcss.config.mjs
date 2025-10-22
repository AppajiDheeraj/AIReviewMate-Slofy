const config = {
  plugins: ["@tailwindcss/postcss"],
  corePlugins: {
    preflight: false, // This disables Tailwind's base styles
  },
};

export default config;
