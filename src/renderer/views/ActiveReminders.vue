<template>
    <div class="active-reminders">
        <v-data-table
            :headers="headers"
            :items="items"
            :footer-props="{'items-per-page-options': [10, 20, 50]}"
            :loading="loading">
            <template v-slot:item="{item}">
                <tr>
                    <td class="text-start">{{ item.date | date }}</td>
                    <td class="text-start">{{ item.content.title }}</td>
                    <td class="text-start">{{ clientsNames[item.client_id] || '---' }}</td>
                    <td class="text-start">
                        <v-btn @click="showDetails(item)" outlined color="green" small>Show Details</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { RemindersService } from '../services/Reminders.service'
import ClientsModel from '../models/Clients.model';
export default {
    components: {},
    data: () => ({
        headers: [
            { value: 'date', text: 'Date' },
            { value: 'title', text: 'Title', sortable: false },
            { value: 'client', text: 'Client', sortable: false },
            { value: '_', text: ' ', sortable: false }
        ],
        items: [],
        clientsNames: {},
        observable: null,
        clientObservable: null,
        query: null,
        loading: false
    }),
    methods: {
        showDetails(item){
            openReminderDetails(item);
        },
        subscribe(){
            this.unsubscribe();
            if(this.query){
                this.observable = this.query.$.subscribe(docs => {
                    this.items = docs;
                    this.loadClientsNames();
                });
            }
        },
        unsubscribe(){
            // console.log('this.observable', this.observable)
            this.observable && this.observable.unsubscribe();
            this.clientObservable && this.clientObservable.unsubscribe();
        },
        loadItems(){
            this.loading = true;
            this.query = RemindersService.getActiveReminders();
            this.subscribe();
        },
        loadClientsNames(){
            const clients_ids = this.items.map(i => i.client_id);
            this.clientObservable && this.clientObservable.unsubscribe();
            this.clientObservable = ClientsModel.getClientsByIds(clients_ids)
                .$.subscribe(docs => this.mapClientsNames(docs));
        },
        mapClientsNames(clients){
            const map = {};
            for(let client of clients){
                map[client._id] = client.business_name;
            }
            this.clientsNames = map;
            this.loading = false;
        }
    },
    mounted(){
        this.loadItems();
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
.active-reminders{
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>