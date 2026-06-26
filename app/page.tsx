'use client';

import { Copy, ExternalLink, Palette, Plug, Sparkles, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'sonner';
import {
  BadgeStyle,
  generateMarkdown,
  defaultPlugins,
  ProfileForm,
  StatsTheme,
  ThemeId,
  themes,
  VisitorProvider,
} from '@/lib/generate-markdown';

type EditableProfileField = Exclude<
  keyof ProfileForm,
  'theme' | 'plugins' | 'badgeStyle'
>;

type PluginKey = keyof ProfileForm['plugins'];

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
  { label: 'Komarev', value: 'komarev' },
  { label: 'Anime Counter', value: 'anime-counter' },
  { label: 'Profile Counter', value: 'profile-counter' },
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
  plugins: defaultPlugins,
};

const fields: Array<{
  key: EditableProfileField;
  label: string;
  placeholder: string;
  type?: 'input' | 'textarea';
}> = [
  { key: 'name', label: 'Display name', placeholder: 'Allif Izz' },
  { key: 'username', label: 'GitHub username', placeholder: 'allifiz' },
  { key: 'role', label: 'Role', placeholder: 'Backend Developer' },
  {
    key: 'bio',
    label: 'Bio',
    placeholder: 'Tell people what you build...',
    type: 'textarea',
  },
  { key: 'location', label: 'Location', placeholder: 'Indonesia' },
  { key: 'website', label: 'Website', placeholder: 'https://example.com' },
  { key: 'twitter', label: 'Twitter/X username', placeholder: 'sadflix07' },
  { key: 'linkedin', label: 'LinkedIn username', placeholder: 'allifizz' },
  { key: 'instagram', label: 'Instagram username', placeholder: 'allifiz' },
  { key: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { key: 'discord', label: 'Discord tag', placeholder: 'allif#0001' },
  {
    key: 'techStack',
    label: 'Tech stack, separated by comma',
    placeholder: 'TypeScript, Node.js, PostgreSQL',
    type: 'textarea',
  },
  {
    key: 'typingLines',
    label: 'Typing SVG lines, one per line',
    placeholder: 'Backend Developer\nAI Bot Builder',
    type: 'textarea',
  },
];

const pluginLabels: Array<{ key: PluginKey; title: string; description: string }> = [
  {
    key: 'typingSvg',
    title: 'Typing SVG',
    description: 'Animated typing intro below your profile title.',
  },
  {
    key: 'visitorCounter',
    title: 'Visitor Counter',
    description: 'Komarev, anime counter, or classic profile counter.',
  },
  {
    key: 'socialBadges',
    title: 'Social Badges',
    description: 'Clickable badges for website, LinkedIn, X, email, and more.',
  },
  {
    key: 'githubStats',
    title: 'GitHub Stats',
    description: 'GitHub stats card with icons and theme options.',
  },
  {
    key: 'topLanguages',
    title: 'Top Languages',
    description: 'Most used languages card from GitHub Readme Stats.',
  },
  {
    key: 'streakStats',
    title: 'Streak Stats',
    description: 'Contribution streak card.',
  },
  {
    key: 'trophy',
    title: 'GitHub Trophy',
    description: 'Achievement trophy row for your profile.',
  },
  {
    key: 'quote',
    title: 'Dev Quote',
    description: 'Random developer quote card.',
  },
  {
    key: 'devJoke',
    title: 'Dev Joke',
    description: 'Random developer joke card.',
  },
];

function FormSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: Array<string | number | { label: string; value: string | number }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
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
    </label>
  );
}

