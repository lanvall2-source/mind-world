import React from 'react';
import { IslandGrowthState, WalkScene, MindType } from '../lib/mindStore';

interface MindIslandSvgProps {
  growth: IslandGrowthState;
  walkMode: boolean;
  activeScene: WalkScene | null;
  walkStep: 'choosing_path' | 'seeking_object' | 'viewing_scene';
  onObjectClick: (objectKey: 'bench' | 'pond_leaf' | 'flower' | 'pond_sparkle' | 'tree' | 'lotus' | 'trail' | 'stone') => void;
  onInspectPlace: (mind: MindType) => void;
}

export const MindIslandSvg: React.FC<MindIslandSvgProps> = ({
  growth,
  walkMode,
  activeScene,
  walkStep,
  onObjectClick,
  onInspectPlace,
}) => {
  const isSeeking = walkMode && walkStep === 'seeking_object' && activeScene !== null;
  const isViewing = walkMode && walkStep === 'viewing_scene' && activeScene !== null;
  const target = activeScene?.targetObject;

  return (
    <div className="relative w-full aspect-[4/3] max-w-[420px] mx-auto select-none overflow-hidden rounded-3xl bg-[#F7F5EE] border border-island-border/80 shadow-sm">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#F4EFE6" />
          </radialGradient>

          <linearGradient id="islandBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8DA875" />
            <stop offset="60%" stopColor="#6C8A54" />
            <stop offset="100%" stopColor="#557240" />
          </linearGradient>

          <linearGradient id="pondGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#7EAAA6" />
            <stop offset="50%" stopColor="#5E8F8B" />
            <stop offset="100%" stopColor="#4A7571" />
          </linearGradient>

          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B9156" />
            <stop offset="100%" stopColor="#3F622E" />
          </linearGradient>

          <linearGradient id="glowPulse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDE59" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF914D" stopOpacity="0.3" />
          </linearGradient>

          {/* Filter for soft storybook shadow */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3F4D35" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Sky & Ambient Background */}
        <rect width="400" height="300" fill="url(#skyGrad)" />

        {/* Soft background hills */}
        <path d="M-20,120 Q80,85 180,105 T380,95 Q420,110 420,160 L-20,160 Z" fill="#E8E2D3" opacity="0.4" />
        <path d="M0,135 Q100,105 230,125 T420,115 L420,170 L0,170 Z" fill="#DCD5C4" opacity="0.3" />

        {/* Island Shadow */}
        <ellipse cx="200" cy="225" rx="175" ry="58" fill="#424D36" opacity="0.08" />

        {/* 2. Main Grassy Island Base */}
        <path
          d="M 50,195 
             C 45,150 110,130 190,128 
             C 280,126 355,145 352,192 
             C 350,245 285,268 195,270 
             C 105,272 55,240 50,195 Z"
          fill="url(#islandBaseGrad)"
          filter="url(#softShadow)"
        />

        {/* Island grass rim highlight */}
        <path
          d="M 60,188 C 110,138 280,135 342,185"
          fill="none"
          stroke="#A8C490"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 3. Turquoise Pond (물가) */}
        <path
          d="M 195,185 
             C 245,178 305,188 310,215 
             C 315,238 260,254 210,250 
             C 170,246 160,225 175,202 
             C 182,192 188,186 195,185 Z"
          fill="url(#pondGrad)"
        />
        {/* Pond Water Rim */}
        <path
          d="M 195,185 C 245,178 305,188 310,215"
          fill="none"
          stroke="#9CD0CD"
          strokeWidth="2"
          opacity="0.7"
        />
        {/* Soft water ripples */}
        <ellipse cx="240" cy="216" rx="35" ry="12" fill="none" stroke="#A7DCD9" strokeWidth="1.2" opacity="0.5" />
        <ellipse cx="245" cy="222" rx="20" ry="7" fill="none" stroke="#A7DCD9" strokeWidth="1" opacity="0.4" />

        {/* 4. Winding Sand Trail (구불구불한 길) */}
        <path
          id="trail-path"
          d="M 85,255 
             C 105,230 115,220 125,200 
             C 135,180 145,175 160,172 
             C 175,170 185,175 195,185"
          fill="none"
          stroke="#D8C6A5"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer"
          onClick={() => {
            if (isSeeking && target === 'trail') onObjectClick('trail');
            else if (!walkMode && growth.complexStage > 0) onInspectPlace('complex');
          }}
        />
        <path
          d="M 85,255 C 105,230 115,220 125,200 C 135,180 145,175 160,172 C 175,170 185,175 195,185"
          fill="none"
          stroke="#C8B38E"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.6"
        />

        {/* 5. Main Big Tree & Shadow (나무 그늘) */}
        <ellipse cx="140" cy="180" rx="36" ry="14" fill="#3D532F" opacity="0.25" />
        {/* Tree Trunk */}
        <path d="M 134,178 C 134,155 130,140 126,128 C 133,138 141,135 146,128 C 143,142 142,158 144,178 Z" fill="#6B5034" />
        {/* Tree Canopy Leaves (Storybook Cloud style) */}
        <g
          className="cursor-pointer"
          onClick={() => {
            if (isSeeking && target === 'tree') onObjectClick('tree');
            else if (!walkMode && growth.tiredStage > 0) onInspectPlace('tired');
          }}
        >
          <circle cx="120" cy="115" r="26" fill="#4E743A" />
          <circle cx="152" cy="112" r="28" fill="#5A8343" />
          <circle cx="136" cy="92" r="30" fill="url(#treeGrad)" />
          <circle cx="112" cy="98" r="22" fill="#6B9651" />
          <circle cx="148" cy="85" r="18" fill="#7FA963" opacity="0.8" />
        </g>

        {/* ============================================================ */}
        {/* 6. Dynamic Grown Objects: 평온해요 (연못/연꽃) */}
        {/* ============================================================ */}
        {growth.peacefulStage >= 1 && (
          <g
            id="obj-lotus-pad"
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            transform="translate(230, 205)"
            onClick={() => {
              if (isSeeking && (target === 'lotus' || target === 'pond_leaf')) {
                onObjectClick(target);
              } else if (!walkMode) {
                onInspectPlace('peaceful');
              }
            }}
          >
            {/* Stage 1: Round lotus leaf */}
            <path
              d="M 0,-3 C 9,-12 22,-8 25,2 C 27,11 16,18 4,16 C -6,14 -11,4 -7,-1 Z"
              fill="#528A68"
              stroke="#3D6C50"
              strokeWidth="1"
            />
            <path d="M 8,4 L 18,-3 M 8,4 L 20,8 M 8,4 L 3,12 M 8,4 L -2,4" stroke="#68A580" strokeWidth="0.8" opacity="0.7" />

            {/* Dew drop */}
            <circle cx="9" cy="2" r="1.8" fill="#FFFFFF" opacity="0.85" />

            {/* Stage 2: Lotus Bud */}
            {growth.peacefulStage >= 2 && (
              <g transform="translate(18, -4)">
                <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#FCE7EB" stroke="#E598A8" strokeWidth="0.8" />
                <path d="M -1,-4 Q 0,-7 1,-4 Z" fill="#E26D85" />
              </g>
            )}

            {/* Stage 3: Blooming Lotus Flower */}
            {growth.peacefulStage >= 3 && (
              <g transform="translate(18, -6)">
                {/* Petals */}
                <ellipse cx="-4" cy="2" rx="4" ry="7" transform="rotate(-30 -4 2)" fill="#FEE9EE" stroke="#E28EA0" strokeWidth="0.7" />
                <ellipse cx="4" cy="2" rx="4" ry="7" transform="rotate(30 4 2)" fill="#FEE9EE" stroke="#E28EA0" strokeWidth="0.7" />
                <ellipse cx="0" cy="-1" rx="4.5" ry="8" fill="#FFF2F5" stroke="#E28EA0" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2.2" fill="#FAD02C" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 7. Dynamic Grown Objects: 설레요 (길가 화단/꽃밭/나비) */}
        {/* ============================================================ */}
        {growth.flutterStage >= 1 && (
          <g
            id="obj-flower-bed"
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            transform="translate(100, 208)"
            onClick={() => {
              if (isSeeking && target === 'flower') onObjectClick('flower');
              else if (!walkMode) onInspectPlace('flutter');
            }}
          >
            {/* Stage 1: Green Stem and Bud */}
            <path d="M 0,8 Q 3,0 1,-6" fill="none" stroke="#5D8547" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="1" cy="-7" r="3" fill="#E89882" stroke="#C46E56" strokeWidth="0.8" />

            {/* Stage 2: Second Flower */}
            {growth.flutterStage >= 2 && (
              <g transform="translate(8, 2)">
                <path d="M 0,6 Q -2,1 -1,-4" fill="none" stroke="#5D8547" strokeWidth="1.5" />
                <circle cx="-1" cy="-5" r="4" fill="#F4B266" />
                <circle cx="-1" cy="-5" r="1.5" fill="#8C4E28" />
              </g>
            )}

            {/* Stage 3: Flower Cluster & Butterfly */}
            {growth.flutterStage >= 3 && (
              <g>
                <circle cx="-5" cy="-2" r="3.5" fill="#E87C87" />
                {/* Fluttering Yellow Butterfly */}
                <g className="animate-soft-float" transform="translate(6, -16)">
                  <path d="M 0,0 C -4,-4 -5,-1 0,1 C 5,-1 4,-4 0,0 Z" fill="#FEE440" />
                  <ellipse cx="0" cy="0" rx="0.6" ry="2" fill="#5A3A1B" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 8. Dynamic Grown Objects: 지쳤어요 (나무 그늘 벤치/등불/쉼터) */}
        {/* ============================================================ */}
        {growth.tiredStage >= 1 && (
          <g
            id="obj-bench-shelter"
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            transform="translate(142, 162)"
            onClick={() => {
              if (isSeeking && target === 'bench') onObjectClick('bench');
              else if (!walkMode) onInspectPlace('tired');
            }}
          >
            {/* Stage 1: Wooden Bench */}
            <path d="M 0,8 L 0,15 M 18,8 L 18,15" stroke="#4A3420" strokeWidth="1.8" strokeLinecap="round" />
            {/* Seat plank */}
            <rect x="-3" y="6" width="24" height="3" rx="1" fill="#8C6338" stroke="#5C3F22" strokeWidth="0.7" />
            {/* Backrest plank */}
            <rect x="-2" y="1" width="22" height="3" rx="1" fill="#9C7144" stroke="#5C3F22" strokeWidth="0.7" />

            {/* Cat sleeping under bench */}
            <ellipse cx="9" cy="13" rx="4.5" ry="2.5" fill="#E6A15C" />
            <circle cx="5" cy="12" r="2" fill="#E6A15C" />

            {/* Stage 2: Lantern Post */}
            {growth.tiredStage >= 2 && (
              <g transform="translate(26, -4)">
                <line x1="0" y1="18" x2="0" y2="0" stroke="#3A3835" strokeWidth="1.4" />
                <path d="M -3,0 L 3,0 L 2,-6 L -2,-6 Z" fill="#FFDE59" stroke="#3A3835" strokeWidth="0.8" />
                {/* Gentle lamp glow */}
                <circle cx="0" cy="-3" r="8" fill="#FFDE59" opacity="0.35" className="animate-gentle-pulse" />
              </g>
            )}

            {/* Stage 3: Cozy Roof Shelter */}
            {growth.tiredStage >= 3 && (
              <g transform="translate(-8, -12)">
                <polygon points="17,-6 -4,2 38,2" fill="#9C523A" stroke="#683120" strokeWidth="1" />
                <circle cx="17" cy="6" r="14" fill="#FFD166" opacity="0.25" className="animate-gentle-pulse" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 9. Dynamic Grown Objects: 복잡해요 (물가 징검다리 돌) */}
        {/* ============================================================ */}
        {growth.complexStage >= 1 && (
          <g
            id="obj-stones"
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => {
              if (isSeeking && target === 'stone') onObjectClick('stone');
              else if (!walkMode) onInspectPlace('complex');
            }}
          >
            {/* Stage 1: Flat Stone at water's edge */}
            <ellipse cx="196" cy="198" rx="8" ry="4.5" fill="#8D9AA6" stroke="#68737D" strokeWidth="1" />
            <ellipse cx="195" cy="197" rx="6" ry="3" fill="#A8B5C2" />

            {/* Stage 2: Second Stone beside it */}
            {growth.complexStage >= 2 && (
              <g transform="translate(18, 6)">
                <ellipse cx="196" cy="198" rx="7.5" ry="4" fill="#84909C" stroke="#5F6A73" strokeWidth="1" />
                <ellipse cx="195" cy="197" rx="5.5" ry="2.5" fill="#9AA7B3" />
              </g>
            )}

            {/* Stage 3: Stepping Stone Bridge across Pond */}
            {growth.complexStage >= 3 && (
              <g transform="translate(36, 14)">
                <ellipse cx="196" cy="198" rx="8.5" ry="5" fill="#7C8792" stroke="#59636C" strokeWidth="1" />
                <ellipse cx="195" cy="197" rx="6.5" ry="3.5" fill="#939EA8" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 10. Walk Mode Interactive Target Guides & Animations */}
        {/* ============================================================ */}
        {isSeeking && (
          <g className="pointer-events-none">
            {target === 'bench' && (
              <g transform="translate(151, 168)">
                <circle cx="0" cy="0" r="16" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#FF9F1C" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'flower' && (
              <g transform="translate(101, 201)">
                <circle cx="0" cy="0" r="16" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#FF9F1C" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'lotus' && (
              <g transform="translate(248, 204)">
                <circle cx="0" cy="0" r="18" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'pond_leaf' && (
              <g transform="translate(210, 225)">
                <circle cx="0" cy="0" r="16" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'stone' && (
              <g transform="translate(196, 198)">
                <circle cx="0" cy="0" r="16" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#48CAE4" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'tree' && (
              <g transform="translate(136, 105)">
                <circle cx="0" cy="0" r="28" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="24" fill="none" stroke="#52B788" strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}
            {target === 'trail' && (
              <g transform="translate(130, 195)">
                <circle cx="0" cy="0" r="18" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#E76F51" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {target === 'pond_sparkle' && (
              <g transform="translate(265, 215)">
                <circle cx="0" cy="0" r="18" fill="url(#glowPulse)" className="animate-gentle-pulse" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#F4A261" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        )}

        {/* 11. Walk Scene Active Animation Overlay */}
        {isViewing && (
          <g className="pointer-events-none animate-fade-in">
            {target === 'bench' && (
              <g transform="translate(151, 172)" className="animate-soft-float">
                {/* Cat stretching */}
                <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#FFB703" />
                <circle cx="-7" cy="-2" r="3" fill="#FFB703" />
                <text x="12" y="1" fontSize="11" fill="#7A4F0B" fontWeight="bold">야옹~</text>
              </g>
            )}
            {target === 'stone' && (
              <g transform="translate(196, 198)">
                <ellipse cx="0" cy="0" rx="14" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="1.5" className="animate-ripple-out" />
                <ellipse cx="0" cy="0" rx="22" ry="11" fill="none" stroke="#FFFFFF" strokeWidth="1" className="animate-ripple-out" style={{ animationDelay: '0.4s' }} />
              </g>
            )}
            {target === 'flower' && (
              <g transform="translate(101, 185)" className="animate-soft-float">
                <circle cx="0" cy="0" r="6" fill="#FF006E" opacity="0.85" />
                <text x="8" y="2" fontSize="12" fill="#E85D04">🦋 ✨</text>
              </g>
            )}
            {target === 'pond_sparkle' && (
              <g transform="translate(265, 215)">
                <text x="-8" y="2" fontSize="14" className="animate-gentle-pulse">✨ 💧</text>
              </g>
            )}
            {target === 'lotus' && (
              <g transform="translate(248, 204)">
                <circle cx="0" cy="0" r="2.5" fill="#E0FBFC" className="animate-soft-float" />
                <ellipse cx="0" cy="5" rx="8" ry="4" fill="none" stroke="#E0FBFC" strokeWidth="1" className="animate-ripple-out" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
