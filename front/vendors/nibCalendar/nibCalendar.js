// Namespace for the library
var nibCalendar = {};

// Library definition
nibCalendar = (function () {
  // Calendar container
  var calContainer;
  // Current language
  var lang;
  // Calendar start data
  var initDate;
  // Dates numbers that have events
  var eventDates
  
  /**
  * padDigits // Return number with "digits" value digits
  *
  * @private
  * @param {Number} number
  * @return {Number} digits
  */
  function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  }

  /**
  * drawTitleAndTable
  *
  * @private
  * @param {Date} date
  * @return null
  */
  function drawTitleAndTable() {
    // Draw div container with Month and Year text 
    monthAndYear = initDate.format('MMMM / YYYY');
    $(calContainer).append('<div class="title"><span>' + monthAndYear + '</span></div>')
    // Draw empty calendar table
    $(calContainer).append('<table class="days"></table>');
    $(calContainer + ' table').append('<thead><tr></tr></thead>');
    $(calContainer + ' table').append('<tbody><tr></tr></tbody>');
  }

  /**
  * drawDayNames
  *
  * @private
  * @param {Date} date
  * @return null
  */
  function drawDayNames() {
    // Return week day names in current Language
    function getWeekDayNames() {
      // Init a New startDay variable
      var startDay = new moment(initDate); 
      startDay = startDay.startOf('month').startOf('isoWeek');

      // Weeks day Names Array init
      var weekDayNames = [];

      // Iterate to get week day names
      var cantDays = 7;
      while (cantDays--) {
        weekDayNames.push(startDay.format('ddd'));
        startDay.add('days',1);
      }

      return weekDayNames;
    }

    // Get week day names in current Language
    var weekDayNames = getWeekDayNames();

    // Draw week day names in calendar
    weekDayNames.forEach(function(day) {
      $(calContainer + ' .days thead tr').append('<th><span>' + day + '</span></th>');
    });
  }


  /**
  * drawDayNumbers
  *
  * @private
  * @param {Date} date
  * @return null
  */
  function drawDayNumbers() {
    // Return weeks quantity in day's month 
    function weeksinMonth(){
      // Init a New dateMonth variable
      var dateMonth = new moment(initDate);
      var lastMonthDayNumber = dateMonth.endOf('month').format('DD');

      // Calculate weeks number
      var weeksNumber = Math.floor(( lastMonthDayNumber - 1 ) / 7 ) + 1

      return weeksNumber;     
    }
    // Return day numbers in a week
    function getWeekDayNumbers(startDay) {
      var weekDayNumbers = [];
      var cantDays = 7;
      while (cantDays--) {
        weekDayNumbers.push(startDay.format('D'));
        startDay.add('days',1);
      }
      return weekDayNumbers;
    }
    // Return array with array of week with day numbers ex:[[week1Daynumbers][week2Daynumbers]...]
    function getDayNumbers() {
      // Init a New startDay variable
      var startDay = new moment(initDate);
      startDay = startDay.startOf('month').startOf('isoWeek');

      // Days number Array init
      var dayNumbers = [];
      // Get weeks quantity in day's month 
      var cantWeeks = weeksinMonth();

      // Iterate weeks to get day numbers
      while (cantWeeks--) {
        // Get day numbers in a week
        weekDayNumbers = getWeekDayNumbers(startDay)

        // Add day numbers to the Days number Array
        dayNumbers.push(weekDayNumbers);
      }

      return dayNumbers;
    }

    // Get array with array of week with day numbers
    var weeksDayNumber = getDayNumbers();
    // Set month number
    var month = initDate.format('MM');
    // Set Year and monyh "YYYY/MM"
    var yearMont = initDate.format('YYYY') + '/' + padDigits(month, 2);
    // Set other month to true to start with previus month days 
    var otherMonth = true;
    var dayAnt = 99;

    // Iterate the array with array of week with day numbers (weekDayNumber)
    weeksDayNumber.forEach(function(weekDayNumber) {
      // Set new row start tag
      var newRow = '<tr>';

      // Iterate the week array with day numbers (dayNumber)
      weekDayNumber.forEach(function(dayNumber) {  
        // See if its previus month or next month
        if (otherMonth == false && parseInt(dayAnt) > parseInt(dayNumber)) {
          otherMonth = true;
        } else if (otherMonth == true && dayNumber == 1) {
          otherMonth = false;
        }

        // To check if day have event
        var haveEvent = false;
        if (otherMonth == false) {
          if (jQuery.inArray(eval(dayNumber), eventDates) != -1) haveEvent = true;
        }
                            
        // Get day with two digits
        var dayPadded = padDigits(dayNumber, 2);
        // Concatenate year, month and day "YYYY/MM/DD" (this is to filter values later)
        var yearMontDay = yearMont + '/' + dayPadded;

        // Add column to new row
        newRow = newRow + '<td otherMonth="' + otherMonth + '" haveEvent="' + haveEvent + '"> \
                             <span ng-click="getMatchesByDate(\'' + yearMontDay + '\')"> \
                               ' + dayNumber + ' \
                             </span> \
                           </td>';

        // Set day ant number to see if its previus month or next month
        dayAnt = dayNumber;
      });

      // Close new row tag
      newRow = newRow + '</tr>';

      // Add row to days part of the table calendar
      $(calContainer + ' .days tbody').append(newRow);
    });
  }    

  /**
  * addClickListeners // Add listeners to filter by day
  *
  * @private
  * @return null
  */
  function addDayClickListeners() {
    // Capture day click event
    $(calContainer + ' [otherMonth=false] span').click(function(){
      // Remove all selected class
      $(calContainer + ' [otherMonth=false]').removeClass('selected');
      // Add selected class to element clicked
      $(this).closest('td').addClass('selected');
    }); 
  }

  // Public API
  return {
    drawCal: function (params){
      // Params >>
      lang = params.lang || 'en';
      initDate = new moment(params.initDate) || new moment();
      eventDates = params.eventDates || [];
      // params <<

      // Set Language
      moment.lang(lang);
      // Set Calendar container
      calContainer = '.nibCalendar';
      
      // Clear container
      $(calContainer).html('');

      // Draw Calendar
      drawTitleAndTable();
      drawDayNames();
      drawDayNumbers();
      addDayClickListeners();

    }
  }
}());