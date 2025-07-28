<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

const alertMsg =
  "在此设置香港TVB直播的API令牌，用于访问TVB频道内容。请确保令牌有效且未过期。";
const apiToken = ref("");
const oldApiToken = ref("");
const isEdit = ref(false);
const btnLoading = ref(false);

const clearValue = () => {
  if (isEdit.value) apiToken.value = "";
};
const cancel = () => {
  if (btnLoading.value) return;
  isEdit.value = false;
  apiToken.value = oldApiToken.value;
};
// 获取数据
const loading = ref(false);
const getDataUrl = "/tvbConfig";
const getData = async () => {
  loading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值
      apiToken.value = res.data.apiToken;
      oldApiToken.value = res.data.apiToken;
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败!");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 初次获取数据
getData();

// 按钮事件
const openEdit = () => {
  if (loading.value) return ElMessage.info("数据加载中，请稍后操作！");
  isEdit.value = true;
};
// 保存
const saveUrl = "/alterTvbConfig";
const saveConfig = async () => {
  // 不允许空值
  if (apiToken.value.trim() == "") {
    apiToken.value = "";
    return ElMessage.info("请输入API令牌!");
  }
  // 判断是否修改
  if (apiToken.value == oldApiToken.value) return ElMessage.info("未修改内容!");
  // 保存
  btnLoading.value = true;
  const params = {
    apiToken: apiToken.value,
  };
  try {
    // const { data: res1 } = await axios.post(saveUrl, params);
    const res = await request.get(saveUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: "保存成功！",
        showClose: false,
      });
      isEdit.value = false;
      // 重新再次获取数据
      getData();
    } else {
      ElMessage.error(res.msg || "保存失败");
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败!");
    console.log(error);
  } finally {
    btnLoading.value = false;
  }
};
</script>

<template>
  <div class="tvb-config">
    <!-- 标题头部 -->
    <div class="header">
      <div class="title hidden-xs-only">TVB配置</div>
      <div class="btn-wrap">
        <el-button v-if="!isEdit" type="primary" size="large" @click="openEdit">
          <template #icon>
            <el-icon>
              <Edit />
            </el-icon>
          </template>
          编辑配置
        </el-button>
        <el-button
          v-if="isEdit"
          type="danger"
          size="large"
          @click="cancel"
          :disabled="btnLoading"
        >
          <template #icon>
            <el-icon>
              <Close />
            </el-icon>
          </template>
          取消
        </el-button>
        <el-button
          v-if="isEdit"
          type="success"
          size="large"
          @click="saveConfig"
          :loading="btnLoading"
        >
          <template #icon>
            <el-icon>
              <Select />
            </el-icon>
          </template>
          保存配置
        </el-button>
      </div>
    </div>
    <!-- 内容 -->
    <el-card header-class="tvb-config-card-header" body-class="card-body">
      <template #header>
        <p class="card-title">
          <el-icon><Monitor /></el-icon>
          <span>TVB API令牌配置</span>
        </p>
      </template>
      <!-- 内容区域 -->
      <el-alert :title="alertMsg" type="primary" show-icon :closable="false" />
      <!-- title -->
      <p class="title">API令牌</p>
      <!-- input -->
      <el-input
        v-model="apiToken"
        size="large"
        placeholder="请输入API令牌"
        :disabled="!isEdit"
      >
        <template #prepend>
          <el-icon><Key /></el-icon>
        </template>
        <template #append>
          <el-button @click="clearValue">
            <el-icon><CircleClose /></el-icon>
          </el-button>
        </template>
      </el-input>
      <!-- 描述 -->
      <p class="desc">
        <el-icon><Warning /></el-icon>
        <span> 此令牌用于授权访问TVB频道，请妥善保管，定期更新</span>
      </p>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
.tvb-config {
  padding: 15px;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > div {
      flex: 1;
    }
    .title {
      font-size: 20px;
    }
    .btn-wrap {
      display: flex;
      justify-content: flex-end;
    }
    @media screen and (max-width: 768px) {
      .btn-wrap {
        justify-content: center;
        .el-button {
          flex: 1;
        }
      }
    }
  }
  .el-card {
    .card-title {
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 4px;
      }
    }
    .title {
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .el-input {
      font-size: 16px;
    }
    .desc {
      margin-top: 10px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .el-icon {
        margin-right: 4px;
        color: var(--el-color-danger);
      }
      > span {
        color: #6c757d;
      }
    }
  }
}
</style>