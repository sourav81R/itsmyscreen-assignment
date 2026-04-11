import PropTypes from 'prop-types';
import { STAGE_CENTER } from '../hooks/useSeatLayout';

const tierColors = {
  vip: '#FFD60A',
  premium: '#30D158',
  general: '#0A84FF',
};

function TierBoundary({ tier, label, arcRadius }) {
  const angleSpread = 200;
  const startAngle = ((90 - angleSpread / 2) * Math.PI) / 180;
  const endAngle = ((90 + angleSpread / 2) * Math.PI) / 180;
  const x1 = STAGE_CENTER.x + arcRadius * Math.cos(startAngle);
  const y1 = STAGE_CENTER.y + arcRadius * Math.sin(startAngle);
  const x2 = STAGE_CENTER.x + arcRadius * Math.cos(endAngle);
  const y2 = STAGE_CENTER.y + arcRadius * Math.sin(endAngle);
  const arcId = `tier-arc-${tier}`;

  return (
    <g opacity="0.34" aria-hidden="true">
      <path id={arcId} d={`M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 0 1 ${x2} ${y2}`} fill="none" />
      <use href={`#${arcId}`} fill="none" stroke={tierColors[tier]} strokeWidth="0.9" strokeDasharray="4 7" />
      <text fontSize="10" fill={tierColors[tier]} fontFamily="'DM Sans', sans-serif" letterSpacing="2">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          {label.toUpperCase()}
        </textPath>
      </text>
    </g>
  );
}

TierBoundary.propTypes = {
  tier: PropTypes.oneOf(['vip', 'premium', 'general']).isRequired,
  label: PropTypes.string.isRequired,
  arcRadius: PropTypes.number.isRequired,
};

export default TierBoundary;
