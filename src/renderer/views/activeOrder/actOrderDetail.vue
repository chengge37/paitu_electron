<template>
	<div class="newServe">
    <div class="card">
      <div class="top-nav">
          <div class="top-title">基本信息</div>
      </div>
      <el-form v-model="orderDetail" :label-width="labelWidth" label-position="left">
        <el-row>
            <el-form-item label="下单时间" >
              <p class="text-right" >{{orderDetail.create_time_str}}</p>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="订单状态" >
              <p class="text-right" >{{orderDetail.pay_status | statusStr}}</p>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="活动类型" >
              <p class="text-right" v-if="orderDetail.type=='1'">线上活动</p>
              <p class="text-right" v-else>线下活动</p>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="订单编号" >
              <p class="text-right" >{{orderDetail.show_id}}</p>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单金额" >
            <p class="text-right" >￥{{orderDetail.fee}}</p>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    
    <div class="card">
      <div class="top-nav">
          <div class="top-title">所属活动</div>
      </div>

      <div class="act-content">
        <div class="card-left">
          <img class="act-pic" :src="$qiniuHost+activityDetail.pic" />
        </div>
        <div class="card-right">
          <el-form v-model="activityDetail" :label-width="labelWidth" label-position="left" class="act-detail">
              <el-form-item label="活动名称" >
                <p class="text-right" >{{activityDetail.name}}</p>
              </el-form-item>
              <el-form-item label="活动摘要" >
                <p class="text-right">{{activityDetail.brief}}</p>
              </el-form-item>
          
              <el-form-item label="活动开始" >
                <p class="text-right">{{activityDetail.start_time}}</p>
              </el-form-item>
          
              <el-form-item label="活动结束" >
                <p class="text-right" >{{activityDetail.end_time}}</p>
              </el-form-item>
          
            <el-form-item label="人数限制" >
              <p class="text-right" >{{activityDetail.max_person}}</p>
            </el-form-item>
          
            <el-form-item label="活动价格" >
              <p class="text-right" >￥{{activityDetail.fee}}</p>
            </el-form-item>
          
            <el-form-item label="活动地址" >
              <p class="text-right" >{{activityDetail.address}}</p>
            </el-form-item>
           
          </el-form>
        </div>
      </div>
    </div>

    <div class="card" v-if="orderDetail.user&&orderDetail.user.id">
      <div class="top-nav">
          <div class="top-title">人员信息</div>
      </div>
      <div class="user-box">
        <div class="img-left">
          <img class="avatar-img" :src="$qiniuHost+orderDetail.user.avatar" :alt="orderDetail.user.nick" :onerror="util.maleAvatar">
        </div>
        <div class="form-right">
          <el-form v-model="orderDetail.user" :label-width="labelWidth" label-position="left">
            <el-row class="row-item">
              <el-form-item label="客户名称" class="col-item">
                <p class="text-right" >{{orderDetail.user.nick}}</p>
              </el-form-item>
              <el-form-item label="联系方式" class="col-item">
                <p class="text-right" >{{orderDetail.user.mobile}}</p>
              </el-form-item>
            </el-row>
            <el-row class="row-item">
                <el-form-item label="客户公司" class="col-item">
                  <p class="text-right" v-if="orderDetail.user.company">{{orderDetail.user.company}}</p>
                  <p class="text-right" v-else>暂无公司</p>
                </el-form-item>
                <el-form-item label="客户地址" class="col-item">
                  <p class="text-right" v-if="orderDetail.user.company">{{orderDetail.user.company}}</p>
                  <p class="text-right" v-else>暂无公司</p>
                </el-form-item>
            </el-row>
            <el-row class="row-item">
                <el-form-item label="生日" class="col-item">
                  <p class="text-right" v-if="orderDetail.user.birthday">{{orderDetail.user.birthday}}</p>
                  <p class="text-right" v-else>暂无生日</p>

                </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	import { activity } from "@/config/api";
	import { format } from 'date-fns';
	export default {
		components: {
			
		},
		data() {
			return {
        orderDetail:{},
        activityDetail:{},
        labelWidth:'90px'
			};
		},
		filters: {
			statusStr(status) {
				const statusMap = {
					"0": "已关闭",
					"1": "未支付",
					"2": "已支付",
					"5": "活动中",
					"7": "等待评论",
					"8": "评论结束",
				};
				return statusMap[status];
			},
		},
		created() {},
		mounted() {
            this.getActOrderDetail();
            this.getActivityDetail()
		},
		methods: {
			getActOrderDetail(){
          this.getRequest(activity.server_get_order,{id:this.$route.query.id}).then(res => {
            console.log(res,'---------');
              this.orderDetail = res;
              this.orderDetail.create_time_str = format(this.orderDetail.create_time*1000,'YYYY-MM-DD')
              console.log('res===',res)
          })
      },
      getActivityDetail(){
        this.getRequest(activity.serve_activity_list,{id:this.$route.query.act_id}).then(res => {
          this.activityDetail = res;
        })
      },
			
		},
		watch: {
			
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.card{
  background-color: #ffffff;
  padding: 10px 30px;
  margin-bottom: 30px;
}
.top-nav {
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  .top-title {
    padding-bottom: 20px;
    padding-top: 35px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    // border-bottom: 4px solid $Theme-color;
  }
}	
.act-content{
  display: flex;
  padding: 20px 0;
  .card-left{
    margin-right: 30px;
    .act-pic{
      width:453px;
      height:340px;
    }
  }
  .act-detail /deep/ .el-form-item{
    margin-bottom: 0;
  }
}
.user-box{
  display: flex;
  align-items: center;
  .avatar-img{
    width:100px;
    height:100px;
    margin-right: 30px;
  }
  .row-item{
    display: flex;
    & /deep/ .el-form-item{
      margin-bottom: 0;
    }
    .col-item{
      width: 350px;
      margin-right: 30px;
    }
  }
}
</style>