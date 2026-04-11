import { formatLongDate, formatShortDate } from '../utils/dateFormatter';
import { formatPrice } from '../utils/priceFormatter';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const createSeed = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seedValue) => {
  let seed = seedValue >>> 0;

  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const createCodeMatrixSvg = (value) => {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const random = createRandom(createSeed(value));

  const setModule = (x, y, enabled, isReserved = false) => {
    if (x < 0 || y < 0 || x >= size || y >= size) {
      return;
    }

    matrix[y][x] = enabled;

    if (isReserved) {
      reserved[y][x] = true;
    }
  };

  const drawFinder = (startX, startY) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const isBorder = x === 0 || y === 0 || x === 6 || y === 6;
        const isCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        setModule(startX + x, startY + y, isBorder || isCore, true);
      }
    }

    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const px = startX + x;
        const py = startY + y;

        if (px >= 0 && py >= 0 && px < size && py < size && !reserved[py][px]) {
          setModule(px, py, false, true);
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  for (let index = 8; index < size - 8; index += 1) {
    const enabled = index % 2 === 0;
    setModule(index, 6, enabled, true);
    setModule(6, index, enabled, true);
  }

  setModule(size - 8, 8, true, true);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!reserved[y][x]) {
        const wave = ((x * 7 + y * 11 + value.length) % 5) === 0;
        setModule(x, y, random() > 0.52 || wave);
      }
    }
  }

  const quiet = 2;
  const rects = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (matrix[y][x]) {
        rects.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1" rx="0.18" />`);
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + quiet * 2} ${size + quiet * 2}" role="img" aria-label="Scan code">
      <rect width="100%" height="100%" rx="3.2" fill="#fffdf7" />
      <g fill="#161412">
        ${rects.join('')}
      </g>
    </svg>
  `;
};

const buildTicketHtml = ({ bookingId, event, showtime, seats, attendeeName, addOns }) => {
  const safeTitle = escapeHtml(event.title);
  const safeArtist = escapeHtml(event.artist);
  const safeVenue = escapeHtml(event.venue.name);
  const safeVenueAddress = escapeHtml(event.venue.address);
  const safeDate = escapeHtml(formatLongDate(showtime.date));
  const safeShortDate = escapeHtml(formatShortDate(showtime.date));
  const safeTime = escapeHtml(showtime.time);
  const safeBookingId = escapeHtml(bookingId);
  const safeAttendeeName = escapeHtml(attendeeName || 'Guest attendee');
  const safePoster = escapeHtml(event.thumbnailUrl || event.bannerUrl || '');
  const safeGenres = event.genre.map((item) => escapeHtml(item));
  const seatSummary = seats.map((seat) => `${seat.row}${seat.number}`).join(', ');
  const safeSeatSummary = escapeHtml(seatSummary);
  const tier = seats[0]?.tier?.toUpperCase() ?? 'STANDARD';
  const safeTier = escapeHtml(tier);
  const ticketCount = seats.length;
  const bookingFee = seats.length * 100;
  const addOnTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const base = seats.reduce((sum, seat) => sum + seat.price, 0);
  const gst = Math.round((base + bookingFee + addOnTotal) * 0.18);
  const total = base + bookingFee + addOnTotal + gst;
  const tierPerks = event.tierPerks?.[seats[0]?.tier] ?? [];
  const noteList = [
    `Entry opens 60 minutes before showtime.`,
    `Carry a valid photo ID matching the booking name.`,
    `Keep this PDF ready for scan at the gate.`,
  ];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} Ticket ${safeBookingId}</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #161412;
        --soft-ink: #57514a;
        --paper: #fbf8f2;
        --paper-strong: #f4efe6;
        --line: #e8d7bc;
        --accent: #ff9500;
        --accent-deep: #d86c1d;
        --accent-soft: rgba(255, 149, 0, 0.14);
        --rose-soft: rgba(255, 59, 48, 0.08);
      }

      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      @page {
        size: A4;
        margin: 8mm;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: var(--ink);
        font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        min-height: 100%;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1.35;
      }

      .sheet {
        position: relative;
        overflow: hidden;
        width: min(100%, 190mm);
        border: 1.5px solid var(--line);
        border-radius: 24px;
        background:
          radial-gradient(circle at top right, rgba(255, 149, 0, 0.16), transparent 30%),
          radial-gradient(circle at bottom left, rgba(255, 59, 48, 0.08), transparent 26%),
          linear-gradient(180deg, #fffdf8, #f7f1e7);
        box-shadow: 0 20px 70px rgba(58, 44, 31, 0.12);
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 20px 24px 12px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .brand-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(216, 108, 29, 0.28);
        background: linear-gradient(145deg, rgba(255, 149, 0, 0.16), rgba(255, 255, 255, 0.88));
        color: var(--accent-deep);
        font-weight: 700;
        font-size: 18px;
      }

      .eyebrow {
        margin: 0 0 4px;
        font-size: 10px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: var(--accent-deep);
      }

      .brand-title {
        margin: 0;
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(216, 108, 29, 0.26);
        background: linear-gradient(145deg, rgba(255, 149, 0, 0.12), rgba(255, 255, 255, 0.76));
        font-size: 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #6f4a22;
        flex-shrink: 0;
      }

      .status-pill::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 6px rgba(255, 149, 0, 0.12);
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.42fr) 210px;
        gap: 14px;
        padding: 0 24px 14px;
        break-inside: avoid;
      }

      .hero-card,
      .scan-card,
      .detail-card,
      .note-card,
      .footer-card {
        border: 1px solid rgba(232, 215, 188, 0.92);
        border-radius: 20px;
        background: rgba(255, 253, 248, 0.82);
      }

      .hero-card {
        display: grid;
        grid-template-columns: 136px minmax(0, 1fr);
        gap: 14px;
        padding: 16px;
        min-width: 0;
      }

      .poster {
        width: 100%;
        height: 176px;
        object-fit: cover;
        border-radius: 16px;
        background: #ece4d8;
      }

      .genre-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
      }

      .genre-chip {
        padding: 6px 9px;
        border-radius: 999px;
        background: var(--paper-strong);
        border: 1px solid rgba(216, 108, 29, 0.18);
        font-size: 9px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #6f5842;
      }

      h1 {
        margin: 0;
        font-size: 30px;
        line-height: 1.02;
        letter-spacing: -0.03em;
      }

      .artist {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--soft-ink);
      }

      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 12px;
      }

      .meta-block {
        padding: 10px 12px;
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(255, 149, 0, 0.08), rgba(255, 255, 255, 0.92));
        border: 1px solid rgba(216, 108, 29, 0.12);
        min-width: 0;
      }

      .meta-label {
        margin: 0 0 4px;
        font-size: 9px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8a7b6a;
      }

      .meta-value {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
      }

      .scan-card {
        padding: 14px;
        background:
          linear-gradient(180deg, rgba(255, 149, 0, 0.1), rgba(255, 255, 255, 0.92)),
          #fffdf8;
        min-width: 0;
      }

      .scan-card h2 {
        margin: 0;
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #72532d;
      }

      .code-panel {
        display: grid;
        place-items: center;
        margin-top: 10px;
        padding: 10px;
        border-radius: 16px;
        background: #fffdf7;
        border: 1px solid rgba(216, 108, 29, 0.16);
      }

      .code-panel svg {
        width: 128px;
        height: 128px;
      }

      .booking-id {
        margin: 10px 0 0;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-align: center;
        color: var(--accent-deep);
        line-height: 1.25;
      }

      .scan-caption {
        margin: 8px 0 0;
        font-size: 11px;
        text-align: center;
        color: #766b60;
        line-height: 1.4;
      }

      .details {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 14px;
        padding: 0 24px 14px;
        break-inside: avoid;
      }

      .detail-card,
      .note-card {
        padding: 16px;
        min-width: 0;
      }

      .section-title {
        margin: 0 0 12px;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #87684a;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .detail-item {
        padding: 10px 12px;
        border-radius: 14px;
        background: var(--paper);
        border: 1px solid rgba(22, 20, 18, 0.05);
        min-width: 0;
      }

      .detail-item span {
        display: block;
        margin-bottom: 4px;
        font-size: 9px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #918574;
      }

      .detail-item strong {
        display: block;
        font-size: 12px;
        line-height: 1.35;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed rgba(216, 108, 29, 0.26);
        font-size: 12px;
      }

      .price-row strong {
        font-size: 16px;
        color: var(--accent-deep);
      }

      .list {
        margin: 0;
        padding-left: 16px;
      }

      .list li {
        margin-bottom: 8px;
        color: var(--soft-ink);
        line-height: 1.4;
        font-size: 12px;
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }

      .soft-chip {
        padding: 6px 9px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(255, 149, 0, 0.12), rgba(255, 255, 255, 0.94));
        border: 1px solid rgba(216, 108, 29, 0.14);
        font-size: 10px;
        color: #6f5842;
      }

      .footer-card {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
        gap: 12px;
        margin: 0 24px 20px;
        padding: 14px 16px;
        background:
          linear-gradient(180deg, rgba(255, 149, 0, 0.08), rgba(255, 255, 255, 0.92)),
          #fffdf8;
        break-inside: avoid;
      }

      .footer-card p {
        margin: 0;
        color: var(--soft-ink);
        line-height: 1.4;
        font-size: 12px;
      }

      .footer-highlight {
        font-weight: 700;
        color: var(--ink);
      }

      .support {
        padding-left: 12px;
        border-left: 1px dashed rgba(216, 108, 29, 0.28);
        min-width: 0;
      }

      .support strong {
        display: block;
        margin-bottom: 6px;
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #86623d;
      }

      .support p + p {
        margin-top: 5px;
      }

      @media print {
        body {
          background: #ffffff;
          display: block;
        }

        .sheet {
          min-height: auto;
          width: 100%;
          margin: 0 auto;
          box-shadow: none;
        }

        .hero,
        .details,
        .footer-card {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="topbar">
        <div class="brand">
          <div class="brand-mark">IM</div>
          <div>
            <p class="eyebrow">Digital Ticket</p>
            <p class="brand-title">ItsMyScreen Live Pass</p>
          </div>
        </div>
        <div class="status-pill">Booking Confirmed</div>
      </section>

      <section class="hero">
        <article class="hero-card">
          <img class="poster" src="${safePoster}" alt="${safeTitle} poster" />
          <div>
            <div class="genre-row">
              ${safeGenres.map((genre) => `<span class="genre-chip">${genre}</span>`).join('')}
            </div>
            <h1>${safeTitle}</h1>
            <p class="artist">${safeArtist}</p>

            <div class="meta">
              <div class="meta-block">
                <p class="meta-label">Date</p>
                <p class="meta-value">${safeDate}</p>
              </div>
              <div class="meta-block">
                <p class="meta-label">Showtime</p>
                <p class="meta-value">${safeTime}</p>
              </div>
              <div class="meta-block">
                <p class="meta-label">Venue</p>
                <p class="meta-value">${safeVenue}</p>
              </div>
              <div class="meta-block">
                <p class="meta-label">Tickets</p>
                <p class="meta-value">${ticketCount} | ${safeTier}</p>
              </div>
            </div>
          </div>
        </article>

        <aside class="scan-card">
          <h2>Fast Entry Scan</h2>
          <div class="code-panel">
            ${createCodeMatrixSvg(bookingId)}
          </div>
          <p class="booking-id">${safeBookingId}</p>
          <p class="scan-caption">Present this scan block or booking code at the entry gate for a faster check-in.</p>
        </aside>
      </section>

      <section class="details">
        <article class="detail-card">
          <p class="section-title">Ticket Snapshot</p>
          <div class="detail-grid">
            <div class="detail-item">
              <span>Attendee</span>
              <strong>${safeAttendeeName}</strong>
            </div>
            <div class="detail-item">
              <span>Seats</span>
              <strong>${safeSeatSummary}</strong>
            </div>
            <div class="detail-item">
              <span>Venue Address</span>
              <strong>${safeVenueAddress}</strong>
            </div>
            <div class="detail-item">
              <span>Booking Date</span>
              <strong>${safeShortDate}</strong>
            </div>
          </div>

          <div class="price-row">
            <span>Total Paid</span>
            <strong>${escapeHtml(formatPrice(total))}</strong>
          </div>
        </article>

        <article class="note-card">
          <p class="section-title">What Comes With This Ticket</p>
          <ul class="list">
            ${tierPerks.map((perk) => `<li>${escapeHtml(perk)}</li>`).join('')}
            ${noteList.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
          </ul>

          ${
            addOns.length
              ? `<div class="chip-row">
                  ${addOns.map((addOn) => `<span class="soft-chip">${escapeHtml(addOn.label || addOn.name)}</span>`).join('')}
                </div>`
              : ''
          }
        </article>
      </section>

      <section class="footer-card">
        <div>
          <p class="footer-highlight">Please arrive early to avoid queue congestion and keep your device brightness high while scanning.</p>
          <p style="margin-top: 8px;">Need help? Venue staff can assist with section guidance, seat location, and ticket verification at the entry counters.</p>
        </div>
        <div class="support">
          <strong>Support</strong>
          <p>Booking ID: ${safeBookingId}</p>
          <p>${safeVenue}</p>
          <p>${safeDate} | ${safeTime}</p>
        </div>
      </section>
    </main>

  </body>
</html>`;
};

