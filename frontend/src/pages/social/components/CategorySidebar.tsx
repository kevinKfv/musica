import React from 'react';

const CATEGORIES = [
    { name: 'all', label: '🌐 Todo el foro', desc: '' },
    { name: 'Guitarristas', label: '🎸 Guitarristas', desc: 'Técnica, gear y dudas' },
    { name: 'Bateristas', label: '🥁 Bateristas', desc: 'Kits, técnica y más' },
    { name: 'Productores', label: '🎛 Productores', desc: 'DAW, mezcla y masterización' },
    { name: 'Composición', label: '✍️ Composición', desc: 'Letras, melodías y estructuras' },
    { name: 'Bandas', label: '🎤 Bandas', desc: 'Busco/ofrezco músico' },
    { name: 'Gear', label: '🔧 Gear', desc: 'Pedales, amplis y equipos' },
    { name: 'Teoría Musical', label: '🎼 Teoría', desc: 'Armonía y más' },
    { name: 'Producción', label: '🎚 Producción', desc: 'Studio y live sound' },
    { name: 'General', label: '💬 General', desc: 'Todo lo demás' },
];

const CATEGORY_COLORS: Record<string, string> = {
    'Guitarristas': '#10b981',
    'Bateristas': '#f59e0b',
    'Productores': '#8b5cf6',
    'Composición': '#06b6d4',
    'Bandas': '#ef4444',
    'Gear': '#f97316',
    'Teoría Musical': '#84cc16',
    'Producción': '#a855f7',
    'General': '#6b7280',
    'all': '#6366f1',
};

interface CategorySidebarProps {
    activeCategory: string;
    onSelect: (category: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory, onSelect }) => {
    return (
        <aside style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px 8px' }}>
                Comunidades
            </p>
            {CATEGORIES.map(cat => {
                const active = activeCategory === cat.name;
                const color = CATEGORY_COLORS[cat.name] ?? '#6366f1';
                return (
                    <button
                        key={cat.name}
                        onClick={() => onSelect(cat.name)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            borderRadius: 8,
                            border: active ? `1px solid ${color}40` : '1px solid transparent',
                            cursor: 'pointer',
                            background: active ? `${color}12` : 'transparent',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                            width: '100%',
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.07)'; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                        <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: active ? color : '#475569',
                            flexShrink: 0,
                            transition: 'background 0.15s',
                        }} />
                        <span style={{
                            fontSize: 13,
                            fontWeight: active ? 600 : 400,
                            color: active ? '#e2e8f0' : '#94a3b8',
                        }}>
                            {cat.label}
                        </span>
                    </button>
                );
            })}
        </aside>
    );
};
