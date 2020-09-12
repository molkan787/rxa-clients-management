<template>
    <div class="page-header">
        <div class="search-side">
            <v-text-field v-if="!hideSearchBox" :value="value" @input="$emit('input', $event)" clearable :placeholder="searchPlaceholder" outlined dense hide-details class="white" prepend-inner-icon="search" />
            <slot name="left-side"></slot>
        </div>
        <div class="buttons-side">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: '',
        },
        searchPlaceholder: {
            type: String,
            default: 'Quick search'
        },
        hideSearchBox: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss" scoped>
.search-side{
    display: inline-flex;
}
.buttons-side{
    display: inline-block;
    float: right;
}
</style>