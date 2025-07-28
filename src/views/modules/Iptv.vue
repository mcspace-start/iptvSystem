<script setup>
import { ref, computed, reactive, watchEffect, watch } from "vue";
import { useWindowWidth } from "@/hook/useWindowWidth";
import DatePickerWithButtons from "@/components/datePickerWithButtons.vue";
import axios from "@/api/axiosConfig";

import request from "@/api/request";
// 日期组件
import testImage from "@/assets/TVB星河.png";

const loading = ref(false);
// 切换展示配置项
const showTypeValue = ref("card"); // table card

// 读取本地存储
const showType = localStorage.getItem("iptvShowType");
if (showType) showTypeValue.value = showType;

// 数据类型，搜索还是所有数据
const dataType = ref("all"); // all search
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
const dataFormUrl = "/iptvChannels";
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
    label: "频道标识号",
    value: "channelId",
  },
  {
    label: "RTSP频道分组",
    value: "rtspGroup",
  },
  {
    label: "IGMP频道分组",
    value: "igmpGroup",
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
const searchUrl = "/searchIptvChannels";
const search = async () => {
  // 如果是所有数据切换为搜索，还原 pager 默认值
  if (dataType.value == "all") {
    pager.value.page = 1;
    pager.value.pageSize = 10;
  }
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
// 表格展示ref
const dataFormRef = ref(null);
// 选中数据
const selectData = ref([]);
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
// table勾选数组
const selectionChange = (v) => {
  tableCheckList.value = v;
};
// 切换展示类型
const changeShowType = () => {
  // 写入 dataType 到本地存储
  localStorage.setItem("iptvShowType", showTypeValue.value);
  // 同步选中数据
  if (showTypeValue.value == "card") {
    // 将表格选中数据同步
    cardCheckList.value = tableCheckList.value;
  } else {
    // 先将原有数据取消选中，然后同步 card 选中
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
const deleteSelectUrl = "/deleteIptvChannels";
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
      ElMessage.error(res.msg || "删除失败");
    }
  } catch (error) {
    ElMessage.error(error.msg || "请求错误！");
    console.log(error);
  } finally {
    deleteLoading.value = false;
  }
};
// 删除单个
const deleteItemUrl = "/deleteIptvChannel";
const deleteItemDialog = ref(false);
const deleteItemRow = ref(null);
const deleteItemLoading = ref(false);
const openDeleteItem = (row) => {
  deleteItemRow.value = row;
  deleteItemDialog.value = true;
};
const deleteItem = async () => {
  const params = {
    id: deleteItemRow.value.channel_id,
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
      ElMessage.error(res.msg || "错误！");
    }
  } catch (error) {
    ElMessage.error("删除失败，请稍后重试！");
    console.log(error);
  } finally {
    deleteItemLoading.value = false;
  }
};
// #endregion

