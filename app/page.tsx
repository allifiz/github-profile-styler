'use client';

import { Copy, ExternalLink, Palette, Plug, Sparkles, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'sonner';
import {
  BadgeStyle,
  defaultPlugins,
  generateMarkdown,
  ProfileForm,
  StatsTheme,
  ThemeId,
  themes,
  VisitorProvider,
} from '@/lib/generate-markdown';

type TabId = 'profile' | 'design' | 'plugins' | 'advanced';
type PluginKey = keyof ProfileForm['plugins'];
type EditableProfileField =
  | 'name'
  | 'username'
  | 'role'
  | 'bio'
  | 'location'
  | 'website'
  | 'twitter'
  | 'linkedin'
  | 'email'
  | 'instagram'
  | 'discord'
  | 'techStack'
  | 'typingLines';

const tabs: Array<{ id: TabId; label: string; helper: string }> = [
  { id: 'profile', label: '1. Profile', helper: 'Basic identity and links' },
  { id: 'design', label: '2. Design', helper: 'Theme, badges, colors' },
  { id: 'plugins', label: '3. Plugins', helper: 'Turn sections on or off' },
  { id: 'advanced', label: 'Advanced', helper: 'Fine tuning' },
];

const badgeStyles: BadgeStyle[] = [
  'flat',
  'flat-square',
  'plastic',
  'for-the-badge',
  'social',
];

const statsThemes: StatsTheme[] = [
  'radical',
  'tokyonight',
  'merko',
  'dracula',
  'github_dark',
  'transparent',
  'synthwave',
  'gruvbox',
  'onedark',
];

const visitorProviders: Array<{ label: string; value: VisitorProvider }> = [
  { label: 'Komarev counter', value: 'komarev' },
  { label: 'Anime counter', value: 'anime-counter' },
  { label: 'Classic profile counter', value: 'profile-counter' },
];

const animeCounterThemes = [
  { label: 'Moebooru', value: 'moebooru' },
  { label: 'Original New', value: 'original-new' },
  { label: 'Gelbooru', value: 'gelbooru' },
  { label: 'Asoul', value: 'asoul' },
  { label: 'Minecraft', value: 'minecraft' },
  { label: 'Kasuterura', value: 'kasuterura' },
  { label: 'Kyun', value: 'kyun' },
  { label: 'Rule34', value: 'rule34' },
];

const typingFonts = [
  'Fira Code',
  'JetBrains Mono',
  'Poppins',
  'Roboto Mono',
  'Source Code Pro',
  'Cascadia Code',
  'Space Mono',
  'Ubuntu Mono',
];

const defaultForm: ProfileForm = {
  name: 'Allif Izz',
  username: 'allifiz',
  role: 'Backend Developer',
  bio: 'I build backend services, AI bots, and clean developer tools. Currently exploring open-source projects with anime/cyberpunk vibes.',
  location: 'Indonesia',
  website: 'https://github.com/allifiz',
  twitter: '',
  linkedin: '',
  email: '',
  instagram: '',
  discord: '',
  techStack: 'TypeScript, Node.js, NestJS, PostgreSQL, Prisma, React, Next.js',
  typingLines: 'Backend Developer\nAI Bot Builder\nOpen Source Enjoyer\nAnime Neon Hacker',
  theme: 'anime-neon',
  badgeStyle: 'for-the-badge',
  badgeColor: '111827',
  logoColor: 'white',
  plugins: {
    ...defaultPlugins,
    visitorCounter: {
      ...defaultPlugins.visitorCounter,
      animeTheme: 'moebooru',
    },
  },
};

const recommendedPlugins: Array<{
  key: PluginKey;
  title: string;
  description: string;
  badge?: string;
}> = [
  {
    key: 'typingSvg',
    title: 'Typing SVG',
    description: 'Animated intro under your name. Good for first impression.',
    badge: 'Popular',
  },
  {
    key: 'visitorCounter',
    title: 'Visitor Counter',
    description: 'Show profile views using normal or anime-style counters.',
    badge: 'Fun',
  },
  {
    key: 'socialBadges',
    title: 'Social Badges',
    description: 'Turn your links into clean clickable badges.',
  },
  {
    key: 'githubStats',
    title: 'GitHub Stats',
    description: 'Show stars, commits, PRs, and GitHub activity summary.',
    badge: 'Recommended',
  },
  {
    key: 'topLanguages',
    title: 'Top Languages',
    description: 'Show your most used programming languages.',
  },
  {
    key: 'streakStats',
    title: 'Streak Stats',
    description: 'Show your GitHub contribution streak card.',
  },
];

const extraPlugins: Array<{
  key: PluginKey;
  title: string;
  description: string;
}> = [
  {
    key: 'trophy',
    title: 'GitHub Trophy',
    description: 'Add an achievement trophy row to make the profile feel rich.',
  },
  {
    key: 'quote',
    title: 'Dev Quote',
    description: 'Add a random developer quote card.',
  },
  {
    key: 'devJoke',
    title: 'Dev Joke',
    description: 'Add a random programming joke card.',
  },
];

const basicFields: Array<{
  key: EditableProfileField;
  label: string;
  placeholder: string;
  helper?: string;
  type?: 'input' | 'textarea';
}> = [
  {
    key: 'name',
    label: 'Display name',
    placeholder: 'Allif Izz',
    helper: 'This appears as the big title at the top.',
  },
  {
    key: 'username',
    label: 'GitHub username',
    placeholder: 'allifiz',
    helper: 'Used by stats cards, counters, and profile links.',
  },
  {
    key: 'role',
    label: 'Role / headline',
    placeholder: 'Backend Developer',
    helper: 'Short description of what you do.',
  },
  {
    key: 'bio',
    label: 'Bio',
    placeholder: 'Tell people what you build...',
    helper: 'Keep it short. Two sentences is enough.',
    type: 'textarea',
  },
  {
    key: 'typingLines',
    label: 'Typing lines',
    placeholder: 'Backend Developer\nAI Bot Builder',
    helper: 'One line per animation text.',
    type: 'textarea',
  },
];

const linkFields: Array<{
  key: EditableProfileField;
  label: string;
  placeholder: string;
}> = [
  { key: 'location', label: 'Location', placeholder: 'Indonesia' },
  { key: 'website', label: 'Website', placeholder: 'https://example.com' },
  { key: 'twitter', label: 'Twitter/X username', placeholder: 'sadflix07' },
  { key: 'linkedin', label: 'LinkedIn username', placeholder: 'allifizz' },
  { key: 'instagram', label: 'Instagram username', placeholder: 'allifiz' },
  { key: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { key: 'discord', label: 'Discord tag', placeholder: 'allif#0001' },
];

const normalizeHex = (value: string) => value.replace('#', '').slice(0, 6);

const toPickerColor = (value: string, fallback: string) => {
  const cleanValue = normalizeHex(value);
  const cleanFallback = normalizeHex(fallback);
  const hex = /^[0-9a-fA-F]{6}$/.test(cleanValue) ? cleanValue : cleanFallback;

  return `#${hex}`;
};

function PanelHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-200/80">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  helper,
  textarea,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  helper?: string;
  textarea?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="input min-h-24 resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="input"
        />
      )}
      {helper ? <span className="text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

function ColorInput({
  label,
  value,
  fallback,
  helper,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  helper?: string;
  onChange: (value: string) => void;
}) {
  const pickerValue = toPickerColor(value, fallback);

  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value.replace('#', ''))}
          className="h-11 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
        />
        <div>
          <div className="font-mono text-sm font-bold text-white">{pickerValue}</div>
          <p className="text-xs text-slate-400">Click the color box to change it</p>
        </div>
      </div>
      {helper ? <span className="text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

function FormSelect({
  label,
  value,
  options,
  helper,
  onChange,
}: {
  label: string;
  value: string | number;
  options: Array<string | number | { label: string; value: string | number }>;
  helper?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input cursor-pointer"
      >
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;

          return (
            <option key={String(optionValue)} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {helper ? <span className="text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

function PluginCard({
  enabled,
  title,
  description,
  badge,
  onToggle,
}: {
  enabled: boolean;
  title: string;
  description: string;
  badge?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
        enabled
          ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black">{title}</h3>
            {badge ? (
              <span className="rounded-full bg-fuchsia-400/15 px-2 py-0.5 text-[11px] font-bold text-fuchsia-100">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-300">{description}</p>
        </div>
        <div
          className={`mt-1 h-6 w-11 shrink-0 rounded-full p-1 transition ${
            enabled ? 'bg-cyan-400' : 'bg-slate-700 group-hover:bg-slate-600'
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white transition ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const markdown = useMemo(() => generateMarkdown(form), [form]);

  const updateField = (key: EditableProfileField, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updatePlugin = (plugin: PluginKey, value: Record<string, unknown>) => {
    setForm((current) => ({
      ...current,
      plugins: {
        ...current.plugins,
        [plugin]: {
          ...current.plugins[plugin],
          ...value,
        },
      } as ProfileForm['plugins'],
    }));
  };

  const togglePlugin = (plugin: PluginKey) => {
    updatePlugin(plugin, { enabled: !form.plugins[plugin].enabled });
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    toast.success('Markdown copied. Paste it into your GitHub profile README.');
  };

  const selectedTheme = themes[form.theme];

  return (
    <main className="min-h-screen overflow-hidden bg-[#070713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#ff4ecd33,transparent_30%),radial-gradient(circle_at_top_right,#00d9ff2e,transparent_28%),radial-gradient(circle_at_bottom,#7c3aed24,transparent_35%)]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">
                <Sparkles size={16} />
                Beginner-friendly GitHub README generator
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                GitHub Profile <span className="neon-text">Styler</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Build a clean profile README step by step. Start with your profile,
                choose a design, turn on plugins, then copy the markdown.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:min-w-72 md:grid-cols-1">
              <button
                type="button"
                onClick={copyMarkdown}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:bg-fuchsia-400"
              >
                <Copy size={18} />
                Copy Markdown
              </button>
              <a
                href="https://github.com/allifiz/github-profile-styler"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <ExternalLink size={18} />
                Star on GitHub
              </a>
            </div>
          </div>
        </header>

        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur">
            <div className="border-b border-white/10 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 className="text-fuchsia-300" size={22} />
                <div>
                  <h2 className="text-xl font-black">Customize</h2>
                  <p className="text-sm text-slate-400">Follow the steps from top to bottom.</p>
                </div>
              </div>

              <div className="grid gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? 'border-fuchsia-300 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="font-bold">{tab.label}</div>
                      <p className="text-xs text-slate-400">{tab.helper}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-h-none overflow-auto p-5 lg:max-h-[calc(100vh-220px)]">
              {activeTab === 'profile' ? (
                <div className="grid gap-5">
                  <PanelHeader
                    eyebrow="Start here"
                    title="Tell people who you are"
                    description="Only name, username, role, and bio are required. Social links are optional, so you can leave them empty."
                  />

                  <div className="grid gap-4">
                    {basicFields.map((field) => (
                      <FormInput
                        key={field.key}
                        label={field.label}
                        value={form[field.key]}
                        placeholder={field.placeholder}
                        helper={field.helper}
                        textarea={field.type === 'textarea'}
                        onChange={(value) => updateField(field.key, value)}
                      />
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="mb-3 font-black">Optional links</h3>
                    <div className="grid gap-4">
                      {linkFields.map((field) => (
                        <FormInput
                          key={field.key}
                          label={field.label}
                          value={form[field.key]}
                          placeholder={field.placeholder}
                          onChange={(value) => updateField(field.key, value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'design' ? (
                <div className="grid gap-5">
                  <PanelHeader
                    eyebrow="Visual style"
                    title="Pick a vibe"
                    description="Themes affect stats cards and typing colors. Badge style controls all generated tech/social badges."
                  />

                  <div className="grid gap-3">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Palette size={16} /> Theme presets
                    </p>
                    {(Object.keys(themes) as ThemeId[]).map((themeId) => {
                      const theme = themes[themeId];
                      const isActive = form.theme === themeId;

                      return (
                        <button
                          key={themeId}
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              theme: themeId,
                              badgeColor: theme.badgeColor,
                              plugins: {
                                ...current.plugins,
                                githubStats: {
                                  ...current.plugins.githubStats,
                                  theme: theme.readmeTheme,
                                },
                                trophy: {
                                  ...current.plugins.trophy,
                                  theme: theme.readmeTheme,
                                },
                                typingSvg: {
                                  ...current.plugins.typingSvg,
                                  color: theme.badgeColor,
                                },
                              },
                            }))
                          }
                          className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                            isActive
                              ? 'border-fuchsia-300 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10'
                              : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                          }`}
                        >
                          <div className="font-bold">
                            {theme.accentEmoji} {theme.label}
                          </div>
                          <p className="mt-1 text-sm text-slate-300">{theme.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black">Badge settings</h3>
                    <FormSelect
                      label="Badge style"
                      value={form.badgeStyle}
                      options={badgeStyles}
                      helper="for-the-badge is the most visible style for README profiles."
                      onChange={(value) =>
                        setForm((current) => ({ ...current, badgeStyle: value as BadgeStyle }))
                      }
                    />
                    <ColorInput
                      label="Badge color"
                      value={form.badgeColor}
                      fallback={selectedTheme.badgeColor}
                      helper="Used for tech stack and social badges."
                      onChange={(value) => setForm((current) => ({ ...current, badgeColor: value }))}
                    />
                    <FormInput
                      label="Logo color"
                      value={form.logoColor}
                      placeholder="white"
                      helper="Usually white is safest. You can also use black or another hex value."
                      onChange={(value) => setForm((current) => ({ ...current, logoColor: value }))}
                    />
                  </div>
                </div>
              ) : null}

              {activeTab === 'plugins' ? (
                <div className="grid gap-5">
                  <PanelHeader
                    eyebrow="Sections"
                    title="Choose what appears in README"
                    description="Turn on only the sections you like. The live preview updates instantly, so you can experiment safely."
                  />

                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Plug className="text-cyan-300" size={18} />
                      <h3 className="font-black">Recommended plugins</h3>
                    </div>
                    {recommendedPlugins.map((plugin) => (
                      <PluginCard
                        key={plugin.key}
                        enabled={form.plugins[plugin.key].enabled}
                        title={plugin.title}
                        description={plugin.description}
                        badge={plugin.badge}
                        onToggle={() => togglePlugin(plugin.key)}
                      />
                    ))}
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black">Extra / fun plugins</h3>
                    {extraPlugins.map((plugin) => (
                      <PluginCard
                        key={plugin.key}
                        enabled={form.plugins[plugin.key].enabled}
                        title={plugin.title}
                        description={plugin.description}
                        onToggle={() => togglePlugin(plugin.key)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'advanced' ? (
                <div className="grid gap-5">
                  <PanelHeader
                    eyebrow="Optional"
                    title="Fine tune plugin settings"
                    description="You can ignore this section if you want a quick profile. These settings are for users who want more control."
                  />

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black text-cyan-100">Counter settings</h3>
                    <FormSelect
                      label="Visitor provider"
                      value={form.plugins.visitorCounter.provider}
                      options={visitorProviders}
                      helper="Anime counter gives the most visual effect, Komarev is the safest classic option."
                      onChange={(value) =>
                        updatePlugin('visitorCounter', { provider: value as VisitorProvider })
                      }
                    />
                    <FormSelect
                      label="Anime counter theme"
                      value={form.plugins.visitorCounter.animeTheme}
                      options={animeCounterThemes}
                      helper="Used only when Anime Counter is selected. Moebooru and Original New are safer defaults."
                      onChange={(value) => updatePlugin('visitorCounter', { animeTheme: value })}
                    />
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black text-cyan-100">Stats settings</h3>
                    <FormSelect
                      label="Stats theme"
                      value={form.plugins.githubStats.theme}
                      options={statsThemes}
                      onChange={(value) => updatePlugin('githubStats', { theme: value as StatsTheme })}
                    />
                    <FormSelect
                      label="Top languages layout"
                      value={form.plugins.topLanguages.layout}
                      options={['compact', 'normal', 'donut']}
                      onChange={(value) => updatePlugin('topLanguages', { layout: value })}
                    />
                    <FormSelect
                      label="Trophy theme"
                      value={form.plugins.trophy.theme}
                      options={statsThemes}
                      onChange={(value) => updatePlugin('trophy', { theme: value as StatsTheme })}
                    />
                    <FormSelect
                      label="Trophy columns"
                      value={form.plugins.trophy.columns}
                      options={[3, 4, 5, 6, 7, 8]}
                      onChange={(value) => updatePlugin('trophy', { columns: Number(value) })}
                    />
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black text-cyan-100">Typing & quote settings</h3>
                    <FormSelect
                      label="Typing SVG font"
                      value={form.plugins.typingSvg.font}
                      options={typingFonts}
                      helper="Choose a readable coding font for the typing animation."
                      onChange={(value) => updatePlugin('typingSvg', { font: value })}
                    />
                    <ColorInput
                      label="Typing SVG color"
                      value={form.plugins.typingSvg.color}
                      fallback={selectedTheme.badgeColor}
                      helper="Controls the animated typing text color."
                      onChange={(value) => updatePlugin('typingSvg', { color: value })}
                    />
                    <FormSelect
                      label="Quote type"
                      value={form.plugins.quote.type}
                      options={['horizontal', 'vertical']}
                      onChange={(value) => updatePlugin('quote', { type: value })}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <section className="grid min-w-0 gap-6 lg:sticky lg:top-6 lg:self-start">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black">Live Preview</h2>
                  <p className="text-sm text-slate-300">
                    This is a close preview. GitHub may render external cards slightly differently.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:bg-fuchsia-400"
                >
                  <Copy size={18} />
                  Copy
                </button>
              </div>

              <article className="preview max-h-[620px] min-w-0 max-w-full overflow-auto rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
              </article>
            </div>

            <details className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d1f] p-5">
              <summary className="cursor-pointer text-lg font-black">
                Generated Markdown
              </summary>
              <p className="mt-2 text-sm text-slate-300">
                Copy this into <code>README.md</code> inside your GitHub profile repository.
              </p>
              <pre className="mt-4 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-slate-200">
                <code>{markdown}</code>
              </pre>
            </details>
          </section>
        </div>
      </section>
    </main>
  );
}
