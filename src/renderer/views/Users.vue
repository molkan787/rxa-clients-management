<template>
    <div>
        <PageHeader @searchInput="searchUsers" searchPlaceholder="Search users">
            <v-btn @click="createUserClick" elevation="0" color="primary">
                <v-icon left>add_circle</v-icon>
                Create user
            </v-btn>
        </PageHeader>
        <v-data-table :headers="headers" :items="items">
            <template v-slot:item.created_at="{ item }">
                {{ item.created_at | date }}
            </template>
            <template v-slot:item.options="{ item }">
                <v-btn @click="editClick(item)" elevation="0" color="blue" outlined  small>Edit</v-btn>
                <v-btn @click="deleteClick(item)" elevation="0" color="red" outlined small>Delete</v-btn>
            </template>
        </v-data-table>
        <EditUserModal ref="editUserModal" />
    </div>
</template>

<script>
import PageHeader from '../components/templates/PageHeader';
import EditUserModal from '../components/EditUserModal';
import UsersModel from '../models/Users.model';
export default {
    components: {
        PageHeader,
        EditUserModal
    },
    data: () => ({
        headers: [
            { text: 'Username', value: 'username' },
            { text: 'Type', value: 'usertype' },
            { text: 'Full Name', value: 'fullname' },
            { text: 'Created At', value: 'created_at' },
            { text: '', value: 'options' },
        ],
        items: []
    }),
    methods: {
        createUserClick(){
            this.$refs.editUserModal.edit();
        },
        editClick(user){
            this.$refs.editUserModal.edit(user);
        },
        async deleteClick(user){
            if(await confirm(`Delete user "${user.username}" ?`)){
                UsersModel.deleteUser(user.username);
            }
        },
        searchUsers(search){
            console.log(search)
        },
        loadItems(){
            UsersModel.getUsers().$.subscribe(docs => {
                this.items = docs.map(doc => doc.toJSON()).filter(u => u.username != 'admin');
            });
        }
    },
    mounted(){
        this.loadItems();
    }
}
</script>