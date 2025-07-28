<script setup>
import { reactive, ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

const updateMsg = {
  iptv: {
    title: "更新直播源",
    desc: "此功能将从IPTV服务器获取最新的直播源数据，并更新系统中的频道列表。",
    executor: "/opt/iptv/scripts/python/iptv",
    url: "/update",
  },
  static_iptv: {
    title: "静态更新直播源",
    desc: "此功能将使用预设的静态直播源配置，生成新的频道列表文件。",
    executor: "/opt/iptv/scripts/python/static_iptv",
    url: "/update",
  },
  epg: {
    title: "更新EPG",
    desc: "此功能将从互联网获取最新的节目指南数据(EPG)，并更新系统中的节目信息。",
    executor: "/opt/iptv/scripts/python/epg",
    url: "/update",
  },
  tvb: {
    title: "更新TVB直播源",
    desc: "此功能将更新TVB频道的直播源数据，包括最新的频道信息和播放地址。",
    executor: "/opt/iptv/scripts/python/tvb",
    url: "/update",
  },
};
const selectValue = ref("iptv");
// 选择器选择项
const options = [
  {
    value: "iptv",
    label: "更新直播源",
  },
  {
    value: "static_iptv",
    label: "静态更新直播源",
  },
  {
    value: "epg",
    label: "更新EPG",
  },
  {
    value: "tvb",
    label: "更新TVB直播源",
  },
];
// 更新状态
const updateBtnText = ref("开始更新");
const updateBtnStatus = ref(false);
const progressOptions = reactive({
  percentage: 0, // 进度
  indeterminate: false, // 是否滚动
  duration: 3,
  status: "", // success '' error
});
// 日志数据
const logPrint = ref([]);

const progressStart = () => {
  updateBtnStatus.value = true; // 按钮旋转
  updateBtnText.value = "更新中...";
  progressOptions.percentage = 100;
  progressOptions.indeterminate = true;
};
const progressStop = () => {
  updateBtnStatus.value = false; // 按钮旋转
  updateBtnText.value = "开始更新";
  progressOptions.percentage = 100;
  progressOptions.indeterminate = false;
};

// 开始更新
const updateUrl = {
  iptv: "/update",
  static_iptv: "/update",
  epg: "/update",
  tvb: "/update",
};
const update = async () => {
  // 滚动进度条
  progressStart();

  // 加入开始更新日志 开始IPTV直播源更新 - 2025/7/3 02:15:54
  logPrint.value.push({
    time: `[${new Date().toLocaleTimeString()}]`,
    msg: `🏃开始${updateMsg[selectValue.value].title} ...`,
  });
  // 开始计时
  const startTime = new Date().getTime();
  // 发送请求
  const url = updateUrl[selectValue.value];
  try {
    // 记录耗时
    const endTime = new Date().getTime();
    const timeCost = ((endTime - startTime) / 1000).toFixed(1);
    // 发送请求
    // const { data: res1 } = await axios.get(url);
    const res = await request.get(url);
    if (res.code === 200) {
      const logList = res.data.logs || [];
      // 将日志添加
      logList.forEach((item) => {
        logPrint.value.push({
          time: `[--:--:--]`,
          msg: item,
        });
      });
      // 追加耗时日志
      logPrint.value.push({
        time: `[${new Date().toLocaleTimeString()}]`,
        msg: `✅更新成功！ - 耗时${timeCost}秒`,
      });
      // 侧弹窗提示
      ElNotification.success({
        message: `更新成功！`,
        showClose: false,
      });
      // 更改成功样式滚动条
      progressOptions.status = "success";
    } else {
      ElNotification.error({
        message: `更新失败！`,
        showClose: false,
      });
      // 追加耗时日志
      logPrint.value.push({
        time: `[${new Date().toLocaleTimeString()}]`,
        msg: `❌更新失败！ - 耗时${timeCost}秒`,
      });
    }
  } catch (err) {
    ElMessage.error("请求错误，详情查看控制台！");
    logPrint.value.push({
      time: `[${new Date().toLocaleTimeString()}]`,
      msg: `🌐❌🔗请求错误!`,
    });
    console.log("update:请求错误!\n", err);
  } finally {
    progressStop();
    progressOptions.status = "exception";
  }
};
// 选择器切换，清空打印日志
const handlerSelect = () => {
  logPrint.value = [];
};
</script>
<template>
  <div class="main">
    <el-card class="alert-card">
      <h4>关于{{ updateMsg[selectValue].title }}</h4>
      <p>
        {{ updateMsg[selectValue].desc }}
        <span class="executor">{{ updateMsg[selectValue].executor }}</span>
      </p>
    </el-card>
    <!-- 状态框 -->
    <el-card class="update-card">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold">更新状态</span>
        </div>
      </template>
      <div class="msg">
        <!-- 选择器 -->
        <el-select
          v-model="selectValue"
          placeholder="请选择"
          size="large"
          @change="handlerSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- button -->
        <el-button
          class="update-button"
          size="large"
          type="primary"
          @click="update"
          :disabled="updateBtnStatus"
        >
          <el-icon :size="16" :class="{ updating: updateBtnStatus }"
            ><Refresh
          /></el-icon>
          <span>{{ updateBtnText }}</span>
        </el-button>
        <!-- 进度条 hidden-xs-only -->
        <div class="progress hidden-xs-only">
          <el-progress
            :status="progressOptions.status"
            :percentage="progressOptions.percentage"
            :indeterminate="progressOptions.indeterminate"
            :show-text="false"
            :duration="progressOptions.duration"
          />
        </div>
      </div>
    </el-card>
    <!-- 更新日志 -->
    <el-card class="log-card" :body-style="{ padding: 0 }">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold">更新日志</span>
        </div>
      </template>
      <el-scrollbar max-height="300px">
        <ul class="card-body">
          <li class="print-title">
            <el-icon class="icon" :size="16"><Tickets /></el-icon>
            <span class="msg">更新过程将显示在这里</span>
          </li>
          <li v-for="item in logPrint" :key="item">
            <span class="time">{{ item.time }}</span>
            <p class="msg">{{ item.msg }}</p>
          </li>
        </ul>
      </el-scrollbar>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
.main {
  .alert-card {
    width: 100%;
    box-shadow: 4px 0 0 rgb(51.2, 126.4, 204) inset,
      2px 2px 4px rgba(0, 0, 0, 0.2);
    background-color: rgba(13, 110, 253, 0.1);
    h4 {
      font-weight: 700;
      margin-bottom: 4px;
    }
    .executor {
      color: #d63384;
    }
  }
  .update-card {
    margin-top: 20px;
    .card-header {
      font-size: 16px;
      color: #212529;
    }
    .msg {
      display: flex;
      align-items: center;
      .el-select {
        width: 240px;
      }
      .progress {
        width: 200px;
        margin-left: 20px;
      }
      .update-button {
        width: 120px;
        // 设置旋转动画
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        // 应用旋转动画
        .updating {
          animation: rotate 1s linear infinite;
        }
      }
    }
    @media screen and (max-width: 768px) {
      .msg {
        flex-direction: column;
        .el-select {
          margin: 0;
          width: 100%;
        }
        .el-button {
          width: 100%;
          margin-top: 10px;
        }
      }
    }
    .el-select {
      margin-right: 10px;
    }
  }
  .log-card {
    margin: 20px 0;

    .card-body {
      padding: 0;
      width: 100%;
      min-height: 140px;
      background: #eaeaea;
      > li {
        display: flex;
        min-height: 40px;
        box-sizing: border-box;
        border-bottom: 1px solid #dee2e6;
        background: #fff;
        align-items: center;
        padding: 0 10px;
        .time {
          flex: 0 0 53px;
          color: #6c757d;
          margin-right: 10px;
          font-size: 14px;
        }
      }
      // 最后一个li去除border不包括.print-title
      li:not(.print-title):last-child {
        border-bottom: none;
      }

      .print-title {
        background: #f8f9fa;
        .icon {
          color: #495057;
          margin-right: 4px;
        }
        .msg {
          font-weight: bold;
          color: #495057;
        }
      }
    }
  }
}
</style>