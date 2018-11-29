import * as admin from 'firebase-admin';
/**
 * @abstract Firestore API service handling initialization and CRUD access
 * 
 * @author Chase
 */
export default class FirestoreService {

    static DB;
    static USER_PATH = 'users';
    constructor() {
        
        // init firebase access
        admin.initializeApp( {
            credential : admin.credential.cert({
             projectId : '<YOUR PROJECT ID>',
           clientEmail : '<YOUR CLIENT EMAIL>',
            privateKey : '-----BEGIN PRIVATE KEY-----\n<YOUR PRIVATE KEY>\n-----END PRIVATE KEY-----\n'
            }),
           databaseURL : "<YOUR DATABASE URL>"
        });
        const DB = admin.firestore();
        const settings = { timestampsInSnapshots : true};
        DB.settings( settings);
        FirestoreService.DB = DB;
    }

    // persist a document to a given db, collection by a given document key
    _persistDocument = async ( db, colName, key, documentObj) => {
        const SUCCESS = 'success',
                ERROR = 'error';
         const result = { status : '', message : ''};

        if ( db && colName && key && documentObj) {
            const jsonObj = JSON.parse( documentObj);
            db.collection( colName).doc( key).set({
                jsonObj
            })
            .then( () => {
                result.status = SUCCESS;
            })
            .catch( ( error) => {
                result.status = ERROR;
               result.message = error;
            });
        }
        return result;
    };

    // gets a document from a given collection by a given document key
    _getDocument = async ( db, colName, key) => {
        let result = {};

        if ( db && colName && key) {
            const docRef = db.collection( colName).doc( key);
            const DOC_RESOLVE = await docRef.get();
            if ( DOC_RESOLVE && DOC_RESOLVE.data()) {
                result = DOC_RESOLVE.data().jsonObj;
            }
        }
        return result;
    };
}