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
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="选择两列查看数据分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select v-model:value="valueSelect2" multiple :options="options_edit2" :consistent-menu-width="false" />
        <div style="display: block; margin: auto; width: fit-content; margin-top: 50px">
          <n-button type="success" @click="handleUpdateValue2"> 确定 </n-button>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        {{ tableData.message }}
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind2.i === 1" ref="Scatter" class="w-full h-600px"></div>
        <div v-show="kind2.i === 2" ref="QiantaoBar" class="w-full h-600px"></div>
        <div v-show="kind2.i === 3" ref="Box" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind2.i === 2" ref="DuiDieBar" class="w-full h-600px"></div>
        <div v-show="kind2.i === 3" ref="Lineref" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind2.i === 2" ref="hotRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { NTag } from 'naive-ui';
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import * as echarts from 'echarts';
import { fetchHeaderData, fetchDistriSelect1, fetchDistriSelect2, fetchDataName } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
import Line from '@antv/g2/lib/geometry/line';
import { table } from 'console';
import 'echarts-wordcloud';

const valueSelect = ref('');
const options_edit = ref([]);
const options_edit1 = ref([]);
const valueSelect2 = ref([]);
const options_edit2 = ref([]);
const kind2 = reactive({
  i: 0
});
const tableData = reactive({
  message: ''
});
const { loading, startLoading, endLoading } = useLoading(false);

defineOptions({ name: 'DashboardAnalysisBottomPart' });

const hotOptions = ref<ECOption>({
  title: {
    text: '分类列与分类列热力图',
		left: 'center'
  },
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
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    },
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    },
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  visualMap: {
    min: 0,
    max: 20,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%'
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 1,
      end: 10
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: 1,
      end: 10
    },
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 1,
      end: 10
    },
    {
      type: 'inside',
      yAxisIndex: [0],
      start: 1,
      end: 10
    }
  ],
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

const Scatteroption = ref<ECOption>({
	title:{
      text: '数值列与数值列散点图',
      left: 'center'
    },
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
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  yAxis: {
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  series: [
    {
      symbolSize: 5,
      data: [],
      type: 'scatter'
    }
  ]
}) as Ref<ECOption>;
const { domRef: Scatter } = useEcharts(Scatteroption);

// const Header = ref([]);
const Header = [];
const Boxoption = ref<ECOption>({
  title: [
    {
      text: '数值列与分类列箱线图',
      left: 'center'
    },
    {
      text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
      borderColor: '#999',
      borderWidth: 1,
      textStyle: {
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 20
      },
      left: '10%',
      top: '90%'
    }
  ],
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  dataset: [
    {
      // prettier-ignore
      source: []
    },
    {
      transform: {
        type: 'boxplot',
        config: {
          itemNameFormatter(params) {
            return Header[params.value];
          }
        }
      }
    },
    {
      fromDatasetIndex: 1,
      fromTransformResult: 1
    }
  ],
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    },
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: '',
    splitArea: {
      show: true
    }
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      start: 0,
      end: 100
    }
  ],
  series: [
    {
      name: 'boxplot',
      type: 'boxplot',
      datasetIndex: 1,
      tooltip: { formatter }
    },
    {
      name: '异常值',
      type: 'scatter',
      datasetIndex: 2
    }
  ],
}) as Ref<ECOption>;
const { domRef: Box } = useEcharts(Boxoption);
const Header1 = [];
function formatter(param) {
  return [
    `类别名称: ${param.name}`,
    `上边界: ${param.data[5]}`,
    `上四分位数: ${param.data[4]}`,
    `中位数: ${param.data[3]}`,
    `下四分位数: ${param.data[2]}`,
    `下边界: ${param.data[1]}`
  ].join('<br/>');
}

const Lineoption = ref<ECOption>({
  title: {
    text: '数值列与分类列折线图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  legend: {
    data: []
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [
      '1/20',
      '2/20',
      '3/20',
      '4/20',
      '5/20',
      '6/20',
      '7/20',
      '8/20',
      '9/20',
      '10/20',
      '11/20',
      '12/20',
      '13/20',
      '14/20',
      '15/20',
      '16/20',
      '17/20',
      '18/20',
      '19/20',
      '20/20'
    ]
  },
  yAxis: {
    type: 'value'
  },
  series: []
}) as Ref<ECOption>;
const { domRef: Lineref } = useEcharts(Lineoption);