export const openTicketPrintWindow = ({ bookingId, event, showtime, seats, attendeeInfo, addOns }) => {
  const existingFrame = document.getElementById('ticket-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  const ticketHtml = buildTicketHtml({
    bookingId,
    event,
    showtime,
    seats,
    attendeeName: attendeeInfo?.name,
    addOns,
  });

  const printFrame = document.createElement('iframe');
  printFrame.id = 'ticket-print-frame';
  printFrame.title = 'Ticket Print Frame';
  printFrame.setAttribute('aria-hidden', 'true');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.style.opacity = '0';
  printFrame.style.pointerEvents = 'none';

  const cleanup = () => {
    printFrame.remove();
  };

  const waitForImages = async (frameWindow) => {
    const images = Array.from(frameWindow.document.images);
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            }),
      ),
    );
  };

  printFrame.onload = async () => {
    const frameWindow = printFrame.contentWindow;

    if (!frameWindow) {
      cleanup();
      return;
    }

    await waitForImages(frameWindow);

    const handleAfterPrint = () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      cleanup();
    };

    window.addEventListener('afterprint', handleAfterPrint, { once: true });
    window.setTimeout(handleAfterPrint, 60000);
    window.setTimeout(() => {
      frameWindow.focus();
      frameWindow.print();
    }, 250);
  };

  document.body.appendChild(printFrame);
  printFrame.srcdoc = ticketHtml;

  return true;
};

