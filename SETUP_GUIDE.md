# Complete Setup Guide: Devi vs Devi-Extra

You now have two powerful CLI packages for React project scaffolding:

## 📦 create-devi (Basic Version)
**Command:** `npm create devi@latest`

### Features:
- ⚡ Fast React project setup with Vite
- 🎨 Tailwind CSS integration
- 🧩 ShadCN UI components (optional)
- 🛣️ React Router DOM (optional)
- 📝 TypeScript or JavaScript support
- 🏗️ Modern project structure with layouts and pages

### Usage:
```bash
npm create devi@latest
```

Then follow the interactive prompts to:
1. Enter your project name
2. Choose TypeScript or JavaScript
3. Select styling options (Tailwind, Tailwind + ShadCN, or none)
4. Choose whether to include React Router DOM

## 🚀 create-devi-extra (Rich Text Editor Version)
**Command:** `npm create devi-extra@latest`

### Features:
- 📝 **Full-featured Rich Text Editor** powered by TipTap
- ✏️ Text formatting (Bold, Italic, Underline, Strikethrough, Code)
- 📐 Text alignment (Left, Center, Right, Justify)
- 📋 Lists (Bullet points and numbered lists)
- 🎨 Colors and text highlighting
- 🔗 Links and image insertion
- 📊 Table creation and editing
- ↩️ Undo/Redo functionality
- 🔤 Font family selection (optional)
- 🎯 **Works with existing projects too!**

### Usage:

#### For New Projects:
```bash
npm create devi-extra@latest
```

Choose "Create new project with Rich Text Editor"

#### For Existing Projects:
Navigate to your existing React project and run:
```bash
npx create-devi-extra@latest
```

Choose "Add Rich Text Editor to existing project"

## 🔧 Rich Text Editor Component Usage

After installation, you can use the Rich Text Editor in any React component:

### TypeScript Example:
```tsx
import React, { useState } from 'react';
import RichTextEditor from './components/RichTextEditor';

const MyComponent: React.FC = () => {
  const [content, setContent] = useState('<p>Start typing...</p>');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Editor</h1>
      <RichTextEditor 
        content={content}
        onChange={setContent}
        placeholder="Enter your content here..."
        className="mb-4"
      />
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Generated HTML:</h3>
        <pre>{content}</pre>
      </div>
    </div>
  );
};
```

### JavaScript Example:
```jsx
import React, { useState } from 'react';
import RichTextEditor from './components/RichTextEditor';

const MyComponent = () => {
  const [content, setContent] = useState('<p>Start typing...</p>');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Editor</h1>
      <RichTextEditor 
        content={content}
        onChange={setContent}
        placeholder="Enter your content here..."
        className="mb-4"
      />
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Generated HTML:</h3>
        <pre>{content}</pre>
      </div>
    </div>
  );
};
```

## 🎛️ Rich Text Editor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | HTML content of the editor |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `className` | `string` | `''` | Additional CSS classes |
| `readonly` | `boolean` | `false` | Make editor read-only |

## 📋 When to Use Which Package?

### Use `create-devi` when:
- You want a quick, lightweight React setup
- You don't need a rich text editor
- You prefer minimal dependencies
- You're building simple applications

### Use `create-devi-extra` when:
- You need a full-featured rich text editor
- You're building content management systems
- You need document editing capabilities
- You want advanced text formatting features
- You're building blogs, forums, or similar content-heavy applications

## 🛠️ Development Workflow

### For Basic Projects (create-devi):
```bash
npm create devi@latest my-project
cd my-project
npm run dev
```

### For Rich Text Editor Projects (create-devi-extra):
```bash
npm create devi-extra@latest my-rich-app
cd my-rich-app
npm run dev
```

### Adding Editor to Existing Project:
```bash
cd your-existing-project
npx create-devi-extra@latest
# Select "Add Rich Text Editor to existing project"
npm run dev
```

## 🚀 Publishing and Distribution

Both packages are ready for npm publishing:

### Basic Package (create-devi):
- Location: `D:\CLI`
- Built files: `D:\CLI\dist`
- Ready to publish with `npm publish`

### Rich Text Editor Package (create-devi-extra):
- Location: `D:\CLI-extra`
- Built files: `D:\CLI-extra\dist`
- Ready to publish with `npm publish`

## 🎯 Next Steps

1. **Test both packages** by creating sample projects
2. **Publish to npm** when ready for distribution
3. **Create documentation** websites for both packages
4. **Add example projects** to showcase capabilities
5. **Consider adding** more rich text editor features based on user feedback

## 🤝 Contributing

Both packages are open for contributions:
- Bug reports and feature requests are welcome
- Pull requests should include tests
- Follow the existing code style and conventions

Enjoy building amazing React applications with your new CLI tools! 🚀
