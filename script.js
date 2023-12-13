'use strict';

let Tasks = [];

let ListWeather = [];

let doc = null;

let parsedArr = [];

let page = 0;

let timer = null;

let DeviceDetect = false;

let position = null;

let blockScrollItem = false;

let firstStart = true;

let stateSlider = false;

let Slider = false;

let SliderTimer = null;

const URIHandler =
new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
	set: (searchParams, prop, value) => {searchParams.set(prop, value); window.history.pushState({}, "", "?"+searchParams.toString()); return true}
});


async function requestListWeather(text) {
	await $.getJSON("https://www.accuweather.com/web-api/autocomplete?query="+text+"&language=en-us")
	.done(function(data){
		ListWeather = [];
		$(".finder_bar_row_items").empty();
		for (let i = 0; data.length > i; i++) {
			let child = $(".finder_bar_row_items").append("<div onclick='{initWeather(" + data[i].key +", "+i+", true, true); ShowDiv()}' class='finder_bar_items'><div class='finder_bar_items_name'><a class='text finder_bar_items_text'>" + data[i].localizedName + ", " + data[i].administrativeArea.localizedName + ", " + data[i].country.id + "</a></div></div>");
			$(child[0].lastChild).width();
			$(child[0].lastChild).addClass("show");
			ListWeather.push(data[i]);
		}
	})
	.fail(function(data){
		console.log(data);
	});
};

async function getWeatherParams(url, num){
	let arr = [];
	await $.get(url)
	.done(function(data){
		let pg = $.parseHTML(data);
		doc = pg;
		$('.main-weather-left-up-header')[0].childNodes[1].nodeValue = $($(pg).find(".current-weather")[0]).find(".display-temp")[0].childNodes[0].nodeValue + "C";
		$($($('.main-weather-left-down-sub')[0]).find(".main-weather-left-down-sub-value")).text($(pg).find(".temperature")[1].childNodes[0].nodeValue.replace(/[^-0-9]/g,"") + "°");
		$($($('.main-weather-left-down-sub')[1]).find(".main-weather-left-down-sub-value")).text($(pg).find(".temperature")[0].childNodes[0].nodeValue.replace(/[^-0-9]/g,"") + "°");
		let parse = JSON.parse(pg[75].innerText);
		$('.main-weather-left-name').text(parse.address.addressRegion+ ", " + parse.geo.addressCountry);
		$('.main-weather-logo')[0].attributes[1].nodeValue = "https://www.accuweather.com/" + $(pg).find('.icon')[0].attributes[1].nodeValue;
		let search = $($(pg).find('div[class="current-weather-details no-realfeel-phrase "]')[0]).find('div[class="detail-item spaced-content"]');
		for(let i=0; i< search.length; i++){
			console.log(search[i].childNodes[1].innerText + ": "+ search[i].childNodes[3].innerText);
			arr[i] = {};
			arr[i].name = search[i].childNodes[1].innerText;
			arr[i].value = search[i].childNodes[3].innerText;
		}
	})
	.fail(function(data){
		console.log(data);
	})
	return arr;
}

function sortedArray() {
	for (let i=0; i<objects.length/6;i++){
		sorted_obj[i];
	}
}

function ClearPreload(){
	$('#item_block').unbind("pointerdown");
	$('.main-weather-body').unbind("wheel");
}

function Upd(keys = null, num = null){
	if(timer !== null){
		clearInterval(timer);
		timer = null;
		$('#live').removeClass('active');
		$('#live_mobile').removeClass('active');
	}
	else {
		if (keys !== null & num !== null) {
			timer = setInterval(()=>{initWeather(keys, num, false, true)}, 300000); //5m
			$('#live').addClass('active');
			$('#live_mobile').addClass('active');
		}
	}
}

