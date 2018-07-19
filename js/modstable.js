var menu = new Menu();
menu.append(new MenuItem({ label: 'Install Mod', click: function(e) { console.log("AHH"); } }));


var calcDataTableHeight = function() {
    return $(window).height() - 155;
};

var calcDataTableWidth = function() {
    return $(window).width();
};

var oTable = $('#modstable').dataTable({
    "bLengthChange": false,
    "bFilter": true,
    "bSort": true,
    "bInfo": false,          
    "sScrollY": calcDataTableHeight(),
    "bScrollCollapse": true,
    "paging":  false,
    "sScrollX":calcDataTableWidth(),
    "bAutoWidth": false,
    "dom":' <"search"f><"top"l>rt<"bottom"ip><"clear">'
   
});

$("#modstable #mods tr").on('click', function(event) {
    $("#modstable #mods tr").removeClass('row_selected');
            
    var item = $(this).addClass('row_selected').find('td')[0];
    console.log( item.innerHTML);  
});

$('.dataTables_scrollBody').css('width', calcDataTableWidth() - 90)
$('.dataTables_scrollBody').css('max-width', calcDataTableWidth() - 90);


$(window).resize(function() {
    $('.dataTables_scrollBody').css('height', calcDataTableHeight());
    $('.dataTables_scrollBody').css('max-height', calcDataTableHeight());

    $('.dataTables_scrollBody').css('width', calcDataTableWidth() - 90)
    $('.dataTables_scrollBody').css('max-width', calcDataTableWidth() - 90);          
    oTable.fnDraw();
});   
        
           
        
