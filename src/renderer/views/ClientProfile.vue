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
                <ClientCoreData :data="client" :template="template" />
                <v-divider vertical></v-divider>
                <ClientPayments />
                <v-divider vertical></v-divider>
                <ClientActivities />
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import ClientCoreData from '../components/clients/ClientCoreData';
import ClientPayments from '../components/clients/ClientPayments';
import ClientActivities from '../components/clients/ClientActivities';
export default {
    components: {
        ClientCoreData,
        ClientPayments,
        ClientActivities
    },
    data: () => ({
        open: false,
        client: {},
        template: {},
    }),
    methods: {
        handle(client, template){
            this.client = client;
            this.template = template;
            this.open = true;
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
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: calc(100vh - 48px);
    & > div{
        flex: 1;
    }
    hr{
        margin: 0 20px;
    }
}
.client-core-data{
    max-width: 550px;
}
</style>