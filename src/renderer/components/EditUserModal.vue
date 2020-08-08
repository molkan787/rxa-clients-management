<template>
    <Modal :loading="loading" :open="open" :title="title" @okClick="saveClick" @cancelClick="open = false" okButtonText="Save">
        <v-form :value="false" lazy-validation ref="form">
            <v-text-field :disabled="editMode" v-model.trim="formData.username" :rules="rules.username" label="Username" placeholder="username" />
            <v-text-field v-model.trim="formData.fullname" :rules="rules.fullname" label="Full name (Optional)" placeholder="full name" />
            <v-select v-model="formData.usertype" label="User type" :items="usertypes"/>
            <v-text-field v-model="formData.password" :rules="rules.password" label="Password" :placeholder="editMode ? 'password (leave empty to make no changes)' : 'password'" type="password" />
            <v-text-field v-model="formData.repeat_password" :rules="rules.repeat_password" label="Repeat Password" placeholder="repeated password" type="password" />
        </v-form>
    </Modal>
</template>

<script>
import Modal from '../components/templates/Modal';
import { createRules, ALPHANUMERIC_ONLY, NO_SPECIAL_CHARS } from '../helpers/rules';
import UsersModel from '../models/Users.model';

export default {
    components: {
        Modal,
    },
    data:() => ({
        open: false,
        loading: false,
        editMode: true,
        title: 'Create User',
        usertypes: [
            {
                text: 'Regular user',
                value: 'regular'
            },
            {
                text: 'Admin user',
                value: 'admin'
            }
        ],
        formData: {
            username: '',
            usertype: 'regular',
            fullname: '',
            password: '',
            repeat_password: '',
        },
        rules: {
            username: createRules({ name: 'Username', minLength: 3, maxLength: 50, chars: ALPHANUMERIC_ONLY }),
            fullname: createRules({ name: 'Fullname', maxLength: 100, chars: NO_SPECIAL_CHARS }),
            password: [],
            repeat_password: [],
        }
    }),
    methods: {
        createPasswordsRules(required){
            this.rules.password = createRules({ name: 'Password', minLength: 6, maxLength: 100, required });
            this.rules.repeat_password = createRules({ name: 'Password', minLength: 1, required });
            const rule = val => !val || this.formData.password == this.formData.repeat_password || 'Passwords does not much';
            this.rules.repeat_password.push(rule);
        },
        async saveClick(){
            if(!this.$refs.form.validate()) return;
            this.loading = true;
            try {
                if(this.editMode){
                    await UsersModel.editUser(this.formData);
                }else{
                    await UsersModel.createUser(this.formData);
                }
                const action = this.editMode ? 'updated' : 'created';
                await alert(`User was successfully ${action}`, 'Success');
                this.open = false;
            } catch (error) {
                if(error == 'username_exist'){
                    await alert(`Username "${this.formData.username}" is already used, please choose another.`, 'Error');
                }else{
                    console.error(error);
                    await alert(GENERAL_ERROR);
                }
            }
            this.loading = false;
        },
        edit(userData){
            const editMode = !!userData;
            this.editMode = editMode;
            this.createPasswordsRules(!editMode);
            if(userData){
                this.title = 'Edit User';
                this.loadForm(userData);
            }else{
                this.title = 'Create User';
                this.clearForm();
            }
            this.loading = false;
            this.$nextTick(() => this.open = true);
        },

        loadForm(data){
            this.clearForm();
            Object.patch(this.formData, data, ['username', 'usertype', 'fullname']);
        },

        clearForm(){
            this.$set(this, 'formData', {
                username: '',
                usertype: 'regular',
                fullname: '',
                password: '',
                repeat_password: '',
            });
            this.$refs.form && this.$refs.form.resetValidation()
        }
    },

    created(){
        
        // setTimeout(() => this.open = true, 500);
    }
}
</script>