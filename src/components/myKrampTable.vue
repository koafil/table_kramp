<template>
    <div class="card">
<!--        Keys: {{ findKeyArr }}-->
    <!--    {{ data1.rowData[1] }}-->
    <!--    {{ brands }}-->
    <DataTable v-model:filters="filters"
               :value="products"
               tableStyle="min-width: 50rem"
               :totalRecords="totalRecords"
               :loading="loading"
               removableSort
               filterDisplay="menu"
               dataKey="id_kramp"
               :globalFilterFields="['name', 'vendor_code']"
               resizableColumns
               columnResizeMode="fit"
               showGridlines
               :rowClass="rowClass"
               size="small"
               scrollable
               @filter = "filter"
               v-model:expandedRows="expandedRows"
    >
      <template #empty>
        <template v-if="error">Ошибка: {{ error }}</template> <template v-else>Нет записей </template>
      </template>
      <template #header>
        <div class="flex justify-content-between align-items-center flex-wrap" >
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search"> </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Поиск"  autofocus />
            </IconField>
          </div>
          <div class="flex align-items-center">
            <LastChangesDate v-model="showDate"/>
            <scan-info />
          </div>
        </div>
      </template>
      <!--      <Column field="id_kramp" header="ID" sortable></Column>-->
<!--      <Column bodyClass="py-0 w-1rem" expander ></Column>-->
      <Column field="vendor_code" header="Артикул" sortable>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='vendor_code';
                sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                sLog.showTable = true;
                sLog.showGraph = false;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
            {{ dat.data.vendor_code }}
          </div>
          </template>
      </Column>
      <Column field="name" header="Название" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
        </template>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='name';
                sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                sLog.showTable = true;
                sLog.showGraph = false;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
            {{ dat.data.name }}
          </div>
        </template>
      </Column>
      <Column body-class="relative " field="price_bir" header="Бирючинский &#8381;" sortable>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='price_bir';
                sLog.id_kramp=dat.data.id_bir;
                sLog.name=dat.data.name_bir;
                sLog.showTable = true;
                sLog.showGraph = false;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
            <div class="flex">
              <div class="z-1 flex-initial w-3rem text-right pr-1">
                {{ dat.data.price_bir }}
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column body-class="relative " field="price_liter" header="Литер &#8381;" sortable>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='price_liter';
                sLog.id_kramp=dat.data.id_liter;
                sLog.name=dat.data.name_liter;
                sLog.showTable = true;
                sLog.showGraph = false;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
            <div class="flex">
              <div class="z-1 flex-initial w-3rem text-right pr-1">
                {{ dat.data.price_liter }}
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column body-class="relative " field="price" header="&#8381;" sortable>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='price';
                sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                sLog.showTable = true;
                sLog.showGraph = true;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
          <div class="flex">
            <div class="z-1 flex-initial w-3rem text-right pr-1">
               {{ dat.data.price }}
            </div>
            <template v-if="dat.data.price_old && moment(showDate).isSameOrBefore(dat.data.price_date)">
              <div class="flex-initial w-7rem text-right pr-1 ">
                <Badge v-if="(dat.data.price - dat.data.price_old)>0"  severity='secondary'>
                  +{{(dat.data.price - dat.data.price_old).toFixed(2)}}
                  ({{ (((dat.data.price - dat.data.price_old)/dat.data.price_old)*100).toFixed(2) }}%)
                </Badge>
                <Badge v-else>
                  {{(dat.data.price - dat.data.price_old).toFixed(2)}}
                  ({{ (((dat.data.price - dat.data.price_old)/dat.data.price_old)*100).toFixed(2) }}%)
                </Badge>
              </div>
              <div>
                {{ getMessageTimeoutInDays(dat.data.price_date) }}
              </div>
            </template>

            <Tag class="z-0 w-1rem h-1rem absolute top-0 right-0"
                 v-if="dat.data.sale"
                 icon="pi pi-info-circle"
                 severity="info"
                 value=""
                 v-tooltip="{ value: 'Акция', showDelay: 500 }"
            >
            </Tag>
          </div>
          </div>
        </template>
      </Column>
      <Column field="price_base" header="&#8364;" sortable>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                sLog.tableName='price_base';
                sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                sLog.showTable = true;
                sLog.showGraph = true;
                opLog.toggle(e);
              }"
              @click="()=>{opLog.hide();}"
          >
            <div class="flex">
              <div class="z-1 flex-initial w-3rem text-right pr-1">
                {{ dat.data.price_base }}
              </div>
              <template v-if="dat.data.price_base_old && moment(showDate).isSameOrBefore(dat.data.price_base_date)">
                <div class="flex-initial w-7rem text-right pr-1 ">
                  <Badge v-if="(dat.data.price_base - dat.data.price_base_old)>0"  severity='secondary'>
                    +{{(dat.data.price_base - dat.data.price_base_old).toFixed(2)}}
                    ({{ (((dat.data.price_base - dat.data.price_base_old)/dat.data.price_base_old)*100).toFixed(2) }}%)
                  </Badge>
                  <Badge v-else>
                    {{(dat.data.price_base - dat.data.price_base_old).toFixed(2)}}
                    ({{ (((dat.data.price_base - dat.data.price_base_old)/dat.data.price_base_old)*100).toFixed(2) }}%)
                  </Badge>
                </div>
                <div>
                  {{ getMessageTimeoutInDays(dat.data.price_base_date) }}
                </div>
              </template>

            </div>
          </div>
        </template>

      </Column>
      <Column field="tovar_count" header="Количество, шт" sortable>
        <template #body="dat">
          <div class="flex"
               @contextmenu.prevent="(e)=>{
                 sLog.tableName='count';
                 sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                 sLog.showTable = true;
                 sLog.showGraph = true;
                 opLog.toggle(e);
               }"
               @click="()=>{opLog.hide();}"

          >
            <div class="flex-initial w-3rem text-right pr-1">
              {{ dat.data.tovar_count }}
            </div>
            <template v-if="dat.data.tovar_count_old && moment(showDate).isSameOrBefore(dat.data.tovar_count_date)">
              <div class="flex-initial w-4rem text-right pr-1 ">
