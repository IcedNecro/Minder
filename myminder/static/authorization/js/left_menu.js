$(document).ready(function(){
    var isShown = true;

    $(window).resize(function(){
        $('.menu-pin').css('top', parseInt($('.menu').css('height'))/2-50)
    })

    $('.menu-pin').click(function(){
        if(isShown) {
            $('.menu-wrapper').animate({ left:'-=220'}, 200);
            isShown = false;
        } else {
            $('.menu-wrapper').animate({ left:'+=220'}, 200);
            isShown = true;
        }
    })

    $('.dialog-invoke').click(function() {
        var dialog = '#' + $(this)[0].id + '-dialog';
        $(dialog).dialog('open');
    })

    $('.expandable').click(function() {
        var id = '.'+$(this)[0].id;
        if($(id).css('display')=='none')
            $(id).slideDown();
        else {
            $(id).slideUp();
        }

    })

    $( "#create-mind-dialog" ).dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        buttons: [{
            text: 'ok',
            click: function() {
                angular.element(document.getElementById('controller-body')).scope().postMind();
                $('#create-mind-dialog').dialog('close');
            }
        },{
            text: 'Cancel',
            click: function() {
                $('#create-mind-dialog').dialog('close');
            }
        },
        ]
    });

    $( "#search-friend-dialog" ).dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        width: "500px",
        buttons: [{
            text: 'ok',
            click: function() {
                $('#search-friend-dialog').dialog('close');
            }
        },]
    })
    $( "#upload-avatar-dialog" ).dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        width: "500px",
        buttons: [{
            text: 'ok',
            click: function() {
                $('#search-friend-dialog').dialog('close');
            }
        },]
    })

})