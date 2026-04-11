/**
 * Fixed seat state legend for the seating map.
 */
function SeatLegend() {
  const items = [
    { label: 'VIP', swatchClass: 'bg-[var(--color-seat-vip)]' },
    { label: 'Premium', swatchClass: 'bg-[var(--color-seat-premium)]' },
    { label: 'General', swatchClass: 'bg-[var(--color-seat-general)]' },
    { label: 'Selected', swatchClass: 'bg-[var(--color-seat-selected)]' },
    { label: 'Booked', swatchClass: 'bg-[var(--color-seat-unavailable)]' },
    { label: 'AI Pick', swatchClass: 'bg-[var(--color-seat-suggested)]' },
    { label: 'Wheelchair', swatchClass: 'bg-[var(--color-seat-general)]' },
  ];

  return (
    <div className="premium-panel rounded-[24px] bg-[linear-gradient(180deg,rgba(10,10,15,0.88),rgba(14,14,24,0.88))] p-4 backdrop-blur-xl">
      <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Legend</p>
      <div className="grid grid-cols-2 gap-3 text-sm text-[var(--color-text-secondary)]">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-[rgba(255,255,255,0.04)]">
            <span className={`inline-flex h-3.5 w-3.5 rounded-full border border-white/10 ${item.swatchClass}`} aria-hidden="true" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatLegend;
