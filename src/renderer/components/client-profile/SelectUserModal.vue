<template>
    <Modal title="Select user" :open="open" :loading="loading" @okClick="okClick" @cancelClick="respond(null)">
        <v-autocomplete
            label="User"
            placeholder="Click to select a user"
            item-text="username"
            :item-value="item => item"
            :items="items"
            v-model="selected"
        />
    </Modal>
</template>

<script>
import Modal from '../templates/Modal';
import UsersModel from '../../models/Users.model';
export default {
    components: {
        Modal
    },
    data: () => ({
        open: false,
        loading: false,
        items: [],
        selected: null,
        callback: null,
    }),
    methods: {
        okClick(){
            if(this.selected){
                this.respond(this.selected);
            }else{
                alert('Please select a user', 'Error');
            }
        },
        async loadData(){
            this.loading = true;
            try {
                this.items = await UsersModel.getUsers({
                    usertype: 'regular'
                }).exec();
            } catch (error) {
                console.error(error);
                await alert('An error occured when loading users list, Please try again', 'Error');
                this.respond(null);
            }
            this.loading = false;
        },
        respond(response){
            this.callback(response);
            this.callback = null;
            this.open = false;
        },
        handle(){
            return new Promise(resolve => {
                this.callback = resolve;
                this.selected = null;
                this.loadData();
                this.open = true;
            })
        }
    }
}
</script>