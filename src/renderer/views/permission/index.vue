<template>
	<div class="info">
		<div class="leftInfo">
			<div class="topInfo">
				<p>组别和人员</p>
				<search-box @change="search" placeholder="输入姓名筛选"></search-box>
			</div>
			<el-tree   highlight-current ref="tree" :data="groupList" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode">
			</el-tree>
		</div>
		<div class="rightInfo">
			<div class="topInfo">
				<p class="title">权限设置</p>
				<span v-if="personName">({{personName}})</span>
			</div>
			<ul v-if="personName && selectUserRole!=1">
				<li v-for="(item,index) in menuList" :key="index">
					<p>{{item.title}}</p>
					<div class="limit">
						<div class='menu_role'>
							<span>访问权限</span>
							<el-switch @change="changeStatus" v-model="item.menu_role" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
							<span class='green' v-if="item.menu_role">启用</span>
							<span class='red' v-else>禁用</span>
						</div>
						<div class='op_role'>
							<span>操作权限</span>
							<el-switch :disabled="!item.menu_role" @change="changeStatus" v-model="item.op_role" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
							<span class='green' v-if="item.op_role">启用</span>
							<span class='red' v-else>禁用</span>
						</div>
					</div>
				</li>
			</ul>
			<div class='noSelect' v-if="!personName && selectUserRole!=1">
				请在左侧选择人员进行操作！
			</div>
			<div class='noSelect' v-if="personName && selectUserRole==1">
				你选择的是管理员，无法操作！
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import searchBox from 'ServeComponents/searchBox'
	export default {
		data() {
			return {
				searchName:'', //搜索员工文本
				groupList:[],
				defaultProps: {
		          children: 'employeeList',
		          label: 'nick'
		       },
		       menuList:[],
		       filterText:'',
		       personName:'',
		       selectPerson:null,
		       selectUserRole:0,  //0普通员工，1：管理员
			}
		},
		
		watch: {
	      filterText(val) {
	        this.$refs.tree.filter(val);
	      }
	    },
	    
		computed: {
			...mapGetters(["user_data"])
		},
		
		components:{
			searchBox
		},
		
		created() {
			//获取分组管理
			this.getEmployeeGroup();
		},
		
		mounted(){
			//获取后台菜单
				console.log("----------------------------------哈---------------------------------------------");
				let list=this.util.getServeMenu(this);
				console.log(list,"--------------------------------哈-----------------------------------------------");
  			this.menuList=list.map((item,index)=>{
				  console.log(item)
  				let obj={
  					title:item.meta.title,
  					roles1:item.meta.roles1,
  					menu_role:false,
  					op_role:false
  				}
  				return obj;
  			})
  			console.log('this.menuList--------',this.menuList);
		},
		
		methods: {
			//获取所有员工列表
			getEmployeeList(){
				return new Promise((resolve,reject)=>{
					this.util.getEmployeeList().then(res=>{
						resolve(res.rows);
					})
				})
				
			},
			
			//获取员工分组列表
		    getEmployeeGroup() {
		      this.util.getEmployeeGroup().then(async res=>{
		      	console.log('getEmployeeGroup-------',res);
		      	res.forEach((item,index)=>{
		      		item.nick=item.group_name;
		      	})
		      	
		      	let employeeList=await this.getEmployeeList();
		      	res.forEach((item,index)=>{
		      		item.employeeList=[];
		      		employeeList.forEach((item2,index2)=>{
		      			console.log('item2-----------',item2);
		      			if(item2.group_id==item.group_id){
		      				item.employeeList.push(item2);
		      			}
		      		})
		      	})
		      	//如果是自己，就不用显示自己的
		      	console.log('this.user_data------',this.user_data);
		      	this.groupList=res;
		      	console.log('groupList-------',this.groupList);
		      })
		    },
		    
			filterNode(value, data) {
		        if (!value) return true;
		        return data.nick.indexOf(value) !== -1;
		     },
		     
		     //切换状态方法
			changeStatus(){
				console.log('changeStatus-------');	
				//保存权限
				let menu_role=0;
				let op_role=0;
				this.menuList.forEach((item,index)=>{
					if(item.menu_role){
						menu_role+=item.roles1;
					}
					if(item.op_role){
						op_role+=item.roles1;
					}
				})
				this.selectPerson.menu_role=menu_role;
				this.selectPerson.op_role=op_role;
				this.updateEmployee();
			},
			
			//商家修改员工
			updateEmployee(){
				let params={
					id:this.selectPerson.id,
					menu_role:this.selectPerson.menu_role,
					op_role:this.selectPerson.op_role
				}
				
				console.log('updateEmployee--------',params);
				this.util.updateEmployee(params).then(res=>{
					this.$message.success('修改员工权限成功！');
				})
			},
			
			//选择人员方法
			handleNodeClick(data) {
				console.log('handleNodeClick-------',data);
		        this.personName='';
		        if(!data.hasOwnProperty('employeeList')){
		        	this.personName=data.group_name+'-'+data.nick;
		        }
		        this.selectPerson=data;
		        this.selectUserRole=data.is_role;
		        console.log('selectUserRole---------',this.selectUserRole,this.personName);
		        if(this.selectUserRole==1){
		        	return;
		        }
		        
		        this.menuList.forEach((item,index)=>{
		        	if(data.menu_role && data.menu_role!=0){
		        		if((data.menu_role & item.roles1)!=0){
		  					item.menu_role=true;
		  				}else{
		  					item.menu_role=false;
		  				}
		        	}else{
		        		item.menu_role=false;
		        	}
	  				if(data.op_role && data.op_role!=0){
	  					if((data.op_role & item.roles1)!=0){
		  					item.op_role=true;
		  				}else{
		  					item.op_role=false;
		  				}
	  				}else{
	  					item.op_role=false;
	  				}
	  			})
		        console.log('this.menuList--------',this.menuList);
		        
		     },
			//搜索方法
			search(val){
				this.filterText=val;
			},
			
		},
	}
