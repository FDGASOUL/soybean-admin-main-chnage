<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="数据集选择" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:16">
      <n-card title="贝叶斯网络结构" :bordered="false" class="rounded-16px shadow-sm">
        <div ref="GraphRef" class="w-full h-500px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="指定节点下载其条件概率表" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-select v-model:value="valueSelect1" :options="options_edit1" :consistent-menu-width="false" />
        <div style="margin-left: 55px; margin-top: 200px">
          <n-button type="success" @click="downlandData()"> 确定 </n-button>
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchBysData, fetchBysSelect1, fetchDataName } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import { localStg } from '~/src/utils';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';

const { loading, startLoading, endLoading } = useLoading(false);
const valueSelect = ref('');
const options_edit = ref([]);
const valueSelect1 = ref('');
const options_edit1 = ref([]);
defineOptions({ name: 'DashboardAnalysisTopCard' });

const GraphOptions = ref<ECOption>({
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
	toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    {
      type: 'graph',
      layout: 'circular',
      symbolSize: 50,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: [],
      // links: [],
      links: [
        {
          source: '',
          target: ''
        },
        {
          source: '',
          target: ''
        },
        {
          source: '',
          target: ''
        },
        {
          source: '',
          target: ''
        },
        {
          source: '',
          target: ''
        },
        {
          source: '',
          target: ''
        }
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
}) as Ref<ECOption>;
const { domRef: GraphRef } = useEcharts(GraphOptions);

async function getBysData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchBysData(name);
  echars1(data);
  echars2(data);
}

function echars1(data){
}

function echars2(data) {
  const nodes = data.nodes;
  const edges = data.edges;
  const num = data.nodesNum;
  const num1 = data.edgesNum;
  const some = [];
  let j = 0;
  for (; j < num; j++) {
    some[j] = nodes[j];
  }
  options_edit1.value = some.map(item => {
    return {
      label: item,
      value: item
    };
  });
  const nt = [];
  for (let k = 0; k < num; k++) {
    nt[k] = { name: nodes[k] };
  }
  GraphOptions.value.series[0].data = nt;
  for (let i = 0; i < num1; i++) {
    GraphOptions.value.series[0].links[i].source = edges[i][0];
    GraphOptions.value.series[0].links[i].target = edges[i][1];
  }
  if (num === 0) {
    window.$message?.success('该数据集无贝叶斯网络结构');
  }
}

const downlandData = () => {
  const xhr = new XMLHttpRequest();
  const select = valueSelect1.value;
  const name = valueSelect.value;
  xhr.open('POST', `http://localhost:5000/bysSelect1?select=${select}&name=${name}`, true);
  xhr.responseType = 'blob';
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.setRequestHeader('Authorization', `Bearer ${localStg.get('token')}`);
  // eslint-disable-next-line func-names
  xhr.onload = function () {
    if (this.status === 200) {
      const blob = this.response;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      // eslint-disable-next-line func-names
      reader.onload = function (e) {
        const a = document.createElement('a');
        a.download = 'probability.csv';
        if (typeof e.target.result === 'string') {
          a.href = e.target.result;
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };
  xhr.send(JSON.stringify({ data_name: 'left_test' }));
};

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
  getBysData();
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
