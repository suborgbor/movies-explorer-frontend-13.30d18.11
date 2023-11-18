import { Link } from 'react-router-dom';
import useFormValidation from '../../hooks/useFormValidation';
import { useEffect, useState } from 'react';
import logo from '../../images/logo.svg';
import './Register.css';

const Register = ({ registering }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, handleChange, resetForm, isValid, errors  } = useFormValidation();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    registering(values).finally(() => {
      setIsSubmitting(false);
    });
  };

  useEffect(() => {resetForm()}, [resetForm]);

  return (
    <main className="main">
      <section className="register">
        <form className="register__form" name="register" noValidate onSubmit={handleSubmit}>
          <Link to="/" className="register__link">
            <img src={logo} alt="Логотип" className="register__logo"/>
          </Link>
          <h1 className="register__title">Добро пожаловать!</h1>
          <div className="register__labels-container">
            <label className="register__label">
              <span className="register__label-text">Имя</span>
              <input name="name" className={`register__input ${errors.name && 'register__input_error'}`}
                onChange={handleChange}
                value={values.name ? values.name : ''}
                type="text"
                required
                minLength="2"
                maxLength="40"
                pattern={'^[а-яА-Яa-zA-Z0-9]+$'}
                placeholder="Введите имя"
              />
              <span className="register__error">{errors.name ? errors.name : ''}</span>
            </label>
            <label className="register__label">
              <span className="register__label-text">E-mail</span>
              <input
                name="email"
                className={`register__input ${errors.email && 'register__input_error'}`}
                onChange={handleChange}
                value={values.email ? values.email : ''}
                type="email"
                required
                placeholder="Введите почту"
              />
              <span className="register__error">{errors.email ? errors.email : ''}</span>
            </label>
            <label className="register__label">
              <span className="register__label-text">Пароль</span>
              <input name="password" className={`register__input ${errors.password && 'register__input_error'}`}
                onChange={handleChange}
                value={values.password ? values.password : ''}
                type="password"
                required
                minLength="5"
                maxLength="40"
                placeholder="Введите пароль"
              />
              <span className="register__error">{errors.password ? errors.password : ''}</span>
            </label>
          </div>
          <button type="submit" className="register__button" disabled={!isValid ? true : isSubmitting}>
            Зарегистрироваться
          </button>
        </form>
        <span className="register__support">
          Уже зарегистрированы?&nbsp;
          <Link to="/signin" className="register__link">
            Войти
          </Link>
        </span>
      </section>
    </main>
  );
};


export default Register;
