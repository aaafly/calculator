var input = 0;
var showingAnswer = false;
// input = "111-1+1/1+(22/2-222(3*3(4+4)))+(11-99/1+(2+2+(3+3(4+4+4)+3)))";
var indicatorElem = $("#result");

$("#reset").on('click', function () {
  input = 0;
  indicatorElem.html(0);
  showingAnswer = false;
});

$(".entry").on('click', function () {
  var typed = $(this).html();

  //  start new or chain from answer

  if (
    input === 'Err' ||
    (showingAnswer && typed.match(/[0-9.]/))
  ) {
    input = '0' + typed;
  } else {
    input += typed;
  }

  // remove un-needed leading zero

  if (input.match(/^0+[\d]/)) {
    input = input.replace(/^0+/, '');
  }



  indicatorElem.html(input);
  showingAnswer = false;
});

$("#equals").on('click', function () {
  var stringEquation = new StringEquation(input);
  input = stringEquation.answer
  indicatorElem.html(input);
  showingAnswer = true;
});
