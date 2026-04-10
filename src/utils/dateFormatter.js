const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
});

const longDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatShortDate = (isoDate) => dateFormatter.format(new Date(isoDate));

export const formatLongDate = (isoDate) => longDateFormatter.format(new Date(isoDate));
