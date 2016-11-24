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
}

function transaction_history(data) {
  for (var i = 0; i < 10; i++) {
    create_card(data);
    // console.log(String(i) + "/" + String(data.items.length));
    // var amount = Math.abs(data.items[i].transaction.amount);
    // var curr = data.items[i].transaction.currency;
    // $(".amount").text(currency_symbols[curr] + amount);
    // var emoji = "";
    // try {
    //   emoji = data.items[i].transaction.merchant.emoji;
    // } catch(err) {
    //   console.log(err);
    // }
    // if (emoji !== ""){
    //   $(".emoji").append(twemoji.
    //     parse(data.items[i].transaction.merchant.emoji));
    // }
    // var description = data.items[i].transaction.description
    // var cut = description.substr(0,description.indexOf('   '));
    // $(".desc").text(cut);
  }

}

function create_card(data){
  $('#transactions').append(
    $("<li>").append(
      $('<div>').attr('class', 'collapsible-header').append(
        $('<div>').attr('class', 'emoji')).append(
          $('<div>').attr('class', 'desc')).append(
            $('<div>').attr('class', 'amount')
          )
        ).append(
          $('<div>').attr('class', 'collapsible-body').append(
            $('<p>')
          )
        )
  );
}
