<template>
  <DataTable lazy :loading="isFetching"  scrollable  scrollHeight="400px" :virtualScrollerOptions="{ itemSize: 40 }" :value="scans" size="small"  >
    <template #header>
      Получено с сайта:
    </template>
    <Column field="id" header="#" ></Column>
    <Column field="tovar_count" body-class="text-center" header="Товаров" ></Column>
    <Column field="date" header="Дата" sortable>
      <template #body="scn">
        {{ moment(scn.data.date).format('DD.MM.YYYY - HH:mm') }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import {ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';
import {useFetch} from "@vueuse/core";

const scans = ref([]);

const {isFetching, error:error1 } = useFetch(`http://192.168.50.5:3004/scans`, {
  afterFetch(ctx){
    scans.value = ctx.data.rowData;
    return ctx
  }
}).json();


</script>

