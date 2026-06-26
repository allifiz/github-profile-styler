export type ThemeId = 'anime-neon' | 'dark-hacker' | 'cyberpunk';

export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
export type VisitorProvider = 'komarev' | 'anime-counter' | 'profile-counter';
export type City3DTheme =
  | 'gitblock'
  | 'green-animate'
  | 'green'
  | 'night-green'
  | 'night-rainbow'
  | 'night-view'
  | 'season-animate'
  | 'season'
  | 'south-season-animate'
  | 'south-season';
export type SectionId =
  | 'hero'
  | 'about'
  | 'techStack'
  | 'githubStats'
  | 'streakStats'
  | 'trophy'
  | 'advancedStats'
  | 'quote'
  | 'devJoke';
export type StatsTheme =
  | 'radical'
  | 'tokyonight'
  | 'merko'
  | 'dracula'
  | 'github_dark'
  | 'transparent'
  | 'synthwave'
  | 'gruvbox'
  | 'onedark';

export type PluginConfig = {
  typingSvg: {
    enabled: boolean;
    font: string;
    color: string;
    center: boolean;
  };
  visitorCounter: {
    enabled: boolean;
    provider: VisitorProvider;
    animeTheme: string;
  };
  githubStats: {
    enabled: boolean;
    theme: StatsTheme;
    showIcons: boolean;
    hideBorder: boolean;
  };
  topLanguages: {
    enabled: boolean;
    layout: 'compact' | 'normal' | 'donut';
  };
  streakStats: {
    enabled: boolean;
  };
  trophy: {
    enabled: boolean;
    theme: StatsTheme;
    columns: number;
  };
  advancedStats: {
    city3d: boolean;
    city3dTheme: City3DTheme;
  };
  quote: {
    enabled: boolean;
    type: 'horizontal' | 'vertical';
  };
  devJoke: {
    enabled: boolean;
  };
  socialBadges: {
    enabled: boolean;
  };
};

export type ProfileForm = {
  name: string;
  username: string;
  role: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  email: string;
  instagram: string;
  discord: string;
  techStack: string;
  typingLines: string;
  theme: ThemeId;
  badgeStyle: BadgeStyle;
  badgeColor: string;
  logoColor: string;
  sectionOrder: SectionId[];
  plugins: PluginConfig;
};

export const defaultSectionOrder: SectionId[] = [
  'hero',
  'about',
  'techStack',
  'githubStats',
  'streakStats',
  'trophy',
  'advancedStats',
  'quote',
  'devJoke',
];

