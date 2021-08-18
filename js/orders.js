// TODO:
// Заставить работать функцию которая обрабатывает отсцвствие заказов
// Разобраться с CORS policy



// --VARIABLES--

// pathes
const URL = "https://vpswA9tz.s-host.com.ua";
const order = "/admin/orders/";
const bookList = '/admin/book';

// other variables
let orderID = [];
const uahSign = "₴";

// elements
const orderBlock = $('#order-template');
const orderBlockAccept = $('#order-accept-template');
const orderBlockDecline = $('#order-decline-template');

// blocks
const unprocessed = $(".unproc__body");
const processed = $(".proc__body");




// --FUNCTIONS--

// create order block
const createOrderBlock = (orderBlock, target, name) => {
    orderBlock.clone().appendTo(target).addClass(name).attr('id', '');
}

// fill orderID array and call getOrder function on each array element
const fillOrderID = () => {
    axios.get(URL + bookList)
        .then((res) => {
            // orderID = [];
            allBooks = res.data;
            $('.unproc__order').remove()
            orderBlock.show();

            for (let i = 0; i < allBooks.data.length; i++) {
                orderID.push(allBooks.data[i].order_id);
                getOrder(URL + order + orderID[i], orderID[i], i);
                // console.log(orderID[i])
            }
            
            
        })
}

// get info and write to orderBlock
const getOrder = (path, orderID, i) => {
    axios.get(path)
        .then((data) => {
            let orderClass = 'unproc-order' + i;
            if(data.data.order != null){
                var status = data.data.order.status;
            }

            if(status == 'In progress'){
                createOrderBlock(orderBlock, unprocessed, orderClass);
                let target = $('.' + orderClass);

                target.attr('data-order', orderID);
                target.addClass('InProgress');
                console.log(status);


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

                if (totalPrice == 0) {
                    console.log('empty');
                    target.remove();
                }
            }
            else if(status == 'Ready'){
                orderClass = 'proc-order' + i;
                createOrderBlock(orderBlock, processed, orderClass);
                
                let target = $('.' + orderClass);

                target.attr('data-order', orderID);
                target.addClass('order--accepted');
                target.removeClass('unproc__order');
                target.addClass('proc__order');
                // console.log(status);


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

                if (totalPrice == 0) {
                    console.log('empty');
                    target.remove();
                }
            }

            else {
                orderClass = 'proc-order' + i;
                createOrderBlock(orderBlock, processed, orderClass);
                let target = $('.' + orderClass);

                target.attr('data-order', orderID);
                target.addClass('order--declined');
                target.removeClass('unproc__order');
                target.addClass('proc__order');

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

                if (totalPrice == 0) {
                    // console.log('empty');
                    target.remove();
                }
            }
            
        })
}

// order accept function
const acceptOrder = (target) => {
    // this.preventDefaullt();
    console.log('click');
    let orderIDSingle = target.closest('.order').getAttribute('data-order');
    console.log(orderIDSingle)

    axios.post(URL + order + orderIDSingle, {
        status: 'Test',
    })
    .then(() => {
        fillOrderID();
        console.log('filled')
    })
}

// order decline function
const declineOrder = (target) => {
    let orderIDSingle = target.closest('.order').getAttribute('data-order');
    console.log(orderIDSingle)
    declineOrderChoice(orderIDSingle);

}

// order decline function in popup
const declineOrderChoice = (orderUrl) =>{
    // let declineBlock = target.closest('.popup__inner').querySelector('input[checked]');
    declinePopup();
    let dishCheck = document.getElementById('decline-opt-dishes');
    let tableCheck = document.getElementById('decline-opt-tables');
    let response;

    $('#order-decline-save').click(function(){
        if(tableCheck.checked){
            console.log('table')
            response = 'Отказано в наличии столиков';
        } 
        else if(dishCheck.checked){
            console.log('dish')
            response = 'Отказано в наличии блюд';
        }

        console.log(response)
        popupClose();

        // axios.post(URL + order + orderUrl, {
        //     status: response,
        // })
        // .then(() => {
        //     popupClose();
        //     fillOrderID();
        // })

        
    })

    
}

// --MAIN FUNCTION--
$(document).ready(() => {
    fillOrderID();
})