function initPages(arr, skipAnimation = false){
	$('.main-weather-body').empty();
	if (!DeviceDetect){
		for (let a = 0; a < arr.length; a++){
			$(".main-weather-body").append('<div id="g_'+a+'" class="main-weather-group-items"></div>');
			for (let b = 0; b < arr[a].length; b++){
				$("#g_"+a).append('<div id="sub_'+b+'" class="main-weather-group"></div>');
				for (let c = 0; c < arr[a][b].length; c++){
					let cs;
					switch (parsedArr[a][b][c].name){
					case "Indoor Humidity":
						cs = parsedArr[a][b][c].value.split(" ");

						$($('#g_'+a).find("#sub_"+b)).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+cs[0]+'</div><div class="main-weather-item-value-text-sub">'+cs[1] + " " + cs[2]+'</div></div></div>');
						break;
					case "Max UV Index":
						cs = parsedArr[a][b][c].value.split(" ");

						$($('#g_'+a).find("#sub_"+b)).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+cs[0]+'</div><div class="main-weather-item-value-text-sub">'+cs[1]+'</div></div></div>');
						break;

					default:
						$($('#g_'+a).find("#sub_"+b)).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+parsedArr[a][b][c].value+'</div></div></div>');
						break;
					}
				}
			}
		}
	}else{
		$(".main-weather-body").append('<div id="g_0" class="main-weather-group-items"></div>');
		$("#g_0").append('<div id="sub_0" class="main-weather-group"></div>');
		for( let a = 0; a< arr.length; a++){
			for (let b = 0; b < arr[a].length; b++){
				for (let c = 0; c < arr[a][b].length; c++){
					let cs;
					switch (parsedArr[a][b][c].name){
					case "Indoor Humidity":
						cs = parsedArr[a][b][c].value.split(" ");
						$($('#g_0').find("#sub_0")).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+cs[0]+'</div><div class="main-weather-item-value-text-sub">'+cs[1] + " " + cs[2]+'</div></div></div>');
						break;
					case "Max UV Index":
						cs = parsedArr[a][b][c].value.split(" ");

						$($('#g_0').find("#sub_0")).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+cs[0]+'</div><div class="main-weather-item-value-text-sub">'+cs[1]+'</div></div></div>');
						break;

					default:
						$($('#g_0').find("#sub_0")).append('<div class="main-weather-item"><div class="main-weather-item-name">'+parsedArr[a][b][c].name+'</div><div class="main-weather-item-value"><div class="main-weather-item-value-text">'+parsedArr[a][b][c].value+'</div></div></div>');
						break;
					}
				}
			}
		}
	}

	if(skipAnimation){
		changePage(page, 0);
	}
	else {
		changePage(page);
		AutoSlide('reset');
	}
	if (firstStart){
		firstStart = false;
		ShowDiv();
	}
}

async function changePage(num, time = 300){
	if (num >= 0 & num < parsedArr.length ) {
		blockScrollItem = true;
		page = num;
		$(".main-weather-group-items").transition({
			y: -($('#item_block')[0].offsetHeight)*num
		}, {
			duration: time,
			complete: function () {
				setPicks(num);
				blockScrollItem = false;
			}
		});
		return true;
	}
	else {
		return false;
	}
	return a;
}

function initPicks(arr) {
	$(".main-weather-item-selectors").empty();
	$('.main-weather-body').on("wheel", function(a){
		a.preventDefault();
		if (blockScrollItem) {

			return false;
		}

		let y = a.originalEvent.deltaY;
		let ybody = $('.center').scrollTop();
		let pg;
		if (y > 7) {
			changePage(page +1);
		}
		else if (y < -7) {
			changePage(page -1);
		}

	});
	$('#item_block').on("pointerdown", function(event) {
		if (blockScrollItem) {
			event.preventDefault();
			return false;
		}
		position = event.pageY;
		let fun1 = function(event) {
			if (event.buttons > 0) {
				let pos = (event.pageY - position) + (-($('#item_block')[0].offsetHeight) * page);
				$('.main-weather-group-items').css('transform', 'translate(0, '+pos+'px, 0)');
			}
		}
		$('.fill').on("pointermove", fun1);
		$('.fill').on("pointerup", async function (event) {
			$('.fill').unbind('pointermove');
			let pos = event.pageY - position;
			$('.fill').unbind("pointermove");
			$('.fill').unbind("pointerup");
			if(pos < -30) {
				let resp = await changePage(page+1);
				if(!resp){
					changePage(page);
				}
			}
			else if (pos > 30){
				let resp = await changePage(page-1);
				if (!resp){
					changePage(page);
				}
			}
			else {
				changePage(page);
			}
		});
	});
	for(let i=0; i<arr.length; i++){
		$(".main-weather-item-selectors").append('<div id="itemPage_' + i + '" onclick="changePage('+i+')" class="main-weather-item-selectors-pick"></div>');
	}
	setPicks(page);
}

function setPicks(id){
	$($('.main-weather-item-selectors').find('.active')).removeClass('active');
	$("#itemPage_"+id).addClass("active");
}

async function sortedArray(arr){
	let parsed = [];
	let items = 0;

	for(let i = 0; i< arr.length/6; i++){
		parsed[i] = [];
		for(let a = 0; a < 2; a++){
			if(items !== arr.length){
				parsed[i][a] = [];
			}
			for(let b = 0; b < 3; b++){
				if(items !== arr.length){
					parsed[i][a][b] = {};
					parsed[i][a][b].name = arr[items].name;
					parsed[i][a][b].value = arr[items].value;
					items++;
				}
			}
		}
	}
	return parsed;
}

