export const prettierConfig = `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "importOrder": ["^react", "^[a-zA-Z]", "^@/", "^\\\\./"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}`;
export const lintStagedConfig = `{
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}`;
export const vsCodeSettings = `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.eol": "\\n"
}`;
