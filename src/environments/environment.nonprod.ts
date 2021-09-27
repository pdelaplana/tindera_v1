// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  application: {
    name: 'Tindera',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyBustFYJNVrXVLcbluoQ1DsiQ-VEgT-ynE',
    authDomain: 'tindera-nonprod.firebaseapp.com',
    projectId: 'tindera-nonprod',
    storageBucket: 'tindera-nonprod.appspot.com',
    messagingSenderId: '25024561704',
    appId: '1:25024561704:web:be8931cf46679adc152b1d',
    measurementId: 'G-BNRHTPF7EB'
  },
  firebaseApiKey: 'AIzaSyBustFYJNVrXVLcbluoQ1DsiQ-VEgT-ynE',
  authUrl:        'https://identitytoolkit.googleapis.com/v1/',
  refreshUrl:     'https://securetoken.googleapis.com/v1/token',
  baseUrl:        'https://localhost:44371/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
