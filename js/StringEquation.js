function StringEquation() {
  this.str = '0';
}

/**
 * @returns {{result: string|undefined, err: string|undefined}}
 */
StringEquation.prototype.calculate = function () {

  try {
    this.testEval();
    this.validateEquation();
    this.sanitize();
    var _this = this;
    var innerParenthesisPattern = /\(([e.+*\/\d\-]+)\)/;
    while (this.str.match(innerParenthesisPattern)) {
      this.str = this.str.replace(innerParenthesisPattern, function (match, str) {
        return _this.calculateFlatString(str);
      });
    }

    this.str = this.calculateFlatString(this.str);

    return {result: this.str};
  } catch (err) {
    return {err: err.msg || ' '}
  }
};

/**
 * @param {string} str
 * @returns {string}
 */
StringEquation.prototype.calculateFlatString = function (str) {

  var firstPriorityPattern = /(-?[0-9.]+(?:[eE][+\-]?\d+)?)(\*|\/)([+\-]?[0-9.]+(?:[eE][+\-]?\d+)?)/;
  while (str.match(firstPriorityPattern)) {
    str = str.replace(firstPriorityPattern, function (match, a, operator, b) {
      return operator === '/' ? parseFloat(a) / parseFloat(b) : parseFloat(a) * parseFloat(b);
    });
  }

  var secondPriorityPattern = /(-?[0-9.]+(?:[eE][+\-]?\d+)?)(\+|-)([+\-]?[0-9.]+(?:[eE][+\-]?\d+)?)/;
  while (str.match(secondPriorityPattern)) {
    str = str.replace(secondPriorityPattern, function (match, a, operator, b) {
      return operator === '+' ? parseFloat(a) + parseFloat(b) : parseFloat(a) - parseFloat(b);
    });
  }

  return str;
};

StringEquation.prototype.reset = function () {
  this.str = '0';
};

/**
 * @param {string} char
 */
StringEquation.prototype.appendEntry = function (char) {

  // Prevent closing more parenthesis than opened.
  if (char === ')') {
    if ((this.str.match(/\(/g) || []).length - (this.str.match(/\)/g) || []).length < 1) {
      return;
    }
  }

  // Enforce a digit after a .
  if (this.str.slice(-1) === '.' && !char.match(/\d/)) {
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
  if (this.str === '0' && char.match(/[0-9(\-]/)) {
    this.str = '';
  }

  this.str += char;
};

/**
 * @throws {{msg: string}}
 */
StringEquation.prototype.validateEquation = function () {
  if ((this.str.match(/\(/g) || []).length !== (this.str.match(/\)/g) || []).length) {
    throw {msg: 'Unbalanced parenthesis'}
  }
  if (!this.isBalanced(this.str)) {
    throw {msg: 'Unbalanced parenthesis'}
  }
};

StringEquation.prototype.sanitize = function () {
  this.str = this.sanitizeDoubleSigns(this.str);
  this.str = this.str.replace(/([\d|)])\(/g, function replacer(match, digit) {
    return digit + '*(';
  });
  this.str = this.str.replace(/\(([+\-]?[\d]+)\)/g, function replacer(match, digit) {
    return digit;
  });
  this.str = this.sanitizeDoubleSigns(this.str);
};

/**
 * @param {string} str
 * @returns {string}
 */
StringEquation.prototype.sanitizeDoubleSigns = function (str) {
  str = str.replace(/--/g, '+');
  str = str.replace(/\+-/g, '-');
  str = str.replace(/\+\+/g, '+');
  str = str.replace(/-\+/g, '-');

  return str;
}

/**
 * @param {string} str
 * @returns {boolean}
 */
StringEquation.prototype.isBalanced = function (str) {
  var length = str.length;
  var bracket = [];
  var matching = {
    ')': '('
  };

  for (var i = 0; i < length; i++) {
    var char = str.charAt(i);

    switch (char) {
      case '(':
        bracket.push(char);
        break;
      case ')':
        if (bracket.length && matching[char] !== bracket.pop())
          return false;
    }
  }

  return !bracket.length;
};

StringEquation.prototype.testEval = function () {
  try {
    console.info('*Eval ', eval(this.str));
  } catch (err) {
    console.warn('*Eval Err: ' + this.str);
  }
};