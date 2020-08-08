<template>
    <div class="client-activities">
        <h4>Activities</h4>
        <div class="items">
            <div class="item" v-for="(item, index) in items" :key="item.date + index">
                {{ item.date | datetime }} <br>
                <span>{{ item.user }}</span> {{ item.text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        items: [
            {
                date: '2020-08-03T19:16:45.828Z',
                user: 'user2',
                text: 'added payment (£2000.00)',
            },
            
            {
                date: '2020-08-03T14:23:47.828Z',
                user: 'user2',
                text: 'edit this client',
            },
            
            {
                date: '2020-08-02T19:16:45.828Z',
                user: 'admin',
                text: 'created this client',
            }
        ]
    })
}
</script>

<style lang="scss" scoped>
.client-activities{
    height: 100%;
    box-sizing: border-box;
    .items{
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        .item{
            color: #3e3e3e;
            font-size: 14px;
            margin-bottom: 10px;
            span{
                font-weight: bold;
            }
        }
    }
}
</style>