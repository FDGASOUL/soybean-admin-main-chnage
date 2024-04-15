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
      <n-card title="指定列查看数据分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect1"
          :options="options_edit1"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue1"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:5">
      <n-card v-show="kind1.i === 1" title="数值列数据统计(1)" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="总条目数量" :value="tableData.all"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="共有不同数字" :value="tableData.kind"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最多数字" :value="tableData.maxKind"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最多数字占比" :value="tableData.maxKindPer">
              <template #suffix> % </template></n-statistic
            >
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="缺失条目数量" :value="tableData.missNum"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="缺失值占比" :value="tableData.missPercent">
              <template #suffix> % </template></n-statistic
            >
          </n-col>
        </n-row>
      </n-card>
      <n-card v-show="kind1.i === 2" title="分类列数据统计" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="总条目数量" :value="tableData1.all"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="共有分类" :value="tableData1.kind"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最多分类" :value="tableData1.maxKind"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最多分类占比" :value="tableData1.maxKindPer">
              <template #suffix> % </template></n-statistic
            >
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="缺失条目数量" :value="tableData1.missNum"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="缺失值占比" :value="tableData1.missPercent">
              <template #suffix> % </template></n-statistic
            >
          </n-col>
        </n-row>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:5">
      <n-card v-show="kind1.i === 1" title="数值列数据统计(2)" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="平均值" :value="tableData.avg"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最大值" :value="tableData.max"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="最小值" :value="tableData.min"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="中位数" :value="tableData.center"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="上四分位数" :value="tableData.maxCenter"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="下四分位数" :value="tableData.minCenter"> </n-statistic>
          </n-col>
        </n-row>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:5">
      <n-card v-show="kind1.i === 1" title="数值列数据统计(3)" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="方差" :value="tableData.fangcha"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="标准差" :value="tableData.biaozhun"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="偏斜度" :value="tableData.piandu"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="峰度" :value="tableData.fengdu"> </n-statistic>
          </n-col>
        </n-row>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind1.i === 1" ref="barRef" class="w-full h-600px"></div>
        <div v-show="kind1.i === 2" ref="catBarref" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind1.i === 1" ref="bar1Ref" class="w-full h-600px"></div>
        <div v-show="kind1.i === 2" ref="catPieref" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-show="kind1.i === 1" ref="BoxRef" class="w-full h-600px"></div>
        <div v-show="kind1.i === 2" ref="wordcloudRef" class="wordcloud"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="选择两列查看数据分布" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select v-model:value="valueSelect2" multiple :options="options_edit2" :consistent-menu-width="false" />
        <div style="margin-left: 55px; margin-top: 60px">
          <n-button type="success" @click="handleUpdateValue2"> 确定 </n-button>
        </div>
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
const valueSelect1 = ref('');
const options_edit1 = ref([]);
const valueSelect2 = ref([]);
const options_edit2 = ref([]);
const kind1 = reactive({
  i: 0
});
const kind2 = reactive({
  i: 0
});
const tableData1 = reactive({
  all: 0,
  kind: 0,
  maxKind: '',
  maxKindPer: 0,
  missNum: 0,
  missPercent: 0
});
const tableData = reactive({
  all: 0,
  kind: 0,
  maxKind: '',
  maxKindPer: 0,
  missNum: 0,
  missPercent: 0,
  avg: 0,
  max: 0,
  min: 0,
  center: 0,
  maxCenter: 0,
  minCenter: 0,
  fangcha: 0,
  biaozhun: 0,
  piandu: 0,
  fengdu: 0
});
const { loading, startLoading, endLoading } = useLoading(false);

defineOptions({ name: 'DashboardAnalysisBottomPart' });

const wordcloudRef = ref();
const initWordCloud = (data: any, max = 72) => {
  var myChart = echarts.init(wordcloudRef.value);
  const option = {
    title: {
      text: '分类列词云图',
      left: 'center'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '75%',
        height: '60%',
        right: null,
        bottom: null,
        sizeRange: [14, max],
        rotationRange: [-45, 45],
        rotationStep: 15, // 0 15 30 45 度倾斜
        gridSize: 12,
        drawOutOfBound: false,
        // 这是全局的文字样式，相对应的还可以对每个词设置字体样式
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          // 颜色可以用一个函数来返回字符串
          color: function () {
            // Random color
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          },
          emphasis: {
            shadowBlur: 2,
            shadowColor: '#333'
          }
        },
        // Data is an array. Each array item must have name and value property.
        data: data
      }]
  };
  option && myChart.setOption(option);
  window.addEventListener("resize", () => {
    if (myChart) {
      myChart.resize();
    }
  });
}

