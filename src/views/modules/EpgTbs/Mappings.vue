<script setup>
import { ref } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

// #region 获取数据
// 表格数据
const tableData = ref([]);
const tableDataLoading = ref(false);
const querySearch = ref("");
const querySelect = ref("area_name");
const mappingSelectOptions = [
  {
    value: "area_name",
    label: "区域名称",
  },
  {
    value: "channel_id",
    label: "频道标识号",
  },
];
// 获取表格数据
const getDataUrl = "/mappings";
const getData = async () => {
  const params = {
    dondition: querySelect.value,
    value: querySearch.value,
  };
  tableDataLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl, { params });
    const res = await request.get(getDataUrl, { params });
    if (res.code == 200) {
      tableData.value = res.data;
      querySearch.value = "";
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    tableDataLoading.value = false;
  }
};
// 初始化获取数据
getData();
// #endregion

// #region 编辑和添加频道
// 编辑和保存
const saveMappingDialog = ref(false);
const saveMappingLoading = ref(false);
const isEdit = ref(false);
const saveMappingAddUrl = "/addMappings";
const saveMappingEditUrl = "/editMappings";
let saveMappingUrl = "";
const saveMappingForm = ref({
  channel_id: "",
  area_name: "",
});
const saveMappingFormRef = ref(null);
const emptyAuthDialogForm = { ...saveMappingForm.value };
const saveMappingFormRules = {
  channel_id: [{ required: true, message: "请输入频道ID", trigger: "blur" }],
  area_name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
};

const openSaveMappingDialog = (status, row) => {
  if (saveMappingLoading.value) return ElMessage.info("正在处理中，请稍后重试");
  saveMappingDialog.value = true;
  // 取消表单验证提示
  if (saveMappingFormRef.value) saveMappingFormRef.value.clearValidate();
  if (status === "add") {
    isEdit.value = false;
    saveMappingUrl = saveMappingAddUrl;
    saveMappingForm.value = { ...emptyAuthDialogForm };
  } else if (status === "edit") {
    isEdit.value = true;
    saveMappingUrl = saveMappingEditUrl;
    saveMappingForm.value = { ...row };
  }
};
// 发送请求
const saveMapping = () => {
  saveMappingFormRef.value.validate(async (valid) => {
    if (valid) {
      let params = {};
      if (isEdit.value) {
        params = {
          id: saveMappingForm.value.id,
          data: {
            channel_id: saveMappingForm.value.channel_id,
            area_name: saveMappingForm.value.area_name,
          },
        };
      } else {
        params = {
          channel_id: saveMappingForm.value.channel_id,
          area_name: saveMappingForm.value.area_name,
        };
      }
      saveMappingLoading.value = true;
      try {
        // const { data: res1 } = await axios.post(saveMappingUrl, params);
        const res = await request.get(saveMappingUrl, { params });
        if (res.code == 200) {
          saveMappingDialog.value = false;
          // 侧弹窗提示
          ElNotification.success({
            title: isEdit.value ? "编辑成功！" : "添加成功！",
            showClose: false,
          });
          await getData();
        } else {
          ElMessage.error(res.msg || "保存失败");
        }
      } catch (error) {
        ElMessage.error(error.msg || "请求失败！");
        console.log(error);
      } finally {
        saveMappingLoading.value = false;
      }
    }
  });
};
// #endregion

