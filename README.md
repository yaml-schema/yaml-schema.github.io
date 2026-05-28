# YAML Schema Documentation

This is the official documentation site for YAML Schema, a powerful validation system for YAML documents. The site is built with Jekyll and uses the [Just the Docs](https://just-the-docs.github.io/just-the-docs/) theme.

## 🚀 Quick Start

### Prerequisites

- Ruby 2.5 or higher
- RubyGems
- Bundler

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yaml-schema/yaml-schema.github.io.git
   cd yaml-schema.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Start the development server**
   ```bash
   bundle exec jekyll serve
   ```

4. **View the site**
   Open your browser and navigate to `http://localhost:4000`

### Building for Production

```bash
bundle exec jekyll build
```

The built site will be in the `_site` directory.

## 📁 Project Structure

```
yaml-schema.github.io/
├── _config.yml              # Jekyll configuration
├── _layouts/                # Jekyll layouts
│   └── default.html         # Main layout template
├── _includes/               # Jekyll includes
│   ├── title.html           # Site title
│   ├── nav.html             # Navigation menu
│   ├── breadcrumbs.html     # Breadcrumb navigation
│   └── header_custom.html   # Custom header content
├── docs/                    # Documentation pages
│   ├── index.md             # Documentation index
│   ├── installation.md      # Installation guide
│   ├── basic-usage.md       # Basic usage guide
│   ├── examples.md          # Examples and use cases
│   └── faq.md              # Frequently asked questions
├── index.md                 # Home page
├── Gemfile                  # Ruby dependencies
└── README.md               # This file
```

## 🎨 Customization

### Theme Configuration

The site uses the Just the Docs theme, which can be customized through the `_config.yml` file. Key configuration options include:

- **Color scheme**: Light or dark mode
- **Search**: Enable/disable search functionality
- **Navigation**: Customize navigation structure
- **External links**: Add links to external resources

### Adding New Pages

1. Create a new Markdown file in the appropriate directory
2. Add front matter with metadata:
   ```yaml
   ---
   layout: default
   title: Your Page Title
   parent: Documentation  # Optional: for nested navigation
   nav_order: 6          # Optional: for ordering
   ---
   ```
3. Write your content in Markdown

### Navigation Structure

The navigation is automatically generated based on:
- File location in the directory structure
- Front matter metadata (`parent`, `nav_order`)
- Page titles

## 🔧 Development

### Adding New Features

1. **New documentation pages**: Add Markdown files to the `docs/` directory
2. **Custom layouts**: Create new layout files in `_layouts/`
3. **Custom includes**: Add reusable components in `_includes/`
4. **Styling**: Customize CSS by overriding theme styles

### Testing

- **Local testing**: Use `bundle exec jekyll serve` for local development
- **Link checking**: Use tools like `htmlproofer` to check for broken links
- **Build testing**: Ensure the site builds correctly with `bundle exec jekyll build`

## 📝 Content Guidelines

### Writing Documentation

- Use clear, concise language
- Include code examples where appropriate
- Follow the existing style and structure
- Use proper Markdown formatting
- Include front matter for proper navigation

### Code Examples

- Use syntax highlighting for code blocks
- Include both YAML and Python examples
- Provide complete, runnable examples
- Add comments to explain complex code

### Images and Assets

- Store images in an `assets/` directory
- Use relative paths for internal links
- Optimize images for web use
- Include alt text for accessibility

## 🚀 Deployment

### GitHub Pages

This site is configured for GitHub Pages deployment:

1. Push changes to the `main` branch
2. GitHub Pages will automatically build and deploy the site
3. The site will be available at `https://yaml-schema.github.io`

### Manual Deployment

For other hosting platforms:

1. Build the site: `bundle exec jekyll build`
2. Upload the contents of the `_site` directory to your web server

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report issues**: Use the GitHub issue tracker
2. **Suggest improvements**: Open feature requests
3. **Submit content**: Create pull requests with documentation improvements
4. **Fix bugs**: Submit patches for any issues you find

### Contribution Guidelines

- Follow the existing code style and conventions
- Test your changes locally before submitting
- Include clear commit messages
- Update documentation as needed

## 📄 License

This documentation site is licensed under the MIT License. See the LICENSE file for details.

## 🔗 Links

- **Live Site**: https://yaml-schema.github.io
- **GitHub Repository**: https://github.com/yaml-schema/yaml-schema.github.io
- **Just the Docs Theme**: https://just-the-docs.github.io/just-the-docs/
- **Jekyll**: https://jekyllrb.com/

## 📞 Support

If you need help with the documentation site:

- Report questions on [GitHub Issues](https://github.com/yaml-schema/yaml-schema/issues)
- Open an issue on GitHub
- Contact the maintainers through GitHub discussions

---

*Built with ❤️ using Jekyll and Just the Docs*
