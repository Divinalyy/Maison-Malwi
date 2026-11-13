import React, { useId, useState } from 'react';
import { getShadeById, HAIR_SHADES, TextureId, VisualForm } from '../data/catalog';

interface HairExtensionVisualProps {
  form: VisualForm;
  shadeId: string;
  textureId?: TextureId;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'center' | 'top';
  className?: string;
}

export const HairExtensionVisual: React.FC<HairExtensionVisualProps> = ({
  form,
  shadeId,
  textureId = 'silky-straight',
  imageUrl,
  imageAlt = 'Maison Malwi Hair Extensions',
  imagePosition = 'center',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const shade = getShadeById(shadeId);
  const [imgFailed, setImgFailed] = useState(false);

  if (imageUrl && !imgFailed) {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center bg-[#EFE6DA] overflow-hidden select-none ${className}`}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${
            imagePosition === 'top' ? 'object-top' : 'object-center'
          }`}
        />
      </div>
    );
  }

  if (form === 'sample-ring') {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center bg-[#EFE6DA] overflow-hidden select-none ${className}`}
      >
        <svg viewBox="0 0 360 280" className="w-full h-full" aria-hidden="true">
          <defs>
            <radialGradient id={`pedestal-${uid}`} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FAF5EE" />
              <stop offset="100%" stopColor="#E6DACB" />
            </radialGradient>
            <linearGradient id={`brass-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2C799" />
              <stop offset="50%" stopColor="#A67D4F" />
              <stop offset="100%" stopColor="#7C5932" />
            </linearGradient>
          </defs>
          <rect width="360" height="280" fill={`url(#pedestal-${uid})`} />

          <circle
            cx="180"
            cy="72"
            r="34"
            fill="none"
            stroke={`url(#brass-${uid})`}
            strokeWidth="5"
          />

          {HAIR_SHADES.map((s, idx) => {
            const angle = -32 + idx * 12.8;
            const gradId = `swatch-${uid}-${idx}`;
            return (
              <g key={s.id} transform={`translate(180 76) rotate(${angle})`}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={s.rootColor} />
                    <stop offset="42%" stopColor={s.midColor} />
                    <stop offset="70%" stopColor={s.highlightColor} />
                    <stop offset="100%" stopColor={s.tipColor} />
                  </linearGradient>
                </defs>
                <rect x="-7" y="18" width="14" height="10" rx="2" fill="#C4A67C" />
                <path
                  d="M-6 28 C-9 80, -10 128, -5 164 C-2 169, 2 169, 5 164 C10 128, 9 80, 6 28 Z"
                  fill={`url(#${gradId})`}
                />
                <path
                  d="M-4 64 Q0 60 4 64 L3 78 Q0 75 -3 78 Z"
                  fill={s.sheenColor}
                  opacity="0.32"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const waveOffset =
    textureId === 'body-wave'
      ? 14
      : textureId === 'natural-spiral'
        ? 22
        : textureId === 'yaki-blowout'
          ? 7
          : 2;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center bg-[#EFE6DA] overflow-hidden select-none ${className}`}
    >
      <svg viewBox="0 0 360 320" className="w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id={`bg-${uid}`} cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FAF6F0" />
            <stop offset="100%" stopColor="#E5D8C7" />
          </radialGradient>

          <linearGradient id={`hairMain-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor={shade.rootColor} />
            <stop offset="28%" stopColor={shade.midColor} />
            <stop offset="56%" stopColor={shade.highlightColor} />
            <stop offset="85%" stopColor={shade.midColor} />
            <stop offset="100%" stopColor={shade.tipColor} />
          </linearGradient>

          <linearGradient id={`hairHighlight-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade.rootColor} stopOpacity="0.2" />
            <stop offset="48%" stopColor={shade.highlightColor} stopOpacity="0.85" />
            <stop offset="72%" stopColor={shade.sheenColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={shade.tipColor} stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id={`silkGloss-${uid}`} x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0%" stopColor={shade.sheenColor} stopOpacity="0" />
            <stop offset="45%" stopColor={shade.sheenColor} stopOpacity="0.45" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor={shade.sheenColor} stopOpacity="0" />
          </linearGradient>

          <filter id={`softShadow-${uid}`} x="-15%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#2A1D16" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect width="360" height="320" fill={`url(#bg-${uid})`} />
        <line x1="48" y1="278" x2="312" y2="278" stroke="#D4C5B3" strokeWidth="1" />

        <g filter={`url(#softShadow-${uid})`}>
          <path
            d={`M76 68 C${70 - waveOffset} 135, ${74 + waveOffset} 200, 82 262 C112 271, 146 267, 180 270 C214 267, 248 271, 278 262 C${286 - waveOffset} 200, ${290 + waveOffset} 135, 284 68 Z`}
            fill={`url(#hairMain-${uid})`}
          />
          <path
            d={`M108 68 C${104 - waveOffset * 0.7} 135, ${108 + waveOffset * 0.7} 200, 112 266 L132 266 C${130 + waveOffset * 0.6} 200, ${126 - waveOffset * 0.6} 135, 130 68 Z`}
            fill={`url(#hairHighlight-${uid})`}
          />
          <path
            d={`M166 68 C${162 - waveOffset * 0.6} 135, ${168 + waveOffset * 0.6} 200, 172 268 L192 268 C${190 + waveOffset * 0.6} 200, ${184 - waveOffset * 0.6} 135, 188 68 Z`}
            fill={`url(#hairHighlight-${uid})`}
            opacity="0.85"
          />
          <path
            d={`M226 68 C${224 - waveOffset * 0.7} 135, ${230 + waveOffset * 0.7} 200, 234 266 L252 264 C${250 + waveOffset * 0.6} 200, ${246 - waveOffset * 0.6} 135, 248 68 Z`}
            fill={`url(#hairHighlight-${uid})`}
            opacity="0.7"
          />
          {[96, 122, 148, 178, 208, 238, 264].map((sx, i) => (
            <path
              key={sx}
              d={`M${sx} 72 C${sx - waveOffset * 0.5} 135, ${sx + waveOffset * 0.5} 200, ${sx + (i % 2 === 0 ? 3 : -3)} 264`}
              fill="none"
              stroke={shade.rootColor}
              strokeWidth="0.75"
              opacity="0.35"
            />
          ))}
          <path
            d="M74 138 Q180 118 286 138 L286 158 Q180 138 74 158 Z"
            fill={`url(#silkGloss-${uid})`}
          />
          <rect x="74" y="58" width="212" height="10" rx="2" fill={shade.rootColor} />
          <rect x="74" y="61" width="212" height="2" fill={shade.highlightColor} opacity="0.45" />
        </g>
      </svg>
    </div>
  );
};