async function getWeatherPageApi(key){
	let response = null;
	$.ajaxSetup({headers: {"Accept-Language":"en-US"}});
	await $.get("https://www.accuweather.com/web-api/three-day-redirect?key="+key+"&target=")
	.done(async function(data, code, resp){
		console.log(resp);
		let pg = $.parseHTML(data);
		let param;
		if(window.navigator.userAgent.toUpperCase().search('mobile'.toLocaleUpperCase()) !== -1){
			param = $($(pg).find('div[data-qa="currentWeatherCard"]')).find('a').attr('href');
		}
		else {
			param = $(pg).find('.cur-con-weather-card')[0].attributes[1].value
		}
		let url = "https://www.accuweather.com" + param;
		$('.main-weather-left-up-description').text($(pg).find(".phrase")[0].innerText);
		response = url;
		console.log("done");
	})
	.fail(function(data){
		console.log(data);
	})
	return response;
}

function HideDiv(){
	$('.finder_bar_list').css("display", "flex");
	if(!DeviceDetect){
		$($('.pc, .marka')[1]).animate({
			'opacity' : '0.0',
		}, {
			duration: 200,
			complete: function () {
			}
		});;
	}

	$(".finder_bar_list").animate({
		'opacity' : '1.0',
	}, {
		duration: 200,
		complete: function () {
		}
	});

	$('.alert').show();
	$('.center').scrollTop(0);
	$("#main").animate({
		'opacity' : '0.0',
	}, {
		duration: 200,
		complete: function () {
			$("#main").hide();
		}
	});

	$("#finder").attr("placeholder", "Search");
	$("#finder").focus();
	$(".center").css("overflow", "hidden");
}

function ShowDiv(){
	if(parsedArr.length !== 0){
		if (!DeviceDetect) {
			$($('.pc, .marka')[1]).animate({
				'opacity' : '1.0',
			}, {
				duration: 200,
				complete: function () {
				}
			});
		}
		$('.alert').hide();
		$(".finder_bar_list").animate({
			'opacity' : '0.0',
		}, {
			duration: 200,
			complete: function () {
				$('.finder_bar_list').hide();
			}
		});
		$("#main").show();
		$("#main").animate({
			'opacity' : '1.0',
		}, {
			duration: 200,
			complete: function () {
			}
		});
		$("#finder").attr("placeholder", "Search");
		$(".center").css("overflow", "auto");
	}
}

function AutoSlide(param = null) {
	if(param === null){
		if (stateSlider) {
			stateSlider = false;
			$('#auto').removeClass('active');
			clearInterval(SliderTimer);
		}
		else{
			stateSlider = true;
			$('#auto').addClass('active');
			let fun = async function () {
				if(!Slider){
					let change = await changePage(page+1);
					if(!change){
						Slider = true;
						changePage(page-1);
					}
				}
				else{
					let change = await changePage(page-1);
					if(!change){
						Slider = false;
						changePage(page+1);
					}
				}
			};
			SliderTimer = setInterval(fun, 30000);
		}
	}
	else if (param === 'reset'){
		if(stateSlider){
			stateSlider = false;
			$('#auto').removeClass('active');
			clearInterval(SliderTimer);
		}
	}
	else {
		console.log("check param");
	}
}

function Check() {
	requestListWeather($("#finder").val());
}

function DetectDevice(){
	let detect = false;

	if (window.navigator.userAgent.toUpperCase().search('mobile'.toLocaleUpperCase()) !== -1){
		detect = true;
	}
	else if (window.navigator.userAgent.toUpperCase().search('android'.toLocaleUpperCase()) !== -1){
		detect = true;
	}

	if (detect) {
		DeviceDetect = true;
		if (Math.abs(window.orientation) === 90 ) {
			$('head').append('<meta name="viewport" content="width=device-width, initial-scale=0.6">');
		}
		else {
			$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
		}

		$('<link>')
		.appendTo('head')
		.attr({
			type: 'text/css',
			rel: 'stylesheet',
			href: 'style_mobile.css?v0'
		});
	}
}

function CheckURI(){

	if (URIHandler.weather !== undefined & URIHandler.weather !== null & URIHandler.weather !== '') {
		initWeather(URIHandler.weather, 0, true);
	}
}

function SetUri(val){
	URIHandler.weather = val;
}



async function initWeather(keys, num, clearTimer = false, skipAnimation = false){
	if(clearTimer){
		Upd();
	}
	ClearPreload();
	let key = keys?.toString() || '';
	SetUri(key);
	let url = await getWeatherPageApi(key);
	let items = await getWeatherParams(url, num);
	let parsed = await sortedArray(items);
	parsedArr = parsed;
	if (!DeviceDetect) {
		initPicks(parsed);
		$('#live').attr("onclick", "Upd("+ keys +", "+ num +")");
	}else $('#live_mobile').attr("onclick", "Upd("+ keys +", "+ num +")");
	initPages(parsed, skipAnimation);
}


(function(){
	$("document").ready(function(){
		HideDiv();
		$('#finder').blur();
		$(".finder_bar_row_items").empty();
		DetectDevice();
		CheckURI();
		$(".bg_div").css("opacity", "1");
	});
})();