// #region  查看频道详情
// 查看频道详情
const detailActiveName = ref("info"); // info links epg
const iptvDetailDialog = ref(false);
const iptvDetailRow = ref(null);
const rtspInput = ref(null);
const igmpInput = ref(null);
const epgDataLoading = ref(false);
// EPG 数据
const epgData = ref([]);
const openIptvDetail = (row) => {
  iptvDetailRow.value = row;
  detailActiveName.value = "info"; // 重置为 info
  iptvDetailDialog.value = true;
  epgData.value = [];
};
// 复制  type : rtsp igmp
const copyUrl = (type) => {
  const text =
    type === "rtsp"
      ? iptvDetailRow.value.rtsp_url
      : iptvDetailRow.value.igmp_url;
  const ref = type === "rtsp" ? rtspInput.value : igmpInput.value;
  ref.select();
  try {
    navigator.clipboard.writeText(text);
    ElMessage.success("已复制到剪贴板");
  } catch {
    ElMessage.error("复制失败，请手动复制");
  }
};
// 跳转至 potPlayer播放
const goToPlayer = (type) => {
  // 获取播放地址
  const url =
    type === "rtsp"
      ? iptvDetailRow.value.rtsp_url
      : iptvDetailRow.value.igmp_url;

  const params = {
    accountinfo:
      "~~V2.0~a3YVBdGOvbzgc7oDC7SCTg~5lc7o6waW0Pz-FZUCEiv_SfyUnKUl8N3i4Oy7I9sR7pZPiorPPzZhwF8MEoAgzkmSrk7CDJmpedK70nZUh4WhUugKK9tbQxbUPSTvTKlbu0==:20230101235235,END",
    GuardEncType: "2",
  };
  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${url}?${urlParams}`;
  // 使用 PotPlayer 打开链接
  // PotPlayer 默认注册的协议是 potplayer://
  window.location.href = `potplayer://${fullUrl}`;
};
// EPG 数据
const epgSelectDate = ref(new Date());
// 格式化时间
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
const getEpgDataUrl = "/epgData";
const getEpgData = async (date) => {
  // date=2025-07-21&timezone=Asia%2FShanghai&_t=1753014414064
  const params = {
    date: formatDate(date),
    timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
    _t: Date.now(),
  };
  epgDataLoading.value = true;

  try {
    // const { data: res1 } = await axios.get(getEpgDataUrl, { params });
    const res = await request.get(getEpgDataUrl, { params });
    if (res.code == 200) {
      epgData.value = res.data.programs;
    } else {
      ElMessage.error(res.msg || "错误！");
      console.log(res.msg);
    }
  } catch (error) {
    ElMessage.error(`获取数据失败，请稍后重试！`);
    console.log(error);
  } finally {
    epgDataLoading.value = false;
  }
};
// 切换至epg页时获取数据,而不是一打开就获取数据
watch(
  () => detailActiveName.value,
  (newVal) => {
    if (newVal === "epg" && epgData.value.length == 0) {
      getEpgData(epgSelectDate.value);
    }
  }
);
// 切换日期时重新获取数据
const timeChange = (date) => {
  epgData.value = [];
  getEpgData(date);
};
// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
const duration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  // 使用绝对值，以免节目结束时间早于开始时间时出现负数
  const duration = Math.abs(end - start);

  const minutes = Math.floor(duration / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}时${remainingMinutes}分`;
  } else {
    return `${minutes}分`;
  }
};
// 播出状态
const playStatus = (startTime, endTime) => {
  const now = new Date("2025-07-19T10:01:00.000Z");
  // const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let s = "upcoming"; // airing, finished, upcoming
  if (now < start) {
    s = "upcoming";
  } else if (now >= start && now < end) {
    // 边界值 now < end 而不是 <=
    s = "airing";
  } else {
    s = "finished";
  }
  return s;
};

const openPlayer = (item, status) => {
  const startTime = new Date(item.start_time).getTime();
  const endTime = new Date(item.end_time).getTime();
  const url = iptvDetailRow.value.rtsp_url;

  let params = {
    accountinfo:
      "~~V2.0~a3YVBdGOvbzgc7oDC7SCTg~5lc7o6waW0Pz-FZUCEiv_SfyUnKUl8N3i4Oy7I9sR7pZPiorPPzZhwF8MEoAgzkmSrk7CDJmpedK70nZUh4WhUugKK9tbQxbUPSTvTKlbu0==:20230101235235,END",
    GuardEncType: "2",
  };
  // 回放则添加播放时间
  if (status === "finished") {
    params.playseek = `${startTime}-${endTime}`;
  }
  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${url}?${urlParams}`;
  // 使用 PotPlayer 打开链接
  window.location.href = `potplayer://${fullUrl}`;
};
// #endregion

