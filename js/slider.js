'use strict';
/* ----------- Функция-конструктор для слайдера с функциональностью -------------------------- */	
	function Slider(options) {
	
		var coords = {},
			maxValue = options.maxValue,
			elem = options.elem,
			bar = elem.querySelector('.bar'),
			marker = elem.querySelector('.marker');
		
		elem.addEventListener('mousedown', mousedownHandler);
		elem.addEventListener('click', mouseClickHandler);		
	
		function mouseClickHandler(e) {
		
			if (!e.target.classList.contains('bar')) return;
			
			setCurrentCoords(marker.getBoundingClientRect().left);
			moveMarker(e.clientX);
		};
		
		function mousedownHandler(e) {
		
			if (!e.target.classList.contains('marker')) return;
			
			e.preventDefault();
			document.addEventListener('mousemove', mousemoveHandler);			
			document.addEventListener('mouseup', mouseupHandler);

			setCurrentCoords(e.clientX);		
		};

		function mousemoveHandler (e) {
			moveMarker(e.clientX);
		};

		function mouseupHandler() {
			document.removeEventListener('mousemove', mousemoveHandler);
			document.removeEventListener('mouseup', mouseupHandler);
		};
		
		function setCurrentCoords(currentClientX) {
			
			var barCoords = bar.getBoundingClientRect();
			var markerCoords = marker.getBoundingClientRect();
			
			coords.barX = barCoords.left;
			coords.barWidth = barCoords.right - barCoords.left;
			coords.markerWidth = markerCoords.right - markerCoords.left;
			coords.shift = currentClientX - markerCoords.left;
		
		};		
				
		function moveMarker(currentX) {
			
			var newValue,
				newX = currentX - coords.shift - coords.barX;
			
			if (newX <= 0) {
				newX = 0;
				};
				
			if( newX >= (coords.barWidth - coords.markerWidth)) {
				newX = coords.barWidth - coords.markerWidth;
				};
				
			marker.style.left = newX + 'px';
			
			if (maxValue > 1) {
				newValue = Math.round(maxValue * newX / (coords.barWidth - coords.markerWidth));
			} else {
				newValue = Math.round(100 * maxValue * newX / (coords.barWidth - coords.markerWidth)) / 100;				
			};
			
			elem.querySelector('.currentValue').innerHTML = newValue;
			
			var sliderEvent = new CustomEvent('sliderMove', {
								bubbles: true,
								detail: {name: options.name,
										 value: newValue}
								});
			elem.dispatchEvent(sliderEvent);
		};		
	};
/* --------------------------------------------------------------------------------------------*/

	