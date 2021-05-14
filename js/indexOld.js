// TODO: 
// Заставить работать функцию, отвечающую за обработку данных из getAllBooks
// Так же эта функция должна выводить элементы order, столько же, сколько их в базе данных
// После обработки заказа он переносится в блок с обработанными заказами, и изменять свой вид в зависимости от того, принят заказ или отклонен


const URL = "https://vpswA9tz.s-host.com.ua";

const order = "/admin/orders/";

const bookList = '/admin/book';

// let orderID = "5fc8effee5580e00049fa145";

let orderID = [];

const uahSign = "₴";


// const filledOrders = $(".main-orders-unprocessed-filled");

const dishes = $(".order-dishes");

const dishPrice = $(".price");

// const confirmOrder = $(".accept");

const declineOrder = $(".decline");

const unprocessed = $(".unproc__body");

const processed = $(".proc__body");

var allBooks;

const orderBlock = $('#order-template');

const orderBlockAccept = $('#order-accept-template');

const orderBlockDecline = $('#order-decline-template');




// Главная функция
$(document).ready(() => {
    noOrders(processed);
    noOrders(unprocessed);

    displayUnprocOrders();

})



// Функция обработки подтверждения заказа
function confirmOrder() {
    $('.accept').click(function () {
        var dataOrder = $(this).closest('.unproc__order[data-order]').attr('data-order');
        console.log(dataOrder)
        alert('hello')

        axios.post(URL + order + dataOrder, {
            status: 'Ready'
        })
        displayUnprocOrders()
    })
}





// функция которая берет orderID и записывает в массив
function displayUnprocOrders() {

    axios.get(URL + bookList)

        .then((res) => {
            // orderID = [];
            allBooks = res.data;
            // $('.unproc__order').remove()
            // orderBlock.show();



            for (let i = 0; i < allBooks.data.length; i++) {
                orderID.push(allBooks.data[i].order_id);
            }
            
            for (let i = 0; i < orderID.length; i++) {
                getUnprocOrder(URL + order + orderID[i], orderID[i], i)
                
            }
            // orderBlock.hide();
            // alert('done')
            // confirmOrder();
        })
}

function displayProcOrders(){
    
}

// Функция создания блока заказа
function createOrderBlock(target, name) {
    orderBlock.clone().appendTo(target).addClass(name);
}

// Функция которая заполняет заказы инфой
function getUnprocOrder(path, orderID, i) {
    axios.get(path)
        .then((data) => {
            
            let status = data.data.order.status;
            
            if (status == 'In progress') {
                let orderClass = 'unproc-order' + i;
                createOrderBlock(unprocessed, orderClass);
                let target = $('.' + orderClass);
                // console.log(orderClass)


                console.log(data.data.order.status)
                let totalPrice = 0;
                const orderItems = data.data.items;
                for (let i = 0; i < orderItems.length; i++) {
                    totalPrice += Number(orderItems[i].product.price.$numberDecimal);
                    const dish = document.createElement("span");
                    dish.className = "dish";

                    const dishAmount = document.createElement("span");
                    dishAmount.className = "dish-amount";
                    dishAmount.innerText = "x";
                    dish.append(dishAmount);

                    let orderTitleEl = document.createElement("span");
                    let orderAmountEl = document.createElement("span");

                    orderAmountEl.innerHTML = orderItems[i].quantity;

                    orderTitleEl.innerHTML = orderItems[i].product.title;

                    dish.prepend(orderTitleEl);
                    dishAmount.prepend(orderAmountEl);
                    target.children('.order-dishes').append(dish);
                }

                target.children('.price').append(totalPrice + uahSign);

                target.attr('data-order', orderID)

                // console.log(totalPrice)

                if (totalPrice == 0) {
                    console.log('empty');
                    target.remove();
                }

                
            }
            else {
                target.remove();
            }


        })
        .catch((data) => {
            if (data === undefined) {
                alert('un')
                filledOrders.classList.add("hide");
                noOrders.classList.remove("hide");
            }
        });
}

// Функция которая обрабатывает отсувствие заказов
function noOrders(orderBlock) {
    let orderLenght;
    $(orderBlock).each(function () {
        orderLength = $(this).find('.order').length;
    })

    if (orderLength == 0) {
        orderBlock.children('.orderHeading').addClass('orderHeading--hidden');
    } else {
        orderBlock.children('.noOrders').addClass('noOrders--hidden');
    }
}

// Получение статуса заказа







// Изменение статуса заказа
const postStatusOfOrder = (url, status) => axios.post(url, {
    status: status ? 'Ready' : 'Not ready'
})














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