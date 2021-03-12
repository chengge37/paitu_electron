<template>
  <div class="staffLogin-box">
    <ali-svg-icon icon-class="logo" class-name="login-logo"></ali-svg-icon>
    <div class="login-txt">派图影像管理软件</div>
    <div class="login-box">
      <div class="login-title">登录</div>
      <div class="staff-txt">影像管理软件</div>
      <el-form :model="loginForm" class="form-box" :rules="loginRules" ref="loginForm">
        <el-form-item prop="mobile">
          <el-input type="text" placeholder="请输入手机号" v-model="loginForm.mobile"></el-input>
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            :type="pwdType"
            @keyup.enter.native="handleLogin"
            placeholder="请输入密码"
            v-model="loginForm.pwd"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <ali-svg-icon :icon-class="pwdType ==='password'?'eye':'eye-open'"></ali-svg-icon>
          </span>
        </el-form-item>
        <!-- <el-form-item>
          <el-radio-group v-model="isMaster">
            <el-radio :label="1">管理登录</el-radio>
            <el-radio :label="2">员工登录</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>

      <el-button type="primary" @click="handleLogin" class="login-btn">确定</el-button>
      <div class="account" @click="reg">
        没有账号?请到
        <span>paitume.com</span>
        注册账号
      </div>
    </div>
    <Dialog></Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog/index";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        mobile: "",
        pwd: ""
      },
      loginRules: {
        Mainmobile: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        mobile: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        pwd: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      isMaster: 1
    };
  },
  components: {
    Dialog
  },
  methods: {
    reg() {
      this.$electron.shell.openExternal("https://www.paitume.com/login");
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/serve/work/WorkBench" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.staffLogin-box {
  width: 100vw;
  height: 100vh;
  background: #fafafa;
  overflow: hidden;
  & .login-logo {
    display: block;
    width: 100px !important;
    height: 100px !important;
    margin: 0 auto;
    margin-top: 5%;
    margin-bottom: 13px;
    box-sizing: border-box;
  }
  & .login-txt {
    width: 100%;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC;
    font-weight: 500;
    color: #666;
    margin-bottom: 83px;
    box-sizing: border-box;
  }
  .form-box {
    text-align: center;
    .show-pwd {
      position: absolute;
      top: 4px;
      right: 15px;
    }
  }
  & .login-box {
    width: 398px;
    background: #ffffff;
    border: 1px solid rgba(240, 240, 240, 1);
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 30px;
    box-sizing: border-box;
    padding-bottom: 30px;
    text-align: center;
    & .login-title {
      width: 60px;
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC;
      font-weight: 500;
      color: #7c6aff;
      line-height: 42px;
      margin-bottom: 12px;
    }
    & .staff-txt {
      width: 144px;
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC;
      font-weight: 400;
      color: #333333;
      line-height: 25px;
      margin-bottom: 30px;
    }
    & input {
      width: 338px;
      height: 46px;
      background: #fafafa;
      border: 1px solid rgba(240, 240, 240, 1);
      font-size: 14px;
      padding-left: 16px;
      margin-bottom: 12px;
    }
    & .login-btn {
      width: 338px;
      color: #fff;
      text-align: center;
      border: 0;
    }
  }
}
.account {
  margin-top: 20px;
  cursor: pointer;
  span {
    color: #7c6aff;
  }
}
</style>
