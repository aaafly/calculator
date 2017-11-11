function InterfaceManager(stringEquation) {
  var _this = this;
  this.showingAnswer = false;
  this.indicatorElem = $("#result");
  this.stringEquation = stringEquation;

  // keyboard

  $(document).keypress(function (e) {
    if (['Enter', '='].indexOf(e.key) !== -1) {
      _this.calculate();
    } else if (e.key === 'c') {
      _this.reset();
    } else {
      _this.addChar(e.key);
    }
  });

  // UI

  $(".entry").on('click', function (e) {
    _this.addChar(e.currentTarget.innerHTML);
  });

  $("#equals").on('click', function () {
    _this.calculate();
  });

  $("#reset").on('click', function () {
    _this.reset();
  });
}

InterfaceManager.prototype.reset = function () {
  this.stringEquation.reset();
  this.indicatorElem.html('0');
  this.showingAnswer = false;
};

InterfaceManager.prototype.calculate = function () {

  // Prevent submitting if equation unfinished
  if (this.stringEquation.str.slice(-1).match(/[*+.(\-\/]/)) {
    return;
  }

  var res = this.stringEquation.calculate();
  if (res.err) {
    this.indicatorElem.html('Err. ' + res.err);
  } else {
    this.indicatorElem.html(res.result);
    if (res.result === 'Infinity') {
      this.stringEquation.reset();
    } else if (res.result === 'NaN') {
      this.indicatorElem.html('Err.');
      this.stringEquation.reset();
    }
  }
  this.showingAnswer = true;
}

InterfaceManager.prototype.addChar = function (char) {

  // List of allowed characters.
  if (!char.match(/[0-9.()*+-\/]/)) {
    return;
  }

  // Reset or chain from last answer.
  if (this.showingAnswer && char.match(/[0-9.]/)) {
    this.stringEquation.reset();
  }

  // Update string & display.
  this.stringEquation.appendEntry(char);
  this.indicatorElem.html(this.stringEquation.str);
  this.showingAnswer = false;
}
