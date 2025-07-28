<script setup>
import { ref, watchEffect } from "vue";
import { useWindowWidth } from "@/hook/useWindowWidth";
import axios from "@/api/axiosConfig";
import request from "@/api/request";
// #region 渲染列表和分页配置
// 更新类型
const updateTypeValue = ref("all");
const updateType = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "iptv",
    label: "更新直播源",
  },
  {
    value: "static_iptv",
    label: "静态更新直播源",
  },
  {
    value: "epg",
    label: "更新EPG",
  },
  {
    value: "tvb",
    label: "更新TVB直播源",
  },
];
// 更新状态
const updateStatusValue = ref("all");
const updateStatus = [
  { value: "all", label: "全部" },
  {
    value: "success",
    label: "成功",
  },
  {
    value: "failed",
    label: "失败",
  },
  {
    value: "pending",
    label: "进行中",
  },
];
// 分页配置
const paginationOptions = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  layout: "total, sizes, prev, pager, next, jumper",
});
const isXs = useWindowWidth("xs");
watchEffect(() => {
  if (isXs.value) {
    paginationOptions.value.layout = "pager";
  } else {
    paginationOptions.value.layout = "total, sizes, prev, pager, next, jumper";
  }
});
// 旧配置 用于回退分页配置
const oldPaginationOptions = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
// 分页事件
const handleSizeChange = () => {
  getData();
};
const handleCurrentChange = () => {
  getData();
};
// 时间区间
const queryRangeDate = ref({
  startTime: "",
  endTime: "",
});
// 起始日期更改时，清空结束日期
const queryStartDateChange = () => {
  queryRangeDate.value.endTime = "";
};
// querRangeDate.endTime 禁用日期
const queryEndDateDisabledDate = (time) => {
  if (!queryRangeDate.value.startTime) return true;
  if (queryRangeDate.value.startTime < time) {
    return false;
  } else {
    return true;
  }
};
// 结束日期选择时发起搜索
const queryEndDateChange = () => {
  if (queryRangeDate.value.startTime && queryRangeDate.value.endTime) {
    getData();
  }
};

// 搜索参数变化
const queryChange = () => {
  getData();
};
// #endregion

// #region 获取数据
// 表格数据
const tableData = ref([]);
const loading = ref(false);
// 状态数据
const tagStatus = (row) => {
  const typeMap = {
    success: "success",
    error: "danger",
    pending: "info",
  };
  return typeMap[row.status] || "info";
};
const tagMsg = (row) => {
  const typeMap = {
    success: "成功",
    error: "失败",
    pending: "进行中",
  };
  return typeMap[row.status] || "未知";
};
// 获取数据
const getDataUrl = "/updateLogs";
const getData = async () => {
  if (loading.value) return ElMessage.info("请等待上次请求完成");
  loading.value = true;
  const params = {
    type: updateTypeValue.value,
    status: updateStatusValue.value,
    startTime: queryRangeDate.value.startTime || "",
    endTime: queryRangeDate.value.endTime || "",
    page: paginationOptions.value.currentPage,
    size: paginationOptions.value.pageSize,
  };
  try {
    // const { data: res1 } = await axios.get(getDataUrl, { params });
    const res = await request.get(getDataUrl, { params });
    if (res.code == 200) {
      // 同步分页配置
      paginationOptions.value.total = res.data.total;
      oldPaginationOptions.value = { ...paginationOptions.value };
      // 赋值
      tableData.value = res.data.logs;
    } else {
      ElMessage.error(res.msg);
      // 同步分页配置
      paginationOptions.value = { ...oldPaginationOptions.value };
    }
  } catch (error) {
    // 同步分页配置
    paginationOptions.value = { ...oldPaginationOptions.value };
    ElMessage.error(error.msg);
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 第一次获取数据 初始化
getData();
// 格式化
const formattedDate = (time) => {
  if (!time) return "YYYY-MM-DD HH:mm:ss";
  // 返回格式化时间 YYYY-MM-DD HH:mm:ss
  const t = new Date(time);
  const year = t.getFullYear();
  const month = String(t.getMonth() + 1).padStart(2, "0");
  const date = String(t.getDate()).padStart(2, "0");
  const hour = String(t.getHours()).padStart(2, "0");
  const minute = String(t.getMinutes()).padStart(2, "0");
  const second = String(t.getSeconds()).padStart(2, "0");
  const timeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  return timeStr;
};
// 重置搜索参数
const resetSearch = () => {
  if (loading.value) return;
  //判断是否为默认值如果是默认值则return
  queryRangeDate.value = {
    startTime: "",
    endTime: "",
  };
  updateTypeValue.value = "all";
  updateStatusValue.value = "all";
  tableData.value = [];
  // 重置分页配置
  paginationOptions.value = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };
  oldPaginationOptions.value = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };
  getData();
};
// #endregion

