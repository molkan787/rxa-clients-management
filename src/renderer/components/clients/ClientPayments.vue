<template>
    <div class="client-payments">
        <h4>Payments</h4>
        <table class="items">
            <tr class="item" v-for="(item, index) in items" :key="item.date + index">
                <td class="amount">{{ item.amount | price }}</td>
                <td class="date">{{ item.date | date }}</td>
                <td class="controls">
                    <v-btn outlined color="primary" small>Attachement</v-btn>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data: () => ({
        items: [
            {
                date: '2020-08-03T19:16:45.828Z',
                amount: 2500,
            },
            {
                date: '2020-08-02T19:16:45.828Z',
                amount: 1000,
            },
            {
                date: '2020-08-02T19:16:45.828Z',
                amount: 3000,
            }
        ]
    })
}
</script>

<style lang="scss" scoped>
.client-payments{
    .items{
        width: 100%;
        margin-top: 10px;
        .item{
            td{
                padding-bottom: 10px;
            }
            td.amount{
                font-weight: bold;
            }
            td.date{
                text-align: center;
            }
            td.controls{
                text-align: right;
            }
        }
    }
}
</style>