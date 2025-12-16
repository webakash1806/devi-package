// .gitattributes template for proper line endings
export const gitAttributesTemplate = `# Auto detect text files and perform LF normalization
* text=auto

# Source code
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Configuration files
.gitignore text eol=lf
.gitattributes text eol=lf
.editorconfig text eol=lf
.prettierrc text eol=lf
.eslintrc.* text eol=lf

# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg text eol=lf

# Fonts
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
`;
