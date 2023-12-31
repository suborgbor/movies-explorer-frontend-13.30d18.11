import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import SavedMovies from '../SavedMovies/SavedMovies';
import './App.css';
import NotFound from '../NotFound/NotFound';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { MoviesProvider } from '../../contexts/MoviesContext';
import ProtectedRoutes from '../../utils/ProtectedRoutes';
import api from '../../utils/MainApi';
import Preloader from '../Preloader/Preloader';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import { movieCardTemplate } from '../../utils/utils';
import { getMovies } from '../../utils/MoviesApi';

const App = () => {
  const path = useLocation().pathname;
  const headerPaths = ['/', '/movies', '/saved-movies', '/profile'];
  const footerPaths = ['/', '/movies', '/saved-movies'];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [currentUser, setCurrentUser] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStatus, setIsStatus] = useState({status: '', message: '',});
  const [movies, setMovies] = useState(returnLocalFilms());
  const [savedMovies, setSavedMovies] = useState([]);
  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);

  const navigate = useNavigate();

  const closeAllPopups = () => {
    setIsOpenInfoTooltip(false);
  };

  const isBurgerOpened = false;

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    api.setAuthHeaders(token);
    api
      .getUserInfo()
      .then((data) => {
        setIsLoggedIn(true);
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getSavedMovies()])
        .then(([user, savedMovies]) => {
          setCurrentUser(user);
          setSavedMovies(savedMovies.reverse());
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoggedIn]);

  const addMovieToSavedMovies = (movie) => {
    api
      .createMovie(movie)
      .then((movie) => {
        setSavedMovies([...savedMovies, movie]);
      })
      .catch(console.error);
  };

  const deleteMovieToSavedMovies = (movie) => {
    const movieId =
      movie._id || savedMovies.find((i) => i.movieId === movie.movieId)._id;
    api
      .deleteMovie(movieId)
      .then(() => {
        setSavedMovies((prevSavedMovies) =>
          prevSavedMovies.filter((savedMovie) => savedMovie._id !== movieId)
        );
      })
      .catch(console.error);
  };

  const getAllMovies = () => {
    getMovies()
      .then((newMovies) => {
        const formattedMovies = movieCardTemplate(newMovies);
        setMovies(formattedMovies);
        localStorage.setItem('movies', JSON.stringify(formattedMovies));
      })
      .catch(console.error);
  };

  function returnLocalFilms() {
    return JSON.parse(localStorage.getItem('movies') ?? '[]');
  }

  function checkSavedMovies(movie) {
    return savedMovies.some(
      (i) => i._id === movie._id || i.movieId === movie.movieId
    );
  }

  const registering = async (userData) => {
    try {
      await api.registering(userData);
      logining({ email: userData.email, password: userData.password });
    } catch (err) {
      setIsOpenInfoTooltip(true);
      setIsStatus({
        status: false,
        message: 'Что-то пошло не так! Попробуйте ещё раз.',
      });
      console.log(err);
    }
  };

  const logining = async (loginData) => {
    try {
      const res = await api.logining(loginData);      
      setToken(res.token);
      setIsLoggedIn(true);
      api.setAuthHeaders(res.token);
      localStorage.setItem('jwt', res.token);

      navigate('/movies');
    } catch (err) {
      setIsOpenInfoTooltip(true);
      setIsStatus({
        status: false,
        message: 'Что-то пошло не так! Попробуйте ещё раз.',
      });
      console.log(err);
      setLoginError('Что-то пошло не так! Попробуйте ещё раз.');
    }
  };

  const logOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setToken('');
    setMovies([]);
    setSavedMovies([]);
    setCurrentUser({});
    navigate('/');
  };

  const updating = (name, email) => {
    return api
      .updatingData(name, email)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        setIsOpenInfoTooltip(true);
        setIsStatus({
          status: true,
          message: 'Вы успешно обновили данные.',
        });
      })
      .catch((err) => {
        setIsOpenInfoTooltip(true);
        setIsStatus({
          status: false,
          message: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
      });
  };

  if (isLoading) {
    return <Preloader />;
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <MoviesProvider>
        <div className="app">
          {headerPaths.includes(path) && (
            <Header
              isLoggedIn={isLoggedIn}
              isBurgerOpened={isBurgerOpened}
            />
          )}
          <Routes>
            <Route element={<ProtectedRoutes isLoggedIn={!isLoggedIn} />}>
              <Route
                path="/signin"
                element={
                  <Login
                    isLoggedIn={isLoggedIn}
                    logining={logining}
                    errorMessage={loginError}
                    title="Вход"
                    buttonText="Войти"
                  />
                }
              ></Route>
              <Route
                path="/signup"
                element={
                  <Register
                    isLoggedIn={isLoggedIn}
                    registering={registering}
                    title={'Регистрация'}
                    buttonText={'Зарегистрироваться'}
                  />
                }
              ></Route>
            </Route>
            <Route
              path="/"
              element={<Main />}
            ></Route>

            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
              <Route
                path="/movies"
                element={
                  <Movies
                    getMovies={getAllMovies}
                    movies={movies}
                    addMovie={addMovieToSavedMovies}
                    onDeleteFilm={deleteMovieToSavedMovies}
                    checkSavedMovies={checkSavedMovies}
                  />
                }
              ></Route>
              <Route
                path="/saved-movies"
                element={
                  <SavedMovies
                    movies={savedMovies}
                    onDeleteFilm={deleteMovieToSavedMovies}
                    checkSavedMovies={checkSavedMovies}
                  />
                }
              ></Route>

              <Route
                path="/profile"
                element={
                  <Profile
                    loginingOut={logOut}
                    updating={updating}
                  />
                }
              ></Route>
              <Route
                path="*"
                element={<NotFound onBack={goBack} />}
              />
            </Route>
          </Routes>
          {footerPaths.includes(path) && <Footer />}
          <InfoTooltip
            isRegister={isStatus}
            isOpen={isOpenInfoTooltip}
            onClose={closeAllPopups}
            alt={'Статус'}
          />
        </div>
      </MoviesProvider>
    </CurrentUserContext.Provider>
  );
};

export default App;
