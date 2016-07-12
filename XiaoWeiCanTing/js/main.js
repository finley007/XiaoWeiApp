(function(owner) {
	//主界面功能块
	var main_func = {
		table_order : 1,
		fast_order : 2,
		open_table : 3,
		combine_table : 4,
		change_table : 5,
		urge_dish : 6,
		cancel_dish :7,
		mark_dish : 8
	};
	
	var currentFunc;
	
	owner.main_func = function() {
		return main_func;
	}
	
	owner.getCurrentFunc = function() {
		return localStorage.getItem("currentFunc");
	}
	
	owner.setCurrentFunc = function(func) {
//		currentFunc = func;
		localStorage.setItem("currentFunc", func);
	}
}(window.main = {}));
