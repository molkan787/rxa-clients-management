<template>
    <div class="clients-page">
        <PageHeader v-model="search">
            <template v-slot:left-side>
                <div>
                    <v-tabs dense>
                        <v-tab
                            v-for="template in templates"
                            :key="template.value"
                            @click="currentTemplateName = template.value"
                        >{{ template.text }}</v-tab>
                    </v-tabs>
                </div>
            </template>
            <v-btn v-if="!isLimitedUser" @click="addClientClick" color="primary" elevation="0">
                <v-icon left>add</v-icon>
                Add client
            </v-btn>
        </PageHeader>
        <div style="width:100%;height: 10px">
            <AddClientModal ref="addClientModal" />
        </div>
        <ClientsListTable :loading="loading" :template="template" :clients="clients" :reminders="reminders" :search="search" />
    </div>
</template>

<script>
import PageHeader from '../components/templates/PageHeader';
import AddClientModal from '../components/AddClientModal';
import ClientsListTable from '../components/clients/ClientsListTable';
import ClientsModel, { ClientsTemplates } from '../models/Clients.model';
import ClientsTemplatesData from '../templates/Clients.templates';
import RemindersModel from '../models/Reminders.model';
import { daysDiff } from '../helpers/time';
import { mapGetters } from 'vuex';
import { ReminderTypes } from '../services/Reminders.service';
export default {
    components: {
        AddClientModal,
        PageHeader,
        ClientsListTable
    },
    computed: {
        ...mapGetters(['isLimitedUser']),
        template(){
            return ClientsTemplatesData[this.currentTemplateName];
        }
    },
    watch: {
        currentTemplateName(){
            this.search = '';
            this.loadClients();
        }
    },
    data: () => ({
        templates: [],
        currentTemplateName: ClientsTemplates.LTD_COMPANIES,
        totalClientsCount: 0,
        clients: [],
        reminders: {},
        clientsObservable: null,
        reminersObservable: null,
        clientsQuery: null,
        remindersQuery: null,
        search: '',
        loading: false,
    }),
    methods: {
        addClientClick(){
            this.$refs.addClientModal.handle(this.currentTemplateName);
        },
        unsubscribe(){
            if(this.clientsObservable) this.clientsObservable.unsubscribe();
            if(this.reminersObservable) this.reminersObservable.unsubscribe();
        },
        subscribe(){
            this.unsubscribe();
            if(this.clientsQuery){
                this.clientsObservable = this.clientsQuery.$.subscribe(docs => {
                    this.clients = docs;
                    this.loadReminders();
                    // openClientProfile(docs[0], this.template);
                    // editReminder({ client: docs[0] })
                }); 
            }
        },
        // async loadClients(){
        //     this.loading = true;
        //     this.clients = [];
        //     this.clients = await ClientsModel.getClients(this.currentTemplateName).exec();
        //     await this.loadReminders();
        //     this.loading = false;
        // },
        // async loadReminders(){
        //     const clients_ids = this.clients.map(client => client._id);
        //     const docs = await RemindersModel.getRemindersByBulkClients(clients_ids, {
        //         archived: false,
        //         type: {
        //             $ne: ReminderTypes.PAYMENT
        //         }
        //     }).exec();
        //     this.reminders = this.mapReminders(docs);
        // },
        loadClients(){
            this.loading = true;
            this.unsubscribe();
            this.clients = [];
            this.clientsQuery = ClientsModel.getClients(this.currentTemplateName);
            this.subscribe(); 
        },
        loadReminders(){
            const clients_ids = this.clients.map(client => client._id);
            if(this.reminersObservable) this.reminersObservable.unsubscribe();
            this.reminersObservable = RemindersModel.getRemindersByBulkClients(clients_ids, {
                archived: false,
                type: {
                    $ne: ReminderTypes.PAYMENT
                }
            })
            .$.subscribe(docs => {
                this.reminders = this.mapReminders(docs);
                this.loading = false;
            });
        },
        mapReminders(items){
            const map = {};
            for(let item of items){
                const { client_id } = item;
                if(!(map[client_id] instanceof Array)){
                    map[client_id] = [];
                }
                map[client_id].push(item);
            }
            return map;
        }
    },
    mounted(){
        this.loadClients();
    },
    created(){
        const names = Object.values(ClientsTemplates);
        const templates = [];
        for(let name of names){
            templates.push({
                value: name,
                text: ClientsTemplatesData[name].title,
            })
        }
        this.templates = templates;
    },
    activated(){
        this.subscribe();
    },
    deactivated(){
        this.unsubscribe();
    }
}
</script>

<style lang="scss" scoped>
.clients-page{
    height: 100%;
    display: flex;
    flex-direction: column;
}
.my-card{
    height: 100%;
}
.templates-switcher{
    margin-left: 10px;
    button{
        height: 40px !important;
        padding: 0 20px !important;
    }
}
.v-tabs{
    margin-top: -8px !important;
    margin-left: 8px !important;
}
</style>
