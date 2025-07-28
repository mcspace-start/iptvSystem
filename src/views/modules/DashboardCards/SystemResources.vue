<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";

import request from "@/api/request";
// 标题
const cardTitle = "系统资源";
// 获取数据状态
const dataStatus = ref(true);
// 数据
const formData = ref({
  cpu: {
    usage: "0",
    cores: 4,
  },
  memory: {
    total: "0GB",
    used: "0MB",
    percent: "20",
  },
  disk: {
    total: "0G",
    used: "0G",
    percent: 0,
  },
  system: {
    os: "unknown",
    node: "v0.0.0",
    uptime: "0天0小时0分钟",
  },
});

const formMsg = {
  cpu: {
    label: "CPU负载",
  },
  memory: {
    label: "内存使用",
  },
  disk: {
    label: "磁盘空间",
  },
  system: {
    os: "操作系统",
    node: "NodeJS版本",
    uptime: "运行时间",
  },
};
// 不同占比进度条颜色
const cpuColors = [
  { color: "#67C23A", percentage: 50 }, // 绿色 - 低负载
  { color: "#E6A23C", percentage: 90 }, // 橙色 - 中等负载
  { color: "#F56C6C", percentage: 100 }, // 红色 - 高负载
];
const memoryColors = [
  { color: "#67C23A", percentage: 60 }, // 绿色 - 低负载
  { color: "#E6A23C", percentage: 80 }, // 橙色 - 中等负载
  { color: "#F56C6C", percentage: 100 }, // 红色 - 高负载
];
const diskColors = [
  { color: "#67C23A", percentage: 70 }, // 绿色 - 低负载
  { color: "#E6A23C", percentage: 90 }, // 橙色 - 中等负载
  { color: "#F56C6C", percentage: 100 },
];
// 获取数据
const getDataUrl = "/systemResources";
const getData = async () => {
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      formData.value = res.data;
      dataStatus.value = true;
    } else {
      console.log(res.msg);
    }
  } catch (error) {
    dataStatus.value = false;
    ElMessage.error(`获取${cardTitle}失败，请稍后重试！`);
    console.log(error);
  }
};
// 首次获取数据
getData();
const loading = ref(false);
const retry = async () => {
  loading.value = true;
  await getData();
  loading.value = false;
};
// 暴露更新方法
defineExpose({
  update: getData,
  status: dataStatus,
});
</script>

<template>
  <div class="system-monitor">
    <el-card>
      <div class="header">
        <div class="icon-wrap">
          <el-icon :size="20"><cpu /></el-icon>
        </div>
        <!-- title -->
        <p class="title">{{ cardTitle }}</p>
      </div>
      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 内容 -->
        <div v-if="dataStatus" class="content">
          <!-- cput负载 -->
          <div class="cpu-progress-wrap">
            <el-progress
              type="dashboard"
              :percentage="Number(formData.cpu.usage)"
              :color="cpuColors"
              :width="150"
            />
            <div class="label">
              {{ formMsg.cpu.label }}
            </div>
          </div>
          <!-- 内存使用 -->
          <div class="progress-wrap">
            <div class="title">
              <span class="labe">{{ formMsg.memory.label }}</span>
              <span class="rate"
                >{{ formData.memory.used }} / {{ formData.memory.total }}</span
              >
            </div>
            <el-progress
              :show-text="false"
              :stroke-width="10"
              status="success"
              :color="memoryColors"
              :percentage="Number(formData.memory.percent)"
            />
          </div>
          <!-- 磁盘空间 -->
          <div class="progress-wrap">
            <div class="title">
              <span class="labe">{{ formMsg.disk.label }}</span>
              <span class="rate"
                >{{ formData.disk.used }} / {{ formData.disk.total }}</span
              >
            </div>

            <el-progress
              :show-text="false"
              :stroke-width="10"
              status="success"
              :color="diskColors"
              :percentage="Number(formData.disk.percent)"
            />
          </div>
          <!-- info -->
          <div class="info">
            <!-- 系统版本 -->
            <p class="info-item">
              <el-icon><Operation /></el-icon>
              <span> {{ formMsg.system.os }}: {{ formData.system.os }}</span>
            </p>
            <!-- node版本 -->
            <p class="info-item">
              <el-icon><Document /></el-icon>
              <span>
                {{ formMsg.system.node }}: {{ formData.system.node }}</span
              >
            </p>
            <!-- 运行时间 -->
            <p class="info-item">
              <el-icon><Clock /></el-icon>
              <span>
                {{ formMsg.system.uptime }}: {{ formData.system.uptime }}</span
              >
            </p>
          </div>
        </div>
        <!-- 失败提醒 -->
        <el-result
          v-else
          icon="error"
          title="网络错误！"
          :sub-title="`获取${cardTitle}失败，请重试！`"
          style="height: 100%"
          v-loading="loading"
        >
          <template #extra>
            <el-button type="primary" size="large" @click="retry"
              >重试</el-button
            >
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.system-monitor {
  .header {
    display: flex;
    align-items: center;
    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: var(--el-color-primary);
      color: #fff;
    }
    .title {
      margin-left: 4px;
      font-size: 16px;
      color: #333;
    }
    margin-bottom: 10px;
  }
  // 内容区域
  .content-wrap {
    height: 380px;
    .content {
      // 针对仪表盘进度条
      .cpu-progress-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .label {
          font-size: 20px;
        }
        margin-bottom: 20px;
      }
      .progress-wrap {
        margin-bottom: 10px;
        .title {
          font-size: 16px;
          color: #222;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          .rate {
            font-size: 14px;
            color: #2d2d2d;
          }
        }
      }
      // info
      .info {
        margin-top: 20px;
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .el-icon {
            color: var(--el-color-primary);
            margin-right: 4px;
          }
          span {
            font-size: 14px;
            color: #6c757d;
          }
        }
      }
    }
  }
}
</style>