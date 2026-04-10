import PropTypes from 'prop-types';

/**
 * Inline-validated attendee contact form bound to the booking store.
 * Props: values, errors, onChange.
 */
function AttendeeForm({ values, errors, onChange }) {
  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Ananya Kapoor' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'ananya@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210' },
  ];

  return (
    <section className="premium-panel rounded-[30px] bg-[linear-gradient(145deg,rgba(31,31,49,0.96),rgba(15,15,23,0.98))] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Attendee info</p>
      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-2 block text-sm text-[var(--color-text-secondary)]">{field.label}</span>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder}
              className={`w-full rounded-[20px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-3 text-[var(--color-text-primary)] outline-none transition duration-200 placeholder:text-[var(--color-text-muted)] hover:border-[rgba(255,190,92,0.28)] focus:border-[rgba(255,190,92,0.42)] focus:bg-[rgba(255,255,255,0.05)] ${
                errors[field.key] ? 'border-[rgba(255,69,58,0.5)]' : 'border-[rgba(255,149,0,0.14)]'
              }`}
            />
            {errors[field.key] ? <span className="mt-2 block text-sm text-[var(--color-danger)]">{errors[field.key]}</span> : null}
          </label>
        ))}
      </div>
    </section>
  );
}

AttendeeForm.propTypes = {
  values: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AttendeeForm;
