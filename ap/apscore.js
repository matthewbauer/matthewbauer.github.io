aptests = [
	{id:0, text:'Art History'},
	{id:1, text:'Biology'},
	{id:2, text:'Calculus AB'},
	{id:3, text:'Calculus BC'},
	{id:4, text:'Chemistry'},
	{id:5, text:'Chinese Language and Culture'},
	{id:6, text:'Comparative Government and Politics'},
	{id:7, text:'Computer Science A'},
	{id:8, text:'English Language and Composition'},
	{id:9, text:'English Literature and Composition'},
	{id:10, text:'Environmental Science'},
	{id:11, text:'European History'},
	{id:12, text:'French Language'},
	{id:13, text:'German Language'},
	{id:14, text:'Human Geography'},
	{id:15, text:'Italian Language and Culture'},
	{id:16, text:'Japanese Language and Culture'},
	{id:17, text:'Latin'},
	{id:18, text:'Macroeconomics'},
	{id:19, text:'Microeconomics'},
	{id:20, text:'Music Theory'},
	{id:21, text:'Physics B'},
	{id:22, text:'Physics C: Mechanics'},
	{id:23, text:'Physics C: Electricity and Magnetism'},
	{id:24, text:'Psychology'},
	{id:25, text:'Spanish Language'},
	{id:26, text:'Spanish Literature'},
	{id:27, text:'Statistics'},
	{id:28, text:'Studio Art: 2-D Design Portfolio'},
	{id:29, text:'Studio Art: 3-D Design Portfolio'},
	{id:30, text:'Studio Art: Drawing Portfolio'},
	{id:31, text:'U.S. History'},
	{id:32, text:'U.S. Government and Politics'},
	{id:33, text:'World History'},
];
var apscores = [
	{id:0, text:'0'},
	{id:1, text:'1'},
	{id:2, text:'2'},
	{id:3, text:'3'},
	{id:4, text:'4'},
	{id:5, text:'5'}
];
var curTest = 1;

addRow = function(){
	var dialog = $('<div/>').attr('class', 'entry').html('I got a <span class="score"></span> on <span class="test"></span>');

	var testSelect = $('<input/>').attr('name', 'test' + curTest).
		attr('data-placeholder', 'name of test').addClass('aptests chosen-select input-lg');
	testSelect.on('change', function(evt, params) {
//		index = aptests.indexOf(params.selected)
//		if (params.selected != '' && index) {
//			aptests.splice(index, 1)
//		}
//		index = aptests.indexOf(params.deselected)
//		if (params.deselected != '' && index == -1) {
//			aptests.append(params.deselcted)
//		}

		addRow();
		$(this).off('change');
//		$(this).parent().children().off('change');
	});

	var scoreSelect = $('<input/>').attr('name', 'score' + curTest).
		attr('data-placeholder', 'score').addClass('apscores chosen-select input-lg');
	curTest++;
	var container = $('<div/>');
	scoreSelect.on('change', function(evt, params) {
//		addRow();
		$(this).off('change');
	});

	dialog.children('.test').append(testSelect);
	dialog.children('.score').append(scoreSelect);

	dialog.appendTo('#scorelist');

	$('.apscores').select2({
		placeholder: "Select Score",
		allowClear: true,
		data: apscores
	});

	$('.aptests').select2({
		placeholder: "Select AP Test",
		allowClear: true,
		data: aptests,
		matcher: function(term, text, opt) {
			return text.toUpperCase().
				replace('&', 'and').replace('.','').replace(':','').replace(/^AP/, '').
				indexOf(term.toUpperCase())>=0;
		},
		sortResults: function(results, container, query) {
			if (query.term) {
				// use the built in javascript sort function
				return results.sort(function(a, b) {
					if (a.text.length > b.text.length) {
						return 1;
					} else if (a.text.length < b.text.length) {
						return -1;
					} else {
						return 0;
					}
				});
			}
			return results;
		}
	});
	//$('.aptests').fadeIn()
};
$(document).ready(function(){
	addRow();
	$('#loading').hide();
	$('#data').hide();
	$('#form').submit(function(event) {
		event.preventDefault();
		$('#loading').show();
		$('#form').hide();
		var post = $.post('submit.cgi', $(".form").serialize()).
			done(function(data) {
				$('#loading').hide();
				var list = [];
				var maxCollege;
				$.each(data, function(index, value){
					data[index].totalCredits = 0;
					$.each(value.Credits, function(i, value){
						data[index].totalCredits+=value.Credit;
					});
					if (maxCollege === undefined || data[index].totalCredits > maxCollege.totalCredits)
						maxCollege = data[index];
					list.push(data[index]);
				});
				list = $.grep(list, function(value, index){
					return value.totalCredits > maxCollege.totalCredits * 3 / 4;
				});
				list.sort(function(a, b) { return b.totalCredits - a.totalCredits; });
				if(list.length === 0)
					$('results-info').html("<p>No schools will give credit for your AP scores.</p>");
				$.each(list, function(index, value){
					var progressbar = $('<div/>').addClass('progress-bar progress-bar-info').
						attr('role', 'progressbar').
						attr('aria-valuenow', value.totalCredits).attr('aria-valuemin', '0').
						attr('aria-valuemax', maxCollege.totalCredits).
						css('width', (value.totalCredits / maxCollege.totalCredits * 100) + '%').
						html(value.totalCredits + ' credits');
					var progress = $('<div/>').addClass('progress').append(progressbar);
					var name = $('<h4/>').html(value.Name);
					var item = $('<a/>').attr('href', 'http://google.com/search?q=' + value.Name).
						addClass('list-group-item').append(name).append(progress);
					$('#table').append(item);
				});
				$('#loading').hide();
				$('#data').show();
			});
	});
});
