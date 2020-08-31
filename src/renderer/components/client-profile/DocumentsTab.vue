<template>
    <div class="client-profile-documents-tab">
        <v-data-table :headers="headers" :items="items" >
            <template v-slot:item="{ item }">
                <tr>
                    <td class="text-start">
                        {{ item.name }}
                    </td>
                    <td class="text-start">
                        {{ item.created_at | datetime }}
                    </td>
                    <td class="text-start">
                        <v-btn @click="openDocument(item)" :loading="loadings[item._id]" color="primary" outlined>
                            Open
                        </v-btn>
                        <v-btn @click="deleteDocumentClick(item)" color="red" outlined>
                            Delete
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import ClientsDocumentsModel from '../../models/ClientsDocuments.model';
export default {
    props: {
        client: {
            type: Object,
            required: true
        }
    },
    watch: {
        client(){
            this.update();
        }
    },
    data: () => ({
        observable: null,
        items: [],
        loadings: {},
        headers: [
            {
                text: 'Filename',
                value: 'name'
            },
            {
                text: 'Uploaded at',
                value: 'created_at'
            },
            {
                text: ' ',
                value: '-'
            }
        ]
    }),
    methods: {
        async deleteDocumentClick(doc){
            if(await confirm(`Delete document "${doc.name}" ?`)){
                await doc.remove();
            }
        },
        async openDocument(doc){
            const id = doc._id;
            this.$set(this.loadings, id, true);
            await ClientsDocumentsModel.openDocument(doc);
            setTimeout(() => this.loadings[id] = false, 1000)
        },
        loadData(){
            this.observable && this.observable.unsubscribe();
            this.observable = ClientsDocumentsModel.getClientDocuments(this.client._id)
                .$.subscribe(docs => this.items = docs);
        },
        update(){
            this.loadData();
        }
    },
    mounted(){
        this.update();
    }
}
</script>

<style lang="scss" scoped>
.client-profile-documents-tab{
    height: calc(100vh - 96px);
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>