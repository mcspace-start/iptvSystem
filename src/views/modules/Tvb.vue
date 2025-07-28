<script setup>
import { ref, computed, reactive, watchEffect, watch } from "vue";
import { useWindowWidth } from "@/hook/useWindowWidth";
import axios from "@/api/axiosConfig";

import request from "@/api/request";
import testImage from "@/assets/TVB星河.png";

const loading = ref(false);
// 切换展示配置项
const showTypeValue = ref("card"); // table card
// 切换按钮信息
const showTypeMsg = [
  {
    label: "卡片",
    value: "card",
  },
  {
    label: "表格",
    value: "table",
  },
];
// 读取本地存储
const showType = localStorage.getItem("tvbShowType");
if (showType) showTypeValue.value = showType;
// 数据类型，搜索数据或者所有数据
const dataType = ref("all"); // all search
// 分页配置
const pager = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  layout: "total, sizes, prev, pager, next, jumper",
});
let oldPager = { ...pager.value };
// xs尺寸
const isXs = useWindowWidth("xs");
watchEffect(() => {
  if (isXs.value) {
    pager.value.layout = "pager";
  } else {
    pager.value.layout = "total, sizes, prev, pager, next, jumper";
  }
});

// #region  获取数据及搜索
// 获取完整表格数据
const dataForm = ref([]);
const dataFormUrl = "/tvbChannels";
const getData = async () => {
  const params = {
    page: pager.value.page,
    pageSize: pager.value.pageSize,
  };
  loading.value = true;
  try {
    // const { data: res1 } = await axios.get(dataFormUrl, { params });
    const res = await request.get(dataFormUrl, { params });
    if (res.code == 200) {
      // 将数据赋值给表单
      dataForm.value = res.data.data;
      // 将数据赋值给分页
      pager.value.total = res.data.total;
      // 更改数据类型
      dataType.value = "all";
      // 更改分页信息
      oldPager = { ...pager.value };
    } else {
      ElMessage.error(res.msg || "错误");
      console.log(res.msg);
      pager.value = { ...oldPager };
    }
  } catch (error) {
    pager.value = { ...oldPager };
    ElMessage.error(`获取数据失败，请稍后重试！`);
    console.log(error);
  } finally {
    loading.value = false;
  }
};
getData();
// 搜索条件
const filters = reactive({
  queryType: "channelName", // channelName channelId rtspGroup igmpGroup
  query: "",
});
// 搜索类型配置项
const queryTypeMsg = [
  {
    label: "频道名称",
    value: "channelName",
  },
  {
    label: "频道代码",
    value: "channelCode",
  },
  {
    label: "频道分组",
    value: "channelGroup",
  },
];
// 动态修改搜索提示
const searchInputPlaceholder = computed(() => {
  const searchType = queryTypeMsg.find(
    (item) => item.value === filters.queryType
  );
  return `输入 ${searchType.label} 搜索`;
});
// 发送搜索请求
const searchUrl = "/searchTvbChannels";
const search = async () => {
  // 如果是所有数据切换为搜索，还原 pager 默认值
  if (dataType.value == "all") {
    pager.value.page = 1;
    pager.value.pageSize = 10;
  }
  // 请求参数
  const params = {
    page: pager.value.page,
    pageSize: pager.value.pageSize,
    query: filters.query,
    queryType: filters.queryType,
  };
  loading.value = true;
  try {
    // const { data: res1 } = await axios.get(searchUrl, { params });
    const res = await request.get(searchUrl, { params });
    if (res.code == 200) {
      // 将数据赋值给表单
      dataForm.value = res.data.data;
      // 将数据赋值给分页
      pager.value.total = res.data.total;
      // 更改数据类型
      dataType.value = "search";
      // 更改分页信息
      oldPager = { ...pager.value };
    } else {
      // 还原分页信息
      pager.value = { ...oldPager };
      ElMessage.error(res.msg || "错误");
      console.log(res.msg);
    }
  } catch (error) {
    pager.value = { ...oldPager };
    ElMessage.error(`获取数据失败，请稍后重试！`);
    console.log(error);
  } finally {
    loading.value = false;
  }
};
// 切换搜索类型
const changeQueryType = () => {
  filters.query = "";
};
// 搜索改变事件
const changeSearchValue = () => {
  if (filters.query.trim() === "") {
    filters.query = "";
    // 如果是搜索结果，改为搜索全部数据
    if (dataType.value == "search") return getData();
  }
  search();
};
// 分页事件触发
const handleSizeChange = () => {
  dataType.value == "all" ? getData() : search();
};
const handleCurrentChange = () => {
  dataType.value == "all" ? getData() : search();
};
// #endregion

