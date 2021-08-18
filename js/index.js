


// LANGUAGE SWITCHER
$('.language__heading').click(function () {
    $('.language__body').toggleClass('language__body--open')

    $(document).mouseup(function (e) {
        var block = $(".language__body");
        if (!block.is(e.target) && block.has(e.target).length === 0) {
            block.removeClass('language__body--open')
        }
    });
})

// POPUPS
function declinePopup() {
    $('.content').addClass('content--hidden')
    $('.popups').fadeTo(1, 300);
    $('.popup__decline').fadeTo(1, 300);
}

function popupClose() {
    $('.popup__decline').fadeOut();
    $('.popups').fadeOut();
    $('.content').removeClass('content--hidden')
}