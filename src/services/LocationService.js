/**
 * @abstract Service class handling async location related API calls
 * 
 * @author Chase
 */
class LocationService {

    // geocode a given location string into lat/lng coords via api layer
    _geocodeLocationAsync = async ( locationText) => {
        const GEO_API_PATH = '/api/v1/location/', 
                       URI = GEO_API_PATH + locationText,
                ERR_PREFIX = ':::LOG:::LocationService._geocodeLocationAsync(), message: ';
        let retObj = { lat : '', lng : '' };
        return fetch( URI)
        .then( res => res.json())
        .then( ( result) => {
            // if results, get geo coords and return
            if ( result.lat) {
                retObj.lat = result.lat;
                retObj.lng = result.lng;
            }
            return retObj;
        }, ( error) => {
            console.log( ERR_PREFIX + error);
            return retObj;
        });
    };
}

export default LocationService;
