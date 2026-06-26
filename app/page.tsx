'use client';

import { Copy, Download, ExternalLink, GripVertical, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'sonner';
import {
  BadgeStyle,
  City3DTheme,
  defaultPlugins,
  defaultSectionOrder,
  generateMarkdown,
  ProfileForm,
  SectionId,
  StatsTheme,
  ThemeId,
  themes,
  VisitorProvider,
} from '@/lib/generate-markdown';

type TabId = 'profile' | 'skills' | 'design' | 'plugins' | 'advanced';
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
  { id: 'profile', label: '1. Profile', helper: 'Identity and links' },
  { id: 'skills', label: '2. Skills', helper: 'Languages and tools' },
  { id: 'design', label: '3. Design', helper: 'Theme and colors' },
  { id: 'plugins', label: '4. Plugins', helper: 'README sections' },
  { id: 'advanced', label: 'Advanced', helper: 'Fine tuning' },
];

const badgeStyles: BadgeStyle[] = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];
const statsThemes: StatsTheme[] = ['radical', 'tokyonight', 'merko', 'dracula', 'github_dark', 'transparent', 'synthwave', 'gruvbox', 'onedark'];
const typingFonts = ['Fira Code', 'JetBrains Mono', 'Poppins', 'Roboto Mono', 'Source Code Pro', 'Cascadia Code', 'Space Mono', 'Ubuntu Mono'];
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
];
const city3dThemes: Array<{ label: string; value: City3DTheme }> = [
  { label: 'Git Block', value: 'gitblock' },
  { label: 'Green Animate', value: 'green-animate' },
  { label: 'Green', value: 'green' },
  { label: 'Night Green', value: 'night-green' },
  { label: 'Night Rainbow', value: 'night-rainbow' },
  { label: 'Night View', value: 'night-view' },
  { label: 'Season Animate', value: 'season-animate' },
  { label: 'Season', value: 'season' },
  { label: 'South Season Animate', value: 'south-season-animate' },
  { label: 'South Season', value: 'south-season' },
];

