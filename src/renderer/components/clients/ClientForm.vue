<template>
    <v-form class="double-col" ref="form">
        <template v-for="prop in props">
            <FormField
                :key="prop.value"
                :type="prop.type"
                :text="prop.text"
                :readonly="readonly[prop.value]"
                :rules="rules[prop.value]"
                v-model.trim="data[prop.value]"
            />
        </template>
    </v-form>
</template>

<script>
import { createRules } from '../../helpers/rules';
import FormField from '../templates/FormField';
export default {
    components: {
        FormField
    },
    props: {
        template: {
            type: Object,
            required: true,
        },
        formname: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        }
    },
    watch: {
        form(){
            this.update();
        }
    },
    computed: {
        readonly(){
            const result = {}
            const { readonly } = this.form;
            readonly.forEach(prop => result[prop] = true);
            return result;
        },
        rules(){
            const rules = {};
            for(let prop of this.form.required){
                rules[prop] = createRules({ name: 'This field', required: true });
            }
            return rules;
        },
        form(){
            return this.template.forms[this.formname];
        },
        props(){
            const props = this.template.props;
            const { fields, all } = this.form;
            return all ? props : props.filter(p => fields.includes(p.value));
        }
    },
    methods: {
        validate(){
            return this.$refs.form.validate();
        },
        reset(){
            this.update();
            return this.$refs.form.resetValidation();
        },
        update(){
            const { defaults } = this.form;
            for(let prop of this.props){
                this.$set(this.data, prop.value, defaults[prop.value] || '');
            }
        }
    },
    created(){
        this.update();
    }
}
</script>

<style lang="scss" scoped>
.double-col{
    display: grid;
    grid-template-columns: repeat(2, calc((100% - 2rem) / 2));
    grid-column-gap: 2rem;
}
</style>