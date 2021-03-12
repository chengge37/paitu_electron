import $Vm from '../main'
import {frontStudio,frontEquip,frontOrder,frontFollowOrCollect,frontPersonal,frontAddress} from '../config/api.js'


//判断用户是否已经登录
export const userIsLogin=()=>{
	if($Vm.$store.getters.user_data){
		return true;
	}else{
		return false;
	}
}

//-------------购物车模块----------------

//获取用户购物车数量（未支付订单）
export const getOrderCartNum = () => {
	return new Promise((resolve,reject)=>{
		$Vm.getRequest(frontOrder.getOrderCart).then(res => {
			console.log('getOrderCartNum---------',res);
			resolve(res.count)
		}).catch(err => {
			reject(false);
      });
	})
}


//----------------------收藏，关注模块----------------------------

//方法：  收藏影棚,设备，活动（取消）
//to_uid：商家id，对应y_user表中的id字段
//type：0表示店铺本身，1表示影棚，2表示设备，3表示活动
//obj:	1表示收藏，2表示关注 
//relation_id:当type为0时表示关注的是店铺，本字段为0；如果关注的是影棚则本字段为影棚id；如果关注的是设备，则本字段表示设备id ；如果关注的是活动，则本字段表示活动id
//return promise 1/收藏影棚（设备）成功 2/取消影棚（设备）成功
export const collectOther=(to_uid,type,obj,relation_id)=>{
	return new Promise((resolve,reject)=>{
		//判断是否已经收藏
		getUserLsObj(relation_id,type,obj).then(res=>{
			
			let url,params,message;
			if(res){
				url=frontFollowOrCollect.unFollowOrUnCollect;
				params={
					type:type,
					obj:obj,
					relation_id:relation_id,
				}
				if(type==1){
					message='取消收藏影棚成功！';
				}else if(type==2){
					message='取消收藏设备成功！';
				}
				
			}else{
				url=frontFollowOrCollect.followOrCollect;
				params={
					to_uid:to_uid,
					type:type,
					obj:obj,
					relation_id:relation_id,
				}
				if(type==1){
					message='收藏影棚成功！';
				}else if(type==2){
					message='收藏设备成功！';
				}
			}
			
			console.log('params----',params);
			$Vm.postRequest(url,params).then(res2 => {
				if(res){
					$Vm.$message.info(message);
					resolve(2);
				}else{
					$Vm.$message.success(message);
					resolve(1);
				}
				
			}).catch(err => {
				reject(false);
		   });
			
		})
		
	})
}


//to_uid：商家id，对应y_user表中的id字段
//obj：//1表示收藏，2表示关注 
//return promise 1/收藏店铺成功 2/取消收藏店铺成功
export const collectStore=(to_uid,obj)=>{
	//判断该店铺是否已经有收藏
	return new Promise((resolve,reject)=>{
		getUserLsObj(to_uid,0,obj).then(res=>{
			let url,params,message;
			//已经收藏
			if(res){
				url=frontFollowOrCollect.unFollowOrUnCollect;
				params={
					type:0,  //0表示店铺本身，1表示影棚，2表示设备，3表示活动
					obj:'1',   //1表示收藏，2表示关注 
					relation_id:to_uid, //当type为0时表示关注的是店铺，本字段为0；如果关注的是影棚则本字段为影棚id；如果关注的是设备，则本字段表示设备id ；如果关注的是活动，则本字段表示活动id
				}
				message='取消收藏店铺成功！';
			}
			//还没收藏
			else{
				url=frontFollowOrCollect.followOrCollect;
				params={
					to_uid:to_uid,	
					type:0,  
					obj:'1',   
					relation_id:0, 
				}
				message='收藏店铺成功!';
			}
			console.log('params-----',params);
			$Vm.postRequest(url,params).then(res2 => {
//				$Vm.$message.success(message);
				if(res){
					$Vm.$message.info(message);
					resolve(2);
				}else{
					$Vm.$message.success(message);
					resolve(1);
				}
				
			}).catch(err => {
				reject(false);
		   });
		})
	})
}

//获取是否收藏，关注
export const getUserLsObj=(relation_id,type,obj)=>{
	let params={
		relation_id:relation_id,  //对象id
		type:type,  //0表示店铺本身，1表示影棚，2表示设备，3表示活动
		obj:obj,   //1表示收藏，2表示关注
	};
	console.log('getUserLsObj------',params);
	return new Promise((resolve,reject)=>{
		$Vm.getRequest(frontFollowOrCollect.getLsObjById,params).then(res => {
			console.log('getLsObjById---------',res);
			resolve(res)
		}).catch(err => {
			reject(false);
	    });
	})
}

//获取用户收藏/关注列表  type 0/店铺 、1/影棚、2/设备、3/活动
export const userGetList=(type)=>{
	let params={
		page:1,
		page_size:1000,
		obj:'1',   //1表示收藏，2表示关注 
		type:type,   //0表示店铺本身，1表示影棚，2表示设备，3表示活动
	}
	return new Promise((resolve,reject)=>{
		$Vm.getRequest(frontPersonal.getCollectList,params).then(res => {
			console.log('getCollectList---------',res);
			resolve(res)
		}).catch(err => {
			reject(false);
	    });
	})
}

//------------------地址模块-------------------------

//获取地址列表
export const getAddressList=()=>{
	return new Promise((resolve,reject)=>{
		$Vm.getRequest(frontAddress.getAddressList).then(res => {
			console.log('getAddressList---------',res);
			resolve(res)
		}).catch(err => {
			reject(false);
	    });
	})
}


//新增地址
export const addNewAddress=(form)=>{
	return new Promise((resolve,reject)=>{
		$Vm.postRequest(frontAddress.addNewAddress,form).then(res => {
		 	console.log('addNewAddress---------',res);
			resolve(res)
	    }).catch(err => {});
	})
}

//-------------------订单模块----------------

//修改用户订单地址
export const updateOrderAddress=(orderId,addressId)=>{
	let params={
		order_id:orderId,
		address_id:addressId
	}
	return new Promise((resolve,reject)=>{
		$Vm.postRequest(frontOrder.updateOrderAddress,params).then(res => {
		 	console.log('updateOrderAddress---------',res);
			resolve(res)
	    }).catch(err => {});
	})
}