function PluginToggle({
  enabled,
  title,
  description,
  onToggle,
}: {
  enabled: boolean;
  title: string;
  description: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
        enabled
          ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-bold">{title}</div>
        <div
          className={`h-6 w-11 rounded-full p-1 transition ${
            enabled ? 'bg-cyan-400' : 'bg-slate-700'
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white transition ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-300">{description}</p>
    </button>
  );
}

export default function Home() {
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const markdown = useMemo(() => generateMarkdown(form), [form]);

  const updateField = (key: EditableProfileField, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updatePlugin = <K extends PluginKey>(
    plugin: K,
    value: Partial<ProfileForm['plugins'][K]>,
  ) => {
    setForm((current) => ({
      ...current,
      plugins: {
        ...current.plugins,
        [plugin]: {
          ...current.plugins[plugin],
          ...value,
        },
      },
    }));
  };

  const togglePlugin = (plugin: PluginKey) => {
    updatePlugin(plugin, { enabled: !form.plugins[plugin].enabled });
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    toast.success('Markdown copied. Paste it into your GitHub profile README.');
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#070713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#ff4ecd33,transparent_30%),radial-gradient(circle_at_top_right,#00d9ff2e,transparent_28%),radial-gradient(circle_at_bottom,#7c3aed24,transparent_35%)]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">
              <Sparkles size={16} />
              Anime / Cyberpunk GitHub README Generator
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              GitHub Profile <span className="neon-text">Styler</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Generate a beautiful GitHub profile README with selectable plugins,
              badge styles, anime counters, stats cards, typing SVG, and live
              preview.
            </p>
          </div>

          <a
            href="https://github.com/allifiz/github-profile-styler"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <ExternalLink size={20} />
            Star on GitHub
          </a>
        </header>

        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="grid min-w-0 gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Wand2 className="text-fuchsia-300" size={22} />
                <h2 className="text-xl font-bold">Customize Profile</h2>
              </div>

              <div className="mb-6 grid gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Palette size={16} /> Theme
                </p>
                <div className="grid gap-3">
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
                        <p className="mt-1 text-sm text-slate-300">
                          {theme.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4">
                <FormSelect
                  label="Badge style"
                  value={form.badgeStyle}
                  options={badgeStyles}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      badgeStyle: value as BadgeStyle,
                    }))
                  }
                />

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Badge color
                  </span>
                  <input
                    value={form.badgeColor}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        badgeColor: event.target.value,
                      }))
                    }
                    placeholder="111827"
                    className="input"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Logo color
                  </span>
                  <input
                    value={form.logoColor}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        logoColor: event.target.value,
                      }))
                    }
                    placeholder="white"
                    className="input"
                  />
                </label>

                {fields.map((field) => (
                  <label key={field.key} className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-200">
                      {field.label}
                    </span>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={form[field.key]}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                        placeholder={field.placeholder}
                        rows={field.key === 'bio' ? 4 : 3}
                        className="input min-h-24 resize-y"
                      />
                    ) : (
                      <input
                        value={form[field.key]}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                        placeholder={field.placeholder}
                        className="input"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <Plug className="text-cyan-300" size={22} />
                <h2 className="text-xl font-bold">Plugins</h2>
              </div>

              <div className="grid gap-3">
                {pluginLabels.map((plugin) => (
                  <PluginToggle
                    key={plugin.key}
                    enabled={form.plugins[plugin.key].enabled}
                    title={plugin.title}
                    description={plugin.description}
                    onToggle={() => togglePlugin(plugin.key)}
                  />
                ))}
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="font-bold text-cyan-100">Plugin Settings</h3>

                <FormSelect
                  label="Visitor provider"
                  value={form.plugins.visitorCounter.provider}
                  options={visitorProviders}
                  onChange={(value) =>
                    updatePlugin('visitorCounter', {
                      provider: value as VisitorProvider,
                    })
                  }
                />

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Anime counter theme
                  </span>
                  <input
                    value={form.plugins.visitorCounter.animeTheme}
                    onChange={(event) =>
                      updatePlugin('visitorCounter', {
                        animeTheme: event.target.value,
                      })
                    }
                    placeholder="rule34"
                    className="input"
                  />
                </label>

                <FormSelect
                  label="Stats theme"
                  value={form.plugins.githubStats.theme}
                  options={statsThemes}
                  onChange={(value) =>
                    updatePlugin('githubStats', { theme: value as StatsTheme })
                  }
                />

                <FormSelect
                  label="Top languages layout"
                  value={form.plugins.topLanguages.layout}
                  options={['compact', 'normal', 'donut']}
                  onChange={(value) =>
                    updatePlugin('topLanguages', {
                      layout: value as ProfileForm['plugins']['topLanguages']['layout'],
                    })
                  }
                />

                <FormSelect
                  label="Trophy theme"
                  value={form.plugins.trophy.theme}
                  options={statsThemes}
                  onChange={(value) =>
                    updatePlugin('trophy', { theme: value as StatsTheme })
                  }
                />

                <FormSelect
                  label="Trophy columns"
                  value={form.plugins.trophy.columns}
                  options={[3, 4, 5, 6, 7, 8]}
                  onChange={(value) =>
                    updatePlugin('trophy', { columns: Number(value) })
                  }
                />

                <FormSelect
                  label="Quote type"
                  value={form.plugins.quote.type}
                  options={['horizontal', 'vertical']}
                  onChange={(value) =>
                    updatePlugin('quote', {
                      type: value as ProfileForm['plugins']['quote']['type'],
                    })
                  }
                />

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Typing SVG font
                  </span>
                  <input
                    value={form.plugins.typingSvg.font}
                    onChange={(event) =>
                      updatePlugin('typingSvg', { font: event.target.value })
                    }
                    placeholder="Fira Code"
                    className="input"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Typing SVG color
                  </span>
                  <input
                    value={form.plugins.typingSvg.color}
                    onChange={(event) =>
                      updatePlugin('typingSvg', { color: event.target.value })
                    }
                    placeholder="ff4ecd"
                    className="input"
                  />
                </label>
              </div>
            </div>
          </aside>

          <section className="grid min-w-0 gap-6">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold">Live Preview</h2>
                  <p className="text-sm text-slate-300">
                    Preview how your README will roughly look on GitHub.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:bg-fuchsia-400"
                >
                  <Copy size={18} />
                  Copy Markdown
                </button>
              </div>

              <article className="preview min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
              </article>
            </div>

            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d1f] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Generated Markdown</h2>
                  <p className="text-sm text-slate-300">
                    Copy this into <code>README.md</code> inside your GitHub
                    profile repository.
                  </p>
                </div>
              </div>
              <pre className="max-h-[520px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-slate-200">
                <code>{markdown}</code>
              </pre>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
