<template>
  <v-app>
    <NavigationDrawer @navigation="navigation" />
    <v-content class="my-content" :class="contentClass">
      <keep-alive>
        <component v-if="Session.isSignedIn" :is="currentView" />
      </keep-alive>
    </v-content>
    <ClientProfile />
    <Dialog />
    <div class="title-bar-shadow"></div>
    <EditReminderModal />
    <ReminderDetailsModal />
    <ClientPaymentsModal />
    <LoginPage v-if="!Session.isSignedIn" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import NavigationDrawer from './components/NavigationDrawer';
import Dialog from "./components/Dialog";
import Dashboard from "./views/Dashboard";
import Clients from "./views/Clients";
import Users from "./views/Users";
import ClientProfile from './views/ClientProfile';
import Account from './views/Account';
import LoginPage from './views/Login';
import Setting from './views/Setting';
import ActiveReminders from './views/ActiveReminders';
import LtdMonthlyDue from './views/LtdMonthlyDue';
import EditReminderModal from './components/EditReminderModal';
import ReminderDetailsModal from './components/ReminderDetailsModal';
import ClientPaymentsModal from './components/clients/ClientPaymentsModal';

export default {
  name: "App",
  components: {
    NavigationDrawer,
    Dialog,
    Dashboard,
    Clients,
    Users,
    ClientProfile,
    LoginPage,
    Account,
    Setting,
    ActiveReminders,
    LtdMonthlyDue,
    EditReminderModal,
    ReminderDetailsModal,
    ClientPaymentsModal
  },
  computed: {
    ...mapState(['Session']),
    contentClass(){
      return this.currentItem && this.currentItem.no_pad ? 'no-pad' : '';
    }
  },
  data:() => ({
    currentItem: null,
    currentView: 'LtdMonthlyDue',
  }),
  methods: {
    navigation(item){
      this.currentItem = item;
      this.currentView = item.component;
    }
  }
};
</script>

<style lang="scss" scoped>
$drawer-width: 256px;
.my-content {
  padding: 8px !important;
  height: 100vh;
  width: calc(100vw - #{$drawer-width});
  margin-left: $drawer-width;
  transition: none !important;
  &.no-pad{
    padding: 0 !important;
  }
}
</style>

<style>
html, body {
  overflow: hidden !important;
  padding: 0;
  margin: 0;
}
.title-bar-shadow{
  position: fixed;
  top: -2px;
  left: 0;
  width: 100vw;
  height: 2px;
  box-shadow: 0 0 2px #0000003d;
}
.theme--light.v-application{
  background-color: white !important;
}
*:not(input) {
  user-select: none;
}
h1, h2, h3, h4, h5, h6,
div:not(.v-list-item__title):not(.v-list-item):not(.v-list-item__icon):not(.v-list-item__content),
p, span:not(.v-btn__content):not(th > span), label {
  cursor: default;
}

.v-dialog--fullscreen{
  overflow: hidden !important;
}
</style>