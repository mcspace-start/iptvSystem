<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

// #region 获取表格数据
// 表格数据
const tableData = ref([]);
const tableDataLoading = ref(false);
// 用于查看表格溢出内容
const showDetail = (title, val) => {
  // messageBox
  ElMessageBox.alert(val, title + "：");
};
// 获取表格数据
const getTableDataUrl = "/regionAuth";
const getData = async () => {
  tableDataLoading.value = true;
  try {
    // const {data:res1} = await axios.get(getTableDataUrl)
    const res = await request.get(getTableDataUrl);
    if (res.code == 200) {
      tableData.value = res.data;
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    tableDataLoading.value = false;
  }
};
// 第一次初始化数据
getData();
// #endregion

// #region 搜索
const searchValue = ref("");
const searchUrl = "/regionAuthSearch";
const search = async () => {
  tableDataLoading.value = true;
  const params = { name: searchValue.value };
  try {
    // const { data: res1 } = await axios.get(searchUrl, { params });
    const res = await request.get(searchUrl, {
      params,
    });
    if (res.code == 200) {
      tableData.value = res.data;
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    tableDataLoading.value = false;
  }
};
// #endregion

// #region 编辑和添加区域
// 编辑和添加对话框
const editAuthDialog = ref(false);
const saveAuthDialogLoading = ref(false);
const isEdit = ref(false); // add || edit
const editAuthUrl = "/editRegionAuth"; // editRegionAuth addRegionAuth
const addAuthUrl = "/addRegionAuth";
let editAuthId = 0; // 编辑时修改
let saveAuthUrl = ""; // 动态修改
const saveAuthDialogFormRef = ref(null);
const saveAuthDialogForm = ref({
  area_name: "",
  user_id: "",
  lang: "",
  support_hd: "",
  net_user_id: "",
  dhcp_user_id: "",
  authenticator: "",
  stb_type: "",
  stb_version: "",
  conn_type: "",
  stb_id: "",
  template_name: "",
  area_id: "",
  user_token: "",
  user_group_id: "",
  product_package_id: "",
  mac: "",
  user_field: "",
  software_version: "",
  desktop_id: "",
  is_smart_stb: false,
  stb_maker: "",
  vip: "",
});
const oldSaveAuthDialogForm = ref({});
const emptyAuthDialogForm = { ...saveAuthDialogForm.value };
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
const saveAuthDialogFormRules = {
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
// 自动识别
const textarea = ref("");
const autoFillInputPlaceholder =
  "user_id=02088888888&lang=zh-CN&stb_type=1&dhcp_user_id=99&area_name...";

// 自动识别内容事件
const autoDetect = () => {
  if (!textarea.value.trim() === "") {
    textarea.value = "";
    return;
  }
  // 将字符串按&分割成键值对数组
  const pairs = textarea.value.split("&");
  // 遍历键名和值
  for (const pair of pairs) {
    // 将每个键值对按=分割
    const [key, value] = pair.split("=");
    // 检查 formDataReactive 是否有对应的属性
    if (saveAuthDialogForm.value.hasOwnProperty(key)) {
      // 如果有该属性，则赋值
      saveAuthDialogForm.value[key] = value || "";
    }
  }
};

// 打开编辑对话框
const openSaveAuthDialog = (type, row) => {
  if (tableDataLoading.value) return ElMessage.info("正在加载数据，请稍后操作");
  if (type === "edit") {
    isEdit.value = true;
    editAuthId = row.id;
    saveAuthUrl = editAuthUrl;
    saveAuthDialogForm.value = { ...row };
    oldSaveAuthDialogForm.value = { ...row };
  } else if (type === "add") {
    isEdit.value = false;
    saveAuthUrl = addAuthUrl;
    // 重置表单
    saveAuthDialogForm.value = { ...emptyAuthDialogForm };
  }
  // 取消表单验证
  if (saveAuthDialogFormRef.value) saveAuthDialogFormRef.value.clearValidate();
  editAuthDialog.value = true;
};

const saveAuthDialog = () => {
  let params = {};
  if (isEdit.value) {
    // edit
    params = {
      id: editAuthId,
      data: saveAuthDialogForm.value,
    };
  } else {
    // add
    params = saveAuthDialogForm.value;
  }
  // 验证表单
  saveAuthDialogFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求
      const s =
        JSON.stringify(saveAuthDialogForm.value) ===
        JSON.stringify(oldSaveAuthDialogForm.value);
      if (s) return ElMessage.info("未修改任何内容");

      saveAuthDialogLoading.value = true;
      try {
        // const { data: res1 } = await axios.put(saveAuthUrl, params);
        const res = await request.get(saveAuthUrl, { params });
        if (res.code == 200) {
          editAuthDialog.value = false;
          ElNotification.success({
            title: isEdit.value ? "编辑配置成功!" : "添加配置成功!",
            showClose: false,
          });
          // 重新获取数据
          await getData();
          // 清空搜索值
          searchValue.value = "";
        } else {
          ElMessage.error(res.msg || "编辑失败");
        }
      } catch (error) {
        ElMessage.error(error.msg || "请求错误！");
        console.log(error);
      } finally {
        saveAuthDialogLoading.value = false;
      }
    }
  });
};
// #endregion

