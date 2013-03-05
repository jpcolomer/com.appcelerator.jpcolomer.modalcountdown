var Widget, clockStyleNumber, getMinSecsFromClock, reset, set, setMinSecsClock, start, timer;

Widget = {
  Models: {}
};

Widget.Models.Timer = (function() {

  function Timer() {
    this.isSetted = false;
  }

  Timer.prototype.setTotalSeconds = function() {
    return this.totalSeconds = this.min * 60 + this.sec;
  };

  Timer.prototype.getMinSecsFromTotalSeconds = function() {
    this.min = parseInt(this.totalSeconds / 60);
    return this.sec = parseInt(this.totalSeconds % 60);
  };

  Timer.prototype.tic = function() {
    this.totalSeconds--;
    return this.getMinSecsFromTotalSeconds();
  };

  Timer.prototype.set = function(min, sec) {
    this.min = parseInt(min);
    this.sec = parseInt(sec);
    this.setTotalSeconds();
    this.init_min = this.min;
    this.init_sec = this.sec;
    return this.isSetted = true;
  };

  Timer.prototype.start = function(fn_start, fn_stop) {
    var _this = this;
    return this.intervalId = setInterval(function() {
      if (_this.totalSeconds) {
        _this.tic();
        return fn_start();
      } else {
        _this.stop();
        return fn_stop();
      }
    }, 1000);
  };

  Timer.prototype.stop = function() {
    if (this.intervalId != null) {
      return clearInterval(this.intervalId);
    }
  };

  Timer.prototype.pause = function() {
    if (this.intervalId != null) {
      return clearInterval(this.intervalId);
    }
  };

  Timer.prototype.reset = function() {
    return this.set(this.init_min, this.init_sec);
  };

  return Timer;

})();

timer = new Widget.Models.Timer();

clockStyleNumber = function(number) {
  number = parseInt(number);
  return number = number < 10 ? "0" + number : number;
};

getMinSecsFromClock = function() {
  var min, params, sec, _ref;
  _ref = $.clock.getText().match(/\d\d/g), min = _ref[0], sec = _ref[1];
  return params = {
    min: min,
    sec: sec
  };
};

setMinSecsClock = function(min, sec) {
  return $.clock.setText("" + (clockStyleNumber(min)) + ":" + (clockStyleNumber(sec)));
};

set = function() {
  var args, timer_picker, timer_picker_view;
  args = getMinSecsFromClock();
  timer_picker = Alloy.createWidget('com.appcelerator.jpcolomer.modalcountdown', 'timer_picker', args);
  timer_picker_view = timer_picker.getView();
  timer_picker.picker.addEventListener('change', function() {
    var min, sec, _ref;
    setMinSecsClock(timer_picker.getMin(), timer_picker.getSec());
    _ref = getMinSecsFromClock(), min = _ref.min, sec = _ref.sec;
    return timer.set(min, sec);
  });
  timer_picker.set.addEventListener('click', function() {
    $.start.show();
    return $.set.show();
  });
  timer_picker_view.open();
  $.start.hide();
  $.set.hide();
  return $.win.addEventListener('close', function() {
    return timer_picker_view.close();
  });
};

start = function() {
  var min, sec, _ref;
  if (!timer.isSetted) {
    _ref = getMinSecsFromClock(), min = _ref.min, sec = _ref.sec;
    timer.set(min, sec);
  }
  $.start.hide();
  $.set.hide();
  $.stop.show();
  $.pause.show();
  return timer.start(function() {
    return setMinSecsClock(timer.min, timer.sec);
  }, function() {
    Ti.Media.vibrate([0, 300, 100, 300]);
    return reset();
  });
};

reset = function() {
  timer.reset();
  setMinSecsClock(timer.min, timer.sec);
  $.stop.hide();
  $.set.show();
  $.pause.hide();
  return $.start.show();
};

$.set.addEventListener('click', function() {
  return set();
});

$.start.addEventListener('click', function() {
  return start();
});

$.stop.addEventListener('click', function() {
  timer.stop();
  return reset();
});

$.pause.addEventListener('click', function() {
  timer.pause();
  this.hide();
  return $.start.show();
});

$.start.addEventListener('touchstart', function() {
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
    colors: ['#0B5E0E', '#063007']
  });
});

$.start.addEventListener('touchend', function() {
  return this.setBackgroundGradient(this.oldGradient);
});

$.stop.addEventListener('touchstart', function() {
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
    colors: ['#941B1B', '#801313']
  });
});

$.stop.addEventListener('touchend', function() {
  return this.setBackgroundGradient(this.oldGradient);
});

$.pause.addEventListener('touchstart', function() {
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
    colors: ['#ABAB23', '#727A00']
  });
});

$.pause.addEventListener('touchend', function() {
  return this.setBackgroundGradient(this.oldGradient);
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

if (OS_ANDROID) {
  $.win.addEventListener("open", function() {
    var actionBar;
    if (!$.win.activity) {
      return Ti.API.error("Can't access action bar on a lightweight window.");
    } else {
      actionBar = $.win.activity.actionBar;
      if (actionBar) {
        actionBar.setTitle('Timer');
        actionBar.setDisplayHomeAsUp(true);
        return actionBar.setOnHomeIconItemSelected(function() {
          return $.win.close();
        });
      }
    }
  });
}
