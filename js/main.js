var input = '';
// input = "111-1+1/1+(22/2-222(3*3(4+4)))+(11-99/1+(2+2+(3+3(4+4+4)+3)))";
var indicatorElem = $("#result");

$("#reset").on('click', function () {
  input = 0;
  indicatorElem.html(input);
});

$(".entry").on('click', function () {
  if (input === 'Err') {
    input = $(this).html()
  } else {
    input += $(this).html();
  }

  indicatorElem.html(input);
});

$("#equals").on('click', function () {
  var stringEquation = new StringEquation(input);
  input = stringEquation.answer
  indicatorElem.html(input);
});
