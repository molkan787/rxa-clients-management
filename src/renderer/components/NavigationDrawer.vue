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
                <v-list-item
                    v-for="item in items" :key="item.title" link >
                    <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>

        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import SessionController from '../controllers/Session.controller';
export default {
    computed: mapState(['Session']),
    data:() => ({
        current: 0,
        items: [
            // { component: 'Dashboard', title: 'Dashboard', icon: 'dashboard' },
            { component: 'Clients', title: 'Clients', icon: 'business' },
            { component: 'Users', title: 'Users', icon: 'people_outline' },
            { component: 'Account', title: 'Account', icon: 'account_circle' },
        ],
    }),
    watch: {
        current(){
            this.$emit('navigation', this.items[this.current]);
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
    }
}
</script>

<style scoped>
.my-divider{
    margin-bottom: 5px;
}
</style>