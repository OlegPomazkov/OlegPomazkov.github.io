"use strict";
/* --------------------------------------------------------------------------------------------*/
/* ------------------ КОНТРОЛЛЕР УПРАВЛЕНИЯ СТРАНИЦЕЙ ЦЕЛИКОМ (ГЛАВНЫЙ) ----------------------- */
function PageController() {

	var sliders = [
					{name: 'Red',     maxValue: 255,  initValue: 127},
					{name: 'Green',   maxValue: 255,  initValue: 127},
					{name: 'Blue',    maxValue: 255,  initValue: 127},
					{name: 'Opacity', maxValue: 1,    initValue: 0.5}
		],
		colors = sliders.map(function(slider) {
									return slider.initValue;
							});
				
/* Инициализация слушателей для демонстрации подсказки и управления окном подсказки            */ 
	document.body.addEventListener('mouseover', showTooltip);	
	document.body.addEventListener('click', modifyTooltipWindow);	

/* Инициализация основного экрана начальными значениями                                        */
	setCurrentScreenColor(colors);
	
/* Инициализация экрана предыдущего цвета в черный                                             */
	setLastColorScreen('rgb(0,0,0)');
	
/* Создание боковой палитры стандартных цветов и инициализация "слушателя" на ней              */
	createBGCTable(document.querySelector('.standartColors'));
	document.querySelector('.standartColors').addEventListener('click', setLastColor)
	
/* Установка фонового изображения и инициализация "слушателя" на панели фоновых изображений    */
	setScreenBackground('url(images/baw.png)');
	document.querySelector('.backgroundsPanel').addEventListener('click', setBackground);

/* Установка слушателя на кнопку запоминания текущего цвета                                    */
	document.querySelector('.button').addEventListener('click', function(){
			setLastColorScreen( 'rgb(' + colors.slice(0,3).join(',') + ')');
	});
/* Построение слайдеров и инициализация слушателей на них                                      */
	renderSlidersPanel(sliders);
	document.addEventListener('sliderMove', sliderMoveHandler);
		
/* Функция-слушатель для собственного события - движения слайдером                             */		
	function sliderMoveHandler(e) {				
		for( var i = 0; i < sliders.length; i++) {
			if (e.detail.name === sliders[i].name) {
				colors[i] = e.detail.value;
			};
			setCurrentScreenColor(colors);
		};
	};	
};
/* --------------------------------------------------------------------------------------------*/
/* ------------------------ ФУНКЦИИ - "СЛУШАТЕЛИ"  ЭЛЕМЕНТОВ ИНТЕРФЕЙСА ---------------------- */
/* --------- Установщик цвета экрана предыдущего цвета по нажатию на "палитру" --------------- */
	function setLastColor(e) {		
		if(!(e.target.hasAttribute('data-color'))) return;
		setLastColorScreen(e.target.getAttribute('data-color'));
	};	
/* --------- Установщик фонового рисунка на основном экране по нажатию на картинку снизу ----- */	
	function setBackground(e) {		
       if(!(e.target.tagName === 'IMG')) return;
	   setScreenBackground(e.target.getAttribute('data-image'));		
	};
/* --------- Демонстратор соответствующей подсказки в окне интерактивной подсказки ----------- */	
	function showTooltip(e){	
		if(!e.target.closest('[tooltip]')) return;
		document.querySelector('.tooltip').innerHTML = e.target.closest('[tooltip]').getAttribute('tooltip');
	};
/* --------- "Модификатор" окна интерактивной подсказки --------------------------------------- */	
	function modifyTooltipWindow(e){
		
		if(!e.target.closest('.tooltipButton')) return;
		
		[].forEach.call(document.body.querySelectorAll('.tooltip, .tooltipButton'), function(item) {
				item.classList.toggle('hidden');
		});		
	};	
/* --------------------------------------------------------------------------------------------*/
/* ------------- ФУНКЦИИ СОЗДАНИЯ И ИНИЦИАЛИЗАЦИИ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА ----------------------- */
/* ---------------- Функция формирования боковой палитры стандартных цветов ------------------ */	
	function createBGCTable(container) {
		
		var tmpl = _.template(document.getElementById('table-template').innerHTML.trim());
		container.innerHTML = tmpl({});
		[].forEach.call(container.querySelectorAll('[data-color]'), function(cell){		
			cell.style.backgroundColor = cell.getAttribute('data-color');
		});
	};
/* ----------- Функция установки выбранного цвета на экране предыдущего цвета ---------------- */			
	function setLastColorScreen(colorName) {
		
		var screen = document.querySelector('.lastColorScreen');
		var colors = colorName.slice(5, -1).split(',');
		
		screen.style.backgroundColor = colorName;
		
		colors = colors.map(function(color) {
								return (color < 127) ? 255 : 0;
							});
		
		screen.style.color = 'rgb(' + colors[0] +',' + colors[1] +',' + colors[2] +')'; 
		screen.innerHTML = "</br>" + colorName;
	};
/* ----------- Функция установки фонового изображения на основном эеране --------------------- */	
	function setScreenBackground(colorName) {	
		var screen = document.querySelector('.currentScreenBG');	
		screen.style.backgroundImage = colorName; 
	};
/* ----------- Функция установки цвета и прозрачности на основном эеране --------------------- */	
	function setCurrentScreenColor(colors) {	
		var screen = document.querySelector('.currentColorScreen');	
		screen.style.backgroundColor = 'rgba(' + colors.join(',') + ')'; 
	};	
/* ----------- Функция построения 4 слайдеров  в DOM  --------------------------------------- */
	function renderSlidersPanel(sliders) {	
					 
		var tmpl = _.template(document.getElementById('slider-template').innerHTML.trim());
		var container = document.querySelector('.slidersPanel');
		
		for( var i = 0; i < sliders.length; i++) {
			container.innerHTML += tmpl({name: sliders[i].name, initValue: sliders[i].initValue });
			setMarker(sliders[i].name, sliders[i].initValue, sliders[i].maxValue);
		};
		for( var i = 0; i < sliders.length; i++) {
			new Slider({
				 name: sliders[i].name,
				 maxValue: sliders[i].maxValue,
				 initValue: sliders[i].initValue,
				 elem: document.querySelector('[data-name="' + sliders[i].name + '"]')
			});
		};	
	};
/* ----------- Функция установки начального положения маркера -------------------------------- */
	function setMarker(sliderName, initValue, maxValue) {
			
		var bar = document.querySelector('[data-name="' + sliderName + '"]').querySelector('.bar');
		var marker = document.querySelector('[data-name="' + sliderName + '"]').querySelector('.marker');			
		var barCoords = bar.getBoundingClientRect();
		var markerCoords = marker.getBoundingClientRect();			
		var barWidth = barCoords.right - barCoords.left;
		var markerWidth = markerCoords.right - markerCoords.left;
			
		marker.style.left = initValue * (barWidth - markerWidth) / maxValue + 'px';
	};	
/* --------------------------------------------------------------------------------------------*/

	