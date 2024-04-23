<template>
  <!-- 网格布局 -->
  <n-grid :item-responsive="true" :x-gap="16" :y-gap="16">
    <!-- 技术栈卡片 -->
    <n-grid-item span="0:24 640:24 1024:16">
      <n-space :vertical="true" :size="16">
        <n-card title="项目主要技术栈" :bordered="false" size="small" class="shadow-sm rounded-16px">
          <!-- 技术栈卡片网格布局 -->
          <n-grid :item-responsive="true" responsive="screen" cols="m:2 l:3" :x-gap="8" :y-gap="8">
            <!-- 循环渲染技术栈卡片 -->
            <n-grid-item v-for="item in technology" :key="item.id">
              <technology-card v-bind="item" />
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-space>
    </n-grid-item>
    <!-- 快捷操作卡片 -->
    <n-grid-item span="0:24 640:24 1024:8">
      <n-space :vertical="true" :size="16">
        <n-card title="快捷操作" :bordered="false" size="small" class="shadow-sm rounded-16px">
          <!-- 快捷操作卡片网格布局 -->
          <n-grid :item-responsive="true" responsive="screen" cols="m:2 l:3" :x-gap="8" :y-gap="8">
            <!-- 循环渲染快捷操作卡片 -->
            <n-grid-item v-for="item in shortcuts" :key="item.id">
              <shortcuts-card v-bind="item" />
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-space>
    </n-grid-item>
    <!-- 上传文件卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="上传文件" :bordered="false" class="shadow-sm rounded-16px" style="height: 400px">
        <!-- 上传文件操作 -->
        <div style="display: block; margin: auto; width: fit-content">
          <n-upload accept=".csv" :custom-request="customRequest" :max="1" ref="uploadRef">
            <n-button>上传 .csv 文件</n-button>
          </n-upload>
        </div>
        <!-- 数据集名称输入框 -->
        <div>
          <n-input v-model:value="model.dataname" placeholder="请输入数据集名称" />
        </div>
        <!-- 确定按钮 -->
        <div style="display: block; margin: auto; width: fit-content; margin-top: 70px">
          <n-button type="info" @click="handleClick">确定</n-button>
        </div>
      </n-card>
    </n-grid-item>
    <!-- 下载数据集卡片 -->
    <n-grid-item span="0:24 640:24 1024:12">
      <n-card title="请选择要下载数据集" :bordered="false" class="shadow-sm rounded-16px" style="height: 400px">
        <!-- 下载数据集操作 -->
        <n-select
          v-model:value="valueSelect"
          :options="options_edit"
          :consistent-menu-width="false"
          @update:value="handleUpdateValue"
        />
        <!-- 下载按钮 -->
        <div style="display: block; margin: auto; width: fit-content; margin-top: 100px">
          <n-button type="info" @click="downlandData()"> 下载数据 </n-button>
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { UploadInst } from 'naive-ui';
import { Uplandsome, downland, fetchDataName } from '@/service';
import { useLoading } from '@/hooks';
import { localStg } from '~/src/utils';
import { onMounted } from 'vue';
import { ShortcutsCard, TechnologyCard } from './components';
defineOptions({ name: 'DashboardWorkbenchMain' });
const { loading, startLoading, endLoading } = useLoading(false);
const valueSelect = ref('');
const options_edit = ref([]);
interface Technology {
  id: number;
  name: string;
  description: string;
  author: string;
  site: string;
  icon: string;
  iconColor?: string;
}

const model = reactive({
  dataname: ''
});
let formData = new FormData();
const formRef = ref<HTMLElement & FormInst>();
const uploadRef = ref<UploadInst | null>(null);
const show = ref(false);
const showModal = ref(false);
// 自定义上传文件请求方法
const customRequest = async ({ file }) => {
  formData = new FormData(); // 每次上传前重置 FormData
  formData.append('data_file', file.file); // 将文件数据添加到 FormData 中
};

