<template>
    <tr class="payment-item">
        <td class="amount">{{ item.text }}</td>
        <td>{{ item.due | price }}</td>
        <td class="status">
            <template v-if="item.paid == 0">
                <v-chip small class="ma-1" >
                    <v-avatar left>
                        <v-icon small>block</v-icon>
                    </v-avatar>
                    Not Paid&nbsp;&nbsp;
                </v-chip>
            </template>
            <template v-else-if="isPaid">
                <v-chip small class="ma-1" color="success" text-color="white" >
                    <v-avatar left>
                        <v-icon small>check_circle_outline</v-icon>
                    </v-avatar>
                    Paid
                    <template v-if="showPaymentDate && item.payment_date">
                        on {{ item.payment_date | date }}
                    </template>
                    &nbsp;&nbsp;
                </v-chip>
            </template>
            <template v-else>
                <v-chip small class="ma-1" >
                {{ item.paid | price }} / {{ item.due | price }}&nbsp;&nbsp;
                </v-chip>
            </template>
        </td>
        
        <td class="controls">
            <v-btn v-if="toggleButton" @click="$emit('toggle-click', item)" outlined :color="isPaid ? 'red': 'green'" x-small>
                {{ isPaid ? 'Mark as Not Paid' : 'Mark as Paid' }}
            </v-btn>
        </td>
    </tr>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        toggleButton: {
            type: Boolean,
            default: false
        },
        showPaymentDate: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isPaid(){
            return (this.item.paid - this.item.due) > -0.005;
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-item{
    td{
        padding: 5px 0;
        border-bottom: 1px solid #d4d4d4;
    }
    td.amount{
        font-weight: bold;
    }
    td.status{
        text-align: right;
    }
    td.controls{
        text-align: right;
    }
    &:last-child td{
        border-bottom: none;
    }
}
</style>