<!--                {{(dat.data.tovar_count - dat.data.tovar_count_old)>0 ? '+':''}}{{dat.data.tovar_count - dat.data.tovar_count_old }}-->
<!--                <Chip icon="pi pi-google" label:="(dat.data.tovar_count - dat.data.tovar_count_old).toString() ">-->
<!--                <Badge severity='secondary'>-->
<!--                <Badge class:="[{ 'p-badge-warning': true }]">-->
<!--                  <Badge class='p-badge-warning'">-->
<!--                <Badge severity="{{(dat.data.tovar_count - dat.data.tovar_count_old)>0 ? 'secondary':'success' }}" >-->
                <Badge v-if="(dat.data.tovar_count - dat.data.tovar_count_old)>0"  severity='secondary'>
                  +{{dat.data.tovar_count - dat.data.tovar_count_old }}
                </Badge>
                <Badge v-else>
                  {{dat.data.tovar_count - dat.data.tovar_count_old }}
                </Badge>
              </div>
              <div>
                {{ getMessageTimeoutInDays(dat.data.tovar_count_date) }}
              </div>
            </template>
          </div>
        </template>
      </Column>
      <Column field="site"  sortable>
        <template #header>
          <TriStateCheckbox
              v-model="filters.site.checkbox" @update:model-value="value => { filters.site.value=(value===null?null:(value?1:0));}"
              class="mr-2"
          />
          <template v-if="filters.site.value === null">Все</template>
          <template v-else-if="filters.site.value == 1">Есть на сайте</template>
          <template v-else >Нет на сайте</template>
        </template>
        <template #body="dat">
          <div
              @contextmenu.prevent="(e)=>{
                 sLog.tableName='site';
                 sLog.id_kramp=dat.data.id_kramp;
                sLog.name=dat.data.name;
                 sLog.showTable = true;
                 sLog.showGraph = false;
                 opLog.toggle(e);
                 }"
              @click="()=>{opLog.hide();}"
          >
            <i v-if="dat.data.site == 1" class="pi pi-check-circle mr-1" :class="{ 'text-green-500': dat.data.tovar_count, 'text-red-500': !dat.data.tovar_count }" ></i>
            <i v-else class="pi pi-times-circle mr-1 text-gray-500"></i>
            <template v-if="dat.data.site_date_old && moment(showDate).isSameOrBefore(dat.data.site_date)">
              <template v-if="dat.data.site == 1">Добавлено </template>
              <template v-else-if="dat.data.site == 0">Удалено </template>
              {{ getMessageTimeoutInDays(dat.data.site_date) }}
            </template>
          </div>
        </template>
      </Column>
      <template #expansion="dat">
        {{ dat.data }}
      </template>
      <template #footer="dat"> Всего {{ totalRecordsFiltered ? totalRecordsFiltered : 0 }} позиций. </template>
    </DataTable>
  </div>
  <OverlayPanel ref="opLog" class="shadow-2" pt:content:class="p-0" @contextmenu.prevent="()=>opLog.hide()">
    <TabView v-if="sLog.showGraph || sLog.showTable">
      <TabPanel v-if="sLog.showGraph">
        <template #header>
          <i class="pi pi-chart-bar"></i>
        </template>
        <log-chart :table-name="sLog.tableName" :id_kramp="sLog.id_kramp"/>
      </TabPanel>
      <TabPanel v-if="sLog.showTable">
        <template #header>
          <i class="pi pi-list"></i>
          <span v-if="sLog.name" class="ml-2">{{ sLog.name }}</span>
        </template>
        <log-table :table-name="sLog.tableName" :id_kramp="sLog.id_kramp"/>
      </TabPanel>
    </TabView>
    <template v-else>
      <p class="m-3">Небыло изменений</p>
    </template>
  </OverlayPanel>

