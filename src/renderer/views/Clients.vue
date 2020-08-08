<template>
    <div class="clients-page">
        <PageHeader>
            <v-btn @click="addClientClick" color="primary" elevation="0">
                <v-icon left>add</v-icon>
                Add client
            </v-btn>
        </PageHeader>
        <v-data-table
            :headers="headers"
            :items="clients"
            item-key="_id"
            :expanded="[]"
            show-expand>

            <template v-slot:item="{ item, headers, isExpanded, expand }">
                <tr>
                    <td class="text-start" v-for="h in headers" :key="h.value" :colspan="h.value == '_' ? 2 : 1" :style="'display:'+(h.value == '__' ? 'none' : 'default')">
                        <template v-if="h.value == 'data-table-expand'">
                            <i @click="expand(!isExpanded)" :class="'mdi-chevron-' + (isExpanded ? 'up' : 'down')" role="button" class="v-icon notranslate v-data-table__expand-icon v-icon--link mdi theme--light"></i>
                        </template>
                        <template v-else-if="h.value == '_'">
                            <v-btn @click="openClient(item)" outlined color="primary" small>Open Profile</v-btn>
                            <v-btn @click="deleteClick(item)" outlined color="red" small>Delete</v-btn>
                        </template>
                        <template v-else-if="h.type == 'currency'">
                            {{ getPropValue(item, h.value) | price_minimal }}
                        </template>
                        <template v-else>
                            {{ getPropValue(item, h.value) }}
                        </template>
                    </td>
                </tr>
            </template>

            <template v-slot:expanded-item="{ item }">
                <tr>
                    <template v-for="h in expandedHeaders">
                        <td class="expanded-row-td" :key="h.value">
                            <span>{{ h.text }}</span> <br>
                            {{ getPropValue(item, h.value) }}
                        </td>
                    </template>
                </tr>
            </template>

        </v-data-table>
        <AddClientModal ref="addClientModal" />
    </div>
</template>

<script>
import PageHeader from '../components/templates/PageHeader';
import AddClientModal from '../components/AddClientModal';
import ClientsModel, { ClientsTemplates } from '../models/Clients.model';
import ClientsTemplatesData from '../templates/Clients.templates';
export default {
    components: {
        AddClientModal,
        PageHeader,
    },
    computed: {
        template(){
            return ClientsTemplatesData[this.currentTemplateName];
        },
        headers(){
            const { props, table } = this.template;
            const headers = props.filter(prop => table.primary_fields.includes(prop.value));
            headers.push(
                { text: ' ', value: '_', sortable: false },
                { text: ' ', value: '__', sortable: false }
            );
            return headers;
        },
        expandedHeaders(){
            const { props, table } = this.template;
            const headers = props.filter(prop => !table.primary_fields.includes(prop.value));
            headers.unshift({ text: '', value: '_'})
            return headers;
        }
    },
    data: () => ({
        currentTemplateName: ClientsTemplates.LTD_COMPANIES,
        clients: [],
        clientsObservable: null,
    }),
    methods: {
        openClient(client){
            openClientProfile(client, this.template);
        },
        async deleteClick(client){
            if(await confirm(`Delete client "${client.business_name}" ?`)){
                try {
                    await client.remove();
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
            }
        },
        getPropValue(item, propPath){
            if(propPath == '_' || propPath == '__') return ' ';
            return Object.getPathedValue(item, propPath) || '---';
        },
        addClientClick(){
            this.$refs.addClientModal.handle(this.currentTemplateName);
        },
        loadClients(){
            ClientsModel.getClients(this.currentTemplateName).$.subscribe(docs => {
                this.clients = docs; //docs.map(doc => doc.toJSON());
                openClientProfile(docs[0], this.template)
            })
        }
    },
    mounted(){
        this.loadClients();
    }
}
</script>

<style lang="scss" scoped>
.my-card, .clients-page{
    height: 100%;
}
.expanded-row-td{
    span{
        color: rgba(0,0,0,.54);
    }
    padding: 10px 16px 50px 16px;
    vertical-align: top;
}
</style>

<style>
.clients-page .v-data-table tbody tr.v-data-table__expanded__content{
    box-shadow: none !important;
}
</style>