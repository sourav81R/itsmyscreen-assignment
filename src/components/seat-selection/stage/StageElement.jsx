import { STAGE_CENTER } from '../hooks/useSeatLayout';
import SpotlightEffect from './SpotlightEffect';

function StageElement() {
  return (
    <g aria-hidden="true">
      <SpotlightEffect />

      <polygon
        points="360,65 640,65 680,115 320,115"
        fill="url(#stage-surface)"
        stroke="#FF9500"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <line x1="320" y1="115" x2="680" y2="115" stroke="#FFD060" strokeWidth="1.5" strokeOpacity="0.8" />
      <text
        x={STAGE_CENTER.x}
        y="97"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1A0A00"
        fontSize="13"
        fontWeight="600"
        fontFamily="'Syne', sans-serif"
        letterSpacing="3"
        opacity="0.92"
      >
        STAGE
      </text>
      <circle cx="295" cy="88" r="6" fill="#1A1A2E" stroke="#333350" strokeWidth="0.5" />
      <circle cx="295" cy="88" r="2" fill="#444460" />
      <circle cx="705" cy="88" r="6" fill="#1A1A2E" stroke="#333350" strokeWidth="0.5" />
      <circle cx="705" cy="88" r="2" fill="#444460" />
      <line
        x1="500"
        y1="115"
        x2="500"
        y2="760"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.04"
        strokeDasharray="4 8"
      />
      <line
        x1="500"
        y1="115"
        x2="200"
        y2="760"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.03"
        strokeDasharray="4 8"
      />
      <line
        x1="500"
        y1="115"
        x2="800"
        y2="760"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.03"
        strokeDasharray="4 8"
      />
    </g>
  );
}

export default StageElement;
