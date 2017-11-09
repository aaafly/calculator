function StringEquation() {
  this.str = '0';
  this.deepness = 1;
}

// Only for test purposes.
StringEquation.prototype.testEval = function () {
  try {
    console.log('eval >>>>>> ', eval(this.str));
  } catch (err) {
    console.log('eval failed');
  }
};

StringEquation.prototype.calculate = function () {
  try {
    this.validateEquation();
    this.sanitizeParenthesis();
    console.log(this.str);
    this.sanitizeDoubleNegation();
    this.testEval();
    this.setDeepness();

    while (this.deepness > 1) {
      this.simplifyDeepest();
    }

    this.str = this.calculateFlatString(this.str);

    return {result: this.str};
  } catch (err) {
    return {err: err.msg || 'Err'}
  }
};

StringEquation.prototype.reset = function () {
  this.str = '0';
};

StringEquation.prototype.appendEntry = function (char) {

  // prevent starting with closing parenthesis
  if (this.str === '0' && char === ')') {
    return;
  }

  // prevent multiple multiplication/division together
  if (['*', '+', '/'].indexOf(this.str.slice(-1)) !== -1 && ['*', '/', '+'].indexOf(char) !== -1) {
    return;
  }

  // prevent triple negation
  if (this.str.slice(-2) === '--' && char === '-') {
    return;
  }

  // prevent leading zero
  if (this.str === '0' && char.match(/[0-9(]/)) {
    this.str = '';
  }

  this.str += char;
}

StringEquation.prototype.validateEquation = function () {
  if ((this.str.match(/\(/g) || []).length !== (this.str.match(/\)/g) || []).length) {
    throw {msg: 'Unbalanced parenthesis'}
  }
};

StringEquation.prototype.sanitizeDoubleNegation = function () {
  this.str = this.str.replace(/--/g, '+');
};

StringEquation.prototype.sanitizeParenthesis = function () {
  this.str = this.str.replace(/([\d|)])\(/g, function replacer(match, digit) {
    return digit + '*(';
  });
};

StringEquation.prototype.sanitizeDoubleOperators = function (str) {
  str = str.replace(/--/g, '+');
  str = str.replace(/\+-/g, '-');
  str = str.replace(/\+\+/g, '+');
  str = str.replace(/-\+/g, '-');

  return str;
};

StringEquation.prototype.simplifyDeepest = function () {
  var level = 1;
  var start = 0;
  var end = 0;
  for (var i = 0; i < this.str.length; i++) {
    if (this.str[i] === '(') {
      level++;
      if (level === this.deepness) {
        start = i;
      }
    } else if (this.str[i] === ')') {
      if (level === this.deepness) {
        end = i;
        break;
      }
      level--;
    }
  }

  var equation = this.str.slice(start + 1, end);
  var result = this.calculateFlatString(equation);

  this.str = this.str.substr(0, start)
    + result
    + this.str.substr(start + 2 + equation.length, this.str.length);

  this.setDeepness();
};

StringEquation.prototype.setDeepness = function () {
  var level = 1;
  var levelMax = 1;
  this.deepness = 1;
  for (var i = 0; i < this.str.length; i++) {
    if (this.str[i] === '(') {
      level++;
      this.deepness = level > levelMax ? level : levelMax;
    } else if (this.str[i] === ')') {
      level--;
    }
  }
};

StringEquation.prototype.calculateAndReplace = function (str, pattern, type) {
  var match = str.match(pattern);
  while (match) {
    var parts = match[0].split(type);
    var result;
    if (type === '*') {
      result = parseFloat(parts[0]) * parseFloat(parts[1]);
    } else if (type === '/') {
      result = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      console.log('ERROR OPERATOR TYPE UNEXPECTED');
    }

    str = str.substr(0, match.index)
      + result
      + str.substr(match.index + match[0].length, str.length);

    match = str.match(pattern);
  }

  return str;
};

StringEquation.prototype.calculateFlatString = function (str) {
  str = this.sanitizeDoubleOperators(str);
  str = this.calculateAndReplace(str, /[0-9.]+\*-?[0-9.]+/, '*');
  str = this.calculateAndReplace(str, /[0-9.]+\/[0-9.]+/, '/');

  var sign = str[0] === '-' ? '-' : '+';
  if (sign === '-') {
    str = str.slice(1);
  }
  var typeMatch = str.match(/[\-+]/);
  var addPattern = /[0-9.]+\+[0-9.]+/;
  var subPattern = /[0-9.]+-[0-9.]+/;
  while (typeMatch) {
    var pattern = typeMatch[0] === '+' ? addPattern : subPattern;
    var match = str.match(pattern);
    var parts = match[0].split(typeMatch[0]);
    var result;
    if (typeMatch[0] === '+') {
      result = sign === '-' ? -parseFloat(parts[0]) + parseFloat(parts[1]) : parseFloat(parts[0]) + parseFloat(parts[1]);
    } else {
      result = sign === '-' ? -parseFloat(parts[0]) - parseFloat(parts[1]) : parseFloat(parts[0]) - parseFloat(parts[1]);
    }

    str = str.substr(0, match.index)
      + result
      + str.substr(match.index + match[0].length, str.length);

    sign = str[0] === '-' ? '-' : '+';
    if (sign === '-') {
      str = str.slice(1);
    }

    typeMatch = str.match(/[\-+]/);

    if (!typeMatch && sign === '-') {
      str = '-' + str;
    }
  }

  return str;
};
