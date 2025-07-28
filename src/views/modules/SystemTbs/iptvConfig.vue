<script setup>
import { ref, useTemplateRef, watchEffect } from "vue";
import { useWindowWidth } from "@/hook/useWindowWidth";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

// tbs 激活页面
const activeName = ref("iptvConfig"); // iptvConfig outputConfig dataFiles features
// 当页面小于 xs 时改为top
const tabPosition = ref("left");
const width = useWindowWidth("xs");
watchEffect(() => {
  tabPosition.value = width.value ? "top" : "left";
});
// loading
const loading = ref(false);
// tab 页面切换事件,取消表单输入关闭编辑
const handleTabChange = (name) => {
  cancelConfigHandler(name);
  if (loading.value) isEdit.value = false;
};
// 全部数据
const allData = ref({
  iptvConfig: {
    url: "/iptvConfig",
    formRef: useTemplateRef("iptvConfigFormRef"),
    form: { iptvServer: "", multicastServer: "" },
    rules: {
      iptvServer: [
        { required: true, message: "请输入IPTV服务器地址", trigger: "blur" },
        {
          type: "url",
          message: "请输入正确的服务器地址",
          trigger: "blur",
        },
      ],
      multicastServer: [
        { required: true, message: "请输入组播服务器地址", trigger: "blur" },
        {
          type: "url",
          message: "请输入正确的组播服务器地址",
          trigger: "blur",
        },
      ],
    },
    msg: {
      iptvServer: {
        label: "IPTV服务器",
        desc: "设置IPTV服务器的完整地址，包括协议和端口",
        placeholder: "如：http://192.168.1.100:8080",
      },
      multicastServer: {
        label: "组播服务器",
        desc: "设置组播服务器的IP地址，通常为239.x.x.x格式",
        placeholder: "如：http://239.255.0.1:1234",
      },
    },
  },
  outputConfig: {
    url: "/outputConfig",
    formRef: useTemplateRef("outputConfigFormRef"),
    form: {
      outputCombined: "",
      outputIgmp: "",
      outputRtsp: "",
      outputTxt: "",
    },
    rules: {
      outputCombined: [
        {
          required: true,
          message: "请输入组合输出的文件路径",
          trigger: "blur",
        },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.m3u$/i,
          message: "文件名须以.m3u结尾且不含非法字符",
          trigger: "blur",
        },
      ],
      outputIgmp: [
        {
          required: true,
          message: "请输入IGMP输出的文件路径",
          trigger: "blur",
        },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.m3u$/i,
          message: "文件名须以.m3u结尾且不含非法字符",
          trigger: "blur",
        },
      ],
      outputRtsp: [
        {
          required: true,
          message: "请输入RTSP输出的文件路径",
          trigger: "blur",
        },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.m3u$/i,
          message: "文件名须以.m3u结尾且不含非法字符",
          trigger: "blur",
        },
      ],
      outputTxt: [
        { required: true, message: "请输入TXT输出的文件路径", trigger: "blur" },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.txt$/i,
          message: "文件名须以.txt结尾且不含非法字符",
          trigger: "blur",
        },
      ],
    },
    msg: {
      outputCombined: {
        label: "组合输出",
        desc: "RTSP和IGMP协议组合的M3U文件输出路径",
        placeholder: "请输入组合输出的文件路径",
      },
      outputIgmp: {
        label: "IGMP输出",
        desc: "IGMP协议的M3U文件输出路径",
        placeholder: "请输入IGMP输出的文件路径",
      },
      outputRtsp: {
        label: "RTSP输出",
        desc: "RTSP协议的M3U文件输出路径",
        placeholder: "请输入RTSP输出的文件路径",
      },
      outputTxt: {
        label: "TXT输出",
        desc: "TXT格式的频道列表文件输出路径",
        placeholder: "请输入TXT输出的文件路径",
      },
    },
  },
  dataFiles: {
    url: "/dataFiles",
    formRef: useTemplateRef("dataFilesFormRef"),
    form: {
      extraChannelsFile: "",
      extraAppendM3uFile: "",
    },
    rules: {
      extraChannelsFile: [
        {
          required: true,
          message: "请输入额外频道文件的路径",
          trigger: "blur",
        },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.html$/i,
          message: "文件路径须以.html结尾且不含非法字符",
          trigger: "blur",
        },
      ],
      extraAppendM3uFile: [
        {
          required: true,
          message: "请输入额外M3U追加文件的路径",
          trigger: "blur",
        },
        {
          pattern: /^[^<>:"|?*\x00-\x1f]+\.m3u$/i,
          message: "文件路径须以.m3u结尾且不含非法字符",
          trigger: "blur",
        },
      ],
    },
    msg: {
      extraChannelsFile: {
        label: "额外频道文件",
        desc: "用于提供额外频道数据的HTML文件路径",
        placeholder: "请输入额外频道文件的路径",
      },
      extraAppendM3uFile: {
        label: "额外M3U追加文件",
        desc: "需要追加到生成的M3U文件中的自定义M3U文件路径",
        placeholder: "请输入额外M3U追加文件的路径",
      },
    },
  },
  features: {
    url: "/features",
    formRef: useTemplateRef(""),
    form: {
      enableRtsp: false,
      enableIgmp: false,
      enableCombined: false,
      enableTxt: false,
      enableRtpFormat: false,
      enableRtspSimplify: false,
      enableUserinfoReplace: false,
      enableHttpUrl: false,
    },
    rules: {},
    msg: [
      {
        label: "功能开关设置",
        name: "outputSettings",
        children: [
          {
            label: "RTSP输出",
            name: "enableRtsp", // 修改 name
            desc: "启用后，将生成RTSP协议的M3U文件",
          },
          {
            label: "IGMP输出",
            name: "enableIgmp", // 修改 name
            desc: "启用后，将生成IGMP协议的M3U文件",
          },
          {
            label: "组合输出",
            name: "enableCombined", // 修改 name
            desc: "启用后，将生成RTSP+IGMP组合的M3U文件",
          },
        ],
      },
      {
        label: "TXT文件生成控制",
        name: "txtControl",
        children: [
          {
            label: "TXT输出",
            name: "enableTxt", // 修改 name
            desc: "启用后，将生成TXT格式的频道列表文件",
          },
          {
            label: "RTP格式",
            name: "enableRtpFormat", // 修改 name
            desc: "启用后，IGMP地址将使用rtp://格式替代http://格式",
          },
          {
            label: "HTTP链接",
            name: "enableHttpUrl", // 修改 name
            desc: "启用后，TXT文件将调整组播和单播的顺序",
          },
        ],
      },
      {
        label: "通用设置",
        name: "commonSettings",
        children: [
          {
            label: "RTSP简化",
            name: "enableRtspSimplify", // 修改 name
            desc: "启用后，将简化RTSP URL地址格式",
          },
          {
            label: "用户信息替换",
            name: "enableUserinfoReplace", // 修改 name
            desc: "启用后，将替换URL中的用户认证信息",
          },
        ],
      },
    ],
  },
});
const typeMsg = {
  iptvConfig: "服务器配置",
  outputConfig: "输出文件",
  dataFiles: "数据文件",
  features: "功能开关",
};
// 旧值
const oldVal = {
  iptvConfig: {},
  outputConfig: {},
  dataFiles: {},
  features: {},
};
// #region 获取数据
const getDataUrl = {
  iptvConfig: "/iptvConfig",
  outputConfig: "/outputConfig",
  dataFiles: "/dataFiles",
  features: "/features",
};
// type = ["iptvConfig", "outputConfig", "dataFiles", "features"];
const getData = async (type = []) => {
  loading.value = true;
  try {
    const promises = type.map(async (item) => {
      // axios.get(getDataUrl[item])
      return request.get(getDataUrl[item]).then((res) => {
        // 返回Promise
        if (res.code == 200) {
          allData.value[item].form = res.data;
          oldVal[item] = { ...res.data };
        } else {
          ElMessage.error(`获取${typeMsg[item]}数据失败!`);
        }
      });
    });
    // 等待所有请求完成
    await Promise.all(promises);
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 首次获取数据
getData(["iptvConfig", "outputConfig", "dataFiles", "features"]);
// 控制编辑按钮
const isEdit = ref(false);
// 打开编辑
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
  allData.value[type].form = { ...oldVal[type] };
  isEdit.value = false;
};
// #endregion

// #region 更新配置
const updateUrl = {
  iptvConfig: "/updateIptvConfig",
  outputConfig: "/updateOutputConfig",
  dataFiles: "/updateDataFiles",
  features: "/updateFeatures",
};
// 保存配置方法
const saveConfigHandler = (type) => {
  // 除开功能开关
  if (type !== "features") {
    const ref = allData.value[type].formRef;
    ref.validate((valid) => {
      // 判断值是否修改过
      const isChange =
        JSON.stringify(allData.value[type].form) !==
        JSON.stringify(oldVal[type]);

      if (!isChange) return ElMessage.info("未修改任何配置");
      if (valid) {
        // 发送请求
        updateConfig(type);
      }
    });
  } else {
    // 功能开关不需要表单验证
    const s =
      JSON.stringify(allData.value[type].form) === JSON.stringify(oldVal[type]);
    if (s) return ElMessage.info("未修改任何配置");
    // 发送请求
    updateConfig(type);
  }
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
      ElMessage.error(res.msg || "保存配置失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// #endregion
</script>

<template>
  <div class="iptv-config">
    <el-tabs
      :tab-position="tabPosition"
      type="border-card"
      @tab-change="handleTabChange"
      v-model="activeName"
    >
      <!-- 服务器设置 -->
      <el-tab-pane name="iptvConfig">
        <template #label>
          <div class="tbs-label">服务器设置</div>
        </template>
        <!-- 内容区域 -->
        <div class="tabs-wrap">
          <el-form
            :model="allData.iptvConfig.form"
            :rules="allData.iptvConfig.rules"
            ref="iptvConfigFormRef"
          >
            <el-row :gutter="15">
              <el-col
                :xs="24"
                :span="12"
                v-for="(_, key) in allData.iptvConfig.form"
                :key="key"
              >
                <!-- 内容 -->
                <el-card
                  header-class="iptv-config-card-header"
                  body-class="card-body"
                >
                  <template #header>
                    <p class="card-title">
                      <el-icon><Monitor /></el-icon>
                      <span>{{ allData.iptvConfig.msg[key].label }}</span>
                    </p>
                  </template>
                  <!-- input -->
                  <el-form-item :prop="key">
                    <el-input
                      size="large"
                      :placeholder="allData.iptvConfig.msg[key].placeholder"
                      v-model="allData.iptvConfig.form[key]"
                      :disabled="!isEdit"
                    >
                    </el-input>
                  </el-form-item>
                  <!-- 描述 -->
                  <p class="desc">
                    <el-icon><Warning /></el-icon>
                    <span>{{ allData.iptvConfig.msg[key].desc }}</span>
                  </p>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
          <!-- 保存按钮 -->
          <div class="save-btn-wrap">
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
              size="large"
              type="danger"
              v-if="isEdit"
              @click="cancelConfigHandler('iptvConfig')"
              :disabled="loading"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              size="large"
              type="success"
              v-if="isEdit"
              @click="saveConfigHandler('iptvConfig')"
              :loading="loading"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 输出文件 -->
      <el-tab-pane name="outputConfig">
        <template #label>
          <div class="tbs-label">输出文件</div>
        </template>
        <!-- 内容区域 -->
        <div class="tabs-wrap">
          <el-form
            :model="allData.outputConfig.form"
            :rules="allData.outputConfig.rules"
            ref="outputConfigFormRef"
          >
            <el-row :gutter="15">
              <el-col
                :xs="24"
                :span="12"
                v-for="(_, key) in allData.outputConfig.form"
                :key="key"
              >
                <!-- 内容 -->
                <el-card
                  header-class="iptv-config-card-header"
                  body-class="card-body"
                >
                  <template #header>
                    <p class="card-title">
                      <el-icon><Monitor /></el-icon>
                      <span>{{ allData.outputConfig.msg[key].label }}</span>
                    </p>
                  </template>
                  <!-- input -->
                  <el-form-item :prop="key">
                    <el-input
                      size="large"
                      :placeholder="allData.outputConfig.msg[key].placeholder"
                      v-model="allData.outputConfig.form[key]"
                      :disabled="!isEdit"
                    >
                    </el-input>
                  </el-form-item>
                  <!-- 描述 -->
                  <p class="desc">
                    <el-icon><Warning /></el-icon>
                    <span>{{ allData.outputConfig.msg[key].desc }}</span>
                  </p>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
          <!-- 保存按钮 -->
          <div class="save-btn-wrap">
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
              size="large"
              type="danger"
              v-if="isEdit"
              @click="cancelConfigHandler('outputConfig')"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              size="large"
              type="success"
              v-if="isEdit"
              @click="saveConfigHandler('outputConfig')"
              :loading="loading"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 数据文件 -->
      <el-tab-pane name="dataFiles">
        <template #label>
          <div class="tbs-label">数据文件</div>
        </template>
        <!-- 内容区域 -->
        <div class="tabs-wrap">
          <el-form
            :model="allData.dataFiles.form"
            :rules="allData.dataFiles.rules"
            ref="dataFilesFormRef"
          >
            <el-row :gutter="15">
              <el-col
                :xs="24"
                :span="12"
                v-for="(_, key) in allData.dataFiles.form"
                :key="key"
              >
                <!-- 内容 -->
                <el-card
                  header-class="iptv-config-card-header"
                  body-class="card-body"
                >
                  <template #header>
                    <p class="card-title">
                      <el-icon><Monitor /></el-icon>
                      <span>{{ allData.dataFiles.msg[key].label }}</span>
                    </p>
                  </template>
                  <!-- input -->
                  <el-form-item :prop="key">
                    <el-input
                      size="large"
                      :placeholder="allData.dataFiles.msg[key].placeholder"
                      v-model="allData.dataFiles.form[key]"
                      :disabled="!isEdit"
                    >
                    </el-input>
                  </el-form-item>
                  <!-- 描述 -->
                  <p class="desc">
                    <el-icon><Warning /></el-icon>
                    <span>{{ allData.dataFiles.msg[key].desc }}</span>
                  </p>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
          <!-- 保存按钮 -->
          <div class="save-btn-wrap">
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
              size="large"
              type="danger"
              v-if="isEdit"
              @click="cancelConfigHandler('dataFiles')"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              size="large"
              type="success"
              v-if="isEdit"
              @click="saveConfigHandler('dataFiles')"
              :loading="loading"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 功能开关 -->
      <el-tab-pane name="features">
        <template #label>
          <div class="tbs-label">功能开关</div>
        </template>
        <!-- 内容区域 -->
        <div class="tabs-wrap">
          <el-row :gutter="15">
            <el-col
              :span="24"
              v-for="(item, index) in allData.features.msg"
              :key="index"
            >
              <!-- 内容 -->
              <el-card
                header-class="iptv-config-card-header"
                body-class="card-body"
              >
                <template #header>
                  <p class="card-title">
                    <el-icon><Monitor /></el-icon>
                    <span>{{ item.label }}</span>
                  </p>
                </template>
                <!-- card-body -->
                <div
                  class="switch-wrap"
                  v-for="(i, i_i) in item.children"
                  :key="i_i"
                >
                  <div class="desc-wrap">
                    <span class="desc-title">{{ i.label }}</span>
                    <span class="desc-content">{{ i.desc }}</span>
                  </div>
                  <div class="switch-wrap">
                    <el-switch
                      v-model="allData.features.form[i.name]"
                      :disabled="!isEdit"
                    />
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- 保存按钮 -->
          <div class="save-btn-wrap">
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
              size="large"
              type="danger"
              v-if="isEdit"
              @click="cancelConfigHandler('features')"
            >
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              <span>取消</span>
            </el-button>
            <el-button
              size="large"
              type="success"
              v-if="isEdit"
              @click="saveConfigHandler('features')"
              :loading="loading"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              <span>保存配置</span>
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="less" scoped>
.iptv-config {
  .tbs-label {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    // font-size: 16px;
  }
  // 内容区域
  .tabs-wrap {
    padding: 0 15px 15px 0;
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

    // 保存配置按钮
    .save-btn-wrap {
      margin-top: 20px;
      padding: 0 10px;
      display: flex;
      justify-content: flex-end;
    }
    @media screen and (max-width: 768px) {
      .save-btn-wrap {
        justify-content: center;
        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>