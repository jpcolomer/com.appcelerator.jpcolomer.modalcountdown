args = arguments[0] || {}
min = parseInt(args.min) || 0
sec = parseInt(args.sec) || 0

for x in [0..5]
  x = x.toString()
  if x < 10
    x = "0#{x}"
  pickerrow = Ti.UI.createPickerRow
    title: x
  $.min_column.addRow(pickerrow)

for x in [0...60] by 5
  x = x.toString()
  if x < 10
    x = "0#{x}"
  pickerrow = Ti.UI.createPickerRow
    title: x

  $.sec_column.addRow(pickerrow)


# $.picker.setSelectedRow(1,sec/5,false)
# $.picker.setSelectedRow(0,min, false)

$.picker.addEventListener 'change', (e) ->
  [min, sec] = e.selectedValue

$.close_picker.addEventListener 'click', ->
  $.win.close()


exports.getMin = ->
  min
exports.getSec = ->
  sec