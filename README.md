# GitHub Profile Styler

<p align="center">
  <b>Anime/cyberpunk GitHub profile README generator with live preview, badges, stats, and typing SVG.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-111827?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-111827?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-111827?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#themes">Themes</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## Why?

A lot of developers want a cool GitHub profile README, but setting up badges, stats cards, typing SVG, and markdown layout manually can be annoying.

**GitHub Profile Styler** helps you generate a polished profile README in seconds. Fill the form, pick a theme, preview the result, then copy the markdown into your GitHub profile repository.

## Features

- 🎨 Anime / cyberpunk / hacker profile themes
- 👀 Live markdown preview
- 📋 One-click copy markdown
- 🧑‍💻 GitHub username, bio, role, location, website, and social fields
- ⚙️ Tech stack badge generator
- ⌨️ Typing SVG generator
- 📊 GitHub stats and top languages cards
- 🔥 Contribution streak card
- 🚀 No login required
- 🧩 Easy to fork and customize

## Themes

| Theme | Vibe |
| --- | --- |
| 🌸 Anime Neon | Pink-purple anime profile with glowing README sections |
| 🧪 Dark Hacker | Terminal-inspired layout for backend, Linux, and CTF enjoyers |
| ⚡ Cyberpunk | Futuristic neon blue profile for builders and AI devs |

## Getting Started

Clone the repository:

```bash
git clone https://github.com/allifiz/github-profile-styler.git
cd github-profile-styler
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

## Project Structure

```txt
app/
├── globals.css
├── layout.tsx
└── page.tsx

lib/
└── generate-markdown.ts
```

## Roadmap

- [x] Basic README generator
- [x] Theme picker
- [x] Live markdown preview
- [x] Copy markdown button
- [x] GitHub stats, streak, badges, and typing SVG
- [ ] Add more anime/cyberpunk themes
- [ ] Add drag-and-drop section ordering
- [ ] Add export preview as image
- [ ] Add local template saving
- [ ] Add GitHub OAuth profile import
- [ ] Add deploy demo link

## Contributing

Contributions are welcome. You can help by adding new themes, improving the markdown output, fixing UI bugs, or improving the docs.

Good first ideas:

- Add new README sections
- Add more badge styles
- Add more theme presets
- Improve mobile layout
- Add preview screenshot to this README

## License

MIT License.
