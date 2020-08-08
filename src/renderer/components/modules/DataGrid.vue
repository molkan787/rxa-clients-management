<template>
    <div class="module-data-grid">
        <div class="prop" v-for="prop in template.props" :key="prop.value">
            <span>{{ prop.text }}</span>
            <h4>
                {{ getPropValue(prop) }}
                <v-btn @click="editClick(prop)" v-if="prop.value != 'no'"
                    :title="`Edit ${prop.text}`" class="edit-btn"
                    color="primary" fab x-small elevation="0">
                    <v-icon>edit</v-icon>
                </v-btn>
            </h4>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        },
        editable: {}
    },
    data: () => ({
        editing: {}
    }),
    methods: {
        editClick(prop){
            const proppath = prop.value;
            this.editing[proppath] = true;
        },

        getPropValue(prop){
            const { value, type } = prop;
            let val = Object.getPathedValue(this.data, value);
            if(type == 'currency') val = this.$options.filters.price(val);
            return val || '---';
        },
    }
}
</script>

<style lang="scss" scoped>
.module-data-grid{
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
}
</style>