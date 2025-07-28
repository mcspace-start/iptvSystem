<script setup>
import { ref } from "vue";
import request from "@/api/request";
// 折叠面板
const collapseOpen = ref(""); // form

//  #region 获取数据
// 表单
const authFormData = ref({
  user_id: "",
  lang: "zh-CN",
  support_hd: "",
  net_user_id: "",
  dhcp_user_id: "",
  authenticator: "",
  stb_type: "",
  stb_version: "",
  conn_type: 0,
  stb_id: "",
  template_name: "",
  area_id: "",
  user_token: "",
  user_group_id: "",
  product_package_id: "",
  mac: "00:00:00:00:00:00",
  user_field: 0,
  software_version: "",
  desktop_id: "",
  is_smart_stb: false,
  stb_maker: "",
  vip: "",
});
// v-for 生成 form-item
const formItem = [
  {
    label: "用户ID",
    type: "text",
    prop: "user_id",
    placeholder: "请输入用户ID",
  },
  {
    label: "语言",
    type: "text",
    prop: "lang",
    placeholder: "请输入语言,例如:zh-CN",
  },
  {
    label: "DHCP用户ID",
    type: "text",
    prop: "dhcp_user_id",
    placeholder: "请输入DHCP用户ID",
  },
  {
    label: "认证码",
    type: "text",
    prop: "authenticator",
    placeholder: "请输入认证码",
  },
  {
    label: "机顶盒类型",
    type: "text",
    prop: "stb_type",
    placeholder: "请输入机顶盒类型",
  },
  {
    label: "机顶盒版本",
    type: "text",
    prop: "stb_version",
    placeholder: "请输入机顶盒版本",
  },
  {
    label: "连接类型",
    type: "number",
    prop: "conn_type",
    placeholder: "请输入连接类型(数字)",
  },
  {
    label: "机顶盒ID",
    type: "text",
    prop: "stb_id",
    placeholder: "请输入机顶盒ID",
  },
  {
    label: "模板名称",
    type: "text",
    prop: "template_name",
    placeholder: "请输入模板名称",
  },
  {
    label: "区域ID",
    type: "text",
    prop: "area_id",
    placeholder: "请输入区域ID",
  },
  {
    label: "用户令牌",
    type: "text",
    prop: "user_token",
    placeholder: "请输入用户令牌",
  },
  {
    label: "用户组ID",
    type: "text",
    prop: "user_group_id",
    placeholder: "请输入用户组ID",
  },
  {
    label: "产品包ID",
    type: "text",
    prop: "product_package_id",
    placeholder: "请输入产品包ID",
  },
  {
    label: "MAC地址",
    type: "text",
    prop: "mac",
    placeholder: "请输入MAC地址,例如:00:11:22:33:44:55",
  },
  {
    label: "用户字段",
    type: "number",
    prop: "user_field",
    placeholder: "请输入用户字段(数字)",
  },
  {
    label: "软件版本",
    type: "text",
    prop: "software_version",
    placeholder: "请输入软件版本",
  },
  {
    label: "是否智能机顶盒",
    type: "select",
    prop: "is_smart_stb",
    placeholder: "请选择是否为智能机顶盒",
    options: [
      { label: "是", value: true },
      { label: "否", value: false },
    ],
  },
  {
    label: "桌面ID",
    type: "text",
    prop: "desktop_id",
    placeholder: "请输入桌面ID",
  },
  {
    label: "机顶盒制造商",
    type: "text",
    prop: "stb_maker",
    placeholder: "请输入机顶盒制造商",
  },
  {
    label: "VIP状态",
    type: "text",
    prop: "vip",
    placeholder: "请输入VIP状态",
  },
];
// 表单验证规则
const authFormDataRules = {
  area_name: [{ required: true, message: "区域名称为必填项", trigger: "blur" }],
  user_id: [{ required: true, message: "用户ID为必填项", trigger: "blur" }],
  authenticator: [
    { required: true, message: "认证码为必填项", trigger: "blur" },
  ],
  stb_id: [{ required: true, message: "机顶盒ID为必填项", trigger: "blur" }],
  mac: [
    {
      pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      message:
        "请输入有效的MAC地址（如 00:11:22:33:44:55 或 00-11-22-33-44-55）",
      trigger: "blur",
    },
  ],
  lang: [
    {
      pattern: /^[a-z]{2}(-[A-Z]{2})?$/i,
      message: "请输入有效的语言格式（如 zh-CN、en-US）",
      trigger: "blur",
    },
  ],
  dhcp_user_id: [
    { type: "string", message: "DHCP用户ID格式不正确", trigger: "blur" },
  ],
  stb_type: [
    { type: "string", message: "机顶盒类型格式不正确", trigger: "blur" },
  ],
  stb_version: [
    { type: "string", message: "机顶盒版本格式不正确", trigger: "blur" },
  ],
  conn_type: [
    { pattern: /^[0-9]*$/, message: "连接类型只能是数字", trigger: "blur" },
  ],
  template_name: [
    { type: "string", message: "模板名称格式不正确", trigger: "blur" },
  ],
  area_id: [{ type: "string", message: "区域ID格式不正确", trigger: "blur" }],
  user_token: [
    { type: "string", message: "用户令牌格式不正确", trigger: "blur" },
  ],
  user_group_id: [
    { type: "string", message: "用户组ID格式不正确", trigger: "blur" },
  ],
  product_package_id: [
    { pattern: /^-?[0-9]*$/, message: "产品包ID只能是数字", trigger: "blur" },
  ],
  user_field: [
    { pattern: /^[0-9]*$/, message: "用户字段只能是数字", trigger: "blur" },
  ],
  software_version: [
    { type: "string", message: "软件版本格式不正确", trigger: "blur" },
  ],
  is_smart_stb: [
    { type: "boolean", message: "请选择是否智能机顶盒", trigger: "change" },
  ],
  desktop_id: [
    { type: "string", message: "桌面ID格式不正确", trigger: "blur" },
  ],
  stb_maker: [
    { type: "string", message: "机顶盒制造商格式不正确", trigger: "blur" },
  ],
  vip: [{ type: "string", message: "VIP状态格式不正确", trigger: "blur" }],
};
const oldAuthFormData = ref({});
// 获取认证数据
const loading = ref(false);
const getDataUrl = "/authData";
const getData = async () => {
  loading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 将数据赋值给表单
      authFormData.value = { ...res.data };
      oldAuthFormData.value = { ...res.data };
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 初始化获取数据
getData();
// #endregion

// #region 打开关闭编辑
const isEdit = ref(false);
const openEdit = () => {
  if (loading.value) return ElMessage.info("数据加载中，请稍后操作！");
  isEdit.value = true;
  collapseOpen.value = "form";
};
const cancelEdit = () => {
  if (saveAuthConfigLoading.value) return;
  isEdit.value = false;
  // 还原数据
  authFormData.value = { ...oldAuthFormData.value };
  // 折叠
  collapseOpen.value = "";
  // 清空输入框
  textarea.value = "";
};
// #endregion

// 自动识别
const textarea = ref("");
const autoFillInputPlaceholder =
  "user_id=02088888888&lang=zh-CN&stb_type=1&dhcp_user_id=99&area_name...";
// 自动识别内容事件
const autoDetect = () => {
  // 自动填充表单
  const s = autoFillForm(authFormData, textarea);
  if (s) {
    // 展开表单
    collapseOpen.value = "form";
    // 修改
    isEdit.value = true;
    ElMessage.success("自动识别成功，请确认配置信息！");
  } else {
    ElMessage.error("自动识别失败，请检查数据格式！");
  }
};
// 自动识别内容
const autoFillForm = (formDataRef, str) => {
  let s = false;
  if (str.value.trim() === "") {
    textarea.value = "";
    return s;
  }
  // 将字符串按&分割成键值对数组
  const pairs = str.value.split("&");
  // 遍历键名和值
  for (const pair of pairs) {
    // 将每个键值对按=分割
    const [key, value] = pair.split("=");
    // 检查 formDataReactive 是否有对应的属性
    if (formDataRef.value.hasOwnProperty(key)) {
      // 如果有该属性，则赋值
      formDataRef.value[key] = value || "";
      s = true;
    }
  }
  return s;
};
// 表单 ref
const authFormRef = ref(null);
const saveAuthConfigLoading = ref(false);
const saveAuthConfigUrl = "/saveAuthData";

// saveAuthConfig 保存配置
const saveAuthConfigHandler = () => {
  authFormRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过 发起请求
      const s =
        JSON.stringify(authFormData.value) ==
        JSON.stringify(oldAuthFormData.value);
      if (s) {
        return ElMessage.info("未作出修改！");
      }
      ElMessageBox.confirm("确定对认证数据做出修改吗？", "修改确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          saveAuthConfig();
        })
        .catch(() => {});
    } else {
      ElMessage.error("表单验证未通过！");
      // 展开表单
      return false;
    }
  });
};
// 发送保存请求
const saveAuthConfig = async () => {
  saveAuthConfigLoading.value = true;
  const params = { ...authFormData.value };
  try {
    // const { data: res1 } = await axios.post(saveAuthConfigUrl, params);
    const res = await request.get(saveAuthConfigUrl, { params });
    if (res.code == 200) {
      // collapseOpen.value = "";
      // 关闭编辑状态
      isEdit.value = false;
      // 再次获取数据
      await getData();
      ElNotification.success({
        title: "保存配置成功！",
        showClose: false,
      });
      // 将数据赋值给表单
    } else {
      ElMessage.error(res.msg || "保存配置失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    saveAuthConfigLoading.value = false;
  }
};
</script>
<template>
  <div class="auth-data">
    <div class="auto-fill">
      <div class="auto-fill-head">
        <span class="title">
          <el-icon><MagicStick /></el-icon>
          <span>一键识别填充</span>
        </span>
        <span class="btn" @click="autoDetect">识别</span>
      </div>
      <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        :placeholder="autoFillInputPlaceholder"
        :autosize="{ minRows: 3 }"
      />
      <p class="desc">
        <el-icon :size="16"><Warning /></el-icon>
        <span
          >将完整的认证字符串粘贴到上方文本框，然后点击"自动识别"按钮自动填充下方表单</span
        >
      </p>
    </div>
    <!-- 验证配置 -->
    <el-collapse v-model="collapseOpen" expand-icon-position="left">
      <el-collapse-item title="验证配置" name="form">
        <template #title="{ isActive }">
          <div :class="{ 'is-active': isActive }">验证配置（ 点击展开 ）</div>
        </template>
        <div class="auth-form-wrap">
          <el-form
            label-position="top"
            label-width="auto"
            :model="authFormData"
            :rules="authFormDataRules"
            ref="authFormRef"
          >
            <el-row :gutter="20">
              <!-- form -->
              <el-col
                :xs="24"
                :span="12"
                v-for="item in formItem"
                :key="item.prop"
              >
                <el-form-item :label="item.label" :prop="item.prop">
                  <!-- 根据类型渲染input或者select -->
                  <el-input
                    v-if="item.type === 'text'"
                    type="text"
                    v-model="authFormData[item.prop]"
                    size="large"
                    min="0"
                    :placeholder="item.placeholder"
                    :disabled="!isEdit"
                  />
                  <el-input
                    v-if="item.type === 'number'"
                    type="number"
                    v-model.number="authFormData[item.prop]"
                    size="large"
                    min="0"
                    :placeholder="item.placeholder"
                    :disabled="!isEdit"
                  />
                  <!-- 根据类型渲染input或者select -->
                  <el-select
                    v-if="item.type === 'select'"
                    v-model="authFormData[item.prop]"
                    size="large"
                    :placeholder="item.placeholder"
                    :disabled="!isEdit"
                  >
                    <el-option
                      v-for="option in item.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 保存按钮 -->
    <div class="save-btn-wrap">
      <el-button size="large" type="primary" @click="openEdit" v-if="!isEdit">
        <template #icon>
          <el-icon><Edit /></el-icon>
        </template>
        <span>编辑配置</span>
      </el-button>
      <el-button
        size="large"
        type="danger"
        @click="cancelEdit"
        v-if="isEdit"
        :disabled="saveAuthConfigLoading"
      >
        <template #icon>
          <el-icon><Close /></el-icon>
        </template>
        <span>取消</span>
      </el-button>
      <el-button
        size="large"
        type="success"
        @click="saveAuthConfigHandler"
        :loading="saveAuthConfigLoading"
        v-if="isEdit"
      >
        <template #icon>
          <el-icon><Check /></el-icon>
        </template>
        <span>保存配置</span>
      </el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
// 认证数据
.auth-data {
  padding: 15px;
  .auto-fill {
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    .auto-fill-head {
      height: 32px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .title {
        font-size: 18px;
        display: flex;
        align-items: center;
        color: #333;
        .el-icon {
          color: var(--el-color-primary-dark-2);
          margin-right: 4px;
        }
      }
      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 10px;
        margin-left: 10px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid var(--el-color-primary-dark-2);
        color: var(--el-color-primary-dark-2);
        cursor: pointer;
        // 设置文字间距
        letter-spacing: 2px;
        transition: all 0.15s ease;
        &:hover {
          background: #409eff;
          color: #fff;
        }
      }
    }
    .el-textarea {
      font-size: 16px;
    }
    .desc {
      display: flex;
      align-items: center;
      margin-top: 10px;
      font-size: 14px;
      color: #6c757d;
      .el-icon {
        margin-right: 4px;
      }
    }
  }
  .el-collapse {
    margin: 20px 0;
    ::v-deep .el-collapse-item__content {
      padding-bottom: 0;
    }
    // 展开时样式
    .is-active {
      color: var(--el-color-primary);
    }
    .auth-form-wrap {
      padding: 10px;
      padding-bottom: 0;
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
      .el-button {
        flex: 1;
      }
    }
  }
}
</style>

