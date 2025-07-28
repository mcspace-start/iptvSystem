<script setup>
import { ref, watch } from "vue";

// 定义props和emits，默认date
const props = defineProps({
  modelValue: {
    type: Date,
    default: () => undefined,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "increase",
  "decrease",
  "change",
]);

// 使用计算属性处理双向绑定
const date = ref(props.modelValue || new Date());

// 监听props变化
watch(
  () => props.modelValue,
  (newVal) => {
    date.value = newVal;
  }
);
// 监听内部值变化
watch(date, (newVal) => {
  emit("update:modelValue", newVal);
});

const increaseDate = () => {
  if (date.value && date.value instanceof Date) {
    date.value = new Date(date.value.getTime() + 60 * 60 * 24 * 1000); // 增加一天
    emit("increase", date.value);
    emit("change", date.value);
  } else {
    ElMessage.warning("请输入一个日期");
  }
};

const decreaseDate = () => {
  if (date.value && date.value instanceof Date) {
    date.value = new Date(date.value.getTime() - 60 * 60 * 24 * 1000); // 减少一天
    emit("decrease", date.value);
    emit("change", date.value);
  } else {
    ElMessage.warning("请先输入一个日期");
  }
};
</script>
<template>
  <div class="date-picker-with-buttons">
    <el-button type="primary" plain @click="decreaseDate">
      前<span class="hidden-xs-only">一天</span>
    </el-button>
    <div class="date-wrap">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        readonly
        size="default"
        :clearable="false"
        style="width: 100%"
      />
    </div>

    <el-button type="primary" plain @click="increaseDate"
      >后<span class="hidden-xs-only">一天</span></el-button
    >
  </div>
</template>

<style lang="less" scoped>
.date-picker-with-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  .date-wrap {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .date-picker-with-buttons {
    gap: 4px;
  }
  .el-button {
    width: 20px;
  }
}
</style>