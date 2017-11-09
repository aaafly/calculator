var input = '';
// input = "111-1+1/1+(22/2-222(3*3(4+4)))+(11-99/1+(2+2+(3+3(4+4+4)+3)))";
var indicatorElem = $("#result");

$(".entry").on('click', function () {
  input += $(this).html();
  indicatorElem.html(input);
});

$("#equals").on('click', function () {
  var stringEquation = new StringEquation(input);
  input = stringEquation.answer
  indicatorElem.html(input);
});
