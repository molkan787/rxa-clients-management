<template>
    <div class="account-page pa-2">
        <h2>Account</h2>
        <v-form class="info-grid">
            <v-text-field readonly :value="user.username" label="Username"/>
            <v-text-field readonly :value="user.fullname" label="Fullname" placeholder="fullname"/>
            <v-text-field readonly :value="user.usertype" label="User Type"/>
            <v-text-field readonly :value="user.created_at | datetime" label="Created at"/>
        </v-form>
        <v-divider></v-divider>
        <h3>Change password</h3>
        <v-form class="password-form" ref="password" >
            <v-text-field v-model="form.current" dense type="password" :rules="rules.current" placeholder="xxxxxx" label="Current password" validate-on-blur />
            <v-text-field v-model="form.new_password" dense type="password" :rules="rules.new_password" placeholder="xxxxxx" label="New password" validate-on-blur />
            <v-text-field v-model="form.repeat_new" dense type="password" :rules="rules.repeat_new" placeholder="xxxxxx" label="Repeat new password" validate-on-blur />
            <v-btn @click="changePasswordClick" elevation="0" color="primary" block>Change password</v-btn>
        </v-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { createRules } from '../helpers/rules';
import UsersModel from '../models/Users.model';

export default {
    computed: mapState({
        user: state => state.Session.user,
    }),
    data: () => ({
        form: {
            current: '',
            new_password: '',
            repeat_new: '',
        },
        rules: {
            current: [],
            new_password: [],
            repeat_new: [],
        },
        loading: false,
    }),
    methods: {
        changePasswordClick(){
            if(this.$refs.password.validate()){
                this.changePassword();
            }
        },
        async changePassword(){
            this.loading = true;
            try {
                const success = await UsersModel.changeUserPassword(this.user.username, this.form);
                if(success){
                    alert('Password was successfully changed', 'Success');
                    this.clearForm();
                }else{
                    alert('Invalid current password', 'Error');
                }
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        },
        clearForm(){
            this.form = {
                current: '',
                new_password: '',
                repeat_new: '',
            }
        }
    },

    created(){
        const prules = createRules({ name: 'Password', minLength: 6, maxLength: 100 });
        const mprules = val => !val || this.form.new_password == this.form.repeat_new || 'Passwords does not much';
        this.rules.current = prules;
        this.rules.new_password = prules;
        this.rules.repeat_new = [...prules, mprules];
    }
}
</script>

<style lang="scss" scoped>
.account-page{
    h2{
        color: rgb(66, 66, 66);
    }
    .info-grid{
        display: grid;
        grid-template-columns: repeat(2, calc((100% - 2rem) / 2));
        grid-column-gap: 2rem;
        width: 400px;
    }
    h3{
        margin: 10px 0 20px 0;
    }
    .password-form{
        width: 400px;
        div.v-input{
            margin-bottom: 20px;
        }
    }
}
</style>