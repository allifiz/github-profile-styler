export type ThemeId = 'anime-neon' | 'dark-hacker' | 'cyberpunk';

export type ProfileForm = {
  name: string;
  username: string;
  role: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  techStack: string;
  typingLines: string;
  theme: ThemeId;
};

export const themes: Record<
  ThemeId,
  {
    label: string;
    description: string;
    readmeTheme: string;
    badgeColor: string;
    accentEmoji: string;
  }
> = {
  'anime-neon': {
    label: 'Anime Neon',
    description: 'Pink-purple anime profile with glowing README sections.',
    readmeTheme: 'radical',
    badgeColor: 'ff4ecd',
    accentEmoji: '🌸',
  },
  'dark-hacker': {
    label: 'Dark Hacker',
    description: 'Terminal-inspired layout for backend, Linux, and CTF enjoyers.',
    readmeTheme: 'merko',
    badgeColor: '00ff99',
    accentEmoji: '🧪',
  },
  cyberpunk: {
    label: 'Cyberpunk',
    description: 'Futuristic neon blue profile for builders and AI devs.',
    readmeTheme: 'tokyonight',
    badgeColor: '00d9ff',
    accentEmoji: '⚡',
  },
};

const normalizeLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const normalizeTechStack = (value: string) =>
  value
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean);

const encodeTypingLine = (line: string) => encodeURIComponent(line).replace(/%20/g, '+');

const badgeLogo = (tech: string) =>
  encodeURIComponent(tech.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, '-'));

export function generateMarkdown(form: ProfileForm) {
  const selectedTheme = themes[form.theme];
  const username = form.username.trim() || 'your-github-username';
  const name = form.name.trim() || 'Your Name';
  const role = form.role.trim() || 'Software Developer';
  const bio = form.bio.trim() || 'I build useful things with code.';
  const location = form.location.trim();
  const website = form.website.trim();
  const twitter = form.twitter.trim();
  const linkedin = form.linkedin.trim();
  const typingLines = normalizeLines(form.typingLines || role);
  const techStack = normalizeTechStack(form.techStack || 'JavaScript, TypeScript, React, Node.js');
  const typingQuery = typingLines.map(encodeTypingLine).join(';');

  const techBadges = techStack
    .map(
      (tech) =>
        `![${tech}](https://img.shields.io/badge/${encodeURIComponent(
          tech,
        )}-111827?style=for-the-badge&logo=${badgeLogo(tech)}&logoColor=white)`,
    )
    .join('\n');

  const socialLinks = [
    website ? `- 🌐 Website: ${website}` : '',
    twitter ? `- 🐦 Twitter/X: https://x.com/${twitter.replace('@', '')}` : '',
    linkedin ? `- 💼 LinkedIn: https://linkedin.com/in/${linkedin.replace('@', '')}` : '',
    location ? `- 📍 Location: ${location}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `<h1 align="center">${selectedTheme.accentEmoji} Hi, I'm ${name}</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&center=true&width=520&lines=${typingQuery}" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20views&color=${selectedTheme.badgeColor}&style=flat" alt="Profile views" />
  <img src="https://img.shields.io/github/followers/${username}?label=Followers&style=social" alt="GitHub followers" />
</p>

---

## ${selectedTheme.accentEmoji} About Me

${bio}

${socialLinks ? `${socialLinks}\n` : ''}
## ⚙️ Tech Stack

${techBadges}

## 📊 GitHub Stats

<p align="center">
  <img height="170" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${selectedTheme.readmeTheme}&hide_border=true" alt="GitHub stats" />
  <img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${selectedTheme.readmeTheme}&hide_border=true" alt="Top languages" />
</p>

## 🔥 Contribution Streak

<p align="center">
  <img src="https://streak-stats.demolab.com?user=${username}&theme=${selectedTheme.readmeTheme}&hide_border=true" alt="GitHub streak" />
</p>

---

<p align="center">
  <i>Generated with GitHub Profile Styler</i>
</p>`;
}