</template>
<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext'
import { useFetch} from "@vueuse/core";
import { ref, onMounted, computed, defineAsyncComponent} from 'vue';
import { FilterMatchMode } from 'primevue/api';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import TriStateCheckbox from 'primevue/tristatecheckbox'
import Tag from 'primevue/tag';
import OverlayPanel from 'primevue/overlaypanel';
import Badge from 'primevue/badge';
import Chip from 'primevue/chip';
import SplitButton from 'primevue/splitbutton';
import Calendar from 'primevue/calendar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';


import Button from 'primevue/button';
import Slider from 'primevue/slider';

import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';
import ScanInfo from "./ScanInfo.vue";
import LastChangesDate from "./LastChangesDate.vue";
import LogTable from "./LogTable.vue";
import LogChart from "./LogChart.vue";

// const ScanInfo = defineAsyncComponent(() => import("./ScanInfo.vue"))

const opLog = ref();
const sLog = ref({
  tableName: '',
  name: '',
  id_kramp: 0,
  showTable: false,
  showGraph: false
//  id_scan: 0
})
//const toggleLog = (event)=>{ opLog.value.toggle(event) };

const totalRecords = ref(0)
const totalRecordsFiltered = ref(0)
const rows = ref(10);

const products = ref([]);
const expandedRows = ref([]);

const showDate = ref(new Date((new Date()).setHours(0, 0, 0, 0)));

// //Date от текущего момента в днях
// const getDateFromTimeout = (timeoutInDays) => {
//   let datNow = new Date().setHours(0, 0, 0, 0);
//   return new Date((new Date(datNow)).setDate((new Date(datNow).getDate()+timeoutInDays)));
// }
//число дней от текущего момента
const getNumberTimeoutInDays = (dat)=>{
  return moment(dat).startOf('day').diff(moment.now(),'days');
}
//сколько прошло  дней в текстовом виде от даты
const getMessageTimeoutInDays = (dat)=>{
  let days = getNumberTimeoutInDays(dat);
    switch (days){
    case 0: return "сегодня";
    case -1: return "вчера";
  }
  return moment.duration(days,"days").humanize(true);
}
// //количество дней в текстовом виде от числа дней
// const strDays = computed(()=>{
//   let days = getNumberTimeoutInDays(showDate.value);
//   switch (days){
//     case 0: return "сегодня";
//     case -1: return "со вчера";
//   }
//   return `от ${(days*-1).toString()} дней назад` ;
// });
const filter = (ev)=>{ totalRecordsFiltered.value = ev.filteredValue.length; }
const rowClass = (data) => {
//  return [{ 'bg-gray-400': data.site == 0 }];
  return [{ 'text-400 bg-gray-100': data.site == 0 || data.tovar_count == 0 }];
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
/*  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
*/  site: { checkbox: null, value: null, matchMode: FilterMatchMode.EQUALS }

});


const url = computed(()=>{
  // return `http://192.168.50.5:3002/tovars?page=${page.value}&npp=${limit.value}&s=${findKey.value}`
//  return `http://192.168.50.5:3002/tovars?page=${page.value}&npp=${rows.value}`
//  console.log(encodeURI(JSON.stringify(props.findKeyArr)))
//  console.log(JSON.parse(decodeURI(encodeURI(JSON.stringify(props.findKeyArr)))))
//  let keys="";
//  if(props.findKeyArr.length)
//    keys=`&ss=${encodeURI(JSON.stringify(props.findKeyArr))}`;
//  return `http://192.168.50.5:3002/tovars?page=${page.value}&npp=${rows.value}${keys}`
//  return `http://192.168.50.5:3002/tovars?page=${page.value}&npp=${rows.value}&ss=${encodeURI(JSON.stringify(props.findKeyArr))}`
  return `http://192.168.50.50:3004/all`
})
const {isFetching:loading, error, data:data0 } = useFetch(url, {
  refetch: true,
  afterFetch(ctx){
    totalRecords.value=ctx.data.total;
    products.value = ctx.data.rowData;
    return ctx
  }
}).json();

</script>

<style scoped>

</style>
