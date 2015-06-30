$(document).ready(function(){
    var isShown = true;

    $(window).resize(function(){
        $('.menu-pin').css('top', parseInt($('.menu').css('height'))/2-50)
    })

    $('.menu-pin').click(function(){
        if(isShown) {
            $('.menu-wrapper').animate({ left:'-=200'}, 200);
            isShown = false;
        } else {
            $('.menu-wrapper').animate({ left:'+=200'}, 200);
            isShown = true;
        }
    })

    $('#create-mind').click(function() {
        $("#create-mind-dialog").dialog('open');
    })

    $( "#create-mind-dialog" ).dialog({
        modal:true,
        autoOpen: false,
    });

})