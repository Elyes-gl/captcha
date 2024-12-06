import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CaptchaPage() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleContinue = () => {
    navigate('/game');
  };

  return (
    <div className="captcha-container">
      <h2>Veuillez cocher la case</h2>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="not-robot"
          checked={checked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="not-robot">Je ne suis pas un robot</label>
      </div>
      <p
        className={`success-message ${checked ? 'visible' : ''}`}
      >
        Vérification réussie !
      </p>
      <button
        className="button-primary"
        onClick={handleContinue}
        disabled={!checked}
      >
        Continuer
      </button>
    </div>
  );
}

export default CaptchaPage;
