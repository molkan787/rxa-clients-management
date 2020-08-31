<template>
    <div class="client-profile-core-tab pane">
        <ClientCoreData :data="client" :template="template" />
        <v-divider vertical></v-divider>
        <ClientReminders :client="client" />
        <v-divider vertical></v-divider>
        <ClientPayments :client="client" />
    </div>
</template>

<script>
import ClientCoreData from '../clients/ClientCoreData';
import ClientPayments from '../clients/ClientPayments';
import ClientReminders from '../clients/ClientReminders';

export default {
    components: {
        ClientCoreData,
        ClientPayments,
        ClientReminders
    },
    props: {
        client: {
            type: Object,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>
.client-profile-core-tab{
    .client-core-data{
        max-width: 550px;
    }
    &.pane{
        display: flex;
        justify-content: space-between;
        padding: 20px;
        height: calc(100vh - 96px);
        & > div{
            flex: 1;
        }
        hr[aria-orientation="vertical"]{
            margin: 0 20px;
        }
        hr[aria-orientation="horizontal"]{
            margin: 20px 0;
        }
        .section > div{
            height: calc((100% - 42px) / 2);
        }
    }
}
</style>