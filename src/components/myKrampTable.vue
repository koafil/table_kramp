<template>
  <span v-if="loading || loadingScans"> Загрузка...</span>
  <span v-else-if="error|| error1"> Ошибка загрузки: {{ error }} </span>
  <div v-else class="card">
    <!--    Keys: {{ findKeyArr }}-->
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
    >
      <template #header>
        <div class="flex justify-content-between align-items-center flex-wrap" >
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search"> </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Поиск" />
            </IconField>
          </div>
          <div class="flex align-items-center">
            <span class="mr-2">Последние<br> изменения</span>
<!--            <Button class="mr-3" size="small" severity="secondary" :label="strDays" @click="toggleDays" />-->
            <SplitButton class="mr-3" size="small" severity="secondary" :label="strDays" @click="toggleDays" :model="menuDaysItems" outlined/>
            <div class="flex flex-column align-items-center" @click="toggleScans">
              <div class="card"> Получено: {{ moment(scans[0]?.date).fromNow() }} </div>
              <div> {{ moment(scans[0]?.date).format('LLL') }} </div>
            </div>
          </div>
        </div>
        <OverlayPanel ref="opDays" class="shadow-2">
<!--          <Calendar  v-model="showDate" inline :max-date="new Date()" @update:modelValue="(value)=>{ nDays=getNumberTimeoutInDays(value); }" />-->
          <Calendar  v-model="showDate" inline :max-date="new Date()" @update:modelValue="toggleDays"/>
        </OverlayPanel>
        <OverlayPanel ref="opScans" class="shadow-2">
          <DataTable :value="scans" size="small">
            <template #header>
              Получено с сайта:
            </template>
            <Column field="tovar_count" header="Товаров" ></Column>
            <Column field="date" header="Дата" sortable>
              <template #body="scn">
                {{ moment(scn.data.date).format('DD.MM.YYYY - HH:mm') }}
              </template>
            </Column>
          </DataTable>

        </OverlayPanel>
      </template>
      <Column field="id_kramp" header="ID" sortable></Column>
      <Column field="vendor_code" header="Артикул" sortable></Column>
      <Column field="name" header="Название" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
        </template>
      </Column>

      <Column body-class="relative flex" field="price" header="&#8381;" sortable>
        <template #body="dat">
          <div class="z-1 flex-initial w-3rem text-right pr-1">
             {{ dat.data.price }}
          </div>
          <template v-if="dat.data.price_old && moment(showDate).isSameOrBefore(dat.data.price_date)">
            <div class="flex-initial w-6rem text-right pr-1 ">
              {{(dat.data.price - dat.data.price_old)>0 ? '+':''}}{{(dat.data.price - dat.data.price_old).toFixed(2)}}
              ({{ (((dat.data.price - dat.data.price_old)/dat.data.price_old)*100).toFixed(0) }}%)
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
        </template>
      </Column>

      <Column field="price_base" header="&#8364;" sortable></Column>

      <Column body-class="flex " field="tovar_count" header="Количество, шт" sortable>
        <template #body="dat">
          <div class="flex-initial w-3rem text-right pr-1">
            {{ dat.data.tovar_count }}
          </div>
          <template v-if="dat.data.tovar_count_old && moment(showDate).isSameOrBefore(dat.data.tovar_count_date)">
            <div class="flex-initial w-4rem text-right pr-1 ">
              {{(dat.data.tovar_count - dat.data.tovar_count_old)>0 ? '+':''}}{{dat.data.tovar_count - dat.data.tovar_count_old }}
            </div>
            <div>
              {{ getMessageTimeoutInDays(dat.data.tovar_count_date) }}
            </div>
          </template>
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
          <template v-if="dat.data.site_date_old && moment(showDate).isSameOrBefore(dat.data.site_date)">
            <template v-if="dat.data.site == 1">Добавлено </template>
            <template v-else-if="dat.data.site == 0">Удалено </template>
            {{ getMessageTimeoutInDays(dat.data.site_date) }}
          </template>
        </template>
      </Column>
      <template #footer="dat"> Всего {{ totalRecordsFiltered ? totalRecordsFiltered : 0 }} позиций. </template>
    </DataTable>
  </div>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext'
import { useFetch} from "@vueuse/core";
import { ref, onMounted, computed} from 'vue';
import { FilterMatchMode } from 'primevue/api';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import TriStateCheckbox from 'primevue/tristatecheckbox'
import Tag from 'primevue/tag';
import OverlayPanel from 'primevue/overlaypanel';
import SplitButton from 'primevue/splitbutton';
import Calendar from 'primevue/calendar';

import Button from 'primevue/button';
import Slider from 'primevue/slider';

import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';


const totalRecords = ref(0)
const totalRecordsFiltered = ref(0)
const rows = ref(10);

const products = ref([]);
const scans = ref([]);
//всплывающая панель последних сканирований
const opScans = ref();
//всплывающая панель изменения количества отображаемых дней
const opDays = ref();

// const showDate = ref(new Date((new Date()).setDate((new Date().getDate()+beginNDay))));
const showDate = ref(new Date((new Date()).setHours(0, 0, 0, 0)));
//const showDate = ref(new Date(2024, 2, 9 ));

//Date от текущего момента в днях
const getDateFromTimeout = (timeoutInDays) => {
  let datNow = new Date().setHours(0, 0, 0, 0);
  return new Date((new Date(datNow)).setDate((new Date(datNow).getDate()+timeoutInDays)));
}
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
//количество дней в текстовом виде от числа дней
const strDays = computed(()=>{
  let days = getNumberTimeoutInDays(showDate.value);
  switch (days){
    case 0: return "сегодня";
    case -1: return "со вчера";
  }
  return `от ${(days*-1).toString()} дней назад` ;
});
//меню выбора периода отображения
const menuDaysItems = [
  { label: 'за сегодня', command: () => {  showDate.value=getDateFromTimeout(0);  } },
  { label: 'со вчера',   command: () => {  showDate.value=getDateFromTimeout(-1); }  },
  { label: 'от 3 дней',  command: () => {  showDate.value=getDateFromTimeout(-3); }  },
  { label: 'от недели',  command: () => {  showDate.value=getDateFromTimeout(-7); }  },
  { label: 'от месяца',  command: () => {  showDate.value=getDateFromTimeout(-30);}  },
];
const filter = (ev)=>{ totalRecordsFiltered.value = ev.filteredValue.length; console.log(ev);}
const toggleScans = (event)=>{ opScans.value.toggle(event) };
const toggleDays = (event)=>{ opDays.value.toggle(event) };
const rowClass = (data) => {
//  return [{ 'bg-gray-400': data.site == 0 }];
  return [{ 'text-400 bg-gray-100': data.site == 0 }];
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
// const {isFetching:loadingScans, error:error1, data:data1 } = useFetch(`http://192.168.50.5:3004/scans`, {
//   afterFetch(ctx){
//     scans.value = ctx.data.rowData;
//     return ctx
//   }
// }).json();
const getScans = ()=>{

}
const {isFetching:loadingScans, error:error1 } = useFetch(`http://192.168.50.50:3004/scans`, {
  afterFetch(ctx){
    scans.value = ctx.data.rowData;
    return ctx
  }
}).json();

/*const {isFetching:loadingBrand, error:error1, data:data1 } = useFetch(`http://192.168.50.5:3002/brands`, {
  afterFetch(ctx){
    brands_mass.value = ctx.data.rowData;
    return ctx
  }
}).json();
*/

</script>

<style scoped>

</style>
