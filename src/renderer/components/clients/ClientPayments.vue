<template>
    <div class="client-payments">
        <h4>
            Payments
            <v-btn @click="addPaymentClick" outlined small color="primary" class="add-btn" elevation="0">
                <v-icon left small>add</v-icon>
                Make payment
            </v-btn>
            <v-btn @click="manageClick" color="primary" outlined small class="add-btn mr-1" elevation="0">
                <v-icon left small>edit</v-icon>
                Manage
            </v-btn>
        </h4>
        <table class="items" :class="{empty: invoices.length == 0}">
            <PaymentItem class="item" v-for="(item, index) in invoices" :key="item.text + index" :item="item" />
            <EmptyPlaceholder v-if="invoices.length == 0" asTableCell />
        </table>
        <AddClientPaymentModal ref="addPaymentModal" :client="client" />
    </div>
</template>

<script>
import ClientsController from '../../controllers/Clients.controller';
import AddClientPaymentModal from './AddClientPaymentModal';
import PaymentItem from './PaymentItem';
import { PaymentsService } from '../../services/Payments.service';
import { year, monthNames } from '../../helpers/time';
export default {
    components: {
        AddClientPaymentModal,
        PaymentItem
    },
    props: {
        client: {
            type: Object,
            required: true,
        }
    },
    watch: {
        'client._id'(){
            this.update();
        },
        'client.data.outstanding_fee'(){
            this.update();
        },
        'client.data.payment_plan'(){
            this.update();
        }
    },
    computed: {
        paymentPlan(){
            return this.client.data.payment_plan || 'monthly';
        }
    },
    data: () => ({
        fetchObservable: null,
        invoices: []
    }),
    methods: {
        manageClick(){
            manageClientPayments(this.client);
        },
        detailsClick(item){
            alert(NOT_READY);
        },
        addPaymentClick(){
            this.$refs.addPaymentModal.handle(this.client);
        },
        update(){
            this.invoices = [];
            this.loadInvoices();
            // setTimeout(() => manageClientPayments(this.client), 500)
        },
        async loadInvoices(){
            this.invoices = await PaymentsService.getClientInvoices(this.client, year())
            // if(this.fetchObservable) this.fetchObservable.unsubscribe();
            // this.fetchObservable = PaymentsModel.getClientPayments(this.client._id)
            //     .$.subscribe(payments => this.items = payments);
        }
    },
    mounted(){
        this.update();
    }
}
</script>

<style lang="scss" scoped>
.client-payments{
    .add-btn{
        float: right;
    }
    .items{
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
        &.empty{
            height: calc(100% - 40px);
        }
    }
}
</style>