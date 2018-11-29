import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import FirestoreService from './FirestoreService';
import LocationService from './LocationService';

/**
 * @abstract Server-side api router implemented via express
 * and hosted via firebase serverless function
 * 
 * @author Chase
 */

// init persistence layer access
const FIRE = new FirestoreService();
  const DB = FirestoreService.DB;

// init location access
const LOC = new LocationService();

// init express
const APP = express();
const MAIN = express();
MAIN.use( '/api/v1', APP);
MAIN.use( bodyParser.json());
MAIN.use( bodyParser.urlencoded( { extended: false }));

// init firebase function handler, export as serverless function
export const weatherApi = functions.https.onRequest( MAIN);

const INVALID_REQ = 'Invalid request.';
// init weather app by device id get
APP.get( '/weather/:deviceId', ( req, res) => {

    if ( req && req.params && req.params.deviceId) {
        FIRE._getDocument( DB, FirestoreService.USER_PATH, req.params.deviceId)
        .then( doc => {
            res.status( 200).send( doc);
        })
        .catch( error => {
            console.log( error);
            res.send( INVALID_REQ)
        });
    } else {
        res.send( INVALID_REQ);
    }
});

// post weather app database update by device id
APP.post( '/weather/:deviceId', ( req, res) => {

    if ( req && req.params && req.params.deviceId && req.body) {
        FIRE._persistDocument( DB, FirestoreService.USER_PATH, req.params.deviceId, req.body)
        .then( doc => {
            res.status( 200).send( doc)
        })
        .catch( error => {
            console.log( error);
            res.send( INVALID_REQ);
        });
    } else {
        res.send( INVALID_REQ);
    }
});

// geocode location by location string get
APP.get( '/location/:locationText', ( req, res) => {

    if ( req && req.params && req.params.locationText) {
        LOC._geocodeLocationAsync( req.params.locationText)
        .then( doc => {
            res.status( 200).send( doc)
        })
        .catch( error => {
            console.log( error);
            res.send( INVALID_REQ)
        });
    } else {
        res.send( INVALID_REQ);
    }
});
