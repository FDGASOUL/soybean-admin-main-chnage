<template>
  <!-- 网格布局 -->
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
    <n-grid-item span="0:24 640:24 1024:14">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message"></div>
      </n-card>
    </n-grid-item>

    <!-- 各食堂就餐人数扇形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="各食堂就餐人数扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 早餐各食堂就餐人数扇形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="早餐各食堂就餐人数扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef1" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 午餐各食堂就餐人数扇形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="午餐各食堂就餐人数扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef2" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 晚餐各食堂就餐人数扇形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="晚餐各食堂就餐人数扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef3" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message1"></div>
      </n-card>
    </n-grid-item>

    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message2"></div>
      </n-card>
    </n-grid-item>

    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message3"></div>
      </n-card>
    </n-grid-item>

    <!-- 各食堂消费金额条形图卡片 -->
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="各食堂消费金额条形图" :bordered="false" class="rounded-16px shadow-sm">
        <!-- 条形图容器 -->
        <div ref="lineRef2" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>

    <!-- 工作日食堂就餐时间图卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="工作日食堂就餐时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 折线图容器 -->
        <div ref="lineRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 非工作日食堂就餐时间图卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="非工作日食堂就餐时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 折线图容器 -->
        <div ref="lineRef1" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>

    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message4"></div>
      </n-card>
    </n-grid-item>

    <!-- 数据分析卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message5"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchDataName, fetchEatData } from '@/service';
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
  message2: '',
  message3: '',
  message4: '',
  message5: ''
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
      name: '就餐人数分布',
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

