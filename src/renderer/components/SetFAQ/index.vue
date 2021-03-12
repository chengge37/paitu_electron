<template>
    <div>
    	<!--设置问题对话框-->
		<el-dialog  class="FAQdialog" title="设置问题" :visible.sync="showFAQlist" @close="closeFAQtable" center>
			<el-table ref="FAQtable" :data="FAQlist" @selection-change="changeSelect">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" label="序号">
				</el-table-column>
				<!--<el-table-column property="create_time" label="创建时间"></el-table-column>-->
				<el-table-column  label="创建时间" align="center">
			      	<template slot-scope="scope">
			          <span>{{scope.row.create_time|time2Date}}</span>
			        </template>
			      </el-table-column>
				<el-table-column property="content" show-overflow-tooltip label="问题"></el-table-column>
				<el-table-column property="relpy" show-overflow-tooltip label="回答"></el-table-column>
				<el-table-column  label="状态" align="center">
			      	<template slot-scope="scope">
			          <span v-if="scope.row.is_valid==1">已上架</span>
			          <span v-else class="noValid">未上架</span>
			        </template>
			      </el-table-column>
			</el-table>

			<!--分页模块-->
			<div class="tableFoot">
				<div class="bottomBtn">
					<el-button type="primary" class="confirmBtn" @click="setFAQ">保存</el-button>
					<el-button class="cancelBtn" @click="closeFAQtable">取消</el-button>
				</div>
			</div>
		</el-dialog>
    </div>
</template>

/*                  设置关联问题组件
 *        (1)openlogin,接受一个Boolean，是否显示对话框
      	  (2)type，接受一个String，1/影棚,2/设备 ，默认为1
 *        (3)id,接受一个String，传过来的影棚或者设备id
 		  (4)返回一个closeFAQtable，关闭对话框方法
 */
<script>
	import { mapGetters } from "vuex";
    export default {
    	props: {
    		//是否显示对话框，默认不显示
		    openDialog: {
		      type: Boolean,
		      default: false
		    },
		    //type,1/影棚，2/设备,默认1
		    type:{
		    	type:String,
		    	default:'1'
		    },
		    //传过来的影棚,设备id
		    id:{
		    	type:String,
		    	default:''
		    }
		},
        data(){
            return{
            	showFAQlist:this.openDialog,//是否显示设置问题对话框
	            FAQlist:null,   //常见问题FAQ列表
	            selectFAQ:[],
	            selectId:this.id,  //选择关联的id
	            questionList:[], //设备已经关联的问题列表
            }
        },
        watch:{
        	openDialog(to) {
		      this.showFAQlist = to;
		    },
        },
        computed: {
			...mapGetters(["user_data"])
		},
		mounted(){
			this.getFAQlist();
		},
        methods:{
       	//关闭对话框方法
       	closeFAQtable(){
       		this.$emit('closeFAQtable',false);
       	},
        //改变选项返回的方法
    	changeSelect(val){
    		this.selectFAQ=val;
    	},
    	//设置关联问题方法
    	setFAQ(){
    		//根据数据转换为以逗号隔开的字符串
    		let idList='';
    		this.selectFAQ.forEach((item,index)=>{
    			idList+=item.id+',';
    		})
    		if(idList){
    			idList=idList.substr(0,idList.length-1);
    		}else{
    			idList=0;
    		}
    		let params={
    			obj_id:this.selectId,
    			type:this.type,
    			qid:idList
    		}
    		this.util.operateFAQ(params).then(res=>{
    			this.$message.success('设置成功！');
    			this.showFAQlist=false;
    		})
    	},
    	//获取设备对应关联的常见问题列表
		getFAQById(){
			return new Promise((resolve,reject)=>{
				this.util.getFAQById(this.type,this.selectId).then(res=>{
					this.questionList=res;
					resolve(true);
				})
			})
			
		},
    	//获取常见问题FAQ列表数据
    	getFAQlist(){
    		let params={
				page:1,
				page_size:10000,
				uid:this.user_data.id,
			}
			this.util.getFAQlist(params).then(res=>{
				this.FAQlist=res.rows;
				
				//获取关联的问题
				this.getFAQById().then(res=>{
					this.$nextTick(()=>{
						this.questionList.forEach((item,index)=>{
							this.FAQlist.forEach((item2,index2)=>{
								if(item.id==item2.id){
									this.$refs.FAQtable.toggleRowSelection(this.FAQlist[index2],true)
								}
							})
						})
					})
				})
			})
    	},
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.FAQdialog{
	.el-table{
		height:370px;
		overflow-y:auto;
	}
	.tableFoot{
		.btns{
			display:flex;
			justify-content:flex-end;
		}
	}
}
</style>