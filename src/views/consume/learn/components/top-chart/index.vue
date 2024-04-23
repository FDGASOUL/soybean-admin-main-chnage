<template>
  <!-- 使用 n-grid 进行布局 -->
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- 数据集选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:5" style="height: 200px">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 下拉选择框 -->
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue"
        />
      </n-card>
    </n-grid-item>
    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 显示数据分析的消息 -->
        <div v-html="tableData.message"></div>
      </n-card>
    </n-grid-item>
    <!-- 学术场所消费比例扇形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="学术场所消费比例扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 使用 ref 引用扇形图容器 -->
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <!-- 各学术地点消费金额条形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="各学术地点消费金额条形图" :bordered="false" class="rounded-16px shadow-sm">
        <!-- 使用 ref 引用条形图容器 -->
        <div ref="lineRef2" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <!-- 工作日学术场所消费时间图卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="工作日学术场所消费时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 使用 ref 引用折线图容器 -->
        <div ref="lineRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <!-- 非工作日学术场所消费时间图卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="非工作日学术场所消费时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 使用 ref 引用折线图容器 -->
        <div ref="lineRef1" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <!-- 数据分析消息卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 显示数据分析消息 -->
        <div v-html="tableData.message1"></div>
      </n-card>
    </n-grid-item>
    <!-- 数据分析消息卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 显示数据分析消息 -->
        <div v-html="tableData.message2"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchDataName, fetchLearnData } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
const valueSelect = ref('');
const options_edit = ref([]);
const tableData = reactive({
  message: '',
  message1: '',
  message2: ''
});
const { startLoading, endLoading } = useLoading(false);

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
      color: [
        '#5da8ff',
        '#EE6666',
        '#fedc69',
        '#26deca',
        '#9bca63',
        '#f4b35d',
        '#f4e23d',
        '#f4a23d',
        '#f4e23d',
        '#f4a23d'
      ],
      name: '消费比例分布',
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

const lineOptions = ref<ECOption>({
  tooltip: {
    trigger: 'axis'
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
	xAxis: {
		type: 'category',
		name: 'hour',
		data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
	},
	yAxis: {
    type: 'value',
		name: '消费次数'
  },
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
}) as Ref<ECOption>;
const { domRef: lineRef } = useEcharts(lineOptions);

const lineOptions1 = ref<ECOption>({
  tooltip: {
    trigger: 'axis'
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
	xAxis: {
		type: 'category',
		name: 'hour',
		data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
	},
	yAxis: {
    type: 'value',
		name: '消费次数'
  },
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
}) as Ref<ECOption>;
const { domRef: lineRef1 } = useEcharts(lineOptions1);

const lineOptions2 = ref<ECOption>({
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
    name: '次数'
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '零花(0~1)',
      color: '#f4e23d',
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
      name: '小额消费(1~10)',
      color: '#f4a23d',
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
      name: '中等消费(10~50)',
      color: '#26deca',
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
      name: '大额消费(50~100)',
      color: '#5da8ff',
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
      name: '超大额消费(100~)',
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
const { domRef: lineRef2 } = useEcharts(lineOptions2);

defineOptions({ name: 'DashboardAnalysisTopCard' });

async function getLearnData() {
  startLoading(); // 开始加载
  const name = valueSelect.value; // 获取选择的数据集名称
  const { data } = await fetchLearnData(name); // 从后端获取学术场所消费数据
  console.log(data.dept_column_exists); // 输出学术场所是否存在的信息
  if (data.dept_column_exists === false) {
    // 如果不存在学术场所列
    tableData.message = '此数据集非学生消费数据集，无法分析'; // 更新消息为无法分析的提示
    window.$message?.error('此数据集非学生消费数据集，无法分析！'); // 显示错误提示
  } else {
    // 学术场所列存在
    echarts(data); // 调用绘制学术场所消费比例扇形图的函数
    echarts1(data); // 调用绘制工作日消费时间图的函数
    echarts2(data); // 调用绘制非工作日消费时间图的函数
    echarts3(data); // 调用绘制各学术地点消费金额条形图的函数
  }
  endLoading(); // 结束加载
}

function echarts(data) {
  // 绘制学术场所消费比例扇形图
  pieOptions.value.series[0].data = data.data.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
  tableData.message = `综合来看，消费次数最多的学术场所是：${data.data[0].name}，消费次数为：${
    data.data[0].value
  }人<br>消费次数最少的学术场所是：${data.data[data.data.length - 1].name}，消费次数仅有：${
    data.data[data.data.length - 1].value
  }人`; // 更新消息，显示消费次数最多和最少的学术场所
}

function echarts1(data) {
  // 绘制工作日学术场所消费时间图
  lineOptions.value.series[0].data = data.weekday; // 设置工作日消费时间数据
  const sortedData = [...data.weekday].sort((a, b) => b - a); // 对工作日消费时间数据进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的消费次数
  const topThreeIndices = topThreeValues.map(value => data.weekday.indexOf(value)); // 找到前三大消费次数对应的时间索引
  let message = '工作日学术场所的消费时间特点如下：'; // 初始化消息
  for (let i = 0; i < 2; i++) {
    const index = topThreeIndices[i]; // 获取时间索引
    const value = topThreeValues[i]; // 获取消费次数
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`; // 拼接消息
  }
  message += '<br>对比非工作日，工作日的整体消费次数明显更高，学生们更愿意在工作日在学术场所消费，符合常识。'; // 添加额外消息
  tableData.message1 = message; // 更新消息
}

function echarts2(data) {
  // 绘制非工作日学术场所消费时间图
  lineOptions1.value.series[0].data = data.weekend; // 设置非工作日消费时间数据
  const sortedData = [...data.weekend].sort((a, b) => b - a); // 对非工作日消费时间数据进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的消费次数
  const topThreeIndices = topThreeValues.map(value => data.weekend.indexOf(value)); // 找到前三大消费次数对应的时间索引
  let message = '非工作日学术场所的消费时间特点如下：'; // 初始化消息
  for (let i = 0; i < 2; i++) {
    const index = topThreeIndices[i]; // 获取时间索引
    const value = topThreeValues[i]; // 获取消费次数
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`; // 拼接消息
  }
  message +=
    '<br>对比工作日，非工作日的整体消费次数明显下降，原因可能是非工作日学生在宿舍休息或外出游玩，极少访问学术场所。'; // 添加额外消息
  tableData.message2 = message; // 更新消息
}

function echarts3(data) {
  // 绘制各学术地点消费金额条形图
  lineOptions2.value.yAxis.data = data.dept; // 设置学术地点名称
  lineOptions2.value.series[0].data = data.zero; // 设置消费金额为0的数据
  lineOptions2.value.series[1].data = data.small; // 设置消费金额较少的数据
  lineOptions2.value.series[2].data = data.medium; // 设置消费金额一般的数据
  lineOptions2.value.series[3].data = data.big; // 设置消费金额较多的数据
  lineOptions2.value.series[4].data = data.superbig; // 设置消费金额很多的数据
}

async function getDataName() {
  startLoading(); // 开始加载
  const { data } = await fetchDataName(); // 从后端获取数据集名称列表
  options_edit.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  }); // 更新数据集名称选项列表
}

async function handleUpdateValue() {
  startLoading(); // 开始加载
  getLearnData(); // 获取学术场所消费数据
  endLoading(); // 结束加载
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
