<template>
    <div class="client-core-data">
        <div class="prop" v-for="prop in template.props" :key="prop.value">
            <span>{{ prop.text }}</span>
            <h4>
                <template v-if="editing[prop.value]">

                    <FormField v-model="editvalues[prop.value]" @blur="inputBlur(prop)"
                        :type="prop.type" class="input" poor autofocus />

                    <v-btn @click="saveClick(prop)" class="save-btn"
                        color="primary" rounded small elevation="0">
                        <v-icon small left>save</v-icon>
                        Save
                    </v-btn>

                </template>
                <template v-else>
                    {{ getPropValue(prop) }}
                </template>

                <v-btn @click="editClick(prop)" v-if="!editing[prop.value] && isEditable(prop)"
                    :title="`Edit ${prop.text}`" class="edit-btn"
                    color="primary" fab x-small elevation="0">
                    <v-icon>edit</v-icon>
                </v-btn>
            </h4>
        </div>
    </div>
</template>

<script>
import FormField from '../templates/FormField';
import ClientsModel from '../../models/Clients.model';
import ClientsController from '../../controllers/Clients.controller';
export default {
    components: {
        FormField,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        },
        'not_editable': {
            type: Array,
            default: () => ['data.outstanding_fee'],
        }
    },
    data: () => ({
        editing: {},
        editvalues: {},
    }),
    methods: {
        isEditable(prop){
            return !this["not_editable"].includes(prop.value);
        },
        saveClick(prop){
            const raw_val = this.editvalues[prop.value];
            const val = prop.type == 'number' ? parseFloat(raw_val) : raw_val;
            ClientsController.setClientDataField(this.data._id, prop.value, val)
            .catch(err => {
                console.error(err);
                alert(GENERAL_ERROR);
            })
        },
        editClick(prop){
            const proppath = prop.value;
            this.$set(this.editvalues, proppath, Object.getPathedValue(this.data, prop.value));
            this.$set(this.editing, proppath, true);
        },
        inputBlur(prop){
            setTimeout(() => this.editing[prop.value] = false, 200);
        },
        getPropValue(prop){
            const { value, type } = prop;
            let val = Object.getPathedValue(this.data, value);
            if(type == 'currency') val = this.$options.filters.price(val);
            else if(type == 'date' && val) val = this.$options.filters.date(val);
            return val || '---';
        },
    }
}
</script>

<style lang="scss" scoped>
.client-core-data{
    display: grid;
    grid-template-columns: repeat(2, calc((100% - 1rem) / 2));
    grid-column-gap: 1rem;
    grid-row-gap: 1.5rem;
    grid-auto-rows: max-content;
    .prop{
        display: inline-block;
        span{
            font-size: 13px;
            color: #696969;
        }
        h4{
            font-size: 16px;
            color: #4e4e4e;
        }
        &:hover{
            .edit-btn{
                opacity: 1;
            }
        }
    }
    .edit-btn{
        float: right;
        transform: scale(0.8);
        margin-top: -8px;
        transition: opacity 0.25s;
        opacity: 0;
    }
    .save-btn{
        float: right;
        margin-top: 6px;
    }
    .input{
        margin-top: -10px;
    }
}
</style>