import React from 'react';
import styles from './SearchBar.module.css'

const SearchBar = ({ header, isButtonVisible = false, btnFunc, btnText }) => {
    return (
        <div className={ styles.searchBar__wrapper }>
            <h1 className={ styles.searchBar__header }>{header}</h1>
            <input type="text" name="" id="" className={ styles.searchBar__input } placeholder='Search...'/>
            {isButtonVisible ? 
                <button className={ styles.searchBar__btn }> {btnText}</button>
            : null}
        </div>
    );
}

export default SearchBar;
