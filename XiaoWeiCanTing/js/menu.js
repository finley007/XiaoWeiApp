(function(owner) {
	
	//存储已点菜品
	var selectedDishes = new Array();
	
	var updateSelectedDishes = function(id, label, price, num) {
		if (id != "" && selectedDishes != null) {
			var updated = false;
			for (var index in selectedDishes) {
				var dish = selectedDishes[index];
				if (dish["id"] == id) {
					if (num != 0) {
						dish["num"] = num;
					} else {
						selectedDishes.splice(index, 1);
					}
					updated = true;
					break;
				}
			}
			if (!updated) {
				selectedDishes.push({"id" : id, "label" : label, "price" : price, "num" : num});	
			}
		}
		updateViewByModel();
	}
	
	var getSelectedDishById = function(id) {
		if (id != "" && selectedDishes != null) {
			for (var index in selectedDishes) {
				var dish = selectedDishes[index];
				if (dish["id"] == id) {
					return dish;
				}
			}
		}
	}
	
	var updateViewByModel = function() {
		var selectedDishesInfo = owner.getSelectedDishesStatistics();
		$("#total").text(selectedDishesInfo.totalNum);
		$("#total-price").text(selectedDishesInfo.totalPrice);
	}
	
	var extractDishName = function(name) {
		name = name || "";
		return name.substring(0, name.indexOf("-"));
	}
	
	owner.getSelectedDishesStatistics = function() {
		var totalNum = 0;
		var totalPrice = 0.0;
		for (var index in selectedDishes) {
			var dish = selectedDishes[index];
			totalNum += parseInt(dish.num);
			var price = parseInt(dish.num) * parseFloat(dish.price);
			totalPrice += price;
		}
		return {"totalNum" : totalNum, "totalPrice" :totalPrice.toFixed(2)};
	}
	
	owner.getSelectedDishes = function() {
		return selectedDishes;
	}
	
	//动态生成菜单文类和菜单
	owner.createMenu = function(info) {
		var categoryList = new Array();
		info = info || {}; 
		var jsonInfo;
		if (typeof(info) == "string") {
			jsonInfo = eval ("(" + info + ")");	
		} else {
			jsonInfo = info;
		}
		$("#segmented-controls").children().remove();
		$("#dish-list").children().remove();
		var hasContent = false;
		for (var index in jsonInfo.menu) {
			var cateName = jsonInfo.menu[index].name;
			categoryList.push(cateName);
			var cateLabel = jsonInfo.menu[index].label;
			$("#segmented-controls").append('<a class="mui-control-item" href="' + cateName + '">' + cateLabel + '</a>');
			if (jsonInfo.menu[index].dishList != null) {
				hasContent = true;
				$("#dish-list").append('<li class="category-title mui-table-view-cell" id="' + cateName + '">' + cateLabel + '</li>');
				for (var i in jsonInfo.menu[index].dishList) {
					var dish = jsonInfo.menu[index].dishList[i];
					var selectedDish = getSelectedDishById(dish.id);
					if (selectedDish != null) {
						if (i == jsonInfo.menu[index].dishList.length - 1) {
							$("#dish-list").append('<li class="mui-table-view-cell last-child">' + selectedDish.label + '<div id="' + selectedDish.id + '" class="mui-numbox" data-numbox-min="0" style="background-color: rgb(239, 239, 244); border: 1px solid rgb(187, 187, 187); border-radius: 3px;"><button class="mui-btn mui-btn-numbox-minus" type="button" style="display: inline-block;">-</button><input class="mui-input-numbox" type="number" value="' + selectedDish.num + '" style="display: inline-block;"><button class="price-bt mui-btn mui-btn-numbox-plus" value="' + selectedDish.price + '" type="button" style="border: medium none transparent;">￥' + selectedDish.price + '</button></div></li>');	
						} else {
							$("#dish-list").append('<li class="mui-table-view-cell">' + selectedDish.label + '<div id="' + selectedDish.id + '" class="mui-numbox" data-numbox-min="0" style="background-color: rgb(239, 239, 244); border: 1px solid rgb(187, 187, 187); border-radius: 3px;"><button class="mui-btn mui-btn-numbox-minus" type="button" style="display: inline-block;">-</button><input class="mui-input-numbox" type="number" value="' + selectedDish.num + '" style="display: inline-block;"><button class="price-bt mui-btn mui-btn-numbox-plus" value="' + selectedDish.price + '" type="button" style="border: medium none transparent;">￥' + selectedDish.price + '</button></div></li>');
						}
					} else {
						if (i == jsonInfo.menu[index].dishList.length - 1) {
							$("#dish-list").append('<li class="mui-table-view-cell last-child">' + dish.label + '<div id="' + dish.id + '" class="mui-numbox" data-numbox-min="0"><button class="mui-btn mui-btn-numbox-minus" type="button">-</button><input class="mui-input-numbox" type="number" /><button class="price-bt mui-btn mui-btn-numbox-plus" type="button" value="' + dish.price + '">￥' + dish.price + '</button></div></li>');	
						} else {
							$("#dish-list").append('<li class="mui-table-view-cell">' + dish.label + '<div id="' + dish.id + '" class="mui-numbox" data-numbox-min="0"><button class="mui-btn mui-btn-numbox-minus" type="button">-</button><input class="mui-input-numbox" type="number" /><button class="price-bt mui-btn mui-btn-numbox-plus" type="button" value="' + dish.price + '">￥' + dish.price + '</button></div></li>');
						}	
					}
				}
			}
		}
		if (!hasContent) {
			$("#dish-list").append('<li class="category-title mui-table-view-cell">未找到您所需要的菜品</li>');
		}
		$("a[href= " + categoryList[0] + "]").addClass("mui-active");
		$(".mui-control-item").click(function() {
			var top = $("#" + $(this).attr("href")).offset().top - $("#" + categoryList[0]).offset().top;
			$("#content-panel").animate({
				scrollTop: top
			}, 0);
		});
		$("#content-panel").scroll(function(event, delta) {
			for (var index in categoryList) {
				var top = $("#" + categoryList[index]).offset().top;
				if (top > 50 && top < 90) {
					$(".mui-control-item").removeClass("mui-active");
					$("a[href= " + categoryList[index] + "]").addClass("mui-active");
					break;
				}
			}
		});
		$(".mui-input-numbox").change(function() {
			if ($(this).val() == 0) {
				$(this).css("display", "none");
				$(this).parent().css("background-color", "transparent");
				$(this).parent().css("border", "transparent")
				$(this).prev().css("display", "none");
				$(this).next().css("border", "1px solid #bbb");
				$(this).next().css("border-radius", 3);
			} else {
				$(this).css("display", "inline-block")
				$(this).prev().css("display", "inline-block");
				$(this).parent().css("background-color", "#efeff4");
				$(this).next().css("border", "transparent");
				$(this).parent().css("border", "1px solid #bbb");
				$(this).parent().css("border-radius", 3);
			}
			updateSelectedDishes($(this).parent().attr("id"), extractDishName($(this).parent().parent().text()), $(this).next().attr("value"), $(this).val());
//			var total = 0;
//			var totalPrice = 0.0;
//			$(".mui-input-numbox").each(function() {
//				total += parseInt($(this).val());
//				var price = parseInt($(this).val()) * parseFloat($(this).next().val());
//				totalPrice += price;
//			})
//			$("#total").text(total);
//			$("#total-price").text(totalPrice.toFixed(2));
		});
		$(".mui-table-view-cell").click(function(event) {
			var info = new Object();
			info["id"] = $(this).children("div").first().attr("id");
			info["name"] = extractDishName($(this).text());
			info["price"] = $(this).find("button").last().val();
			info["num"] = $(this).find("input").first().val();
			if (event.target.type != "button") {
				toggleInfo(info);	
			}
		});
		mui.ready(function() {
			mui('.mui-numbox').numbox();
		})
	};
	
	owner.createSelectedDishesBoard = function() {
		$("#selected-dish-board").children().remove();
		for (var index in selectedDishes) {
			var dish = selectedDishes[index];
			$("#selected-dish-board").append('<li class="mui-table-view-cell">' + dish.label + '<div id="' + dish.id + '" class="mui-numbox" data-numbox-min="0" style="background-color: rgb(239, 239, 244); border: 1px solid rgb(187, 187, 187); border-radius: 3px;"><button class="mui-btn mui-btn-numbox-minus" type="button" style="display: inline-block;">-</button><input class="mui-input-numbox" type="number" value="' + dish.num + '" style="display: inline-block;"><button class="price-bt mui-btn mui-btn-numbox-plus" value="' + dish.price + '" type="button" style="border: medium none transparent;">￥' + dish.price + '</button></div></li>');
		}
		$(".mui-input-numbox").change(function() {
			if ($(this).val() == 0) {
				$(this).parent().parent().remove();
			} else {
				$(this).css("display", "inline-block")
				$(this).prev().css("display", "inline-block");
				$(this).parent().css("background-color", "#efeff4");
				$(this).next().css("border", "transparent");
				$(this).parent().css("border", "1px solid #bbb");
				$(this).parent().css("border-radius", 3);
			}
			updateSelectedDishes($(this).parent().attr("id"), extractDishName($(this).parent().parent().text()), $(this).next().attr("value"), $(this).val());
//			var total = 0;
//			var totalPrice = 0.0;
//			$(".mui-input-numbox").each(function() {
//				total += parseInt($(this).val());
//				var price = parseInt($(this).val()) * parseFloat($(this).next().val());
//				totalPrice += price;
//			})
//			$("#total").text(total);
//			$("#total-price").text(totalPrice.toFixed(2));
		});
	}
	
	owner.filterMenu = function(menuList, filter) {
		menuList = menuList || {}; 
		var jsonInfo = eval ("(" + menuList + ")"); 
		var result = new Array;
		for (var index in jsonInfo.menu) {
			var menu = {
				"name" : jsonInfo.menu[index].name,
				"label" : jsonInfo.menu[index].label,
			}
			var dishList = new Array;
			for (var i in jsonInfo.menu[index].dishList) {
				var dish = jsonInfo.menu[index].dishList[i];
				if (match(dish.label, filter)) {
					dishList.push(dish);	
				}
			}
			if (dishList.length > 0) {
				menu["dishList"] = dishList;
				result.push(menu);
			}
		}
		if (result.length == 0) {
			for (var index in jsonInfo.menu) {
				var menu = {
					"name" : jsonInfo.menu[index].name,
					"label" : jsonInfo.menu[index].label,
				}
				result.push(menu);
			}
		}
		return {"menu" : result};
	}
	
	var match = function(tgt, filter) {
		if (filter.trim() == "") {
			return true;
		} else {
			return tgt.indexOf(filter) > -1;	
		}
	}
	
	owner.createConfirmContent = function() {
		var content = '<div style="height: 100px; overflow: auto">';
		var total = 0;
		var totalPrice = 0.0;
		$(".mui-input-numbox").each(function() {
			if (parseInt($(this).val()) > 0 ) {
				var dish = extractDishName($(this).parent().parent().text());
				var num = parseInt($(this).val());
				var price = num * parseFloat($(this).next().val()); 
				total += num;
				totalPrice += price;
				content += '<div style="height: 25px"><div style="display:inline-block; width: 120px; text-align: left">' + dish + '</div><div style="display:inline-block; width: 45px; ">' + num + '份</div><div style="display:inline-block; width: 45px; text-align: right">' + price.toFixed(2) + '￥</div></div>';
			}
		})
		content += '</div><div style="margin-top: 15px"><div style="display:inline;  position: relative; left: 60px ">共' + total + '道菜</div><div style="display:inline;  position: relative; left: 70px ">' + totalPrice.toFixed(2) + '￥</div></div>'
		return content;
	}
	
	owner.createDishInfo = function(info) {
		if (info.id != undefined && info.id != "") {
			$("#dish-info").children().remove();
			if (info.num > 0) {
				$("#dish-info").append('<li class="mui-media mui-col-xs-6"><img class="mui-media-object" src="../images/xiaocongbandoufu.jpg"><div class="mui-media-body">' + info.name + '<div id="' + info.id + '" class="mui-numbox" data-numbox-min="0" style="background-color: rgb(239, 239, 244); border: 1px solid rgb(187, 187, 187); border-radius: 3px;"><button class="mui-btn mui-btn-numbox-minus" type="button" style="display: inline-block;">-</button><input class="mui-input-numbox" type="number" value="' + info.num + '" style="display: inline-block;"><button class="price-bt mui-btn mui-btn-numbox-plus" value="' + info.price + '" type="button" style="border: medium none transparent;">￥' + info.price + '</button></div></div><div class="dish-instruction">家常小菜，清淡败火，且不失营养价值。</div></li>');
			} else {
				$("#dish-info").append('<li class="mui-media mui-col-xs-6"><img class="mui-media-object" src="./images/xiaocongbandoufu.jpg"><div class="mui-media-body">' + info.name + '<div id="' + info.id + '" class="mui-numbox" data-numbox-min="0"><button class="mui-btn mui-btn-numbox-minus" type="button">-</button><input class="mui-input-numbox" type="number" /><button class="price-bt mui-btn mui-btn-numbox-plus" type="button" value="' + info.price + '">￥' + info.price + '</button></div></div><div class="dish-instruction">家常小菜，清淡败火，且不失营养价值。</div></li>')	
			}
			$(".mui-input-numbox").change(function() {
				if ($(this).val() == 0) {
					$(this).css("display", "none");
					$(this).parent().css("background-color", "transparent");
					$(this).parent().css("border", "transparent")
					$(this).prev().css("display", "none");
					$(this).next().css("border", "1px solid #bbb");
					$(this).next().css("border-radius", 3);
				} else {
					$(this).css("display", "inline-block")
					$(this).prev().css("display", "inline-block");
					$(this).parent().css("background-color", "#efeff4");
					$(this).next().css("border", "transparent");
					$(this).parent().css("border", "1px solid #bbb");
					$(this).parent().css("border-radius", 3);
				}
				updateSelectedDishes($(this).parent().attr("id"), extractDishName($(this).parent().parent().text()), $(this).next().attr("value"), $(this).val());
			});
			return true;
		} else {
			return false;
		}
		
	}
}(window.menu = {}));
