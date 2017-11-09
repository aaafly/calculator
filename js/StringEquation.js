function StringEquation(str) {
  console.log('str', str)
  this.str = this.sanitizeParenthesis(str);
  console.log('str', this.str)
  console.log('eval >>>>>> ', eval(this.str));
  this.levelDeep = this.getEquationParathensisMaxDeepness(this.str);

  while (this.levelDeep > 1) {
    this.getEquationsFromLevel(this.levelDeep);
    this.levelDeep = this.getEquationParathensisMaxDeepness(this.str);
    console.log('this.str', this.str);
  }

  this.str = this.calculateOneLevelString(this.str);
  console.log('this.str', this.str);
}

StringEquation.prototype.sanitizeParenthesis = function (str) {
  return str.replace(/(\d)\(/g, function replacer(match, digit) {
    return digit + '*(';
  });
}

StringEquation.prototype.sanitizeDoubleOperators = function (str) {
  str = str.replace(/--/g, '+');
  str = str.replace(/\+-/g, '-');
  str = str.replace(/\+\+/g, '+');
  str = str.replace(/-\+/g, '-');

  return str;
}

StringEquation.prototype.getEquationsFromLevel = function (targetLevel) {
  var level = 1;
  var start = 0;
  var end = 0;
  for (var i = 0; i < this.str.length; i++) {
    if (this.str[i] === '(') {
      level++;
      if (level === targetLevel) {
        start = i;
      }
    } else if (this.str[i] === ')') {
      if (level === targetLevel) {
        end = i;
        break;
      }
      level--;
    }
  }

  var equation = this.str.slice(start + 1, end);
  var result = this.calculateOneLevelString(equation);

  this.str = this.str.substr(0, start)
    + result
    + this.str.substr(start + 2 + equation.length, this.str.length);
};

StringEquation.prototype.getEquationParathensisMaxDeepness = function (str) {
  var level = 1;
  var levelMax = 1;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      level++;
      levelMax = level > levelMax ? level : levelMax;
    } else if (str[i] === ')') {
      level--;
    }
  }

  return levelMax;
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
}

StringEquation.prototype.calculateOneLevelString = function (str) {
  var strEval = eval(str);
  str = this.sanitizeDoubleOperators(str);
  str = this.calculateAndReplace(str, /[0-9.]+\*-?[0-9.]+/, '*')

  str = this.calculateAndReplace(str, /[0-9.]+\/[0-9.]+/, '/')

  //
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
      result = sign === '-' ? - parseFloat(parts[0]) + parseFloat(parts[1]) :  parseFloat(parts[0]) + parseFloat(parts[1]);
    } else {
      result = sign === '-' ? - parseFloat(parts[0]) - parseFloat(parts[1]) : parseFloat(parts[0]) - parseFloat(parts[1]);
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
}
