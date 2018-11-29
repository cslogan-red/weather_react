import React, { Component } from 'react';
import './App.css';
import CurrentCondtions from './CurrentConditions';
import ThreeDayOutlook from './ThreeDayOutlook';
import SearchBar from './SearchBar';
import LocationService from '../services/LocationService';
import WeatherService from '../services/WeatherService';
import DataService from '../services/DataService';
import ExtendedOutlook from './ExtendedOutlook';
import LoadingSpinner from './LoadingSpinner';

/**
 * @abstract State mounting point for Weather App, API layer access
 * runs from here and pushes data and event handlers down via props
 * to keep rest of component tree stateless.
 * 
 * @author Chase
 */

class App extends Component {

	constructor( props) {

		super( props);
		this._handleSearchChange = this._handleSearchChange.bind( this);
		this._handleExtendedSearch = this._handleExtendedSearch.bind( this);
		this._handleExtendedCollapse = this._handleExtendedCollapse.bind( this);
		this._handleHourlySearch = this._handleHourlySearch.bind( this);
		this._checkForExistingUser = this._checkForExistingUser.bind( this);
		this._initState = this._initState.bind( this);
		this.state = {
			location : '',
		locationName : '',
			rightNow : '',
			 current : {
					name : '',
					temp : '',
				detailed : '',
					icon : ''
			}, 
			 outlook : [],
			extended : [],
			  hourly : [],
		 showSpinner : false,
		 hideForInit : true
		};
	}

	// handle initialization and potential API calls for existing users
	componentDidMount() {

		// check for existing user
		this._showSpinner();
		this._checkForExistingUser();
	}

	// check for existing user cookie and init from cache
	_checkForExistingUser = async () => {
		
		const KEY = new DataService()._getUserId(),
		   RESULT = await new DataService()._getDocument( KEY),
	  EXP_SESSION = 300000;
		if ( RESULT && RESULT.location) { 
			// if cached data exists, check if session has expired,
			// request refreshed data if so
			if ( RESULT.timeStamp && Date.now() - RESULT.timeStamp > EXP_SESSION) {
				this._handleSearchChange( RESULT.location);	
			} else {
				let retObj = this._buildCacheResult( RESULT);
				this._persistValidState( retObj);
			}
		} else {
			// new user, start fresh
			this._initState();
		}
	}

	// SearchBar change event handler, triggers API search and updates state
    _handleSearchChange( locationText) {
		
		this._showSpinner();
		this._handleExtendedCollapse();
		if ( locationText) {
			this._handleSearchAsync( locationText)
			.then( ( result) => {
				if ( result && result.locationName) {
					// persist active state & cache results
					// cache extended & hourly until requested to reduce memory footprint
					this._persistValidState( result);
					const KEY = new DataService()._getUserId();
					new DataService()._persistDocument( KEY,
						{ locationName : result.locationName,	
							  location : result.location,
							  rightNow : result.rightNow,
							   current : result.current,
							   outlook : result.outlook, 
							  extended : result.extended,
							    hourly : result.hourly,
							 timeStamp : Date.now()
					})
					.then( ( result) => { 
						// only used for debugging 
					});
				} else {
					this._initState();
				}
			},( error) => {
				this._initState();
			});
		} else {
			this._initState();
		}
	}

	// async API service aggregator, returns aggregated service result for state
	_handleSearchAsync = async ( locationText) => {
		let retObj = {};

		const GEO_RESULT = await new LocationService()._geocodeLocationAsync( locationText);
		if ( GEO_RESULT) {
			const GRID_RESULT = 
				await new WeatherService()._getGridResultAsync( GEO_RESULT.lat, GEO_RESULT.lng);
			if ( GRID_RESULT) {
				const LOCATION = GRID_RESULT.locationName;
				const FORECAST_RESULT =
					await new WeatherService()._getForecastDataAsync( GRID_RESULT.forecastURL),
					   CURRENT_RESULT =
					await new WeatherService()._getCurrentStationAsync( GRID_RESULT.stationsURL),
						HOURLY_RESULT = 
					await new WeatherService()._getHourlyForecastDataAsync( GRID_RESULT.hourlyURL);
				const SEARCH_OBJ = {
						locationText : locationText,
						locationName : LOCATION,
					   currentResult : CURRENT_RESULT,
					  	  periodData : FORECAST_RESULT.periods,
					hourlyPeriodData : HOURLY_RESULT.periods
				};
				retObj = this._buildSearchResult( SEARCH_OBJ);
			} else {
				this._initState();
			}
		} else {
			this._initState();
		}
		return retObj;
	}

	// extended outlook event handler, triggers extended outlook lookup
	_handleExtendedSearch() {

		this._showSpinner();
		this._handleExtendedSearchAsync().then( ( result) => {
			this.setState({
				showSpinner : result.showSpinner,
				   extended : result.extended
			});
		},( error) => {
			this._initState();
		});
	}

	// async API extended lookup, returns extended from database
	_handleExtendedSearchAsync = async () => {
		let retObj = {};

		const KEY = new DataService()._getUserId(),
		   RESULT = await new DataService()._getDocument( KEY);
		if ( RESULT) {
			retObj = {
				showSpinner : false,
				   extended : RESULT.extended
			}
		}
		return retObj;
	}

	// hourly event handler, triggers hourly lookup
	_handleHourlySearch( hourlyHeight, callback) {

		if ( hourlyHeight === 0) {
			this._showSpinner();
			this._handleHourlySearchAsync().then( ( result) => {
				this.setState({
					showSpinner : result.showSpinner,
						 hourly : result.hourly
				});
				if ( callback) callback();
			},( error) => {
				this._initState();
			});
		} else {
			this.setState({
				showSpinner : false,
					 hourly : []
			});
			if ( callback) callback();
		}
	}

