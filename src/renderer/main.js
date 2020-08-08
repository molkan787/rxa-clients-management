import './my-polyfill';
import electron from 'electron';
import config from './config';
const DEV = electron.remote.getGlobal('DEV');
window.electron = electron;
window.DEV = DEV;
window.DataDir = electron.remote.app.getPath('userData');
window.config = config;
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import store from './store'
import vuetify from './plugins/vuetify'
import * as filters from './helpers/filters';
import Shell from './shell'
import { init } from './database'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$config = config;

for(let filter in filters){
  Vue.filter(filter, filters[filter]);
}

init().then(() => {
  Shell.doWork();
  new Vue({
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})
