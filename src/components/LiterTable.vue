<template>
  <div class="w-fit" >
    <Toolbar class="mb-4">
      <template #start>
        <Button label="Добавить" icon="pi pi-plus" severity="success" class="mr-2" @click="addNew" />
        <Button label="Удалить" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
      </template>
    </Toolbar>
    <!--    <DataTable lazy :loading="isFetching"  scrollable  scrollHeight="240px" :virtualScrollerOptions="{ itemSize: 40 }" :value="logData" size="small" dataKey="id" >-->
    <DataTable v-model:editingRows="editingRows"
               @row-edit-save="onRowEditSave"
               :loading="isFetching"
               scrollable
               :value="literData"
               size="small"
               dataKey="id"
               editMode="row"
               table-style="max-h-15rem"
               removableSort>
      <template #empty>
        <template v-if="error">Ошибка: {{ error }}</template> <template v-else>Нет записей </template>
      </template>
      <Column field="name" body-class="text-left" header="Название" >
        <template #editor="{ data, field }">
<!--          <InputText v-model="data[field]" />-->
          <InputText v-model="data[field]" />

        </template>
<!--        <template #body="dat">-->
<!--          <template v-if="tableName == 'site'">-->
<!--            <i v-if="dat.data.val" class="pi pi-check-circle mr-1 text-green-500"></i>-->
<!--            <i v-else class="pi pi-times-circle mr-1 text-gray-500"></i>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ dat.data.val }}-->
<!--          </template>-->
<!--        </template>-->
      </Column>
      <Column field="price" body-class="text-center" header="Цена" >
<!--        <template #body="dat">-->
<!--          <template v-if="dat.data.val_old === null"> &#45;&#45; </template>-->
<!--          <template v-else>-->
<!--            <template v-if="tableName == 'count'">-->
<!--              <Badge v-if="(dat.data.val - dat.data.val_old)>0"  severity='secondary'>-->
<!--                +{{(dat.data.val - dat.data.val_old)}}-->
<!--              </Badge>-->
<!--              <Badge v-else>-->
<!--                {{dat.data.val - dat.data.val_old }}-->
<!--              </Badge>-->
<!--            </template>-->
<!--            <template v-else-if="tableName == 'price' || tableName == 'price_base'">-->
<!--              <Badge v-if="(dat.data.val - dat.data.val_old)>0"  severity='secondary'>-->
<!--                +{{(dat.data.val - dat.data.val_old).toFixed(2) }} (+{{ (((dat.data.val - dat.data.val_old)/dat.data.val_old)*100).toFixed(2) }}%)-->
<!--              </Badge>-->
<!--              <Badge v-else>-->
<!--                {{(dat.data.val - dat.data.val_old).toFixed(2) }} ({{ (((dat.data.val - dat.data.val_old)/dat.data.val_old)*100).toFixed(2) }}%)-->
<!--              </Badge>-->
<!--            </template>-->
<!--            <template v-else-if="tableName == 'site'">-->
<!--              {{ dat.data.val ? 'Выложили':'Убрали' }}-->
<!--              &lt;!&ndash;              {{ dat.data.val  }}&ndash;&gt;-->
<!--            </template>-->
<!--            <template v-else> {{ dat.data.val_old }} </template>-->
<!--          </template>-->
<!--        </template>-->
      </Column>
      <Column field="date" header="Дата изменения" sortable>
        <template #body="dat">
          {{ moment(dat.data.date).format('DD.MM.YYYY - HH:mm') }}
        </template>
      </Column>
      <Column :rowEditor="true"  bodyStyle="text-align:center"></Column>
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
import InputText from 'primevue/inputtext';
import Badge from "primevue/badge";

const literData = ref([]);
const editingRows = ref([]);
const {isFetching, error } = useFetch(`http://192.168.50.5:3004/all_liter`, {
  afterFetch(ctx){
    literData.value = ctx.data.rowData;
    return ctx
  }
}).json();

const onRowEditSave = (event) => {
  let { newData, index } = event;

  literData.value[index] = newData;
};
const addNew = () => {
};
const deleteProduct = () => {
  products.value = products.value.filter(val => val.id !== product.value.id);
  product.value = {};
  // toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
};
</script>
