// Simple Material Design Color Palette Extension for Chrome
// Author: Santhosh Sundar
// Organization: SapientNitro
// URL: http://gigacore.in

(function() {
	// Caching Elements
	var colorList = document.querySelectorAll('.color-list div'),
		colorItems = document.querySelectorAll('li.color'),
		toggleButtons = document.querySelectorAll('#toggles li');

	// Display corresponding color list on mouseenter.
	colorList.forEach(function(color) {
		color.addEventListener('mouseenter', function() {
			if (!this.classList.contains('active')) {
				colorList.forEach(function(c) {
					c.classList.remove('active');
				});
				document.querySelectorAll('.color-wrap').forEach(function(wrap) {
					wrap.classList.remove('show');
				});
				var targetWrap = document.querySelector('.color-wrap[data-color="' + this.dataset.color + '"]');
				if (targetWrap) {
					targetWrap.classList.add('show');
				}
			}
			this.classList.add('active');
		});
	});

	// Display "Copied to Clipboard" toast on click of colors.
	document.querySelectorAll('li.color, .color-set').forEach(function(item) {
		item.addEventListener('click', function() {
			var textToCopy = item.getAttribute('data-clipboard-text');
			if (navigator.clipboard && textToCopy) {
				navigator.clipboard.writeText(textToCopy).then(function() {
					var toast = document.getElementById('toast');
					toast.classList.add('show');
					setTimeout(function() {
						toast.classList.remove('show');
					}, 500);
				}).catch(function(err) {
					console.error('Failed to copy text: ', err);
				});
			}
		});
	});

	// Magic recipe for converting HEX to RGB.
	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	// Converts one color mode to another based on user selection.
	function convertColor(model) {
		colorItems.forEach(function(item) {
			var getHex = item.getAttribute('style').slice(18, 25);
			if (model === "RGB") {
				var toRGB = 'rgb(' + hexToRgb(getHex).r + "," + hexToRgb(getHex).g + "," + hexToRgb(getHex).b + ')';
				item.setAttribute('data-clipboard-text', toRGB);
				item.querySelector('span.hex').textContent = toRGB;
			} else if (model === "RGBA") {
				var toRGBA = 'rgba(' + hexToRgb(getHex).r + "," + hexToRgb(getHex).g + "," + hexToRgb(getHex).b + ",1" + ')';
				item.setAttribute('data-clipboard-text', toRGBA);
				item.querySelector('span.hex').textContent = toRGBA;
			} else {
				item.setAttribute('data-clipboard-text', getHex);
				item.querySelector('span.hex').textContent = getHex;
			}
		});
		localStorage.setItem('color-model', model || 'HEX');
	}

	// Triggers convertColor(model) on click.
	toggleButtons.forEach(function(button) {
		button.addEventListener('click', function() {
			toggleButtons.forEach(function(btn) {
				btn.classList.remove('active');
			});
			this.classList.add('active');
			convertColor(this.dataset.to);
		});
	});

	// Initializing
	document.addEventListener('DOMContentLoaded', function() {
		var getColorModel = localStorage.getItem('color-model');
		convertColor(getColorModel);

		if (getColorModel != null) {
			toggleButtons.forEach(function(button) {
				button.classList.remove('active');
			});
			var activeButton = document.querySelector('#toggles li[data-to="' + getColorModel + '"]');
			if (activeButton) {
				activeButton.classList.add('active');
			}
		}
	});
})();
