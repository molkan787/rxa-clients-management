<template>
    <Modal title="Reminder details" :open="open" :loading="loading" @okClick="open = false" okButtonText="Close" :cancelButtonText="null">
        <div class="reminder-details-modal">
            <v-text-field hide-details :value="clientName" label="Client" readonly/>
            <v-text-field hide-details :value="clientNotified" label="Notify client" readonly/>
            <v-text-field hide-details :value="data.date | date" label="Date" readonly/>
            <v-text-field hide-details :value="data.content.title" label="Title" readonly/>
            <v-textarea hide-details :value="data.content.body" label="Content" readonly/>
            <v-text-field hide-details :value="data.created_at | datetime" label="Created at" readonly/>
        </div>
        <template v-slot:controls>
            <v-btn @click="deleteClick" left outlined color="grey">
                <v-icon left small>delete</v-icon>
                Delete reminder
            </v-btn>
        </template>
    </Modal>
</template>

<script>
import Modal from './templates/Modal';
import ClientsModel from '../models/Clients.model';
import { RemindersService } from '../services/Reminders.service';
export default {
    components: {
        Modal
    },
    computed: {
        clientNotified(){
            return this.data.notify_client ? 'Yes' : 'No'
        },
        clientName(){
            const client = this.extra.client;
            return (client && client.business_name) || '---'
        }
    },
    data: () => ({
        open: false,
        loading: false,
        data: {
            content: {}
        },
        extra: {
            client: null
        }
    }),
    methods: {
        async deleteClick(){
            if(await confirm('Delete this reminder?')){
                this.loading = true;
                try {
                    await RemindersService.removeReminder(this.data);
                    this.open = false;
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
                this.loading = false;
            }
        },
        handle(data){
            this.data = data;
            this.loadExtras();
            this.loading = false;
            this.open = true;
        },
        loadExtras(){
            ClientsModel.getClientById(this.data.client_id)
                .exec().then(client => this.extra.client = client);
        }
    },
    created(){
        window.openReminderDetails = data => this.handle(data);
    }
}
</script>

<style lang="scss" scoped>
.reminder-details-modal{
    .v-text-field {
        margin-bottom: 14px;
    }
}
</style>