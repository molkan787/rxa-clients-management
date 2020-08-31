<template>
    <Modal title="Manage Client's Payments" :open="open" :maxWidth="800" @okClick="open = false" okButtonText="Close" :cancelButtonText="null">
        <div class="client-payments-modal">
            <div class="items">
                <table class="items">
                    <PaymentItem class="item" v-for="(item, index) in invoices" :key="item.text + index" @toggle-click="toggleItemPaid" toggleButton :item="item" />
                </table>
            </div>
            <div class="controls pa-2">
                <v-select :loading="loading" :readonly="loading" v-model="year" label="Year" :items="yearsItems"/>
                <v-divider></v-divider>
                <h4>Total paid</h4>
                <h3>{{ totalPaid | price }} / {{ totalDue | price }}</h3>
                <div class="spacer"></div>
                <v-btn @click="printClick" elevation="0" block>
                    <v-icon left>print</v-icon>
                    Print
                </v-btn>
            </div>
        </div>
    </Modal>
</template>

<script>
import printjs from 'print-js';
import Modal from '../templates/Modal';
import PaymentItem from './PaymentItem';
import { PaymentsService } from '../../services/Payments.service';
import { year } from '../../helpers/time';
import ClientsController from '../../controllers/Clients.controller';
const _year = year();
export default {
    components: {
        Modal,
        PaymentItem
    },
    watch: {
        year(){
            this.loadData();
        }
    },
    data: () => ({
        open: false,
        loading: false,
        client: null,
        year: _year,
        totalPaid: 0,
        totalDue: 0,
        invoices: [],
        yearsItems: (' ').repeat(20).split('').map((v, i) => _year - i)
    }),
    methods: {
        async toggleItemPaid(invoice){
            const isPaid = (invoice.paid - invoice.due) > -0.005;
            await ClientsController.setPayment(this.client, !isPaid, invoice.year, invoice.month);
            await this.loadData(true);
        },
        handle(client){
            this.client = client;
            this.year = _year;
            this.totalDue = client.data.total_fee;
            this.open = true;
            this.loadData();
        },
        async loadData(skipClearing){
            this.loading = true;
            if(!skipClearing) this.invoices = [];
            const invoices = await PaymentsService.getClientInvoices(this.client, parseInt(this.year));
            this.totalPaid = invoices.reduce((total, invoice) => total + invoice.paid, 0);
            this.invoices = invoices;
            this.loading = false;
        },
        printClick(){
            const p = val => this.$options.filters.price(val);
            const items = this.invoices.map(({ text, paid, due }) => ({
                text,
                status: paid == 0 ? 'Not Paid' : ((paid - due) > -0.005 ? 'Paid' : `${p(paid)} / ${p(due)}`)
            }));
            printjs({
                printable: items,
                properties: [
                    { field: 'text', displayName: 'Date' },
                    { field: 'status', displayName: 'Status' }
                ],
                header: `<h3>Payment history for:<br>${this.client.business_name}</h3>`,
                type: 'json'
            })
        },
    },
    created(){
        window.manageClientPayments = client => this.handle(client);
    }
}
</script>

<style lang="scss" scoped>
.client-payments-modal{
    height: 450px;
    display: flex;
    flex-direction: row;
    .items{
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        table{
            width: 100%;
            border-collapse: collapse;
        }
    }
    .controls{
        width: 250px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .spacer{
            width: 100%;
            flex-grow: 130 !important;
        }
    }
}
</style>