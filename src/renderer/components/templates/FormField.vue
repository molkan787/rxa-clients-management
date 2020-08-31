<template>
    <v-text-field
        @blur="$emit('blur', $event)"
        @input="input($event)"
        :value="myvalue"
        :type="inputType"
        :label="text"
        :placeholder="text"
        :prefix="prefix"
        :rules="rules"
        :readonly="readonly"
        :hide-details="poor"
        :single-line="poor"
        :autofocus="autofocus"
    />
</template>

<script>
export default {
    props: [
        'value',
        'text',
        'type',
        'format',
        'rules',
        'readonly',
        'poor',
        'autofocus',
    ],
    computed: {
        inputType(){
            if(this.type == 'currency') return 'number';
            else return this.type || 'text';
        },
        prefix(){
            if(this.type == 'currency') return this.$config.currency;
            else return '';
        },
        myvalue(){
            return this.type == 'date' ? (this.value || '').split('T')[0] : this.value;
        }
    },
    methods: {
        input(value){
            if(this.type == 'date'){
                value = new Date(value).toJSON();
            }
            this.$emit('input', value);
        }
    }
}
</script>