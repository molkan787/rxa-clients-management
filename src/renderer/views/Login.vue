<template>
    <div class="login-page">
        <div class="cell">
            <div class="wrapper">
                <h2 class="header">Rxa Clients Management</h2>
                <v-card class="pa-2" color="darkgrey" dark elevation="0">
                    <v-card-title>Login</v-card-title>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field validate-on-blur v-model="username" :disabled="loading" :rules="rules.username" dense outlined label="Username" placeholder="username"></v-text-field>
                            <v-text-field validate-on-blur v-model="password" :disabled="loading" :rules="rules.password" dense outlined label="Password" placeholder="password" type="password"></v-text-field>
                        </v-form>
                        <v-btn @click="loginClick" :loading="loading" block elevation="0" color="primary">Login</v-btn>
                    </v-card-text>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script>
import { createRules, ALPHANUMERIC_ONLY } from '../helpers/rules';
import SessionController from '../controllers/Session.controller';

export default {
    data: () => ({
        loading: false,
        username: '',
        password: '',
        rules: {
            username: createRules({ name: 'Username', minLength: 3, maxLength: 50, chars: ALPHANUMERIC_ONLY }),
            password: createRules({ name: 'Password', minLength: 6, maxLength: 100 }),
        }
    }),
    methods: {
        loginClick(){
            if(this.$refs.form.validate()){
                this.login();
            }
        },
        async login(){
            this.loading = true;
            try {
                const valid = await SessionController.signin(this.username, this.password);
                if(!valid){
                    alert('Invalid username or password.', 'Login');
                }
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        }
    },
    mounted(){
        if(DEV){
            this.username = 'maxwell';
            this.password = '123456';
            this.login();
        }
    }
}
</script>

<style lang="scss" scoped>
.login-page{
    display: table;
    position: fixed;
    z-index: 190;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    .cell{
        display: table-cell;
        vertical-align: middle;
        .wrapper{
            width: 500px;
            margin: auto;
            text-align: center;
        }
    }
    .header{
        font-size: 32px;
        transform: translateY(-22px);
        background: linear-gradient(to right, #7793b5 0%, #104a92 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
</style>