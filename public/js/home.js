
// Global variables
let picker;

// Clock interval
setInterval(() => {
    var daysOfWeek = [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag',];

    var currentdate = new Date(); 
    var datetime = daysOfWeek[currentdate.getDay()] + " - "
                + currentdate.getDate() + "." 
                + (currentdate.getMonth()+1)  + "." 
                + currentdate.getFullYear() + " - "  
                + currentdate.getHours() + ":"  
                + String(currentdate.getMinutes()).padStart(2, '0') + ":" 
                + String(currentdate.getSeconds()).padStart(2, '0');

    $('#date-time').text(datetime);
});

// Event listeners
$('#help-btn').click(() => {
  showHelpMenu();
})

$('.edit-icon').click((event) => {  
  editBooking(event);
})

$('.delete-icon').click((event) => {
  deleteBooking(event);
})

$('#add-btn').click(() => {
  createBooking();
});

$('#edit-btn').click(() => {    
    toggleEditMode();
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

// Functions

const openParkView = (placeholderMachine) => {

  let machines = []; // Container that is passed along holding all the selected machines

  Swal.fire({
    html: '<div class="maschinenpark-container">'
    + '   <div class="left-park-section">'
    + '       <div class="maschine-type-container bohr-container">'
    + '           <p class="park-section-title"><b>Bohrmaschinen</b></p>'
    + '           <div class="machinen-container bohr-maschinen-container"></div>'
    + '       </div>'
    + '   </div>'
    + '   <div class="right-park-section">'
    + '       <div class="maschine-type-container fraes-container">'
    + '           <p class="park-section-title"><b>Fräsmaschinen</b></p>'
    + '           <div class="machinen-container fraes-maschinen-container"></div>'
    + '       </div>'
    + '       <div class="maschine-type-container dreh-container">'
    + '           <p class="park-section-title"><b>Drehmaschinen</b></p>'
    + '           <div class="machinen-container dreh-maschinen-container"></div>'
    + '       </div>'
    + '   </div>'
    + '</div>',
    showCancelButton: true,
    width: '100%',
    customClass: 'swal-park',
    cancelButtonColor: 'lightgrey',
    cancelButtonText: 'Abbrechen', 
    confirmButtonText: 'Speichern',
    confirmButtonColor: 'rgb(0, 30, 80)',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
        createBooking(machines)
    } else {
        Swal.close();
    }
  })

  Opentip.styles.maschineInfoStyle = {
    extends: "alert",
    stem: true,
    tipJoint: "bottom",
    background: "rgb(0, 30, 80)",
    borderColor: "rgb(0, 30, 80)",
    borderRadius: 10,
  };
  
  const machineTypes = {Bohrmaschine: ['1', '2', '3', '4', '5', '6'], Drehmaschine: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], Fräsmaschine: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']}

  for(var i = 0; i < Object.keys(machineTypes).length; i++) {
    for(var k = 0; k < machineTypes[Object.keys(machineTypes)[i]].length; k++) {
      
      let machineId = Object.keys(machineTypes)[i][0] + machineTypes[Object.keys(machineTypes)[i]][k];
      let title = Object.keys(machineTypes)[i] + " " + machineTypes[Object.keys(machineTypes)[i]][k];

      if(Object.keys(machineTypes)[i][0] === 'B') {
        let bohrMachineElement = `<div id="${machineId}" class="maschine bohrmaschine status-free"></div>`
    
        $('.bohr-maschinen-container').append(bohrMachineElement);
      }
      else if(Object.keys(machineTypes)[i][0] === 'D') {
        let drehMachineElement = `<div id="${machineId}" class="maschine drehmaschine status-free"></div>`
        $('.dreh-maschinen-container').append(drehMachineElement);
      }
      else if(Object.keys(machineTypes)[i][0] === 'F') {
        let fraesMachineElement = `<div id="${machineId}" class="maschine fraesmaschine status-free"></div>`
    
        $('.fraes-maschinen-container').append(fraesMachineElement);
      }
  
      let infoContentHtml = '<div class="info-content">'
      + '   <div class="info-section">'
      + '       <div class="status-bullet status-free-bullet"></div>'
      + '       <p class="status-text">Frei</p>'
      + '   </div>'
      + '   <div class="info-section">'
      + '       <p class="info-text">Benutzt von: </p>'
      + '       <p class="current-user">Bouzalas, Alexandros</p>'
      + '   </div>'
      + '   <div class="info-section">'
      + '       <p class="info-text">Besetzt bis: </p>'
      + '       <p class="occupied-unti">Freitag 23.07.2022 - Nachmittags</p>'
      + '   </div>'
      + '</div>'
  
      new Opentip(`#${machineId}`, infoContentHtml, title, {style: "maschineInfoStyle"});
  
    }
  }

  if(placeholderMachine !== '') {
    $(`#${placeholderMachine}`).addClass('selected');
  }

  $('.status-free').click((e) => {
    let element = $(`#${e.target.id}`);

    let selectedMachines = $('.selected').length

    if(selectedMachines > 0) {
      if(element.hasClass('selected')) {
        element.css('background-color', '#009879')
        element.removeClass('selected');
        machines = [];
      } else {
        $('.status-free').css('background-color', '#009879');
        $('.status-free').removeClass('selected');
        machines = [];
        element.addClass('selected');
        machines.push(element.attr('id'));
      }
    } else {
      element.addClass('selected');
      machines.push(element.attr('id'));
    } 
  })
}

const createBooking = (machines) => {

  machines ? machines : machines = "";

  Swal.fire({
    html: '<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="maschine">Maschine:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input class="edit-field" id="current-machines" type="text" placeholder="${machines}" name="maschine" disabled/>`
    + '         </div>'
    + '         <div>'
    + `             <button id="maschine-change-btn" type="button" onClick="openParkView('${machines}')">Auswählen</button>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="from">Von:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input class="edit-field" type="text" id="from-date-picker" name="from" disabled/>`
    + '         </div>'
    + '         <div class="icon-container" onClick="openCalendar($(this), true)">'
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
    + `             <input class="edit-field" type="text" id="to-date-picker" name="to" disabled />`
    + '         </div>'
    + '         <div class="icon-container" onClick="openCalendar($(this), true)">'
    + '             <ion-icon id="from-calendar" name="calendar-outline"></ion-icon>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="to">Zeitraum:</label>'
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
        Swal.close();
    }
  })
}

const editBooking = (event) => {
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
    + `             <input class="edit-field" id="current-machines" type="text" name="maschine" placeholder="${currentMachine.innerText}" disabled/>`
    + '         </div>'
    + '         <div>'
    + '             <button id="maschine-change-btn" type="button" onClick="openParkView()">Ändern</button>'
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
    + '             <label for="to">Zeitraum:</label>'
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
}

const deleteBooking = (event) => {

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
}

const resetDatepicker = () =>{
  const currentDate = new Date();

  picker.setFullDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
}

const checkDates = (e, defaultDate) => {

  const currentDate = defaultDate ? new Date() : picker.getFullDate();
  const pickerDate = picker.getFullDate();
  let fromDay, fromMonth, fromYear, toDay, toMonth, toYear;

  if($('#to-date-picker')[0].placeholder) {
    let [fromDay, fromMonth, fromYear] =  $('#from-date-picker')[0].placeholder.split('.');
    let [toDay, toMonth, toYear] =  $('#to-date-picker')[0].placeholder.split('.');
  }
  

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

    if($('#from-date-picker').val() === '') {
      if(new Date(`${fromYear}-${fromMonth}-${fromDay}`).setHours(0,0,0,0) - pickerDate.setHours(0, 0, 0, 0) > 0) {
  
        $('.datepicker-error-message').text('Datum kann nicht vor dem Startdatum liegen!');
        $('.error-message-container').slideDown();
        return false;
      }
      else {
        $('.error-message-container').slideUp();
        return true
      }
    } else {

      let [fromDay, fromMonth, fromYear] =  $('#from-date-picker').val().split('.');

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
}

const openCalendar = (element, defaultDate) => {

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

const closeCalendar = () => {
  $('.error-message-container').slideUp();
}

const toggleEditMode = () => {
  if($('#table-body')[0].rows.length > 1) {
    if($('#edit-btn').hasClass('off')) {
        $('#edit-btn').removeClass('off');
        $('#edit-btn').addClass('on')
        $('.edit-icons-header').show();
        $('.edit-icons-cell').show();
        $('#edit-btn').text('Bearbeitungsmodus beenden');
    } else if($('#edit-btn').hasClass('on')){
        $('#edit-btn').removeClass('on');
        $('#edit-btn').addClass('off')
        $('.edit-icons-header').hide();
        $('.edit-icons-cell').hide();
        $('#edit-btn').text('Buchung bearbeiten');
    }
  } else {
    $('#edit-btn').removeClass('on');
    $('#edit-btn').addClass('off')
    $('.edit-icons-header').hide();
    $('.edit-icons-cell').hide();
    $('#edit-btn').text('Buchung bearbeiten');
  }
}

const showHelpMenu = () => {
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
}