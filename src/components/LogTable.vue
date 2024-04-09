<template>
  <div class="w-25rem" >
<!--    <DataTable lazy :loading="isFetching"  scrollable  scrollHeight="240px" :virtualScrollerOptions="{ itemSize: 40 }" :value="logData" size="small" dataKey="id" >-->
    <DataTable :loading="isFetching"  scrollable  :value="logData" size="small" dataKey="id" table-style="max-h-5rem">
    <template #empty>
      <template v-if="error">Ошибка: {{ error }}</template> <template v-else>Нет записей </template>
    </template>

<!--    <template #header>-->
<!--      Получено с сайта:-->
<!--    </template>-->
    <Column field="id_scan" header="#" ></Column>
    <Column field="val" body-class="text-center" header="Товаров" ></Column>
    <Column field="date" header="Дата" sortable>
      <template #body="scn">
        {{ moment(scn.data.date).format('DD.MM.YYYY - HH:mm') }}
      </template>
    </Column>
  </DataTable>
  </div>
</template>

<script setup>

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {ref} from "vue";
import {useFetch} from "@vueuse/core";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';

const props = defineProps({
  tableName: {type: String, default: "count"},
  id_kramp: {type: Number, default: 0}
});

const logData = ref([]);

const {isFetching, error } = useFetch(`http://192.168.50.50:3004/log/${props.tableName}?id_kramp=${props.id_kramp}`, {
  afterFetch(ctx){
    logData.value = ctx.data.rowData;
    return ctx
  }
}).json();

</script>
