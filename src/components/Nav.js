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
        <img
          className="nav__logo"
          src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
          alt="Netflix Logo"
        />

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
                  Sign out of Netflix
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