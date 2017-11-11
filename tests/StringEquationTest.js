var displayElem = $('pre');
var allPassed = true;
var stringEquation = new StringEquation();
var strings = [
  '15/3*(+-4)*9/1+(2*1-(1.2-10))+(2+2)+(999999999999999*999999999999999)+(9+1+(1+1*(2*(-3-3))))*9/9*9+(1*1*(2*2))',
  '15/3*(+-4)*9/1+(2*1-(1.2-10))+(2+2)+(9*9)+(9+1+(1+1*(2*(-3-3))))*9/9*9+(1*1*(2*2))',
  '15/3*(4)*9/1+(2*1+(1-10))+(2+2)+(9+1+(1+1*(2*(-3-3))))*9/9*9+(1*1*(2*2))',
  '(9+(12*(-3)))*9+(1*1)',
  '(9+(12*(-3)))*9+(1*1)',
  '(9+(-36))*9+(1*1)',
  '1+(91+(11*(+2)))*9+(+1)',
  '1+(91+(+2))*9+(+1)',
  '1+(93)*9+(+1)',
  '1+(93)*9+(+1)',
  '1+93*9+1',
  '3+3*4',
  '+15/+3*(+4)*+9/+1*(+1)',
  '15/3*(4)',
  '15/3*4'
];
for (var i = 0; i < strings.length; i++) {
  stringEquation.str = strings[i];
  var error;
  var result = null;
  var evaluated;
  try {
    result = parseFloat(stringEquation.calculate().result);
    evaluated = eval(strings[i]);
  } catch (e) {
    error = e;
  }
  var passed = evaluated === result;
  if (!passed) {
    allPassed = false;
  }
  var html = `<p>
      <span class="${passed ? 'passed' : 'failed'}">${passed ? 'PASSED' : 'FAILED'}</span>  
      result: ${result} ${passed ? '' : 'expected: ' + evaluated}
      string: ${strings[i]}
      ${error}
    </p>`
  displayElem.append(html);
}

displayElem.prepend(`<h1 class="${allPassed ? 'passed' : 'failed'}">TESTS ${allPassed ? 'PASSED' : 'FAILED'}</h1>`)