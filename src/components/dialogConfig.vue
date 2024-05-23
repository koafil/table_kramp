<template>
  <Button class="ml-3" size="small" severity="secondary" icon="pi pi-cog" aria-label="Submit"  outlined @click="visible = true"/>
<!--  <Dialog v-model:visible="visible" :maximizable="true" modal header="Цены литера" :style="{ width: '25rem' }" pt:header:class="pb-0 pt-3" pt:state:maximized="true">-->
    <Dialog ref="dialog" @show="maximize" v-model:visible="visible" :maximizable="true" modal header="Цены литера" :style="{ width: '25rem' }"  >
    <TabView>
      <TabPanel >
        <template #header>
          <i class="pi pi-list mr-3"></i> <span >Таблица цен</span>
        </template>
        <liter-table/>
      </TabPanel>
      <TabPanel >
        <template #header>
          <i class="pi pi-link mr-3"></i> <span >Связь с крампом</span>
        </template>
        2
      </TabPanel>
    </TabView>

  </Dialog>
</template>

<script setup>
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import { ref } from "vue";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import LiterTable from "./LiterTable.vue";

const visible = ref(false);
const dialog = ref();

function maximize() {
  if (dialog.value.maximized) return

  dialog.value.maximize()
}
</script>
