/**
 * @abstract Service class handling async weather related API calls
 * 
 * @author Chase
 */
class WeatherService {

    // lookup local grid information based on lat & lng
    _getGridResultAsync = async ( lat, lng) => {
        const WEATHER_API_PREFIX = 'https://api.weather.gov/points/', 
                             URI = WEATHER_API_PREFIX + lat + ',' + lng,
                      ERR_PREFIX = ':::LOG:::WeatherService._getGridResultAsync(), message: ';
        let retObj = { locationName : '', forecastURL : '', stationsURL : '' };
        return fetch( URI)
        .then( res => res.json())
        .then( ( result) => {
            if ( result.properties && result.properties.forecast) {
                 retObj = {
                   locationName : result.properties.relativeLocation.properties.city + ', ' +
                                  result.properties.relativeLocation.properties.state,
                    forecastURL : result.properties.forecast,
                    stationsURL : result.properties.observationStations,
                      hourlyURL : result.properties.forecastHourly
                 }
            } 
            return retObj;
        }, ( error) => {
            console.log( ERR_PREFIX + error);
            return retObj;
        });
    };

    // lookup current stations for a given grid lookup result, 
    // then retrieve closest station latest observations
    _getCurrentStationAsync = async ( stationURL) => {
        const URI = stationURL,
       ERR_PREFIX = ':::LOG:::WeatherService._getCurrentStationAsync(), message: ';
        let retObj = { temperature : '', rightNow : '', icon : '' };
        const STATIONS_RESULT = await fetch( URI)
        .then( res => res.json())
        .then( ( result) => {
            return result;
        }, ( error) => {
            console.log( ERR_PREFIX + error);
            return retObj;
        });
        if ( STATIONS_RESULT.observationStations && 
             STATIONS_RESULT.observationStations.length > 0) {
            const STATION_URI = STATIONS_RESULT.observationStations[0] + 
                                '/observations/latest';
            return fetch( STATION_URI)
            .then( res => res.json())
            .then( ( result) => {
                if ( result.properties) {
                    retObj = {
                        temperature : this._toFahrenheit( 
                                      result.properties.temperature.value),
                           rightNow : result.properties.textDescription,
                               icon : result.properties.icon
                    }
                    return retObj;
                }
            }, ( error) => {
                console.log( ERR_PREFIX + error);
                return retObj;
            });
        } else {
            return retObj;
        }
    };

    // lookup forecast data based on grid lookup result
    _getForecastDataAsync = async ( forecastURL) => {
        const URI = forecastURL,
       ERR_PREFIX = ':::LOG:::WeatherService._getForecastDataAsync(), message: ';
        let retObj = { periods : '' };
        return fetch( URI)
        .then( res => res.json())
        .then( ( result) => {
            if ( result.properties && result.properties.periods) {
                retObj.periods = result.properties.periods;
            }
            return retObj;
        }, ( error) => {
            console.log( ERR_PREFIX + error);
            return retObj;
        });
    };

    // lookup houlry forecast data based on grid lookup result
    _getHourlyForecastDataAsync = async ( forecastURL) => {
        const URI = forecastURL,
       ERR_PREFIX = ':::LOG:::WeatherService._getHourlyForecastDataAsync(), message: ';
        let retObj = { periods : '' };
        return fetch( URI)
        .then( res => res.json())
        .then( ( result) => {
            if ( result.properties && result.properties.periods) {
                retObj.periods = result.properties.periods;
            }
            return retObj;
        }, ( error) => {
            console.log( ERR_PREFIX + error);
            return retObj;
        });
    };

    // converts a given celcius temp to fahrenheit
    _toFahrenheit( tempCelcius) {
        let retVal = '';
        if ( tempCelcius) {
            let raw = ( tempCelcius * 9 / 5) + 32;
            retVal = Math.round( raw) + 'F';
        }
        return retVal;
    }
}

export default WeatherService;
