import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const StyledNavLink = ({ children, ...props }) => {
  return (
    <NavLink
      {...props}
      style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400 })}
    >
      {children}
    </NavLink>
  );
};

StyledNavLink.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

const Navbar = () => {
  const navbarRef = useRef(null);

  const user = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const navbar = navbarRef.current;
    navbar.parentElement.style.paddingTop = getComputedStyle(navbar).height;
  }, []);

  return (
    <div style={{ paddingTop: '2.2rem' }}>
      <nav
        ref={navbarRef}
        style={{
          boxShadow: '1px 0 2px #aaa',
          backgroundColor: '#eee',
          boxSizing: 'border-box',
          padding: '0.5rem',
          position: 'fixed',
          right: 0,
          left: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0 }}>Blog App</h1>
        {user && (
          <>
            <ul
              style={{
                margin: 0,
                padding: 0,
                gap: '1rem',
                display: 'flex',
                listStyle: 'none',
              }}
            >
              <li>
                <StyledNavLink to="/">Blogs</StyledNavLink>
              </li>
              <li>
                <StyledNavLink to="/users">Users</StyledNavLink>
              </li>
            </ul>
            <div>
              {user.name} is logged in &nbsp;
              <button type="button" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