const skillGroups = [
  { title: 'Programming Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust', 'Swift'] },
  { title: 'Frontend', skills: ['React', 'Next.js', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'] },
  { title: 'Backend', skills: ['Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Fastify'] },
  { title: 'Database', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma'] },
  { title: 'DevOps & Cloud', skills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Vercel', 'PM2', 'Nginx'] },
  { title: 'Tools', skills: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Vite', 'Linux', 'Bash'] },
];

const popularSkills = ['TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Prisma', 'React', 'Next.js', 'Tailwind CSS'];

const sectionCards: Record<SectionId, { title: string; description: string }> = {
  hero: { title: 'Intro / Hero', description: 'Name, typing animation, counter, and social badges.' },
  about: { title: 'About Me', description: 'Bio, location, and text social links.' },
  techStack: { title: 'Tech Stack', description: 'Generated technology badges.' },
  githubStats: { title: 'GitHub Stats', description: 'Stats card and top languages card.' },
  streakStats: { title: 'Contribution Streak', description: 'GitHub streak card.' },
  trophy: { title: 'GitHub Trophy', description: 'Achievement trophy row.' },
  advancedStats: { title: '3D City Contribution', description: '3D city contribution graph section.' },
  quote: { title: 'Dev Quote', description: 'Random developer quote card.' },
  devJoke: { title: 'Dev Joke', description: 'Random developer joke card.' },
};

const defaultForm: ProfileForm = {
  name: 'Allif Izz',
  username: 'allifiz',
  role: 'Backend Developer',
  bio: 'I build backend services, AI bots, and clean developer tools. Currently exploring open-source projects with cyberpunk vibes.',
  location: 'Indonesia',
  website: 'https://github.com/allifiz',
  twitter: '',
  linkedin: '',
  email: '',
  instagram: '',
  discord: '',
  techStack: popularSkills.join(', '),
  typingLines: 'Backend Developer\nAI Bot Builder\nOpen Source Enjoyer\nCyberpunk Developer',
  theme: 'anime-neon',
  badgeStyle: 'for-the-badge',
  badgeColor: '111827',
  logoColor: 'white',
  sectionOrder: defaultSectionOrder,
  plugins: defaultPlugins,
};

const profileFields: Array<{ key: EditableProfileField; label: string; placeholder: string; textarea?: boolean }> = [
  { key: 'name', label: 'Display name', placeholder: 'Allif Izz' },
  { key: 'username', label: 'GitHub username', placeholder: 'allifiz' },
  { key: 'role', label: 'Role / headline', placeholder: 'Backend Developer' },
  { key: 'bio', label: 'Bio', placeholder: 'Tell people what you build...', textarea: true },
  { key: 'typingLines', label: 'Typing lines', placeholder: 'Backend Developer\nAI Bot Builder', textarea: true },
  { key: 'location', label: 'Location', placeholder: 'Indonesia' },
  { key: 'website', label: 'Website', placeholder: 'https://example.com' },
  { key: 'twitter', label: 'Twitter/X username', placeholder: 'username' },
  { key: 'linkedin', label: 'LinkedIn username', placeholder: 'username' },
  { key: 'instagram', label: 'Instagram username', placeholder: 'username' },
  { key: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { key: 'discord', label: 'Discord tag', placeholder: 'username#0001' },
];

const pluginCards = [
  { key: 'typingSvg', title: 'Typing SVG', description: 'Animated intro below your name.' },
  { key: 'visitorCounter', title: 'Visitor Counter', description: 'Profile visitor counter.' },
  { key: 'socialBadges', title: 'Social Badges', description: 'Clickable badge links.' },
  { key: 'githubStats', title: 'GitHub Stats', description: 'Stats summary card.' },
  { key: 'topLanguages', title: 'Top Languages', description: 'Language usage card.' },
  { key: 'streakStats', title: 'Streak Stats', description: 'Contribution streak card.' },
  { key: 'trophy', title: 'GitHub Trophy', description: 'Achievement trophy row.' },
  { key: 'quote', title: 'Dev Quote', description: 'Random quote card.' },
  { key: 'devJoke', title: 'Dev Joke', description: 'Random developer joke.' },
] as const;

const parseSkills = (value: string) => value.split(',').map((skill) => skill.trim()).filter(Boolean);
const normalizeHex = (value: string) => value.replace('#', '').slice(0, 6);
const toPickerColor = (value: string, fallback: string) => {
  const cleanValue = normalizeHex(value);
  const cleanFallback = normalizeHex(fallback);
  const hex = /^[0-9a-fA-F]{6}$/.test(cleanValue) ? cleanValue : cleanFallback;
  return `#${hex}`;
};

function PanelHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-200/80">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

function FormInput({ label, value, placeholder, textarea, onChange }: { label: string; value: string; placeholder: string; textarea?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className="input min-h-24 resize-y" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input" />
      )}
    </label>
  );
}

function FormSelect({ label, value, options, onChange }: { label: string; value: string | number; options: Array<string | number | { label: string; value: string | number }>; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input cursor-pointer">
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          return <option key={String(optionValue)} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
    </label>
  );
}

function ColorInput({ label, value, fallback, onChange }: { label: string; value: string; fallback: string; onChange: (value: string) => void }) {
  const pickerValue = toPickerColor(value, fallback);
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
        <input type="color" value={pickerValue} onChange={(event) => onChange(event.target.value.replace('#', ''))} className="h-11 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1" />
        <div className="font-mono text-sm font-bold text-white">{pickerValue}</div>
      </div>
    </label>
  );
}

function ToggleCard({ enabled, title, description, badge, onToggle }: { enabled: boolean; title: string; description: string; badge?: string; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${enabled ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black">{title}</h3>
            {badge ? <span className="rounded-full bg-fuchsia-400/15 px-2 py-0.5 text-[11px] font-bold text-fuchsia-100">{badge}</span> : null}
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-300">{description}</p>
        </div>
        <div className={`mt-1 h-6 w-11 shrink-0 rounded-full p-1 transition ${enabled ? 'bg-cyan-400' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
          <div className={`h-4 w-4 rounded-full bg-white transition ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [draggingSection, setDraggingSection] = useState<SectionId | null>(null);
  const markdown = useMemo(() => generateMarkdown(form), [form]);
  const selectedSkills = useMemo(() => parseSkills(form.techStack), [form.techStack]);
  const selectedTheme = themes[form.theme];

  const updateField = (key: EditableProfileField, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const updatePlugin = <K extends keyof ProfileForm['plugins']>(plugin: K, value: Partial<ProfileForm['plugins'][K]>) => setForm((current) => ({ ...current, plugins: { ...current.plugins, [plugin]: { ...current.plugins[plugin], ...value } } }));
  const toggleSkill = (skill: string) => setForm((current) => {
    const skills = parseSkills(current.techStack);
    const nextSkills = skills.includes(skill) ? skills.filter((item) => item !== skill) : [...skills, skill];
    return { ...current, techStack: nextSkills.join(', ') };
  });
  const moveSection = (fromSection: SectionId, toSection: SectionId) => setForm((current) => {
    if (fromSection === toSection) return current;
    const nextOrder = [...current.sectionOrder];
    const fromIndex = nextOrder.indexOf(fromSection);
    const toIndex = nextOrder.indexOf(toSection);
    if (fromIndex === -1 || toIndex === -1) return current;
    const [removed] = nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, removed);
    return { ...current, sectionOrder: nextOrder };
  });
  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    toast.success('Markdown copied. Paste it into your GitHub profile README.');
  };
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('README.md downloaded.');
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#070713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#ff4ecd33,transparent_30%),radial-gradient(circle_at_top_right,#00d9ff2e,transparent_28%),radial-gradient(circle_at_bottom,#7c3aed24,transparent_35%)]" />
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100"><Sparkles size={16} />Interactive GitHub README builder</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">GitHub Profile <span className="neon-text">Styler</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Build a profile README like a visual editor: fill profile info, pick skills, choose plugins, reorder sections, then copy or download README.md.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:min-w-72 md:grid-cols-1">
              <button type="button" onClick={copyMarkdown} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:bg-fuchsia-400"><Copy size={18} />Copy Markdown</button>
              <button type="button" onClick={downloadMarkdown} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-400/15"><Download size={18} />Download README.md</button>
              <a href="https://github.com/allifiz/github-profile-styler" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/15 sm:col-span-2 md:col-span-1"><ExternalLink size={18} />Star on GitHub</a>
            </div>
          </div>
        </header>
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur">
            <div className="border-b border-white/10 p-4">
              <div className="mb-4 flex items-center gap-2"><div><h2 className="text-xl font-black">Editor</h2><p className="text-sm text-slate-400">Build your README step by step.</p></div></div>
              <div className="grid gap-2">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-2xl border p-3 text-left transition ${activeTab === tab.id ? 'border-fuchsia-300 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}><div className="font-bold">{tab.label}</div><p className="text-xs text-slate-400">{tab.helper}</p></button>)}</div>
            </div>
            <div className="max-h-none overflow-auto p-5 lg:max-h-[calc(100vh-220px)]">
              {activeTab === 'profile' ? <div className="grid gap-5"><PanelHeader eyebrow="Profile essentials" title="Tell people who you are" description="Fill the basic profile fields. Social links are optional." />{profileFields.map((field) => <FormInput key={field.key} label={field.label} value={form[field.key]} placeholder={field.placeholder} textarea={field.textarea} onChange={(value) => updateField(field.key, value)} />)}</div> : null}
              {activeTab === 'skills' ? <div className="grid gap-5"><PanelHeader eyebrow="Languages and tools" title="Pick your stack" description="Click skills to add or remove them. You can also edit the raw list." /><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="font-black">Selected skills</h3><p className="text-xs text-slate-400">{selectedSkills.length} selected</p></div><button type="button" onClick={() => updateField('techStack', popularSkills.join(', '))} className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100">Use popular</button></div><textarea value={form.techStack} onChange={(event) => updateField('techStack', event.target.value)} rows={3} className="input min-h-24 resize-y" /></div>{skillGroups.map((group) => <div key={group.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><h3 className="mb-3 font-black">{group.title}</h3><div className="flex flex-wrap gap-2">{group.skills.map((skill) => { const selected = selectedSkills.includes(skill); return <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`rounded-xl border px-3 py-2 text-sm font-bold ${selected ? 'border-fuchsia-300 bg-fuchsia-400/15 text-fuchsia-50' : 'border-white/10 bg-white/[0.04] text-slate-300'}`}>{selected ? '✓ ' : ''}{skill}</button>; })}</div></div>)}</div> : null}
              {activeTab === 'design' ? <div className="grid gap-5"><PanelHeader eyebrow="Visual style" title="Pick a vibe" description="Choose theme, badge style, and colors." />{(Object.keys(themes) as ThemeId[]).map((themeId) => { const theme = themes[themeId]; return <button key={themeId} type="button" onClick={() => setForm((current) => ({ ...current, theme: themeId, badgeColor: theme.badgeColor, plugins: { ...current.plugins, githubStats: { ...current.plugins.githubStats, theme: theme.readmeTheme }, trophy: { ...current.plugins.trophy, theme: theme.readmeTheme }, typingSvg: { ...current.plugins.typingSvg, color: theme.badgeColor } } }))} className={`rounded-2xl border p-4 text-left ${form.theme === themeId ? 'border-fuchsia-300 bg-fuchsia-400/15' : 'border-white/10 bg-white/[0.03]'}`}><div className="font-bold">{theme.accentEmoji} {theme.label}</div><p className="mt-1 text-sm text-slate-300">{theme.description}</p></button>; })}<FormSelect label="Badge style" value={form.badgeStyle} options={badgeStyles} onChange={(value) => setForm((current) => ({ ...current, badgeStyle: value as BadgeStyle }))} /><ColorInput label="Badge color" value={form.badgeColor} fallback={selectedTheme.badgeColor} onChange={(value) => setForm((current) => ({ ...current, badgeColor: value }))} /><FormInput label="Logo color" value={form.logoColor} placeholder="white" onChange={(value) => setForm((current) => ({ ...current, logoColor: value }))} /></div> : null}
              {activeTab === 'plugins' ? <div className="grid gap-5"><PanelHeader eyebrow="Sections" title="Choose what appears in README" description="Turn on the sections you want." />{pluginCards.map((plugin) => <ToggleCard key={plugin.key} enabled={form.plugins[plugin.key].enabled} title={plugin.title} description={plugin.description} onToggle={() => updatePlugin(plugin.key, { enabled: !form.plugins[plugin.key].enabled })} />)}<div className="grid gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-400/[0.06] p-4"><h3 className="font-black text-cyan-100">Advanced GitHub Statistics</h3><p className="text-sm text-slate-300">Add richer GitHub statistics visuals.</p><ToggleCard enabled={form.plugins.advancedStats.city3d} title="3D City Contribution View" description="Adds a 3D city contribution section. Requires setup in the profile repo." badge="Advanced" onToggle={() => updatePlugin('advancedStats', { city3d: !form.plugins.advancedStats.city3d })} />{form.plugins.advancedStats.city3d ? <FormSelect label="3D City style" value={form.plugins.advancedStats.city3dTheme} options={city3dThemes} onChange={(value) => updatePlugin('advancedStats', { city3dTheme: value as City3DTheme })} /> : null}<a href="https://github.com/yoshi389111/github-profile-3d-contrib" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200"><ExternalLink size={14} /> Watch tutorial / setup 3D workflow</a></div></div> : null}
              {activeTab === 'advanced' ? <div className="grid gap-5"><PanelHeader eyebrow="Optional" title="Fine tune plugin settings" description="Settings for counters, stats, trophy, typing, and quote." /><FormSelect label="Visitor counter provider" value={form.plugins.visitorCounter.provider} options={visitorProviders} onChange={(value) => updatePlugin('visitorCounter', { provider: value as VisitorProvider })} />{form.plugins.visitorCounter.provider === 'anime-counter' ? <FormSelect label="Anime counter theme" value={form.plugins.visitorCounter.animeTheme} options={animeCounterThemes} onChange={(value) => updatePlugin('visitorCounter', { animeTheme: value })} /> : null}<FormSelect label="Stats theme" value={form.plugins.githubStats.theme} options={statsThemes} onChange={(value) => updatePlugin('githubStats', { theme: value as StatsTheme })} /><FormSelect label="Top languages layout" value={form.plugins.topLanguages.layout} options={['compact', 'normal', 'donut']} onChange={(value) => updatePlugin('topLanguages', { layout: value as ProfileForm['plugins']['topLanguages']['layout'] })} /><FormSelect label="Trophy theme" value={form.plugins.trophy.theme} options={statsThemes} onChange={(value) => updatePlugin('trophy', { theme: value as StatsTheme })} /><FormSelect label="Trophy columns" value={form.plugins.trophy.columns} options={[3, 4, 5, 6, 7, 8]} onChange={(value) => updatePlugin('trophy', { columns: Number(value) })} /><FormSelect label="Typing font" value={form.plugins.typingSvg.font} options={typingFonts} onChange={(value) => updatePlugin('typingSvg', { font: value })} /><ColorInput label="Typing color" value={form.plugins.typingSvg.color} fallback={selectedTheme.badgeColor} onChange={(value) => updatePlugin('typingSvg', { color: value })} /><FormSelect label="Quote type" value={form.plugins.quote.type} options={['horizontal', 'vertical']} onChange={(value) => updatePlugin('quote', { type: value as ProfileForm['plugins']['quote']['type'] })} /></div> : null}
            </div>
          </aside>
          <section className="grid min-w-0 gap-6 lg:sticky lg:top-6 lg:self-start">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-black">Preview</h2><p className="text-sm text-slate-300">Drag the section cards below to reorder your README.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={copyMarkdown} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-4 py-3 font-bold text-white"><Copy size={18} />Copy</button><button type="button" onClick={downloadMarkdown} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 font-bold text-cyan-100"><Download size={18} />Raw</button></div></div>
              <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4"><div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h3 className="font-black">Section Order</h3><p className="text-xs text-slate-400">Drag and drop to change markdown order.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, sectionOrder: defaultSectionOrder }))} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200">Reset order</button></div><div className="grid gap-2">{form.sectionOrder.map((sectionId, index) => { const section = sectionCards[sectionId]; const dragging = draggingSection === sectionId; return <div key={sectionId} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', sectionId); setDraggingSection(sectionId); }} onDragEnd={() => setDraggingSection(null)} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }} onDrop={(event) => { event.preventDefault(); const draggedSection = event.dataTransfer.getData('text/plain') as SectionId; moveSection(draggedSection, sectionId); setDraggingSection(null); }} className={`group flex cursor-grab items-center gap-3 rounded-2xl border p-3 ${dragging ? 'border-fuchsia-300 bg-fuchsia-400/20 opacity-60' : 'border-white/10 bg-white/[0.04]'}`}><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-slate-200">{index + 1}</div><GripVertical className="shrink-0 text-slate-400" size={18} /><div className="min-w-0"><div className="font-bold text-white">{section.title}</div><p className="truncate text-xs text-slate-400">{section.description}</p></div></div>; })}</div></div>
              <article className="preview max-h-[620px] min-w-0 max-w-full overflow-auto rounded-2xl border border-white/10 bg-[#0d0d1f] p-5"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown></article>
            </div>
            <details className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d1f] p-5"><summary className="cursor-pointer text-lg font-black">README.md</summary><p className="mt-2 text-sm text-slate-300">Copy or download this raw markdown into your GitHub profile repository.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={copyMarkdown} className="rounded-xl bg-fuchsia-500 px-3 py-2 text-xs font-bold text-white">Copy</button><button type="button" onClick={downloadMarkdown} className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100">Download Raw</button></div><pre className="mt-4 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-slate-200"><code>{markdown}</code></pre></details>
          </section>
        </div>
      </section>
    </main>
  );
}
