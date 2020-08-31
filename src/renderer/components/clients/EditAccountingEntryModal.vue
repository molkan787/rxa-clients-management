<template>
    <Modal title="Edit Expense" :open="open" :loading="loading" @okClick="saveClick"
        okButtonText="Save" @cancelClick="open = false">
        <v-form ref="form">
            <FormField v-model="form.date" :rules="rules.date" text="Date" type="date" />
            <v-select v-model="form.category" :rules="rules.category" :items="categories" label="Category" />
            <v-text-field v-model.number="form.amount" :rules="rules.amount" label="Amount (£)" />
            <v-textarea v-model="form.note" label="Note/Comment" />
        </v-form>
    </Modal>
</template>

<script>
import Modal from '../templates/Modal';
import FormField from '../templates/FormField';
import { createRules } from '../../helpers/rules';
export default {
    components: {
        Modal,
        FormField
    },
    data: () => ({
        open: false,
        loading: false,
        form: {
            date: '',
            category: '',
            note: '',
            amount: 0,
        },
        entry: null,
        categories: [],
        rules: {
            date: createRules({ name: 'Date', required: true }),
            category: createRules({ name: 'Category', required: true }),
            amount: createRules({ name: 'Amount', required: true, min: 1 }),
        }
    }),
    methods: {
        saveClick(){
            if(this.$refs.form.validate()){
                this.save();
            }
        },
        async save(){
            this.loading = true;
            try {
                await this.entry.update({
                    $set: this.form
                })
                this.open = false;
            } catch (error) {
                console.error(error);
                alert(GENERAL_ERROR);
            }
            this.loading = false;
        },
        handle(entry, categories){
            this.entry = entry;
            this.categories = categories;
            Object.patch(this.form, entry, ['date', 'category', 'note', 'amount']);
            this.$refs.form && this.$refs.form.resetValidation();
            this.loading = false;
            this.open = true;
        },
    }
}
</script>