</script>

<style lang="scss" scoped>
.info{
	display:flex;
	/*justify-content: space-between;*/
}
.search-box{
	width:165px;
}
.leftInfo{
	min-width:350px;
	padding:20px;
	background:#fff;
	min-height:500px;
	margin-right:10px;
	.topInfo{
		display:flex;
		justify-content:space-between;
		align-items:center;
		p{
			font-size:20px;
		}
	}
}
.el-tree{
	margin-top:25px;
	padding-top:20px;
	border-top:1px solid #F0FAFF;
	/deep/ &>.el-tree-node{
		padding:20px 0px;
		border-bottom:1px solid #F0FAFF;
	}
}
.rightInfo{
	background:#fff;
	min-height:500px;
	flex:1;
	.topInfo{
		display:flex;
		align-items:center;
	}
	.noSelect{
		display:flex;
		justify-content:center;
		padding-top:50px;
		border-top:1px solid #F0FAFF;
	}
	.title{
		font-size:20px;
		padding:20px 10px;
	}
	ul{
		padding:10px;
		border-top:1px solid #F0FAFF;
		display:flex;
		align-items:center;
		flex-wrap:wrap;
		li{
			width:200px;
			height:120px;
			border-radius:4px;
			border:1px solid rgba(240,240,240,1);
			margin-right:10px;
			margin-bottom:10px;
			p{
				font-size:20px;
				padding:10px;
				border-bottom:1px solid #F0F0F0;
			}
			.limit{
				padding:10px;
				
				&>div:first-child{
					margin-bottom:10px;
				}
				.green{
					color:#17CE66;
				}
				.red{
					color:#FF4949;
				}
			}
			/deep/ .el-switch__core{
				margin:0px 20px 0px 12px;
			}
		}
	}
}
/deep/{
	.el-tree-node__children{
		margin-top:5px;
	}
	.el-tree-node__label{
		color:#333;
	}
	.el-icon-caret-right:before{
		content:'+';
		padding:3px 5px;
		border:1px solid #F0FAFF;
		color:#00A4FF;
	}
	.el-tree-node__expand-icon.is-leaf:before {
		content:'';
		border:none;
	}
}
</style>