// 点击确定按钮事件处理函数
async function handleClick() {
  // 表单验证
  await formRef.value?.validate();
  // 提交上传
  await uploadRef.value?.submit();
  // 将数据集名称添加到 FormData 中
  formData.append('data_name', model.dataname);
  // 清空数据集名称输入框
  model.dataname = '';
  // 如果文件已经上传
  if (formData.get('data_file') !== null) {
    // 显示上传进度
    show.value = true;
    // 调用上传函数，并传入 FormData
    await Uplandsome(formData); // 假设 Uplandsome 是上传函数
    // 清空上传组件中的文件
    uploadRef.value?.clear();
    // 提示上传成功
    window.$message?.info(`上传成功`);
    // 隐藏上传进度
    show.value = false;
  } else {
    // 提示先上传文件
    window.$message?.error('请先上传文件');
  }
}

// 下载数据集函数
const downlandData = () => {
  const xhr = new XMLHttpRequest();
  const name = valueSelect.value;
  if (name === '') {
    // 如果未选择要下载的数据集，则提示
    window.$message?.error('请在右侧指定要下载的数据集！');
  } else {
    // 构建下载请求
    xhr.open('POST', `http://localhost:5000/downland?name=${name}`, true);
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
          a.download = 'data.csv'; // 设置下载文件名
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
  }
};

// 获取数据集名称列表
async function getDataName() {
  startLoading(); // 开始加载
  const { data } = await fetchDataName(); // 获取数据集名称列表
  options_edit.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  });
}

async function handleUpdateValue() {
  startLoading();

  endLoading();
}

const technology: Technology[] = [
  {
    id: 0,
    name: 'Vue',
    description: '一套用于构建用户界面的渐进式框架',
    author: '尤雨溪 - Evan You',
    site: 'https://v3.cn.vuejs.org/',
    icon: 'logos:vue'
  },
  {
    id: 1,
    name: 'TypeScript',
    description: 'JavaScript类型的超集，它可以编译成纯JavaScript',
    author: '微软 - Microsoft',
    site: 'https://www.typescriptlang.org/',
    icon: 'logos:typescript-icon'
  },
  {
    id: 2,
    name: 'Vite',
    description: '下一代前端开发与构建工具',
    author: '尤雨溪 - Evan You',
    site: 'https://vitejs.cn/',
    icon: 'logos:vitejs'
  },
  {
    id: 3,
    name: 'NaiveUI',
    description: '一个 Vue 3 组件库',
    author: '图森未来 - TuSimple',
    site: 'https://www.naiveui.com/zh-CN/os-theme',
    icon: 'logos:naiveui'
  },
  {
    id: 4,
    name: 'UnoCSS',
    description: '下一代实用优先的CSS框架',
    author: 'Anthony Fu',
    site: 'https://uno.antfu.me/?s=',
    icon: 'logos:unocss'
  },
  {
    id: 5,
    name: 'Echarts',
    description: '一个基于 JavaScript 的开源可视化图表库',
    author: '百度',
    site: 'https://echarts.apache.org/zh/index.html',
    icon: 'system-uicons:globe'
  }
];

interface Shortcuts {
  id: number;
  label: string;
  icon: string;
  iconColor: string;
}

const shortcuts: Shortcuts[] = [
  { id: 0, label: '数据分布', icon: 'mdi:chart-areaspline', iconColor: '#f56c6c' },
  { id: 1, label: '关联关系', icon: 'mdi:family-tree', iconColor: '#8aca6b' },
  { id: 2, label: '消费特点分析', icon: 'mdi:desktop-mac-dashboard', iconColor: '#409eff' },
  { id: 3, label: '消费画像', icon: 'akar-icons:people-group', iconColor: '#19a2f1' },
  { id: 4, label: '数据管理', icon: 'mdi:table-large', iconColor: '#fab251' },
  { id: 5, label: '信息管理', icon: 'ic:outline-settings', iconColor: '#7238d1' }
];
function init() {
  getDataName();
}

// 初始化
onMounted(() => {
  init();
});
</script>
<style scoped></style>
