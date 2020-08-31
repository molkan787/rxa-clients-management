<template>
    <div class="empty-placeholder" :class="{'as-table-cell': asTableCell}">
        <span>
            <v-icon>clear_all</v-icon> <br>
            There is nothing to show here
        </span>
    </div>
</template>

<script>
export default {
    props: {
        asTableCell: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style lang="scss" scoped>
.empty-placeholder{
    height: 100%;
    width: 100%;
    text-align: center;
    display: table;
    span{
        font-size: 17px;
        font-style: italic;
        opacity: 0.6;
        i{
            font-size: 40px !important;
        }
    }
    span, &.as-table-cell{
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }
    &.as-table-cell span{
        display: inline;
    }
}
</style>