import "primeflex/primeflex.css";
//import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
//import "primevue/resources/primevue.min.css"; /* Deprecated */
import "primeicons/primeicons.css";

//import './style.css'


import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'

createApp(App).use(PrimeVue).mount('#app')
