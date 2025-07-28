<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axiosConfig";
import request from "@/api/request.js";
const router = useRouter();

// 表单数据
const form = ref({
  username: "123456",
  password: "12345678",
});
// 验证规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 60 个字符", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]+$/,
      message: "不允许特殊字符，只允许包含英文字母和数字",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 8,
      max: 20,
      message: "密码长度必须在 8 到 20 个字符之间",
      trigger: "blur",
    },
  ],
};
const formRef = ref(null);
const loading = ref(false);
const loginUrl = "/login";

const login = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const params = form.value;
        // 发起登录请求
        // const { data: res } = await axios.post(loginUrl, params);
        // localStorage.setItem("token", res.token);
        // ElMessage.success("登录成功！");
        // 登录成功后跳转到首页
        // router.push({ name: "home" });
        const data = await request.get(loginUrl, { params });
        if (data.code === 200) {
          const token = data.data.token;
          localStorage.setItem("token", token);
          ElMessage.success("登录成功！");
          // 登录成功后跳转到首页
          router.push({ name: "home" });
        } else {
          ElMessage.error(data.msg || "登录失败");
        }
      } catch (error) {
        ElMessage.error(error.message || "请求失败");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<template>
  <main>
    <el-card>
      <!-- 标题 -->
      <div class="login-header">
        <h1 class="title">IPTV管理系统</h1>
      </div>
      <!-- 表单区域 -->
      <div class="login-body">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="username">
            <p>用户名</p>
            <el-input placeholder="请输入用户名" v-model="form.username">
              <template #prepend
                ><el-icon :size="16"><User /></el-icon></template
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <p>密码</p>
            <el-input
              placeholder="请输入密码"
              type="password"
              v-model="form.password"
            >
              <template #prepend>
                <el-icon :size="16"><Lock /></el-icon> </template
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" :loading="loading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </main>
</template>

<style lang="less" scoped>
main {
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-light-3) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  .el-card {
    width: 420px;
    margin: 10%;
    padding: 20px 20px 0 20px;

    .login-header {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      .title {
        color: var(--el-color-primary-dark-2);
        font-size: 24px;
        font-weight: 600;
      }
    }
    .login-body {
      p {
        color: #555;
        font-weight: 500;
        font-size: 16px;
      }
      .el-input {
        width: 100%;
        height: 45px;
      }
      .el-button {
        width: 100%;
        height: 52px;
        margin-top: 30px;
      }
    }
    @media screen and (max-width: 768px) {
      .login-header {
        margin-bottom: 8px;
      }
      .el-form-item {
        margin-bottom: 8px;
      }
      .el-button {
        margin-top: 15px !important;
      }
    }
  }
}
</style>