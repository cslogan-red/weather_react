import React, { Component } from 'react';
import './ExtendedOutlook.css';
import WeatherTile from './WeatherTile';

class ExtendedOutlook extends Component {

    constructor( props) {

        super( props);
        this._handleExtendedSearch = this._handleExtendedSearch.bind( this);
        this._handleCollapse = this._handleCollapse.bind( this);
    }

    // handle extended search button, use handler passed down from parent
    _handleExtendedSearch() {

        this.props.onExtendedSearch();
    }

    // handle extended collapse button, use handler passed down from parent
    _handleCollapse() {

        this.props.onCollapse();
    }

    // render implementation
    render() {

        const location = this.props.location,
              extended = this.props.extended ? this.props.extended : [];
        return(
            <div>
            { location ? (
                    extended && extended.length > 0 ? (
                        <div className="extended__container">
                            <div className="extended__header--label">
                                <span>Extended Outlook</span>
                            </div>
                            <div className="extended__tile--container">
                                {extended.map( (conditions, i) => 
                                    <WeatherTile conditions={conditions} key={i} />)}
                            </div>
                            <div className="extended__button--wrapper">
                                <div className="extended__button">
                                    <button id="weather__collapseButton" 
                                            onClick={this._handleCollapse}>Collapse</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="extended__button--wrapper">
                            <div className="extended__button">
                                <button id="weather__extButton" 
                                        onClick={this._handleExtendedSearch}>Extended</button>
                            </div>
                        </div>
                    )
                ) : ('')}
            </div>
        );
    }
}

export default ExtendedOutlook;