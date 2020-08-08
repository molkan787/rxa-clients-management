<template>
    <div class="page-header">
        <div class="search-side">
            <v-text-field @input="$emit('searchInput', $event)" :placeholder="searchPlaceholder" outlined dense hide-details class="white" prepend-inner-icon="search" />
        </div>
        <div class="buttons-side">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        searchPlaceholder: {
            type: String,
            default: 'Quick search'
        }
    },
}
</script>

<style lang="scss" scoped>
.search-side{
    display: inline-block;
}
.buttons-side{
    display: inline-block;
    float: right;
}
</style>