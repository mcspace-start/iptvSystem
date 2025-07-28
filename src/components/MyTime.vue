<script setup>
import { ref, onUnmounted } from "vue";

const time = ref("2025/07/02 03:25:00");
let timer = null;

// 格式化日期函数
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const updateTime = () => {
  const now = new Date();
  time.value = formatDateTime(now);
};

timer = setInterval(updateTime, 500);

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="time-wrap">
    <el-icon :size="18"><Clock /></el-icon>
    <span class="time">{{ time }}</span>
  </div>
</template>

<style lang="less" scoped>
.time-wrap {
  background-color: #4361ee;
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(67, 97, 238, 0.3);
  border-radius: 20px;
  height: 40px;
  width: 190px;

  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .time {
    margin-left: 6px;
  }
}
</style>