const barOptions = ref<ECOption>({
  title: {
    text: '数值列直方图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
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
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar',
      color: '#8378ea',
      showBackground: true,
      barGap: 100,
      itemStyle: {
        borderRadius: [40, 40, 0, 0]
      },
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
}) as Ref<ECOption>;
const { domRef: barRef } = useEcharts(barOptions);

const bar1Options = ref<ECOption>({
  title: {
    text: 'KDE Plot',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
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
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar',
      color: '#8378ea',
      showBackground: true,
      barGap: 100,
      itemStyle: {
        borderRadius: [40, 40, 0, 0]
      },
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    },
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
}) as Ref<ECOption>;
const { domRef: bar1Ref } = useEcharts(bar1Options);

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
    // nameLocation: 'center',
    // nameTextStyle: {
    //   fontStyle: 'oblique',
    //   fontWeight: 'bold',
    //   fontSize: 16
    // },
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

const Box1option = ref<ECOption>({
  title: [
    {
      text: '数值列箱线图',
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
      source: []
    },
    {
      transform: {
        type: 'boxplot',
        config: {
          itemNameFormatter(params) {
            return Header1[params.value];
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
    splitArea: {
      show: true
    }
  },
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
const { domRef: BoxRef } = useEcharts(Box1option);

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
      end: 10
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
      end: 10
    }
  ],
  series: []
}) as Ref<ECOption>;
const { domRef: DuiDieBar } = useEcharts(DuiDieBaroption);

const catBaroption = ref<ECOption>({
  title: {
    text: '分类列条形图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    name: '',
    nameLocation: 'center',
    nameTextStyle: {
      fontStyle: 'oblique',
      fontWeight: 'bold',
      fontSize: 16
    },
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    {
      type: 'inside',
      show: true,
      start: 0,
      end: 100
    }
  ],
  series: [
    {
      data: [],
      type: 'bar'
    }
  ]
}) as Ref<ECOption>;
const { domRef: catBarref } = useEcharts(catBaroption);

const catPieoption = ref<ECOption>({
  title: {
    text: '分类列饼图',
    left: 'center'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '分类',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}) as Ref<ECOption>;
const { domRef: catPieref } = useEcharts(catPieoption);

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

// function echars(data){
//   const alldata = data.allData;
//   hotOptions.value.series[0].data = alldata;
//   hotOptions.value.yAxis.data = data.header;
// }

async function handleUpdateValue1() {
  startLoading();
  const select = valueSelect1.value;
  const name = valueSelect.value;
  // hotOptionsOne.value.xAxis.data[0] = select;
  if (select !== '') {
    const { data } = await fetchDistriSelect1(select,name);
    kind1.i = data.kind;
    if (data.kind === 1) {
      Header1[0] = select;
      Box1option.value.xAxis.name = select;
      barOptions.value.xAxis.name = select;
      tableData.all = data.x[0];
      tableData.kind = data.x[1];
      tableData.maxKind = data.x[2];
      tableData.maxKindPer = ((data.x[3] / data.x[0]) * 100).toFixed(2);
      tableData.missNum = data.x[4];
      tableData.missPercent = ((data.x[4] / data.x[0]) * 100).toFixed(2);
      tableData.avg = data.x[5].toFixed(2);
      tableData.max = data.x[6];
      tableData.min = data.x[7];
      tableData.center = data.x[8];
      tableData.maxCenter = data.x[9];
      tableData.minCenter = data.x[10];
      tableData.fangcha = data.x[11].toFixed(4);
      tableData.biaozhun = data.x[12].toFixed(4);
      tableData.piandu = data.x[13].toFixed(4);
      tableData.fengdu = data.x[14].toFixed(4);
      echars1(data);
    } else {
      catBaroption.value.xAxis.name = select;
      tableData1.all = data.all;
      tableData1.kind = data.header.length;
      tableData1.maxKind = data.maxKind;
      tableData1.maxKindPer = ((data.max / data.all) * 100).toFixed(2);
      tableData1.missNum = data.nullsum;
      tableData1.missPercent = ((data.nullsum / data.all) * 100).toFixed(2);
      echars5(data);
    }
  }
  endLoading();
}

async function handleUpdateValue2() {
  startLoading();
  const select = valueSelect2.value;
  const name = valueSelect.value;
  if (select.length === 2) {
    const { data } = await fetchDistriSelect2(select, name);
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

function echars1(data){
  const alldata = data.allData;
  const boxdata = [];
  const Count=data.count;
  const Fenqu = data.qujian;
  boxdata[0] = alldata;
  barOptions.value.series[0].data = Count;
  barOptions.value.xAxis.data = Fenqu;
  bar1Options.value.series[0].data = Count;
  bar1Options.value.series[1].data = Count;
  bar1Options.value.xAxis.data = Fenqu;
  Box1option.value.dataset[0].source = boxdata;
}

function echars2(data) {
  const sandData = data.sandData;
  Scatteroption.value.series[0].data = sandData;
	// Boxoption.value.dataset[0].source = sandData;
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

function echars5(data) {
  const header = data.header;
  const barData = data.barData;
  catBaroption.value.xAxis.data = header;
  catBaroption.value.series[0].data = barData;
  const Data = [];
  for (let i = 0; i < header.length; i++) {
    Data[i] = { value: barData[i], name: header[i] };
  }
  catPieoption.value.series[0].data = Data;
  initWordCloud(Data);
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