export const themes: Record<
  ThemeId,
  {
    label: string;
    description: string;
    readmeTheme: StatsTheme;
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

export const defaultPlugins: PluginConfig = {
  typingSvg: {
    enabled: true,
    font: 'Fira Code',
    color: 'ff4ecd',
    center: true,
  },
  visitorCounter: {
    enabled: true,
    provider: 'komarev',
    animeTheme: 'moebooru',
  },
  githubStats: {
    enabled: true,
    theme: 'radical',
    showIcons: true,
    hideBorder: true,
  },
  topLanguages: {
    enabled: true,
    layout: 'compact',
  },
  streakStats: {
    enabled: true,
  },
  trophy: {
    enabled: false,
    theme: 'radical',
    columns: 6,
  },
  advancedStats: {
    city3d: false,
    city3dTheme: 'night-rainbow',
  },
  quote: {
    enabled: false,
    type: 'horizontal',
  },
  devJoke: {
    enabled: false,
  },
  socialBadges: {
    enabled: true,
  },
};

const city3dFileMap: Record<City3DTheme, string> = {
  gitblock: 'profile-gitblock.svg',
  'green-animate': 'profile-green-animate.svg',
  green: 'profile-green.svg',
  'night-green': 'profile-night-green.svg',
  'night-rainbow': 'profile-night-rainbow.svg',
  'night-view': 'profile-night-view.svg',
  'season-animate': 'profile-season-animate.svg',
  season: 'profile-season.svg',
  'south-season-animate': 'profile-south-season-animate.svg',
  'south-season': 'profile-south-season.svg',
};

const trophyThemeMap: Record<string, string> = {
  radical: 'radical',
  tokyonight: 'tokyonight',
  dracula: 'dracula',
  gruvbox: 'gruvbox',
  onedark: 'onedark',
  merko: 'matrix',
  github_dark: 'darkhub',
  transparent: 'flat',
  synthwave: 'synthwave',
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
const encodeBadgeText = (value: string) => encodeURIComponent(value).replace(/-/g, '--');

const badgeLogo = (tech: string) =>
  encodeURIComponent(tech.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, '-'));

const cleanColor = (color: string, fallback: string) => color.trim().replace('#', '') || fallback;
const cleanTrophyTheme = (theme: string) => trophyThemeMap[theme] || 'radical';
const cleanCity3DTheme = (theme?: City3DTheme) => theme && city3dFileMap[theme] ? theme : 'night-rainbow';
const cleanTrophyColumns = (columns: number) => {
  if (!Number.isFinite(columns)) return 6;
  return Math.min(Math.max(Math.round(columns), 3), 8);
};

const renderSection = (title: string, content: string) => `## ${title}\n\n${content}`;
const renderCenteredImage = (src: string, alt: string, extra = '') => `<p align="center">\n  <img ${extra} src="${src}" alt="${alt}" />\n</p>`;

const generateVisitorCounter = (username: string, form: ProfileForm, selectedTheme: (typeof themes)[ThemeId]) => {
  const provider = form.plugins.visitorCounter.provider;

  if (provider === 'anime-counter') {
    return renderCenteredImage(
      `https://count.getloli.com/get/@${username}?theme=${form.plugins.visitorCounter.animeTheme}`,
      'Visitor counter',
    );
  }

  if (provider === 'profile-counter') {
    return renderCenteredImage(
      `https://profile-counter.glitch.me/${username}/count.svg`,
      'Visitor counter',
    );
  }

  return `<p align="center">\n  <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20views&color=${selectedTheme.badgeColor}&style=${form.badgeStyle}" alt="Profile views" />\n  <img src="https://img.shields.io/github/followers/${username}?label=Followers&style=social" alt="GitHub followers" />\n</p>`;
};

const generateSocialBadges = (form: ProfileForm, badgeColor: string, logoColor: string) => {
  const style = form.badgeStyle;
  const badges = [
    form.website
      ? `<a href="${form.website}"><img src="https://img.shields.io/badge/Website-${badgeColor}?style=${style}&logo=google-chrome&logoColor=${logoColor}" /></a>`
      : '',
    form.linkedin
      ? `<a href="https://linkedin.com/in/${form.linkedin.replace('@', '')}"><img src="https://img.shields.io/badge/LinkedIn-${badgeColor}?style=${style}&logo=linkedin&logoColor=${logoColor}" /></a>`
      : '',
    form.twitter
      ? `<a href="https://x.com/${form.twitter.replace('@', '')}"><img src="https://img.shields.io/badge/Twitter/X-${badgeColor}?style=${style}&logo=x&logoColor=${logoColor}" /></a>`
      : '',
    form.instagram
      ? `<a href="https://instagram.com/${form.instagram.replace('@', '')}"><img src="https://img.shields.io/badge/Instagram-${badgeColor}?style=${style}&logo=instagram&logoColor=${logoColor}" /></a>`
      : '',
    form.email
      ? `<a href="mailto:${form.email}"><img src="https://img.shields.io/badge/Email-${badgeColor}?style=${style}&logo=gmail&logoColor=${logoColor}" /></a>`
      : '',
    form.discord
      ? `<img src="https://img.shields.io/badge/Discord-${encodeBadgeText(form.discord)}-${badgeColor}?style=${style}&logo=discord&logoColor=${logoColor}" />`
      : '',
  ].filter(Boolean);

  if (!badges.length) return '';

  return `<p align="center">\n  ${badges.join('\n  ')}\n</p>`;
};

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
  const email = form.email.trim();
  const instagram = form.instagram.trim();
  const discord = form.discord.trim();
  const typingLines = normalizeLines(form.typingLines || role);
  const techStack = normalizeTechStack(form.techStack || 'JavaScript, TypeScript, React, Node.js');
  const typingQuery = typingLines.map(encodeTypingLine).join(';');
  const badgeColor = cleanColor(form.badgeColor, selectedTheme.badgeColor);
  const logoColor = cleanColor(form.logoColor, 'white');
  const statsTheme = form.plugins.githubStats.theme || selectedTheme.readmeTheme;

  const sectionMap = new Map<SectionId, string>();

  const heroParts = [`<h1 align="center">${selectedTheme.accentEmoji} Hi, I'm ${name}</h1>`];

  if (form.plugins.typingSvg.enabled) {
    const font = encodeURIComponent(form.plugins.typingSvg.font || 'Fira Code').replace(/%20/g, '+');
    const typingColor = cleanColor(form.plugins.typingSvg.color, badgeColor);
    const center = form.plugins.typingSvg.center ? 'true' : 'false';
    heroParts.push(
      renderCenteredImage(
        `https://readme-typing-svg.demolab.com?font=${font}&pause=1000&color=${typingColor}&center=${center}&width=520&lines=${typingQuery}`,
        'Typing SVG',
      ),
    );
  }

  if (form.plugins.visitorCounter.enabled) {
    heroParts.push(generateVisitorCounter(username, form, selectedTheme));
  }

  const socialBadges = form.plugins.socialBadges.enabled
    ? generateSocialBadges({ ...form, website, twitter, linkedin, email, instagram, discord }, badgeColor, logoColor)
    : '';

  if (socialBadges) heroParts.push(socialBadges);
  sectionMap.set('hero', heroParts.join('\n\n'));

  const socialLinks = [
    website ? `- 🌐 Website: ${website}` : '',
    twitter ? `- 🐦 Twitter/X: https://x.com/${twitter.replace('@', '')}` : '',
    linkedin ? `- 💼 LinkedIn: https://linkedin.com/in/${linkedin.replace('@', '')}` : '',
    instagram ? `- 📸 Instagram: https://instagram.com/${instagram.replace('@', '')}` : '',
    email ? `- ✉️ Email: ${email}` : '',
    discord ? `- 💬 Discord: ${discord}` : '',
    location ? `- 📍 Location: ${location}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  sectionMap.set('about', renderSection(`${selectedTheme.accentEmoji} About Me`, `${bio}\n\n${socialLinks}`.trim()));

  const techBadges = techStack
    .map(
      (tech) =>
        `![${tech}](https://img.shields.io/badge/${encodeBadgeText(tech)}-${badgeColor}?style=${form.badgeStyle}&logo=${badgeLogo(tech)}&logoColor=${logoColor})`,
    )
    .join('\n');

  if (techBadges) sectionMap.set('techStack', renderSection('⚙️ Tech Stack', techBadges));

  const statImages: string[] = [];

  if (form.plugins.githubStats.enabled) {
    statImages.push(
      `<img height="170" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=${form.plugins.githubStats.showIcons}&theme=${statsTheme}&hide_border=${form.plugins.githubStats.hideBorder}" alt="GitHub stats" />`,
    );
  }

  if (form.plugins.topLanguages.enabled) {
    statImages.push(
      `<img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=${form.plugins.topLanguages.layout}&theme=${statsTheme}&hide_border=${form.plugins.githubStats.hideBorder}" alt="Top languages" />`,
    );
  }

  if (statImages.length) {
    sectionMap.set('githubStats', renderSection('📊 GitHub Stats', `<p align="center">\n  ${statImages.join('\n  ')}\n</p>`));
  }

  if (form.plugins.streakStats.enabled) {
    sectionMap.set(
      'streakStats',
      renderSection(
        '🔥 Contribution Streak',
        renderCenteredImage(
          `https://streak-stats.demolab.com?user=${username}&theme=${statsTheme}&hide_border=${form.plugins.githubStats.hideBorder}`,
          'GitHub streak',
        ),
      ),
    );
  }

  if (form.plugins.trophy.enabled) {
    const trophyTheme = cleanTrophyTheme(form.plugins.trophy.theme);
    const trophyColumns = cleanTrophyColumns(form.plugins.trophy.columns);

    sectionMap.set(
      'trophy',
      renderSection(
        '🏆 GitHub Trophy',
        renderCenteredImage(
          `https://github-profile-trophy.vercel.app/?username=${username}&theme=${trophyTheme}&no-frame=true&row=1&column=${trophyColumns}`,
          'GitHub trophy',
        ),
      ),
    );
  }

  if (form.plugins.advancedStats.city3d) {
    const cityTheme = cleanCity3DTheme(form.plugins.advancedStats.city3dTheme);
    const cityFile = city3dFileMap[cityTheme];

    sectionMap.set(
      'advancedStats',
      renderSection(
        '🏙️ 3D City Contribution View',
        renderCenteredImage(
          `https://raw.githubusercontent.com/${username}/${username}/main/profile-3d-contrib/${cityFile}`,
          '3D city contribution view',
        ),
      ),
    );
  }

  if (form.plugins.quote.enabled) {
    sectionMap.set(
      'quote',
      renderSection(
        '💭 Dev Quote',
        renderCenteredImage(
          `https://quotes-github-readme.vercel.app/api?type=${form.plugins.quote.type}&theme=${statsTheme}`,
          'Dev quote',
        ),
      ),
    );
  }

  if (form.plugins.devJoke.enabled) {
    sectionMap.set(
      'devJoke',
      renderSection(
        '😂 Random Dev Joke',
        renderCenteredImage(`https://readme-jokes.vercel.app/api?theme=${statsTheme}`, 'Dev joke'),
      ),
    );
  }

  const safeSectionOrder = [
    ...(form.sectionOrder?.length ? form.sectionOrder : defaultSectionOrder),
    ...defaultSectionOrder.filter((sectionId) => !form.sectionOrder?.includes(sectionId)),
  ];

  const orderedSections = safeSectionOrder
    .map((sectionId) => sectionMap.get(sectionId))
    .filter(Boolean) as string[];

  orderedSections.push('---');
  orderedSections.push('<p align="center">\n  <i>Generated with GitHub Profile Styler</i>\n</p>');

  return orderedSections.join('\n\n');
}