// #region 删除旧日志
// 删除旧日志
const deleteLogDialog = ref(false);
const deleteLogDialogLoading = ref(false);
const deleteLogsUrl = "/deletelogs";
const days = ref(30);
const openDeleteLogDialog = () => {
  deleteLogDialog.value = true;
  days.value = 30;
};
const deleteLog = async () => {
  if (loading.value) return;
  deleteLogDialogLoading.value = true;
  const params = {
    days: days.value,
  };
  try {
    // const {data:res1} = await axios.delete(deleteLogsUrl,{ params});
    const res = await request.get(deleteLogsUrl, {
      params,
    });
    if (res.code === 200) {
      ElNotification.success({
        title: "删除日志成功！",
        showClose: false,
      });
      deleteLogDialog.value = false;
      // 重新获取数据
      getData();
    } else {
      ElMessage.error(res.msg);
      ElNotification.error({
        title: "删除日志失败！",
        showClose: false,
      });
    }
  } catch (error) {
    ElMessage.error(error.msg || "删除日志失败！");
    console.log(error);
  } finally {
    deleteLogDialogLoading.value = false;
  }
};
// #endregion

// #region 按区间删除日志
// 按区间删除日志
const deleteRangeLogDialog = ref(false);
const deleteRangeTime = ref({
  startTime: "",
  endTime: "",
});
const deleteRangeLogDialogLoading = ref(false);
const deleteRangeLogsUrl = "/deleteRangelogs";

const openDeleteRangeLogDialog = () => {
  deleteRangeLogDialog.value = true;
  deleteRangeTime.value.startTime = "";
  deleteRangeTime.value.endTime = "";
};
// 禁用日期选择规则，必须大于第一天
const disabledDate = (endTime) => {
  // 如果没有选择，则全部禁止
  if (deleteRangeTime.value.startTime) {
    // 如果开始时间存在，则结束时间必须大于或等于开始时间
    return endTime < deleteRangeTime.value.startTime;
  } else {
    return true;
  }
};
const deleteRangeLog = async () => {
  if (loading.value) return;
  if (!deleteRangeTime.value.startTime || !deleteRangeTime.value.endTime) {
    return ElMessage.info("请选择日期范围！");
  }
  deleteRangeLogDialogLoading.value = true;
  const params = {
    starTime: deleteRangeTime.value.startTime.getTime(),
    endTime: deleteRangeTime.value.endTime.getTime(),
  };
  try {
    // const { data: res1 } = axios.delete(deleteRangeLogsUrl, { params });
    const res = await request.get(deleteRangeLogsUrl, {
      params,
    });
    if (res.code === 200) {
      ElNotification.success({
        title: "删除日志成功！",
        showClose: false,
      });
      deleteRangeLogDialog.value = false;
      // 重新获取数据
      await getData();
    } else {
      ElMessage.error(res.msg);
      ElNotification.error({
        title: "删除日志失败！",
        showClose: false,
      });
    }
  } catch (error) {
    ElMessage.error(error.msg);
    console.log(error);
  } finally {
    deleteRangeLogDialogLoading.value = false;
  }
};
// #endregion

// #region 查看日志详情
// 查看日志详情
const logDetailDialog = ref(false);
const logDetailDialogLoading = ref(false);
const logDataRow = ref({});
const deleteLogByIdUrl = "/deletelog";
// 打开删除
const openLogDetailDialog = (row) => {
  logDetailDialog.value = true;
  logDataRow.value = row;
};
// 删除单个日志
const deleteLogById = () => {
  if (loading.value) return;
  ElMessageBox.confirm("确定删除该日志吗?", "删除确认", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "error",
    confirmButtonClass: "el-button--danger",
  })
    .then(async () => {
      logDetailDialogLoading.value = true;
      const params = {
        id: logDataRow.value.id,
      };
      try {
        // const { data: res1 } = await axios.delete(deleteLogByIdUrl, { params });
        const res = await request.get(deleteLogByIdUrl, {
          params,
        });
        if (res.code === 200) {
          ElNotification.success({
            title: "删除日志成功！",
            showClose: false,
          });
          logDetailDialog.value = false;
          // 重新获取数据
          await getData();
        } else {
          ElMessage.error(res.msg);
          ElNotification.error({
            title: "删除日志失败！",
            showClose: false,
          });
        }
      } catch (error) {
        ElMessage.error(error.msg || "删除日志失败！");
        console.log(error);
      } finally {
        logDetailDialogLoading.value = false;
      }
    })
    .catch(() => {});
};
// #endregion
</script>

