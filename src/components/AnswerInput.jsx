import { useState, useRef, useEffect } from 'react';
import useGameStore from '../hooks/useGameState';

export default function AnswerInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  
  const lastAnswerResult = useGameStore(s => s.lastAnswerResult);

  // Shake and clear input if answer was incorrect
  useEffect(() => {
    if (lastAnswerResult && lastAnswerResult.correct === false) {
      setShake(true);
      setValue('');
      const timer = setTimeout(() => {
        setShake(false);
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerResult]);

  // Reset value when disabled status changes (like new round)
  useEffect(() => {
    if (!disabled) {
      setValue('');
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    if (onSubmit) {
      onSubmit(value.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`autocomplete ${shake ? 'shake' : ''}`}
      style={{ width: '100%' }}
    >
      <div className="autocomplete__input-wrap">
        <span className="autocomplete__icon">✍️</span>
        <input
          ref={inputRef}
          type="text"
          className="input input--large"
          placeholder={disabled ? "Đã trả lời đúng!" : "Nhập tên quốc gia..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          id="country-input"
          style={{
            borderColor: shake ? 'var(--red)' : '',
            boxShadow: shake ? '0 0 0 3px var(--red-glow)' : '',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
        />
        {value && !disabled && (
          <button 
            className="autocomplete__clear" 
            onClick={() => { setValue(''); inputRef.current?.focus(); }} 
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
