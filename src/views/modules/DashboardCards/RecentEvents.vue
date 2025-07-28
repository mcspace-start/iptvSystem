<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
// 标题
const cardTitle = "最近事件";
// 获取数据状态
const dataStatus = ref(true);
const dataForm = ref([]);
const getDataUrl = "/recentLogs";
const getData = async () => {
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      dataStatus.value = true;
      // 数据不同时才赋值
      if (JSON.stringify(res.data) != JSON.stringify(dataForm.value)) {
        dataForm.value = res.data;
      }
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

const logMsgTypes = {
  iptv: "IPTV直播源",
  static_iptv: "静态IPTV直播源",
  epg: "EPG节目指南",
  tvb: "TVB直播源",
};
const logMsgStatus = {
  success: "成功",
  failed: "失败",
  pending: "进行中",
};

const formattedDate = (time) => {
  if (!time) return "YYYY-MM-DD HH:mm:ss";
  // 返回格式化时间 YYYY-MM-DD HH:mm:ss
  const t = new Date(time);
  const year = t.getFullYear();
  const month = String(t.getMonth() + 1).padStart(2, "0");
  const date = String(t.getDate()).padStart(2, "0");
  const hour = String(t.getHours()).padStart(2, "0");
  const minute = String(t.getMinutes()).padStart(2, "0");
  const second = String(t.getSeconds()).padStart(2, "0");
  const timeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  return timeStr;
};
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
  <div class="recent-events">
    <el-card>
      <div class="header">
        <div class="icon-wrap">
          <el-icon :size="20"><Bell /></el-icon>
        </div>
        <!-- title -->
        <p class="title">{{ cardTitle }}</p>
      </div>
      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 内容 -->
        <div v-if="dataStatus" class="content">
          <!-- 内容渲染 -->
          <ul class="msg-list" v-if="dataForm.length > 0">
            <li v-for="item in dataForm" :key="item.id">
              <!-- icon -->
              <!-- success pedding  failed-->
              <el-icon
                v-if="item.status == 'success'"
                style="color: var(--el-color-success)"
                :size="24"
                :class="item.status"
                ><CircleCheckFilled
              /></el-icon>
              <el-icon
                v-if="item.status == 'pending'"
                style="color: var(--el-color-warning)"
                :size="24"
                :class="item.status"
                ><WarningFilled
              /></el-icon>
              <el-icon
                v-if="item.status == 'failed'"
                style="color: var(--el-color-danger)"
                :size="24"
                :class="item.status"
                ><CircleCloseFilled
              /></el-icon>
              <div class="msg-wrap">
                <span class="msg-time">{{
                  formattedDate(item.created_at)
                }}</span>
                <span class="msg-content"
                  >{{ logMsgTypes[item.update_type] }}更新{{
                    logMsgStatus[item.status]
                  }}
                </span>
              </div>
            </li>
          </ul>
          <el-empty v-if="!dataForm.length"></el-empty>
          <!-- 展示 -->
          <div v-if="dataForm.length > 0" class="tag-wrap">
            <el-tag size="large">展示20条</el-tag>
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
.recent-events {
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
      height: 100%;
      display: flex;
      flex-direction: column;
      .msg-list {
        flex: 1;
        padding: 0;
        height: 200px;
        overflow-y: scroll;
        scrollbar-width: none;
        & > li {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dedede;
          height: 48px;
          padding-bottom: 8px;
          margin: 10px 0;
          .el-icon {
            margin-right: 8px;
          }
          .msg-wrap {
            display: flex;
            flex-direction: column;
            .msg-time {
              font-size: 12px;
              color: #6c757d;
              margin-bottom: 4px;
            }
            .msg-content {
              font-size: 14px;
              color: #222;
            }
          }
        }
      }
      .tag-wrap {
        flex: 0 0 40px;
        // background:#ccc;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>