// #region 删除区域认证
// 删除对话框
const deleteAuthDialog = ref(false);
const deleteAuthDialogLoading = ref(false);
const deleteAuthUrl = "/deleteRegionAuth";
const deleteAuthName = ref("");
const deleteAuthParams = {
  id: 0,
  name: "",
};
const openDeleteAuthDialog = (row) => {
  if (deleteAuthDialogLoading.value)
    return ElMessage.info("正在删除中，请稍后");
  deleteAuthDialog.value = true;
  deleteAuthName.value = row.area_name;
  deleteAuthParams.id = row.id;
  deleteAuthParams.name = row.area_name;
};
const deleteAuth = async () => {
  deleteAuthDialogLoading.value = true;
  const params = deleteAuthParams;
  try {
    // const { data: res1 } = await axios.delete(deleteAuthUrl, { params });
    const res = await request.get(deleteAuthUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: "删除成功!",
        showClose: false,
      });
      deleteAuthDialog.value = false;
      // 重新获取数据
      await getData();
      // 清空搜索值
      searchValue.value = "";
    } else {
      ElMessage.error(res.msg || "删除失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteAuthDialogLoading.value = false;
  }
};
// #endregion
</script>
<template>
  <el-alert
    title="管理不同区域的IPTV认证数据，可以为每个区域配置特定的认证信息。"
    type="primary"
    show-icon
    :closable="false"
  />
  <!-- 内容区域 -->
  <div class="region-auth">
    <div class="header">
      <span class="title hidden-xs-only"
        ><el-icon :size="20"><Location /></el-icon>
        <span>区域认证数据</span></span
      >
      <!-- 保存配置按钮 -->
      <div class="btn-wrap">
        <el-button
          type="primary"
          size="large"
          @click="openSaveAuthDialog('add')"
        >
          <template #icon>
            <el-icon><Plus /></el-icon>
          </template>
          添加区域认证
        </el-button>
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="search">
      <el-input
        size="large"
        placeholder="搜索区域"
        v-model="searchValue"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="search">搜索</el-button>
        </template>
      </el-input>
    </div>
    <!-- 表格区域 -->
    <div class="content">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        header-row-class-name="table-header"
        v-loading="tableDataLoading"
      >
        <el-table-column label="#" type="index" width="50" />
        <el-table-column
          prop="area_name"
          label="区域名称"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="user_id"
          label="用户ID"
          min-width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="stb_id"
          label="机顶盒ID"
          min-width="140"
          show-overflow-tooltip
          :tooltip-formatter="() => '点击查看详情'"
        >
          <template #default="{ row }">
            <span @click="showDetail('机顶盒ID', row.stb_id)">
              {{ row.stb_id }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="authenticator"
          label="认证码"
          min-width="120"
          show-overflow-tooltip
          :tooltip-formatter="() => '点击查看详情'"
        >
          <template #default="{ row }">
            <span @click="showDetail('认证码', row.authenticator)">
              {{ row.authenticator }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template #default="{ row }">
            <div class="tools-bar">
              <el-button-group>
                <el-button
                  type="primary"
                  @click="openSaveAuthDialog('edit', row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <!-- 操作 -->
                <el-button @click="openDeleteAuthDialog(row)" type="danger"
                  ><el-icon><Delete /></el-icon
                ></el-button>
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
  <!-- dialog -->
  <!-- 编辑和添加对话框 -->
  <el-dialog
    v-model="editAuthDialog"
    title="Tips"
    width="700"
    align-center
    class="my-dialog primary dialog-max-height"
  >
    <template #header>
      <div class="dialog-title">
        <el-icon :size="20"><Location /></el-icon
        ><span>{{ isEdit ? "编辑" : "添加" }}区域认证</span>
      </div>
    </template>
    <div class="edit-auth-dialog-content">
      <!-- 自动识别 -->
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
          <span>
            将完整的认证字符串粘贴到上方文本框，然后点击"自动识别"按钮自动填充下方表单</span
          >
        </p>
      </div>
      <!-- 分割线 -->
      <el-divider />
      <!-- 表单 -->
      <el-form
        label-position="top"
        label-width="auto"
        ref="saveAuthDialogFormRef"
        :rules="saveAuthDialogFormRules"
        :model="saveAuthDialogForm"
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
                v-model="saveAuthDialogForm[item.prop]"
                size="large"
                :placeholder="item.placeholder"
                type="text"
              />
              <el-input
                v-if="item.type === 'number'"
                v-model.number="saveAuthDialogForm[item.prop]"
                size="large"
                :placeholder="item.placeholder"
                type="number"
                min="0"
              />
              <!-- 根据类型渲染input或者select -->

              <el-select
                v-if="item.type === 'select'"
                v-model="saveAuthDialogForm[item.prop]"
                placeholder="请选择"
                size="large"
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editAuthDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="saveAuthDialog"
          :loading="saveAuthDialogLoading"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 删除对话框 -->
  <el-dialog
    v-model="deleteAuthDialog"
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
    确定要删除"{{ deleteAuthName }}"EPG认证数据吗？此操作不可恢复。
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteAuthDialog = false">取消</el-button>
        <el-button
          type="danger"
          @click="deleteAuth"
          :loading="deleteAuthDialogLoading"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
// 默认认证
.region-auth {
  .search {
    margin: 10px 0;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .content {
    .table-header {
      color: #222;
      th {
        border-bottom: 2px solid #333;
      }
      .cell {
        font-weight: bold;
      }
    }
  }
}

// dialog
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
</style>