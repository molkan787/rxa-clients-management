<template>
    <div class="client-profile-settings-tab">
        <v-card class="column" elevation="0" width="400px">
            <v-card-title>Client Area Account</v-card-title>
            <v-card-text>

                <template v-if="account">
                    <v-text-field :value="account.username" label="Username" readonly />
                    <v-btn @click="changePasswordClick" elevation="0" block>Change password</v-btn>
                </template>
                <template v-else>
                    <v-btn @click="setupAccountClick" :loading="clientAccountLoading" elevation="0" color="primary">Setup account</v-btn>
                </template>

            </v-card-text>
            <GetPasswordModal ref="getPasswordModal" />
        </v-card>
        <v-divider vertical></v-divider>
        <v-card elevation="0" width="400px">
            <v-card-title>Payment Plan</v-card-title>
            <v-card-text>
                <v-radio-group v-model="settings.paymentPlan" mandatory>
                    <v-radio label="Monthly Plan" value="monthly"></v-radio>
                    <v-radio label="Yearly Plan" value="yearly"></v-radio>
                    <v-overlay v-if="paymentPlanLoading" absolute color="white">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </v-overlay>
                </v-radio-group>
            </v-card-text>
        </v-card>

        <template v-if="!isLimitedUser">
            <v-divider vertical></v-divider>
            <v-card elevation="0" width="400px">
                <v-card-title>
                    Access
                    <v-spacer></v-spacer>
                    <v-btn @click="addUserAccessClick" small outlined color="grey">
                        <v-icon left>add</v-icon>
                        Add user
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    Specify which users can access this client <br>
                    <div class="users">
                        <div v-for="user in settings.users_with_access" :key="user.username" class="user-item">
                            {{ user.username }}
                            <v-icon @click="removeUserAccessClick(user)" :title="`Revoke access to this client for user '${user.username}'`">block</v-icon>
                        </div>
                        <div v-if="settings.users_with_access.length == 0">
                            <div class="no-data">
                                There isn't any user with access right for this client
                            </div>
                        </div>
                    </div>
                    <SelectUserModal ref="selectUserModal" />
                </v-card-text>
            </v-card>
            <v-divider vertical></v-divider>
            <v-card elevation="0" width="400px">
                <v-card-title>Client</v-card-title>
                <v-card-text>
                    <v-btn @click="$emit('delete-client-click')" elevation="0">
                        <v-icon left small>delete</v-icon>
                        Delete this client
                    </v-btn>
                </v-card-text>
            </v-card>
        </template>

    </div>
</template>

<script>
import ClientsAccountModel from '../../models/ClientsAccounts.model';
import GetPasswordModal from './GetPasswordModal';
import SelectUserModal from './SelectUserModal';
import UsersModel from '../../models/Users.model';
import { mapGetters } from 'vuex';
import ClientsController from '../../controllers/Clients.controller';
export default {
    components: {
        GetPasswordModal,
        SelectUserModal
    },
    props: {
        client: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(['isLimitedUser']),
        clientPlan(){
            return this.client.data.payment_plan || 'monthly';
        }
    },
    watch: {
        client(){
            this.update();
        },
        'settings.paymentPlan'(plan){
            if(plan != this.clientPlan){
                this.saveClientPlan();
            }
        }
    },
    data: () => ({
        account: null,
        observable: null,
        userObservable: null,
        clientAccountLoading: false,
        paymentPlanLoading: false,
        settings: {
            paymentPlan: 'monthly',
            users_with_access: []
        }
    }),
    methods: {
        async addUserAccessClick(){
            const user = await this.$refs.selectUserModal.handle();
            if(user){
                try {
                    await UsersModel.addClientToUser(user, this.client._id);
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
            }
        },
        async removeUserAccessClick(user){
            if(await confirm(`Revoke access to this client for user '${user.username}' ?`)){
                try {
                    await UsersModel.removeClientFromUser(user, this.client._id);
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
            }
        },
        async saveClientPlan(){
            this.paymentPlanLoading = true;
            try {
                await ClientsController.setClientDataField(this.client._id, 'data.payment_plan', this.settings.paymentPlan);
                // await this.client.atomicSet('data.payment_plan', this.settings.paymentPlan);
            } catch (error) {
                this.$nextTick(() => this.settings.paymentPlan = this.clientPlan);
                console.error(error);
                alert(GENERAL_ERROR);
            }
            setTimeout(() => this.paymentPlanLoading = false, 1000)
        },
        async changePasswordClick(){
            const password = await this.$refs.getPasswordModal.handle({
                title: 'Change client\'s account password',
                text: 'Set a new password for client area account',
            });
            if(!password) return;
            this.clientAccountLoading = true;
            try {
                await ClientsAccountModel.changeAccountPassword(this.client._id, password);
                alert('Password was successfully changed', 'Success');
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.clientAccountLoading = false;
        },
        async setupAccountClick(){
            const password = await this.$refs.getPasswordModal.handle({
                title: 'Setup account',
                text: 'Set a password for client area account',
            });
            if(!password) return;
            this.clientAccountLoading = true;
            try {
                await ClientsAccountModel.createAccount(this.client._id, password);
                alert('Client account was successfully created', 'Success');
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.clientAccountLoading = false;
        },
        loadData(){
            this.observable && this.observable.unsubscribe();
            this.observable = ClientsAccountModel.getAccountByClientId(this.client._id)
                .$.subscribe(doc => this.account = doc);

            this.userObservable && this.userObservable.unsubscribe();
            this.userObservable = UsersModel.getUsers({
                clients: {
                    $all: [this.client._id]
                },
            }).$.subscribe(users => this.settings.users_with_access = users);

        },
        update(){
            this.loadData();
            this.settings.paymentPlan = this.clientPlan;
        }
    },
    mounted(){
        this.update();
    }
}
</script>

<style lang="scss" scoped>
.client-profile-settings-tab{
    display: flex;
    flex-direction: row;
    height: calc(100vh - 96px);
    hr{
        margin: 20px 0;
        min-height: calc(100% - 40px);
        max-height: calc(100% - 40px);
    }
    .users{
        .user-item{
            width: 100%;
            padding: 10px 0;
            &:not(:last-child){
                border-bottom: 1px solid rgb(212, 212, 212);
            }
            i{
                float: right;
                cursor: pointer;
            }
        }
    }
    .no-data{
        font-size: 17px;
        font-style: italic;
        text-align: center;
        padding: 20px;
    }
}
</style>