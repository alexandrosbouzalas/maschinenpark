setInterval(() => {
    var daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    var currentdate = new Date(); 
    var datetime = daysOfWeek[currentdate.getDay() - 1] + " - "
                + currentdate.getDate() + "." 
                + (currentdate.getMonth()+1)  + "." 
                + currentdate.getFullYear() + " - "  
                + currentdate.getHours() + ":"  
                + String(currentdate.getMinutes()).padStart(2, '0') + ":" 
                + String(currentdate.getSeconds()).padStart(2, '0');

    $('#date-time').text(datetime);
});

$('#help-btn').click(() => {
    Swal.fire({
        html: '<h1 class="help-title">Info zur Anmeldung</h1><p class="help-text">Anmeldungshilfe hier eingeben</p>',
        position: 'top-end',
        showClass: {
          popup: `
            animate__animated
            animate__fadeInRight
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutRight
            animate__faster
          `
        },
        grow: 'column',
        width: '40%',
        showConfirmButton: false,
        showCloseButton: true
      }) 
})

let picker;

$('.edit-icon').click((event) => {

    

    if($(event.target).is("div")) {
        element = event.target.parentNode.parentNode.parentNode
    } else if ($(event.target).is("ion-icon")) {
        element = event.target.parentNode.parentNode.parentNode.parentNode
    }

    let currentMachine = element.childNodes[3];
    let currentFromDate = element.childNodes[5];
    let currentToDate = element.childNodes[7];

    Swal.fire({
        html: '<div class="edit-options-container">'
        + ' <div class="edit-option">'
        + '     <div class="edit-option-row">'
        + '         <div class="label-container">'
        + '             <label for="maschine">Maschine:</label>'
        + '         </div>'
        + '         <div>'
        + `             <input class="edit-field" id="current-maschine" type="text" name="maschine" placeholder="${currentMachine.innerText}" disabled/>`
        + '         </div>'
        + '         <div>'
        + '             <button id="maschine-change-btn" type="button">Ändern</button>'
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + ' <div class="edit-option">'
        + '     <div class="edit-option-row">'
        + '         <div class="label-container">'
        + '             <label for="from">Von:</label>'
        + '         </div>'
        + '         <div>'
        + `             <input class="edit-field" type="text" id="from-date-picker" name="from" placeholder="${currentFromDate.innerText}" disabled/>`
        + '         </div>'
        + '         <div class="icon-container" onClick="openCalendar($(this))">'
        + '             <ion-icon id="from-calendar" name="calendar-outline" ></ion-icon>'
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + ' <div class="edit-option">'
        + '     <div class="edit-option-row">'
        + '         <div class="label-container">'
        + '             <label for="to">Bis:</label>'
        + '         </div>'
        + '         <div>'
        + `             <input class="edit-field" type="text" id="to-date-picker" name="to" placeholder="${currentToDate.innerText}" disabled />`
        + '         </div>'
        + '         <div class="icon-container" onClick="openCalendar($(this))">'
        + '             <ion-icon id="from-calendar" name="calendar-outline"></ion-icon>'
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + ' <div class="edit-option">'
        + '     <div class="edit-option-row">'
        + '         <div class="label-container">'
        + '             <label for="to">Bis:</label>'
        + '         </div>'
        + '         <div>'
        + '             <select name="role">'
        + '               <option value="FULL">Ganzer Tag</option>'
        + '               <option value="BEFORE">Vormittags</option>'
        + '               <option value="AFTER">Nachmittags</option>'
        + '             </select>'
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + ' </div>'
        + '</div>',
        showCancelButton: true,
        width: '90%',
        customClass: 'swal',
        cancelButtonColor: 'lightgrey',
        cancelButtonText: 'Abbrechen', 
        confirmButtonText: 'Speichern',
        confirmButtonColor: 'rgb(0, 30, 80)',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
            
        } else {
            picker.close();
        }
      })
})

$('.delete-icon').click((event) => {
    let element;

    if($(event.target).is("div")) {
        element = event.target.parentNode.parentNode.parentNode
    } else if ($(event.target).is("ion-icon")) {
        element = event.target.parentNode.parentNode.parentNode.parentNode
    }

    Swal.fire({
        title: "Wollen Sie diese Buchung wirklich löschen?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: 'lightgrey',
        confirmButtonText: 'Löschen',
        confirmButtonColor: 'rgb(0, 30, 80)',
        cancelButtonText: 'Abbrechen', 
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          element.remove();
          if($('#table-body')[0].rows.length == 1) {
            $('#nobookings-info').show();
            $('#edit-btn').text('Buchung bearbeiten');
            $('#edit-btn').css('background-color', 'grey');
            $('#edit-btn').css('pointer-events', 'none');
          }
        }
      })
})