// #region 添加和修改频道
// 添加和修改频道
const saveIptvForm = ref({
  channel_id: "",
  channel_name: "",
  channel_number: "",
  insert_position: "",
  logo_url: "",
  rtsp_url: "",
  igmp_url: "",
  rtsp_group: "",
  igmp_group: "",
  epg_id: "",
  epg_name: "",
  epg_number: "",
});
const emptySaveIptvForm = {
  ...saveIptvForm.value,
};
let oldSaveIptvForm = {};
const saveIptvMsg = {
  channel_id: {
    label: "频道标识号",
    placeholder: "请输入频道标识号",
    desc: "频道的唯一标识号",
    tips: "",
    icon: "CreditCard",
  },
  channel_name: {
    label: "频道名称",
    placeholder: "请输入频道名称",
    desc: "频道的唯一标识符，不可重复",
    tips: "",
    icon: "FirstAidKit",
  },
  channel_number: {
    label: "频道编号",
    placeholder: "请输入频道编号",
    desc: `频道的可读名称，如"CCTV-1"`,
    tips: "",
    icon: "Files",
  },
  insert_position: {
    label: "插入位置",
    placeholder: "请输入插入位置",
    desc: "频道在列表中的插入位置",
    tips: "",
    icon: "Location",
  },
  logo_url: {
    label: "频道台标URL",
    placeholder: "请输入频道台标URL",
    desc: "频道台标图片的URL地址",
    tips: "",
    icon: "Picture",
  },
  rtsp_url: {
    label: "RTSP地址",
    placeholder: "请输入RTSP地址",
    desc: "RTSP协议下的频道地址",
    tips: "",
    icon: "Link",
  },
  igmp_url: {
    label: "IGMP地址",
    placeholder: "请输入IGMP地址",
    desc: "IGMP协议下的频道地址",
    tips: "",
    icon: "Link",
  },
  rtsp_group: {
    label: "RTSP频道分组",
    placeholder: "请输入RTSP频道分组",
    desc: "RTSP协议下的频道分组名称",
    tips: "",
    icon: "Folder",
  },
  igmp_group: {
    label: "IGMP频道分组",
    placeholder: "请输入IGMP频道分组",
    desc: "IGMP协议下的频道分组名称",
    tips: "",
    icon: "Folder",
  },
  epg_id: {
    label: "EPG频道标识号",
    placeholder: "请输入EPG频道标识号",
    desc: "EPG系统中的频道标识号",
    tips: "",
    icon: "CreditCard",
  },
  epg_name: {
    label: "EPG频道名称",
    placeholder: "请输入EPG频道名称",
    desc: "EPG系统中显示的频道名称",
    tips: "",
    icon: "FirstAidKit",
  },
  epg_number: {
    label: "EPG频道编号",
    placeholder: "请输入EPG频道编号",
    desc: "EPG系统中的频道编号",
    tips: "",
    icon: "Files",
  },
};
const saveIptvFormRules = {
  channel_id: [
    { required: true, message: "频道标识符不能为空", trigger: "blur" },
  ],
  channel_name: [
    { required: true, message: "频道名称不能为空", trigger: "blur" },
  ],
  insert_position: [
    { pattern: /^\d+$/, message: "插入位置只能为数字", trigger: "blur" },
  ],
  epg_name: [
    { required: true, message: "EPG频道名称不能为空", trigger: "blur" },
  ],
  epg_id: [
    { required: true, message: "EPG频道标识号不能为空", trigger: "blur" },
  ],
  igmp_group: [
    { required: true, message: "IGMP分组不能为空", trigger: "blur" },
  ],
  rtsp_group: [
    { required: true, message: "RTSP分组不能为空", trigger: "blur" },
  ],
  rtsp_url: [
    { required: true, message: "RTSP地址不能为空", trigger: "blur" },
    { type: "url", message: "RTSP地址格式不正确", trigger: "blur" },
  ],
  igmp_url: [
    { required: true, message: "IGMP地址不能为空", trigger: "blur" },
    { type: "url", message: "IGMP地址格式不正确", trigger: "blur" },
  ],
};
const saveIptvFormRef = ref(null);
const saveIptvDialog = ref(false);
const saveIptvLoading = ref(false);
const saveIptvIsEdit = ref(false);
const addIptvUrl = "/iptvAddChannel";
const editIptvUrl = "/iptvEditChannel";
let saveUrl = "";
const openSaveIptvDialog = (type, row) => {
  if (saveIptvLoading.value)
    return ElMessage.info("正在保存数据，请稍后重试！");
  if (saveIptvFormRef.value) saveIptvFormRef.value.clearValidate();
  saveIptvDialog.value = true;
  // 还原默认值
  if (type === "add") {
    saveIptvIsEdit.value = false;
    saveIptvForm.value = { ...emptySaveIptvForm };
  } else {
    saveIptvIsEdit.value = true;
    saveIptvForm.value = { ...row };
    oldSaveIptvForm = { ...saveIptvForm.value };
  }
};
const saveIptv = () => {
  saveIptvFormRef.value.validate(async (valid) => {
    if (valid) {
      const s =
        JSON.stringify(saveIptvForm.value) === JSON.stringify(oldSaveIptvForm);
      if (s) return ElMessage.info("未做任何修改");
      //
      let params = {};
      // 赋值 url 和 params
      if (saveIptvIsEdit.value) {
        saveUrl = editIptvUrl;
        params = {
          id: saveIptvForm.value.id,
          data: {
            ...saveIptvForm.value,
          },
        };
      } else {
        saveUrl = addIptvUrl;
        params = { ...saveIptvForm.value };
      }
      saveIptvLoading.value = true;
      try {
        // const { data: res1 } = await axios.post(saveUrl, params);
        const res = await request.get(saveUrl, { params });
        if (res.code == 200) {
          console.log(res);
          ElNotification.success({
            title: `${saveIptvIsEdit.value ? "编辑" : "添加"}频道成功`,
            showClose: false,
          });
          saveIptvDialog.value = false;
          // 重新获取数据
          dataType.value == "all" ? getData() : search();
        } else {
          console.log(res.msg);
          ElMessage.error(res.msg || "错误！");
        }
      } catch (error) {
        ElMessage.error(`保存失败，请稍后重试！`);
        console.log(error);
      } finally {
        saveIptvLoading.value = false;
      }
    }
  });
};
// #endregion

