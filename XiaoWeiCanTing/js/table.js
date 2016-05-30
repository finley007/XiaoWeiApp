(function(owner) {
	
	owner.areaInfo = [{"code": "", "label": "全部区域"}, {"code": "1", "label": "大堂"}, {"code": "2", "label": "春"}, {"code": "3", "label": "夏"}, {"code": "4", "label": "秋"}, {"code": "5", "label": "冬"}];
	owner.statusInfo = [{"code": "", "label": "全部状态"}, {"code": "idle", "label": "空闲"}, {"code": "ordered", "label": "已开台"}, {"code": "started", "label": "已下单"}, {"code": "payed", "label": "已支付"}];
	
	owner.status = "";
	
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
}(window.table = {}));