import { NavLink, Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import MobileMenu from '../MobileMenu/MobileMenu';
import './Navigation.css';

const Navigation = ({ isLoggedIn, logIn }) => {
  const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

  if (!isLoggedIn) {
    return (
      <nav className="nav">
        <Link to="/signup" className="nav__link">Регистрация</Link>
        <Link to="/signin" className="nav__link nav__link_type_active" onClick={logIn}>Войти</Link>
      </nav>
    );
  } else 
  if (isMobile) {
    return <MobileMenu />;
  } else {
    return (
      <nav className="nav">
        <NavLink to="/movies" className="nav__link nav__link_type_film">Фильмы</NavLink>
        <NavLink to="/saved-movies" className="nav__link nav__link_type_save-film">Сохранённые фильмы</NavLink>
        <NavLink to="/profile" className="nav__link nav__link_type_account">Аккаунт</NavLink>
      </nav>
    );
  }
};

export default Navigation;