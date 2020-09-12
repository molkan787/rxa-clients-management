<template>
    <Modal :open="open" :loading="loading" title="Add Payment" okButtonText="Add" @okClick="okClick" @cancelClick="open = false">
        <v-form ref="form" lazy-validation>
            <FormField v-model.number="formData.amount" :rules="formRules.amount" text="Amount" type="currency" validate-on-blur />
            <FormField v-model="formData.date" :rules="formRules.date" text="Date" type="date" validate-on-blur />
            <!-- <FormField v-model.trim="formData.note" text="Note" /> -->
        </v-form>
    </Modal>
</template>

<script>
import Modal from '../templates/Modal';
import FormField from '../templates/FormField';
import { createRules } from '../../helpers/rules';
import ClientsController from '../../controllers/Clients.controller';
export default {
    components: {
        Modal,
        FormField,
    },
    data: () => ({
        open: false,
        loading: false,
        client: null,
        formData: {},
        formRules: {
            amount: createRules({ name: 'Amount', required: true, min: 1, max: 100000000 })
        }
    }),
    methods: {
        okClick(){
            if(this.$refs.form.validate()){
                this.addPayment();
            }
        },
        async addPayment(){
            this.loading = true;
            try {
                await ClientsController.makePayment(this.client, parseFloat(this.formData.amount), this.formData.date);
                this.open = false;
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        },
        handle(client){
            this.reset();
            this.client = client;
            this.open = true;
        },
        reset(){
            this.formData = {
                amount: '',
                date: ''
            };
            this.$refs.form && this.$refs.form.resetValidation();
        }
    }
}
</script>