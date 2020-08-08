<template>
    <v-text-field
        @blur="$emit('blur', $event)"
        @input="$emit('input', $event)"
        :value="value"
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
        }
    }
}
</script>