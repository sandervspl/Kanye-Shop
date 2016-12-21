// global vars
var g_isModalOpen = false




// close modal
$('.exit').find('span').on('click', function() {
    // set modal is closed
    g_isModalOpen = false

    // close modal window
    $('#modals').fadeOut()
})

// open modal
$('.product-card').on('click', function() {
    // elements
    const modals      = $('#modals'),
          modal       = modals.find('.modal'),
          description = $(this).find('.description'),
          header      = $(this).find('.header'),
          preview     = modal.find('.preview'),
          info        = modal.find('.info'),
          info_1      = info.find('.info-1'),
          info_3      = info.find('.info-3'),
          data        = $(this).find('.data'),
          quantity    = $('#quantity')

    // grab all data
    const bgColor = getClassArray(header.attr('class'))[1],
          name    = description.find('.name').text(),
          price   = description.find('.price').text(),
          imgSrc  = header.find('img').attr('src'),
          rating  = data.data('rating'),
          stock   = data.data('stock'),
          year    = data.data('year'),
          era     = data.data('era'),
          rarity  = data.data('rarity'),
          sku     = data.data('sku')

    // remove previous bg color
    const bgClass = getClassArray(modal.attr('class'))[1]
    modal.removeClass(bgClass)

    // set modal bg color
    modal.addClass(bgColor)

    // set data
    preview.find('img').attr('src', imgSrc)
    preview.find('.name').html(name)
    preview.find('.price').html(price)

    // set rating
    const ratingStars = info_1.find('.rating-stars')
    for (var i = 0; i < 5; i += 1) {
        const star = ratingStars.children().eq(i)

        // reset star rating
        star.removeClass('black')

        if (i < rating)
            star.addClass('black')
    }

    // set stock data
    const state = (stock === 1) ? 'yes' : 'no',
          icon  = info_1.find('.stock-icon')

    icon.removeClass('no').addClass(state)

    // make quantity and cart button available on stock availability
    if ( ! stock) {
        quantity.attr('disabled', 'disabled')
        $('.min, .plus, #quantity, .cart-btn').addClass('disabled')
    } else {
        quantity.removeAttr('disabled')
        $('.min, .plus, #quantity, .cart-btn').removeClass('disabled')
    }

    // set product description
    info_3.find('.year').html(year)
    info_3.find('.era').html(era)
    info_3.find('.rarity').html(rarity)
    info_3.find('.sku').html(sku)

    // reset quantity if needed
    quantity.val(1)

    // set modal is open
    g_isModalOpen = true

    // show modal overlay
    modals.fadeIn()
})


// + and - quantity buttons
$('.min').on('click', changeQuantity.bind(null, -1))
$('.plus').on('click', changeQuantity.bind(null, 1))

function changeQuantity(amount, e) {
    if ($(e.target).hasClass('disabled'))
        return

    const counter = $('#quantity'),
          val     = parseInt(counter.val())
    var newVal    = val + amount

    // do not allow 0 or negative quantity
    if (newVal < 1) newVal = 1

    // animate and set value
    counter.removeClass('active').val(newVal)
    setTimeout(function() { counter.addClass('active') }, 1)
}


// + cart button
$('.cart-btn').on('click', function(e) {
    if ($(e.target).hasClass('disabled'))
        return

    // get head img src
    const src = $(this).parent().parent().parent().find('.preview').find('img').attr('src')

    // create and do animation
    headToCartAnim(e, src)
})

function headToCartAnim(e, src) {
    const wrapper = $('#wrapper'),
          face    = $('<div class="face"></div>'),
          img     = $('<img alt="face" />')

    // add elements to view
    face.append(img)
    wrapper.append(face)

    // get mouse click coordinates
    const x = e.clientX - 17 + 'px',
          y = e.clientY - 25 + 'px'

    // set image source
    img.attr('src', src)

    // set face container initial position
    face.css('left', x)
        .css('top', y)
        .fadeIn()

    // get cart icon's position
    const cart  = $('#cart-icon'),
          cartX = $(window).width() - 45,  // 45px offset (padding + icon width) from the right
          cartY = cart.position().top

    // animation
    face.animate({
        left: cartX,
        top:  cartY
    },
    1000,
    function() {
        const cartCount = $('#cart-count'),
            val         = parseInt(cartCount.text()),     // get current cart value
            qVal        = parseInt($('#quantity').val())  // get value from quantity field

        // new value
        const newVal = val + qVal

        // animate and set value
        cartCount.removeClass('active').html(newVal)
        setTimeout(function() { $('#cart-count').addClass('active') }, 1)

        // fade out face
        $(this).remove()
    })
}


// global functions
function getClassArray(classes) {
    return classes.split(' ')
}


// event listeners
window.addEventListener('wheel', function(e) {
    if (g_isModalOpen)
        e.preventDefault()
})

window.addEventListener('touchmove', function(e) {
    if (g_isModalOpen)
        e.preventDefault()
})