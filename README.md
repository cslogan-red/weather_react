This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

This project was used as a playground for a simple full-stack usecase utilizing React (via Create-React-App), Express as an API layer, and Firebase Hosting, Cloud Firestore and serverless Cloud Functions handling server-side duty.

Check out a working demo at: [Demo](https://weather-app-38c57.firebaseapp.com/)

It utilizes the free [National Weather Service API](https://www.weather.gov/documentation/services-web-api), along with the Google Geocoding API (obfuscated via the API layer) for weather results (in the United States) based on any entered location. That said, it's properly isolated so that the weather or geocoding providers could be easily swapped out for anything capable of filling the model the front end expects.

Feel free to clone, fork, or do whatever!

### Note

This is not a supported app and this repo does not include all dependencies necessary for a build, development or otherwise, simply use the provided source how you will -and at your own risk- Happy coding!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
