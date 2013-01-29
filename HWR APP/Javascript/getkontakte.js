$('#menue').on("pageshow", function() {
	$('#kontaktliste').empty();
	$.getJSON('kontakte.json', function(data) {
		$each(data.kontakte, function (i, item) {
			$('<li><a href="kontakt-detail.hmtl" data-trasition="slide" onClick="javascript:sessionStorage.kontakt=/' + item.name + '</a></li>').appendTo('#kontaktliste');
		});
		$('#kontaktliste').listview('refresh');
	});
});