<template>
  <!-- 网格布局 -->
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- 数据集选择卡片 -->
    <n-grid-item span="0:24 640:24 1024:6" style="height: 200px">
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
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card title="聚类分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <n-card title="特征数据直方图" :bordered="false" class="h-full rounded-16px shadow-sm">
        <img :src="tableData.imageSrc" alt="Cluster Analysis Result" />
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:20">
      <n-card title="聚类结果" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div v-html="tableData.message1"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="下载聚类结果" :bordered="false" class="h-full rounded-16px shadow-sm">
        <div style="display: block; margin: auto; width: fit-content">
          <n-button type="info" @click="downlandData()"> 点击下载 </n-button>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="" :bordered="false" class="h-full rounded-16px shadow-sm" style="background-color: #add8e6">
        <div v-html="tableData.message2"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="" :bordered="false" class="h-full rounded-16px shadow-sm" style="background-color: #ff8c00">
        <div v-html="tableData.message3"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="" :bordered="false" class="h-full rounded-16px shadow-sm" style="background-color: #90ee90">
        <div v-html="tableData.message4"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card title="" :bordered="false" class="h-full rounded-16px shadow-sm" style="background-color: #EE6666">
        <div v-html="tableData.message5"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:20">
      <n-card title="各类消费人群占比" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 扇形图容器 -->
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:4">
      <n-card title="结果分析" :bordered="false" class="h-full rounded-16px shadow-sm">
        <!-- 数据分析内容，使用 v-html 动态渲染 -->
        <div v-html="tableData.message6"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { localStg } from '~/src/utils';
import { fetchDataName, fetchDrawData } from '@/service';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import type { UserManagement } from '~/src/typings/business';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
const valueSelect = ref('');
const options_edit = ref([]);
const tableData = reactive({
  message:
    '为了将学生的整体校园消费行为进行分类，选择了当月消费总金额，消费次数，卡内存款作为特征进行聚类，采用的聚类算法为 k-means 算法（k-均值聚类算法）。<br>k-means 算法（k-均值聚类算法）是一种基本的已知聚类类别数的划分算法。它是很典型的基于距离的聚类算法，采用距离作为相似性的评价指标，即认为两个对象的距离越近，其相似度就越大。该算法认为簇是由距离靠近的对象组成的，因此把得到紧凑且独立的簇作为最终目标。它可以处理大数据集，且高效。<br>通过对数据的观察，我们将学生的整体校园消费行为分为 4 类，因此将 k-means 算法中的 k 值取为 4，运用公式 data = 1.0*(data - data.mean())/data.std() 进行数据标准化，采用欧式距离作为度量，在下方画出了每一项特征对应的数据直方图',
  message1: '',
  message2: '',
  message3: '',
  message4: '',
  message5: '',
  message6: '',
  imageSrc: ''
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
        '#add8e6',
        '#ff8c00',
        '#90ee90',
        '#EE6666',
        '#9bca63',
        '#f4b35d',
        '#f4e23d',
        '#f4a23d',
        '#f4e23d',
        '#f4a23d'
      ],
      name: '消费群体占比',
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

async function getDrawData() {
  startLoading();
  const name = valueSelect.value;
  const { data } = await fetchDrawData(name);
  if (data.dept_column_exists === false) {
    tableData.message = '此数据集非学生消费数据集，无法分析';
    window.$message?.error('此数据集非学生消费数据集，无法分析！');
  } else {
    echars(data);
    echars1(data);
  }
  endLoading();
}

function echars(data) {
  tableData.imageSrc = data.imageData;
  tableData.imageSrc = `data:image/png;base64,${data.imageData}`;
  tableData.message1 =
    '根据消费金额、卡内盈余与消费次数三项特征对应的数据直方图进行分析，我们将学生分成了四类群体如下：';
  tableData.message2 = `<div style="text-align: center;"><strong>储蓄积极型</strong></div><br>此类学生消费金额与消费次数中等，卡内存款较多，属于中等消费水平，有较高的消费潜力，有较为良好的储蓄意识，属于滞后消费。经济状况应该较好。`;

  tableData.message3 = `<div style="text-align: center;"><strong>奢华花费型</strong></div><br>此类学生消费金额与消费次数很高，卡内存款中等，属于高消费水平，但消费潜力较弱，总体消费能力较高。经济状况应该较好。`;
  tableData.message4 = `<div style="text-align: center;"><strong>节俭理财型</strong></div><br>此类学生消费金额、消费次数与卡内存款都较低，属于低消费水平，且消费潜力较弱，总体消费能力较低。经济状况应该较差。`;
  tableData.message5 = `<div style="text-align: center;"><strong>消费谨慎型</strong></div><br>此类学生消费金额、消费次数与卡内存款都在中等，属于中等消费水平，消费潜力一般，存储意识相对于储蓄积极型较弱。经济状况应该一般。`;
  tableData.message6 =
    '根据上述分析，我们可以看出，学生的消费行为可以分为四类，分别是储蓄积极型、奢华花费型、节俭理财型、消费谨慎型。<br>对学校的建议：对于储蓄积极型学生，可以适当引导其消费，提高其消费水平；对于奢华花费型学生，可以适当引导其节俭，提高其储蓄意识；尤其应该重点关注节俭理财型的学生，这类学生的经济状况一般较差，学校可以适当给与补助，以及作为经困生选拔的标志。';
}

function echars1(data) {
  pieOptions.value.series[0].data = data.piedata.map(item => {
    return {
      name: item.name,
      value: item.value
    };
  });
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

const downlandData = () => {
  const xhr = new XMLHttpRequest();

  // 构建下载请求
  xhr.open('POST', `http://localhost:5000/downland_type`, true);
  xhr.responseType = 'blob'; // 设置响应类型为 Blob
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `Bearer ${localStg.get('token')}`); // 添加身份验证信息
  // 监听请求完成事件
  xhr.onload = function () {
    if (this.status === 200) {
      const blob = this.response; // 获取 Blob 数据
      const reader = new FileReader(); // 创建文件读取器
      reader.readAsDataURL(blob); // 读取 Blob 数据为 DataURL
      // 监听读取完成事件
      reader.onload = function (e) {
        const a = document.createElement('a'); // 创建 a 标签
        a.download = 'data_type.csv'; // 设置下载文件名
        if (typeof e.target.result === 'string') {
          a.href = e.target.result; // 设置下载链接
        }
        document.body.appendChild(a); // 将 a 标签添加到页面中
        a.click(); // 模拟点击下载
        document.body.removeChild(a); // 下载完成后移除 a 标签
      };
    }
  };
  xhr.send(JSON.stringify({ data_name: 'left_test' })); // 发送请求
};

async function handleUpdateValue() {
  startLoading();
  getDrawData();
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
