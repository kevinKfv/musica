import React from 'react';

type SortMode = 'new' | 'top' | 'hot';

interface SortBarProps {
    sort: SortMode;
    onChange: (sort: SortMode) => void;
}

const SORTS: { key: SortMode; label: string; icon: string }[] = [
    { key: 'hot', label: 'Popular', icon: '🔥' },
    { key: 'new', label: 'Nuevo', icon: '🆕' },
    { key: 'top', label: 'Top', icon: '👑' },
];

export const SortBar: React.FC<SortBarProps> = ({ sort, onChange }) => {
    return (
        <div style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(51,65,85,0.6)',
            borderRadius: 10,
            padding: 4,
            backdropFilter: 'blur(8px)',
        }}>
            {SORTS.map(s => {
                const active = sort === s.key;
                return (
                    <button
                        key={s.key}
                        onClick={() => onChange(s.key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 14px',
                            borderRadius: 7,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: active ? 700 : 500,
                            color: active ? '#fff' : '#94a3b8',
                            background: active ? 'rgba(99,102,241,0.85)' : 'transparent',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)'; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                        <span>{s.icon}</span>
                        {s.label}
                    </button>
                );
            })}
        </div>
    );
};
