
// Global variables
let picker;
let dates = {};
let currentEditElement;
let machines = []; // Container that is passed along holding all the selected machines

// Content that has to be loaded first
setInterval(() => {
    var daysOfWeek = [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag',];

    var currentdate = new Date(); 
    var datetime = daysOfWeek[currentdate.getDay()] + " - "
                + String(currentdate.getDate()).padStart(2, '0') + "." 
                + String((currentdate.getMonth()+1)).padStart(2, '0')  + "." 
                + currentdate.getFullYear() + " - "  
                + String(currentdate.getHours()).padStart(2, '0') + ":"  
                + String(currentdate.getMinutes()).padStart(2, '0') + ":" 
                + String(currentdate.getSeconds()).padStart(2, '0');

    $('#date-time').text(datetime);
});

// Functions

const openParkView = (placeholderMachine, editMode) => {

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
      if(editMode) {
        editBooking(currentEditElement, machines);
        $('#current-machines').addClass('edit-field');
      } else {
        createBooking(machines);
      }
    } else {
      if(editMode) {

      } else {
        createBooking();
      }
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
  
  getMachines(placeholderMachine)
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
    + '             <label for="to">Tätigkeit:</label>'
    + '         </div>'
    + '         <div>'
    + '             <select id="activity" name="activity">'
    + '               <option value="A">Ausbildung</option>'
    + '               <option value="T">Technische Dienstleistungen (Aufträge)</option>'
    + '               <option value="P">Prüfung / Prüfungsvorbereitung</option>'
    + '             </select>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="to">Zeitraum:</label>'
    + '         </div>'
    + '         <div>'
    + '             <select id="timewindow" name="timewindow">'
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
      
      const booking = {};
      
      Object.assign(booking, {machineId: $('#current-machines').attr("placeholder")});
      Object.assign(booking, {beginDate: dates.beginDate});
      Object.assign(booking, {endDate: dates.endDate});
      Object.assign(booking, {activity: $('#activity').val()});
      Object.assign(booking, {timewindow: $('#timewindow').val()});

      dates = {};

      $.ajax({
        url: "/home/createNewBooking",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ data: booking }),
        success: function (response) {
          Swal.fire({
            title: "Ihre Buchung wurde erfolgreich gespeichert",
            icon: "success",
            allowOutsideClick: false,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            background: "#f6f8fa",
            timer: 2000,
          }).then(() => {
            hasPermission("3", "buildView")
          });
        },
        error: function (err) {
          console.log(err.responseJSON.msg);
          try {
            Swal.fire({
              title: err.responseJSON.msg,
              icon: "error",
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
          } catch {
            Swal.fire({
              title: "Es ist ein unerwarteter Fehler aufgetreten",
              icon: "error",
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
          }
        }
      });

    } else {
      dates = {};
      if(picker)
        picker.close();
    }
  })
}

const editBooking = (event, machines) => {
  if($(event.target).is("div")) {
    element = event.target.parentNode.parentNode.parentNode
  } else if ($(event.target).is("ion-icon")) {
      element = event.target.parentNode.parentNode.parentNode.parentNode
  }

  currentEditElement = event;

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
    + `             <input id="current-machines" type="text" name="maschine" placeholder="${machines ? machines : currentMachine.innerText}" disabled/>`
    + '         </div>'
    + '         <div>'
    + `             <button id="maschine-change-btn" type="button" onClick="openParkView('${machines ? machines : currentMachine.innerText}', true)">Ändern</button>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="from">Von:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input type="text" id="from-date-picker" name="from" placeholder="${currentFromDate.innerText}" disabled/>`
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
    + `             <input type="text" id="to-date-picker" name="to" placeholder="${currentToDate.innerText}" disabled />`
    + '         </div>'
    + '         <div class="icon-container" onClick="openCalendar($(this))">'
    + '             <ion-icon id="from-calendar" name="calendar-outline"></ion-icon>'
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

      const updateOptions = {};

      Object.assign(updateOptions, {bookingId: element.childNodes[1].innerText});
      Object.assign(updateOptions, {machines: machines ? machines : [currentMachine.innerText]});
      Object.assign(updateOptions, {beginDate: dates.beginDate ? dates.beginDate: $('#from-date-picker').attr("placeholder")});
      Object.assign(updateOptions, {endDate: dates.endDate ? dates.endDate: $('#to-date-picker').attr("placeholder")});

      dates = {};

      $.ajax({
        url: "/home/updateBooking",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ data: updateOptions }),
        success: function (response) {
          Swal.fire({
            title: "Ihre Buchung wurde erfolgreich aktualisiert",
            icon: "success",
            allowOutsideClick: false,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            background: "#f6f8fa",
            timer: 2000,
          }).then(() => {
            hasPermission("3", "buildView")

          });
        },
        error: function (err) {
          console.log(err.responseJSON.msg);
          try {
            Swal.fire({
              title: err.responseJSON.msg,
              icon: "error",
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
          } catch {
            Swal.fire({
              title: "Es ist ein unerwarteter Fehler aufgetreten",
              icon: "error",
              allowOutsideClick: false,
              confirmButtonText: "OK",
              allowOutsideClick: false,
              background: "#f6f8fa",
            });
          }
        }
      }); 
    } else {
      if(picker)
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

        console.log(element.childNodes[0])

        $.ajax({
          url: "/home/deleteBooking",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ data: element.childNodes[1].innerText }),
          success: function (response) {
            Swal.fire({
              title: "Ihre Buchung wurde erfolgreich gelöscht",
              icon: "success",
              allowOutsideClick: false,
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              background: "#f6f8fa",
              timer: 2000,
            }).then(() => {
              hasPermission("3", "buildView")

            });
          },
          error: function (err) {
            console.log(err.responseJSON.msg);
            try {
              Swal.fire({
                title: err.responseJSON.msg,
                icon: "error",
                allowOutsideClick: false,
                confirmButtonText: "OK",
              });
            } catch {
              Swal.fire({
                title: "Es ist ein unerwarteter Fehler aufgetreten",
                icon: "error",
                allowOutsideClick: false,
                confirmButtonText: "OK",
                allowOutsideClick: false,
                background: "#f6f8fa",
              });
            }
          }
        });

        if($('#table-body')[0].rows.length == 1) {
          $('#nobookings-info').show();
          $('#edit-btn').text('Buchung bearbeiten');
          $('#edit-btn').addClass('edit-btn-disabled');
        }
      }
    })
}

