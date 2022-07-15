
// Global variables
let picker;
let dates = {};
let currentEditElement;
let machines = []; // Container that is passed along holding all the selected machines
let dateArray = [];

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
        editBooking(machines);
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

const createBooking = (machines, edit) => {

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

  
  let currentMachine = element.children[element.children.length - 4];
  let currentFromDate = element.children[element.children.length - 3];
  let currentToDate = element.children[element.children.length - 2];
  
  dates.beginDate = currentFromDate.innerText;
  dates.endDate = currentToDate.innerText;

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

      Object.assign(updateOptions, {bookingId: element.children[element.children.length - 5].innerText});
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
      dates = {};
      if(picker)
        picker.close();
    }
  })
}

const editUser = (event) => {
  if($(event.target).is("div")) {
    element = event.target.parentNode.parentNode.parentNode;
  } else if ($(event.target).is("ion-icon")) {
    element = event.target.parentNode.parentNode.parentNode.parentNode;
  }

  const currentUserLastname = element.children[0].innerText;
  const currentUserFirstname = element.children[1].innerText;
  const currentUserUserId = element.children[2].innerText;
  const currentUserRole = element.children[3].innerText;
  const currentUserProfession = element.children[4].innerText;
  const currentUserApprenticeyear = element.children[5].innerText;

  Swal.fire({
    html: '<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="lastname">Nachname:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input id="lastname" type="text" name="lastname" placeholder="${currentUserLastname}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="firstname">Vorname:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input id="firstname" type="text" name="firstname" placeholder="${currentUserFirstname}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="userId">UserID:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input id="userId" type="text" name="userId" minLength="7" maxLength="7" style="text-transform:uppercase" placeholder="${currentUserUserId}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="role">Role:</label>'
    + '         </div>'
    + '         <div>'
    + '             <select id="role" name="role">'
    + '                 <option value="AZB">Auszubildender</option>'
    + '                 <option value="ABBA">Ausbilder - Meister</option>'
    + '                 <option value="FACH">Facharbeiter</option>'
    + '             </select>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="profession">Beruf:</label>'
    + '         </div>'
    + '         <div>'
    + '             <select id="profession" name="profession">'
    + '                 <option value="MECH">Mechatroniker/-in</option>'
    + '                 <option value="IM">Industriemechaniker/-in</option>'
    + '                 <option value="ZM">Zerspannungsmechaniker/-in</option>'
    + '                 <option value="TPD">Technischer Produktdesigner/-in</option>'
    + '                 <option value="PT">Produktionstechnologe/-in</option>'
    + '                 <option value="WZM">Werkzeugmechaniker/-in</option>'
    + '                 <option value="OTHER">Andere</option>'
    + '             </select>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="apprenticeyear">Einstellungsjahr:</label>'
    + '         </div>'
    + '         <div>'
    + '             <select id="apprenticeyear" name="apprenticeyear">'
    + '             </select>'
    + '         </div>'
    + '     </div>'
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

      Object.assign(updateOptions, {userIdToEdit: currentUserUserId});

      if($('#lastname').val().length >= 1 && $('#lastname').val() !== $('#lastname').attr('placeholder')) {
        Object.assign(updateOptions, {lastname: $('#lastname').val()});
      }
      if($('#firstname').val().length >= 1 && $('#firstname').val() !== $('#firstname').attr('placeholder')) {
        Object.assign(updateOptions, {firstname: $('#firstname').val()});
      }
      if($('#userId').val().length >= 1 && $('#userId').val() !== $('#userId').attr('placeholder')) {
        Object.assign(updateOptions, {userId: $('#userId').val().toUpperCase()});
      }
      if(currentUserRole !== $('#role').val()) {
        Object.assign(updateOptions, {role: $('#role').val()});
      }
      if(currentUserProfession !== $('#profession').val()) {
        if($('#profession').val() === 'ANDERE')
          Object.assign(updateOptions, {profession: "OTHER"});
        else
          Object.assign(updateOptions, {profession: $('#profession').val()});

      }
      if(currentUserApprenticeyear !== $('#apprenticeyear').val()) {
        Object.assign(updateOptions, {apprenticeyear: $('#apprenticeyear').val()});
      }

      if(Object.keys(updateOptions).length >= 2) {
        $.ajax({
          url: "/home/updateUser",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ data: updateOptions }),
          success: function (response) {
            Swal.fire({
              title: "Die Nutzerdaten wurde erfolgreich aktualisiert",
              icon: "success",
              allowOutsideClick: false,
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: false,
              background: "#f6f8fa",
              timer: 2000,
            }).then(() => {
              openUserView();

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
        Swal.fire({
          title: "Es wurden keine Änderungen vorgenommen",
          icon: "info",
          allowOutsideClick: false,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          background: "#f6f8fa",
          timer: 2000,
        }).then(() => {
          openUserView(true);
        });
      }
    } else {
      openUserView(true);
    }
  })

  const currentYear = new Date().getFullYear();

  for (var i = currentYear; i >= currentYear - 5; i--) {
    $('#apprenticeyear').append(`<option value="${i}">${i}</option>`)
  }

  $('.edit-options-container select').css('color', '#757575');

  if(element.children[3].innerText === "ABBA" || element.children[3].innerText === "FACH") {
    $("#role").val(element.children[3].innerText);
    $("#profession").parents().closest('.edit-option').hide();
    $("#apprenticeyear").parents().closest('.edit-option').hide();
  } else {
    $("#role").val(element.children[3].innerText);

    if(element.children[4].innerText === "ANDERE")
      $("#profession").val("OTHER");
    else
      $("#profession").val(element.children[4].innerText);

    $("#apprenticeyear").val(element.children[5].innerText);
  }

  $('.edit-options-container input').css('color', '#009879');

  $('.edit-options-container select').change((e) => {
    $(e.target).css('color', '#009879');

    if($("#role").val() === "AZB") {
      $("#profession").parents().closest('.edit-option').slideDown();
      $("#apprenticeyear").parents().closest('.edit-option').slideDown();
    } else if($("#role").val() === "ABBA" || $("#role").val() === "FACH"){
      $("#profession").parents().closest('.edit-option').slideUp();
      $("#apprenticeyear").parents().closest('.edit-option').slideUp();
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
      title: `Wollen Sie Buchung ${element.children[element.children.length - 5].innerText} wirklich löschen?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      confirmButtonText: 'Löschen',
      confirmButtonColor: 'rgb(0, 30, 80)',
      cancelButtonText: 'Abbrechen', 
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        $.ajax({
          url: "/home/deleteBooking",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ data: element.children[element.children.length - 5].innerText }),
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
              hasPermission("3", "buildView");
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

const deleteUser = (event) => {
  const userIdToDelete = $(event.target).closest('tr').children().eq(2).text();

  Swal.fire({
    title: `Wollen Sie den Nutzer ${userIdToDelete} wirklich löschen?`,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: 'lightgrey',
    confirmButtonText: 'Löschen',
    confirmButtonColor: 'rgb(0, 30, 80)',
    cancelButtonText: 'Abbrechen', 
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {

      $.ajax({
        url: "/home/deleteUser",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ data: userIdToDelete}),
        success: function (response) {
          Swal.fire({
            title: "Der Nutzer wurde erfolgreich gelöscht",
            icon: "success",
            allowOutsideClick: false,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            background: "#f6f8fa",
            timer: 2000,
          }).then(() => {
            openUserView();
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
    } else {
      openUserView(true);
    }
  })
}

const resetDatepicker = () => {
  const currentDate = new Date();

  picker.setFullDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
}

const checkDates = (e) => {

  if(picker.el === "#from-date-picker")
    Object.assign(dates, {beginDate: picker.getFormatedDate()});
  else if(picker.el === "#to-date-picker")
    Object.assign(dates, {endDate: picker.getFormatedDate()});


  if(dates.endDate) {
     dateArray = dates.endDate.split('.');
  }

  if(picker.el === '#from-date-picker') {

    if(new Date().setHours(0,0,0,0) - picker.getFullDate().setHours(0, 0, 0, 0) > 0 || picker.getFullDate().setHours(0, 0, 0, 0) - new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).setHours(0,0,0,0) > 0) {

      if (new Date().setHours(0,0,0,0) - picker.getFullDate().setHours(0, 0, 0, 0) > 0) 
        $('.datepicker-error-message').text('Datum kann nicht in der Vergangenheit liegen!');
      else if (picker.getFullDate().setHours(0, 0, 0, 0) - new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).setHours(0,0,0,0) > 0) 
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

    if(dates.beginDate) {

      dateArray = dates.beginDate.split('.');

      if(new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).setHours(0,0,0,0) - picker.getFullDate().setHours(0, 0, 0, 0) > 0) {
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

      if(new Date().setHours(0,0,0,0) - picker.getFullDate().setHours(0, 0, 0, 0) > 0) {
  
        $('.datepicker-error-message').text('Datum kann nicht in der Vergangenheit liegen!');
        $('.error-message-container').slideDown();
        return false;
      }
      else {
        $('.error-message-container').slideUp();
        selectedBeginDate = $('#from-date-picker').attr('placeholder');
        $('#to-date-picker').addClass('edit-field');

        return true
      }
    }
  }
}

const openCalendar = (element, defaultDate) => {

  dateArray = [];

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
  dateArray = [];
}

const toggleBookingEditMode = () => {
  if($('#table-body')[0].rows.length > 1) {
    if($('#edit-btn').hasClass('off')) {
        $('#edit-btn').removeClass('off');
        $('#edit-btn').addClass('on')
        $('.edit-icons-header').show();
        $('.booking-edit-icons-cell').show();
        $('#edit-btn').text('Bearbeitungsmodus beenden');
    } else if($('#edit-btn').hasClass('on')){
        $('#edit-btn').removeClass('on');
        $('#edit-btn').addClass('off')
        $('.edit-icons-header').hide();
        $('.booking-edit-icons-cell').hide();
        $('#edit-btn').text('Buchung bearbeiten');
    }
  } else {
    $('#edit-btn').removeClass('on');
    $('#edit-btn').addClass('off')
    $('.edit-icons-header').hide();
    $('.booking-edit-icons-cell').hide();
    $('#edit-btn').text('Buchung bearbeiten');
  }
}

const toggleUserEditMode = () => {
  if($('#user-table-body')[0].rows.length >= 1) {
    if($('#user-edit-btn').hasClass('off')) {
        $('#user-edit-btn').removeClass('off');
        $('#user-edit-btn').addClass('on')
        $('.edit-icons-header').show();
        $('.user-edit-icons-cell').show();
        $('#user-edit-btn').text('Bearbeitungsmodus beenden');
    } else if($('#user-edit-btn').hasClass('on')){
        $('#user-edit-btn').removeClass('on');
        $('#user-edit-btn').addClass('off')
        $('.edit-icons-header').hide();
        $('.user-edit-icons-cell').hide();
        $('#user-edit-btn').text('Nutzer bearbeiten');
    }
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

      let infoContentHtml;
      const weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

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
            title = "Bohrmaschine " + response[i].machineId.substring(1);
            break;
          case "D":
            let drehMachineElement = `<div id="${response[i].machineId}" class="maschine drehmaschine status-${response[i].status.toLowerCase()}"></div>`
            $('.dreh-maschinen-container').append(drehMachineElement);
            title = "Drehmaschine " + response[i].machineId.substring(1);
            break;
          default:
            console.log("Unbekannte Maschine");
          }

          if(response[i].status === "O") {

            const infoBubbleDate = new Date(response[i].endDate.replace(/-/g, '\/').replace(/T.+/, ''));

            let timewindow;

            if(response[i].timewindow === "BEFORE")
              timewindow = " - Vormittags";
            else 
              timewindow = "";

            infoContentHtml = '<div class="info-content">'
            + '   <div class="info-section">'
            + `       <div class="status-bullet status-${response[i].status.toLowerCase()}-bullet"></div>`
            + `       <p class="status-text">${checkStatus(response[i])}</p>`      
            + '   </div>'
            + '   <div class="info-section">'
            + '       <p class="info-text">Benutzt von: </p>'
            + `       <p class="current-user">${response[i].lastname}, ${response[i].firstname}</p>`
            + '   </div>'
            + '   <div class="info-section">'
            + '       <p class="info-text">Besetzt bis: </p>'
            + `       <p class="occupied-unti">${weekDays[infoBubbleDate.getDay()]} - ${String(infoBubbleDate.getDate()).padStart(2, '0')}.${String(infoBubbleDate.getMonth() + 1).padStart(2, '0')}.${infoBubbleDate.getFullYear()}${timewindow}</p>`
            + '   </div>'
            + '</div>'
          } else if(response[i].status === "F" || response[i].status === "B") {
            infoContentHtml = '<div class="info-content">'
            + '   <div class="info-section">'
            + `       <div class="status-bullet status-${response[i].status.toLowerCase()}-bullet"></div>`
            + `       <p class="status-text">${checkStatus(response[i])}</p>`      
            + '   </div>'
            + '</div>'
          }
      
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

      if(all)
        $('thead tr').children().first().show();
      else
        $('thead tr').children().first().hide()

      if(response.length >= 1) {

        $('#nobookings-info').hide();
        $(".booking-row").remove();

        toggleBookingEditMode();

        $('#edit-btn').removeClass('edit-btn-disabled');

        

        for(let booking of response) {

          let bookingStartDate = new Date(booking.beginDate);
          let bookingEndDate = new Date(booking.endDate);
          let status;

          if(new Date().setHours(0,0,0,0) - bookingStartDate.setHours(0, 0, 0, 0) >= 0) {
            status = "active";
          } else {
            status = "not-active";
          }



          let bookingElement = '<tr class="booking-row active-row">'

          if(all) 
            bookingElement += `<td class="${status}">${booking.userId}</td>`


          bookingElement += `<td class="${status}">${booking.bookingId}</td>`
          + `   <td class="${status}">${booking.machineId}</td>`
          + `   <td class="${status}">${String(bookingStartDate.getDate()).padStart(2, '0')}.${String(bookingStartDate.getMonth() + 1).padStart(2, '0')}.${bookingStartDate.getFullYear()}</td>`
          + `   <td class="${status}">${String(bookingEndDate.getDate()).padStart(2, '0')}.${String(bookingEndDate.getMonth() + 1).padStart(2, '0')}.${bookingEndDate.getFullYear()}</td>`
          + '   <td class="booking-edit-icons-cell">'
          + '       <div class="edit-icons-container">'
          + '           <div title="Diese Buchung bearbeiten" class="edit-icon"><ion-icon name="pencil-outline"></ion-icon></div>'
          + '           <div title="Diese Buchung l&#246;schen" class="delete-icon"><ion-icon name="trash-outline"></ion-icon></div>'
          + '       </div>'
          + '   </td>'
          + '</tr>'
          
          $('#table-body').append(bookingElement);
        }
        
        
        if($('#table-body')[0].rows.length > 1) {
          if($('#edit-btn').hasClass('on')) {
              $('.edit-icons-header').show();
              $('.booking-edit-icons-cell').show();
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

const openStatisticView = () => {
  Swal.fire({
    html: '<div id="container">'
    + '       <p class="chart-title">Buchungen der Maschinen pro Beruf</p>'
    + '       <div class="chart-icons-container">'
    + '           <div title="Balkendiagramm anzeigen" class="bar-icon active-chart"><ion-icon name="bar-chart-outline"></ion-icon></div>'
    + '           <div title="Tortendiagramm anzeigen" class="pie-icon inactive-chart"><ion-icon name="pie-chart-outline"></ion-icon></div>'
    + '       </div>' 
    + '       <div id="chart-container">'     
    + '           <canvas id="chart" width="400" height="400"></canvas>'
    + '       </div>'
    + '    </div>',
    showCancelButton: false,
    showConfirmButton: false,
    width: '90%',
    customClass: 'swal',
  })

  $('.bar-icon').click(() => {    
    if($('.bar-icon').hasClass('inactive-chart')) {
      $('.bar-icon').addClass('active-chart').removeClass('inactive-chart');
      $('.pie-icon').addClass('inactive-chart').removeClass('active-chart');

      getStatisticsData("bar", false);
    }
  })
  
  $('.pie-icon').click(() => {    
    if($('.pie-icon').hasClass('inactive-chart')) {
      $('.pie-icon').addClass('active-chart').removeClass('inactive-chart');
      $('.bar-icon').addClass('inactive-chart').removeClass('active-chart');

      getStatisticsData("pie", true);
    }
  })  

  getStatisticsData("bar", false);
};

const getStatisticsData = (chartType, displayLabel) => {

  $.ajax({
    url: "/home/getStatisticsData",
    method: "POST",
    contentType: "application/json",
    success: function (response) {
      let labeltext = " Genutzt";
      let data = [];
      let labels = [];

      response.statisticsNumbers.shift();
      response.statisticsNumbers.forEach(function (element, i) {
        data[i] = element.allTimeBookings;
      });

      response.statisticsProfessions.shift();
      response.statisticsProfessions.forEach(function (element, i) {
        labels[i] = " " + element.statisticProfession;
      });

      labels[labels.length - 1] = " ANDERE";

      buildChart(chartType, labels, data, labeltext, displayLabel);
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

const buildUserTable = (edit) => {

  $.ajax({
    url: "/home/getAllUsers",
    method: "POST",
    contentType: "application/json",
    success: function (response) {
      $('#user-table-body tr').remove();
      for(let user of response) {

        if(user.profession === "OTHER") {
          user.profession = "ANDERE";
        }

        let userElement = '<tr class="user-row">'
        + `   <td>${user.lastname}</td>`
        + `   <td>${user.firstname}</td>`
        + `   <td>${user.userId}</td>`
        + `   <td>${user.role}</td>`
        + `   <td>${user.profession === "ABBA" || user.profession === "FACH" ? user.profession = "---" : user.profession}</td>`
        + `   <td>${user.apprenticeyear === "0" ? user.apprenticeyear = "---" : user.apprenticeyear}</td>`
        + '   <td class="user-edit-icons-cell">'
        + '       <div class="edit-icons-container">'
        + '           <div title="Diesen Nutzer bearbeiten" class="user-edit-icon"><ion-icon name="pencil-outline"></ion-icon></div>'
        + '           <div title="Diesen Nutzer l&#246;schen" class="user-delete-icon"><ion-icon name="trash-outline"></ion-icon></div>'
        + '       </div>'
        + '   </td>'
        + '</tr>'
        
        $('#user-table-body').append(userElement);
      }

      if(edit)
        toggleUserEditMode();

      $('#user-search-field').on('input', function() {
        let searchText = $('#user-search-field').val();

        setTimeout(() => {

          if($('#user-search-field').val().trim() === "") {
            $('#nothing-found-info-text').hide();
            $('#user-table-body tr').show();
            $('#user-edit-btn').removeClass('edit-btn-disabled');
          } else if(searchText === $('#user-search-field').val()){
            searchTable("user", searchText);
          }
        }, 1000)

      });

      $('#user-search-field').click(() => {
        $('#search-icon').hide();
        $('#user-search-field').css('width', '25%');
        $('#user-search-field').attr('placeholder', "Suchen...");
      })

      $('#search-icon').click(() => {
        $('#user-search-field').click();
        $('#user-search-field').focus();
      })

      $('#user-search-field').focusout(() => {
        if($('#user-search-field').val() === '') {
          $('#search-icon').show();
          $('#user-search-field').css('width', '45px');
          $('#user-search-field').attr('placeholder', "");
        } 
      })

      $('.user-edit-icon').click((event) => {
        editUser(event);
      })

      $('.user-delete-icon').click((event) => {
        deleteUser(event);
      })

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
  })
}

const buildChart = (type, labels, data, labeltext, displayLabel) => {
  let chartStatus = Chart.getChart("chart"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  const ctx = $('#chart')[0].getContext('2d');
  const chart = new Chart(ctx, {
    type: type,
    data: {
        labels: labels,
        datasets: [{
            label: labeltext,
            data: data,
            backgroundColor: [
              'rgb(0, 30, 80)',
              '#123C61',
              '#185183',
              '#206AAC',
              '#2782D2',
              '#2C93EE',
              '#02ccfd'
            ],
            borderRadius: 10,
            borderSkipped: false
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: displayLabel
          },
          tooltip: {
            titleFont: {
              size: 20,
              family: 'VW Head, sans-serif'
            },
            bodyFont: {
              size: 20,
              family: 'VW Head, sans-serif'
            }
          }
        },
        scales: {
            y: {
              display: !displayLabel,
                beginAtZero: true,
                grid: {
                  display: !displayLabel
                },
                ticks: {
                  display: !displayLabel,
                  color: 'rgb(0, 30, 80)',
                  font: {
                    size: 15,
                    family: 'VW Head, sans-serif'
                  },
                },
            },
            x: {
              display: !displayLabel,
              ticks: {
                display: !displayLabel
              },
              grid: {
                lineWidth: 0
              }
            }
        }
    }
  })
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

const searchTable = (table, searchText) => {

  if(table === "user") {

    let somethingFound;

    $('#user-table-body tr').hide();
    $('#nothing-found-info-text').hide();


    $('#user-table-body tr').each(function() {

      $(this).children().each(function() {
        if(!$(this).hasClass('user-edit-icons-cell')) {
          if($(this).text().toLowerCase().trim().startsWith(searchText.toLowerCase().trim(), 0)) {

            somethingFound = true;

            $('#user-edit-btn').removeClass('edit-btn-disabled');

            $(this).closest('tr').show();

          }
        }
      })
    })

    if(!somethingFound) {

      $('#nothing-found-info-text').show();
      $('#user-edit-btn').addClass('edit-btn-disabled');
    
    }

  }
}

const buildView = (isAdmin) => {
  if(isAdmin) {
    buildBookingTable(true);

    const adminButtons = '<div class="button-container">'
    +   '<button class="option-button" id="user-btn">Nutzer verwalten</button>'
    + '</div>'
    + '<div class="button-container">'
    +   '<button class="option-button" id="machine-btn">Maschinen verwalten</button>'
    + '</div>'
    + '<div class="button-container">'
    +   '<button class="option-button" id="statistic-btn">Statistiken</button>'
    + '</div>'

    
    if($('#user-btn').length < 1)
      $('.option-button-container').prepend(adminButtons);
  

    $('#edit-btn').text("Buchungen bearbeiten");

    $('#statistic-btn').click(() => {
      openStatisticView();
    });


    $('#user-btn').click(() => {
      openUserView();
    })
  }
  else {
    buildBookingTable(false);
  }
}

const openUserView = (edit) => {
  
  Swal.fire({
    html: '<div class="user-content">'
    + '<div class="user-search-field-container">'
    + ' <input title="Suchen" id="user-search-field" type="text"></input>'
    + ' <ion-icon id="search-icon" name="search-outline"></ion-icon>'
    + '</div>'
    + '<div class="user-table-container">'
    + ' <div>'
    + '   <table class="user-table" cellspacing="0" cellpadding="0">'
    + '       <caption>Maschinenpark Nutzer</caption>'
    + '       <thead>'
    + '           <tr>'
    + '               <th>Nachname</th>'
    + '               <th>Vorname</th>'
    + '               <th>UserID</th>'
    + '               <th>Role</th>'
    + '               <th>Beruf</th>'
    + '               <th>Einstellungsjahr</th>'
    + '               <th class="edit-icons-header"></th>'
    + '           </tr>'
    + '       </thead>'
    + '       <tbody id="user-table-body">'
    + '       </tbody>'
    + '   </table>'
    + ' </div>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<div>'
    + ' <p id="nothing-found-info-text"><b>Es konnten keine Daten gefunden werden!</b></p>'
    + '</div>'
    + '<button class="off" id="user-edit-btn">Nutzer bearbeiten<button>'
    + '</button>',
    showConfirmButton: false,
    showCancelButton: false,
    width: '90%',
    customClass: 'swal-user',
  }).then(() => {
    $('.edit-icons-header').hide();
  });

  $('#user-search-field').blur();
  $('#user-edit-btn').click(() => {
    toggleUserEditMode();
  })

  if(edit) {
    buildUserTable(edit);
  } else {
    buildUserTable();
  }
}

hasPermission("3", "buildView");

// Event listeners
$('#help-btn').click(() => {
  showHelpMenu();
})

$('#add-btn').click(() => {
  createBooking();
});

$('#edit-btn').click(() => {    
    toggleBookingEditMode();
})

$('#logout-btn').click(() => {
  window.location.pathname = '/logout';
})

$(document).keydown(function(event) {
  if(event.key === "Escape" && $('#edit-btn').hasClass('on')) {
    toggleBookingEditMode();
  }
})