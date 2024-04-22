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
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-html="tableData.message"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="学术场所消费比例扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="工作日学术场所消费时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="lineRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="非工作日学术场所消费时间图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div ref="lineRef1" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-html="tableData.message1"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
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

defineOptions({ name: 'DashboardAnalysisTopCard' });

async function getLearnData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchLearnData(name);
  console.log(data.dept_column_exists);
  if (data.dept_column_exists === false) {
    tableData.message = '此数据集非学生消费数据集，无法分析';
    window.$message?.error('此数据集非学生消费数据集，无法分析！');
  } else {
    echarts(data);
    echarts1(data);
    echarts2(data);
  }
  endLoading();
}

function echarts(data) {
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
  }人`;
}

function echarts1(data) {
  lineOptions.value.series[0].data = data.weekday;
  const sortedData = [...data.weekday].sort((a, b) => b - a); // 对数组进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的数字
  const topThreeIndices = topThreeValues.map(value => data.weekday.indexOf(value)); // 找到前三大数字的索引
  let message = '工作日学术场所的消费时间特点如下：';
  for (let i = 0; i < 2; i++) {
    const index = topThreeIndices[i];
    const value = topThreeValues[i];
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`;
  }
  message += '<br>对比非工作日，工作日的整体消费次数明显更高，学生们更愿意在工作日在学术场所消费，符合常识。';
  tableData.message1 = message;
}

function echarts2(data) {
  lineOptions1.value.series[0].data = data.weekend;
  const sortedData = [...data.weekend].sort((a, b) => b - a); // 对数组进行降序排序
  const topThreeValues = sortedData.slice(0, 3); // 取出前三大的数字
  const topThreeIndices = topThreeValues.map(value => data.weekend.indexOf(value)); // 找到前三大数字的索引
  let message = '非工作日学术场所的消费时间特点如下：';
  for (let i = 0; i < 2; i++) {
    const index = topThreeIndices[i];
    const value = topThreeValues[i];
    message += `\n第${i + 1}大的时间峰值为 ${index}时，消费次数为 ${value}次,`;
  }
  message +=
    '<br>对比工作日，非工作日的整体消费次数明显下降，原因可能是非工作日学生在宿舍休息或外出游玩，极少访问学术场所。';
  tableData.message2 = message;
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
  getLearnData();
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