const resetDatepicker = () => {
  const currentDate = new Date();

  picker.setFullDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
}

const checkDates = (e, defaultDate) => {

  if(picker.el === "#from-date-picker")
    Object.assign(dates, {beginDate: picker.getFormatedDate()});
  else if(picker.el === "#to-date-picker")
    Object.assign(dates, {endDate: picker.getFormatedDate()});

  const currentDate = defaultDate ? new Date() : picker.getFullDate();
  const pickerDate = picker.getFullDate();
  let fromDay, fromMonth, fromYear, toDay, toMonth, toYear;

  if($('#to-date-picker').attr("placeholder")) {
    let [fromDay, fromMonth, fromYear] =  $('#from-date-picker').attr("placeholder").split('.');
    let [toDay, toMonth, toYear] =  $('#to-date-picker').attr("placeholder").split('.');
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
      $('#from-date-picker').addClass('edit-field');
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
        selectedBeginDate = $('#from-date-picker').attr('placeholder');
        $('#to-date-picker').addClass('edit-field');

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
        selectedEndDate = $('#to-date-picker').attr('placeholder');
        $('#to-date-picker').addClass('edit-field');
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

const checkStatus = (machine) => {
  switch(machine.status) {
    case "B":
      return "Außer Betrieb";
    case "F":
      return "Frei";
    case "O":
      return "Besetzt";
    default:
      return "Frei";
  }
}

const getMachines = (placeholderMachine) => {
  $.ajax({
    url: "/home/getMachines",
    method: "POST",
    contentType: "application/json",
    success: function (response) {
      for(var i = 0; i < response.length; i++) {
        switch(response[i].machineId.charAt(0)) {
          case "F":
            let fraesMachineElement = `<div id="${response[i].machineId}" class="maschine fraesmaschine status-${response[i].status.toLowerCase()}"></div>`
            $('.fraes-maschinen-container').append(fraesMachineElement);
            title = "Fräsmaschine " + response[i].machineId.substring(1);
            break;
          case "B":
            let bohrMachineElement = `<div id="${response[i].machineId}" class="maschine bohrmaschine status-${response[i].status.toLowerCase()}"></div>`
            $('.bohr-maschinen-container').append(bohrMachineElement);
            title = "Bohrmaschine " + response[i].machineId.substring(1)
            break;
          case "D":
            let drehMachineElement = `<div id="${response[i].machineId}" class="maschine drehmaschine status-${response[i].status.toLowerCase()}"></div>`
            $('.dreh-maschinen-container').append(drehMachineElement);
            title = "Drehmaschine " + response[i].machineId.substring(1);
            break;
          default:
            console.log("Unbekannte Maschine");
          }

          let infoContentHtml = '<div class="info-content">'
          + '   <div class="info-section">'
          + `       <div class="status-bullet status-${response[i].status.toLowerCase()}-bullet"></div>`
          + `       <p class="status-text">${checkStatus(response[i])}</p>`      
          + '   </div>'
          + '   <div class="info-section">'
          + '       <p class="info-text">Benutzt von: </p>'
          + `       <p class="current-user">Bouzalas, Alexandros</p>`
          + '   </div>'
          + '   <div class="info-section">'
          + '       <p class="info-text">Besetzt bis: </p>'
          + '       <p class="occupied-unti">Freitag 23.07.2022 - Nachmittags</p>'
          + '   </div>'
          + '</div>'
      
          new Opentip(`#${response[i].machineId}`, infoContentHtml, title, {style: "maschineInfoStyle"});
        }

        if(placeholderMachine !== '') {
          $(`#${placeholderMachine}`).addClass('selected');
      
          machines.push(placeholderMachine);
        }

        $('.status-f').click((e) => {
          let element = $(`#${e.target.id}`);
          
          let selectedMachines = $('.selected').length

          $('.status-o').removeClass('selected');
          $('.status-b').removeClass('selected');

          if(selectedMachines > 0) {
            if(element.hasClass('selected')) {
              element.css('background-color', '#009879')
              element.removeClass('selected');
              machines = [];
            } else {
              $('.status-f').css('background-color', '#009879');
              $('.status-f').removeClass('selected');
              machines = [];
              element.addClass('selected');
              machines.push(element.attr('id'));
            }
          } else {
            machines = [];
            element.addClass('selected');
            machines.push(element.attr('id'));
          }
        })

    },
    error: function (err) {
      Swal.fire({
        title: err.responseJSON.msg,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
        background: "#f6f8fa",
        width: "50%",
      });
    },
  });

}
const buildBookingTable = (all) => {

  $.ajax({
    url: "/home/getUserBookings",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ data: all }),
    success: function (response) {

      if(response.length >= 1) {

        $('#nobookings-info').hide();
        $('thead tr').children().first().hide()
        $(".booking-row").remove();

        toggleEditMode();

        $('#edit-btn').removeClass('edit-btn-disabled');

        if(all) {
          $('thead tr').children().first().show();
        }

        for(let booking of response) {

          let bookingStartDate = new Date(booking.beginDate);
          let bookingEndDate = new Date(booking.endDate);
  
          let bookingElement = '<tr class="booking-row active-row">'

          if(all) 
            bookingElement += `<td>${booking.userId}</td>`


          bookingElement += `<td>${booking.bookingId}</td>`
          + `   <td>${booking.machineId}</td>`
          + `   <td>${String(bookingStartDate.getDate()).padStart(2, '0')}.${String(bookingStartDate.getMonth()).padStart(2, '0')}.${bookingStartDate.getFullYear()}</td>`
          + `   <td>${String(bookingEndDate.getDate()).padStart(2, '0')}.${String(bookingEndDate.getMonth()).padStart(2, '0')}.${bookingEndDate.getFullYear()}</td>`
          + '   <td class="edit-icons-cell">'
          + '       <div class="edit-icons-container">'
          + '           <div title="Diese Buchung bearbeiten" class="edit-icon"><ion-icon name="pencil-outline"></ion-icon></ion-icon></div>'
          + '           <div title="Diese Buchung l&#246;schen" class="delete-icon"><ion-icon name="trash-outline"></ion-icon></ion-icon></div>'
          + '       </div>'
          + '   </td>'
          + '</tr>'
          
          $('#table-body').append(bookingElement);
        }
        
        
        if($('#table-body')[0].rows.length > 1) {
          if($('#edit-btn').hasClass('on')) {
              $('.edit-icons-header').show();
              $('.edit-icons-cell').show();
          } 
        } 

        $('.edit-icon').click((event) => {  
          editBooking(event);
        })
        
        $('.delete-icon').click((event) => {
          deleteBooking(event);
        })

      } else {
        $(".booking-row").remove();
        $('#nobookings-info').show();
        $('#edit-btn').addClass('edit-btn-disabled');
      }
    },
    error: function (err) {
      console.log(err.responseJSON.msg);
      try {
        Swal.fire({
          title: err.responseJSON.msg,
          icon: "error",
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      } catch {
        Swal.fire({
          title: "Es ist ein unerwarteter Fehler aufgetreten",
          icon: "error",
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      }
    }
  });
}

const hasPermission = (permissionClass, action) => {

  $.ajax({
    url: "/home/getUserPermissions",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ data: permissionClass }),
    success: function () {
      
      if(action === "buildView") {
        buildView(true);
      }
    },
    error: function (err) {
      if(action === "buildView") {
        buildView(false);
      }
    }
  }); 
}

const buildView = (isAdmin) => {
  if(isAdmin) {
    buildBookingTable(true);
  }
  else {
    buildBookingTable(false);
  }
}

hasPermission("3", "buildView")


// Event listeners
$('#help-btn').click(() => {
  showHelpMenu();
})

$('#add-btn').click(() => {
  createBooking();
});

$('#edit-btn').click(() => {    
    toggleEditMode();
})

$('#logout-btn').click(() => {
  window.location.pathname = '/logout';
})
