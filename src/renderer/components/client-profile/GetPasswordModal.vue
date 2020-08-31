<template>
    <Modal :open="open" :title="options.title" @okClick="okClick" @cancelClick="cancelClick">
        <h4>{{ options.text }}</h4>
        <v-form>
            <v-text-field v-model="formData.password" type="password" label="New Password" placeholder="password" />
            <v-text-field v-model="formData.repeat_password" type="password" label="Repeat New Password" placeholder="password" />
        </v-form>
    </Modal>
</template>

<script>
import Modal from '../templates/Modal';
export default {
    components: {
        Modal
    },
    data: () => ({
        open: false,
        callback: null,
        formData: {},
        options: {}
    }),
    methods: {
        okClick(){
            if(this.validateForm()){
                this.callback(this.formData.password);
                this.callback = null;
                this.open = false;
            }
        },
        handle(options){
            this.options = options;
            return new Promise(resolve => {
                this.callback = resolve;
                this.clearForm();
                this.open = true;
            });
        },
        validateForm(){
            const { password, repeat_password } = this.formData;
            if(password.length < 5 || repeat_password.length < 5){
                alert('Please enter both password & repeat (At least 5 characters)', 'Error');
            }else if(password != repeat_password){
                alert('Passwords does not match', 'Error');
            }else{
                return true;
            }
            return false;
        },
        clearForm(){
            this.formData = {
                password: '',
                repeat_password: '',
            }
        },
        cancelClick(){
            this.callback(null);
            this.callback = null;
            this.open = false;
        }
    },
    mounted(){
        // setTimeout(() => this.handle({
        //     title: 'Setup account',
        //     text: 'Set a password for client area account',
        // }), 500);
    }
}
</script>