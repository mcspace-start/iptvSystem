<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

//
const dropdownIsOpen = ref(false);
// 展开关闭菜单事件
const handleVisibleChange = (visible) => {
  dropdownIsOpen.value = visible;
};

const router = useRouter();

const handleCommand = (command) => {
  switch (command) {
    case "profile":
      //   router.push("/login");
      break;
    case "settings":
      //   router.push("/login");
      break;
    case "logout":
      localStorage.removeItem("token");
      router.push("/login");
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="user-wrap">
    <el-dropdown
      trigger="click"
      @visible-change="handleVisibleChange"
      @command="handleCommand"
      popper-class="custom-dropdown"
    >
      <div class="el-dropdown-link">
        <el-icon :size="18"><Avatar /></el-icon>
        <span class="username hidden-xs-only">用户</span>
        <el-icon
          :size="18"
          class="el-icon--right"
          :class="{ open: dropdownIsOpen }"
          ><arrow-down
        /></el-icon>
      </div>
      <!-- 下拉列表 -->
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile" v-if="false">
            <el-icon><User /></el-icon>个人资料</el-dropdown-item
          >
          <el-dropdown-item command="settings" v-if="false">
            <el-icon><Setting /></el-icon>系统设置
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <el-icon color="#dc3545"><Delete /></el-icon
            ><span :style="{ color: '#dc3545' }">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="less" scoped>
.el-dropdown {
  width: 100px;
  height: 36px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .el-dropdown-link {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .username {
      margin: 0 4px;
    }

    // 箭头
    .el-icon--right {
      transition: transform 0.3s;
      &.open {
        transform: rotate(180deg);
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .el-dropdown {
    width: 55px;
    border-radius: 12px;
    background: #f4f4f4;
  }
}
</style>
