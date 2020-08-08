<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelClick" v-if="cancelButtonText">{{ cancelButtonText }}</v-btn>
          <v-btn color="blue darken-1" text @click="okClick">{{ okButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
window.GENERAL_ERROR = '747cd15d-1e9e-4605-82f4-c776d3a6ed70';

export default {
    data:() => ({
        open: false,
        title: '',
        text: '',
        okButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }),

    methods: {
        okClick(){
            this.open = false;
            this.resolve(true)
        },
        cancelClick(){
            this.open = false;
            this.resolve(false)
        },

        handleRequest(title, text, type, options){
            const o = options || {};
            this.title = title;
            this.text = text;
            if(type == 'confirm'){
                this.okButtonText = o.okButtonText || 'YES';
                this.cancelButtonText = o.cancelButtonText || 'NO';
            }else{
                this.okButtonText = 'OK';
                this.cancelButtonText = '';
            }
            this.open = true;
        },

        alert(text, title){
            if(text == GENERAL_ERROR){
                text = 'An error occured, Please try again';
                title = 'Error';
            }
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(title || 'Info', text, 'alert');
            });
        },
        confirm(text, title, options){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(title || 'Confirm', text, 'confirm', options);
            });
        }
    },

    created(){
        window.alert = (text, title) => this.alert(text, title);
        window.confirm = (text, title, options) => this.confirm(text, title, options);
    }
}
</script>