// #region 删除区域映射
// 删除对话框
const deleteMappingDialog = ref(false);
const deleteMappingDialogLoading = ref(false);
const deleteMappingRow = ref({});
const deleteMappingUrl = "/deleteMappings";
const openDeleteMappingDialog = (row) => {
  if (deleteMappingDialogLoading.value)
    return ElMessage.info("正在处理中，请稍后重试");
  deleteMappingRow.value = { ...row };
  deleteMappingDialog.value = true;
};
const deleteMapping = async () => {
  const params = {
    channel_id: deleteMappingRow.value.channel_id,
  };
  deleteMappingDialogLoading.value = true;
  try {
    // const { data: res1 } = await axios.delete(deleteMappingUrl, { params });
    const res = await request.get(deleteMappingUrl, { params });
    if (res.code == 200) {
      deleteMappingDialog.value = false;
      ElNotification.success({
        title: "删除成功！",
        showClose: false,
      });
      await getData();
    } else {
      ElMessage.error(res.msg || "删除失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求失败！");
    console.log(error);
  } finally {
    deleteMappingDialogLoading.value = false;
  }
};
// #endregion
</script>
<template>
  <el-alert
    title="配置频道与区域的对应关系，用于确定使用哪个区域的EPG数据"
    type="primary"
    show-icon
    :closable="false"
  />
  <!-- 内容区域 -->
  <div class="channel-mapping">
    <div class="header">
      <span class="title hidden-xs-only"
        ><el-icon :size="20"><Aim /></el-icon><span>频道区域映射</span></span
      >
      <!-- 保存配置按钮 -->
      <div class="btn-wrap">
        <el-button
          type="primary"
          size="large"
          @click="openSaveMappingDialog('add')"
        >
          <template #icon>
            <el-icon><Plus /></el-icon>
          </template>
          添加频道映射
        </el-button>
      </div>
    </div>
    <!-- 搜索框-搜索条件 -->
    <el-row :gutter="10">
      <el-col :xs="24" :span="12" class="select">
        <span>搜索条件：</span>
        <el-select
          v-model="querySelect"
          placeholder="Select"
          size="large"
          @change="getData"
        >
          <el-option
            v-for="item in mappingSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :span="12"
        ><el-input size="large" placeholder="搜索区域" v-model="querySearch">
          <template #append>
            <el-button @click="getData">
              <el-icon><Search /></el-icon>
            </el-button>
          </template> </el-input
      ></el-col>
    </el-row>
    <!-- 表格区域 -->
    <div class="content">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        header-row-class-name="table-header"
        v-loading="tableDataLoading"
      >
        <el-table-column label="#" type="index" width="40" />
        <el-table-column prop="channel_id" label="频道ID" />
        <el-table-column
          prop="area_name"
          label="区域名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="name" label="操作" width="120">
          <template #default="{ row }">
            <div class="tools-bar">
              <el-button-group>
                <el-button
                  type="primary"
                  @click="openSaveMappingDialog('edit', row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" @click="openDeleteMappingDialog(row)"
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
  <!-- 编辑和添加对话框 -->
  <el-dialog
    v-model="saveMappingDialog"
    title="Tips"
    width="500"
    align-center
    class="my-dialog primary"
  >
    <template #header>
      <div class="dialog-title">
        <el-icon :size="20"><Aim /></el-icon
        ><span>{{ isEdit ? "编辑" : "添加" }}频道映射</span>
      </div>
    </template>
    <!-- 表单 -->
    <el-form
      :model="saveMappingForm"
      :rules="saveMappingFormRules"
      label-position="top"
      ref="saveMappingFormRef"
    >
      <el-form-item prop="channel_id" label="频道ID">
        <el-input
          v-model="saveMappingForm.channel_id"
          placeholder="请输入频道ID"
          size="large"
        />
      </el-form-item>
      <el-form-item prop="area_name" label="区域名称">
        <el-input
          v-model="saveMappingForm.area_name"
          placeholder="请输入区域名称"
          size="large"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="saveMappingDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="saveMapping"
          :loading="saveMappingLoading"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 删除对话框 -->
  <el-dialog
    v-model="deleteMappingDialog"
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
    确定要删除"{{ deleteMappingRow.area_name }}"区域映射吗？此操作不可恢复。
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteMappingDialog = false">取消</el-button>
        <el-button
          type="danger"
          @click="deleteMapping"
          :loading="deleteMappingDialogLoading"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped>
// channelMapping
.channel-mapping {
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
  // 搜索参数
  .el-row {
    margin-top: 10px;
    .el-col {
      margin-bottom: 10px;
    }
    .select {
      display: flex;
      align-items: center;
      > span {
        flex: 1 0 80px;
        color: #495057;
      }
    }
  }
  // 表格
  .content {
    margin: 0;
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
</style>