import "primeflex/primeflex.css";
//import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
//import "primevue/resources/primevue.min.css"; /* Deprecated */
import "primeicons/primeicons.css";

//import './style.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'

const app = createApp(App);

import Tooltip from 'primevue/tooltip';

app.directive('tooltip', Tooltip);


app.use(PrimeVue).mount('#app')
