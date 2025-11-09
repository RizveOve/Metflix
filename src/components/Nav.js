import { useEffect, useState } from 'react';
import './Nav.css';

function Nav({ user, onLogout, activeSection, onSectionChange }) {
  const [show, handleShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  const handleSectionClick = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <div className="nav__logo" onClick={() => handleSectionClick('home')}>
          <span className="nav__logoText">MetFlix</span>
        </div>

        <div className="nav__links">
          <span 
            className={activeSection === 'home' ? 'nav__link--active' : ''}
            onClick={() => handleSectionClick('home')}
          >
            Home
          </span>
          <span 
            className={activeSection === 'tv-shows' ? 'nav__link--active' : ''}
            onClick={() => handleSectionClick('tv-shows')}
          >
            TV Shows
          </span>
          <span 
            className={activeSection === 'movies' ? 'nav__link--active' : ''}
            onClick={() => handleSectionClick('movies')}
          >
            Movies
          </span>
          <span 
            className={activeSection === 'new-popular' ? 'nav__link--active' : ''}
            onClick={() => handleSectionClick('new-popular')}
          >
            New & Popular
          </span>
          <span 
            className={activeSection === 'my-list' ? 'nav__link--active' : ''}
            onClick={() => handleSectionClick('my-list')}
          >
            My List
          </span>
        </div>

        <div className="nav__right">
          <div className="nav__profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img
              className="nav__avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="User Avatar"
            />
            {showDropdown && (
              <div className="nav__dropdown">
                <div className="nav__user">{user?.email}</div>
                <div className="nav__logout" onClick={onLogout}>
                  Sign out of MetFlix
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;