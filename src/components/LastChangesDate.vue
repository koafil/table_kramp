<template>
  <span class="mr-2">Последние<br> изменения</span>
  <SplitButton class="mr-3" size="small" severity="secondary" :label="strDays" @click="toggleDays" :model="menuDaysItems" outlined/>

  <OverlayPanel ref="opDays" class="shadow-2">
    <Calendar  v-model="showDate" inline :max-date="new Date()" @update:modelValue="toggleDays"/>
  </OverlayPanel>

</template>

<script setup>
import SplitButton from "primevue/splitbutton";
import OverlayPanel from "primevue/overlaypanel";
import Calendar from "primevue/calendar";
import {computed, ref} from "vue";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/ru';

const showDate = defineModel();

//всплывающая панель изменения количества отображаемых дней
const opDays = ref();

const toggleDays = (event)=>{ opDays.value.toggle(event) };

//Date от текущего момента в днях
const getDateFromTimeout = (timeoutInDays) => {
  let datNow = new Date().setHours(0, 0, 0, 0);
  return new Date((new Date(datNow)).setDate((new Date(datNow).getDate()+timeoutInDays)));
}

//число дней от текущего момента
const getNumberTimeoutInDays = (dat)=>{
  return moment(dat).startOf('day').diff(moment.now(),'days');
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

</script>
