import PropTypes from 'prop-types';

function ViewAngleToggle({ value, onChange }) {
  return (
    <div className="view-angle-toggle">
      {[
        { id: 'birdsEye', label: "Bird's eye" },
        { id: 'perspective', label: 'Stage view' },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`view-angle-button ${value === option.id ? 'is-active' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

ViewAngleToggle.propTypes = {
  value: PropTypes.oneOf(['birdsEye', 'perspective']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ViewAngleToggle;
