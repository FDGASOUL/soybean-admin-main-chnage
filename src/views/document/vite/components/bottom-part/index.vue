<template>
  <!-- <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="行缺失分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="lineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="缺失值热力图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="hotRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="热力图对照表" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-tag type="success"> 单位：/200格数据 </n-tag>
        <n-divider />
        <p>缺失级别：0 <n-divider vertical />缺失值：0</p>
        <p>缺失级别：1 <n-divider vertical />缺失值：1</p>
        <p>缺失级别：2 <n-divider vertical />缺失值：2~5</p>
        <p>缺失级别：3 <n-divider vertical />缺失值：6~10</p>
        <p>缺失级别：4 <n-divider vertical />缺失值：10~20</p>
        <p>缺失级别：5 <n-divider vertical />缺失值：20~40</p>
        <p>缺失级别：6 <n-divider vertical />缺失值：40~60</p>
        <p>缺失级别：7 <n-divider vertical />缺失值：60~70</p>
        <p>缺失级别：8 <n-divider vertical />缺失值：70~80</p>
        <p>缺失级别：9 <n-divider vertical />缺失值：80~90</p>
        <p>缺失级别：10<n-divider vertical />缺失值：>90</p>
			</n-card>
    </n-grid-item>
  </n-grid> -->
</template>

<script setup lang="ts">
// import { h } from 'vue';
// import { NTag } from 'naive-ui';
// import { ref, defineComponent,reactive } from 'vue';
// import type { Ref } from 'vue';
// import { fetchMissData } from '@/service';
// import { type ECOption, useEcharts } from '@/composables';
// import { useBoolean, useLoading } from '@/hooks';
// import type { UserManagement } from '~/src/typings/business';
// import { onMounted } from 'vue';
// import { number } from 'echarts';
// import { setup } from 'mockjs';

// const { loading, startLoading, endLoading } = useLoading(false);

// defineOptions({ name: 'DashboardAnalysisBottomPart' });

// const lineOptions = ref<ECOption>({
//   tooltip: {
//     trigger: 'axis'
//   },
//   xAxis: {
//     type: 'category',
//     name: '行号',
//     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   },
//   yAxis: {
//     type: 'value',
//     name: '缺失数'
//   },
//   dataZoom: [
//     {
//       type: 'inside',
//       show: true,
//       start: 100,
//       end: 0
//     }
//   ],
//   series: [
//     {
//       data: [150, 230, 224, 218, 135, 147, 260],
//       type: 'line'
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: lineRef } = useEcharts(lineOptions);

// const hotOptions = ref<ECOption>({
//   tooltip: {
//     position: 'top'
//   },
//   grid: {
//     height: '50%',
//     top: '10%'
//   },
//   xAxis: {
//     type: 'category',
//     data: [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400],
//     splitArea: {
//       show: true
//     }
//   },
//   yAxis: {
//     type: 'category',
//     data: ['index', 'id', 'beer_name', 'style', 'ounces', 'abv', 'ibu', 'brewery_id', 'brewery_name', 'city', 'state'],
//     splitArea: {
//       show: true
//     }
//   },
//   visualMap: {
//     min: 0,
//     max: 10,
//     calculable: true,
//     orient: 'horizontal',
//     left: 'center',
//     bottom: '15%'
//   },
//   series: [
//     {
//       name: 'Punch Card',
//       type: 'heatmap',
//       data: [],
//       label: {
//         show: true
//       },
//       emphasis: {
//         itemStyle: {
//           shadowBlur: 15,
//           shadowColor: 'rgba(0, 0, 0, 0.5)'
//         }
//       }
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: hotRef } = useEcharts(hotOptions);

// async function getMissData() {
//   startLoading();
//   const { data } = await fetchMissData();
//   echars1(data);
//   echars2(data);
// }

// function echars1(data){
//   const x = [];
//   for (let i = 0; i < data.rowData.length; i++) {
//     x[i] = i;
//   }
//   lineOptions.value.xAxis.data = x;
//   lineOptions.value.series[0].data = data.rowData;
// }

// function echars2(data){
//   const hdata = data.hotData;
// 	hotOptions.value.series[0].data=hdata;
// }

// function init() {
//   getMissData();
// }

// // 初始化
// onMounted(() => {
//   init();
// });
</script>

<style scoped></style>
