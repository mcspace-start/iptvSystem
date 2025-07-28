<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

const defaultAuthForm = ref({
  area_name: "",
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

const oldDefaultAuthData = ref({});
// v-for 生成 form-item
const formItem = [
  {
    label: "区域名称",
    type: "text",
    prop: "area_name",
    placeholder: "请输入区域名称",
  },
  {
    label: "用户ID (user_id)",
    type: "text",
    prop: "user_id",
    placeholder: "请输入用户ID",
  },
  {
    label: "语言 (lang)",
    type: "text",
    prop: "lang",
    placeholder: "请输入语言,例如:zh-CN",
  },
  {
    label: "DHCP用户ID (dhcp_user_id)",
    type: "text",
    prop: "dhcp_user_id",
    placeholder: "请输入DHCP用户ID",
  },
  {
    label: "认证码 (authenticator)",
    type: "text",
    prop: "authenticator",
    placeholder: "请输入认证码",
  },
  {
    label: "机顶盒类型 (stb_type)",
    type: "text",
    prop: "stb_type",
    placeholder: "请输入机顶盒类型",
  },
  {
    label: "机顶盒版本 (stb_version)",
    type: "text",
    prop: "stb_version",
    placeholder: "请输入机顶盒版本",
  },
  {
    label: "连接类型 (conn_type)",
    type: "number",
    prop: "conn_type",
    placeholder: "请输入连接类型(数字)",
  },
  {
    label: "机顶盒ID (stb_id)",
    type: "text",
    prop: "stb_id",
    placeholder: "请输入机顶盒ID",
  },
  {
    label: "模板名称 (template_name)",
    type: "text",
    prop: "template_name",
    placeholder: "请输入模板名称",
  },
  {
    label: "区域ID (area_id)",
    type: "text",
    prop: "area_id",
    placeholder: "请输入区域ID",
  },
  {
    label: "用户令牌 (user_token)",
    type: "text",
    prop: "user_token",
    placeholder: "请输入用户令牌",
  },
  {
    label: "用户组ID (user_group_id)",
    type: "text",
    prop: "user_group_id",
    placeholder: "请输入用户组ID",
  },
  {
    label: "产品包ID (product_package_id)",
    type: "text",
    prop: "product_package_id",
    placeholder: "请输入产品包ID",
  },
  {
    label: "MAC地址 (mac)",
    type: "text",
    prop: "mac",
    placeholder: "请输入MAC地址,例如:00:11:22:33:44:55",
  },
  {
    label: "用户字段 (user_field)",
    type: "number",
    prop: "user_field",
    placeholder: "请输入用户字段(数字)",
  },
  {
    label: "软件版本 (software_version)",
    type: "text",
    prop: "software_version",
    placeholder: "请输入软件版本",
  },
  {
    label: "是否智能机顶盒 (is_smart_stb)",
    type: "select",
    prop: "is_smart_stb",
    placeholder: "请选择是否为智能机顶盒",
    options: [
      { label: "是", value: true },
      { label: "否", value: false },
    ],
  },
  {
    label: "桌面ID (desktop_id)",
    type: "text",
    prop: "desktop_id",
    placeholder: "请输入桌面ID",
  },
  {
    label: "机顶盒制造商 (stb_maker)",
    type: "text",
    prop: "stb_maker",
    placeholder: "请输入机顶盒制造商",
  },
  {
    label: "VIP状态 (vip)",
    type: "text",
    prop: "vip",
    placeholder: "请输入VIP状态",
  },
];
// 表单验证规则
const defaultAuthFormRules = {
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
const defaultAuthFormRef = ref(null);
const isEdit = ref(false);

// 获取数据
const saveDefaultAuthLoading = ref(false);
const getDataUrl = "/defaultServerAuth";
const getData = async () => {
  saveDefaultAuthLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
    if (res.code == 200) {
      // 赋值
      defaultAuthForm.value = { ...res.data };
      oldDefaultAuthData.value = { ...res.data };
    } else {
      ElMessage.error(res.msg || "获取数据失败！");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    saveDefaultAuthLoading.value = false;
  }
};
// 初始化获取数据
getData();

const saveAuthConfigUrl = "/saveDefaultServerAuth";
const openEdit = () => {
  if (saveDefaultAuthLoading.value)
    return ElMessage.info("正在获取数据，请稍后！");
  isEdit.value = true;
};
const cancelEdit = () => {
  if (saveDefaultAuthLoading.value) return;
  // 取消表单验证
  defaultAuthFormRef.value.clearValidate();
  defaultAuthForm.value = { ...oldDefaultAuthData.value };
  isEdit.value = false;
};
const saveAuthConfig = () => {
  defaultAuthFormRef.value.validate(async (valid) => {
    if (valid) {
      const s =
        JSON.stringify(defaultAuthForm.value) ===
        JSON.stringify(oldDefaultAuthData.value);
      if (s) return ElMessage.info("未做任何修改！");
      // 发送请求
      saveDefaultAuthLoading.value = true;
      const params = { ...defaultAuthForm.value };
      try {
        // const { data: res1 } = await axios.put(saveAuthConfigUrl, params);
        const res = await request.get(saveAuthConfigUrl, {
          params,
        });
        if (res.code == 200) {
          isEdit.value = false;
          ElNotification.success({
            title: "保存配置成功！",
            showClose: false,
          });
          // 保存成功后重新获取数据
          await getData();
        } else {
          ElMessage.error(res.msg);
        }
      } catch (error) {
        ElMessage.error(error.msg);
        console.log(error);
      } finally {
        saveDefaultAuthLoading.value = false;
      }
    }
  });
};
</script>
<template>
  <el-alert
    title="设置系统默认使用的认证数据，当没有匹配区域认证时将使用此配置。"
    type="primary"
    show-icon
    :closable="false"
  />
  <div class="default-auth">
    <div class="header">
      <span class="title hidden-xs-only"
        ><el-icon :size="20"><Lock /></el-icon><span>默认认证数据</span></span
      >
      <!-- 保存配置按钮 -->
      <div class="btn-wrap">
        <el-button v-if="!isEdit" type="primary" size="large" @click="openEdit">
          <template #icon>
            <el-icon>
              <Edit />
            </el-icon>
          </template>
          编辑默认认证
        </el-button>
        <el-button
          v-if="isEdit"
          type="danger"
          size="large"
          @click="cancelEdit"
          :disabled="saveDefaultAuthLoading"
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
          @click="saveAuthConfig"
          :loading="saveDefaultAuthLoading"
        >
          <template #icon>
            <el-icon>
              <Check />
            </el-icon>
          </template>
          保存配置
        </el-button>
      </div>
    </div>
    <div class="content">
      <el-form
        label-position="top"
        label-width="auto"
        :model="defaultAuthForm"
        :rules="defaultAuthFormRules"
        ref="defaultAuthFormRef"
      >
        <el-row :gutter="20">
          <!-- form area_name -->
          <el-col
            :xs="24"
            :span="item.prop == 'area_name' ? 24 : 12"
            v-for="item in formItem"
            :key="item.prop"
          >
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- 根据类型渲染input或者select -->
              <el-input
                v-if="item.type === 'text'"
                v-model="defaultAuthForm[item.prop]"
                size="large"
                :placeholder="item.placeholder"
                :disabled="!isEdit"
                type="text"
              />
              <el-input
                v-if="item.type === 'number'"
                v-model.number="defaultAuthForm[item.prop]"
                size="large"
                :placeholder="item.placeholder"
                :disabled="!isEdit"
                type="number"
                min="0"
              />
              <!-- 根据类型渲染input或者select -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="defaultAuthForm[item.prop]"
                placeholder="请选择"
                size="large"
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
  </div>
</template>
<style lang="less" scoped>
.default-auth {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title {
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 4px;
        color: var(--el-color-primary-dark-2);
      }

      span {
        font-size: 20px;
        color: #333;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .btn-wrap {
      width: 100%;
      display: flex;
      gap: 10px;
      flex-direction: column;

      .el-button {
        margin: 0;
        width: 100%;
      }
    }
  }
}
</style>