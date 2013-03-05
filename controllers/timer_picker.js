var args, min, pickerrow, sec, x, _i, _j;

args = arguments[0] || {};

min = parseInt(args.min) || 0;

sec = parseInt(args.sec) || 0;

for (x = _i = 0; _i <= 5; x = ++_i) {
  x = x.toString();
  if (x < 10) {
    x = "0" + x;
  }
  pickerrow = Ti.UI.createPickerRow({
    title: x
  });
  $.min_column.addRow(pickerrow);
}

for (x = _j = 0; _j < 60; x = _j += 5) {
  x = x.toString();
  if (x < 10) {
    x = "0" + x;
  }
  pickerrow = Ti.UI.createPickerRow({
    title: x
  });
  $.sec_column.addRow(pickerrow);
}

$.picker.addEventListener('change', function(e) {
  var _ref;
  return _ref = e.selectedValue, min = _ref[0], sec = _ref[1], _ref;
});

$.set.addEventListener('click', function() {
  return $.win.close();
});

$.set.addEventListener('touchstart', function() {
  this.oldGradient = this.getBackgroundGradient();
  return this.setBackgroundGradient({
    type: 'linear',
    startPoint: {
      x: '0%',
      y: '0%'
    },
    endPoint: {
      x: '0%',
      y: '100%'
    },
    colors: ['#097B8C', '#174166']
  });
});

$.set.addEventListener('touchend', function() {
  return this.setBackgroundGradient(this.oldGradient);
});

exports.getMin = function() {
  return min;
};

exports.getSec = function() {
  return sec;
};
