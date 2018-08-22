var stripe = Stripe('YOUR_PUBLISHABLE_KEY');

var $form = $("#checkout-form");
$form.submit((event) => {
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    number:  $('#card-number').val(),
    cvc:     $('#card-cvc').val(),
    exp_month: $('#card-expiry-year').val(),
    exp_year: $('#address_zip').val(),
    name: $('#card-name ')
  }, stripeTokenHandler);
  return false; // validate data before form submission to the server
});

function stripeTokenHandler(status, response) {
  console.log(`MY RESPONSE ${response}`);
  if(response.error) {
    $('#charge-errors').text(response.error.message);
    $('#charge-errors').removeClass('hidden');
    $form.find('button').prop('disabled', false); // re-enable submission
  } else { // token was created
    const token = response.id;
    console.log(`mytoken : ${token}`);
    // insert token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // submit error
    $form.get(0).submit();
  }
}
