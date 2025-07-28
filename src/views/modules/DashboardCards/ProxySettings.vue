<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
// 标题
const cardTitle = "代理设置";
// 获取数据状态
const dataStatus = ref(true);

const dataForm = ref({
  serverAddress: "0.0.0.0",
  serverPort: 1,
  listenAddress: "0.0.0.0",
  listenPort: 1,
  bufferSize: 1024,
  timeout: 1,
});
const oldDataForm = ref({});
const dataFormRules = {
  serverAddress: [
    { required: true, message: "必填" },
    {
      pattern:
        /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      message: "无效IP",
    },
  ],
  serverPort: [
    { required: true, message: "必填" },
    { type: "number", min: 1, max: 65535, message: "端口 1-65535" },
  ],
  listenAddress: [
    { required: true, message: "必填" },
    {
      pattern:
        /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      message: "无效IP",
    },
  ],
  listenPort: [
    { required: true, message: "必填" },
    { type: "number", min: 1, max: 65535, message: "端口 1-65535" },
  ],
  bufferSize: [
    { required: true, message: "必填" },
    { type: "number", min: 1024, message: "≥1024 字节" },
  ],
  timeout: [
    { required: true, message: "必填" },
    { type: "number", min: 1, message: "≥1 秒" },
  ],
};
const dataMsg = {
  serverAddress: "服务器地址",
  serverPort: "服务器端口",
  listenAddress: "监听地址",
  listenPort: "监听端口",
  bufferSize: "缓冲区大小",
  timeout: "超时时间",
};
// 获取数据
const getDataUrl = "/rtspProxyConfig";
const getDataLoading = ref(false);
const getData = async () => {
  getDataLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      dataStatus.value = true;
      dataForm.value = res.data;
      oldDataForm.value = { ...res.data };
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
// 获取下拉列表
const selectValue = ref("");
const serverAddressOptions = ref([]);
const getAddressOptionsUrl = "/serverAddressList";
const addressOptionsLoading = ref(false);
const getAddressOptions = async () => {
  if (serverAddressOptions.value.length !== 0) return;
  addressOptionsLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getAddressOptionsUrl);
    const res = await request.get(getAddressOptionsUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      serverAddressOptions.value = res.data;
    } else {
      ElMessage.error("获取地址失败，请稍后重试！");
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(`获取地址失败，请稍后重试！`);
    console.log(error);
  } finally {
    addressOptionsLoading.value = false;
  }
};

// 添加表单ref
const isEdit = ref(false);
const dataFormRef = ref(null);
const editFormUrl = "/saveProxySettigs";
const saveLoading = ref(false);

const openEdit = () => {
  if (getDataLoading.value) return ElMessage.info("正在获取数据，请稍后重试");
  isEdit.value = true;
};
const saveForm = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      // 判断是否修改
      if (JSON.stringify(dataForm.value) == JSON.stringify(oldDataForm.value)) {
        return ElMessage.info("未修改任何内容");
      }
      const params = { ...dataForm.value };
      // 发起请求
      saveLoading.value = true;
      try {
        // const { data: res1 } = await axios.post(editFormUrl, params);
        const res = await request.get(editFormUrl, { params });
        if (res.code == 200) {
          isEdit.value = false;
          ElNotification.success({
            title: "保存配置成功!",
            showClose: false,
          });
          // 再次获取数据
          getData();
        } else {
          console.log(res.msg);
          ElMessage.error(res.msg || "操作失败！");
        }
      } catch (error) {
        ElMessage.error(`请求错误！`);
        console.log(error);
      } finally {
        saveLoading.value = false;
      }
    }
  });
};
// 取消修改
const cancelForm = () => {
  isEdit.value = false;
  // 复原
  dataForm.value = { ...oldDataForm.value };
};

// 重新尝试获取数据
const loading = ref(false);
const retry = async () => {
  loading.value = true;
  await getData();
  loading.value = false;
};
defineExpose({
  update: getData,
  status: dataStatus,
});
</script>

