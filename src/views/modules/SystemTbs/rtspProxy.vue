<script setup>
import { ref, useTemplateRef, watchEffect } from "vue";
import { useWindowWidth } from "@/hook/useWindowWidth";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
// tbs 选项卡激活
const activeName = ref("rtspProxy"); // rtspProxy  rtspProxyServer servers
const handleTabChange = () => {
  // 关闭正在编辑表单
  const rtspProxyFormRef = allData.value.rtspProxy.formRef;
  const rtspProxyServerFormRef = allData.value.rtspProxyServer.formRef;
  if (rtspProxyFormRef) {
    rtspProxyFormRef.clearValidate();
    allData.value.rtspProxy.form = { ...oldAllData.rtspProxy };
  }
  if (rtspProxyServerFormRef) {
    rtspProxyServerFormRef.clearValidate();
    allData.value.rtspProxyServer.form = { ...oldAllData.rtspProxyServer };
  }
  isEdit.value = false;
};

// 当页面小于 xs 时改为top
const tabPosition = ref("left");
const width = useWindowWidth("xs");
watchEffect(() => {
  tabPosition.value = width.value ? "top" : "left";
});

// 获取全部数据
const allData = ref({
  rtspProxy: {
    url: "/rtspProxy",
    formRef: useTemplateRef("rtspProxyFormRef"),
    form: { rtspProxyUrl: "", enableRtspIpReplace: false },
    msg: {
      rtspProxyUrl: {
        label: "RTSP代理服务器地址",
        placeholder: "设置RTSP代理服务器地址",
        desc: "设置RTSP代理服务器地址，用于转发RTSP流媒体请求",
      },
      enableRtspIpReplace: {
        label: "RTSP IP替换",
        placeholder: "设置RTSP IP替换",
        desc: "启用后，系统会自动替换RTSP URL中的IP地址为代理服务器地址",
      },
    },
    rules: {
      rtspProxyUrl: [
        {
          pattern:
            /^rtsp:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?(@[a-zA-Z0-9.-]+(:[0-9]+)?)?\/.*$/,
          message: "请输入有效的RTSP代理服务器地址",
          trigger: "blur",
        },
      ],
    },
  },
  rtspProxyServer: {
    url: "/serverAddressList",
    formRef: useTemplateRef("rtspProxyServerFormRef"),
    form: {
      serverAddress: "127.0.0.1",
      serverPort: 1,
      listenAddress: "127.0.0.1",
      listenPort: 1,
      bufferSize: 1,
      timeout: 0.1,
      keepAliveInterval: 1,
      keepAliveMethod: "OPTIONS", // OPTIONS GET_PARAMETER
      keepAliveCseqStart: 1,
      retryDelay: 0.1,
      connectionCheckInterval: 1,
      maxRetries: 1,
      selectTimeout: 0.1,
      maxRedirects: 0,
    },
    msg: [
      {
        title: "服务器连接设置",
        name: "serverConnection",
        children: [
          {
            name: "serverAddress",
            desc: "选择服务器或输入自定义地址",
            label: "服务器地址",
            placeholder: "RTSP服务器地址",
            type: "comp",
          },
          {
            name: "serverPort",
            desc: "RTSP服务器监听的端口号",
            label: "服务器端口",
            placeholder: "服务器端口",
            type: "number",
          },
        ],
      },
      {
        title: "本地监听设置",
        name: "localListener",
        children: [
          {
            name: "listenAddress",
            desc: "本地代理服务器绑定的IP地址",
            label: "监听地址",
            placeholder: "监听地址",
            type: "text",
          },
          {
            name: "listenPort",
            desc: "本地代理服务器监听的端口号",
            label: "监听端口",
            placeholder: "监听端口",
            type: "number",
          },
        ],
      },
      {
        title: "保活设置",
        name: "keepAlive",
        children: [
          {
            name: "keepAliveInterval",
            desc: "发送保活请求的时间间隔",
            label: "保活间隔(秒)",
            placeholder: "保活间隔",
            type: "number",
          },
          {
            name: "keepAliveMethod",
            desc: "RTSP保活请求使用的方法",
            label: "保活方法",
            type: "select",
            options: ["OPTIONS", "GET_PARAMETER"], // 修正：GET_PARAMS 改为 GET_PARAMETER
          },
          {
            name: "keepAliveCseqStart",
            desc: "保活请求序列号起始值",
            label: "保活CSeq起始值",
            placeholder: "CSeq起始值",
            type: "number",
          },
        ],
      },
      {
        title: "重试设置",
        name: "retrySettings",
        children: [
          {
            name: "retryDelay",
            desc: "连接失败后重试的延迟时间",
            label: "重试延迟(秒)",
            placeholder: "重试延迟",
            type: "number",
          },
          {
            name: "maxRetries",
            desc: "连接失败后尝试重连的最大次数",
            label: "最大重试次数",
            placeholder: "最大重试次数",
            type: "number",
          },
          {
            name: "maxRedirects",
            desc: "允许的RTSP重定向响应的最大次数",
            label: "最大重定向次数",
            placeholder: "最大重定向次数",
            type: "number",
          },
        ],
      },
      {
        title: "缓冲区设置",
        name: "bufferSettings",
        children: [
          {
            name: "bufferSize",
            desc: "数据传输缓冲区大小（字节）",
            label: "缓冲区大小",
            placeholder: "缓冲区大小",
            type: "number",
          },
          {
            name: "timeout",
            desc: "连接超时时间设置",
            label: "超时时间(秒)",
            placeholder: "超时时间(秒)",
            type: "number",
          },
        ],
      },
      {
        title: "连接设置",
        name: "connectionSettings",
        children: [
          {
            name: "connectionCheckInterval",
            desc: "连接检查间隔",
            label: "连接检查间隔(秒)",
            placeholder: "连接检查间隔(秒)",
            type: "number",
          },
          {
            name: "selectTimeout",
            desc: "select系统调用的超时时间",
            label: "选择超时(秒)",
            placeholder: "选择超时(秒)",
            type: "number",
          },
        ],
      },
    ],
    rules: {
      serverAddress: [
        { type: "string", message: "请输入有效的服务器地址", trigger: "blur" },
        {
          pattern:
            /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
          message: "请输入有效的IP地址",
          trigger: "blur",
        },
      ],
      serverPort: [
        {
          pattern:
            /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3})$/,
          message: "端口号范围为1-65535",
          trigger: "blur",
        },
      ],
      listenAddress: [
        { type: "string", message: "请输入有效的监听地址", trigger: "blur" },
        {
          pattern:
            /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
          message: "请输入有效的IP地址",
          trigger: "blur",
        },
      ],
      listenPort: [
        {
          pattern:
            /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3})$/,
          message: "端口号范围为1-65535",
          trigger: "blur",
        },
      ],
      bufferSize: [
        {
          pattern: /^[1-9]\d*$/,
          message: "缓冲区大小必须大于0的整数",
          trigger: "blur",
        },
      ],
      timeout: [
        {
          pattern: /^(0\.[1-9]\d*|[1-9]\d*)$/,
          message: "超时时间必须大于0", // 这个是秒，保持小数
          trigger: "blur",
        },
      ],
      keepAliveInterval: [
        {
          pattern: /^[1-9]\d*$/,
          message: "保活间隔必须大于0的整数",
          trigger: "blur",
        },
      ],
      keepAliveCseqStart: [
        {
          pattern: /^[1-9]\d*$/,
          message: "保活序列号起始值必须大于0的整数",
          trigger: "blur",
        },
      ],
      retryDelay: [
        {
          pattern: /^(0\.[1-9]\d*|[1-9]\d*)$/,
          message: "重试延迟必须大于0",
          trigger: "blur",
        },
      ],
      connectionCheckInterval: [
        {
          pattern: /^[1-9]\d*$/,
          message: "连接检查间隔必须大于0的整数",
          trigger: "blur",
        },
      ],
      maxRetries: [
        {
          pattern: /^[0-9]\d*$/,
          message: "最大重试次数必须大于等于0的整数",
          trigger: "blur",
        },
      ],
      selectTimeout: [
        {
          pattern: /^(0\.[1-9]\d*|[1-9]\d*)$/,
          message: "选择超时必须大于0", // 这个是秒，保持小数
          trigger: "blur",
        },
      ],
      maxRedirects: [
        {
          pattern: /^[0-9]\d*$/,
          message: "最大重定向次数必须大于等于0的整数",
          trigger: "blur",
        },
      ],
    },
  },
  servers: {
    url: "/servers",
    formRef: useTemplateRef("serversTable"),
    form: [],
    msg: {},
    rules: {},
  },
});
const oldAllData = {
  rtspProxy: {},
  rtspProxyServer: {},
  servers: {},
};
const getDataUrl = {
  rtspProxy: "/rtspProxy",
  rtspProxyServer: "/rtspProxyServer",
  servers: "/servers",
};
const loading = ref(false);
// type = ["rtspProxy", "rtspProxyServer", "servers"];
const getData = async (type = []) => {
  loading.value = true;
  try {
    const promises = type.map((item) =>
      //  axios.get(getDataUrl[item])
      request.get(getDataUrl[item]).then((res) => {
        if (res.code == 200) {
          allData.value[item].form = res.data;
          oldAllData[item] = { ...res.data };
        } else {
          ElMessage.error(`获取${typeMsg[item]}数据失败!`);
        }
      })
    );
    // 一起发送请求
    await Promise.all(promises);
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
getData(["rtspProxy", "rtspProxyServer", "servers"]);

const isEdit = ref(false);

const openEditHandler = () => {
  if (loading.value) return ElMessage.info("正在加载中，请稍等");
  isEdit.value = true;
};
// 取消编辑
const cancelConfigHandler = (type) => {
  if (loading.value) return;
  const ref = allData.value[type].formRef;
  // 清除校验
  if (ref) ref.clearValidate();
  // 恢复旧值
  allData.value[type].form = { ...oldAllData[type] };
  isEdit.value = false;
};

// 保存配置方法
const updateUrl = {
  rtspProxy: "/updateRtspProxy",
  rtspProxyServer: "/updateRtspProxyServer",
  servers: "",
};
const saveConfigHandler = (type) => {
  // 除开功能开关
  const ref = allData.value[type].formRef;
  ref.validate((valid) => {
    // 判断值是否修改过
    const isChange =
      JSON.stringify(allData.value[type].form) !==
      JSON.stringify(oldAllData[type]);

    if (!isChange) return ElMessage.info("未修改任何配置");
    if (valid) {
      // 发送请求
      updateConfig(type);
    }
  });
};

// 更新配置
const updateConfig = async (type) => {
  const url = updateUrl[type];
  const params = allData.value[type].form;
  loading.value = true;
  try {
    // const { data: res1 } = await axios.put(url, params);
    const res = await request.get(url, { params });
    if (res.code == 200) {
      isEdit.value = false;
      ElNotification.success({
        title: "保存配置成功！",
        showClose: false,
      });
      // 等待 getData 完成
      await getData([type]);
    } else {
      ElMessage.error(res.msg || "保存失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// 获取服务器地址选择列表
const selectAddressValue = ref("");
const selectAddressLoading = ref(false);
const serverAddressOptions = ref([]);
const serverAddressOptionsUrl = "/serverAddressList";
const getAddressOptions = async () => {
  if (serverAddressOptions.value.length !== 0) return;
  selectAddressLoading.value = true;
  try {
    // const { data: rew1 } = await axios.get(serverAddressOptionsUrl);
    const res = await request.get(serverAddressOptionsUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      serverAddressOptions.value = res.data;
    } else {
      ElMessage.error(`获取地址失败，请稍后重试！`);
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    selectAddressLoading.value = false;
  }
};

// el-input:step
const inputNumberStep = (name) => {
  let step = 1;
  if (name === "selectTimeout") step = 0.1;
  if (name === "bufferSize") step = 1024;
  return step;
};

// #region 服务选择键添加和编辑及删除
// 添加和编辑
const isEditServers = ref(false);
const saveServersDialog = ref(false);
const saveServersLoading = ref(false);
const saveServersForm = ref({
  serverAddress: "",
  serverName: "",
});

const saveServersRules = {
  serverAddress: [
    {
      required: true,
      message: "服务器地址不能为空",
      trigger: "blur",
    },
    {
      pattern: /^rtsp:\/\/\d{1,3}(\.\d{1,3}){3}:\d+$/,
      message: "请输入正确服务器地址",
      trigger: "blur",
    },
  ],
  serverName: [
    {
      required: true,
      message: "服务器名称不能为空",
      trigger: "blur",
    },
  ],
};
const saveServersFormRef = ref(null);
let oldServersForm = {};
const addServersUrl = "/addServers";
const editServersUrl = "/updateServers";
let saveServersUrl = "";

const openSaveServersDialog = (type, row) => {
  if (saveServersLoading.value) return ElMessage.info("正在保存，请稍后");
  // 去除表单验证
  if (saveServersFormRef.value) {
    saveServersFormRef.value.clearValidate();
  }
  if (type === "add") {
    isEditServers.value = false;
    saveServersUrl = addServersUrl;
    saveServersForm.value = {
      serverAddress: "",
      serverName: "",
    };
  } else if (type === "edit") {
    isEditServers.value = true;
    saveServersUrl = editServersUrl;
    saveServersForm.value = { ...row };
    // 保存修改前数据
    oldServersForm = { ...row };
  }
  saveServersDialog.value = true;
};
const saveServers = () => {
  let params = {};
  if (isEditServers.value) {
    params = {
      id: saveServersForm.value.id,
      data: {
        serverAddress: saveServersForm.value.serverAddress,
        serverName: saveServersForm.value.serverName,
      },
    };
  } else {
    params = saveServersForm.value;
  }
  // 表单验证
  saveServersFormRef.value.validate(async (valid) => {
    if (valid) {
      // 是否修改
      if (
        JSON.stringify(saveServersForm.value) == JSON.stringify(oldServersForm)
      ) {
        return ElMessage.info("未做任何修改!");
      }
      // 发送请求
      saveServersLoading.value = true;
      try {
        // const { data: res1 } = await axios.post(saveServersUrl, params);
        const res = await request.get(saveServersUrl, { params });
        if (res.code == 200) {
          const s = isEditServers.value ? "编辑" : "添加";
          ElNotification.success({
            title: `${s}服务器成功!`,
          });
          saveServersDialog.value = false;
          // 再次获取数据
          await getData(["servers"]);
        } else {
          ElMessage.error(res.msg || "保存失败");
        }
      } catch (error) {
        ElMessage.error(error.msg || "请求错误！");
        console.log(error);
      } finally {
        saveServersLoading.value = false;
      }
    }
  });
};
// 删除
const deleteServersDialog = ref(false);
const deleteServersRow = ref("[任务名称]");
const deleteServersLoading = ref(false);
const deleteServersUrl = "/deleteServers";
const openDeleteServersDialog = (row) => {
  if (deleteServersLoading.value) return ElMessage.info("正在删除，请稍后");
  deleteServersRow.value = row;
  deleteServersDialog.value = true;
};
const deleteServers = async () => {
  deleteServersLoading.value = true;
  const params = { id: deleteServersRow.value.id };
  try {
    // const { data: res1 } = await axios.delete(deleteServersUrl, { params });
    const res = await request.get(deleteServersUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: "删除成功任务!",
        showClose: false,
      });
      deleteServersDialog.value = false;
      // 再次获取数据
      await getData(["servers"]);
    } else {
      ElMessage.error(res.msg || "删除失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteServersLoading.value = false;
  }
};
// #endregion
</script>
<template>
  <div class="rtsp-proxy">
    <el-tabs
      :tab-position="tabPosition"
      class="demo-tabs"
      type="border-card"
      v-model="activeName"
      @tab-change="handleTabChange"
    >
      <!-- 代理服务器地址 -->
      <el-tab-pane name="rtspProxy">
        <template #label>
          <div class="tab-label">代理服务器地址</div>
        </template>
        <!-- 内容 -->
        <div class="tabs-wrap">
          <el-row :gutter="15">
            <el-col>
              <el-card
                header-class="iptv-config-card-header"
                body-class="card-body"
              >
                <template #header>
                  <p class="card-title">
                    <el-icon><Link /></el-icon>
                    <span>{{ allData.rtspProxy.msg.rtspProxyUrl.label }}</span>
                  </p>
                </template>
                <div class="form-item">
                  <!-- input -->
                  <el-form
                    :model="allData.rtspProxy.form"
                    :rules="allData.rtspProxy.rules"
                    ref="rtspProxyFormRef"
                  >
                    <el-form-item prop="rtspProxyUrl">
                      <el-input
                        size="large"
                        :placeholder="
                          allData.rtspProxy.msg.rtspProxyUrl.placeholder
                        "
                        :disabled="!isEdit"
                        v-model="allData.rtspProxy.form.rtspProxyUrl"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <!-- 描述 -->
                  <p class="desc">
                    <el-icon><Warning /></el-icon>
                    <span>{{ allData.rtspProxy.msg.rtspProxyUrl.desc }}</span>
                  </p>
                  <!-- 占位 -->
                  <p style="margin-top: 10px"></p>
                  <!-- switch -->
                  <div class="switch-wrap">
                    <div class="desc-wrap">
                      <span class="desc-title">
                        {{ allData.rtspProxy.msg.enableRtspIpReplace.label }}
                      </span>
                      <span class="desc-content">
                        {{ allData.rtspProxy.msg.enableRtspIpReplace.desc }}
                      </span>
                    </div>
                    <div class="switch-wrap">
                      <el-switch
                        v-model="allData.rtspProxy.form.enableRtspIpReplace"
                        :disabled="!isEdit"
                      />
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- 保存按钮 -->
          <div class="btn-wrap">
            <el-button
              v-if="!isEdit"
              size="large"
              type="primary"
              @click="openEditHandler"
            >
              <template #icon>
                <el-icon><Edit /></el-icon>
              </template>
              <span>编辑配置</span>
            </el-button>
            <el-button
              v-if="isEdit"
              size="large"
              type="danger"
              @click="cancelConfigHandler('rtspProxy')"
              :disabled="loading"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              v-if="isEdit"
              size="large"
              type="success"
              :loading="loading"
              @click="saveConfigHandler('rtspProxy')"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 代理服务器配置 -->
      <el-tab-pane name="rtspProxyServer">
        <template #label>
          <div class="tab-label">代理服务器配置</div>
        </template>
        <!-- 内容 -->
        <div class="tabs-wrap">
          <el-form
            :model="allData.rtspProxyServer.form"
            :rules="allData.rtspProxyServer.rules"
            ref="rtspProxyServerFormRef"
          >
            <el-row :gutter="15">
              <el-col
                :xs="24"
                :span="12"
                v-for="(item, index) in allData.rtspProxyServer.msg"
                :key="index"
              >
                <el-card
                  header-class="iptv-config-card-header"
                  body-class="card-body"
                >
                  <template #header>
                    <p class="card-title">
                      <el-icon><Cpu /></el-icon>
                      <span>{{ item.title }}</span>
                    </p>
                  </template>
                  <div
                    class="form-item"
                    v-for="(i, i_i) in item.children"
                    :key="i_i"
                  >
                    <!-- label -->
                    <p class="item-label">{{ i.label }}</p>
                    <el-form-item :prop="i.name">
                      <!-- 自定义选择 -->
                      <el-input
                        v-if="i.type === 'comp'"
                        :placeholder="i.placeholder"
                        size="large"
                        v-model="allData.rtspProxyServer.form[i.name]"
                        @input="selectAddressValue = ''"
                        :disabled="!isEdit"
                      >
                        <template #append>
                          <!-- select 上面input值 -->
                          <el-select
                            placeholder="自定义"
                            style="min-width: 150px"
                            size="large"
                            v-model="selectAddressValue"
                            :disabled="!isEdit"
                            :loading="selectAddressLoading"
                            @visible-change="getAddressOptions"
                            @change="
                              allData.rtspProxyServer.form[i.name] =
                                selectAddressValue
                            "
                          >
                            <el-option
                              v-for="(item, index) in serverAddressOptions"
                              :key="index"
                              :label="item.serverName"
                              :value="item.serverAddress"
                            ></el-option>
                            <el-option label="自定义" value=""></el-option>
                          </el-select>
                        </template>
                      </el-input>
                      <!-- input -->
                      <el-input
                        v-if="i.type === 'text'"
                        size="large"
                        :placeholder="i.placeholder"
                        v-model="allData.rtspProxyServer.form[i.name]"
                        :type="i.type"
                        :disabled="!isEdit"
                      >
                      </el-input>
                      <!-- number -->
                      <el-input
                        v-if="i.type === 'number'"
                        size="large"
                        :placeholder="i.placeholder"
                        v-model.number="allData.rtspProxyServer.form[i.name]"
                        :type="i.type"
                        :step="inputNumberStep(i.name)"
                        :disabled="!isEdit"
                        min="0"
                      >
                      </el-input>
                      <!-- select -->
                      <el-select
                        v-if="i.type === 'select'"
                        size="large"
                        :placeholder="i.placeholder"
                        v-model="allData.rtspProxyServer.form[i.name]"
                        :disabled="!isEdit"
                      >
                        <el-option
                          v-for="i_i in i.options"
                          :key="i_i"
                          :label="i_i"
                          :value="i_i"
                        />
                      </el-select>
                    </el-form-item>
                    <!-- 描述 -->
                    <p class="desc">
                      <el-icon><Warning /></el-icon>
                      <span>{{ i.desc }}</span>
                    </p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
          <!-- 保存按钮 -->
          <div class="btn-wrap">
            <el-button
              v-if="!isEdit"
              size="large"
              type="primary"
              @click="openEditHandler"
            >
              <template #icon>
                <el-icon><Edit /></el-icon>
              </template>
              <span>编辑配置</span>
            </el-button>
            <el-button
              v-if="isEdit"
              size="large"
              type="danger"
              @click="cancelConfigHandler('rtspProxyServer')"
              :disabled="loading"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              v-if="isEdit"
              size="large"
              type="success"
              :loading="loading"
              @click="saveConfigHandler('rtspProxyServer')"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 服务器选择键 -->
      <el-tab-pane name="servers">
        <template #label>
          <div class="tab-label">服务器选择键</div>
        </template>
        <!-- 内容-表格 -->
        <div class="tabs-wrap">
          <!-- 标题头部 -->
          <div class="header">
            <div class="title hidden-xs-only">服务器选择键</div>
            <div class="btn-wrap">
              <el-button
                type="primary"
                size="large"
                @click="openSaveServersDialog('add')"
              >
                <template #icon>
                  <el-icon><Plus /></el-icon>
                </template>
                添加服务器
              </el-button>
            </div>
          </div>
          <!-- 表格区域 -->
          <div class="table-wrap">
            <el-table
              :data="allData.servers.form"
              header-row-class-name="scheduled-task-table-header"
              v-loading="loading"
            >
              <el-table-column label="#" width="40" type="index" />
              <el-table-column
                prop="id"
                label="ID"
                min-width="40"
                show-overflow-tooltip
              />
              <el-table-column
                prop="serverName"
                label="服务器名称"
                min-width="140"
                show-overflow-tooltip
              />
              <el-table-column
                prop="serverAddress"
                label="服务器地址"
                min-width="190"
                show-overflow-tooltip
              />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <div class="tools-bar">
                    <el-button-group>
                      <el-button
                        type="primary"
                        @click="openSaveServersDialog('edit', row)"
                      >
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button
                        type="danger"
                        @click="openDeleteServersDialog(row)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </el-button-group>
                  </div>
                </template>
              </el-table-column>
              <!-- 无数据 -->
              <template #empty>
                <el-empty
                  :image-size="100"
                  class="table-empty"
                  description="暂无数据"
                />
              </template>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框 -->
    <!-- 添加和编辑 -->
    <el-dialog
      v-model="saveServersDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog primary"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Warning /></el-icon
          ><span>{{ isEditServers ? "编辑" : "添加" }}服务器</span>
        </div>
      </template>
      <div class="save-dialog-content">
        <el-form
          :model="saveServersForm"
          :rules="saveServersRules"
          ref="saveServersFormRef"
          label-position="top"
        >
          <el-form-item label="服务器名称" prop="serverName" required>
            <el-input
              size="large"
              placeholder="请输入服务器名称"
              v-model="saveServersForm.serverName"
            >
              <template #prefix
                ><el-icon><PriceTag /></el-icon
              ></template>
            </el-input>
          </el-form-item>
          <el-form-item label="服务器地址" prop="serverAddress" required>
            <el-input
              size="large"
              placeholder="请输入服务器地址"
              v-model="saveServersForm.serverAddress"
            >
              <template #prefix
                ><el-icon><Link /></el-icon
              ></template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveServersDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="saveServers"
            :loading="saveServersLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog
      v-model="deleteServersDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog danger"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Warning /></el-icon><span>删除确认</span>
        </div>
      </template>
      <div class="delete-dialog-content">
        <p class="title">确定要删除这个服务器吗？</p>
        <p class="content">
          <span class="label">任务名称：</span
          ><span class="name">{{ deleteServersRow.serverName }}</span>
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteServersDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteServers"
            :loading="deleteServersLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.rtsp-proxy {
  .tab-label {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    // font-size: 16px;
  }
  // 内容区域
  .tabs-wrap {
    padding: 0 15px 15px 5px;
    .el-col {
      margin-top: 15px;
    }
    // 卡片
    .el-card {
      .card-title {
        display: flex;
        align-items: center;
        .el-icon {
          margin-right: 4px;
        }
      }
      // 子项
      .form-item {
        margin-bottom: 10px;

        .item-label {
          color: #333;
          font-size: 16px;
          margin-bottom: 8px;
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
            flex: 1;
            color: #6c757d;
            // 不允许文字换行，超出出现省略号
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        // switch 类型
        .switch-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          .desc-wrap {
            display: flex;
            flex-direction: column;
            gap: 4px;
            .desc-title {
              font-size: 15px;
              font-weight: bold;
              color: #222;
            }
            .desc-content {
              font-size: 14px;
              color: #6c757d;
            }
          }
        }
      }
    }
    // 保存配置按钮
    .btn-wrap {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    // 表格
    .header {
      display: flex;
      align-items: center;
      margin: 15px 0;
      > div {
        flex: 1;
      }
      .title {
        font-size: 18px;
      }
      .btn-wrap {
        margin: 0;
      }
    }
    .table-wrap {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
      .el-icon {
        margin: 0;
      }
    }
    // 小屏时按钮最大
    @media screen and (max-width: 768px) {
      .btn-wrap {
        justify-content: center;
        .el-button {
          flex: 1;
        }
      }
    }
  }
  .delete-dialog-content {
    .title {
      font-size: 16px;
      color: #222;
      margin-bottom: 15px;
    }
    .content {
      background: #f8f9fc;
      border: 1px solid #eaecf4;
      border-radius: 4px;
      padding: 10px 15px;
      .label {
        font-weight: bold;
      }
    }
  }
}
</style>
<style lang="less">
.rtsp-proxy {
  .el-tabs {
    .el-tabs__header {
      margin: 0;
    }
  }
}
</style>