<template>
  <main class="update-logs">
    <el-card>
      <el-row :gutter="20" class="main-header">
        <el-col :xs="24" :sm="12" :md="6"
          ><p class="title">更新类型：</p>
          <el-select
            v-model="updateTypeValue"
            placeholder="Select"
            size="large"
            @change="queryChange"
          >
            <el-option
              v-for="item in updateType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6"
          ><p class="title">更新状态：</p>
          <el-select
            v-model="updateStatusValue"
            placeholder="Select"
            size="large"
            @change="queryChange"
          >
            <el-option
              v-for="item in updateStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <p class="title">起始日期：</p>
          <el-date-picker
            v-model="queryRangeDate.startTime"
            type="date"
            placeholder="选择日期"
            size="large"
            style="width: 100%"
            @change="queryStartDateChange"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <p class="title">结束日期：</p>
          <el-date-picker
            v-model="queryRangeDate.endTime"
            type="date"
            placeholder="选择日期"
            size="large"
            style="width: 100%"
            :disabled="!queryRangeDate.startTime"
            :disabled-date="queryEndDateDisabledDate"
            @change="queryEndDateChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 更新日志列表 -->
    <el-card
      class="update-logs-list"
      :body-style="{
        padding: 0,
      }"
    >
      <template #header>
        <div class="card-header">
          <span class="title hidden-xs-only">更新日志列表</span>
          <div class="tool-bar">
            <el-button type="info" size="large" plain @click="resetSearch">
              <template #icon>
                <el-icon><Refresh /></el-icon>
              </template>
              重置筛选条件</el-button
            >
            <el-button
              type="danger"
              size="large"
              plain
              @click="openDeleteRangeLogDialog"
              ><template #icon
                ><el-icon><Calendar /></el-icon></template
              >按日期删除日志</el-button
            >
            <el-button
              type="danger"
              size="large"
              plain
              @click="openDeleteLogDialog"
              ><template #icon
                ><el-icon><Delete /></el-icon
              ></template>
              清理旧日志</el-button
            >
          </div>
        </div>
      </template>
      <!-- 内容区域 -->
      <div class="card-body">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" min-width="60" />
          <el-table-column
            prop="update_type"
            label="更新类型"
            min-width="120"
          />
          <el-table-column align="center" prop="status" label="状态" width="90">
            <template #default="{ row }">
              <!-- success info danger -->
              <el-tag :type="tagStatus(row)" size="large">
                {{ tagMsg(row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" min-width="220">
            <template #default="{ row }">
              {{ formattedDate(row.start_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="耗时(秒)" width="80" />
          <el-table-column
            prop="created_by"
            label="操作人"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" plain @click="openLogDetailDialog(row)">
                <el-icon class="icon-eye"><View /></el-icon>
                查看</el-button
              >
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
      <template #footer>
        <el-pagination
          background
          v-model:current-page="paginationOptions.currentPage"
          v-model:page-size="paginationOptions.pageSize"
          :page-sizes="[10, 20, 30]"
          :layout="paginationOptions.layout"
          :total="paginationOptions.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
        ></el-pagination>
      </template>
    </el-card>
    <!-- 删除旧日志-按天数保留 -->
    <el-dialog
      v-model="deleteLogDialog"
      title="Tips"
      align-center
      class="my-dialog danger"
      width="500"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Warning /></el-icon><span>清理旧日志</span>
        </div>
      </template>
      <div class="dialog-content">
        <p>您可以清理指定天数前的日志记录以节省存储空间。</p>
        <p class="label">保留最近天数的日志:</p>
        <el-input
          size="large"
          type="number"
          v-model="days"
          placeholder="请输入天数"
          min="1"
          max="365"
        ></el-input>
        <p class="desc">
          设置为30表示保留最近30天的日志，删除30天前的所有日志。
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteLogDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteLog"
            :loading="deleteLogDialogLoading"
            >确认清理</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 删除日志-按日期区间 -->
    <el-dialog
      v-model="deleteRangeLogDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog danger"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Warning /></el-icon
          ><span>按日期范围删除日志</span>
        </div>
      </template>
      <div class="dialog-content">
        <el-alert type="warning" :closable="false">
          警告: 此操作将删除指定日期范围内的所有日志记录，且不可恢复。</el-alert
        >
        <p class="label">开始日期:</p>
        <el-date-picker
          v-model="deleteRangeTime.startTime"
          type="date"
          placeholder="年/月/日"
          size="large"
          style="width: 100%"
          :popper-options="popperOptions"
        />
        <p class="label">结束日期:</p>
        <el-date-picker
          v-model="deleteRangeTime.endTime"
          type="date"
          placeholder="年/月/日"
          size="large"
          style="width: 100%"
          placement="top"
          :disabled="!deleteRangeTime.startTime"
          :disabled-date="disabledDate"
        />
        <p class="desc">将删除从开始日期到结束日期期间（含）的所有日志记录。</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteRangeLogDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteRangeLog"
            :loading="deleteRangeLogDialogLoading"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 日志详情 -->
    <el-dialog
      v-model="logDetailDialog"
      title="Tips"
      align-center
      class="my-dialog primary dialog-max-height"
      width="70%"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Warning /></el-icon
          ><span>更新日志详情(ID:{{ logDataRow.id }})</span>
        </div>
      </template>
      <div class="dialog-content">
        <!-- info -->
        <div class="info">
          <el-row :gutter="20">
            <el-col :xs="24" :span="12">
              <p class="info-label">更新类型:</p>
              <el-input readonly :value="logDataRow.update_type"></el-input>
            </el-col>
            <el-col :xs="24" :span="12">
              <p class="info-label">开始时间:</p>
              <el-input
                readonly
                :value="formattedDate(logDataRow.start_time)"
              ></el-input>
            </el-col>
            <el-col :xs="24" :span="12">
              <p class="info-label">状态:</p>
              <el-input readonly :value="tagMsg(logDataRow)"></el-input>
            </el-col>
            <el-col :xs="24" :span="12">
              <p class="info-label">结束时间:</p>
              <el-input
                readonly
                :value="formattedDate(logDataRow.end_time)"
              ></el-input>
            </el-col>
            <el-col :xs="24" :span="12">
              <p class="info-label">操作人:</p>
              <el-input readonly :value="logDataRow.created_by"></el-input>
            </el-col>
            <el-col :xs="24" :span="12">
              <p class="info-label">耗时:</p>
              <el-input readonly :value="logDataRow.duration + '秒'"></el-input>
            </el-col>
          </el-row>
        </div>

        <div class="print">
          <p class="print-title">日志内容:</p>
          <div class="print-logs">
            <p
              class="log-text"
              v-for="(log, index) in logDataRow.logs"
              :key="index"
            >
              {{ log }}
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="danger"
            @click="deleteLogById"
            :loading="logDetailDialogLoading"
          >
            删除
          </el-button>
          <el-button type="primary" @click="logDetailDialog = false"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>
  </main>
</template>
<style lang="less" scoped>
main.update-logs {
  .main-header {
    .title {
      font-size: 14px;
      margin-bottom: 4px;
      color: rgb(61, 61, 61);
    }
    .el-col {
      margin-bottom: 10px;
    }
  }
  // 更新日志列表
  .update-logs-list {
    margin-top: 20px;
    .card-header {
      display: flex;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        // 不允许文字换行
        white-space: nowrap;
        overflow: hidden;
        span {
          font-weight: bold;
        }
      }
      @media (max-width: 768px) {
        .tool-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          .el-button {
            margin: 0;
          }
        }
      }
    }
  }

  // dialog
  .dialog-title {
    display: flex;
    align-items: center;
  }
  .dialog-content {
    & > p {
      font-size: 16px;
      color: #222;
    }
    .label {
      margin: 15px 0 10px 0;
    }
    .desc {
      color: #6c757d;
      margin: 4px 0;
      font-size: 14px;
    }
    .info {
      font-size: 16px;
      color: red;
      .info-label {
        color: #222;
        margin-bottom: 4px;
      }
      .el-col {
        margin-bottom: 10px;
      }
    }
    .print {
      margin-top: 10px;
      .print-title {
        font-size: 16px;
        color: #222;
      }
      .print-logs {
        margin-top: 8px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        background: #f8f9fa;
        min-height: 100px;
        max-height: 250px;
        overflow-y: scroll;
        padding: 15px;
        .log-text {
          color: #222;
        }
      }
    }
  }
}
</style>