	// async API hourly lookup, returns hourly from database
	_handleHourlySearchAsync = async () => {
		let retObj = {};

		const KEY = new DataService()._getUserId(),
		   RESULT = await new DataService()._getDocument( KEY);
		if ( RESULT) {
			retObj = {
				showSpinner : false,
				     hourly : RESULT.hourly
			}
		}
		return retObj;
	}

	// construct combined search result for eventual state persistence
	_buildSearchResult( searchObj) {
		let retObj = {};

		if ( searchObj && searchObj.locationText && searchObj.locationName && 
			 searchObj.currentResult && searchObj.periodData) {
			const TODAY = searchObj.periodData[0],
			   ICON_SFX = '=large';
			let outlookArr = [],
			   extendedArr = [],
			     hourlyArr = [];
			// eslint-disable-next-line
			searchObj.periodData.map( ( item, index) => {
				let itemIcon = item.icon.substring( 0, item.icon.indexOf( '='));
				itemIcon = itemIcon + ICON_SFX;
				if ( index > 0 && index < 7) {
					let outlook = {
						name : item.name,
						temp : item.temperature + item.temperatureUnit,
					detailed : item.shortForecast,
						icon : itemIcon
					}
					outlookArr.push( outlook);
				}
				let localDate = new Date( item.startTime);
				extendedArr.push( {
					name : item.name + ' (' + localDate.toLocaleDateString() + ')',
					temp : item.temperature + item.temperatureUnit,
				detailed : item.shortForecast,
					icon : itemIcon
				});
			});
			// eslint-disable-next-line
			searchObj.hourlyPeriodData.map( ( item, index) => {
				if ( index >= 0 && index < 12) {
					let localTime = '' + new Date( item.startTime).toLocaleTimeString();
					let localHour = 
						localTime.substring( 0, localTime.indexOf( ':')) +
						localTime.substring( localTime.indexOf( ' ') + 1);
					hourlyArr.push( {
						hour : localHour,
						temp : item.temperature + item.temperatureUnit,
						icon : item.icon
					});
				}
			});
			let todayIcon = TODAY.icon.substring( 0, TODAY.icon.indexOf( '='));
				todayIcon = todayIcon + ICON_SFX;
			retObj = {
					location : searchObj.locationText,
				locationName : searchObj.locationName,
					rightNow : searchObj.currentResult.temperature + ' and ' + 
							   searchObj.currentResult.rightNow,
					 current : {
						name : TODAY.name,
						temp : TODAY.temperature + TODAY.temperatureUnit,
					detailed : TODAY.detailedForecast,
						icon : todayIcon
					},
					outlook : outlookArr,
				   extended : extendedArr,
				     hourly : hourlyArr
			}
		}
		return retObj;
	}

	// construct state from cache
	_buildCacheResult( cacheObj) {
		let retObj = {};

		if ( cacheObj) {
			retObj = {
				location : cacheObj.location,
			locationName : cacheObj.locationName,
				rightNow : cacheObj.rightNow,
			   timeStamp : cacheObj.timeStamp,
				 current : cacheObj.current,
				 outlook : cacheObj.outlook
			}
		}
		return retObj;
	}

	// extended collpase event handler
	_handleExtendedCollapse() {

		this.setState({
			extended : []
		});
	}

	// show loading spinner
    _showSpinner() {
		
		if ( this.state.showSpinner === false) {
			this.setState({
				showSpinner : true
			});
		}
	}
	
	// re-init state
	_initState() {
		
		this.setState({
			location : '',
		locationName : '',
			rightNow : '',
			 current : {
					name : '',
					temp : '',
				detailed : '',
					icon : ''
			}, 
			 outlook : [],
			extended : [],
			  hourly : [],
		 showSpinner : false,
		 hideForInit : false
		});
	}

	// set valid, active state
	_persistValidState( stateObj) {

		if ( stateObj) {
			this.setState({
				showSpinner : false,
				hideForInit : false,
			   locationName : stateObj.locationName,
				   location : stateObj.location,
				   rightNow : stateObj.rightNow,
					current : stateObj.current,
					outlook : stateObj.outlook
			});
		}
	}

	// render implementation
	render() {
		
		const location = this.state.location,
		  locationName = this.state.locationName,
			  rightNow = this.state.rightNow,
			   outlook = this.state.outlook,
			   current = this.state.current,
			  extended = this.state.extended,
				hourly = this.state.hourly,
		   showSpinner = this.state.showSpinner,
		   hideForInit = this.state.hideForInit;
		return (
			<div>
				{ hideForInit ? (
					<div className="app__container">
						<div className="app__loading--container">
							<LoadingSpinner showSpinner={showSpinner} />
						</div>
					</div>
				) : (
					<div className="app__container">
						{ !location ? (
							<div className="app__search">
								<SearchBar
									showSpinner={showSpinner}
									location={location}
									onSearchChange={this._handleSearchChange} />
							</div>
						) : (
						<div>
							<div className="app__fixed--menu">
								<SearchBar
									showSpinner={showSpinner}
									location={location}
									onSearchChange={this._handleSearchChange} />
							</div>
							<div className="app__weather--container">
								<CurrentCondtions 
									location={location}
									locationName={locationName}
									rightNow={rightNow}
									current={current}
									hourly={hourly}
									onClick={this._handleHourlySearch} />
								<ThreeDayOutlook 
									outlook={outlook} />
								<ExtendedOutlook
									location={location}
									extended={extended}
									onExtendedSearch={this._handleExtendedSearch}
									onCollapse={this._handleExtendedCollapse} />
							</div>
						</div>
						) }
					</div>
				) }
			</div>
		);
	}
}

export default App;
