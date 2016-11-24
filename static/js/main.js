$('#testtest123').on("click", function() {
  $.get('https://api.s101.nonprod-ffs.io/ops-engineer/profile', function(data){
    console.log(data.name);
    console.log(data.address.street_address[0]);
    console.log(data.date_of_birth);
    console.log(data.email);
    console.log(data.phone_number);
  })
})
