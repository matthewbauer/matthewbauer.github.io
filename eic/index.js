$(function() {
	var ships = {};
	var canvas = document.getElementById("mycanvas");
	var context = canvas.getContext("2d");
	var anicanvas = document.getElementById("anicanvas");
	var anicontext = anicanvas.getContext("2d");
	var img = new Image();
	img.src = "Equirectangular_projection_SW.jpg";
	img.onload = function() { context.drawImage(img, 0, 0, 1000, 500); anicontext.drawImage(img, 0, 0, 1000, 500); };

	function longToX(long) {
		return long > 180 ? (long - 180) / 360 * 1000 : 500 + long / 360 * 1000;
	}
	function latToY(lat) {
		return 250 - lat / 180 * 500;
	}
	var ship;
	function drawShip() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, 0, 0, 1000, 500);
		$("#name").html(ship.name);
		$("#year").html(ship.points[0].date + " to " + ship.points[ship.points.length - 1].date);
		for (var point in ship.points) {
			var p = ship.points[point];
			var x = longToX(p.long);
			var y = latToY(p.lat);
			context.fillRect(x - 2.5, y - 2.5, 5, 5);
		}
		var date = new Date(ship.points[0].date);
		function animation() {
			date.setTime(date.getTime() + 86400000);
			if (date > ship.points[ship.points.length-1].date) {
				date = new Date(ship.points[0].date);
			}
			for (var point in ship.points) {
				var p = ship.points[point];
				if(p.date.getDate() == date.getDate() && p.date.getMonth() == date.getMonth() && p.date.getYear() == date.getYear()) {
					var x = longToX(p.long);
					var y = latToY(p.lat);
					anicontext.clearRect(0, 0, canvas.width, canvas.height);
					anicontext.drawImage(img, 0, 0, 1000, 500);
					anicontext.fillRect(x - 2.5, y - 2.5, 5, 5);
					anicontext.fillText(date, 100, 100)
				}
			}
			setTimeout(animation, 20);
		}
		animation();
	}
	$('#ships').change(function() {
		ship = ships[$(this).val()];
		drawShip();
	});
	$.get("./CLIWOC21.mini.txt", function(data) {
		var lines = data.split("\n");
		for (var line in lines) {
			var name = lines[line].substring(23, 53).trim();
			if (!ships[name]) {
				ships[name] = {};
				ships[name].points = [];
				ships[name].name = name;
			}
			var point = {};
			var year = lines[line].substring(0, 4);
			var month = lines[line].substring(4, 6);
			var day = lines[line].substring(6, 8);
			var hour = lines[line].substring(8, 12);
			point.date = new Date(year, month, day, hour)
			point.lat = parseInt(lines[line].substring(12, 17)) / 100;
			point.long = parseInt(lines[line].substring(17, 23)) / 100;
			ships[name].points.push(point);
		}
		for (var name in ships) {
			$('#ships').append($("<option>" + name + "</option>"));
			ships[name].points.sort(function(a, b) {
				 return a.date - b.date;
			});
		}
		ship = ships["ABEL TASMAN"];
		drawShip();
	});
});
