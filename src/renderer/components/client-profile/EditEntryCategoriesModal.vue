<template>
    <Modal :loading="loading" :open="open" title="Edit expenses categories" @okClick="open = false" okButtonText="Done" :cancelButtonText="null">
        <div class="edit-entry-categories">
            <h3>Existing categories</h3>
            <div class="items">
                <div class="item" v-for="(item, index) in items" :key="'cat-item'+index">
                    {{ item.text }}
                    <v-icon @click="deleteClick(item)" :title="`Delete '${item.text}'`">delete</v-icon>
                </div>
                <EmptyPlaceholder v-if="items.length == 0" />
            </div>
            <h3>Create new category</h3>
            <div class="create-category">
                <v-text-field v-model="categoryName" :readonly="loading2" placeholder="Category name" hide-details />
                <v-btn @click="createClick" :loading="loading2" elevation="0" color="primary" outlined>Create</v-btn>
            </div>
        </div>
    </Modal>
</template>

<script>
import Modal from '../templates/Modal';
import EntriesCategoriesModel from '../../models/EntriesCategories.model';
import { slugify } from '../../helpers/string';
export default {
    components: {
        Modal,
    },
    data: () => ({
        open: false,
        loading: false,
        loading2: false,
        categoryName: '',
        client: null,
        items: [
            {
                value: 'transportation',
                text: 'Transportation'
            },
            {
                value: 'office-utilities',
                text: 'Office utilities'
            }
        ],
        observable: null,
    }),
    methods: {
        async deleteClick(category){
            if(await confirm(`Delete category "${category.text}" ?`)){
                try {
                    await EntriesCategoriesModel.removeCategory(this.client._id, category);
                } catch (error) {
                    console.error(error);
                    alert(GENERAL_ERROR);
                }
            }
        },
        createClick(){
            if(this.categoryName.length < 2){
                alert('Please enter a valid category name ( at least 2 characters)', 'Error');
            }else{
                this.createCategory({
                    text: this.categoryName,
                    value: slugify(this.categoryName),
                })
            }
        },
        async createCategory(category){
            this.loading2 = true;
            try {
                await EntriesCategoriesModel.addCategory(this.client._id, category);
                this.categoryName = '';
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading2 = false;
        },
        loadData(){
            this.loading = true;
            this.items = [];
            this.observable && this.observable.unsubscribe();
            this.observable = EntriesCategoriesModel.getClientCategories(this.client._id)
                .$.subscribe(doc => {
                    this.items = (doc && doc.items) || [];
                    this.loading = false;
                });
        },
        handle(client){
            this.client = client;
            this.loadData();
            this.open = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-entry-categories{
    .items{
        margin-top: 10px;
        height: 300px;
        overflow-x: hidden;
        overflow-y: scroll;
        .item{
            font-size: 17px;
            padding: 5px 5px 5px 0;
            &:not(:last-child){
                border-bottom: 1px solid rgb(212, 212, 212);
            }
            i{
                float: right;
                cursor: pointer;
            }
        }
    }
    .create-category{
        display: flex;
        flex-direction: row;
        .v-text-field{
            flex: 1;
        }
        button{
            align-self: flex-end;
            margin-left: 5px;
        }
    }
}
</style>