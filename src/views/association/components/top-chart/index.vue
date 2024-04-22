<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValues"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="指定相关性度量函数" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select v-model:value="value" :options="options" @update:value="handleUpdateValue" />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="指定列相关性排序" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="hotRefOne" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="在此指定列" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect1"
          :options="options_edit1"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue1"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="相关性热力图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="hotRef" class="w-full h-500px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="选择两列获取其散点图及相关性回归线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select v-model:value="valueSelect2" multiple :options="options_edit2" :consistent-menu-width="false" />
        <div style="margin-left: 55px; margin-top: 60px">
          <n-button type="success" @click="handleUpdateValue2"> 确定 </n-button>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:20">
      <n-card title="散点图及相关性回归线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="Scatter" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { NTag } from 'naive-ui';
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchCorrData,fetchCorrSelect1,fetchCorrSelect2, fetchDataName } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
const valueSelect = ref('');
const options_edit = ref([]);
const valueSelect1 = ref('');
const options_edit1 = ref([]);
const valueSelect2 = ref([]);
const options_edit2 = ref([]);
const value = ref('pearson');
const options = ref([]);
const { loading, startLoading, endLoading } = useLoading(false);

options.value = [
  {
    label: '皮尔森相关系数',
    value: 'pearson'
  },
  {
    label: '斯皮尔曼秩相关系数',
    value: 'spearman'
  },
  {
    label: '肯德尔秩相关系数',
    value: 'kendall'
  }
];
defineOptions({ name: 'DashboardAnalysisBottomPart' });

const hotOptions = ref<ECOption>({
  tooltip: {
    position: 'top'
  },
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    height: '50%',
    top: '10%'
  },
	dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      yAxisIndex: [0],
      start: 1,
      end: 100
    }
  ],
  xAxis: {
    type: 'category',
    data: [],
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
    type: 'piecewise',
    pieces: [
      { value: 1 },
      { gt: 0.8, lt: 1 },
      { gt: 0.6, lte: 0.8 },
      { gt: 0.4, lte: 0.6 },
      { gt: 0.2, lte: 0.4 },
      { gt: 0, lte: 0.2 },
      { gt: -0.2, lte: 0 },
      { gt: -0.4, lte: -0.2 },
      { gt: -0.6, lte: -0.4 },
      { gt: -0.8, lte: -0.6 },
      { gt: -1, lte: -0.8 },
      { value: -1 }
    ],
    precision: 1,
    splitNumber: 7,
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

const hotOptionsOne = ref<ECOption>({
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
	dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      yAxisIndex: [0],
      start: 1,
      end: 100
    }
  ],
  xAxis: {
    type: 'category',
    data: [],
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
    max: 1,
    min: -1,
    precision: 1,
    splitNumber: 7,
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
const { domRef: hotRefOne } = useEcharts(hotOptionsOne);

const Scatteroption = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {},
  yAxis: {},
	dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      yAxisIndex: [0],
      start: 1,
      end: 100
    }
  ],
  series: [
    {
      symbolSize: 5,
      data: [],
      type: 'scatter'
    },
    {
      type: 'line',
      data: [],
      showSymbol: false,
      lineStyle: {
        width: 3
      }
    }
  ]
}) as Ref<ECOption>;
const { domRef: Scatter } = useEcharts(Scatteroption);

async function getCorrData(type: string) {
  startLoading();
	const name = valueSelect.value;
  const { data } = await fetchCorrData(type, name);
  options_edit1.value = data.header.map(item => {
    return {
      label: item,
      value: item
    };
  });
  options_edit2.value = data.header.map(item => {
    return {
      label: item,
      value: item
    };
  });
  echars(data);
}

function echars(data){
  const alldata = data.allData;
  const header = data.header;
	const header1 = data.header1;
  hotOptions.value.series[0].data = alldata;
  hotOptions.value.yAxis.data = header;
	hotOptions.value.xAxis.data = header1;
}

function echars1(data){
  const alldata = data.allData;
  const header = data.headerOrder;
  hotOptionsOne.value.series[0].data = alldata;
  hotOptionsOne.value.yAxis.data = header;
}

function echars2(data){
  const corrdata = data.corrData;
  const data_predict = data.data_predict;
  Scatteroption.value.series[0].data = corrdata;
	Scatteroption.value.series[1].data = data_predict;
}

async function handleUpdateValue1() {
  startLoading();
  const select = valueSelect1.value;
  const type = value.value;
	const name = valueSelect.value;
  hotOptionsOne.value.xAxis.data[0] = select;
  if (select !== '') {
    const { data } = await fetchCorrSelect1(select, type, name);
    echars1(data);
  }
  endLoading();
}

async function handleUpdateValue2() {
  startLoading();
  const select = valueSelect2.value;
	const name = valueSelect.value;
  if (select.length === 2) {
    const { data } = await fetchCorrSelect2(select, name);
    echars2(data);
  } else {
    window.$message?.error('请指定两列！');
  }
  endLoading();
}

async function handleUpdateValue() {
  startLoading();
  const type = value.value;
  getCorrData(type);
  handleUpdateValue1();
  endLoading();
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

async function handleUpdateValues() {
  startLoading();
  getCorrData('pearson');
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
