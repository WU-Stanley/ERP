const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'apps/LMS/src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(join(__dirname, 'apps/LMS')),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

