<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:5" style="height: 200px">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue"
        />
      </n-card>
      <div style="height: 20px"></div>
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        {{ tableData.message }}
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
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据缺失比例扇形图" :bordered="false" class="rounded-16px shadow-sm">
        <div ref="pieRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="列缺失比例扇形图" :bordered="false" class="rounded-16px shadow-sm">
        <div ref="pieRef2" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="行缺失分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="line1Ref" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
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
  avline: 0,
  message: ''
});

const { startLoading, endLoading } = useLoading(false);

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
      color: ['#5da8ff', '#EE6666', '#fedc69', '#26deca'],
      name: '值分布',
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

const pieOptions2 = ref<ECOption>({
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
const { domRef: pieRef2 } = useEcharts(pieOptions2);

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

async function getMissData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchMissData(name);
  echars1(data);
  echars2(data);
  echars3(data);
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
  echars4(num, missNum);
  tableData.missPercent = (missNum / (num + missNum)*100).toFixed(2);
  tableData.missNum = missNum;
  tableData.row = data.row;
  tableData.line = lenNum;
  tableData.avline = (missNum / data.name.length).toFixed(2);
  tableData.avrow = (missNum / rowNum).toFixed(2);
  tableData.message = data.missing_message;
  endLoading();
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
  pieOptions2.value.series[0].data = nullsumData;
}
function echars3(data){
  const x = [];
  for (let i = 0; i < data.rowData.length; i++) {
    x[i] = i;
  }
  line1Options.value.xAxis.data = x;
  line1Options.value.series[0].data = data.rowData;
}

function echars4(num, missNum){
  const data = [
    { value: num, name: '非缺失值' },
    { value: missNum, name: '缺失值' }
  ];
  pieOptions.value.series[0].data = data;
}

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
