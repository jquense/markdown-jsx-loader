## <a id='intro' href='#intro'>Getting Started</a>

You can install `react-big-calendar` via npm:

```js
npm i --save react-big-calendar
```

Date internationalization and localization is __hard__ and `react-big-calendar` doesn't even attempt to
solve that problem. Instead you can use one of the many excellent solutions already
out there, via adapters called "localizers". Big Calendar comes with two localizers for use
with [Globalize.js](https://github.com/jquery/globalize) or [Moment.js](http://momentjs.com/).

```jsx
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

let MyCalendar = props => (
  <div>
    <BigCalendar
      events={myEventsList}
      startAccessor='startDate'
      endAccessor='endDate'
    />
  </div>
);
```
