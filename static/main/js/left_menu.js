var submind_mode = false;

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

    });

    $('.close-panel').click(function(){
        $('.right-top-info-panel').hide()
    })

    $(".add-category-button").click(function() {
        var id = ".category-labels-selector";
        if($(id).css('display')=='none')
            $(id).slideDown();
        else {
            $(id).slideUp();
        }        
    });

    $( "#create-mind-dialog" ).dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        width: "500px",
        buttons: [{
                text: 'ok',
                click: function() {
                    angular.element(document.getElementById('controller-body')).scope().postMind();
                    if (submind_mode) {
                        delete angular.element(document.getElementById('controller-body')).scope().submind;
                        submind_mode = false;
                    }
                    $('#create-mind-dialog').dialog('close');
                }
            },{
                text: 'Cancel',
                click: function() {
                    if (submind_mode) {
                        submind_mode = false;
                    }
                    angular.element(document.getElementById('controller-body')).scope().resetSubmindMode();

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
                $('#upload-avatar-dialog').dialog('close');
            }
        },]
    })

    $( "#log-out-dialog" ).dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        width: "500px",
        buttons: [{
            text: 'Ok',
            click: function() {
                angular.element(document.getElementById('controller-body')).scope().logoutRequest();
                $('#log-out-dialog').dialog('close');
            }
        },
        {
            text: 'Cancel',
            click: function() {
                $('#log-out-dialog').dialog('close');
            }
        },]
    })

    $('#display-mind-dialog').dialog({
        modal:true,
        autoOpen: false,
        dialogClass: 'dialog-popup',
        width: "500px",
        buttons: [{
            text: 'Ok',
            click: function() {
                angular.element(document.getElementById('controller-body')).scope().stopEdit();
                $('#display-mind-dialog').dialog('close');
            }
        },]
    })

    $('.right-top-info-panel').hide()

})