<template>
    <div class="setting-page">
        <v-tabs background-color="darkgrey" dark>
            <v-tab>Import Data</v-tab>
            <v-tab-item>
                <v-card elevation="0" width="400px">
                    <v-card-title>Import Clients</v-card-title>
                    <v-card-text>
                        <v-file-input v-model="excel_file" :disabled="loading" label="Excel file" placeholder="excel file" />
                        <v-btn @click="importClick" block elevation="0" color="primary" :loading="loading">Import</v-btn>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import path from 'path';
import ClientsController from '../controllers/Clients.controller';
export default {
    data:() => ({
        loading: false,
        excel_file: null,
    }),
    watch: {
        excel_file(val){
            console.log(val)
        }
    },
    methods: {
        async importClick(){
            if(this.validate()){
                this.loading = true;
                try {
                    await ClientsController.importClients(this.excel_file.path);
                    alert('Clients got successfully imported!', 'Success');
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
                this.loading = false;
            }
        },
        validate(){
            const ext = this.excel_file && path.extname(this.excel_file.path);
            if(!this.excel_file || (ext != '.xls' && ext != '.xlsx')){
                alert('Please select an excel file', 'Error');
                return false;
            }else{
                return true;
            }
        }
    }
}
</script>