// global variable to access transactions
tran_history = ""

// calls api's once page loads to get the data needed
$(document).ready(function() {
  $.get('https://api.s101.nonprod-ffs.io/ops-engineer/profile', function(data){
    fill_customerinfo_table(data);
  })
  $.get('https://api.s101.nonprod-ffs.io/ops-engineer/list', function(data){
    tran_history = data;
    fill_accountinfo_table(data);
    transaction_history(data);
  })
})

// completes the customer data within the customer_data card
function fill_customerinfo_table(data) {
  $("#name").text(data.name);
  $("#phone").text(data.phone_number);
  $("#address").text(data.address.street_address);
  $("#email").text(data.email);
  $("#dob").text(data.date_of_birth);
}

// fills account info card and fixes currency to the balance
function fill_accountinfo_table(data) {
  var balance = data.items[0].transaction.account_balance;
  var curr = data.items[0].transaction.currency;
  $("#balance").text(currency_symbols[curr] + balance);
  var id = data.items[0].transaction.account_id;
  $("#account_id").text(id);
}

// creates everything within the transaction history card
function transaction_history(data) {
  for (var i = 0; i < 15; i++) {

    var emoji = "";
    try {
      emoji = data.items[i].transaction.merchant.emoji;
      if (emoji !== ""){
        emoji = twemoji.parse(data.items[i].transaction.merchant.emoji);
      }
    } catch(err) {
      console.log(err);
    } finally {

      var amount = Math.abs(data.items[i].transaction.amount);
      var curr = data.items[i].transaction.currency;
      amount = currency_symbols[curr] + amount;

      if (check_transaction(data, i)){
        emoji = monzo;
        var name = data.items[i].transaction.description;
        var merchant_address = "N/A";
        create_card(emoji, name, amount, merchant_address, data.items[i].transaction, i);
      } else {
        var name = data.items[i].transaction.merchant.name;
        var merchant_address = data.items[i].transaction
                                  .merchant.address.short_formatted;
        create_card(emoji, name, amount, merchant_address, data.items[i].transaction, i);
      }
    }
  }
}

// checks if a transaction is a purchase or a topup
function check_transaction(data, i) {
  if (data.items[i].transaction.amount > 0) {
    return 1;
  } else {
    return 0;
  }
}

// creates the cards within the transaction history table and fills in the data
function create_card(emoji, cut, amount, merchant_address, transaction, i){
  $('#transactions')
  .append(
    $("<li>")
    .append(
      $('<div>').attr('class', 'collapsible-header')
      .append(
        $('<div>').attr('class', 'emoji')
        .append(emoji))
        .append(
          $('<div>').attr('class', 'desc')
          .text(cut))
        .append(
          $('<div>').attr('class', 'amount').text(amount)))
        .append(
          $('<div>').attr('class', 'collapsible-body')
          .append(
            $('<table>')
            .append(
              $('<tbody>')
              .append(
                $('<tr>')
                .append(
                  $('<td>').text("Merchant Address:"))
                .append(
                  $('<td>').text(merchant_address)
                )
              )
              .append(
                $('<tr>')
                .append(
                  $('<td>').text("Date of Transaction:")
                ).append(
                  $('<td>').text(transaction.created)
                )
              )
            )
          )
          .append(
            $('<p>')
            .append(
              $('<input>').attr('type', 'checkbox')
                .attr('id', 'test' + String(i))
                .attr('onChange', 'check(' + String(i) + ')')
            )
            .append(
              $('<label>').attr('for', 'test' + String(i)).text("Flag")
            )
          )
        )
      );
}

// creates/deletes feedback chips depending on attributes of selected card
function check(id){
  var checkbox = $("#test" + String(id));

  if (checkbox.attr('checked') === undefined) {
    checkbox.attr('checked', true);
    make_chip(id);
  } else {
    checkbox.attr('checked', null);
    delete_chip(id);
  }
}

// creates the chip using the id number of the card selected to put correct name
function make_chip(id) {
  $('#chips')
  .append(
    $('<div>').attr('class', 'chip').attr('id', String(id))
  .append(
    $('<i>').attr('class', 'material-icons').text('star'))
    .text(tran_history.items[id].transaction.merchant.name));
}

// deletes chip with matching id number
function delete_chip(id) {
  var id = id;
  $('#' + String(id)).remove();
}
