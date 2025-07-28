<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

// #region 获取数据
// 服务器地址
const serverConfigForm = ref({
  server_url: "",
});
let oldServerConfigForm = {};
const serverConfigFormRules = {
  server_url: [
    { required: true, message: "请输入服务器地址", trigger: "blur" },
    {
      type: "url",
      message: "请输入正确的服务器地址格式",
      trigger: "blur",
    },
  ],
};
const loading = ref(false);
// 获取服务器地址
const getDataUrl = "/getServerConfig";
const getData = async () => {
  loading.value = true;
  try {
    // const {data:res1} = await axios.get(getDataUrl)
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      serverConfigForm.value = res.data;
      oldServerConfigForm = { ...res.data };
    } else {
      ElMessage.error("获取服务器地址失败！");
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 第一次初始化
getData();
// #endregion

const isEdit = ref(false);
const serverConfigFormRef = ref(null);
const saveServerConfigLoading = ref(false);
const saveServerConfigUrl = "/saveServerConfig";

const openSaveConfig = () => {
  if (loading.value) return ElMessage.info("正在加载数据，请稍后");
  isEdit.value = true;
};
const cancelSaveConfig = () => {
  if (saveServerConfigLoading.value) return;
  serverConfigFormRef.value.clearValidate();
  isEdit.value = false;
  serverConfigForm.value = { ...oldServerConfigForm };
};
// 保存配置
const saveConfig = () => {
  if (saveServerConfigLoading.value) return;
  serverConfigFormRef.value.validate(async (v) => {
    // 未通过表单校验
    if (!v) return;
    // 未作出修改
    if (serverConfigForm.value.server_url == oldServerConfigForm.server_url)
      return ElMessage.warning("未作出修改");
    const params = {
      path: serverConfigForm.value.server_url,
    };
    saveServerConfigLoading.value = true;
    try {
      // const { data: res1 } = await axios.put(saveServerConfigUrl, params);
      const res = await request.get(saveServerConfigUrl, { params });
      if (res.code == 200) {
        ElNotification.success({
          title: "保存配置成功！",
          showClose: false,
        });
        // 再次获取数据
        getData();
        isEdit.value = false;
      } else {
        ElMessage.error(res.msg || "保存配置失败！");
        console.log(res.msg);
      }
    } catch (error) {
      ElMessage.error(error.msg || "请求错误！");
      console.log(error);
    } finally {
      saveServerConfigLoading.value = false;
    }
  });
};
</script>
<template>
  <el-alert
    title="设置IPTV服务器地址，用于系统连接和获取频道信息。"
    type="primary"
    show-icon
    :closable="false"
  />
  <div class="server-config">
    <p class="IP-title">服务器地址：</p>
    <el-form
      :model="serverConfigForm"
      :rules="serverConfigFormRules"
      ref="serverConfigFormRef"
    >
      <el-form-item prop="server_url">
        <el-input
          v-model="serverConfigForm.server_url"
          placeholder="如：http://127.0.0.1:3000"
          size="large"
          :disabled="!isEdit"
        />
      </el-form-item>
    </el-form>
    <p class="IP-desc">
      输入服务器的完整URL，包括协议（http或https）和端口（如果需要）
    </p>
    <div class="save-btn-wrap">
      <!-- 保存配置按钮 -->
      <el-button
        type="primary"
        size="large"
        @click="openSaveConfig"
        v-if="!isEdit"
      >
        <template #icon>
          <el-icon><Edit /></el-icon>
        </template>
        编辑配置
      </el-button>
      <!-- 保存配置按钮 -->
      <el-button
        type="danger"
        size="large"
        @click="cancelSaveConfig"
        v-if="isEdit"
        :disabled="saveServerConfigLoading"
      >
        <template #icon>
          <el-icon><Close /></el-icon>
        </template>
        取消
      </el-button>
      <!-- 保存配置按钮 -->
      <el-button
        type="success"
        size="large"
        @click="saveConfig"
        :loading="saveServerConfigLoading"
        v-if="isEdit"
      >
        <template #icon>
          <el-icon><Check /></el-icon>
        </template>
        保存配置
      </el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
// iptv服务器配置
.server-config {
  .IP-title {
    font-size: 16px;
    color: #495057;
    margin-bottom: 10px;
  }
  .el-input {
    font-size: 18px;
    max-width: 400px;
  }
  .IP-desc {
    font-size: 14px;
    color: #6c757d;
  }
  .save-btn-wrap {
    margin-top: 10px;
    .el-icon {
      margin-right: 4px;
    }
  }
  @media screen and (max-width: 768px) {
    .save-btn-wrap {
      display: flex;
      justify-content: center;
      .el-button {
        flex: 1;
      }
    }
  }
}
</style>