function resetDatepicker() {
  const currentDate = new Date();

  picker.setFullDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
}

function checkDates(e, defaultDate) {

  const currentDate = defaultDate ? new Date() : picker.getFullDate();
  const pickerDate = picker.getFullDate();

  const [fromDay, fromMonth, fromYear] =  $('#from-date-picker')[0].placeholder.split('.');
  const [toDay, toMonth, toYear] =  $('#to-date-picker')[0].placeholder.split('.');

  if(picker.el === '#from-date-picker') {

    if(currentDate.setHours(0,0,0,0) - pickerDate.setHours(0, 0, 0, 0) > 0 || pickerDate.setHours(0, 0, 0, 0) - new Date(`${toYear}-${toMonth}-${toDay}`).setHours(0,0,0,0) > 0) {

      if (currentDate.setHours(0,0,0,0) - pickerDate.setHours(0, 0, 0, 0) > 0) 
        $('.datepicker-error-message').text('Datum kann nicht in der Vergangenheit liegen!');
      else if (pickerDate.setHours(0, 0, 0, 0) - new Date(`${toYear}-${toMonth}-${toDay}`).setHours(0,0,0,0) > 0) 
        $('.datepicker-error-message').text('Datum kann nicht älter als der bis Zeitpunkt sein!');

      $('.error-message-container').slideDown();

      return false;
    }
    else {
      $('.error-message-container').slideUp();
      return true
    }
  } else if (picker.el === '#to-date-picker') {

    if(new Date(`${fromYear}-${fromMonth}-${fromDay}`).setHours(0,0,0,0) - pickerDate.setHours(0, 0, 0, 0) > 0) {

      $('.datepicker-error-message').text('Datum kann nicht vor dem Startdatum liegen!');
      $('.error-message-container').slideDown();
      return false;
    }
    else {
      $('.error-message-container').slideUp();
      return true
    }
  }
}


function openCalendar(element, defaultDate) {

  const elementId = element[0].parentNode.children[1].children[0].id;
  const elementPlaceholderDate = element[0].parentNode.children[1].children[0].placeholder;
  const [day, month, year] = elementPlaceholderDate.split('.');

  picker = MCDatepicker.create({
    el: `#${elementId}`,
    disableWeekends: true,
    selectedDate: defaultDate ? new Date() : new Date(`${year}-${month}-${day}`),
    theme: {
        theme_color: 'rgb(0, 30, 80)'
    }
  });

    picker.open();
}

function closeCalendar() {
  $('.error-message-container').slideUp();
}

$('#edit-btn').click(() => {
    
    if($('#table-body')[0].rows.length > 1) {
        if($('#edit-btn').hasClass('off')) {
            $('#edit-btn').removeClass('off');
            $('#edit-btn').addClass('on')
            $('.edit-icons-header').show();
            $('.edit-icons-cell').show();
            $('#edit-btn').css('background-color', '#f25902');
            $('#edit-btn').text('Bearbeitungsmodus beenden');
        } else if($('#edit-btn').hasClass('on')){
            $('#edit-btn').removeClass('on');
            $('#edit-btn').addClass('off')
            $('.edit-icons-header').hide();
            $('.edit-icons-cell').hide();
            $('#edit-btn').css('background-color', 'rgb(0, 30, 80)');
            $('#edit-btn').text('Buchung bearbeiten');
        }
    } else {
        $('#edit-btn').removeClass('on');
        $('#edit-btn').addClass('off')
        $('.edit-icons-header').hide();
        $('.edit-icons-cell').hide();
        $('#edit-btn').css('background-color', 'rgb(0, 30, 80)');
        $('#edit-btn').text('Buchung bearbeiten');
    }
})

$('#logout-btn').click(() => {
  window.location.href = '/logout';
})

$(document).ready(() => {
    if($('#table-body')[0].rows.length == 1) {
        $('#nobookings-info').show();
        $('#edit-btn').css('background-color', 'grey');
        $('#edit-btn').css('cursor', 'not-allowed'); 
    }
})