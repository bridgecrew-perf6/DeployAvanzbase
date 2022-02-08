import React from "react";
import "../../css/SearchBar.css";

const SearchBar = ({
  searchTerm,
  hint,
  onSearchTermChange,
  classStyle,
  searchFunction,
}) => {
  const onFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`${classStyle}`}>
      <form onSubmit={(event) => onFormSubmit(event)}>
        <div className="search-bar-layout">
          <input
            type="text"
            value={searchTerm}
            placeholder={hint}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
          {searchFunction ? (
            <button onClick={searchFunction} className="search-button">
              <i className="fas fa-search fa-2x"></i>
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
