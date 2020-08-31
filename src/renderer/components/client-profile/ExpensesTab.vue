<template>
    <div class="client-profile-expenses-tab">
        <div class="date-items">
            <v-data-table
                class="my-table"
                :headers="headers"
                :items="items"
                :loading="loading"
                >

                <template v-slot:item="{ item }">
                    <tr>
                        <td class="text-start">{{ item.date | date }}</td>
                        <td class="text-start">{{ categoriesDictionary[item.category] || item.category }}</td>
                        <td class="text-start">{{ item.note || '---' }}</td>
                        <td class="text-start ra">{{ item.amount | price }}</td>
                        <td class="text-start ra">
                            <v-btn @click="deleteItemClick(item)" small outlined color="red">Delete</v-btn>
                            <v-btn @click="editItemClick(item)" small outlined color="blue">Edit</v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <EditEntryCategoriesModal ref="categoriesModal" />
            <EditAccountingEntryModal ref="editAccountingEntryModal" />
        </div>
        <div class="controlls">
            <FormField v-model="filters.dateFrom" type="date" text="Date from" />
            <FormField v-model="filters.dateTo" type="date" text="Date to" />
            <v-select v-model="filters.category" label="Category" :items="categories" />
            <v-btn @click="applyFiltersClick" block elevation="1">Apply filters</v-btn>
            <v-divider></v-divider>
            <h3>Total</h3>
            <h3>{{ total | price }}</h3>
            <v-spacer></v-spacer>
            <v-btn @click="printClick" block elevation="1" class="mb-1">
                <v-icon>print</v-icon>
                Print
            </v-btn>
            <v-btn @click="editCategoriesClick" block elevation="1">Edit Categories</v-btn>
        </div>
    </div>
</template>

<script>
import AccountingEntriesModel from '../../models/AccountingEntries.model';
import FormField from '../templates/FormField';
import EditEntryCategoriesModal from './EditEntryCategoriesModal';
import { oneWeekAgoJSON, todayJSON } from '../../helpers/time';
import EntriesCategoriesModel from '../../models/EntriesCategories.model';
import EditAccountingEntryModal from '../clients/EditAccountingEntryModal';
import printJS from 'print-js';
export default {
    components: {
        FormField,
        EditEntryCategoriesModal,
        EditAccountingEntryModal
    },
    props: {
        client: {
            type: Object,
            required: true,
        }
    },
    watch: {
        client(){
            this.items = [];
            this.loadCategories();
            this.loadData();
        }
    },
    data: () => ({
        loading: false,
        headers: [
            { text: 'Date', value: 'date' },
            { text: 'Category', value: 'category' },
            { text: 'Note/Comment', value: 'note' },
            { text: 'Amount', value: 'amount' },
            { text: ' ', value: '-' }
        ],
        categories: [
            {
                value: null,
                text: 'All'
            }
        ],
        categoriesDictionary: {},
        items: [],
        total: 0,
        observable: null,
        catsObservable: null,
        filters: {
            dateFrom: null,
            dateTo: null,
            category: null,
        }
    }),
    methods: {
        editItemClick(item){
            this.$refs.editAccountingEntryModal.handle(item, this.categories.slice(1))
        },
        async deleteItemClick(item){
            if(await confirm('Delete the expense?')){
                await item.remove();
            }
        },
        applyFiltersClick(){
            this.loadData();
        },
        editCategoriesClick(){
            this.$refs.categoriesModal.handle(this.client);
        },
        loadData(){
            this.loading = true;
            this.observable && this.observable.unsubscribe();
            const query = AccountingEntriesModel.getClientEntries(this.client._id, this.filters);
            this.observable = query.$.subscribe(docs => {
                this.items = docs;
                this.update();
                this.loading = false;
            });
        },
        loadCategories(){
            this.filters.category = null;
            this.categories = [ { text: 'All', value: null } ];
            this.catsObservable && this.catsObservable.unsubscribe();
            const query = EntriesCategoriesModel.getClientCategories(this.client._id);
            this.catsObservable = query.$.subscribe(doc => {
                if(doc && doc.items && doc.items.length){
                    this.categories = [
                        { text: 'All', value: null },
                        ...doc.items
                    ]
                }
                this.updateCategoriesDictionary();
            });
        },
        update(){
            this.total = this.items.reduce((total, entry) => total + entry.amount, 0);
        },
        updateCategoriesDictionary(){
            const categoriesDictionary = {};
            this.categories.forEach(c => c.value && (categoriesDictionary[c.value] = c.text));
            this.categoriesDictionary = categoriesDictionary;
        },
        initial(){
            this.filters.dateFrom = oneWeekAgoJSON();
            this.filters.dateTo = todayJSON();
            this.loadCategories();
            this.loadData();
        },
        printClick(){
            const items = this.items.map(({ date, category, note, amount }) => ({
                date: this.$options.filters.date(date),
                category: this.categoriesDictionary[category] || category,
                note: note || '---',
                amount: this.$options.filters.price(amount)
            }));
            printJS({
                printable: items,
                properties: [
                    { field: 'date', displayName: 'Date' },
                    { field: 'category', displayName: 'Category' },
                    { field: 'note', displayName: 'Note' },
                    { field: 'amount', displayName: 'Amount' }
                ],
                type: 'json',
                header: `<h3>Expenses list for:<br>${this.client.business_name}</h3>`
            })
        }
    },
    mounted(){
        this.initial();
    },
    beforeDestroy(){
        this.observable && this.observable.unsubscribe();
    }
}
</script>

<style lang="scss" scoped>
.client-profile-expenses-tab{
    display: flex;
    flex-direction: row;
    height: calc(100vh - 96px);
    .date-items{
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        td.ra{
            text-align: right !important;
        }
    }
    .controlls{
        width: 300px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        .spacer{
            flex-grow: 1000!important;
        }
    }
    hr{
        margin: 20px 0;
    }
}
</style>

<style>
.client-profile-expenses-tab .my-table th:last-child{
    text-align: right !important;
}
</style>