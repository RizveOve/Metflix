import { useEffect, useState } from 'react';
import './Nav.css';

function Nav({ user, onLogout }) {
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

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <div className="nav__logo">
          <span className="nav__logoText">MetFlix</span>
        </div>

        <div className="nav__links">
          <span>Home</span>
          <span>TV Shows</span>
          <span>Movies</span>
          <span>New & Popular</span>
          <span>My List</span>
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