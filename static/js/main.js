$(document).ready(function() {
  $.get('https://api.s101.nonprod-ffs.io/ops-engineer/profile', function(data){
    fill_customerinfo_table(data);
  })
  $.get('https://api.s101.nonprod-ffs.io/ops-engineer/list', function(data){
    fill_accountinfo_table(data);
    transaction_history(data);
  })
})

function fill_customerinfo_table(data) {
  $("#name").text(data.name);
  $("#phone").text(data.phone_number);
  $("#address").text(data.address.street_address);
  $("#email").text(data.email);
  $("#dob").text(data.date_of_birth);
}

function fill_accountinfo_table(data) {
  var balance = data.items[0].transaction.account_balance;
  var curr = data.items[0].transaction.currency;
  $("#balance").text(currency_symbols[curr] + balance);
  var id = data.items[0].transaction.account_id;
  console.log(id);
  $("account_id").append(id);
}

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

      console.log(name, emoji);
      if (check_transaction(data, i)){
        emoji = monzo;
        var name = data.items[i].transaction.description;
        var merchant_address = "N/A";
        create_card(emoji, name, amount, merchant_address);
      } else {
        var name = data.items[i].transaction.merchant.name;
        var merchant_address = data.items[i].transaction
                                  .merchant.address.short_formatted;
        create_card(emoji, name, amount, merchant_address);
      }
    }
  }
}

function check_transaction(data, i) {
  if (data.items[i].transaction.amount > 0) {
    return 1;
  } else {
    return 0;
  }
}

function create_card(emoji, cut, amount, merchant_address){
  $('#transactions').append(
    $("<li>").append(
      $('<div>').attr('class', 'collapsible-header').append(
        $('<div>').attr('class', 'emoji').append(emoji))
        .append(
          $('<div>').attr('class', 'desc').text(cut))
          .append(
            $('<div>').attr('class', 'amount').text(amount)
          )
        )
        .append(
          $('<div>').attr('class', 'collapsible-body')
        ).append(
          $('<table>'))
          .append(
            $('<tbody>').append(
              $('<tr>').append(
                $('<td>').text("Merchant Address:")
              )
              .append(
                $('<td>').text(merchant_address)
              )
                )
              )
            );
}
