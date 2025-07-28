<script setup>
import { ref } from "vue";
// 导入tbs页
import authData from "./SystemTbs/authData.vue";
import iptvConfig from "./SystemTbs/iptvConfig.vue";
import rtspProxy from "./SystemTbs/rtspProxy.vue";
import scheduledTask from "./SystemTbs/scheduledTask.vue";
import tvbConfig from "./SystemTbs/tvbConfig.vue";
// tbs 切换栏 默认选中
const activeName = ref("authData");
</script>
<template>
  <main class="system">
    <el-tabs v-model="activeName" class="demo-tabs" type="border-card">
      <!-- 认证数据 -->
      <el-tab-pane name="authData">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Key /></el-icon>
            <span class="tabs-title">认证数据</span>
          </span>
        </template>
        <!-- 内容区域 -->
        <auth-data></auth-data>
      </el-tab-pane>
      <!-- TVB配置 -->
      <el-tab-pane name="tvbConfig">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Monitor /></el-icon>
            <span class="tabs-title">TVB配置</span>
          </span>
        </template>
        <!-- 内容区域 -->
        <tvb-config></tvb-config>
      </el-tab-pane>
      <!-- IPTV配置 -->
      <el-tab-pane name="iptvConfig">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Files /></el-icon>
            <span class="tabs-title">IPTV配置</span>
          </span>
        </template>
        <!-- 内容区域 -->
        <iptv-config></iptv-config>
      </el-tab-pane>
      <!-- RTSP代理 -->
      <el-tab-pane name="rtspProxy">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Switch /></el-icon>
            <span class="tabs-title">RTSP代理</span>
          </span>
        </template>
        <!-- 内容区域 -->
        <rtsp-proxy></rtsp-proxy>
      </el-tab-pane>
      <!-- 定时任务 -->
      <el-tab-pane name="scheduledTask">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><AlarmClock /></el-icon>
            <span class="tabs-title">定时任务</span>
          </span>
        </template>
        <!-- 内容区域 -->
        <scheduled-task></scheduled-task>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>
<style lang="less" scoped>
main.system {
  // 切换页标题
  .tabs-label {
    display: flex;
    align-items: center;
    .tabs-icon {
      margin-right: 4px;
    }
    .tabs-title {
      font-size: 16px;
    }
  }
  // 去除tabs内容默认padding
  ::v-deep(.el-tabs__content) {
    padding: 0;
  }
}
</style>