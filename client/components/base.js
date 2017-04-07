import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';


const base = ({ children }) => (
  <div>
    <div className="top-bar">
      <div className="top-bar-left">
        <IndexLink to="/">React App</IndexLink>
      </div>

      <div className="top-bar-right">
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </div>

    </div>

    {children}

  </div>
);

base.propTypes = {
  children: PropTypes.object.isRequired
};

export default base;
