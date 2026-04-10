import PropTypes from 'prop-types';
import { useBookingStore } from '../../store/useBookingStore';

const tabs = ['Card', 'UPI', 'Wallet'];

/**
 * Mock payment selector with tabs for card, UPI, and wallet options.
 * Props: values, errors, onFieldChange.
 */
function PaymentSelector({ values, errors, onFieldChange }) {
  const paymentMethod = useBookingStore((state) => state.paymentMethod);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);

  return (
    <section className="editorial-panel rounded-[32px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Payment</p>
      <div className="mt-5 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPaymentMethod(tab.toLowerCase())}
            className={`rounded-full px-4 py-2 text-sm transition ${
              paymentMethod === tab.toLowerCase()
                ? 'bg-[var(--color-brand-primary)] text-white'
                : 'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-secondary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {paymentMethod === 'card' ? (
        <div className="mt-5 grid gap-4">
          {[
            { key: 'cardNumber', label: 'Card Number', placeholder: '4242 4242 4242 4242' },
            { key: 'cardName', label: 'Name on Card', placeholder: 'Ananya Kapoor' },
            { key: 'cardExpiry', label: 'Expiry MM/YY', placeholder: '08/28' },
            { key: 'cardCvv', label: 'CVV', placeholder: '123' },
          ].map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-sm text-[var(--color-text-secondary)]">{field.label}</span>
              <input
                type="text"
                value={values[field.key]}
                onChange={(event) => onFieldChange(field.key, event.target.value)}
                placeholder={field.placeholder}
                className={`w-full rounded-[20px] border bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[var(--color-text-primary)] outline-none ${
                  errors[field.key] ? 'border-[rgba(255,69,58,0.5)]' : 'border-[var(--color-border-subtle)]'
                }`}
              />
              {errors[field.key] ? <span className="mt-2 block text-sm text-[var(--color-danger)]">{errors[field.key]}</span> : null}
            </label>
          ))}
        </div>
      ) : null}

      {paymentMethod === 'upi' ? (
        <label className="mt-5 block">
          <span className="mb-2 block text-sm text-[var(--color-text-secondary)]">UPI ID</span>
          <input
            type="text"
            value={values.upiId}
            onChange={(event) => onFieldChange('upiId', event.target.value)}
            placeholder="name@bank"
            className={`w-full rounded-[20px] border bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[var(--color-text-primary)] outline-none ${
              errors.upiId ? 'border-[rgba(255,69,58,0.5)]' : 'border-[var(--color-border-subtle)]'
            }`}
          />
          {errors.upiId ? <span className="mt-2 block text-sm text-[var(--color-danger)]">{errors.upiId}</span> : null}
        </label>
      ) : null}

      {paymentMethod === 'wallet' ? (
        <div className="mt-5 grid gap-3">
          {['Paytm', 'PhonePe', 'Amazon Pay'].map((wallet) => (
            <button
              key={wallet}
              type="button"
              onClick={() => onFieldChange('wallet', wallet)}
              className={`rounded-[22px] border px-4 py-4 text-left transition ${
                values.wallet === wallet
                  ? 'border-[var(--color-brand-primary)] bg-[rgba(255,59,48,0.1)] text-[var(--color-text-primary)]'
                  : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-secondary)]'
              }`}
            >
              {wallet}
            </button>
          ))}
          {errors.wallet ? <span className="text-sm text-[var(--color-danger)]">{errors.wallet}</span> : null}
        </div>
      ) : null}
    </section>
  );
}

PaymentSelector.propTypes = {
  values: PropTypes.shape({
    cardNumber: PropTypes.string.isRequired,
    cardName: PropTypes.string.isRequired,
    cardExpiry: PropTypes.string.isRequired,
    cardCvv: PropTypes.string.isRequired,
    upiId: PropTypes.string.isRequired,
    wallet: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    cardNumber: PropTypes.string,
    cardName: PropTypes.string,
    cardExpiry: PropTypes.string,
    cardCvv: PropTypes.string,
    upiId: PropTypes.string,
    wallet: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default PaymentSelector;
