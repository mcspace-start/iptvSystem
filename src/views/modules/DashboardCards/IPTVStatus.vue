<script setup>
import { computed, ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
// 标题
const cardTitle = "IPTV状态";
// 获取数据状态
const dataStatus = ref(true);

const iptvStatusForm = ref({
  status: "abnormal", // normal  abnormal failed
  configFile: "abnormal", // normal  abnormal failed
  channelList: 0,
  trafficStats: 0,
});
const iptvStatusTitle = {
  normal: "运行正常",
  abnormal: "运行异常",
  failed: "运行失败",
};
const iptvStatusMsg = {
  configFile: "配置文件",
  channelList: "频道列表",
  trafficStats: "流量统计",
};
const resultIcons = {
  normal: "success",
  abnormal: "warning",
  failed: "error",
};

const tagTypes = computed(() => {
  const types = {
    normal: "success",
    abnormal: "warning",
    failed: "danger",
  };
  return types[iptvStatusForm.value.status];
});
const TagText = computed(() => {
  const msgTypes = {
    normal: "正常",
    abnormal: "异常",
    failed: "未加载",
  };
  return msgTypes[iptvStatusForm.value.status];
});
// 获取数据
const getDataUrl = "/iptvStatus";
const getData = async () => {
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      dataStatus.value = true;
      iptvStatusForm.value = res.data;
    } else {
      console.log(res.msg);
    }
  } catch (error) {
    dataStatus.value = false;
    ElMessage.error(`获取${cardTitle}失败，请稍后重试！`);
    console.log(error);
  }
};
getData();
// 重新尝试获取数据
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
  <div class="iptv-status">
    <el-card>
      <div class="header">
        <div class="icon-wrap">
          <el-icon :size="20"><Monitor /></el-icon>
        </div>
        <!-- title -->
        <p class="title">{{ cardTitle }}</p>
      </div>
      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 内容 -->
        <div v-if="dataStatus" class="content">
          <!-- 运行状态 -->
          <el-result
            :icon="resultIcons[iptvStatusForm.status]"
            :title="iptvStatusTitle[iptvStatusForm.status]"
          >
          </el-result>
          <!-- info -->
          <ul class="info">
            <li>
              <p class="info-title">
                <el-icon :size="16"><Tickets /></el-icon>
                <span>{{ iptvStatusMsg.configFile }}</span>
              </p>
              <!-- tag normal  abnormal failed -->
              <el-tag size="large" :type="tagTypes" effect="dark">{{
                TagText
              }}</el-tag>
            </li>
            <li>
              <p class="info-title">
                <el-icon :size="16"><Expand /></el-icon>
                <span>{{ iptvStatusMsg.channelList }}</span>
              </p>
              <!-- tag -->
              <el-tag size="large" type="info" effect="dark"
                >{{ iptvStatusForm.channelList }} 个频道</el-tag
              >
            </li>
            <li>
              <p class="info-title">
                <el-icon :size="16"><PieChart /></el-icon>
                <span>{{ iptvStatusMsg.trafficStats }}</span>
              </p>
              <!-- tag -->
              <el-tag size="large" type="primary" effect="dark"
                >{{ iptvStatusForm.trafficStats }} 个链接</el-tag
              >
            </li>
          </ul>
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
.iptv-status {
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
      .el-result {
        height: 220px;
      }
      .info {
        padding: 0;
        .info-title {
          display: flex;
          align-items: center;
          .el-icon {
            margin-right: 8px;
          }
        }
        & > li {
          margin-bottom: 10px;
          height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #dedede;
        }
      }
    }
  }
}
</style>