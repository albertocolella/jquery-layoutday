# Jquery Layoutday plugin

Day events agenda Jquery plugin.

## Installation

Inside directory `src` there are the plugin files.

Add jquery and plugin's javascript and css files to your html page

```html
<head>
...
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="YOUR_PATH/jquery-calendar.js"></script>
<link rel="stylesheet" type="text/css" href="YOUR_PATH/jquery-calendar.css">
...
</head>
```
replace `YOUR_PATH` with the correct path where you placed the files.

## Usage

Create an html `div` tag on your page where you want the calendar to be displayed.

```html
<body>
  ...
  <div id="mycalendar"></div>
  ...
</body>
```

Add javascript to your page

```html
<script>
$( document ).ready(function() {
  // initialize the calendar plugin on the div
  $('#mycalendar').layOutDay();

  // add your events to the calendar
  var myEvents = [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
  ];
  $('#mycalendar').addEvents(myEvents);
});
</script>
```

## Syntax

```javascript
$('your-calendar-selector').layOutDay({
  'calendar_width': 600,  // calendar width pixels (optional)
  'calendar_height': 720, // calendar height pixels (optional)
  'events_selector': ".events"  // calendar events selector (optional)
});
```

```javascript
  var yourEvents = [
    {start: 30, end: 150}, // start and end are the minutes from midnigth
    {start: 540, end: 600}, // start and end go from 0 to
    {start: 560, end: 620},
    {start: 610, end: 670}
  ];
  $('your-calendar-selector').addEvents(myEvents)
```

## Screenshot

![](docs/img/calendar.png)
