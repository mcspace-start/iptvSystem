<script setup>
import { ref } from "vue";
// 导入tabs组件
import ServerConfig from "./EpgTbs/ServerConfig.vue";
import DefaultAuth from "./EpgTbs/DefaultAuth.vue";
import RegionAuth from "./EpgTbs/RegionAuth.vue";
import ChannelMapping from "./EpgTbs/Mappings.vue";

// tabs切换
const activeName = ref("serverConfig");
</script>
<template>
  <main class="epg">
    <el-tabs v-model="activeName" type="border-card">
      <!-- IPTV服务器配置 -->
      <el-tab-pane name="serverConfig">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Coin /></el-icon>
            <span class="tabs-title">IPTV服务器配置</span>
          </span>
        </template>
        <server-config></server-config>
      </el-tab-pane>
      <!-- 默认认证 -->
      <el-tab-pane name="defaultAuth">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Key /></el-icon>
            <span class="tabs-title">默认认证</span>
          </span>
        </template>
        <default-auth></default-auth>
      </el-tab-pane>
      <!-- 区域认证 -->
      <el-tab-pane name="regionAuth">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Location /></el-icon>
            <span class="tabs-title">区域认证</span>
          </span>
        </template>
        <region-auth></region-auth>
      </el-tab-pane>
      <!-- 频道映射 -->
      <el-tab-pane name="channelMapping">
        <template #label>
          <span class="tabs-label">
            <el-icon :size="16" class="tabs-icon"><Switch /></el-icon>
            <span class="tabs-title">频道映射</span>
          </span>
        </template>
        <channel-mapping></channel-mapping>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>
<style lang="less" scope>
main.epg {
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
  .el-alert {
    margin-bottom: 10px;
  }
}
</style>