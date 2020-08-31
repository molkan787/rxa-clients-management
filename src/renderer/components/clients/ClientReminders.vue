<template>
    <div class="client-reminders">
        <h4>
            Reminders
            <v-btn @click="addClick" small outlined color="green" class="add-btn" elevation="0">
                <v-icon left small>add</v-icon>
                Add Reminer
            </v-btn>
        </h4>
        <table class="items" :class="{empty: items.length == 0}">
            <tr v-for="item in items" :key="item._id" class="item" :class="getItemClass(item)">
                <td class="title" colspan="2">{{ item.content.title }}</td>
                <td class="date">{{ getDate(item) }}</td>
                <td class="controls">
                    <template v-if="item.archived">
                        <label style="font-style: italic">
                            <v-icon>done</v-icon> Done
                        </label>
                    </template>
                    <template v-else>
                        <v-btn @click="archiveClick(item)" title="Mark as Done" color="green" outlined icon small>
                            <v-icon small>done</v-icon>
                        </v-btn>
                        <v-btn @click="detailsClick(item)" small outlined color="green">Details</v-btn>
                    </template>
                </td>
            </tr>
            <EmptyPlaceholder v-if="items.length == 0" asTableCell />
        </table>
    </div>
</template>

<script>
import RemindersModel from '../../models/Reminders.model';
import { daysDiff } from '../../helpers/time';
import { RemindersService, ReminderTypes } from '../../services/Reminders.service';
export default {
    props: {
        client: {
            type: Object,
            required: true,
        }
    },
    watch: {
        client(){
            this.update();
        }
    },
    data: () => ({
        observable: null,
        items: [],
        expanded: null,
    }),
    methods: {
        getDate(item){
            if(item.type == ReminderTypes.STM_APRIL_ACCT_DUE){
                return 'April ' + item.date.split('-')[0];
            }else{
                return this.$options.filters.date(item.date);
            }
        },
        async archiveClick(item){
            if(await confirm(`Do you want to mark this reminder "${item.content.title}" as done?`)){
               try {
                   await RemindersService.archiveReminder(item);
               } catch (error) {
                   console.error(error);
                   alert(GENERAL_ERROR);
               }
            }
        },
        detailsClick(item){
            openReminderDetails(item)
        },
        getItemClass(item){
            if(item.archived) return 'archived';
            if(item.type == ReminderTypes.PAYMENT) return '';
            const lt = daysDiff(item.date);
            const color = lt <= 0 ? 'red lighten-4' : (lt < 7 ? 'orange lighten-4' : '');
            return color;
        },
        addClick(){
            editReminder({
                 client: this.client,
            })
        },
        loadItems(){
            if(this.observable) this.observable.unsubscribe();
            this.observable = RemindersModel.getRemindersByClient(this.client._id)
                .$.subscribe(docs => {
                    this.items = this.sortItems(docs);
                });
        },
        sortItems(items){
            const active = [];
            const simple = [];
            const archived = [];
            for(let i = 0; i < items.length; i++){
                const item = items[i];
                if(item.archived) archived.push(item);
                else if(item.type == ReminderTypes.PAYMENT) simple.push(item);
                else active.push(item);
            }
            return active.concat(simple, archived);
        },
        update(){
            this.items = [];
            this.loadItems();
        }
    },
    mounted(){
        this.update();
    }
}
</script>=

<style lang="scss" scoped>
.client-reminders{
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
        .item{
            td{
                padding: 5px;
                border-bottom: 1px solid #d4d4d4;
                &.title{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                    font-size: 17px !important;
                }
                &.date{
                    text-align: center;
                }
                &.controls{
                    text-align: right;
                    white-space: nowrap;
                }
            }
            &:last-child td{
                border-bottom: none;
            }
            &.archived{
                opacity: 0.7;
            }
        }
    }
}
</style>