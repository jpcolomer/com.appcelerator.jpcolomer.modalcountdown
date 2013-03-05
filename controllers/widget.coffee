Widget = 
  Models: {}


class Widget.Models.Timer
  constructor: ->
    @isSetted = false

  setTotalSeconds: ->
    @totalSeconds = @min*60 + @sec

  getMinSecsFromTotalSeconds: ->
    @min = parseInt(@totalSeconds/60)
    @sec = parseInt(@totalSeconds % 60)

  tic: ->
    @totalSeconds--
    @getMinSecsFromTotalSeconds()

  set: (min, sec) ->
    @min = parseInt min
    @sec = parseInt sec
    @setTotalSeconds()
    @init_min = @min
    @init_sec = @sec
    @isSetted =  true

  start: (fn_start, fn_stop) ->
    @intervalId = setInterval( =>
      if @totalSeconds
        @tic()
        fn_start()
      else
        @stop()
        fn_stop()
    ,1000)

  stop: ->
    clearInterval(@intervalId) if @intervalId?   

  pause: ->
    clearInterval(@intervalId) if @intervalId?

  reset: ->
    @set(@init_min, @init_sec)


timer = new Widget.Models.Timer()


clockStyleNumber = (number) ->
  number = parseInt number
  number = if number < 10 then "0#{number}" else number


getMinSecsFromClock = ->
  [min, sec] = $.clock.getText().match(/\d\d/g)
  params = 
    min: min
    sec: sec

setMinSecsClock = (min, sec) ->
  $.clock.setText("#{clockStyleNumber(min)}:#{clockStyleNumber(sec)}")

set = ->
  args = getMinSecsFromClock()
  timer_picker = Alloy.createWidget('com.appcelerator.jpcolomer.modalcountdown', 'timer_picker', args)
  timer_picker_view = timer_picker.getView()
  timer_picker.picker.addEventListener 'change', ->
    setMinSecsClock timer_picker.getMin(), timer_picker.getSec()

    {min, sec} = getMinSecsFromClock()

    timer.set min, sec
  timer_picker.set.addEventListener 'click', ->
    $.start.show()
    $.set.show()
  timer_picker_view.open()
  $.start.hide()
  $.set.hide()
  $.win.addEventListener 'close', ->
    timer_picker_view.close()

start = ->
  unless timer.isSetted
    {min, sec} = getMinSecsFromClock()
    timer.set min, sec

  $.start.hide()
  $.set.hide()
  $.stop.show()
  $.pause.show()

  timer.start(->
    setMinSecsClock timer.min, timer.sec

  , ->
    Ti.Media.vibrate [0, 300, 100, 300]
    reset()
  )


reset = ->
  timer.reset()
  setMinSecsClock(timer.min, timer.sec)
  $.stop.hide()
  $.set.show()
  $.pause.hide()
  $.start.show()

$.set.addEventListener 'click', ->
  set()

$.start.addEventListener 'click', ->
  start()

$.stop.addEventListener 'click', ->
  timer.stop()
  reset()

$.pause.addEventListener 'click', ->
  timer.pause()
  @hide()
  $.start.show()


$.start.addEventListener 'touchstart', ->
  @oldGradient = @getBackgroundGradient()
  @setBackgroundGradient
    type: 'linear',
    startPoint: {x: '0%', y: '0%'},
    endPoint: {x: '0%', y: '100%'} ,
    colors: ['#0B5E0E', '#063007']


$.start.addEventListener 'touchend', ->
  @.setBackgroundGradient @oldGradient

$.stop.addEventListener 'touchstart', ->
  @oldGradient = @getBackgroundGradient()
  @setBackgroundGradient
    type: 'linear',
    startPoint: {x: '0%', y: '0%'},
    endPoint: {x: '0%', y: '100%'} ,
    colors: ['#941B1B', '#801313']


$.stop.addEventListener 'touchend', ->
  @.setBackgroundGradient @oldGradient

$.pause.addEventListener 'touchstart', ->
  @oldGradient = @getBackgroundGradient()
  @setBackgroundGradient
    type: 'linear',
    startPoint: {x: '0%', y: '0%'},
    endPoint: {x: '0%', y: '100%'} ,
    colors: ['#ABAB23', '#727A00']


$.pause.addEventListener 'touchend', ->
  @.setBackgroundGradient @oldGradient

$.set.addEventListener 'touchstart', ->
  @oldGradient = @getBackgroundGradient()
  @setBackgroundGradient
    type: 'linear',
    startPoint: {x: '0%', y: '0%'},
    endPoint: {x: '0%', y: '100%'} ,
    colors: ['#097B8C', '#174166']


$.set.addEventListener 'touchend', ->
  @.setBackgroundGradient @oldGradient


if OS_ANDROID

  $.win.addEventListener "open", -> 
    unless $.win.activity
      Ti.API.error "Can't access action bar on a lightweight window."
    else
      actionBar = $.win.activity.actionBar
      if actionBar
        actionBar.setTitle 'Timer'
        actionBar.setDisplayHomeAsUp true
        actionBar.setOnHomeIconItemSelected(->
          $.win.close()
        )

# $.close.addEventListener 'click', ->
#   timer.stop()
#   $.win.close()