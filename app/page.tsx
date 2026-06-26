'use client';

import { Copy, Github, Palette, Sparkles, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'sonner';
import {
  generateMarkdown,
  ProfileForm,
  ThemeId,
  themes,
} from '@/lib/generate-markdown';

type EditableProfileField = Exclude<keyof ProfileForm, 'theme'>;

const defaultForm: ProfileForm = {
  name: 'Allif Izz',
  username: 'allifiz',
  role: 'Backend Developer',
  bio: 'I build backend services, AI bots, and clean developer tools. Currently exploring open-source projects with anime/cyberpunk vibes.',
  location: 'Indonesia',
  website: 'https://github.com/allifiz',
  twitter: '',
  linkedin: '',
  techStack: 'TypeScript, Node.js, NestJS, PostgreSQL, Prisma, React, Next.js',
  typingLines: 'Backend Developer\nAI Bot Builder\nOpen Source Enjoyer\nAnime Neon Hacker',
  theme: 'anime-neon',
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

export default function Home() {
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const markdown = useMemo(() => generateMarkdown(form), [form]);

  const updateField = (key: EditableProfileField, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
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
              Generate a beautiful GitHub profile README with neon themes,
              badges, GitHub stats, typing SVG, and live preview. No login. No
              config. Just copy and paste.
            </p>
          </div>

          <a
            href="https://github.com/allifiz/github-profile-styler"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <Github size={20} />
            Star on GitHub
          </a>
        </header>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
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
                        setForm((current) => ({ ...current, theme: themeId }))
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
          </aside>

          <section className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
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

              <article className="preview max-w-none rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
              </article>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d0d1f] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Generated Markdown</h2>
                  <p className="text-sm text-slate-300">
                    Copy this into <code>README.md</code> inside your GitHub
                    profile repository.
                  </p>
                </div>
              </div>
              <pre className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-slate-200">
                <code>{markdown}</code>
              </pre>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
