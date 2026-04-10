import PropTypes from 'prop-types';

/**
 * Inline-validated attendee contact form bound to the booking store.
 * Props: values, errors, onChange.
 */
function AttendeeForm({ values, errors, onChange }) {
  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: '' },
    { key: 'email', label: 'Email', type: 'email', placeholder: '' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '' },
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
              autoComplete="off"
              placeholder={field.placeholder}
              className={`dark-input w-full rounded-[20px] border px-4 py-3 outline-none transition duration-200 hover:border-[rgba(255,190,92,0.28)] focus:border-[rgba(255,190,92,0.42)] ${
                errors[field.key] ? 'border-[rgba(255,69,58,0.5)]' : 'border-[rgba(255,149,0,0.14)]'
              }`}
            />
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
