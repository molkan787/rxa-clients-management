<template>
    <Modal :open="open" :loading="loading" :title="title" okButtonText="Add" maxWidth="700" @okClick="okClick" @cancelClick="open = false">
        <ClientForm ref="form" :data="formData" :template="template" formname="creation" />
    </Modal>
</template>

<script>
import Modal from './templates/Modal';
import ClientForm from './clients/ClientForm';
import ClientsTemplatesData from '../templates/Clients.templates';
import { ClientsTemplates } from '../models/Clients.model';
import ClientsModel from '../models/Clients.model';

export default {
    components: {
        Modal,
        ClientForm
    },
    data: () => ({
        open: false,
        loading: false,
        templateName: '',
        template: null,
        formData: {},
    }),
    computed: {
        title(){
            return (this.template && `Add client (${this.template.title})`) || '';
        }
    },
    methods: {
        handle(templateName){
            this.templateName = templateName;
            this.template = ClientsTemplatesData[templateName];
            this.$refs.form && this.$refs.form.reset();
            this.open = true;
        },
        okClick(){
            if(this.$refs.form.validate()){
                this.addClient();
            }
        },
        async addClient(){
            this.loading = true;
            try {
                await ClientsModel.addClient(this.formData, this.templateName);
                await alert('Client was successfully added!', 'Success');
                this.open = false;
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        }
    },

    created(){
        // setTimeout(() => this.handle(ClientsTemplates.LTD_COMPANIES), 500)
    }
}
</script>