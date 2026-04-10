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
    <section className="editorial-panel rounded-[32px] p-6">
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
              className={`w-full rounded-[20px] border bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[var(--color-text-primary)] outline-none ${
                errors[field.key] ? 'border-[rgba(255,69,58,0.5)]' : 'border-[var(--color-border-subtle)]'
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
