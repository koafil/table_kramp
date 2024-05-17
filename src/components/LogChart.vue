<template>
  <div class="card w-30rem">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import 'chartjs-adapter-moment';
import { ref, onMounted } from "vue";
import {useFetch} from "@vueuse/core";

const props = defineProps({
  tableName: {type: String, default: "count"},
  id_kramp: {type: Number, default: 0}
});

// onMounted(() => {
//   chartData.value = setChartData();
//   chartOptions.value = setChartOptions();
// });

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','xz','xz','xz'],
    datasets: [
      {
        label: '-',
        // data: [65, 59, 80, 81, 56, 55, 40, 45, 45],
//        data: [{x: '10', y: 20}, {x: '15', y: 12}, {x: '20', y: 10}],
//         data: [...logData.value],
        data: logData.value.map(row=>({x:row.date,y:row.val})).reverse(),
        // data: [{id: 138, id_kramp: 305655, id_scan: 167, val: 682, date: '2024-04-24T10:35:49.000Z'},
        //        {id: 119, id_kramp: 305655, id_scan: 129, val: 706, date: '2024-04-10T10:35:50.000Z'}],
       // data: [{x: Date.now().toString(), y: 20}, {x: Utils.newDateString(1), y: 12}, {x: Utils.newDateString(2), y: 10}],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--cyan-500'),
        tension: 0.1
      },
    ],

  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    // parsing: {
    //   xAxisKey: 'date',
    //   yAxisKey: 'val'
    // },
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        type: 'time',
         time: {
        //   // Luxon format string
        //   tooltipFormat: 'DD T'
        //    unit: 'month'
        },
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        },
        min: props.tableName == 'count'? 0 : null,
      }
    }
  };
}
const logData = ref([]);

const {isFetching, error } = useFetch(`http://192.168.50.50:3004/log/${props.tableName}?id_kramp=${props.id_kramp}`, {
  afterFetch(ctx){
    logData.value = ctx.data.rowData;
    // console.log(logData.value);
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();

    return ctx;
  }
}).json();
</script>