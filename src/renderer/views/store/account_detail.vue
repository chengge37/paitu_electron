<!--  -->
<template>
  <div class="order-container">
    <div class="top-nav">
      <div class="top-title">{{title}}</div>
      <div @click="back" class="back">
        <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
        <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
        <span>返回</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="form-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="85px" :inline="false">
        <el-card class="card-set">
          <div class="info-set">
            <div class="info-icon"></div>
            <div class="info-title">员工信息</div>
          </div>

          <el-row :gutter="0">
            <el-col :span="7" class="short-input">
              <el-form-item label="账号:" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号码:" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" class="short-input">
             
              <el-form-item label="昵称:">
                <el-input v-model="form.nick"></el-input>
              </el-form-item>
              
              <el-form-item label="密码:" prop="pwd" v-if="type==0">
                <el-input type="password" v-model="form.pwd"></el-input>
              </el-form-item>
              
              <el-form-item label="密码:" prop="pwd2" v-if="type==1">
                <el-input type="password" v-model="form.pwd2"></el-input>
              </el-form-item>
              
              <el-form-item label="状态:">
                <el-radio-group v-model="form.status">
							    <el-radio label="1">启用</el-radio>
							    <el-radio label="0">禁用</el-radio>
							  </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        
        
        <el-card>
        	<!--权限管理模块-->
					<div class="limit radio-setting">
						<div class="info-set">
	            <div class="info-icon"></div>
	            <div class="info-title">账号权限</div>
	          </div>
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selectAll">全选</el-checkbox>
					  <div style="margin: 15px 0;"></div>
					  <el-checkbox-group v-model="roleList" @change="changeLimit">
					    <!--<el-checkbox v-for="(item,index) in menuList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>-->
					    <el-checkbox v-for="(item,index) in menuList" :label="item.menuRole" :key="item.menuRole">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
					</div>
        	
        </el-card>
        
      </el-form>
    </div>

		

    <div class="bottom-button">
      <el-button type="default"  @click="back">返回</el-button>
      <el-button type="primary" v-if="type==0" @click="operateAccount('add')">保存</el-button>
      <el-button type="primary" v-if="type==1" @click="operateAccount('update')">修改</el-button>
    </div>

   
  </div>
</template>

