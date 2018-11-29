import * as request from 'request-promise-native';

export default class LocationService {

    // geocode a given location string into lat/lng coords
    _geocodeLocationAsync = async ( locationText) => {
        const GEO_API_PREFIX = 'https://maps.googleapis.com/maps/api/geocode/json?address=', 
              GEO_API_SUFFIX = '&key=<YOUR API KEY>', 
                         URI = GEO_API_PREFIX + locationText + GEO_API_SUFFIX,
                     options = { uri : URI, json : true };   
        const retObj = { lat : '', lng : '' };
        const RESOLVE = await request.get( options);
        if ( RESOLVE) {
            retObj.lat = RESOLVE.results[0].geometry.location.lat;
            retObj.lng = RESOLVE.results[0].geometry.location.lng;
        }
        return retObj;
    };
}