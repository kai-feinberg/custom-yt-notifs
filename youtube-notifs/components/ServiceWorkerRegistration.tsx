// // "use client";
// // import { useEffect } from 'react';

// // export default function ServiceWorkerRegistration() {
// //   useEffect(() => {
// //     if ('serviceWorker' in navigator) {
// //       navigator.serviceWorker
// //         .register('/firebase-messaging-sw.js')
// //         .then((registration) => {
// //           console.log('Service Worker registered with scope:', registration.scope);
// //         })
// //         .catch((error) => {
// //           console.error('Service Worker registration failed:', error);
// //         });
// //     }
// //   }, []);

// //   return null; // This component doesn't render anything
// // }
// "use client";
// import { useEffect } from 'react';

// export default function ServiceWorkerRegistration() {
//   useEffect(() => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.getRegistrations().then((registrations) => {
//         if (registrations.length === 0) {
//           navigator.serviceWorker
//             .register('/firebase-messaging-sw.js')
//             .then((registration) => {
//               console.log('Service Worker registered with scope:', registration.scope);
//             })
//             .catch((error) => {
//               console.error('Service Worker registration failed:', error);
//             });
//         } else {
//           console.log('Service Worker already registered');
//         }
//       });
//     }
//   }, []);

//   return null; // This component doesn't render anything
// }
"use client";
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length === 0) {
          navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error);
            });
        } else {
          console.log('Service Worker already registered');
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}