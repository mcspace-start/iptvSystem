<script setup>
import { useWindowWidth } from "@/hook/useWindowWidth";
import elLogo from "@/assets/element-plus-logo.svg";
const isXs = useWindowWidth("xs");
const giteeUrl = "https://gitee.com/mcspace/iptv-system.git";
const githubUrl = "https://github.com/mcspace-start/iptvSystem";
const desc = `这是一个 IPTV 管理系统的前端页面，该项目基于 Vite + Vue3 构建，采用 Composition API 和 <script setup> 语法。在 UI 方面，全部使用 Element Plus + Less，数据通过 Promise 模拟，随机生成成功或失败的结果。项目内部已配置好 Axios。此外，项目对移动端进行了适配，确保在移动设备上页面显示正常，不会出现混乱❤️。`;
</script>

<template>
  <el-card class="main">
    <el-row :gutter="20">
      <!-- 描述 -->
      <el-col :xs="24" :span="12" style="margin-bottom: 20px">
        <el-card class="desc">
          <!-- 使用滚动条 -->
          <el-scrollbar height="140px"
            ><el-text size="large">{{ desc }}</el-text></el-scrollbar
          >
        </el-card>
      </el-col>
      <!-- 卡片 -->
      <el-col :xs="24" :span="12" style="margin-bottom: 20px">
        <!-- 卡片 -->
        <el-row :gutter="10">
          <el-col :span="12"
            ><el-card class="info">
              <template #header>
                <div class="card-header">
                  <el-text size="large">构建</el-text>
                </div>
              </template>
              <p>
                <el-text size="large">Vite</el-text>
              </p>
              <p><el-text size="large">Vue 3</el-text></p>
              <p>
                <el-text size="large">Vue-Router</el-text>
              </p>
            </el-card></el-col
          >
          <el-col :span="12"
            ><el-card class="info">
              <template #header>
                <div class="card-header">
                  <el-text size="large">UI</el-text>
                </div>
              </template>
              <img :src="elLogo" alt="" srcset="" /> </el-card
          ></el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 链接 -->

    <div class="links">
      <p class="link">
        <span class="label">github: </span>
        <el-link type="primary" :href="githubUrl" target="_blank"
          ><span v-if="!isXs">{{ githubUrl }}</span
          ><span v-else>仓库链接...</span>
          <el-icon> <View /> </el-icon>
        </el-link>
      </p>
      <p class="link">
        <span class="label">gitee: </span>
        <el-link type="primary" :href="giteeUrl" target="_blank"
          ><span v-if="!isXs">{{ giteeUrl }}</span
          ><span v-else>仓库链接...</span>
          <el-icon> <View /> </el-icon>
        </el-link>
      </p>
    </div>
  </el-card>
</template>
<style lang="less" scoped>
.main {
  .info {
    height: 170px;
    .img-wrap {
      width: 100%;
      height: 100%;
    }
  }
  .desc {
    height: 170px;
  }
  .links {
    .link {
      border-radius: 5px;
      background-color: #fff;
      animation-fill-mode: both;
      padding: 4px 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      border: 1px solid #ccc;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      display: flex;
      width: fit-content;
      margin-bottom: 10px;
    }
    .label {
      margin-right: 4px;
    }
    .el-icon {
      margin-left: 4px;
    }
  }
}
</style>