import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.js", '**/*.mjs'],
    plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser }
  },
  globalIgnores([
    'node_modules',
    'dist/**',
    'htdocs/**'
  ])
]);
