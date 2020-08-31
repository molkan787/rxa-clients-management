<template>
  <v-row justify="center">
    <v-dialog :value="open" persistent :max-width="maxWidth">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
            <slot></slot>
        </v-card-text>
        <v-card-actions class="pa-4">
          <slot name="controls"></slot>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" outlined @click="cancelClick" v-if="cancelButtonText">{{ cancelButtonText }}</v-btn>
          <v-btn color="blue darken-1" dark elevation="0" @click="okClick">{{ okButtonText }}</v-btn>
        </v-card-actions>
        <v-overlay :value="loading" absolute color="white">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Modal',
        },
        okButtonText: {
            type: String,
            default: 'OK'
        },
        cancelButtonText: {
            type: String,
            default: 'Cancel'
        },
        maxWidth: {
          typee: Number,
          default: 500
        }
    },

    methods: {
        okClick(){
            this.$emit('okClick');
        },
        cancelClick(){
            this.$emit('cancelClick');
        },
    },
}
</script>