const QiantaoBaroption = ref<ECOption>({
  title: {
    text: '分类列与分类列嵌套条形图',
    left: 'center'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true,
    // formatter: '{b0}: {c0}<br />{b1}: {c1}'
    triggerOn: 'click',
    hideDelay: 600
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    boundaryGap: true,
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      start: 0,
      end: 5
    }
  ],
  series: []
}) as Ref<ECOption>;
const { domRef: QiantaoBar } = useEcharts(QiantaoBaroption);

const DuiDieBaroption = ref<ECOption>({
  title: {
    text: '分类列与分类列堆叠条形图',
    left: 'center'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true,
    triggerOn: 'click',
    hideDelay: 600
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  xAxis: {
    type: 'category',
    data: [],
    boundaryGap: true,
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    }
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      start: 0,
      end: 5
    }
  ],
  series: []
}) as Ref<ECOption>;
const { domRef: DuiDieBar } = useEcharts(DuiDieBaroption);

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
  getHeader();
  endLoading();
}

async function getHeader() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchHeaderData(name);
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
}

async function handleUpdateValue2() {
  startLoading();
  const select = valueSelect2.value;
  const name = valueSelect.value;
  if (select.length === 2) {
    const { data } = await fetchDistriSelect2(select, name);
    tableData.message = data.data_message;
    kind2.i = data.kind;
    if (data.kind === 1) {
      Scatteroption.value.xAxis.name = select[0];
      Scatteroption.value.yAxis.name = select[1];
      echars2(data);
    } else if (data.kind === 2) {
      hotOptions.value.xAxis.name = select[1];
      hotOptions.value.yAxis.name = select[0];
      DuiDieBaroption.value.xAxis.name = select[0];
      QiantaoBaroption.value.xAxis.name = select[0];
      echars3(data);
    } else {
      echars4(data);
    }
  } else {
    window.$message?.error('请指定两列！');
  }
  endLoading();
}
function echars2(data) {
  const sandData = data.sandData;
  Scatteroption.value.series[0].data = sandData;
}

function echars3(data) {
  const allData = data.allData;
  const header0 = data.header0;
  const header1 = data.header1;
  const hotData = data.hotData;
  hotOptions.value.yAxis.data=header0;
  hotOptions.value.xAxis.data=header1;
  hotOptions.value.series[0].data=hotData;
  const Data = [];
  const Data1 = [];
  const count = [];
  for (let a = 0; a < header0.length; a++) {
    count[a] = 0;
    for (let b = 0; b < allData.length; b++) {
      if (allData[b][0] === header0[a]) {
        count[a] += allData[b][2];
      }
    }
  }
  for (let i = 0; i < header1.length; i++) {
    const midList = [];
    const midList1 = [];
    for (let j = 0; j < header0.length; j++) {
      let flag = 0;
      for (let k = 0; k < allData.length; k++) {
        if (allData[k][0] === header0[j] && allData[k][1] === header1[i]) {
          midList[j] = allData[k][2];
          midList1[j] = (allData[k][2] / count[j]) * 100;
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        midList[j] = 0;
        midList1[j] = 0;
      }
    }
    Data[i] = { name: header1[i], type: 'bar', data: midList };
    Data1[i] = {
      name: header1[i],
      type: 'bar',
      stack: 'total',
      data: midList1
    };
  }
  QiantaoBaroption.value.xAxis.data = header0;
  QiantaoBaroption.value.series = Data;
  DuiDieBaroption.value.xAxis.data = header0;
  DuiDieBaroption.value.series = Data1;
}

function echars4(data) {
  const boxData = data.boxData;
  const header0 = data.header0;
  const header1 = data.header1;
  const LineData = data.lineData;
  Boxoption.value.xAxis.name = header0;
  Boxoption.value.yAxis.name = header1;
  Boxoption.value.dataset[0].source = boxData;
  for (let i = 0; i < data.Header0.length; i++) {
    Header[i] = data.Header0[i];
  }
  const Data = [];
  for (let j = 0; j < data.Header0.length; j++) {
    Data[j] = { name: data.Header0[j], type: 'line', stack: 'Total', data: LineData[j] };
  }
  Lineoption.value.series = Data;
	Lineoption.value.legend.data = data.Header0;
}

function init() {
  getDataName();
}

// 初始化
onMounted(() => {
  init();
});
</script>

<style scoped>
.wordcloud {
  width: 1400px;
  height: 500px;
}
</style>
