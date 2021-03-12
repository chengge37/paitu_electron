
<template>
  <div class="login-bbox">
    <el-dialog :visible.sync="isShow" class="dialog" @closed="closed" title="退款审核" center>
      <div class="login-box">
      	
   			<el-form label-width="80px" ref="form" :model="form" :rules="rules">
   				
	          <el-form-item label="是否同意" prop="opt">
					    <el-radio-group v-model="form.opt" @change="changeType">
					      <el-radio label="1">同意</el-radio>
					      <el-radio label="2">拒绝</el-radio>
					    </el-radio-group>
					  </el-form-item>
    		
		       	<el-form-item label="审核原因" prop="refund_answer">
					    <el-input type="textarea" v-model="form.refund_answer" :placeholder="'默认为：'+placeholder"></el-input>
					  </el-form-item>
					  
					  <el-form-item>
					    <el-button  @click="save" class="defaultBtn">提交</el-button>
					    <el-button @click="resetForm">重置</el-button>
					  </el-form-item>
					  
			  </el-form>
  	
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*                  操作退款组件
 *        接受参数是openRefund,接受一个布尔值
 *        关联方法 closed 
 */
export default {
  props: {
  	openRefund: {
      type: Boolean,
      default: false
   },
   orderId:{
   	type:String,
   	default:'',
   },
   orderType:{
   	type:String,
   	default:'',
   }
  },
  data() {
    return {
      isShow: this.openRefund,
      order_id:this.orderId,
      order_type:this.orderType,
      placeholder:'同意',  //文本框提示语
      form:{
      	opt:'1',   //1：同意  2：拒绝
      	refund_answer:'',   //审核原因
      },
      optList:['同意','拒绝'],
      rules:{
      	opt: [
	        { required: true, message: '请选择选项', trigger: 'blur' },
	      ],
      	refund_answer: [
	        { required: true, message: '请输入内容', trigger: 'blur' },
	      ],
      }
    };
  },
  watch: {
    
    openRefund(to) {
      this.isShow = to;
    },
    orderId(to) {
      this.order_id = to;
    },
    orderType(to) {
      this.order_type = to;
    },

  },
  components: {},

  mounted() {
  	
    console.log("miniLogin--------------------------",this.openRefund);
  },

  methods: {
  	
  	//保存方法
  	save(){
  		console.log('save----------',this.form);
  		let params={
	  			order_id:this.order_id,
	  			order_type:this.order_type,
	  			refund_answer:this.form.refund_answer,
	  			opt:this.form.opt
  		}
  		if(!this.form.refund_answer){
  			if(this.form.opt==1){
  				params.refund_answer=this.optList[0];
  			}else{
  				params.refund_answer=this.optList[1];
  			}
  		}
  		console.log('params----------',params);
  		this.util.serveRefundAnswer(params).then(res=>{
  			console.log('serveRefundAnswer-------',res);
  			this.$message.success('审核成功！');
  			this.closed('reload');
  		})
  	},
  	
  	//修改类型方法
  	changeType(val){
  		console.log('changeType----',val,this.form.type);
  		this.form.refund_answer='';
  		if(val==1){
				this.placeholder=this.optList[0];
  		}else{
				this.placeholder=this.optList[1];
  		}
  	},
  	
  	//重置表格方法
  	resetForm(){
  		this.form.opt='1';
  		this.form.refund_answer='';
  		this.placeholder=this.optList[0];
  	},
  	
  	//关闭窗口方法
    closed(type){
  		this.$emit('closed',type);
  	}
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import "@/styles/color.scss";

</style>
