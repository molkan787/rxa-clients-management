<template>
    <Modal title="Add Reminder" @okClick="okClick" @cancelClick="open = false" okButtonText="Add" :open="open" :loading="loading">
        <v-form ref="form">
            <v-text-field v-if="client" :value="client.business_name" label="Client" readonly hide-details />
            <v-radio-group v-model="formData.type" row>
                <div class="v-label theme--light" style="width: 100%;left: 0px;right: auto;position: relative;font-size: 13px !important;">Reminder type</div>
                <br>
                <v-radio label="Custom" value="text"></v-radio>
                <v-radio label="Fee Reminder (Periodic)" value="payment"></v-radio>
            </v-radio-group>
            <template v-if="formData.type == 'text'">
                <FormField v-model="formData.date" :rules="rules.date" text="Date" type="date" />
                <v-text-field v-model.trim="formData.content.title" :rules="rules.title" label="Title" placeholder="Reminder's title" />
                <v-textarea v-model.trim="formData.content.body" :rules="rules.body" label="Text" placeholder="Reminder's text" />
            </template>
            <template v-else-if="formData.type == 'payment'">
                <v-select v-model="options.schedule" label="Schedule" :items="shcedules" />
            </template>
            <v-switch v-model="formData.notify_client" v-if="client" color="primary" label="Show this reminder to the client" />
        </v-form>
    </Modal>
</template>

<script>
import Modal from './templates/Modal';
import { createRules, NO_SPECIAL_CHARS } from '../helpers/rules';
import RemindersModel from '../models/Reminders.model';
import FormField from './templates/FormField';
import { RemindersService } from '../services/Reminders.service';
export default {
    components: {
        Modal,
        FormField,
    },
    data: () => ({
        open: false,
        loading: true,
        client: null,
        formData: {},
        options: {},
        rules: {
            date: createRules({ name: 'Date', required: true }),
            title: createRules({ name: 'Title', minLength: 3, maxLength: 200 }),
            body: createRules({ name: 'Text', required: false, maxLength: 500 })
        },
        shcedules: [
            { value: 'monthly', text: 'Monthly' },
            { value: 'quarterly', text: 'Quarterly' },
            { value: 'yearly', text: 'Yearly' },
        ]
    }),
    methods: {
        okClick(){
            if(this.$refs.form.validate()){
                this.editReminder();
            }
        },
        async editReminder(){
            this.loading = true;
            try {
                await RemindersService.addReminder({
                    ...this.formData,
                    client_id: this.client ? this.client._id : null,
                }, this.options);
                await alert('Reminder was successfully added!', 'Success');
                this.open = false;
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        },
        clearForm(){
            this.formData = {
                type: 'text',
                date: '',
                content: {
                    title: '',
                    body: '',
                },
                notify_client: true,
            },
            this.options = {
                schedule: 'monthly'
            }
        },
        handle(data){
            const { client } = data || {};
            this.client = client || null;
            this.clearForm();
            this.$refs.form && this.$refs.form.resetValidation();
            this.loading = false;
            this.open = true;
        }
    },
    created(){
        this.clearForm();
        window.editReminder = data => this.handle(data);
    }
}
</script>