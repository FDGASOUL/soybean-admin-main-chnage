<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:5">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:5">
      <n-card :bordered="false" class="rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="总缺失值数量" :value="tableData.missNum"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="缺失值占比" :value="tableData.missPercent">
              <template #suffix> % </template>
            </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="存在缺失值列数" :value="tableData.line"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="存在缺失值行数" :value="tableData.row"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="每列平均缺失数量" :value="tableData.avline"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="每行平均缺失数量" :value="tableData.avrow"> </n-statistic>
          </n-col>
        </n-row>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:14">
      <n-card title="缺失值数量条形图" :bordered="false" class="rounded-16px shadow-sm">
        <div ref="lineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="缺失值比例扇形图" :bordered="false" class="rounded-16px shadow-sm">
        <div ref="pieRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
		<n-grid-item span="0:24 640:24 1024:24">
      <n-card title="行缺失分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="line1Ref" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <!-- <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="缺失值热力图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="hotRef" class="w-full h-500px"></div>
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
    </n-grid-item> -->
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchDataName, fetchMissData } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
const valueSelect = ref('');
const options_edit = ref([]);
const tableData = reactive({
  missNum: 0,
  missPercent: 0,
  row: 0,
  line: 0,
  avrow: 0,
  avline: 0
});

const { loading, startLoading, endLoading } = useLoading(false);

defineOptions({ name: 'DashboardAnalysisTopCard' });

const lineOptions = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: '个数'
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '非缺失值',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: '缺失值',
      color: '#EE6666',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
}) as Ref<ECOption>;
const { domRef: lineRef } = useEcharts(lineOptions);

const pieOptions = ref<ECOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '缺失值',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}) as Ref<ECOption>;
const { domRef: pieRef } = useEcharts(pieOptions);

const line1Options = ref<ECOption>({
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    name: '行号',
    data: []
  },
  yAxis: {
    type: 'value',
    name: '缺失数'
  },
  dataZoom: [
    {
      type: 'inside',
      show: true,
      start: 100,
      end: 0
    }
  ],
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
}) as Ref<ECOption>;
const { domRef: line1Ref } = useEcharts(line1Options);

const hotOptions = ref<ECOption>({
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '10%'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    data: [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%'
  },
  series: [
    {
      name: 'Punch Card',
      type: 'heatmap',
      data: [],
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}) as Ref<ECOption>;
const { domRef: hotRef } = useEcharts(hotOptions);

async function getMissData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchMissData(name);
  echars1(data);
  echars2(data);
  echars3(data);
  // echars4(data);
  let missNum = 0;
  let num = 0;
  let lenNum = 0;
  let rowNum = 0;
  for (let i = 0; i < data.name.length; i++) {
    missNum += data.nullsum[i];
    if (data.nullsum[i] !== 0) {
      lenNum++;
    } else {
      rowNum = data.sum[i];
    }
  }
  for (let i = 0; i < data.name.length; i++) {
    num += data.sum[i];
  }
  tableData.missPercent = (missNum / (num + missNum)*100).toFixed(2);
  tableData.missNum = missNum;
  tableData.row = data.row;
  tableData.line = lenNum;
  tableData.avline = (missNum / data.name.length).toFixed(2);
  tableData.avrow = (missNum / rowNum).toFixed(2);
}

function echars1(data){
  const sumData = [];
  const nullsumData = [];
  for (let i = 0; i < data.name.length; i++) {
    sumData[i] = data.sum[i];
    nullsumData[i] = data.nullsum[i];
  }
  lineOptions.value.series[0].data = sumData;
  lineOptions.value.series[1].data = nullsumData;
  lineOptions.value.yAxis.data = data.name;
}

function echars2(data) {
  let nullsumData = [];
  let j = 0;
  for (let i = 0; i < data.name.length; i++) {
    if (data.nullsum[i] !== 0) {
      nullsumData[j] = {};
      nullsumData[j] = { value: data.nullsum[i], name: data.name[i] };
      j++;
    }
  }
  pieOptions.value.series[0].data = nullsumData;
}
function echars3(data){
  const x = [];
  for (let i = 0; i < data.rowData.length; i++) {
    x[i] = i;
  }
  line1Options.value.xAxis.data = x;
  line1Options.value.series[0].data = data.rowData;
}

// function echars4(data){
//   const hdata = data.hotData;
// 	hotOptions.value.series[0].data=hdata;
//   hotOptions.value.yAxis.data = data.name;
// }

async function getDataName() {
  startLoading();
  const { data } = await fetchDataName();
  options_edit.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  });
}

async function handleUpdateValue() {
  startLoading();
  getMissData();
  endLoading();
}

function init() {
  getDataName();
}

// 初始化
onMounted(() => {
  init();
});
</script>

<style scoped></style>