<script>
export default {
  data() {
			return {
				accountId:'',
				type:0,
				test:'1',
				title:'添加账号',
				form:{
					name:'',
					mobile:'',
					pwd:'',
					pwd2:'',
					nick:'',
					remark:'',
					status:'1',
				},
				rules: {
		      name: [
	          { required: true, message: "请输入账号", trigger: "blur" },
	          { min: 6, max: 15, message: "长度在 6到15位", trigger: "blur" }
	        ],
	        pwd: [
	          { required: true, message: "请输入密码", trigger: "blur" },
	          { min: 6, max: 15, message: "长度在 6到15位", trigger: "blur" }
	        ],
	        pwd2: [
	          { required: false, message: "请输入密码", trigger: "blur" },
	          { min: 6, max: 15, message: "长度在 6到15位", trigger: "blur" }
	        ],
	        mobile: [
	          { required: true, message: "请输入手机", trigger: "blur" },
	          { validator: this.validate.validatePhone, trigger: "blur" }
	        ],
		   },
		   	checkAll:false,
		   	menuList:[],
		   	roleList:[],
		   	isIndeterminate:true,
		   	role:0
			};
		},

  components: {},

  created() {
		console.log('this.$route.query---------',this.$route.query.id);
		let id=this.$route.query.id;
		if(id){
			this.accountId=id;
			this.type=1;
			this.title="修改账号";
			this.getAccountById();
		}
		console.log('this.accountId----------',this.accountId);
  },

  mounted() {
  	this.menuList=this.util.getServeMenuList(this);
  	console.log('menuList----------',this.menuList);
  },

  methods: {
  	//返回
  	back(){
  		console.log('back---------');
  		//返回到员工列表账号模块
  		this.$router.push({path:'/serve/employee_set/employee_set',query:{id:'2'}});
  	},
  	//根据id获取子账号信息
  	getAccountById(){
  		this.util.storeAccountById(this.accountId).then(res=>{
  			console.log('getAccountById---------',res);
  			this.form=res;
  			//加载相关权限
				if(this.form.role>0){
					this.roleList=this.util.getAccountRole(this,this.form.role);
					if(this.roleList.length==this.menuList.length){
						this.checkAll=true;
						this.isIndeterminate=false;
					}
					console.log('this.roleList---------',this.roleList);
				}

  		})
  	},
   	//保存、修改账号
   	operateAccount(type){
   		if(type=='add'){
   			console.log('this.form------------',this.form);
   			this.$refs["form"].validate(valid => {
   				if(valid){
   					//如果添加了权限，把参数传过去
   					if(this.role){
   						this.form.role=this.role;
   					}
   					this.util.storeAddAccount(this.form).then(res=>{
		   				this.$message.success('添加账号成功！');
		   				console.log('storeAddAccount--------',res);
		   				this.back();
		   			})
   				}
   			})
   		}else if(type=='update'){
   			this.$refs["form"].validate(valid => {
   				if(!valid) return;
	   			let params={
	   				id:this.form.id,
	   				name:this.form.name,
	   				mobile:this.form.mobile,
	   				nick:this.form.nick,
	   				remark:this.form.remark,
	   				role:this.role,
	   				status:this.form.status
	   			}
	   			if(this.form.pwd2){
	   				params.pwd=this.form.pwd2;
	   			}
	   			this.util.updateAccountDetail(params).then(res=>{
	   				this.$message.success('修改成功！');
	   				console.log('updateAccountDetail--------',res);
	   				this.back();
	   			})
   			})
   		}
   	},
   	
   	//权限全选
   	selectAll(val){
   		console.log('handleCheckAllChange----------',val,this.menuList);
   		let allList=[];
   		this.menuList.forEach(v=>{
   			allList.push(v.menuRole);
   		})
   		this.roleList = val ? allList : [];
      this.isIndeterminate = false;
      this.changeLimit(this.roleList);
      console.log('this.roleList-----------',this.roleList);
   	},
   	//单个权限选择
   	changeLimit(val) {
   		//将字符串反转后转为二进制数值
			this.role=0;
			val.forEach((item,index)=>{
				this.role+=item;
			})
   		console.log('changeLimit---------',this.role);
	    let checkedCount = val.length;
	    this.checkAll = checkedCount === this.menuList.length;
	    this.isIndeterminate = checkedCount > 0 && checkedCount < this.menuList.length;
    }
   	
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.top-nav {
  justify-content: space-between;
  .top-title {
    padding-bottom: 20px;
    padding-top: 35px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    border-bottom: 4px solid $Theme-color;
  }
  .back {
    cursor: pointer;
    .back-one {
      margin-right: -26px;
    }
    .back-two {
      margin-right: 2px;
    }
  }
}
.form-box{
	.el-card{
		margin-bottom:15px;
	}
}
.radio-setting{
    /deep/ {
        .el-radio {
            margin-right: 20px;
            margin-bottom:5px;
        }

        .el-radio__label {
            padding-left: 0px;
            color: #303133;
            font-weight: 600;
        }

        .el-radio__input {
            display: none;
        }

        .el-radio__input.is-checked+.el-radio__label {
            color: #7C6AFF;

            .gang {
                background: #7C6AFF;
            }
        }

        .el-checkbox {
            margin-right: 20px;
        }

        .el-checkbox__input.is-focus .el-checkbox__inner {
            border-color: #DCDFE6;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #7C6AFF;
            border-color: #7C6AFF;
        }

        .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #7C6AFF;
        }

        .el-checkbox__label {
            padding-left: 5px;
        }

        .el-checkbox__inner {
            border-radius: 0px;
            background: #F0F0F0;
        }
    }
}
</style>