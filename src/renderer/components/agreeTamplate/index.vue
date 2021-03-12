<template>
  <div class="newServe">
    <!--协议模板表格-->
		<el-dialog  class="TemplateDialog" :title="tableTitle" :visible.sync="showTemplate" @close="closeTemplate" center>
			<el-button @click="toAddTemplate" v-if="showList" class="defaultBtn">添加模板</el-button>
			<el-table ref="templateList" :data="templateList" v-if="showList">
				<el-table-column type="index" label="序号">
				</el-table-column>
				<el-table-column  prop="title" label="名称" align="center"></el-table-column>
				<el-table-column  prop="content" label="内容" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip>
            <template class="operation-btn" slot-scope="scope">
                <el-button type="text" @click="toEditTemplate(scope.row.id)">详情/修改</el-button>
                <el-button type="text" @click="delTemplate(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
			</el-table>


			<div class="templateDetail" v-if="!showList">
				<!--模板详情模块-->
				<div class="templateName">
					<span>模板名称:</span>
					<el-input v-model="title" placeholder="标题长度为2-32个字符"></el-input>
				</div>
	
				<div class="agreeMent">
					<tinymce v-model="content" :height="300" />
				</div>
			</div>

			<!--分页模块-->
			<div class="tableFoot" v-if="!showList">
				<div class="bottomBtn">
					<el-button type="primary" class="color-area" @click="addTemplate" v-if="operateType==1">添加</el-button>
					<el-button type="primary" class="color-area" @click="editTemplate" v-if="operateType==2">修改</el-button>
					<el-button type="default" @click="showList=true">取消</el-button>
				</div>
			</div>
		</el-dialog>
  </div>
</template>

/*                  协议模板模块组件
 *        (1)openlogin,接受一个Boolean，是否显示对话框
 *				(2)返回一个closeTemplate，关闭对话框方法
 */

<script>
import Tinymce from "ServeComponents/Tinymce";
export default {
 	props: {
		//是否显示对话框，默认不显示
	    openDialog: {
	      type: Boolean,
	      default: false
	    },
	},
  data() {
    return {
    	templateList:[],
    	showList:true,  //是否显示模板列表，默认显示
    	tableTitle:'协议模板列表',   //默认表格标题
    	showTemplate:this.openDialog,//是否显示设置问题对话框
    	title:'',
    	content:'',
    	operateType:0,  //操作状态  1/添加  2/修改
    	selectTemplate:null,   //选择的模板
    };
  },
  watch:{
		openDialog(to) {
      this.showTemplate = to;
    },
	},
	components:{
		Tinymce
	},
  created() {
  	
  },
  mounted(){
  	this.getCheckTplList();
  },
  methods: {
  	
  	//添加模板方法
  	addTemplate(){
  		let params={
  			title:this.title,
  			content:this.content
  		}
  		console.log('params--------',params);
  		this.util.serveAddCheckTpl(params).then(res=>{
  			console.log("serveAddCheckTpl----",res);
  			this.$message.success("添加协议模板成功！");
  			this.showList=true;
  			this.getCheckTplList();
  			this.operateTemplateSuccess();
  		})
  	},
  	
  	//修改模板方法
  	editTemplate(){
  		let params={
  			tpl_id:this.selectTemplate.id,
  			title:this.title,
  			content:this.content,
  		}
  		
  		this.util.serveEditCheckTpl(params).then(res=>{
  			this.$message.success("修改协议模板成功！");
  			this.showList=true;
  			this.getCheckTplList();
  			this.operateTemplateSuccess();
  		})
  	},
  	
  	//操作协议模板成功回调方法
  	operateTemplateSuccess(){
  		this.$emit('addTemplateSuccess',true);
  	},
  	
  	//删除模板方法
  	delTemplate(id){
  		this.util.confirm(this).then(res=>{
  			if(res){
  				console.log('delTemplate-----------',id);
  				this.util.serveDelCheckTpl(id).then(res=>{
  					this.$message.success('删除模板成功！');
  					this.getCheckTplList();
  					this.operateTemplateSuccess();
  				})
  			}
  		}).catch(error=>{});
  	},
  	
  	//点击添加模板方法
  	toAddTemplate(){
  		this.showList=false;
  		this.operateType=1;
  		this.title='';
  		this.content='';
  	},
  	
  	//点击修改模板方法
  	toEditTemplate(id){
  		this.showList=false;
  		this.operateType=2;
  		//根据id查询模板
  		this.getTemplateById(id);
  	},
  	
  	//根据id查询模板
  	getTemplateById(id){
  		this.util.serveGetCheckTpl(id).then(res=>{
  			console.log('serveGetCheckTpl------',res);
  			this.selectTemplate=res;
  			this.title=res.title;
  			this.content=res.content;
  		})
  	},
  	
  	//获取协议模板列表
    getCheckTplList(){
    	this.util.serveGetCheckTplList().then(res=>{
    		console.log('serveGetCheckTplList------',res);
    		this.templateList=res.rows;
    	})
    },
    
    //关闭对话框方法
   	closeTemplate(){
   		this.$emit('closeTemplate',false);
   	},
   	
  }
};
</script>

<style lang="scss" scoped>
.el-table{
	margin-top:20px;
}
.templateName{
	display:flex;
	align-items:center;
	.el-input{
		width:200px;
		margin-left:10px;
	}
}
.agreeMent{
	margin:20px 0px;
}
</style>