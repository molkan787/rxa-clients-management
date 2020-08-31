import './my-polyfill';
import electron from 'electron';
const DEV = electron.remote.getGlobal('DEV');
window.electron = electron;
window.DEV = DEV;
window.DataDir = electron.remote.app.getPath('userData');
import config from './config';
window.config = config;
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import store from './store'
import vuetify from './plugins/vuetify'
import EmptyPlaceholder from './components/EmptyPlaceholder.vue';
import * as filters from './helpers/filters';
import Shell from './shell'
import Services from './services';
import { init } from './database'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$config = config;

for(let filter in filters){
  Vue.filter(filter, filters[filter]);
}
Vue.component('EmptyPlaceholder', EmptyPlaceholder);

init().then(() => {
  Services.init();
  Shell.doWork();
  new Vue({
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})
