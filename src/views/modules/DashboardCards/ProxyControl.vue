<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
import { ElMessage } from "element-plus";

// 标题
const cardTitle = "代理控制";
// 获取数据状态
const dataStatus = ref(true);

// #region 获取数据
const getDataLoading = ref(false);
const dataForm = ref({
  status: "stopped", // 状态 "stopped" "running"
  serverAddress: "127.0.0.1", // 服务器地址
  serverPort: 1, // 服务器端口
  listenAddress: "0.0.0.0", // 监听地址
  listenPort: 1, // 监听端口
  uptime: "0 天 0小时 0分钟", // 运行时间，
});
const dataMsg = {
  status: "状态",
  serverAddress: "服务器地址",
  serverPort: "服务器端口",
  listenAddress: "监听地址",
  listenPort: "监听端口",
  uptime: "运行时间",
};
const getDataUrl = "/proxyControl";
const getData = async () => {
  getDataLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      dataStatus.value = true;
      dataForm.value = res.data;
    } else {
      console.log(res.msg);
    }
  } catch (error) {
    dataStatus.value = false;
    ElMessage.error(`获取${cardTitle}失败，请稍后重试！`);
    console.log(error);
  } finally {
    getDataLoading.value = false;
  }
};
getData();
// #endregion

// #region 操作事件
const allBtnDisabled = ref(false);
// loading
const loadings = ref({
  start: false,
  stop: false,
  restart: false,
});
// 事件
const urls = {
  start: "/startProxy",
  stop: "/stopProxy",
  restart: "/restartProxy",
};
// msg 文字
const message = {
  start: "启动",
  stop: "停止",
  restart: "重启",
};
// 按钮事件
const btnHandler = async (type) => {
  if (getDataLoading.value) return ElMessage.info(`正在获取状态，请稍后重试！`);
  const url = urls[type];
  const msg = message[type];

  //
  allBtnDisabled.value = true;
  loadings.value[type] = true;
  try {
    // const { data: res1 } = await axios.put(url);
    const res = await request.get(url);
    if (res.code == 200) {
      // 将数据赋值给表单
      ElNotification.success({
        title: msg + "服务器成功！",
        showClose: false,
      });
      // 重新获取数据
      getData();
    } else {
      console.log(res.msg);
      ElMessage.error(res.msg);
    }
  } catch (error) {
    dataStatus.value = false;
    ElMessage.error(msg + "服务器失败，请稍后重试！");
    console.log(error);
  } finally {
    allBtnDisabled.value = false;
    loadings.value[type] = false;
  }
};
// #endregion
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
  <div class="proxy-control">
    <el-card>
      <div class="header">
        <div class="icon-wrap">
          <el-icon :size="20"><Setting /></el-icon>
        </div>
        <!-- title -->
        <p class="title">{{ cardTitle }}</p>
      </div>
      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 内容 -->
        <div v-if="dataStatus" class="content">
          <el-result
            :icon="dataForm.status == 'running' ? 'success' : 'error'"
            :title="
              dataForm.status == 'running'
                ? '代理服务器已启动'
                : '代理服务器已停止'
            "
            v-loading="loading"
          >
          </el-result>
          <!-- info -->
          <div class="info">
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <div class="info-item">
                  <span class="title">
                    <el-icon :size="16"><Compass /></el-icon>
                    {{ dataMsg.serverAddress }}:
                  </span>
                  <div class="val">{{ dataForm.serverAddress }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :span="12">
                <div class="info-item">
                  <span class="title">
                    <el-icon :size="16"><Link /></el-icon>
                    {{ dataMsg.listenAddress }}:
                  </span>
                  <div class="val">{{ dataForm.listenAddress }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :span="12">
                <div class="info-item">
                  <span class="title">
                    <el-icon :size="16"><ScaleToOriginal /></el-icon>
                    {{ dataMsg.serverPort }}:
                  </span>
                  <div class="val">{{ dataForm.serverPort }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :span="12">
                <div class="info-item">
                  <span class="title">
                    <el-icon :size="16"><Guide /></el-icon>
                    {{ dataMsg.listenPort }}:
                  </span>
                  <div class="val">{{ dataForm.listenPort }}</div>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="info-item">
                  <span class="title">
                    <el-icon :size="16"><Clock /></el-icon>
                    {{ dataMsg.uptime }}:
                  </span>
                  <div class="val">{{ dataForm.uptime }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- buttons -->
          <div class="btn-wrap">
            <el-button
              type="success"
              size="large"
              :disabled="dataForm.status === 'running' || allBtnDisabled"
              :loading="loadings.start"
              @click="btnHandler('start')"
            >
              <template #icon>
                <el-icon :size="20"><VideoPlay /></el-icon>
              </template>
              启动</el-button
            >
            <el-button
              type="danger"
              size="large"
              :disabled="dataForm.status === 'stopped' || allBtnDisabled"
              :loading="loadings.stop"
              @click="btnHandler('stop')"
            >
              <template #icon>
                <el-icon :size="20"><VideoPause /></el-icon>
              </template>
              停止</el-button
            >
            <el-button
              type="warning"
              size="large"
              :disabled="allBtnDisabled"
              :loading="loadings.restart"
              @click="btnHandler('restart')"
            >
              <template #icon>
                <el-icon :size="20"><Refresh /></el-icon>
              </template>
              重启
            </el-button>
          </div>
        </div>
        <!-- 失败提醒 -->
        <el-result
          v-else
          class="error"
          icon="error"
          title="网络错误！"
          :sub-title="`获取${cardTitle}失败，请重试！`"
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
.proxy-control {
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
  /* 内容区域 */
  .content-wrap {
    min-height: 420px;

    .content {
      height: 100%;
      .info {
        background: #f8fafc;
        border: 1px solid #dadada;
        border-radius: 8px;
        padding: 20px;
        .el-col {
          margin-bottom: 5px;
          .info-item {
            display: flex;
            justify-content: space-between;
            .title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1;
              display: flex;
              align-items: center;
              font-size: 14px;
              color: #222;
              .el-icon {
                margin-right: 4px;
              }
            }
            .val {
              font-size: 14px;
              color: #6c757d;
            }
          }
        }
      }
      .btn-wrap {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
    .el-result.error {
      height: 420px;
    }
  }
}
</style>