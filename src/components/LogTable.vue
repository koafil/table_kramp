<template>
  <div class="w-25rem" >
<!--    <DataTable lazy :loading="isFetching"  scrollable  scrollHeight="240px" :virtualScrollerOptions="{ itemSize: 40 }" :value="logData" size="small" dataKey="id" >-->
    <DataTable :loading="isFetching"  scrollable  :value="logData" size="small" dataKey="id" table-style="max-h-5rem">
    <template #empty>
      <template v-if="error">Ошибка: {{ error }}</template> <template v-else>Нет записей </template>
    </template>
      <Column field="val" body-class="text-center" :header="strColumbName()" >
        <template #body="dat">
          <template v-if="tableName == 'site'">
            <i v-if="dat.data.val" class="pi pi-check-circle mr-1 text-green-500"></i>
            <i v-else class="pi pi-times-circle mr-1 text-gray-500"></i>
          </template>
          <template v-else>
            {{ dat.data.val }}
          </template>
        </template>
      </Column>
      <Column field="val_old" body-class="text-center" header="Изм." >
        <template #body="dat">
          <template v-if="dat.data.val_old === null"> -- </template>
          <template v-else>
            <template v-if="tableName == 'count'">
              <Badge v-if="(dat.data.val - dat.data.val_old)>0"  severity='secondary'>
                +{{(dat.data.val - dat.data.val_old)}}
              </Badge>
              <Badge v-else>
                {{dat.data.val - dat.data.val_old }}
              </Badge>
            </template>
            <template v-else-if="tableName == 'price' || tableName == 'price_base'">
              <Badge v-if="(dat.data.val - dat.data.val_old)>0"  severity='secondary'>
                +{{(dat.data.val - dat.data.val_old).toFixed(2) }} (+{{ (((dat.data.val - dat.data.val_old)/dat.data.val_old)*100).toFixed(2) }}%)
              </Badge>
              <Badge v-else>
                {{(dat.data.val - dat.data.val_old).toFixed(2) }} ({{ (((dat.data.val - dat.data.val_old)/dat.data.val_old)*100).toFixed(2) }}%)
              </Badge>
            </template>
            <template v-else-if="tableName == 'site'">
              {{ dat.data.val ? 'Выложили':'Убрали' }}
<!--              {{ dat.data.val  }}-->
            </template>
            <template v-else> {{ dat.data.val_old }} </template>
          </template>
        </template>
      </Column>
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
import {computed, ref} from "vue";
import {useFetch} from "@vueuse/core";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';
import Badge from "primevue/badge";

const props = defineProps({
  tableName: {type: String, default: "count"},
  id_kramp: {type: Number, default: 0}
});

const strColumbName = ()=>{
  if(props.tableName == 'count') return 'Кол-во';
  if(props.tableName == 'price') return "Цена";
  if(props.tableName == 'price_base') return "Евро";
  if(props.tableName == 'vendor_code') return "Артикул";
  if(props.tableName == 'name') return "Название";
  if(props.tableName == 'site') return "На сайте";
  return '--';
};
const logData = ref([]);

const {isFetching, error } = useFetch(`http://192.168.50.50:3004/log/${props.tableName}?id_kramp=${props.id_kramp}`, {
  afterFetch(ctx){
    logData.value = ctx.data.rowData;
    return ctx
  }
}).json();

</script>