// 刷新台标
const refreshLogoUrl = "/iptvRefreshLogo";
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
      ElMessage.error(res.msg || "错误！");
    }
  } catch (error) {
    ElMessage.error(`刷新失败，请稍后重试！`);
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
      item.logo_url = testImage;
    });
  }
);
// 以及 playStatus 时间修改为本地测试时间
</script>
<template>
  <!-- #region -->
  <main class="iptv">
    <div class="iptv-header">
      <el-row :gutter="15">
        <el-col :xs="12" :sm="6" :md="3">
          <el-button type="primary" @click="openSaveIptvDialog('add')">
            <template #icon
              ><el-icon><DocumentAdd /></el-icon
            ></template>
            添加频道</el-button
          ></el-col
        >
        <el-col :xs="12" :sm="6" :md="3"
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
        <el-col :xs="12" :sm="6" :md="2"
          ><el-button type="info" @click="toogleSelectAll">
            <template #icon
              ><el-icon><Finished /></el-icon
            ></template>
            全{{ isSelectAll ? "不" : "" }}选</el-button
          ></el-col
        >
        <el-col :xs="12" :sm="6" :md="3"
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
        <el-col :xs="24" :sm="10" :md="4">
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
        <el-col :xs="24" :sm="14" :md="3">
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
        <el-col :xs="24" :sm="24" :md="6">
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
    <div class="iptv-content">
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
                      :label="item.channel_name"
                      :value="item"
                      size="large"
                      :key="item.id"
                    />
                  </div>
                  <div class="tools">
                    <el-icon
                      class="edit"
                      @click="openSaveIptvDialog('edit', item)"
                      ><EditPen
                    /></el-icon>
                    <el-icon class="delete" @click="openDeleteItem(item)"
                      ><Delete
                    /></el-icon>
                  </div>
                </div>
                <!-- 内容 -->
                <div class="channel-content">
                  <el-image fit="contain" class="image" :src="item.logo_url">
                    <template #error>
                      <div class="image-slot">
                        <el-icon :size="30"><Monitor /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="info">
                    <p>频道标识号:{{ item.channel_id }}</p>
                    <p>频道编号:{{ item.channel_number }}</p>
                    <p>EPG编号:{{ item.epg_number }}</p>
                  </div>
                </div>
                <!-- 描述 -->
                <div class="channel-category">
                  <div class="icon-wrap" title="RTSP分组">
                    <el-icon :size="14"><Folder /></el-icon>
                    <span>{{ item.rtsp_group }}</span>
                  </div>
                  <div class="icon-wrap" title="IGMP分组">
                    <el-icon :size="14"><Share /></el-icon>
                    <span>{{ item.igmp_group }}</span>
                  </div>
                </div>
                <div class="channel-epg">
                  <span class="channel-name">EPG频道: {{ item.epg_name }}</span>
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
                <el-image fit="cover" class="image-logo" :src="row.logo_url" />
              </template>
            </el-table-column>
            <el-table-column
              prop="channel_name"
              label="频道名称"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="channel_id"
              label="频道标识号"
              min-width="100"
            />
            <el-table-column
              prop="channel_number"
              label="频道编号"
              min-width="80"
            />
            <el-table-column prop="rtsp_group" label="RTSP分组" width="100" />
            <el-table-column prop="igmp_group" label="IGMP分组" width="100" />
            <el-table-column
              prop="epg_name"
              label="EPG频道名称"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column prop="epg_id" label="EPG标识号" min-width="100" />
            <!-- fixed:right -->
            <el-table-column prop="epg_number" label="EPG编号" min-width="80" />
            <el-table-column align="center" label="操作" width="120">
              <template #default="{ row }">
                <el-button-group>
                  <el-button
                    size="default"
                    type="primary"
                    @click="openSaveIptvDialog('edit', row)"
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
          <el-icon :size="20"><Delete /></el-icon><span>删除定时任务</span>
        </div>
      </template>

      <div class="delete-task">
        <p class="title">确定要删除该的频道吗？此操作不可恢复。</p>
        <div class="msg">
          <span class="msg-label">频道名称：</span>
          <span>{{ deleteItemRow.channel_name }}</span>
        </div>
        <div class="msg" style="margin-top: 4px">
          <span class="msg-label">频道标识号：</span>
          <span>{{ deleteItemRow.channel_id }}</span>
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
      v-model="iptvDetailDialog"
      title="Tips"
      width="500"
      align-center
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
            <el-image fit="contain" :src="iptvDetailRow.logo_url">
              <template #error>
                <div class="image-slot">
                  <el-icon :size="30"><Monitor /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <!-- info -->
          <div class="detail-header-info">
            <p class="title">{{ iptvDetailRow.channel_name }}</p>
            <p class="label">
              频道标识号: <span>{{ iptvDetailRow.id }}</span>
            </p>
            <p class="label">
              RTSP分组: <span>{{ iptvDetailRow.rtsp_group }}</span>
            </p>
            <p class="label">
              IGMP分组: <span>{{ iptvDetailRow.igmp_group }}</span>
            </p>
          </div>
        </div>
        <!-- body -->
        <div class="detail-content">
          <el-tabs
            v-model="detailActiveName"
            class="demo-tabs"
            type="border-card"
          >
            <!-- 基本信息 -->
            <el-tab-pane name="info">
              <template #label>
                <span class="tabs-label">
                  <el-icon class="tabs-icon" :size="16"><Warning /></el-icon>
                  <span class="tabs-title">基本信息</span>
                </span>
              </template>
              <!-- 内容区域 -->
              <el-row>
                <el-col :span="24">
                  <p class="label">台标地址</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.logo_url"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :span="12">
                  <p class="label">频道名称</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.channel_name"
                  ></el-input>
                </el-col>
                <el-col :xs="24" :span="12"
                  ><p class="label">频道标识号</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.id"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :span="12">
                  <p class="label">频道编号</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.channel_number"
                  ></el-input>
                </el-col>
                <el-col :xs="24" :span="12"
                  ><p class="label">EPG编号</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.epg_number"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :span="12">
                  <p class="label">RTSP分组</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.rtsp_group"
                  ></el-input>
                </el-col>
                <el-col :xs="24" :span="12"
                  ><p class="label">IGMP分组</p>
                  <el-input
                    readonly
                    size="large"
                    :value="iptvDetailRow.igmp_group"
                  ></el-input
                ></el-col>
              </el-row>
            </el-tab-pane>
            <!-- 播放链接 -->
            <el-tab-pane name="links">
              <template #label>
                <span class="tabs-label">
                  <el-icon :size="16" class="tabs-icon"><Link /></el-icon>
                  <span class="tabs-title">播放链接</span>
                </span>
              </template>
              <!-- 内容区域 -->
              <el-row>
                <el-col :span="24">
                  <p class="label">RTSP播放链接</p>
                  <el-input
                    size="large"
                    :value="iptvDetailRow.rtsp_url"
                    readonly
                    ref="rtspInput"
                  >
                    <template #prepend>
                      <el-button @click="copyUrl('rtsp')">
                        <template #icon>
                          <el-icon :size="20" title="复制到剪切板"
                            ><CopyDocument
                          /></el-icon>
                        </template>
                      </el-button>
                    </template>
                    <template #append>
                      <el-button @click="goToPlayer('rtsp')">
                        <template #icon>
                          <el-icon :size="24" title="跳转至potPlayer播放"
                            ><CaretRight
                          /></el-icon>
                        </template>
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <p class="label">IGMP播放链接</p>
                  <el-input
                    size="large"
                    :value="iptvDetailRow.igmp_url"
                    ref="igmpInput"
                    readonly
                  >
                    <template #prepend>
                      <el-button @click="copyUrl('igmp')">
                        <template #icon>
                          <el-icon :size="20" title="复制到剪切板"
                            ><CopyDocument
                          /></el-icon>
                        </template>
                      </el-button>
                    </template>
                    <template #append>
                      <el-button @click="goToPlayer('igmp')">
                        <template #icon>
                          <el-icon :size="24" title="跳转至播放器播放"
                            ><CaretRight
                          /></el-icon>
                        </template>
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
              </el-row>
            </el-tab-pane>
            <!-- EPG数据 -->
            <el-tab-pane name="epg">
              <template #label>
                <span class="tabs-label">
                  <el-icon :size="16" class="tabs-icon"><Calendar /></el-icon>
                  <span class="tabs-title">EPG数据</span>
                </span>
              </template>
              <!-- 内容区域 -->
              <!-- 日期选择 -->
              <date-picker-with-buttons
                v-model="epgSelectDate"
                @change="timeChange"
              />
              <div class="list" v-loading="epgDataLoading">
                <!-- 节目列表 -->
                <ul v-if="epgData.length !== 0" class="epg-content">
                  <li
                    class="epg-item"
                    v-for="item in epgData"
                    :key="item.id"
                    :class="playStatus(item.start_time, item.end_time)"
                  >
                    <div class="epg-info">
                      <span class="epg-time"
                        >{{ formatTime(item.start_time) }}-{{
                          formatTime(item.end_time)
                        }}</span
                      >
                      <span class="epg-title">{{ item.title }}</span>
                    </div>
                    <div class="epg-duration">
                      <el-tag type="info" class="duration">{{
                        duration(item.start_time, item.end_time)
                      }}</el-tag>
                      <!-- 回放 -->
                      <span
                        class="btn"
                        title="回放"
                        v-if="
                          playStatus(item.start_time, item.end_time) ===
                          'finished'
                        "
                        @click="
                          openPlayer(
                            item,
                            playStatus(item.start_time, item.end_time)
                          )
                        "
                      >
                        <el-icon><Clock /></el-icon>
                      </span>
                      <!-- 播出 -->
                      <span
                        class="btn"
                        title="跳转"
                        v-if="
                          playStatus(item.start_time, item.end_time) ===
                          'airing'
                        "
                        @click="
                          openPlayer(
                            item,
                            playStatus(item.start_time, item.end_time)
                          )
                        "
                      >
                        <el-icon :size="20"><CaretRight /></el-icon>
                      </span>
                    </div>
                  </li>
                  <!-- <li class="epg-item airing">
                  <div class="epg-info">
                    <span class="epg-time">00:00-00:10</span>
                    <span class="epg-title">重播节目、纪录片</span>
                    <el-tag type="danger" effect="dark" class="epg-broadcasting"
                      >正在播出</el-tag
                    >
                  </div>
                  <div class="epg-duration">
                    <el-tag type="info" class="duration">44分钟</el-tag>
                    <span class="btn">
                      <el-icon :size="20"><CaretRight /></el-icon>
                    </span>
                  </div>
                </li>
                <li class="epg-item upcoming">
                  <div class="epg-info">
                    <span class="epg-time">00:00-00:10</span>
                    <span class="epg-title">重播节目、纪录片</span>
                  </div>
                  <div class="epg-duration">
                    <el-tag type="info" class="duration">44分钟</el-tag>
                  </div>  
                </li> -->
                </ul>
                <el-empty :image-size="100" v-else description="暂无数据" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="info" plain @click="iptvDetailDialog = false"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 添加和修改频道 -->
    <el-dialog
      v-model="saveIptvDialog"
      width="70%"
      align-center
      class="my-dialog primary dialog-max-height"
    >
      <template #header>
        <div class="dialog-title">
          <el-icon :size="20"><Aim /></el-icon>
          <span>{{ saveIptvIsEdit ? "编辑频道" : "添加频道" }}</span>
        </div>
      </template>
      <div class="save-dialog">
        <el-form
          :model="saveIptvForm"
          ref="saveIptvFormRef"
          :rules="saveIptvFormRules"
        >
          <el-row :gutter="20">
            <el-col
              :span="12"
              :xs="24"
              v-for="(_, key) in saveIptvMsg"
              :key="key"
            >
              <el-form-item
                :label="saveIptvMsg[key].label"
                :prop="key"
                label-position="top"
              >
                <el-input
                  size="large"
                  :placeholder="saveIptvMsg[key].placeholder"
                  v-model="saveIptvForm[key]"
                >
                  <template #prepend>
                    <el-button>
                      <template #icon>
                        <el-icon :size="18">
                          <component :is="saveIptvMsg[key].icon" />
                        </el-icon>
                      </template>
                    </el-button>
                  </template>
                </el-input>
                <p class="desc">{{ saveIptvMsg[key].desc }}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveIptvDialog = false">取消</el-button>
          <el-button type="primary" @click="saveIptv" :loading="saveIptvLoading"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </main>
</template>

<style lang="less" scoped>
main.iptv {
  .iptv-header {
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
  .iptv-content {
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
        .channel-category {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-top: 1px solid #e1e4e8;
          border-bottom: 1px solid #e1e4e8;
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 10px;
          .icon-wrap {
            display: flex;
            align-items: center;
            .el-icon {
              margin-right: 6px;
            }
          }
        }
        .channel-epg {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #6c757d;
          font-size: 14px;
          padding: 4px 0;
          // 不允许换行，换行出现省略号
          flex-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

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
        .detail-header-info {
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
      .tabs-label {
        display: flex;
        align-items: center;
        .tabs-icon {
          margin-right: 4px;
        }
        .tabs-title {
          font-size: 16px;
        }
      }
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
      .list {
        overflow-x: auto;
      }
      .epg-content {
        padding: 0;
        margin-top: 15px;
        min-width: 450px;
        margin-bottom: 20px;
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
              // 文字溢出显示省略号
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              line-clamp: 1;
              -webkit-box-orient: vertical;
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