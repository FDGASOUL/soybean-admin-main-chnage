<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:5" style="height: 218px">
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
      <n-card title="消费数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-row>
          <n-col :span="12">
            <n-statistic label="人均消费频次" :value="tableData.per_times"> </n-statistic>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="12">
            <n-statistic label="人均消费额" :value="tableData.per_money"> </n-statistic>
          </n-col>
        </n-row>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="消费比列扇形图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="数据分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchDataName, fetchFeatureData } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
const valueSelect = ref('');
const options_edit = ref([]);
const tableData = reactive({
  per_times: 0,
  per_money: 0,
  message: ''
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
      name: '消费分布',
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

defineOptions({ name: 'DashboardAnalysisTopCard' });

async function getFeatureData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchFeatureData(name);
  console.log(data.dept_column_exists);
  if (data.dept_column_exists === false) {
    window.$message?.error('此数据集非学生消费数据集，无法分析！');
  } else {
    tableData.per_times = data.per_times;
    tableData.per_money = data.per_money;
    echarts(data);
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
  tableData.message = `综合来看，学生消费占比最大的是：${data.data[0].name}，总消费金额为：${
    data.data[0].value
  }元，<br>仅次于${data.data[0].name}的是${data.data[1].name}，总消费金额为：${
    data.data[1].value
  }元，<br>学生消费占比最小的是：${data.data[data.data.length - 1].name}，消费金额仅有：${
    data.data[data.data.length - 1].value
  }元。`;
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
  getFeatureData();
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
