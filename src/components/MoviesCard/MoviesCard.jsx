import { durationMovies } from '../../utils/utils';
import useFormValidation from '../../hooks/useFormValidation';
import { useLocation } from 'react-router-dom';
import './MoviesCard.css';

const MoviesCard = ({movie, addMovie, onDeleteFilm, checkSavedMovies, }) => {
  const path = useLocation().pathname;
  const { values } = useFormValidation();
  
  const isSaved = checkSavedMovies(movie);

  const handleSaveClick = () => {!isSaved && addMovie(movie)};
  const handleDeleteClick = () => {onDeleteFilm(movie)};

  return (
    <>
      <li className="movies-box">
        <article className="movies-box__item">
          <a target="_blank" rel="noreferrer" href={movie.trailerLink}>
            <img src={movie.image} alt={`Отрывок из фильма ${movie.nameRU}`} className="movies-box__image"/>
          </a>
        </article>
        <div className="movies-box__description">
          <h2 className="movies-box__subtitle">{movie.nameRU}</h2>
          {path === '/movies' ? (
            <label className="movies-box__label">
              <input
                className="movies-box__input"
                type="checkbox"
                onChange={!isSaved ? handleSaveClick : handleDeleteClick}
                checked={isSaved}
                value={values}                   
              />
              <span className="movies-box__checkbox"></span>
            </label>
          ) : (
            <button type="button" className="movies-box__button movies-box__button_type_on"  aria-label="Удалить фильм из сохранённых" title="Удалить фильм из сохранённых" 
            onClick={handleDeleteClick}></button>
            )}
        </div>
        <span className="movies-box__duration">
          {durationMovies(movie.duration)}
        </span>
      </li>
    </>
  );
};

export default MoviesCard;
