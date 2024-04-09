<template>
  <div v-if="!scans.length"> -- </div>
  <div v-else @click="toggleScans">
    <div class="flex flex-column align-items-center" >
      <div class="card"> Получено: {{ moment(scans[0]?.date).fromNow() }} </div>
      <div> {{ moment(scans[0]?.date).format('LLL') }} </div>
    </div>
  </div>
  <OverlayPanel ref="opScans" class="shadow-2"  >
    <div class="w-25rem" >
      <DataTable  :loading="isFetching"  scrollable  scrollHeight="400px" :virtualScrollerOptions="{ itemSize: 40 }" :value="scans" size="small"  >
        <template #empty>
          <template v-if="error">Ошибка: {{ error }}</template> <template v-else>Нет записей </template>
        </template>

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
    </div>
  </OverlayPanel>

</template>

<script setup>
import {ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';
import {useFetch} from "@vueuse/core";
import OverlayPanel from "primevue/overlaypanel";

const scans = ref([]);
//всплывающая панель последних сканирований
const opScans = ref();

const toggleScans = (event)=>{ opScans.value.toggle(event) };

const {isFetching, error } = useFetch(`http://192.168.50.50:3004/scans`, {
  afterFetch(ctx){
    scans.value = ctx.data.rowData;
    return ctx
  }
}).json();


</script>

