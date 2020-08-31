<template>
    <v-dialog v-model="open" fullscreen hide-overlay width="500px" transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="darkgrey" dense elevation="1">
                <v-icon class="mr-2">business</v-icon>
                <v-toolbar-title>{{ client.business_name }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="open = false" title="Close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <div class="client-profile">
                <v-tabs v-model="tabIndex" background-color="darkgrey" dark>
                    <v-tab>Core Informations</v-tab>
                    <v-tab>Expenses</v-tab>
                    <v-tab>Documents</v-tab>
                    <v-tab>Settings</v-tab>

                    <v-tab-item>
                        <CoreTab :client="client" :template="template" />
                    </v-tab-item>

                    <v-tab-item>
                        <ExpensesTab :client="client" />
                    </v-tab-item>

                    <v-tab-item>
                        <DocumentsTab :client="client" />
                    </v-tab-item>

                    <v-tab-item>
                        <SettingsTab :client="client" @delete-client-click="deleteClientClick" />
                    </v-tab-item>

                </v-tabs>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import CoreTab from '../components/client-profile/CoreTab';
import ExpensesTab from '../components/client-profile/ExpensesTab';
import SettingsTab from '../components/client-profile/SettingsTab';
import DocumentsTab from '../components/client-profile/DocumentsTab';

export default {
    components: {
        CoreTab,
        ExpensesTab,
        SettingsTab,
        DocumentsTab
    },
    data: () => ({
        open: false,
        client: {},
        template: {},
        tabIndex: 0,
    }),
    methods: {
        handle(client, template){
            this.client = client;
            this.template = template;
            this.tabIndex = 0;
            this.open = true;
        },
        async deleteClientClick(){
            if(await confirm(`Delete client "${this.client.business_name}" ?`)){
                try {
                    await this.client.remove();
                    await alert('Client successfully deleted!', 'Success');
                    this.open = false;
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
            }
        },
    },
    created(){
        window.openClientProfile = (client, template) => this.handle(client, template);
        // setTimeout(() => this.open = true, 500);
    }
}
</script>

<style lang="scss" scoped>
.client-profile{
    height: calc(100vh - 48px);
}
</style>