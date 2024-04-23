<template>
  <!-- 网格布局 -->
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- 数据集选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 下拉选择框 -->
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValues"
        />
      </n-card>
    </n-grid-item>
    <!-- 相关性度量函数选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="指定相关性度量函数" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 下拉选择框 -->
        <n-select v-model:value="value" :options="options" @update:value="handleUpdateValue" />
      </n-card>
    </n-grid-item>
    <!-- 相关性排序卡片 -->
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="指定列相关性排序" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 表格容器 -->
        <div ref="hotRefOne" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <!-- 列选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="在此指定列" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 下拉选择框 -->
        <n-select
          v-model:value="valueSelect1"
          :options="options_edit1"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue1"
        />
      </n-card>
    </n-grid-item>
    <!-- 相关性热力图卡片 -->
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="相关性热力图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 图表容器 -->
        <div ref="hotRef" class="w-full h-500px"></div>
      </n-card>
    </n-grid-item>
    <!-- 列选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="选择两列获取其散点图及相关性回归线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 下拉多选框 -->
        <n-select v-model:value="valueSelect2" multiple :options="options_edit2" :consistent-menu-width="false" />
        <!-- 确定按钮 -->
        <div style="display: block; margin: auto; width: fit-content; margin-top: 150px">
          <n-button type="success" @click="handleUpdateValue2"> 确定 </n-button>
        </div>
      </n-card>
    </n-grid-item>
    <!-- 散点图及相关性回归线卡片 -->
    <n-grid-item span="0:24 640:24 1024:20">
      <n-card title="散点图及相关性回归线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 图表容器 -->
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

// 异步函数：获取相关性数据
async function getCorrData(type: string) {
  // 开始加载状态
  startLoading();

  // 获取选择的数据集名称
	const name = valueSelect.value;

  // 发起网络请求，获取相关性数据
  const { data } = await fetchCorrData(type, name);

  // 更新相关性排序选项
  options_edit1.value = data.header.map(item => {
    return {
      label: item,
      value: item
    };
  });

  // 更新散点图选择列的选项
  options_edit2.value = data.header.map(item => {
    return {
      label: item,
      value: item
    };
  });

  // 绘制相关性热力图
  echars(data);
}

// 绘制相关性热力图
function echars(data){
  // 提取相关性数据
  const alldata = data.allData;
  const header = data.header;
	const header1 = data.header1;

  // 更新相关性热力图的数据和坐标轴标签
  hotOptions.value.series[0].data = alldata;
  hotOptions.value.yAxis.data = header;
	hotOptions.value.xAxis.data = header1;
}

// 绘制相关性排序图
function echars1(data){
  // 提取相关性排序数据
  const alldata = data.allData;
  const header = data.headerOrder;

  // 更新相关性排序图的数据和坐标轴标签
  hotOptionsOne.value.series[0].data = alldata;
  hotOptionsOne.value.yAxis.data = header;
}

// 绘制散点图及相关性回归线
function echars2(data){
  // 提取散点图及相关性回归线数据
  const corrdata = data.corrData;
  const data_predict = data.data_predict;

  // 更新散点图及相关性回归线的数据
  Scatteroption.value.series[0].data = corrdata;
	Scatteroption.value.series[1].data = data_predict;
}

// 处理第一个下拉选择框的更新事件
async function handleUpdateValue1() {
  // 开始加载状态
  startLoading();

  // 获取选择的列和相关性度量函数
  const select = valueSelect1.value;
  const type = value.value;
  const name = valueSelect.value;

  // 更新相关性排序图的横轴标签
  hotOptionsOne.value.xAxis.data[0] = select;

  // 如果选择的列不为空，则发起网络请求，获取相关性排序数据并绘制图表
  if (select !== '') {
    const { data } = await fetchCorrSelect1(select, type, name);
    echars1(data);
  }

  // 结束加载状态
  endLoading();
}

// 处理第二个下拉选择框的更新事件
async function handleUpdateValue2() {
  // 开始加载状态
  startLoading();

  // 获取选择的列
  const select = valueSelect2.value;
	const name = valueSelect.value;

  // 如果选择了两列，则发起网络请求，获取散点图及相关性回归线数据并绘制图表
  if (select.length === 2) {
    const { data } = await fetchCorrSelect2(select, name);
    echars2(data);
  } else {
    // 如果未选择两列，则显示错误信息
    window.$message?.error('请指定两列！');
  }

  // 结束加载状态
  endLoading();
}

// 处理相关性度量函数下拉选择框的更新事件
async function handleUpdateValue() {
  // 开始加载状态
  startLoading();

  // 获取选择的相关性度量函数
  const type = value.value;

  // 获取并绘制相关性数据
  getCorrData(type);

  // 处理第一个下拉选择框的更新事件
  handleUpdateValue1();

  // 结束加载状态
  endLoading();
}

// 异步函数：获取数据集名称
async function getDataName() {
  // 开始加载状态
  startLoading();

  // 发起网络请求，获取数据集名称
  const { data } = await fetchDataName();

  // 初始化第一个下拉选择框的选项
  options_edit.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  });
}

// 处理数据集选择下拉选择框的更新事件
async function handleUpdateValues() {
  // 开始加载状态
  startLoading();

  // 获取相关性数据（默认为皮尔森相关系数）
  getCorrData('pearson');

  // 结束加载状态
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
