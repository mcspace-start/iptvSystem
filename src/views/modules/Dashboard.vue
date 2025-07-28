<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import SystemResources from "./DashboardCards/SystemResources.vue";
import IPTVStatus from "./DashboardCards/IPTVStatus.vue";
import RecentEvents from "./DashboardCards/RecentEvents.vue";
import ProxyControl from "./DashboardCards/ProxyControl.vue";
import ProxySettings from "./DashboardCards/ProxySettings.vue";

const systemResourcesRef = ref(null);
const iptvStatusRef = ref(null);
const recentEventsRef = ref(null);
const proxyControlRef = ref(null);
// const proxySettingsRef = ref(null);

let timer = null;
let loopTime = 3000;
// 在组件挂载后执行
onMounted(() => {
  // 循环获取数据
  timer = setInterval(() => {
    if (systemResourcesRef.value.status) systemResourcesRef.value.update();
    if (iptvStatusRef.value.status) iptvStatusRef.value.update();
    if (recentEventsRef.value.status) recentEventsRef.value.update();
    if (proxyControlRef.value.status) proxyControlRef.value.update();
    // if (proxySettingsRef.value.status) proxySettingsRef.value.update();
  }, loopTime);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// 定义组件引用对象
</script>
<template>
  <el-card class="welcome-panel">
    欢迎使用IPTV管理系统控制面板，您可以在这里查看系统状态和管理IPTV数据。
  </el-card>
  <!-- 仪表盘区域 -->
  <el-row :gutter="20">
    <!-- SystemMonitor -->
    <el-col :xs="24" :span="24" :md="8">
      <SystemResources ref="systemResourcesRef" />
    </el-col>
    <!-- IPTVStatus -->
    <el-col :xs="24" :span="12" :md="8">
      <IPTVStatus ref="iptvStatusRef" />
    </el-col>
    <!-- RecentEvents -->
    <el-col :xs="24" :span="12" :md="8">
      <RecentEvents ref="recentEventsRef" />
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <!-- ProxyControl -->
    <el-col :span="24" :md="12">
      <ProxyControl ref="proxyControlRef" />
    </el-col>
    <!-- ProxySettings -->
    <el-col :span="24" :md="12">
      <ProxySettings ref="proxySettingsRef" />
    </el-col>
  </el-row>
</template>
<style lang="less" scoped>
.welcome-panel {
  box-shadow: 4px 0 rgb(51.2, 126.4, 204) inset;
  margin-bottom: 20px;
}
.el-row {
  .el-col {
    margin-bottom: 20px;
    .el-card {
      height: 400px;
    }
  }
}
</style>