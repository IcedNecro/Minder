$(document).ready(function(){
    $(".close-panel").click(function() {
        $(".right-top-info-panel").addClass("hidden-panel");
    })
})

function open_right_panel() {
    if($(".right-top-info-panel")[0].className.indexOf("hidden-panel")!=-1){
        $(".right-top-info-panel").removeClass("hidden-panel");
    }
}

function appearContent() {
    $(".right-top-info-panel *").fadeIn()
}
