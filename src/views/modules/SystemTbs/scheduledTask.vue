<script setup>
import { ref, computed } from "vue";
import axios from "@/api/axiosConfig";
import request from "@/api/request";

// #region 获取数据
// 表格数据
const tableData = ref([]);
const tableDataLoading = ref(false);
// 获取表格数据
const getDataUrl = "/scheduledTasks";
const getData = async () => {
  tableDataLoading.value = true;
  try {
    // const { data: res1 } = await axios.get(getDataUrl);
    const res = await request.get(getDataUrl);
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
// 第一次初始化
getData();
// #endregion

// 同步到系统
const syncToSystemUrl = "/syncTask";
const syncToSystemLoading = ref(false);
const syncToSystem = async () => {
  syncToSystemLoading.value = true;
  try {
    // const { data: res1 } = await axios.put(syncToSystemUrl);
    const res = await request.get(syncToSystemUrl);
    if (res.code == 200) {
      ElNotification.success({
        title: "同步成功！",
        showClose: false,
      });
    } else {
      ElMessage.error(res.msg || "同步失败");
    }
  } catch (error) {
    syncToSystemLoading.value = false;
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    syncToSystemLoading.value = false;
  }
};

// #region 添加任务
// 添加任务
const saveTaskDialog = ref(false);
const addTaskUrl = "/addTask";
const editTaskUrl = "/alterTask";
let saveUrl = "";
const isEdit = ref(false);
const saveTaskLoading = ref(false);
const saveTaskForm = ref({
  task_name: "",
  command: "",
  enabled: 0,
  period: "daily", // hourly daily monthly weekly cron
  day: "*",
  hour: "*",
  minute: "*",
  month: "*",
  week: "*",
});
const oldSaveTaskForm = ref({});
const emptySaveTaskForm = { ...saveTaskForm.value };
const saveTaskFormRules = {
  task_name: [
    { required: true, message: "任务名称不能为空", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/,
      message: "任务名称不允许包含特殊字符",
      trigger: "blur",
    },
  ],
  command: [
    { required: true, message: "命令路径不能为空", trigger: "blur" },
    {
      pattern: /^\/?[\w\/-]+(\.\w+)?$/,
      message:
        "命令路径格式不正确，必须是路径格式，例如 /opt/iptv/scripts/python/iptv",
      trigger: "blur",
    },
  ],
  minute: [
    { required: true, message: "分钟不能为空", trigger: "blur" },
    {
      pattern: /^(\*|[0-5]?[0-9])$/,
      message: "分钟必须是0-59之间的数字，或者使用'*'",
      trigger: "blur",
    },
  ],
  hour: [
    { required: true, message: "小时不能为空", trigger: "blur" },
    {
      pattern: /^(\*|[0-1]?[0-9]|2[0-3])$/,
      message: "小时必须是0-23之间的数字，或者使用'*'",
      trigger: "blur",
    },
  ],
  day: [
    { required: true, message: "日期不能为空", trigger: "blur" },
    {
      pattern: /^(\*|[1-9]|[12][0-9]|3[01])$/,
      message: "日期必须是1-31之间的数字，或者使用'*'",
      trigger: "blur",
    },
  ],
  month: [
    { required: true, message: "月份不能为空", trigger: "blur" },
    {
      pattern: /^(\*|[1-9]|1[0-2])$/,
      message: "月份必须是1-12之间的数字，或者使用'*'",
      trigger: "blur",
    },
  ],
  week: [
    { required: true, message: "星期不能为空", trigger: "blur" },
    {
      pattern: /^(\*|[0-6])$/,
      message: "星期必须是0-6的数字 (0是星期日) 或 * 表示每周每天",
      trigger: "blur",
    },
  ],
};
const saveTaskMsg = {
  task_name: {
    label: "任务名称",
    type: "input",
    placeholder: "如：更新EPG数据",
    desc: "填写任务的名称，用于在列表中区分不同任务",
  },
  command: {
    label: "命令路径",
    type: "input",
    placeholder: "如：/opt/iptv/scripts/python/iptv",
    desc: "要执行的完整命令，例如：cd /app && node src/scripts/updateEpg.js",
  },
  period: {
    label: "周期类型",
    type: "select",
    options: [
      { label: "每小时", value: "hourly" },
      { label: "每日", value: "daily" },
      { label: "每周", value: "weekly" },
      { label: "每月", value: "monthly" },
      { label: "自定义Cron表达式", value: "cron" },
    ],
    placeholder: "选择任务执行周期",
    desc: "选择任务的执行周期",
  },
  minute: {
    label: "分",
    type: "number",
    desc: "0-59 或 * 表示每分钟",
  },
  hour: {
    label: "时",
    type: "number",
    desc: "0-23 或 * 表示每时",
  },
  day: {
    label: "日",
    type: "number",
    desc: "1-31 或 * 表示每天",
  },
  month: {
    label: "月",
    type: "number",
    desc: "1-12 或 * 表示每月",
  },
  week: {
    label: "周几",
    type: "select",
    desc: "0-6 (0是星期日) 或 * 表示每周每天",
  },
  enabled: {
    label: "启用此任务",
    type: "switch",
    desc: "启用或禁用任务",
  },
};
const saveTaskFormRef = ref(null);
// 打开添加任务弹窗
const openTaskDialog = (type, row) => {
  if (type == "add") {
    isEdit.value = false;
    saveUrl = addTaskUrl;
    // 赋值为空值
    saveTaskForm.value = { ...emptySaveTaskForm };
  } else if (type == "edit") {
    isEdit.value = true;
    saveUrl = editTaskUrl;
    // 赋值
    saveTaskForm.value = { ...row };
    // 保存旧值
    oldSaveTaskForm.value = { ...row };
  }
  // 关闭校验
  if (saveTaskFormRef.value) saveTaskFormRef.value.clearValidate();
  saveTaskDialog.value = true;
};
// 发送请求
const saveTask = () => {
  saveTaskFormRef.value.validate(async (valid) => {
    if (valid) {
      // 判断是否对值进行修改
      if (isEdit.value) {
        const s =
          JSON.stringify(saveTaskForm.value) ==
          JSON.stringify(oldSaveTaskForm.value);
        if (s) return ElMessage.info("未作出修改！");
      }
      let params = {};
      if (isEdit.value) {
        params = {
          id: saveTaskForm.value.id,
          data: saveTaskForm.value,
        };
      } else {
        params = saveTaskForm.value;
      }
      saveTaskLoading.value = true;

      // 发送请求
      try {
        // const { data: res1 } = await axios.post(saveUrl, params);
        const res = await request.get(saveUrl, { params });
        if (res.code == 200) {
          //
          saveTaskDialog.value = false;
          ElNotification.success({
            title: isEdit.value ? "修改" : "添加" + "任务成功！",
            showClose: false,
          });
          // 再次获取数据
          getData();
        } else {
          ElMessage.error(res.msg || "保存失败");
        }
      } catch (error) {
        ElMessage.error(error.msg || "请求错误！");
        console.log(error);
      } finally {
        saveTaskLoading.value = false;
      }
    }
  });
};
// #endregion

// 日期显示规则 computed
const showFields = computed(() => {
  const periodRules = {
    hourly: { minute: true },
    daily: { hour: true, minute: true },
    weekly: { hour: true, minute: true, week: true },
    monthly: { hour: true, minute: true, day: true },
    cron: { hour: true, minute: true, day: true, month: true, week: true },
  };

  return {
    minute: false,
    hour: false,
    day: false,
    month: false,
    week: false,
    ...(periodRules[saveTaskForm.value.period] || {}),
  };
});

// #region 切换任务状态
// 切换任务状态
const switchChangeTimer = ref(null);
const switchTaskUrl = "/taskToogle";
const switchChangeHandler = (row) => {
  // 防抖
  if (switchChangeTimer.value) {
    clearTimeout(switchChangeTimer.value);
  }
  switchChangeTimer.value = setTimeout(() => {
    switchTask(row);
  }, 500);
};
const switchTask = async (row) => {
  const enabled = row.enabled;
  const title = enabled == true ? "启用任务" : "禁用任务";
  const params = {
    id: row.id,
    enabled: enabled,
  };
  try {
    // const { data: res1 } = await axios.put(switchTaskUrl, params);
    const res = await request.get(switchTaskUrl, {
      params,
    });
    if (res.code == 200) {
      ElNotification.success({
        title: title + "成功！",
        showClose: false,
      });
    } else {
      ElMessage.error(res.msg || "操作失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    row.enabled = !enabled;
  }
};
// #endregion

// #region 删除任务
// 删除任务
const deleteTaskDialog = ref(false);
const deleteTaskLoading = ref(false);
const deleteTaskRow = ref("");
const deleteTaskUrl = "/deleteTask";
const openDeleteTaskDialog = (row) => {
  deleteTaskDialog.value = true;
  deleteTaskRow.value = row;
};
const deleteTask = async () => {
  deleteTaskLoading.value = true;
  const params = {
    id: deleteTaskRow.value.id,
  };
  try {
    // const { data: res1 } = await axios.delete(deleteTaskUrl, { params });
    const res = await request.get(deleteTaskUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: "删除任务成功！",
        showClose: false,
      });
      deleteTaskDialog.value = false;
      // 再次获取数据
      getData();
    } else {
      ElMessage.error(res.msg || "删除任务失败");
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteTaskLoading.value = false;
  }
};
// #endregion
</script>

<template>
  <div class="scheduled-task">
    <!-- 标题头部 -->
    <div class="header">
      <div class="title hidden-xs-only">定时任务配置</div>
      <div class="btn-wrap">
        <el-button
          type="primary"
          size="large"
          @click="syncToSystem"
          :loading="syncToSystemLoading"
        >
          <template #icon>
            <el-icon><Refresh /></el-icon>
          </template>
          同步到系统
        </el-button>
        <el-button type="success" size="large" @click="openTaskDialog('add')">
          <template #icon
            ><el-icon><Plus /></el-icon
          ></template>
          添加任务
        </el-button>
      </div>
    </div>
    <!-- 内容-表格 -->
    <div class="table-wrap">
      <el-table
        :data="tableData"
        header-row-class-name="scheduled-task-table-header"
        v-loading="tableDataLoading"
      >
        <el-table-column label="#" type="index" width="50" />
        <el-table-column
          prop="task_name"
          label="任务名称"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="time"
          label="时间表达式（分 时 日 月 周）"
          width="220"
        >
          <template #default="{ row }">
            <span class="time">
              <el-tag type="info">{{ row.minute }}</el-tag>
            </span>
            <span class="time">
              <el-tag type="info">{{ row.hour }}</el-tag>
            </span>
            <span class="time">
              <el-tag type="info">{{ row.day }}</el-tag>
            </span>
            <span class="time">
              <el-tag type="info">{{ row.month }}</el-tag>
            </span>
            <span class="time">
              <el-tag type="info">{{ row.week }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="command"
          label="命令"
          min-width="260"
          show-overflow-tooltip
        />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="switchChangeHandler(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <div class="tools-bar">
              <el-button-group>
                <el-button type="primary" @click="openTaskDialog('edit', row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" @click="openDeleteTaskDialog(row)">
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
    <!-- 描述 -->
    <el-card>
      <template #header>
        <p class="card-title">
          <el-icon :size="16"><Warning /></el-icon>
          <span>提示信息</span>
        </p>
      </template>
      <!-- 内容 -->
      <ul>
        <li>时间表达式采用标准crontab格式，依次为：分钟 小时 日 月 星期</li>
        <li>星期取值为0-6，其中0表示星期日</li>
        <li>
          添加或修改任务后，建议点击"同步到系统"按钮将任务同步到系统crontab
        </li>
        <li>若系统环境不支持crontab，任务仍会保存在数据库中</li>
      </ul>
    </el-card>
    <!-- 编辑和添加对话框 -->
    <el-dialog
      v-model="saveTaskDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog primary dialog-max-height"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><AlarmClock /></el-icon
          ><span>{{ isEdit ? "编辑" : "添加" }}定时任务</span>
        </div>
      </template>
      <!-- 表单 -->
      <div class="save-dialog">
        <el-form
          ref="saveTaskFormRef"
          :model="saveTaskForm"
          :rules="saveTaskFormRules"
          label-width="100px"
          label-position="top"
        >
          <el-form-item prop="task_name" :label="saveTaskMsg.task_name.label">
            <el-input
              size="large"
              :placeholder="saveTaskMsg.task_name.placeholder"
              v-model="saveTaskForm.task_name"
            >
              <template #prefix>
                <el-icon><PriceTag /></el-icon>
              </template>
            </el-input>
            <p class="desc">
              {{ saveTaskMsg.task_name.desc }}
            </p>
          </el-form-item>

          <el-form-item :label="saveTaskMsg.command.label" prop="task_name">
            <el-input
              size="large"
              :placeholder="saveTaskMsg.command.placeholder"
              v-model="saveTaskForm.command"
            >
              <template #prefix>
                <el-icon><Postcard /></el-icon> </template
            ></el-input>
            <p class="desc">{{ saveTaskMsg.command.desc }}</p>
          </el-form-item>
          <!-- 执行周期选择 -->
          <el-form-item :label="saveTaskMsg.period.label" prop="period">
            <el-select
              size="large"
              :placeholder="saveTaskMsg.period.placeholder"
              v-model="saveTaskForm.period"
            >
              <template #prefix>
                <el-icon><Calendar /></el-icon>
              </template>
              <el-option
                v-for="item in saveTaskMsg.period.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- cron时间 -->
          <el-row :gutter="10" class="cron">
            <!-- 月 -->
            <el-col
              v-if="showFields.month"
              :span="saveTaskForm.period === 'cron' ? 24 : 12"
            >
              <p class="label">
                {{ saveTaskMsg.month.label }}
                <span class="desc hidden-xs-only">{{
                  saveTaskMsg.month.desc
                }}</span>
              </p>
              <el-form-item prop="month">
                <el-input
                  size="large"
                  v-model="saveTaskForm.month"
                  min="1"
                  max="12"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 周 -->
            <el-col
              v-if="showFields.week"
              :span="saveTaskForm.period === 'weekly' ? 24 : 12"
            >
              <p class="label">
                {{ saveTaskMsg.week.label }}
                <span class="desc hidden-xs-only">{{
                  saveTaskMsg.week.desc
                }}</span>
              </p>
              <el-form-item prop="week">
                <el-input
                  size="large"
                  v-model="saveTaskForm.week"
                  min="0"
                  max="6"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <span v-if="saveTaskForm.period === 'weekly'" class="desc info"
                >每周的哪一天执行</span
              >
            </el-col>
            <!-- 日 -->
            <el-col
              v-if="showFields.day"
              :span="saveTaskForm.period === 'monthly' ? 24 : 12"
            >
              <p class="label">
                {{ saveTaskMsg.day.label }}
                <span class="desc hidden-xs-only">{{
                  saveTaskMsg.day.desc
                }}</span>
              </p>
              <el-form-item prop="day">
                <el-input
                  size="large"
                  v-model="saveTaskForm.day"
                  min="1"
                  max="31"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <span v-if="saveTaskForm.period === 'monthly'" class="desc info"
                >每月的哪一天执行</span
              >
            </el-col>
            <!-- 时 -->
            <el-col v-if="showFields.hour" :span="12">
              <p class="label">
                {{ saveTaskMsg.hour.label }}
                <span class="desc hidden-xs-only">{{
                  saveTaskMsg.hour.desc
                }}</span>
              </p>
              <el-form-item prop="hour">
                <el-input
                  size="large"
                  v-model="saveTaskForm.hour"
                  min="0"
                  max="23"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <span class="desc" v-if="saveTaskForm.period !== 'cron'"
                >执行时间（小时）</span
              >
            </el-col>
            <!-- 分 -->
            <el-col
              v-if="showFields.minute"
              :span="saveTaskForm.period === 'hourly' ? 24 : 12"
            >
              <p class="label">
                {{ saveTaskMsg.minute.label }}
                <span class="desc hidden-xs-only">{{
                  saveTaskMsg.minute.desc
                }}</span>
              </p>
              <el-form-item prop="minute">
                <el-input
                  size="large"
                  v-model="saveTaskForm.minute"
                  min="0"
                  max="59"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <span class="desc info" v-if="saveTaskForm.period === 'hourly'"
                >每小时的哪一分钟执行</span
              >
              <span
                class="desc"
                v-if="
                  saveTaskForm.period !== 'cron' &&
                  saveTaskForm.period !== 'hourly'
                "
                >执行时间（分钟）</span
              >
            </el-col>
          </el-row>
          <!-- 启动任务 -->
          <div class="switch-wrap">
            <span class="switch-label">{{ saveTaskMsg.enabled.label }}</span>
            <el-switch v-model="saveTaskForm.enabled"></el-switch>
          </div>
        </el-form>
      </div>
      <!-- tips -->
      <div class="tips">可用 * 表示所有范围</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveTaskDialog = false">取消</el-button>
          <el-button type="primary" @click="saveTask" :loading="saveTaskLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      v-model="deleteTaskDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog danger"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Delete /></el-icon><span>删除定时任务</span>
        </div>
      </template>

      <div class="delete-task">
        <p class="title">
          确定要删除这个定时任务吗？删除后将从系统crontab中移除。
        </p>
        <div class="msg">
          <span class="msg-label">删除任务名称：</span>
          <span>{{ deleteTaskRow.task_name || "" }}</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteTaskDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteTask"
            :loading="deleteTaskLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.scheduled-task {
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
  .table-wrap {
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    .el-icon {
      margin: 0;
    }
    .time {
      .el-tag {
        margin-right: 4px;
        width: 34px;
        height: 24px;
      }
    }
  }
  .card-title {
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 5px;
    }
  }
  ul {
    margin-left: -15px;
    li {
      list-style: disc;
      color: #6c757d;
      line-height: 25px;
    }
  }
  .delete-task {
    .title {
      font-size: 16px;
      color: #222;
      margin-bottom: 15px;
    }
    .msg {
      padding: 8px 16px;
      background: #f8f9fc;
      border: 1px solid #eaecf4;
      border-radius: 4px;
      color: #6c757d;
      .msg-label {
        color: rgb(108, 117, 125);
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .save-dialog {
    .desc {
      font-size: 12px;
      color: #6c757d;
      margin-top: 5px;
      line-height: 1;
      &.info {
        color: #333;
        font-weight: bold;
      }
    }
    .switch-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cron {
      background: #f8f9fc;
      padding: 5px;
      .label {
        margin-bottom: 4px;
      }
      .el-col {
        margin-bottom: 5px;
      }
    }
  }
  .tips {
    padding: 10px;
    background: #fef6d5;
    border-radius: 4px;
    font-weight: bold;
    margin-top: 5px;
  }
}
</style>

