(function(owner) {
	
	//桌台区域列表
	owner.areaInfo = [{"code": "", "label": "全部区域"}, {"code": "1", "label": "大堂"}, {"code": "2", "label": "春"}, {"code": "3", "label": "夏"}, {"code": "4", "label": "秋"}, {"code": "5", "label": "冬"}];
	//桌台状态列表
	owner.statusInfo = [{"code": "", "label": "全部状态"}, {"code": "idle", "label": "空闲"}, {"code": "ordered", "label": "已开台"}, {"code": "started", "label": "已下单"}, {"code": "payed", "label": "已支付"}];
	
	owner.status = "";
	
	//桌台菜单控制：不同状态不同的可选菜单
	var menuConfig = {
	    "idle": [
	        {
	            "func": "openTable", 
	            "label": "开台"
	        }
	    ], 
	    "ordered": [
	        {
	            "func": "clearTable", 
	            "label": "清台"
	        }, 
	        {
	            "func": "orderDish", 
	            "label": "点菜"
	        },
	        {
	            "func": "changeTable", 
	            "label": "换台"
	        },
	        {
	            "func": "combineTable", 
	            "label": "并台"
	        }
	    ],
	    "started": [
	        {
	            "func": "modifyDish", 
	            "label": "菜单调整"
	        },
	        {
	            "func": "changeTable", 
	            "label": "换台"
	        },
	        {
	            "func": "combineTable", 
	            "label": "并台"
	        }
	    ]
	};
	
	function getStatusLabel(status) {
		for (var index in owner.statusInfo) {
			if (owner.statusInfo[index].code == status) {
				return owner.statusInfo[index].label;
			}
		}
		return "";
	}
	
	//生成桌台HTML
	function createTableHTML(info) {
		var result = "";
		info = info || {};
		for (var index in info.tables) {
			var table = info.tables[index];
			var status = table.status != "" ? table.status : "started";
			var statusLabel = getStatusLabel(status);
			result += '<div class="wp-table-btn ng-scope table-state ' + table.status + '" id="' + table.id + '" status="' + status + '"><div class="table-name-wrapper">' +
			'<div class="table-name ng-binding">' + table.number + '</div></div><div class="table-detail"><div class="table-state">' + 
			'<span class="ng-binding">' + statusLabel + '</span><span class="from-wechat ng-hide" ng-show="table.is_from_wechat"></span></div>';
			if (status == "started") {
				result += '<div class="table-info">' + table.price + '￥</div></div></div>';	
			} else {
				result += '<div class="table-info">' + table.people + '人</div></div></div>';
			}
			
		}
		return result;
	}
	
	//构造添加桌台模块并添加针对每个桌台的单击事件监听
	owner.addTables = function(parent, info, callback) {
		if (typeof(parent) == "undefined" || parent == null) {
			return;
		}
		$(".main-section").children().remove();
		callback = callback || new function(){};
		info = info || {}; 
		var jsonInfo = eval ("(" + info + ")"); 
		parent.append(createTableHTML(jsonInfo));
		for (var index in jsonInfo.tables) {
			var id = "#" + jsonInfo.tables[index].id;
			$(id).on('tap', callback);
		}
	};
	
	owner.initSelection = function(parent, info) {
		if (typeof(parent) == "undefined" || parent == null) {
			return;
		}
		info = info || {};
		var content = "";
		for (var index in info) {
			content += '<option value="' + info[index].code +'">' + info[index].label + '</option>"';
		}
		if (content != "") {
			parent.append(content);
		}
	}
	
	owner.getMenuContent = function(status, id) {
		var content = "";
		var count = 0;
		if (menuConfig[status]) {
			var menu = menuConfig[status];
			for (var index in menu) {
				content += '<li class="mui-table-view-cell operation" onclick="' + menu[index].func + '(' + id + ')"><a href="#">' + menu[index].label + '</a></li>';
				count ++;
			}
		}
		return {"content" : content, "count" : count};
	}
	
	//过滤桌台，目前只支持根据状态和区域过滤
	owner.filterTable = function(tableInfo, status, area) {
		if (status.trim() == "" && area.trim() == "") {
			return tableInfo;
		}
		tableInfo = tableInfo || {};
		var jsonInfo = eval ("(" + tableInfo + ")"); 
		var newTableList = new Array;
		var tableList = jsonInfo["tables"];
		if (tableList != null && tableList.length > 0) {
			for (var index in tableList) {
				var table = tableList[index];
				if (("" == status.trim() || table.status == status)
						&& ("" == area.trim() || table.area == area)) {
					newTableList.push(table);
				}
			}
		}
		return JSON.stringify({"tables" : newTableList});
	}
	
	//根据桌台编号搜索桌台
	owner.filterTableByNo = function(tableInfo, no) {
		if ("" == no.trim()) {
			return tableInfo;
		}
		tableInfo = tableInfo || {};
		var jsonInfo = eval ("(" + tableInfo + ")"); 
		var newTableList = new Array;
		var tableList = jsonInfo["tables"];
		if (tableList != null && tableList.length > 0) {
			for (var index in tableList) {
				var table = tableList[index];
				if (table.number == no) {
					newTableList.push(table);
				}
			}
		}
		return JSON.stringify({"tables" : newTableList});
	}
	
	//开台提示
	owner.openTablePrompt = function(openOrderFunc, openFunc) {
		mui.prompt(' ', '', '开台提示', ['开台点菜', '开台', '取消'], function(e) {
					if (e.index == 0) {
						openOrderFunc();
					} else if (e.index == 1) {
						openFunc();
					}}, 'div');
		document.querySelector('.mui-popup-input').innerHTML = '<div style="margin-top: 10px;">请输入就餐人数<div class="mui-numbox" data-numbox-min="1" data-numbox-max="20" style="margin-left: 10px;"><button class="mui-btn mui-btn-numbox-minus" type="button">-</button><input id="test" class="mui-input-numbox" type="number" /><button class="mui-btn mui-btn-numbox-plus" type="button">+</button></div></div>';
		mui.ready(function() {
			mui('.mui-numbox').numbox();
		})
	}
	
	//TODO 调用开台服务
	owner.callOpenTableService = function() {
		alert("调用开台服务");
	}
	
	//TODO 调用清台服务
	owner.callClearTableService = function() {
		alert("调用清台服务");
	}
}(window.table = {}));