const pieOptions1 = ref<ECOption>({
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
      name: '就餐人数分布',
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
const { domRef: pieRef1 } = useEcharts(pieOptions1);

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
      name: '就餐人数分布',
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

const pieOptions3 = ref<ECOption>({
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
      name: '就餐人数分布',
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
const { domRef: pieRef3 } = useEcharts(pieOptions3);

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

async function getEatData() {
  startLoading(); // 开始加载动画
  const name = valueSelect.value; // 获取选择的数据集名称
  const { data } = await fetchEatData(name); // 从服务器获取数据
  console.log(data.dept_column_exists); // 打印数据中是否存在部门列的信息
  if (data.dept_column_exists === false) { // 如果数据中不存在部门列
    // 显示错误消息并更新表格消息
    tableData.message = '此数据集非学生消费数据集，无法分析';
    window.$message?.error('此数据集非学生消费数据集，无法分析！');
  } else { // 如果数据中存在部门列
    // 调用不同的 echarts 函数分析数据并更新表格消息
    echarts(data);
    echarts1(data);
    echarts2(data);
    echarts3(data);
    echarts4(data);
    echarts5(data);
    echarts6(data);
  }
  endLoading(); // 结束加载动画
}

// 分析综合消费情况并更新消息
function echarts(data) {
  pieOptions.value.series[0].data = data.data.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
  tableData.message = `综合来看，最受欢迎的食堂是：${data.data[0].name}，就餐人数为：${
    data.data[0].value
  }人<br>最不受欢迎的食堂是：${data.data[data.data.length - 1].name}，就餐人数仅有：${
    data.data[data.data.length - 1].value
  }人<br>因此，我们建议学校在${data.data[0].name}适当增加摊位数量以及工作人员，以满足学生的需求。同时${
    data.data[data.data.length - 1].name
  }就餐人数较少，学校应当调查原因，加强对其食品质量监管，可以考虑减少摊位数量或者调整工作人员的工作时间，避免资源浪费。<br>建议学校定期对食堂进行调查和评估，以了解学生的需求和对食堂的满意度，并根据调查结果调整食堂的经营策略和服务质量，提升学生的就餐体验。`;
}

// 分析早餐消费情况并更新消息
function echarts1(data) {
  pieOptions1.value.series[0].data = data.data1.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
  tableData.message1 = `在早餐时间，最受欢迎的食堂是：${data.data1[0].name}，就餐人数为：${
    data.data1[0].value
  }人<br>最不受欢迎的食堂是：${data.data1[data.data1.length - 1].name}，就餐人数仅有：${
    data.data1[data.data1.length - 1].value
  }人<br>建议学校根据早餐时间段食堂的就餐情况，合理调整食堂的营业时间和摊位数量，以满足学生在早餐时间的就餐需求，并提升食堂的服务质量，提高学生的就餐体验。`;
}

// 分析午餐消费情况并更新消息
function echarts2(data) {
  pieOptions2.value.series[0].data = data.data2.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
  tableData.message2 = `在午餐时间，最受欢迎的食堂是：${data.data2[0].name}，就餐人数为：${
    data.data2[0].value
  }人<br>最不受欢迎的食堂是：${data.data2[data.data2.length - 1].name}，就餐人数仅有：${
    data.data2[data.data2.length - 1].value
  }人<br>在午餐期间，学生的就餐人数较多，建议学校在午餐期间适当增加${
    data.data2[0].name
  }的摊位数量以及工作人员，以满足学生的需求。<br>建议学校根据午餐时间段食堂的就餐情况，增加食堂的摊位数量和工作人员，以缓解午餐期间的拥挤情况，提高学生的就餐效率和舒适度。同时，也可以考虑推出更多种类的菜品和优惠活动，吸引更多学生在午餐时间选择在食堂就餐。`;
}

// 分析晚餐消费情况并更新消息
function echarts3(data) {
  pieOptions3.value.series[0].data = data.data3.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
  tableData.message3 = `在晚餐时间，最受欢迎的食堂是：${data.data3[0].name}，就餐人数为：${
    data.data3[0].value
  }人<br>最不受欢迎的食堂是：${data.data3[data.data3.length - 1].name}，就餐人数仅有：${
    data.data3[data.data3.length - 1].value
  }人<br>在晚餐期间，学生的就餐人数较多，建议学校在晚餐期间适当增加${
    data.data3[0].name
  }的摊位数量以及工作人员，以满足学生的需求。`;
}

// 分析工作日食堂就餐时间情况并更新消息
function echarts4(data) {
  lineOptions.value.series[0].data = data.weekday;
  const sortedData = [...data.weekday].sort((a, b) => b - a); // 对数组进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的数字
  const topThreeIndices = topThreeValues.map(value => data.weekday.indexOf(value)); // 找到前三大数字的索引

  // 构造消息字符串
  let message = '工作日食堂就餐时间特点如下：';
  for (let i = 0; i < 3; i++) {
    const index = topThreeIndices[i];
    const value = topThreeValues[i];
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`;
  }
  message +=
    '<br>对比非工作日，工作日的整体消费次数明显更高且就餐时间更加聚集，原因可能是工作日学生由于需要上课的原因导致前往食堂就餐的人数很多，且下课时间大致相同，导致结果聚集。<br>建议学校根据工作日食堂就餐时间特点，调整食堂的基础设施和服务安排，如增加就餐空间、改善就餐时间段的就餐体验，以缓解工作日食堂的拥挤情况，提高学生的就餐效率和舒适度。';

  // 更新 tableData.message4
  tableData.message4 = message;
}

// 分析非工作日食堂就餐时间情况并更新消息
function echarts5(data) {
  lineOptions1.value.series[0].data = data.weekend;
  const sortedData = [...data.weekend].sort((a, b) => b - a); // 对数组进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的数字
  const topThreeIndices = topThreeValues.map(value => data.weekend.indexOf(value)); // 找到前三大数字的索引

  // 构造消息字符串
  let message = '非工作日食堂就餐时间特点如下：';
  for (let i = 0; i < 3; i++) {
    const index = topThreeIndices[i];
    const value = topThreeValues[i];
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`;
  }
  message +=
    '<br>对比工作日，非工作日的整体消费次数明显下降且就餐时间更加分散，原因可能是非工作日学生由于直接在宿舍点外卖或者外出游玩就餐等原因导致前往食堂就餐的人数大幅减少。<br>针对非工作日食堂消费次数下降的情况，学校可以考虑提供更具吸引力的食堂活动和优惠，以增加学生在非工作日的食堂就餐需求，例如举办主题活动、推出特色菜品等。同时，也可以考虑调整食堂的开放时间，以满足学生在不同时间段的就餐需求。';

  // 更新 tableData.message5
  tableData.message5 = message;
}

// 分析食堂消费金额情况并更新消息
function echarts6(data) {
  lineOptions2.value.yAxis.data = data.dept; // 更新 y 轴数据
  // 更新各个系列的数据
  lineOptions2.value.series[0].data = data.zero;
  lineOptions2.value.series[1].data = data.small;
  lineOptions2.value.series[2].data = data.medium;
  lineOptions2.value.series[3].data = data.big;
  lineOptions2.value.series[4].data = data.superbig;
}

// 从服务器获取数据集名称
async function getDataName() {
  startLoading(); // 开始加载动画
  const { data } = await fetchDataName(); // 从服务器获取数据
  // 更新下拉选择框的选项
  options_edit.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  });
}

// 处理数据集选择更新事件
async function handleUpdateValue() {
  startLoading(); // 开始加载动画
  getEatData(); // 获取并分析数据
  endLoading(); // 结束加载动画
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
