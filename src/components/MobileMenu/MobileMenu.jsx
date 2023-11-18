import { useState } from 'react';
import './MobileMenu.css';
import { NavLink, useLocation } from 'react-router-dom';

const MobileMenu = () => {
  const [isActive, setActive] = useState(false);
  const { pathname } = useLocation()

  const handleOpen = () => setActive(!isActive);

const handleClose = () => setActive(false);

return (
  <section className={`${!isActive ? 'mobile' : 'mobile mobile_type_active'}`}>
    <nav className={`${!isActive ? 'mobile__navigation' : 'mobile__navigation mobile__navigation_type_active'}`}>
      <div className="mobile__container">
        <button type="button" onClick={handleOpen} className={`${!isActive ? 'mobile__button' : 'mobile__button mobile__button_type_active'}`}>
          <span className={`${!isActive ? 'mobile__span' : 'mobile__span mobile__span_type_active'}`}></span>
        </button>
      </div>
      {isActive && (
        <>
          <ul className="mobile__links">
            <li>
              <NavLink to="/" onClick={handleClose} className={`mobile__link ${pathname === '/' ? 'mobile__link_active' : ''}`}>
                Главная
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" onClick={handleClose} className={`mobile__link ${pathname === '/movies' ? 'mobile__link_active' : ''}`}>
                Фильмы
              </NavLink>
            </li>
            <li>
              <NavLink to="/saved-movies" onClick={handleClose} className={`mobile__link ${pathname === '/saved-movies' ? 'mobile__link_active' : ''}`}>
                Сохранённые фильмы
              </NavLink>
            </li>
          </ul>
          <div className="mobile__links_type_account">
            <NavLink to="/profile" onClick={handleClose} className={`mobile__link mobile__link_type_account ${pathname === '/profile' ? 'mobile__link_active' : ''}`}>
              Аккаунт
              <div className="mobile__link-icon"></div>
            </NavLink>
          </div>
        </>
      )}
    </nav>
  </section>
)
}

export default MobileMenu;