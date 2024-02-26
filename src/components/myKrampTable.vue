<template>
  <div class="card">
    <!--    Keys: {{ findKeyArr }}-->
    <!--    {{ data1.rowData[1] }}-->
    <!--    {{ brands }}-->
    <DataTable :value="products"
               :rows=rows
               tableStyle="min-width: 50rem"
               :totalRecords="totalRecords"
               :loading="loading"
               removableSort
    >
      <Column field="id_kramp" header="ID" sortable></Column>
      <Column field="vendor_code" header="Артикул" sortable></Column>
      <Column field="name" header="Название" sortable></Column>
      <Column field="price" header="Цена" sortable></Column>
      <Column field="price_base" header="Базовая цена" sortable></Column>
      <Column field="tovar_count" header="Количество" sortable></Column>
      <Column field="sale" header="Акция" sortable></Column>
      <Column field="site" header="На сайте" sortable></Column>
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
import { useFetch} from "@vueuse/core";
import { ref, onMounted, computed} from 'vue';

const totalRecords = ref(0)
const rows = ref(10);

const products = ref([]);

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