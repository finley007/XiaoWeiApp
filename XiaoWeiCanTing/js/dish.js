(function(owner) {
	var dishOper = [
			{
				"label" : "退菜",
				"func" : "cancelDish",
				"colorStyle" : "mui-btn-yellow"
			},
			{
				"label" : "催菜",
				"func" : "urgeDish",
				"colorStyle" : "mui-btn-red"
			}
		];
	
	
	owner.creatDishList = function(info) {
		info = info || {};
		var jsonInfo = eval ("(" + info + ")"); 
		var result = {};
		var content = "";
		for (var index in jsonInfo.detailInfo) {
			content += '<li class="mui-table-view-cell" id="' + jsonInfo.detailInfo[index].id + '">' +
			'<div class="mui-slider-right mui-disabled">';
				for (var i in dishOper) {
					content += '<a class="mui-btn ' + dishOper[i].colorStyle + '" onclick="' + dishOper[i].func + '(\'' + jsonInfo.detailInfo[index].name + '\')">' + dishOper[i].label + '</a>';
				}
			content += '</div>' + 
			'<div class="mui-slider-handle">' + 
				'<div class="mui-table-cell table-first-col"> ' + jsonInfo.detailInfo[index].name +' </div>' + 
				'<div class="mui-table-cell table-second-col"> ' + jsonInfo.detailInfo[index].price +' </div>' +
				'<div class="mui-table-cell table-third-col"> ' + jsonInfo.detailInfo[index].count +'份 </div>' +
			'</div></li>';
		}
		result["content"] = content;
		result["price"] = jsonInfo.statInfo.totalPrice;
		result["count"] = jsonInfo.statInfo.totalCount;
		return result;
	}
	
	//TODO 调用退菜服务
	owner.callCancelDishService = function() {
		alert("调用退菜服务");
	}
	
	//TODO 调用催菜服务
	owner.callUrgeDishService = function() {
		alert("调用催菜服务");
	}
}(window.dish = {}));
