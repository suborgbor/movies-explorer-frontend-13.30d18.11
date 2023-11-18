import './SearchForm.css';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import useFormValidation from '../../hooks/useFormValidation';

const SearchForm = ({ searchMovies, onShortChange, shortMovie, initialSearchValue = '' }) => {
  const { values, handleChange } = useFormValidation({ search: initialSearchValue });

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMovies(values.search);
  };

  const changeShort = (event) => {
    onShortChange(event.target.checked);
  };

  return (
    <section className="search">
      <form className="search__form" name="search" Validate onSubmit={handleSubmit}>
        <div className="search__container">
          <input
            className="search__input"
            name="search"
            type="text"
            placeholder="Фильм"
            autoComplete="off"
            required
            value={values.search || ''}
            onChange={handleChange}
          />
          <button className="search__button" type="submit"></button>
        </div>
        <span className="search__error">Введите ключевое слово</span>

        <FilterCheckbox isChecked={shortMovie} onChangeShort={changeShort} />
      </form>
    </section>
  );
};

export default SearchForm;