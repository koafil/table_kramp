<template>
  <span v-if="loading || loadingScans"> Загрузка...</span>
  <span v-else-if="error|| error1"> Ошибка загрузки: {{ error }} </span>
  <div v-else class="card">
    <!--    Keys: {{ findKeyArr }}-->
    <!--    {{ data1.rowData[1] }}-->
    <!--    {{ brands }}-->
    <DataTable v-model:filters="filters"
               :value="products"
               :rows=rows
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
    >
      <template #header>
        <div class="flex justify-content-between align-items-center flex-wrap">
        <div>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Поиск" />
          </IconField>
        </div>
        <div class="flex flex-column align-items-center">
          <div class="card"> Получено: {{ moment(scans[0].date).fromNow() }} </div>
          <div> {{ moment(scans[0].date).format('LLL') }} </div>
        </div>
        </div>
      </template>
      <Column field="id_kramp" header="ID" sortable></Column>
      <Column field="vendor_code" header="Артикул" sortable></Column>
      <Column field="name" header="Название" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
        </template>
      </Column>

      <Column body-class="relative flex justify-content-center" field="price" header="&#8381;" sortable>
        <template #body="dat">
            <div class="z-1"> {{ dat.data.price }} </div>
            <Tag class="z-0 w-2 h-1rem absolute top-0 right-0" v-if="dat.data.sale" icon="pi pi-info-circle" severity="info" value=""></Tag>
        </template>
      </Column>

      <Column field="price_base" header="&#8364;" sortable></Column>
      <Column field="tovar_count" header="Количество" sortable>
        <template #body="slotProps">
          <div class="flex justify-content-between">
          <div>
            {{ slotProps.data.tovar_count }}
          </div>
          <div v-if="slotProps.data.tovar_count_old">
            ({{ slotProps.data.tovar_count - slotProps.data.tovar_count_old }})
          </div>
          </div>
        </template>
      </Column>
      <Column field="site"  sortable>
        <template #header>
          <TriStateCheckbox
              v-model="filters.site.checkbox" @update:model-value="value => { filters.site.value=(value===null?null:(value?1:0));}"
              class="mr-2"
          />
          На сайте
        </template>
        <template #body="dat">
          <template v-if="dat.data.site == 1">Добавлено </template>
          <template v-else>Удалено </template>
          {{ moment(dat.data.site_date).fromNow() }}
        </template>
      </Column>
<!--      <Column field="brand" header="Бренд">-->
<!--        <template #body="slotProps">-->
<!--          {{ brands.get(slotProps.data.brand)?.Name }}-->
<!--        </template>-->
<!--      </Column>-->
<!--      <Column field="brand" header="Страна">-->
<!--        <template #body="slotProps">-->
<!--          {{ brands.get(slotProps.data.brand)?.Country }}-->
<!--        </template>-->
<!--      </Column>-->
<!--      <Column field="info" header="Инфо"></Column>-->
      <template #footer> Всего {{ totalRecords ? totalRecords : 0 }} позиций. </template>
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

import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';


const totalRecords = ref(0)
const rows = ref(10);

const products = ref([]);
const scans = ref([]);

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
  return `http://192.168.50.5:3004/all`
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
const {isFetching:loadingScans, error:error1 } =  useFetch(`http://192.168.50.5:3004/scans`, {
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
