<template>
    <v-navigation-drawer
        color="dark-grey"
        permanent
        absolute
        dark
      >
        <v-list
          dense
          nav
          class="py-0"
        >
            <v-list-item two-line class="px-0">
                <v-list-item-avatar>
                <img src="@/assets/icons/user.png">
                </v-list-item-avatar>

                <v-list-item-content>
                <v-list-item-title>
                    {{ Session.fullname || Session.username }}
                    <v-btn @click="logoutClick" style="float: right" x-small outlined color="white">Logout</v-btn>
                </v-list-item-title>
                <v-list-item-subtitle>{{ Session.username }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="my-divider"></v-divider>

            <v-list-item-group v-model="current" active-class="white--text" >
                <NavigationItem
                    v-for="item in items"
                    :key="item.title"
                    :item="item"
                />
            </v-list-item-group>

        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SessionController from '../controllers/Session.controller';
import NavigationItem from './NavigationItem';
export default {
    components: {
        NavigationItem
    },
    computed: {
        ...mapState(['Session']),
        ...mapGetters(['isLimitedUser']),
        items(){
            const clients = { component: 'Clients', title: 'Clients', icon: 'business' };
            const account = { component: 'Account', title: 'Account', icon: 'account_circle' };
            const activeReminders = { component: 'ActiveReminders', title: 'Active Reminders', icon: 'notifications_active' };
            return this.isLimitedUser ? [
                clients,
                activeReminders,
                { divider: true },
                account
            ] : [
                clients,
                { component: 'LtdMonthlyDue', title: 'LTD Monthly Due List', icon: 'location_city' },
                activeReminders,
                { divider: true },
                { component: 'Users', title: 'Users', icon: 'people_outline' },
                account,
                { component: 'Setting', title: 'Setting', icon: 'settings', no_pad: true },
            ]
        }
    },
    data:() => ({
        current: null,
    }),
    watch: {
        current(newItem, oldItem){
            if(newItem == undefined){
                this.$nextTick(() => this.current = oldItem);
                return;
            }
            this.$emit('navigation', newItem);
        }
    },
    methods: {
        async logoutClick(){
            if(await confirm('Do you want to logout?')){
                this.logout();
            }
        },
        logout(){
            SessionController.logout();
        }
    },
    created(){
        this.current = this.items[0];
    }
}
</script>

<style scoped>
.my-divider{
    margin-bottom: 5px;
}
</style>