<template>
    <div class="clients-list-table">
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="clients"
            item-key="_id"
            :expanded="[]"
            show-expand
            :search="my_search"
            :custom-filter="itemsFilterer"
            :footer-props="{'items-per-page-options': [10, 20, 50]}"
            >

            <template v-slot:item="{ item, headers, isExpanded, expand }">
                <tr :class="getRowClass(item)">
                    <td class="text-start" v-for="h in headers" :key="h.value"
                        :colspan="h.value == '_' ? 2 : 1" :class="h.value == '_' ? 'options-cell' : ''"
                        :style="'display:'+(h.value == '__' ? 'none' : 'default')">

                        <template v-if="h.value == 'data-table-expand'">
                            <i @click="expand(!isExpanded)" :class="'mdi-chevron-' + (isExpanded ? 'up' : 'down')" role="button" class="v-icon notranslate v-data-table__expand-icon v-icon--link mdi theme--light"></i>
                        </template>
                        <template v-else-if="h.value == '_'">
                            <v-btn @click="openClient(item)" outlined color="primary" small>Open</v-btn>
                            <v-btn @click="addReminder(item)" outlined color="green" small>Add reminder</v-btn>
                        </template>
                        <template v-else-if="h.type == 'currency'">
                            {{ getPropValue(item, h.value) | price_minimal }}
                        </template>
                        <template v-else-if="h.type == 'date'">
                            {{ getPropValue(item, h.value) | date }}
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
                            <template v-if="h.type == 'currency'">
                                {{ getPropValue(item, h.value) | price_minimal }}
                            </template>
                            <template v-else-if="h.type == 'date'">
                                {{ getPropValue(item, h.value) | date }}
                            </template>
                            <template v-else>
                                {{ getPropValue(item, h.value) }}
                            </template>
                        </td>
                    </template>
                </tr>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import { daysDiff } from '../../helpers/time';
export default {
    props: {
        clients: {
            type: Array,
            required: true,
        },
        reminders: {
            type: Object,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        },
        search: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
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
    watch: {
        search(val){
            if(this.my_searchTimeout) clearTimeout(this.my_searchTimeout);
            this.my_searchTimeout = setTimeout(() => this.my_search = val, 400);
        }
    },
    data: () => ({
        itemsFilterer(value, search, item){
            return item.no == parseInt(search) || new RegExp(search, 'i').test(item.business_name)
        },
        my_search: '',
        my_searchTimeout: null
    }),
    methods: {
        getRowClass(item){
            const reminders = this.reminders[item._id];
            if(!reminders) return '';
            const lt = reminders
                        .filter(rem => !rem.archived)
                        .reduce((lower, rem) => Math.min(daysDiff(rem.date), lower), Infinity);
            const color = lt <= 0 ? 'red lighten-4' : (lt < 7 ? 'orange lighten-4' : '');
            return color;
        },
        addReminder(client){
            editReminder({ client });
        },
        openClient(client){
            openClientProfile(client, this.template);
        },
        getPropValue(item, propPath){
            if(propPath == '_' || propPath == '__') return ' ';
            return Object.getPathedValue(item, propPath) || '---';
        },
    }
}
</script>

<style lang="scss" scoped>
.clients-list-table{
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
    .expanded-row-td{
        span{
            color: rgba(0,0,0,.54);
        }
        padding: 10px 16px 50px 16px;
        vertical-align: top;
    }
    .options-cell{
        white-space: nowrap;
    }
}
</style>

<style lang="scss">
.clients-list-table{
    .v-data-table tbody tr.v-data-table__expanded__content{
        box-shadow: none !important;
    }
    .v-data-table-header th.sortable {
        white-space: nowrap;
    }
    .v-data-table__wrapper{
        overflow-x: hidden !important;
    }
}
</style>