// #region 选中和删除
// 选中数据
const selectData = ref([]);
// 表格展示ref
const dataFormRef = ref(null);
// 表格选中数据
const tableCheckList = ref([]);
// 卡片选中数据
const cardCheckList = ref([]);
// 清空选中
const clearSelection = () => {
  cardCheckList.value = [];
  tableCheckList.value = [];
  selectData.value = [];
  if (dataFormRef.value) dataFormRef.value.clearSelection();
};
// 自动同步selectData
watchEffect(() => {
  selectData.value =
    showTypeValue.value == "card" ? cardCheckList.value : tableCheckList.value;
});
// 当dataForm发生变化时，清空选中
watch(
  () => dataForm.value,
  () => {
    // 清空选中数据
    clearSelection();
  }
);
// table选中数据
const selectionChange = (v) => {
  tableCheckList.value = v;
};
// 切换展示类型
const changeShowType = () => {
  // 写入 dataType 到本地存储
  localStorage.setItem("tvbShowType", showTypeValue.value);
  // 同步选中数据
  if (showTypeValue.value == "card") {
    // 将表格选中数据同步
    cardCheckList.value = tableCheckList.value;
  } else {
    // 先将原有数据取消选中，然后同步 card 的选中
    dataFormRef.value.clearSelection();
    cardCheckList.value.forEach((item) => {
      dataFormRef.value.toggleRowSelection(item, true);
    });
  }
};
// 是否全选
const isSelectAll = computed(() => {
  return (
    selectData.value.length === dataForm.value.length &&
    selectData.value.length > 0
  );
});
// 全选和全部选
const toogleSelectAll = () => {
  if (showTypeValue.value == "card") {
    // 卡片
    cardCheckList.value =
      cardCheckList.value.length === dataForm.value.length
        ? []
        : dataForm.value;
  } else {
    // 表格
    dataFormRef.value.toggleAllSelection();
  }
};
// 删除多个
const deleteLoading = ref(false);
const deleteSelectDialog = ref(false);
const deleteSelectUrl = "/deleteTvbChannels";
const deleteSelect = async () => {
  // 获取ids
  const ids = selectData.value.map((item) => item.id).join(",");
  const params = {
    ids: ids,
  };

  deleteLoading.value = true;
  try {
    // const { data: res1 } = await axios.delete(deleteSelectUrl, { params });
    const res = await request.get(deleteSelectUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: `删除${selectData.value.length}个频道成功！`,
        showClose: false,
      });
      // 刷新数据
      dataType.value == "all" ? getData() : search();
      deleteSelectDialog.value = false;
    } else {
      ElMessage.error(res.msg || "删除失败，请稍后重试！");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteLoading.value = false;
  }
};
// 删除单个
const deleteItemUrl = "/deleteTvbChannel";
const deleteItemDialog = ref(false);
const deleteItemRow = ref(null);
const deleteItemLoading = ref(false);
const openDeleteItem = (row) => {
  deleteItemRow.value = row;
  deleteItemDialog.value = true;
};
const deleteItem = async () => {
  const params = {
    id: deleteItemRow.value.id,
  };
  deleteItemLoading.value = true;
  try {
    // const { data: res1 } = await axios.delete(deleteItemUrl, { params });
    const res = await request.get(deleteItemUrl, { params });
    if (res.code == 200) {
      ElNotification.success({
        title: `删除频道成功！`,
        showClose: false,
      });
      deleteItemDialog.value = false;
      // 刷新数据
      dataType.value == "all" ? getData() : search();
    } else {
      ElMessage.error(res.msg || "删除失败，请稍后重试！");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteItemLoading.value = false;
  }
};
// #endregion

// #region  查看频道详情
// 查看频道详情
const tvbDetailDialog = ref(false);
const tvbDetailRow = ref(null);
const openIptvDetail = (row) => {
  tvbDetailRow.value = row;
  console.log(row);
  tvbDetailDialog.value = true;
};
// #endregion

// #region 修改频道
// 修改频道
const editTvbForm = ref({
  id: "",
  channel_group: "",
  channel_code: "",
  name: "",
  logo: "",
  license: "",
});
let oldSaveIptvForm = {};
const eidtTvbMsg = {
  id: {
    label: "频道ID",
    placeholder: "请输入频道ID",
    desc: "频道的ID，不可修改",
    tips: "",
    icon: "Operation",
    disabled: true,
  },
  channel_group: {
    label: "频道分组",
    placeholder: "",
    desc: "频道的分组",
    tips: "",
    icon: "Guide",
    disabled: true,
  },
  channel_code: {
    label: "频道编码",
    placeholder: "",
    desc: "频道的编码",
    tips: "",
    icon: "Notification",
    disabled: false,
  },
  name: {
    label: "频道名称",
    placeholder: "请输入频道名称",
    desc: `频道的名称，如 "翡翠台"、"明珠台" 等`,
    tips: "",
    icon: "Edit",
    disabled: false,
  },
  logo: {
    label: "频道台标URL",
    placeholder: "请输入频道台标URL",
    desc: "频道台标图片的URL地址，可为空",
    tips: "",
    icon: "CreditCard",
    disabled: false,
  },
  license: {
    label: "授权信息",
    placeholder: "请输入授权密钥或授权码",
    desc: "频道的授权密钥或授权码",
    tips: "",
    icon: "Lock",
    disabled: false,
  },
};
const editTvbFormRules = {
  logo: [
    {
      required: true,
      message: "请输入频道台标URL",
      trigger: "blur",
    },
  ],
  license: [
    {
      required: true,
      message: "请输入授权信息",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入频道名称",
      trigger: "blur",
    },
  ],
};
const editTvbFormRef = ref(null);
const editTvbDialog = ref(false);
const editTvbLoading = ref(false);
const editIptvUrl = "/tvbEditChannel";
const openSaveIptvDialog = (row) => {
  if (editTvbLoading.value) return ElMessage.info("正在保存数据，请稍后重试！");
  editTvbDialog.value = true;
  editTvbForm.value = { ...row };
  oldSaveIptvForm = { ...editTvbForm.value };
};
const closeEditTvbDialog = () => {
  if (editTvbFormRef.value) editTvbFormRef.value.clearValidate();
  editTvbDialog.value = false;
};
// 发送请求
const saveIptv = () => {
  editTvbFormRef.value.validate(async (valid) => {
    if (valid) {
      const s =
        JSON.stringify(editTvbForm.value) === JSON.stringify(oldSaveIptvForm);
      if (s) return ElMessage.info("未做任何修改");
      //
      editTvbLoading.value = true;
      let params = { ...editTvbForm.value };
      try {
        // const { data: res1 } = await axios.post(editIptvUrl, params);
        const res = await request.get(editIptvUrl, { params });
        if (res.code == 200) {
          ElNotification.success({
            title: `编辑频道成功`,
            showClose: false,
          });
          editTvbDialog.value = false;
          // 重新获取数据
          dataType.value == "all" ? getData() : search();
        } else {
          console.log(res.msg);
          ElMessage.error(res.msg || "保存失败");
        }
      } catch (error) {
        ElMessage.error(error.msg || "请求错误！");
        console.log(error);
      } finally {
        editTvbLoading.value = false;
      }
    }
  });
};
// #endregion

// 刷新台标
const refreshLogoUrl = "/tvbRefreshLogo";
const refreshLogoLoading = ref(false);
const refreshLogo = async () => {
  refreshLogoLoading.value = true;
  try {
    // const { data: res1 } = await axios.put(refreshLogoUrl);

    const res = await request.get(refreshLogoUrl);
    if (res.code == 200) {
      ElMessage.success("刷新台标成功！");
      // 重新获取数据
      dataType.value == "all" ? getData() : search();
    } else {
      console.log(res.msg);
      ElMessage.error(res.msg || "刷新失败，请稍后重试！");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    refreshLogoLoading.value = false;
  }
};

// 修改本地测试地址
watch(
  () => dataForm.value,
  () => {
    console.log("监控data");
    dataForm.value.forEach((item) => {
      item.logo = testImage;
    });
  }
);
</script>
<template>
  <!-- #region -->
  <main class="tvb">
    <div class="tvb-header">
      <el-row :gutter="15">
        <el-col :xs="12" :sm="12" :md="3"
          ><el-button
            type="danger"
            @click="deleteSelectDialog = true"
            :disabled="!selectData.length"
            :title="!selectData.length ? '请先选择要删除的频道' : ''"
          >
            <template #icon
              ><el-icon><Delete /></el-icon
            ></template>
            {{ selectData.length ? `删除(${selectData.length})` : "删除频道" }}
          </el-button></el-col
        >
        <el-col :xs="12" :sm="12" :md="2"
          ><el-button type="info" @click="toogleSelectAll">
            <template #icon
              ><el-icon><Finished /></el-icon
            ></template>
            全{{ isSelectAll ? "不" : "" }}选</el-button
          ></el-col
        >
        <el-col :xs="10" :sm="8" :md="3"
          ><el-button
            type="success"
            @click="refreshLogo"
            :loading="refreshLogoLoading"
          >
            <template #icon
              ><el-icon><Refresh /></el-icon
            ></template>
            刷新台标</el-button
          ></el-col
        >
        <el-col :xs="14" :sm="16" :md="4">
          <el-segmented
            class="showType"
            v-model="showTypeValue"
            :options="showTypeMsg"
            @change="changeShowType"
            block
          >
            <template #default="scope">
              <div class="box">
                <el-icon v-if="scope.item.value == 'card'"><Menu /></el-icon>
                <el-icon v-else><Expand /></el-icon>
                <span>{{ scope.item.label }}</span>
              </div>
            </template>
          </el-segmented>
        </el-col>
        <el-col :xs="24" :sm="24" :md="4">
          <div class="select-wrap">
            <el-select
              v-model="filters.queryType"
              placeholder="Select"
              size="large"
              @change="changeQueryType"
            >
              <el-option
                v-for="item in queryTypeMsg"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-input
            v-model="filters.query"
            :placeholder="searchInputPlaceholder"
            class="searchInput"
            clearable
            @change="changeSearchValue"
          >
            <template #append>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="tvb-content">
      <el-card body-style="padding: 0px;">
        <template #header>
          <div class="card-header">
            <span class="title">频道列表</span>
            <span class="total">{{ pager.total }} 个频道</span>
          </div>
        </template>
        <!-- 卡片形式显示 -->
        <el-checkbox-group
          v-model="cardCheckList"
          style="line-height: normal; font-size: initial"
        >
          <el-row
            v-show="showTypeValue == 'card'"
            class="channel-list"
            :gutter="20"
            v-loading="loading"
          >
            <el-col
              :xs="24"
              :sm="12"
              :md="6"
              v-for="item in dataForm"
              :key="item"
            >
              <!-- 卡片 -->
              <div class="channel-item" :class="{ 'is-checked': false }">
                <!-- 头部 -->
                <div class="channel-controls">
                  <div class="select-name">
                    <el-checkbox
                      :label="item.name"
                      :value="item"
                      size="large"
                      :key="item.id"
                    />
                  </div>
                  <div class="tools">
                    <el-icon class="edit" @click="openSaveIptvDialog(item)"
                      ><EditPen
                    /></el-icon>
                    <el-icon class="delete" @click="openDeleteItem(item)"
                      ><Delete
                    /></el-icon>
                  </div>
                </div>
                <!-- 内容 -->
                <div class="channel-content">
                  <el-image fit="contain" class="image" :src="item.logo">
                    <template #error>
                      <div class="image-slot">
                        <el-icon :size="30"><Monitor /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="info">
                    <p>频道ID:{{ item.id }}</p>
                    <p>频道代码:{{ item.channel_code }}</p>
                    <p>授权信息:{{ item.license }}</p>
                  </div>
                </div>
                <!-- 描述 -->

                <div class="channel-epg">
                  <span class="channel-name">{{ item.channel_group }}</span>
                  <span class="detailBtn" @click="openIptvDetail(item)"
                    >详情</span
                  >
                </div>
              </div>
            </el-col>

            <!-- 空状态 -->
            <el-col :span="24">
              <el-empty v-if="dataForm.length == 0" description="暂无数据" />
            </el-col>
          </el-row>
        </el-checkbox-group>
        <!-- 表格形式显示 -->
        <el-row
          v-show="showTypeValue == 'table'"
          class="channel-table"
          v-loading="loading"
        >
          <el-table
            :data="dataForm"
            ref="dataFormRef"
            @selection-change="selectionChange"
            header-row-class-name="table-header"
            :header-cell-style="{
              backgroundColor: 'rgb(248, 249, 250)',
              color: '#222',
              borderBottom: '2px solid #333',
            }"
            title="双击查看详情"
            @row-dblclick="openIptvDetail"
          >
            <el-table-column fixed width="40" type="selection" />
            <!-- 台标 -->
            <el-table-column prop="logoSrc" label="台标" width="120">
              <template #default="{ row }">
                <el-image fit="cover" class="image-logo" :src="row.logo" />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="频道名称"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column prop="id" label="频道ID" />
            <el-table-column prop="channel_code" label="频道代码" />

            <el-table-column
              prop="channel_group"
              label="频道分组"
              min-width="100"
            />
            <!-- fixed:right -->
            <el-table-column
              min-width="160"
              prop="license"
              label="授权信息"
              show-overflow-tooltip=""
            />
            <el-table-column align="center" label="操作" width="120">
              <template #default="{ row }">
                <el-button-group>
                  <el-button
                    size="default"
                    type="primary"
                    @click="openSaveIptvDialog(row)"
                    ><el-icon><Edit /></el-icon
                  ></el-button>
                  <el-button
                    size="default"
                    type="danger"
                    @click="openDeleteItem(row)"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </el-button-group>
              </template>
            </el-table-column>
            <!-- 设置空状态展示 -->
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
        </el-row>
        <!-- 分页 -->
        <template #footer>
          <div class="card-footer">
            <el-pagination
              background
              v-model:current-page="pager.page"
              v-model:page-size="pager.pageSize"
              :page-sizes="[10, 20, 30]"
              :layout="pager.layout"
              :total="pager.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager-count="5"
            >
            </el-pagination>
          </div>
        </template>
      </el-card>
    </div>
    <!-- dialog -->
    <!-- 删除多个 -->
    <el-dialog
      v-model="deleteSelectDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog danger"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Delete /></el-icon><span>删除选中频道</span>
        </div>
      </template>

      <div class="delete-task">
        <p class="title">确定要删除选中的频道吗？此操作不可恢复。</p>
        <div class="msg">
          <span class="msg-label">删除内容：</span>
          <span>{{ selectData.length || 0 }}个频道</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteSelectDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteSelect"
            :loading="deleteLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 删除单个 -->
    <el-dialog
      v-model="deleteItemDialog"
      title="Tips"
      width="500"
      align-center
      class="my-dialog danger"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Delete /></el-icon><span>删除该频道</span>
        </div>
      </template>

      <div class="delete-task">
        <p class="title">确定要删除该的频道吗？此操作不可恢复。</p>
        <div class="msg">
          <span class="msg-label">频道名称：</span>
          <span>{{ deleteItemRow.name }}</span>
        </div>
        <div class="msg" style="margin-top: 4px">
          <span class="msg-label">频道标ID：</span>
          <span>{{ deleteItemRow.id }}</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteItemDialog = false">取消</el-button>
          <el-button
            type="danger"
            @click="deleteItem"
            :loading="deleteItemLoading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      v-model="tvbDetailDialog"
      title="Tips"
      align-center
      width="60%"
      class="my-dialog primary dialog-max-height"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><InfoFilled /></el-icon>
          <span>详情</span>
        </div>
      </template>
      <!-- 内容 -->
      <div class="detail">
        <div class="detail-header">
          <!-- 台标 -->
          <div class="img-wrap">
            <el-image fit="contain" :src="tvbDetailRow.logo">
              <template #error>
                <div class="image-slot">
                  <el-icon :size="40"><Monitor /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <!-- info -->
          <div class="detail-header-info">
            <p class="title">{{ tvbDetailRow.name }}</p>
            <p class="label">
              频道ID: <span>{{ tvbDetailRow.id }}</span>
            </p>
            <p class="label">
              频道分组: <span>{{ tvbDetailRow.channel_group }}</span>
            </p>
            <p class="label">
              频道代码: <span>{{ tvbDetailRow.channel_code }}</span>
            </p>
          </div>
        </div>
        <!-- body -->
        <el-divider />
        <div class="detail-content">
          <!-- 内容区域 -->
          <el-row>
            <el-col :span="24">
              <p class="label">台标地址</p>
              <el-input
                readonly
                size="large"
                :value="tvbDetailRow.logo"
              ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <p class="label">授权信息</p>
              <el-input
                readonly
                type="textarea"
                :rows="3"
                :value="tvbDetailRow.license"
              ></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="info" plain @click="tvbDetailDialog = false"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 添加和修改频道 -->
    <el-dialog
      v-model="editTvbDialog"
      width="70%"
      align-center
      class="my-dialog primary dialog-max-height"
      :before-close="closeEditTvbDialog"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Aim /></el-icon>
          <span>编辑频道</span>
        </div>
      </template>
      <div class="save-dialog">
        <el-form
          :model="editTvbForm"
          ref="editTvbFormRef"
          :rules="editTvbFormRules"
        >
          <el-row :gutter="20">
            <el-col
              :span="12"
              :xs="24"
              v-for="(_, key) in eidtTvbMsg"
              :key="key"
            >
              <el-form-item
                :label="eidtTvbMsg[key].label"
                :prop="key"
                label-position="top"
              >
                <el-input
                  size="large"
                  :placeholder="eidtTvbMsg[key].placeholder"
                  v-model="editTvbForm[key]"
                  :disabled="eidtTvbMsg[key].disabled"
                >
                  <template #prepend>
                    <el-button>
                      <template #icon>
                        <el-icon :size="18">
                          <component :is="eidtTvbMsg[key].icon" />
                        </el-icon>
                      </template>
                    </el-button>
                  </template>
                </el-input>
                <p class="desc">{{ eidtTvbMsg[key].desc }}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeEditTvbDialog">取消</el-button>
          <el-button type="primary" @click="saveIptv" :loading="editTvbLoading"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </main>
</template>

<style lang="less" scoped>
main.tvb {
  .tvb-header {
    .el-col {
      height: 44px;
      margin-bottom: 20px;
      .el-button {
        width: 100%;
        height: 100%;
      }
      // 切换展示类型
      .showType {
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background: #fff;
        .box {
          display: flex;
          align-items: center;
          justify-content: center;
          .el-icon {
            margin-right: 4px;
          }
        }
      }
      // 切换搜索类型
      .select-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      // 搜索框
      .searchInput {
        height: 100%;
        width: 100%;
      }
    }
  }
  .tvb-content {
    .card-header {
      display: flex;
      justify-content: space-between;
      .title {
        font-weight: bold;
      }
      .total {
        font-size: 12px;
        border-radius: 4px;
        background: rgb(51.2, 126.4, 204);
        color: #fff;
        padding: 4px 8px;
      }
    }
    // 内容渲染
    .channel-list {
      padding: 20px 20px 0 20px;
      .el-col {
        margin-bottom: 20px;
      }
      .channel-item {
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        box-sizing: border-box;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 10px;
        transition: box-shadow 0.2s ease;
        &:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .channel-controls {
          height: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .el-checkbox {
            color: #000;
            font-weight: bold;
          }

          .tools {
            width: 40px;
            display: flex;
            justify-content: space-between;
            .el-icon {
              cursor: pointer;
              &.edit:hover {
                color: blue;
              }
              &.delete:hover {
                color: red;
              }
            }
          }
        }
        .channel-content {
          height: 84px;
          display: flex;
          margin: 8px 0 14px 0;
          .image {
            width: 84px;
            flex: 0 0 84px;
            height: 84px;
            background: #f5f7fa;
            margin-right: 10px;
            border-radius: 4px;
            .image-slot {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgb(177, 177, 177);
            }
          }
          .info {
            font-size: 14px;
            display: flex;
            flex: 1;
            overflow: hidden;
            flex-direction: column;
            justify-content: space-between;
            p {
              border-left: 2px solid #f0f0f0;
              padding-left: 5px;
              color: rgb(108, 117, 125);
              // 设置单行文字溢出出现省略号
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .channel-epg {
          border-top: 1px solid #e1e4e8;

          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #6c757d;
          font-size: 14px;
          padding: 8px 0 4px 0;

          .detailBtn {
            border-radius: 4px;
            color: #007bff;
            padding: 4px 6px;
            background: rgba(0, 123, 255, 0.05);
            user-select: none;
            cursor: pointer;
            &:hover {
              color: rgb(0, 86, 179);
              background: rgba(0, 123, 255, 0.1);
            }
          }
        }
        // 已选中状态
        &.is-checked {
          border-color: #409eff;
        }
      }
    }
    .channel-table {
      .image-logo {
        height: 40px;
        width: 100%;
        margin-top: 4px;
        border-radius: 4px;
      }
      .el-button {
        .el-icon {
          margin: 0;
        }
      }
    }
    // 分区栏
    .card-footer {
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
  // 详情
  .detail {
    .detail-header {
      display: flex;
      align-items: center;
      .img-wrap {
        width: 120px;
        height: 120px;
        background: #ccc;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
        margin-right: 20px;
        .el-image {
          width: 100px;
          height: 100px;
          background: #e9ecef;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .detail-header-info {
        height: 100%;

        & > p {
          margin-bottom: 10px;
        }
        & span {
          color: #000;
        }
        .title {
          font-size: 24px;
          color: #0d6efd;
          font-weight: bold;
        }
        .label {
          font-size: 16px;
          color: #6c757d;
        }
      }
    }
    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
        gap: 8px;
      }
    }

    .detail-content {
      // 切换页标题
      padding: 0 10px;

      .el-row {
        .el-col {
          margin-bottom: 15px;
          .label {
            font-size: 16px;
            margin-bottom: 8px;
          }
        }
      }
      // epg节目单样式
      .epg-content {
        padding: 0;
        margin-top: 15px;
        .epg-item {
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 4px;
          background: #fafbfb;
          padding: 0 10px;
          margin-bottom: 4px;
          border-left: 4px solid var(--el-color-primary-dark-2);
          transition: all 0.3s;
          &:hover {
            transform: translateX(2px);
            background: var(--el-color-info-light-9);
          }
          // 节目播出信息
          .epg-info {
            display: flex;
            align-items: center;
            .epg-time {
              font-size: 14px;
              font-weight: bold;
              margin-right: 25px;
              color: var(--el-color-primary-dark-2);
            }
            .epg-title {
              color: #222;
              font-size: 14px;
              line-height: 1;
            }
            .epg-broadcasting {
              margin-left: 20px;
            }
          }
          // 节目时长
          .epg-duration {
            display: flex;
            align-items: center;

            .duration {
            }
            .btn {
              cursor: pointer;
              margin-left: 6px;
              background: var(--el-color-info-light-5);
              display: flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              transition: background 0.3s;
              color: #fff;
              &:hover {
                background: var(--el-color-info-light-3);
              }
            }
          }
        }

        // 根据不同状态
        .epg-item.finished {
          border-color: var(--el-color-info);
          // 节目播出信息
          .epg-info {
            .epg-title {
              color: var(--el-color-info);
            }
          }
        }
        .epg-item.airing {
          border-color: var(--el-color-danger);
          background-color: var(--el-color-danger-light-7);
          .epg-duration {
            .btn {
              background: var(--el-color-danger);
              &:hover {
                background: var(--el-color-danger-dark-2);
              }
            }
          }
        }
        .epg-item.upcoming {
        }
      }
    }
  }
  // 添加和编辑
  .save-dialog {
    .desc {
      font-size: 12px;
      color: #6c757d;
    }
  }
}
</style>