function SpotlightEffect() {
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width="1000" height="720" fill="url(#stage-glow)" />
      <polygon id="spotlight-polygon" points="420,120 580,120 700,520 300,520" fill="url(#spotlight)" />
      <ellipse cx="500" cy="250" rx="255" ry="165" fill="url(#stage-atmosphere)" opacity="0.72" />
    </g>
  );
}

export default SpotlightEffect;
