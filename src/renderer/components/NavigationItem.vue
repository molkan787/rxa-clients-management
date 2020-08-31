<template>
    <v-divider v-if="item.divider"></v-divider>
    <v-list-group v-else-if="item.children" :value="true" :prepend-icon="item.icon">
        <template v-slot:activator>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </template>
        <NavigationItem
            v-for="child in item.children"
            :key="child.title"
            :item="child"
        />
    </v-list-group>
    <v-list-item v-else :value="item">
        <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    name: 'NavigationItem',
    props: ['item']
}
</script>