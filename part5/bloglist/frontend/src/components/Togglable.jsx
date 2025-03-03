import PropTypes from 'prop-types';
import { useState } from 'react';

function Togglable({ children, openLabel, closeLabel }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {visible && children}
      <button type="button" onClick={() => setVisible(!visible)}>
        {visible ? closeLabel : openLabel}
      </button>
    </div>
  );
}

Togglable.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired,
};

export default Togglable;
