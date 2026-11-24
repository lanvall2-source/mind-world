import React from 'react';
import { DiaryIllustrationData, MindType } from '../lib/mindStore';

interface DiaryIllustrationSvgProps {
  illustration: DiaryIllustrationData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DiaryIllustrationSvg: React.FC<DiaryIllustrationSvgProps> = ({
  illustration,
  className = '',
}) => {
  const { backgroundId, primaryObject, primaryState, lighting, weather, seed } = illustration;

  // Determine emotional color palette
  const getPalette = (emotion: MindType | 'relieved' | 'neutral') => {
    switch (emotion) {
      case 'peaceful':
        return {
          primary: '#5B7B4B',
          soft: '#EAF0E6',
          tint: '#8CA374',
          accent: '#A9C594',
          wash: '#F3F7F0',
          sky: '#EBF3E8',
        };
      case 'flutter':
        return {
          primary: '#E07A5F',
          soft: '#FDF0EC',
          tint: '#F4A261',
          accent: '#E76F51',
          wash: '#FCF5EE',
          sky: '#FDEEE9',
        };
      case 'tired':
        return {
          primary: '#4A5568',
          soft: '#EDF2F7',
          tint: '#718096',
          accent: '#D69E2E', // Warm lantern glow in the cool slate
          wash: '#F7FAFC',
          sky: '#E2E8F0',
        };
      case 'complex':
        return {
          primary: '#554D69',
          soft: '#F2F0F7',
          tint: '#786F91',
          accent: '#9B90B8',
          wash: '#F8F7FA',
          sky: '#EBE8F3',
        };
      case 'relieved':
        return {
          primary: '#3182CE',
          soft: '#EBF8FF',
          tint: '#63B3ED',
          accent: '#90CDF4',
          wash: '#F0F9FF',
          sky: '#E6F6FF',
        };
      default:
        return {
          primary: '#4A5568',
          soft: '#F7FAFC',
          tint: '#A0AEC0',
          accent: '#CBD5E0',
          wash: '#FFFFFF',
          sky: '#F7FAFC',
        };
    }
  };

  const palette = getPalette(lighting);
  const isNight = weather === 'night';
  const isSunny = weather === 'sunny';
  const isRainy = weather === 'rainy';

  const viewBox = '0 0 320 220';

  return (
    <div
      className={`relative select-none overflow-hidden rounded-2xl border border-island-border/70 shadow-sm bg-[#FAF8F5] ${className}`}
      style={{
        aspectRatio: '16/11',
      }}
    >
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        <defs>
          {/* Paper texture background */}
          <linearGradient id={`paperGrad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#F5F2EB" />
          </linearGradient>

          {/* Emotional watercolor wash gradient */}
          <linearGradient id={`emotionWash-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.wash} stopOpacity="0.9" />
            <stop offset="50%" stopColor={palette.soft} stopOpacity="0.7" />
            <stop offset="100%" stopColor={palette.tint} stopOpacity="0.15" />
          </linearGradient>

          {/* Window / Sky gradient */}
          <linearGradient id={`skyGrad-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {isNight ? (
              <>
                <stop offset="0%" stopColor="#1A202C" />
                <stop offset="100%" stopColor="#2D3748" />
              </>
            ) : isSunny ? (
              <>
                <stop offset="0%" stopColor="#FEEBC8" />
                <stop offset="100%" stopColor="#EBF8FF" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={palette.sky} />
                <stop offset="100%" stopColor="#EDF2F7" />
              </>
            )}
          </linearGradient>

          {/* Soft blur for watercolor bleeding */}
          <filter id={`watercolorEdge-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Paper & Emotional Tint */}
        <rect width="320" height="220" fill={`url(#paperGrad-${seed})`} />
        <rect width="320" height="220" fill={`url(#emotionWash-${seed})`} />

        {/* ======================================================== */}
        {/* CASE A: ROOM (창가와 작은 테이블) */}
        {/* ======================================================== */}
        {backgroundId === 'room' && (
          <g>
            {/* Wall background */}
            <rect x="0" y="0" width="320" height="155" fill={palette.soft} opacity="0.4" />
            {/* Wooden Baseboard & Floor */}
            <rect x="0" y="155" width="320" height="65" fill="#EADBC8" opacity="0.6" />
            <line x1="0" y1="155" x2="320" y2="155" stroke="#CBB499" strokeWidth="2" />

            {/* Window on Left */}
            <rect x="25" y="20" width="115" height="110" rx="6" fill={`url(#skyGrad-${seed})`} stroke="#B8A48B" strokeWidth="3" />
            {/* Window Pane Lines */}
            <line x1="82" y1="20" x2="82" y2="130" stroke="#B8A48B" strokeWidth="2" />
            <line x1="25" y1="75" x2="140" y2="75" stroke="#B8A48B" strokeWidth="2" />
            {/* Window Sill */}
            <rect x="20" y="128" width="125" height="6" rx="2" fill="#A89278" />

            {/* Curtains */}
            <path d="M 23,20 Q 35,70 23,128 L 18,128 L 18,20 Z" fill="#FFFFFF" opacity="0.75" />
            <path d="M 137,20 Q 125,70 137,128 L 142,128 L 142,20 Z" fill="#FFFFFF" opacity="0.75" />

            {/* Sunbeams if sunny */}
            {isSunny && (
              <polygon points="35,25 140,40 210,180 90,170" fill="#FFFBEB" opacity="0.35" />
            )}

            {/* Cozy Cafe Table on Right/Center */}
            <ellipse cx="215" cy="170" rx="75" ry="32" fill="#D4B996" stroke="#9C7A53" strokeWidth="2" />
            {/* Table leg */}
            <rect x="211" y="170" width="8" height="50" fill="#8A6740" rx="2" />

            {/* Primary Object: Book */}
            {primaryObject === 'book' && (
              <g transform="translate(195, 155)">
                {primaryState === 'open' ? (
                  // Open Book
                  <g>
                    <path d="M -22,-3 C -10,-8 0,-4 0,4 C 0,-4 10,-8 22,-3 L 20,12 C 10,7 0,11 0,16 C 0,11 -10,7 -20,12 Z" fill="#FFFDF8" stroke="#4A3B2C" strokeWidth="1.2" />
                    <line x1="0" y1="4" x2="0" y2="16" stroke="#8C7355" strokeWidth="1.2" />
                    <path d="M -16,1 L -4,3 M -16,5 L -4,7 M 4,3 L 16,1 M 4,7 L 16,5" stroke="#A99B8B" strokeWidth="0.8" />
                  </g>
                ) : (
                  // Closed Book
                  <g>
                    <rect x="-18" y="-4" width="36" height="20" rx="3" fill="#A44A3F" stroke="#3D201A" strokeWidth="1.2" />
                    <rect x="-16" y="-2" width="6" height="16" fill="#FDFBF7" />
                    <line x1="-10" y1="4" x2="15" y2="4" stroke="#FFE3DC" strokeWidth="1.5" />
                  </g>
                )}
              </g>
            )}

            {/* Primary Object: Mug */}
            {primaryObject === 'mug' && (
              <g transform="translate(205, 150)">
                <rect x="-10" y="0" width="20" height="18" rx="3" fill="#FFFFFF" stroke="#4A5568" strokeWidth="1.4" />
                <path d="M 10,4 C 16,4 16,12 10,12" fill="none" stroke="#4A5568" strokeWidth="1.4" />
                {/* Steam curls */}
                <path d="M -3,-3 Q -6,-8 -2,-13" fill="none" stroke="#A0AEC0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                <path d="M 3,-2 Q 0,-7 4,-12" fill="none" stroke="#A0AEC0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </g>
            )}

            {/* Primary Object: Lamp */}
            {primaryObject === 'lamp' && (
              <g transform="translate(245, 130)">
                <ellipse cx="0" cy="28" rx="10" ry="3" fill="#A0AEC0" />
                <line x1="0" y1="28" x2="0" y2="5" stroke="#718096" strokeWidth="2" />
                <polygon points="-12,5 12,5 7,-10 -7,-10" fill="#ECC94B" stroke="#D69E2E" strokeWidth="1.2" />
                {/* Glow */}
                <circle cx="0" cy="8" r="18" fill="#FEFCBF" opacity="0.4" />
              </g>
            )}

            {/* Secondary: Mug beside book */}
            {primaryObject === 'book' && (
              <g transform="translate(248, 155)">
                <rect x="-6" y="0" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#4A5568" strokeWidth="1" />
                <path d="M 6,3 C 9,3 9,8 6,8" fill="none" stroke="#4A5568" strokeWidth="1" />
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* CASE B: ENTRANCE (현관과 문턱) */}
        {/* ======================================================== */}
        {backgroundId === 'entrance' && (
          <g>
            {/* Wall */}
            <rect x="0" y="0" width="320" height="135" fill="#E8DFD1" opacity="0.6" />
            {/* Open Doorway on Left */}
            <rect x="40" y="15" width="85" height="120" fill="#FFFDF5" stroke="#9C8B73" strokeWidth="3" />
            {/* Open Door Leaf angled back */}
            <polygon points="125,15 155,25 155,135 125,135" fill="#C2B299" stroke="#786851" strokeWidth="1.5" />
            <circle cx="150" cy="80" r="2.5" fill="#5C4D38" />

            {/* Light spill from doorway */}
            <polygon points="40,135 125,135 180,220 10,220" fill="#FEFCBF" opacity="0.25" />

            {/* Raised Wooden Threshold (문턱) */}
            <rect x="0" y="135" width="320" height="16" fill="#8C6D46" stroke="#5C4223" strokeWidth="1.5" />
            {/* Entrance Tile Floor */}
            <rect x="0" y="151" width="320" height="69" fill="#D3C9BC" />
            {/* Tile grid lines */}
            <line x1="100" y1="151" x2="80" y2="220" stroke="#B8ABA0" strokeWidth="1" />
            <line x1="200" y1="151" x2="190" y2="220" stroke="#B8ABA0" strokeWidth="1" />
            {/* Welcome Mat */}
            <rect x="110" y="165" width="100" height="42" rx="4" fill="#A89276" stroke="#735E44" strokeWidth="1.5" />

            {/* Primary: Dog */}
            {primaryObject === 'dog' && (
              <g transform="translate(160, 162)">
                {primaryState === 'running' ? (
                  // Dog Running excitedly / greeting
                  <g>
                    <ellipse cx="0" cy="0" rx="14" ry="9" fill="#E28743" stroke="#874314" strokeWidth="1.2" />
                    {/* Head */}
                    <circle cx="-11" cy="-7" r="7" fill="#E28743" stroke="#874314" strokeWidth="1.2" />
                    {/* Ear */}
                    <ellipse cx="-13" cy="-11" rx="2.5" ry="5" fill="#A85215" />
                    {/* Snout & Nose */}
                    <ellipse cx="-16" cy="-6" rx="3" ry="2" fill="#F8D3B3" />
                    <circle cx="-18" cy="-7" r="1.2" fill="#2D1A0E" />
                    {/* Wagging Tail */}
                    <path d="M 12,-3 Q 18,-10 22,-8" fill="none" stroke="#E28743" strokeWidth="3" strokeLinecap="round" />
                    {/* Paws */}
                    <rect x="-8" y="7" width="3" height="7" rx="1" fill="#E28743" />
                    <rect x="6" y="7" width="3" height="7" rx="1" fill="#E28743" />
                    {/* Sparkles of excitement */}
                    <text x="18" y="-12" fontSize="11" fill="#E28743">✨</text>
                  </g>
                ) : (
                  // Dog Sleeping curled up
                  <g>
                    <ellipse cx="0" cy="4" rx="15" ry="9" fill="#E28743" stroke="#874314" strokeWidth="1.2" />
                    <circle cx="-9" cy="4" r="6" fill="#E28743" />
                    <ellipse cx="-10" cy="1" rx="2" ry="4" fill="#A85215" />
                    <text x="14" y="0" fontSize="10" fill="#718096">zzz</text>
                  </g>
                )}
              </g>
            )}

            {/* Primary: Umbrella */}
            {primaryObject === 'umbrella' && (
              <g transform="translate(65, 140)">
                {primaryState === 'folded' ? (
                  // Folded umbrella leaning on wall
                  <g transform="rotate(18)">
                    <rect x="-2" y="-45" width="4" height="48" rx="2" fill="#2B6CB0" stroke="#1A365D" strokeWidth="1" />
                    {/* Curved handle */}
                    <path d="M 0,-45 C -6,-45 -6,-55 0,-55" fill="none" stroke="#744210" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="0,3 -2,10 2,10" fill="#718096" />
                  </g>
                ) : (
                  // Open umbrella
                  <g>
                    <path d="M -22,-15 Q 0,-32 22,-15 Z" fill="#3182CE" stroke="#1A365D" strokeWidth="1.2" />
                    <line x1="0" y1="-24" x2="0" y2="8" stroke="#744210" strokeWidth="1.8" />
                  </g>
                )}
              </g>
            )}

            {/* Shoes in foreground */}
            <g transform="translate(235, 185)">
              <ellipse cx="-8" cy="0" rx="7" ry="12" fill="#4A5568" stroke="#2D3748" strokeWidth="1" />
              <ellipse cx="8" cy="0" rx="7" ry="12" fill="#4A5568" stroke="#2D3748" strokeWidth="1" />
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* CASE C: TRANSIT (대중교통 - 큰 차창과 좌석) */}
        {/* ======================================================== */}
        {backgroundId === 'transit' && (
          <g>
            {/* Bus Interior Wall */}
            <rect x="0" y="0" width="320" height="220" fill="#E2E8F0" />
            {/* Ceiling panel line */}
            <line x1="0" y1="28" x2="320" y2="28" stroke="#CBD5E0" strokeWidth="2" />

            {/* Big Transit Window */}
            <rect x="25" y="32" width="270" height="110" rx="8" fill={`url(#skyGrad-${seed})`} stroke="#A0AEC0" strokeWidth="4" />

            {/* Outside scenery through window (buildings, trees, road horizon) */}
            <g opacity="0.45">
              <rect x="40" y="80" width="30" height="60" fill="#A0AEC0" />
              <rect x="80" y="65" width="45" height="75" fill="#718096" />
              <rect x="140" y="90" width="25" height="50" fill="#A0AEC0" />
              <circle cx="210" cy="110" r="18" fill="#68D391" />
              <circle cx="245" cy="115" r="14" fill="#48BB78" />
              <line x1="25" y1="125" x2="295" y2="125" stroke="#CBD5E0" strokeWidth="2" />
            </g>

            {/* Raindrops on window if rainy */}
            {isRainy && (
              <g stroke="#CBD5E0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
                <line x1="60" y1="45" x2="52" y2="65" />
                <line x1="120" y1="55" x2="114" y2="80" />
                <line x1="180" y1="40" x2="175" y2="60" />
                <line x1="230" y1="70" x2="222" y2="95" />
              </g>
            )}

            {/* Window frame division */}
            <line x1="160" y1="32" x2="160" y2="142" stroke="#A0AEC0" strokeWidth="3" />

            {/* Overhead Handrail Bar */}
            <line x1="0" y1="22" x2="320" y2="22" stroke="#718096" strokeWidth="3" />
            {/* Hanging Hand Straps */}
            <g transform="translate(85, 22)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#4A5568" strokeWidth="1.8" />
              <circle cx="0" cy="24" r="6" fill="none" stroke="#ECC94B" strokeWidth="2.5" />
            </g>
            <g transform="translate(170, 22)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#4A5568" strokeWidth="1.8" />
              <circle cx="0" cy="24" r="6" fill="none" stroke="#ECC94B" strokeWidth="2.5" />
            </g>
            <g transform="translate(255, 22)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#4A5568" strokeWidth="1.8" />
              <circle cx="0" cy="24" r="6" fill="none" stroke="#ECC94B" strokeWidth="2.5" />
            </g>

            {/* Bus Seat in Lower Foreground */}
            <path
              d="M 50,152 
                 L 270,152 
                 C 275,152 280,158 278,168 
                 L 270,220 
                 L 50,220 
                 C 45,220 42,168 50,152 Z"
              fill={palette.primary}
              opacity="0.85"
            />
            {/* Seat Back Cushion Top Edge */}
            <rect x="46" y="146" width="228" height="12" rx="4" fill={palette.tint} stroke={palette.primary} strokeWidth="1.5" />

            {/* Earphone if mentioned */}
            {primaryObject === 'earphone' && (
              <g transform="translate(190, 140)">
                <path d="M 0,0 Q 15,20 30,10 T 50,30" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" stroke="#4A5568" strokeWidth="1" />
                <circle cx="50" cy="30" r="2.5" fill="#FFFFFF" stroke="#4A5568" strokeWidth="1" />
              </g>
            )}

            {/* Bag on Seat */}
            {(primaryObject === 'bag' || primaryObject === 'seat_window') && (
              <g transform="translate(195, 168)">
                <rect x="-14" y="-8" width="28" height="26" rx="4" fill="#8C7456" stroke="#4A3B2C" strokeWidth="1.2" />
                <path d="M -6,-8 Q 0,-16 6,-8" fill="none" stroke="#4A3B2C" strokeWidth="1.5" />
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* CASE D: STREET / PARK (거리·공원 - 굽은 길과 벤치) */}
        {/* ======================================================== */}
        {backgroundId === 'street_park' && (
          <g>
            {/* Sky */}
            <rect x="0" y="0" width="320" height="110" fill={`url(#skyGrad-${seed})`} />
            {/* Distant Hills / Tree line */}
            <path d="M 0,90 Q 90,65 180,80 T 320,70 L 320,110 L 0,110 Z" fill="#9CB88D" opacity="0.6" />

            {/* Lush Park Grass Ground */}
            <rect x="0" y="100" width="320" height="120" fill="#7CA068" />

            {/* Curving Pathway (굽은 길) */}
            <path
              d="M 120,100 
                 C 140,130 190,140 200,165 
                 C 210,190 240,205 270,220 
                 L 200,220 
                 C 160,200 135,175 125,150 
                 C 115,130 100,115 95,100 Z"
              fill="#E5D6BD"
              stroke="#B39E82"
              strokeWidth="1.5"
            />

            {/* Large Park Tree on Left */}
            <ellipse cx="65" cy="155" rx="30" ry="10" fill="#4B633E" opacity="0.25" />
            <path d="M 62,155 C 62,130 58,115 54,100 C 60,110 68,105 72,100 C 68,118 68,135 70,155 Z" fill="#6B5034" />
            <circle cx="50" cy="85" r="24" fill="#527A40" />
            <circle cx="78" cy="80" r="26" fill="#608C4C" />
            <circle cx="62" cy="62" r="28" fill="#71A15A" />

            {/* Streetlight on Right */}
            <g transform="translate(235, 105)">
              <line x1="0" y1="50" x2="0" y2="0" stroke="#3A4048" strokeWidth="2" />
              <path d="M 0,0 C 8,-5 12,-12 10,-18 L -4,-18" fill="none" stroke="#3A4048" strokeWidth="2" />
              <polygon points="6,-18 14,-18 12,-12 8,-12" fill="#ECC94B" />
              {isNight && (
                <circle cx="10" cy="-14" r="16" fill="#FEFCBF" opacity="0.35" />
              )}
            </g>

            {/* Wooden Park Bench */}
            <g transform="translate(130, 142)">
              {/* Bench Legs */}
              <line x1="0" y1="12" x2="0" y2="24" stroke="#2D3748" strokeWidth="2" />
              <line x1="32" y1="12" x2="32" y2="24" stroke="#2D3748" strokeWidth="2" />
              {/* Seat Slats */}
              <rect x="-4" y="10" width="40" height="5" rx="1.5" fill="#A86C3E" stroke="#5C3B1E" strokeWidth="1" />
              {/* Backrest Slats */}
              <rect x="-3" y="1" width="38" height="5" rx="1.5" fill="#BD7E4C" stroke="#5C3B1E" strokeWidth="1" />

              {/* Someone resting on bench if seated */}
              {primaryState === 'seated' && (
                <circle cx="16" cy="-4" r="6" fill="#F6AD55" opacity="0.8" />
              )}
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* CASE E: WORKPLACE / DESK (일터·책상 - 비스듬히 내려다본 작업대) */}
        {/* ======================================================== */}
        {backgroundId === 'desk' && (
          <g>
            {/* Wooden Desk Surface */}
            <polygon points="0,0 320,0 320,220 0,220" fill="#E6DAC8" />
            {/* Subtle wood planks / shadows */}
            <line x1="0" y1="75" x2="320" y2="75" stroke="#D3C3AD" strokeWidth="1.5" />
            <line x1="0" y1="150" x2="320" y2="150" stroke="#D3C3AD" strokeWidth="1.5" />

            {/* Leather Desk Mat */}
            <rect x="35" y="30" width="250" height="155" rx="8" fill="#4A5568" opacity="0.75" />

            {/* Coffee Mug on Top Right of Desk */}
            <g transform="translate(245, 55)">
              <ellipse cx="0" cy="14" rx="9" ry="4" fill="#2D3748" opacity="0.3" />
              <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#2D3748" strokeWidth="1.4" />
              <circle cx="0" cy="0" r="9" fill="#7B341E" />
            </g>

            {/* Primary Object: Laptop */}
            {primaryObject === 'laptop' && (
              <g transform="translate(100, 60)">
                {primaryState === 'open' ? (
                  // Open Laptop
                  <g>
                    {/* Screen upright */}
                    <rect x="0" y="0" width="85" height="55" rx="4" fill="#1A202C" stroke="#718096" strokeWidth="1.5" />
                    {/* Glowing Display */}
                    <rect x="4" y="4" width="77" height="47" rx="2" fill="#EBF8FF" opacity="0.9" />
                    <rect x="12" y="12" width="40" height="4" rx="1" fill="#90CDF4" />
                    <rect x="12" y="20" width="55" height="3" rx="1" fill="#CBD5E0" />
                    <rect x="12" y="26" width="48" height="3" rx="1" fill="#CBD5E0" />
                    {/* Keyboard base (lying flat) */}
                    <polygon points="-4,55 89,55 96,85 -11,85" fill="#A0AEC0" stroke="#4A5568" strokeWidth="1.5" />
                    <polygon points="1,58 84,58 89,75 -4,75" fill="#4A5568" opacity="0.6" />
                    <rect x="34" y="77" width="20" height="6" rx="1" fill="#E2E8F0" />
                  </g>
                ) : (
                  // Closed Laptop
                  <g transform="translate(10, 20)">
                    <rect x="0" y="0" width="80" height="55" rx="4" fill="#718096" stroke="#2D3748" strokeWidth="1.5" />
                    <circle cx="40" cy="27" r="4" fill="#E2E8F0" opacity="0.7" />
                  </g>
                )}
              </g>
            )}

            {/* Primary Object: Notebook & Pen */}
            {primaryObject === 'notebook' && (
              <g transform="translate(90, 50)">
                {/* Notebook */}
                <rect x="0" y="0" width="95" height="70" rx="3" fill="#FFFDF8" stroke="#4A5568" strokeWidth="1.5" />
                <line x1="47" y1="0" x2="47" y2="70" stroke="#CBD5E0" strokeWidth="1.5" />
                {/* Ruled lines */}
                <line x1="8" y1="15" x2="40" y2="15" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="8" y1="25" x2="40" y2="25" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="54" y1="15" x2="86" y2="15" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="54" y1="25" x2="86" y2="25" stroke="#E2E8F0" strokeWidth="1" />
                {/* Pen lying across */}
                <g transform="translate(65, 30) rotate(-25)">
                  <rect x="-2" y="-20" width="4" height="40" rx="1.5" fill="#3182CE" stroke="#1A365D" strokeWidth="0.8" />
                  <polygon points="-2,20 2,20 0,25" fill="#D69E2E" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* CASE F: ABSTRACT WATERCOLOR (감정의 색으로 그린 그림) */}
        {/* ======================================================== */}
        {backgroundId === 'abstract' && (
          <g>
            {/* Flowing Organic Watercolor Blobs */}
            <ellipse cx="160" cy="110" rx="95" ry="65" fill={palette.soft} opacity="0.7" filter={`url(#watercolorEdge-${seed})`} />
            <circle cx="120" cy="95" r="55" fill={palette.tint} opacity="0.35" filter={`url(#watercolorEdge-${seed})`} />
            <circle cx="195" cy="125" r="50" fill={palette.accent} opacity="0.3" filter={`url(#watercolorEdge-${seed})`} />
            <ellipse cx="150" cy="130" rx="70" ry="40" fill={palette.sky} opacity="0.4" filter={`url(#watercolorEdge-${seed})`} />

            {/* Gentle Abstract Contour Pencil Lines */}
            <path
              d="M 60,110 C 90,70 140,80 180,120 S 240,150 270,110"
              fill="none"
              stroke={palette.primary}
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.45"
            />
            <path
              d="M 80,140 C 120,160 170,140 210,95 S 250,75 275,90"
              fill="none"
              stroke={palette.primary}
              strokeWidth="0.8"
              opacity="0.3"
            />

            {/* Sparkles / Gentle Drops */}
            <circle cx="110" cy="65" r="2" fill={palette.primary} opacity="0.6" />
            <circle cx="215" cy="80" r="2.5" fill={palette.accent} opacity="0.6" />
            <circle cx="170" cy="165" r="1.8" fill={palette.tint} opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
