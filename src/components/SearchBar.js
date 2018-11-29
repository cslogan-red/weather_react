import React, { Component } from 'react';
import './SearchBar.css';
import LoadingSpinner from './LoadingSpinner';

class SearchBar extends Component {

    constructor( props) {

        super( props);
        this._handleSearchChange = this._handleSearchChange.bind( this);
        this._handleSearchKeyPress = this._handleSearchKeyPress.bind( this);
    }

    // handle search button, use handler passed down from parent
    _handleSearchChange() {

        const input = document.getElementById( "searchInput");
        this.props.onSearchChange( input.value);
    }

    // handle search key press, use handler passed down from parent
    _handleSearchKeyPress( e) {

        if ( e.key === 'Enter')  this.props.onSearchChange( e.target.value);
    }

    // render implementation
    render() {

        const location = this.props.location,
           showSpinner = this.props.showSpinner;
        return(
            <div>
                { location ? ('') : (
                    <div className="search__missing--label">
                        <label>Search for a location!</label>
                    </div>
                )}
                <div className="search__container">
                    <div  className="search__left">
                        <input id="searchInput" alt="Search" placeholder="Enter a location..."
                               onKeyPress={this._handleSearchKeyPress}></input>
                    </div>
                    <div className="search__right">
                        <button id="weather__searchButton"
                                onClick={this._handleSearchChange}>Search</button>
                        
                    </div>
                    <div className="search__spinner--wrapper">
                        <LoadingSpinner showSpinner={showSpinner} />
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchBar;