<template>
    <div class="ltd-monthly-due">
        <PageHeader hideSearchBox>
            <template v-slot:left-side>
                <h4> {{ header }}</h4>
            </template>
            <v-btn @click="printClick" color="primary" elevation="0">
                <v-icon left>print</v-icon>
                Print
            </v-btn>
        </PageHeader>
        <div id="ltd-monthly-list-table">
            <ClientsListTable :loading="loading" :template="template" :clients="clients" :reminders="{}" />
        </div>
    </div>
</template>

<script>
import PageHeader from '../components/templates/PageHeader';
import ClientsListTable from '../components/clients/ClientsListTable';
import ClientsTemplatesData from '../templates/Clients.templates';
import ClientsModel, { ClientsTemplates } from '../models/Clients.model';
import { getMonthName } from '../helpers/time';
import printjs from 'print-js';
export default {
    components: {
        PageHeader,
        ClientsListTable
    },
    computed: {
        header(){
            return `Limited Companies monthly due list for ${this.currentMonthName}`;
        }
    },
    data: () => ({
        template: ClientsTemplatesData[ClientsTemplates.LTD_COMPANIES],
        clients: [],
        currentMonthName: '',
        clientsObservable: null,
        clientsQuery: null,
        loading: false,
    }),
    methods: {
        subscribe(){
            this.unsubscribe();
            if(this.clientsQuery){
                this.clientsObservable = this.clientsQuery.$.subscribe(docs => {
                    this.clients = docs;
                    this.loading = false;
                }); 
            }
        },
        unsubscribe(){
            this.clientsObservable && this.clientsObservable.unsubscribe();
        },
        loadClients(){
            this.loading = true;
            this.clients = [];
            this.clientsQuery = ClientsModel.getLtdMonthlyDueList();
            this.subscribe();
        },
        printClick(){
            const items = this.clients.map(client => client.toJSON());
            items.forEach(item => item.data.incorporated = this.$options.filters.date(item.data.incorporated))
            printjs({
                printable: items,
                properties: [
                    { field: 'no', displayName: 'Serial NO' },
                    { field: 'business_name', displayName: 'Business Name' },
                    { field: 'data.incorporated', displayName: 'Incorporated' }
                ],
                header: `<h3>${this.header}</h3>`,
                type: 'json'
            });
        }
    },
    mounted(){
        this.currentMonthName = getMonthName();
        this.loadClients();
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
.ltd-monthly-due{
    display: flex;
    flex-direction: column;
    height: 100%;
    h4{
        padding: 10px 0;
        color: #6b6b6b;
    }
}
</style>