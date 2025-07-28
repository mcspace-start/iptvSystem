<script  setup>
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import MyTime from "@/components/MyTime.vue";
import MyUserDropdwn from "@/components/MyUserDropdwn.vue";
import { useWindowWidth } from "@/hook/useWindowWidth";

// 展开折叠
const menuItemMap = {
  dashboard: {
    name: "控制面板",
    icon: "House",
  },
  system: {
    name: "系统设置",
    icon: "Setting",
  },
  epg: {
    name: "EPG管理",
    icon: "Calendar",
  },
  iptv: {
    name: "IPTV管理",
    icon: "Files",
  },

  tvb: {
    name: "TVB管理",
    icon: "Monitor",
  },
  update: {
    name: "更新数据",
    icon: "Refresh",
  },
  updateLogs: {
    name: "更新日志",
    icon: "Tickets",
  },
  about: {
    name: "关于",
    icon: "Warning",
  },
};

const isXsSize = useWindowWidth("xs");
const isOpenCollapse = ref(false);
const openShadow = ref(false);

const menuActive = ref("dashboard");
const toggleItem = (index) => {
  menuActive.value = index;
  if (isXsSize.value) toggleCollapse();
};
// 点击标题跳转至仪表盘
const router = useRouter();
const clickMenuTitle = () => {
  if (menuActive.value !== "about") {
    menuActive.value = "about";
    router.push({ name: "about" });
  }
};
// 当屏幕小于xs时隐藏菜单
const toggleCollapse = (event) => {
  if (event) event.preventDefault();
  isOpenCollapse.value = !isOpenCollapse.value;
  // 切换遮罩层
  isOpenCollapse.value ? (openShadow.value = true) : (openShadow.value = false);
};
// 关闭菜单
const closeCollapse = (event) => {
  // 避免反复打开
  if (!isOpenCollapse.value) return;
  if (event) event.preventDefault();
  toggleCollapse();
};

// 尺寸小于xs时，自动关闭菜单
watchEffect(() => {
  isOpenCollapse.value = !isXsSize.value;
  if (!isXsSize.value) openShadow.value = false;
});

const asideStyle = computed(() => {
  const style = {
    transition: "transform 0.3s",
    transform: "",
  };
  if (!isOpenCollapse.value) {
    style.transform = "translateX(-200px)";
  }
  return style;
});
const rightStyle = computed(() => {
  const style = {
    transition: "transform 0.3s",
    transform: "",
    minWidth: "",
  };
  if (isXsSize.value) {
    style.minWidth = "100%";
  }
  if (!isOpenCollapse.value) {
    style.transform = "translateX(-200px)";
  }
  return style;
});
</script>
<template>
  <el-container id="home">
    <!-- 左侧 -->
    <el-aside :style="asideStyle">
      <el-menu :default-active="menuActive" @select="toggleItem" router>
        <!-- 固定标题 -->
        <div class="menu-title">
          <span @click="clickMenuTitle">IPTV管理</span>
        </div>
        <!-- 菜单列表 -->
        <el-menu-item
          v-for="(item, key) in menuItemMap"
          :key="key"
          :index="key"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-container class="right" :style="rightStyle">
      <!-- 头部 -->
      <el-header>
        <el-card>
          <div class="header-content">
            <!-- 标题及时间 -->
            <div
              class="collapse"
              v-if="isXsSize"
              @touchstart="toggleCollapse"
              @click="toggleCollapse"
            >
              <el-icon><Menu /></el-icon>
            </div>
            <!-- 头部标题 -->
            <div class="header-title">
              <el-icon :size="20">
                <component :is="menuItemMap[menuActive].icon" />
              </el-icon>
              <span>
                {{ menuItemMap[menuActive].name }}
              </span>
            </div>
            <!-- 时钟-用户 -->
            <div class="time-user">
              <div class="clock hidden-xs-only">
                <my-time></my-time>
              </div>
              <!-- 用户信息 -->
              <div class="user">
                <my-user-dropdwn></my-user-dropdwn>
              </div>
            </div>
          </div>
        </el-card>
      </el-header>
      <!-- 内容 -->
      <el-main>
        <!-- 路由视图区域 -->
        <el-scrollbar :view-style="{ overflowX: 'hidden' }">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
      <!-- 遮罩层用于菜单打开遮罩 -->
      <transition name="fade">
        <div
          v-show="openShadow"
          @touchstart="closeCollapse"
          @click="closeCollapse"
          class="shadow"
        ></div>
      </transition>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
#home {
  height: 100%;
  width: 100%;
  transition: transform 0.3s;
  // overflow: hidden;
  .el-aside {
    width: auto;
    .el-menu {
      height: 100%;
      --el-menu-bg-color: #0d6efd; /* 设置为你想要的背景颜色 */
      --el-menu-text-color: #fff;
      --el-menu-hover-bg-color: rgba(255, 255, 255, 0.2);
      --el-menu-active-color: #fff;

      .el-menu-item.is-active {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 4px 0px #fff inset;
      }
      .menu-title {
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 75px;
        border-bottom: 1px solid #409eff;

        > span {
          cursor: pointer;
          font-size: 20px;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }

  .right {
    position: relative;
    .el-header {
      padding: 20px;
      height: auto;

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        //
        .collapse {
          cursor: pointer;
          box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
          background: var(--el-color-primary);
          color: #fff;
          border-radius: 4px;
          height: 32px;
          width: 30px;
          flex: 0 0 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        // 标题
        .header-title {
          color: var(--el-color-primary-dark-2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          > span {
            margin-left: 4px;
            font-size: 18px;
          }
        }
        // 时间和用户
        .time-user {
          display: flex;
          align-items: center;
          .clock {
            margin-right: 16px;
          }
          .user {
            // flex: 0 0 100px;
          }
        }
      }
    }
    .el-main {
      padding: 0 20px;
    }
    // 遮罩层
    .shadow {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
    }
    // shadow动画
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}

// 当菜单不处于折叠状态时(.not(.el-menu--collapse))
// 将垂直菜单(.el-menu-vertical-demo)的宽度设置为200px
// 并且最小高度设置为400px
</style>