<template>
  <div class="proxy-settings">
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
          <el-form
            :model="dataForm"
            :rules="dataFormRules"
            ref="dataFormRef"
            label-position="top"
          >
            <el-row>
              <el-col :span="24">
                <div class="item">
                  <p class="title">{{ dataMsg.serverAddress }}</p>
                  <!-- 自定义 -->
                  <el-form-item prop="serverAddress">
                    <el-input
                      v-model="dataForm.serverAddress"
                      :disabled="!isEdit"
                      @input="selectValue = ''"
                    >
                      <template #append>
                        <el-select
                          style="min-width: 150px"
                          size="large"
                          placeholder="自定义"
                          @visible-change="getAddressOptions"
                          @change="dataForm.serverAddress = selectValue"
                          v-model="selectValue"
                          :loading="addressOptionsLoading"
                          :disabled="!isEdit"
                        >
                          <el-option
                            v-for="(item, index) in serverAddressOptions"
                            :key="index"
                            :value="item.serverAddress"
                            :label="item.serverName"
                          />
                          <el-option value="">自定义</el-option>
                        </el-select>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="item">
                  <p class="title">{{ dataMsg.listenAddress }}</p>
                  <el-form-item prop="listenAddress">
                    <el-input
                      size="large"
                      v-model="dataForm.listenAddress"
                      :disabled="!isEdit"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- 端口 -->
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <div class="item">
                  <p class="title">{{ dataMsg.serverPort }}</p>
                  <el-form-item prop="serverPort">
                    <el-input
                      size="large"
                      type="number"
                      step="1"
                      min="1"
                      max="65535"
                      v-model.number="dataForm.serverPort"
                      :disabled="!isEdit"
                    ></el-input
                  ></el-form-item></div
              ></el-col>
              <el-col :xs="24" :span="12">
                <div class="item">
                  <p class="title">{{ dataMsg.listenPort }}</p>
                  <el-form-item prop="listenPort">
                    <el-input
                      size="large"
                      type="number"
                      step="1"
                      min="1"
                      max="65535"
                      v-model.number="dataForm.listenPort"
                      :disabled="!isEdit"
                    ></el-input
                  ></el-form-item></div
              ></el-col>
            </el-row>
            <!-- 缓存 超时时间 -->
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <div class="item">
                  <p class="title">{{ dataMsg.bufferSize }}</p>
                  <el-form-item prop="bufferSize">
                    <el-input
                      size="large"
                      type="number"
                      min="1024"
                      step="1024"
                      v-model.number="dataForm.bufferSize"
                      :disabled="!isEdit"
                    >
                      <template #append>字节</template>
                    </el-input></el-form-item
                  >
                </div></el-col
              >
              <el-col :xs="24" :span="12">
                <div class="item">
                  <p class="title">{{ dataMsg.timeout }}</p>
                  <el-form-item prop="timeout">
                    <el-input
                      size="large"
                      type="number"
                      step="1"
                      min="1"
                      v-model.number="dataForm.timeout"
                      :disabled="!isEdit"
                    >
                      <template #append>秒</template>
                    </el-input>
                  </el-form-item>
                </div></el-col
              >
            </el-row>
            <!-- 按钮 -->
            <div class="btn-wrap">
              <el-button
                size="large"
                type="primary"
                v-if="!isEdit"
                @click="openEdit"
              >
                <template #icon>
                  <el-icon><Edit /></el-icon>
                </template>
                编辑配置
              </el-button>
              <!-- 取消-保存 -->
              <el-button
                size="large"
                type="danger"
                v-if="isEdit"
                @click="cancelForm"
                :disabled="saveLoading"
              >
                <template #icon>
                  <el-icon><Edit /></el-icon>
                </template>
                取消
              </el-button>
              <el-button
                size="large"
                type="success"
                v-if="isEdit"
                @click="saveForm"
                :loading="saveLoading"
              >
                <template #icon>
                  <el-icon><Edit /></el-icon>
                </template>
                保存
              </el-button>
            </div>
          </el-form>
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
.proxy-settings {
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
    min-height: 420px;

    .content {
      .item {
        margin-bottom: 10px;
        .title {
          font-size: 16px;
          color: #222;
          margin-bottom: 10px;
        }
      }
      .btn-wrap {
        margin-top: 15px;
        width: 100%;
        display: flex;
        justify-content: center;
      }
      @media screen and (max-width: 768px) {
        .btn-wrap {
          .el-button {
            flex: 1;
          }
        }
      }
    }

    .el-result.error {
      height: 420px;
    }
  }
}
</style>