
// Global variables
let picker;
let dates = {};
let currentEditElement;
let machines = []; // Container that is passed along holding all the selected machines
let allMachines = [];
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

const openParkView = (isAdmin, adminEdit, adminDelete, placeholderMachine, editMode) => {

  if(isAdmin) {

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
      width: '100%',
      showCancelButton: false,
      showConfirmButton: true,
      customClass: 'swal-park',
    })

    const machinesEditElement = '<div class="edit-icons-container">'
    + '    <div title="Eine neue Maschine hinzufügen" class="machine-add-icon"><ion-icon name="add-outline"></ion-icon></div>'
    + '    <div title="Maschine bearbeiten" class="machine-edit-icon"><ion-icon name="pencil-outline"></ion-icon></div>'
    + '    <div title="Maschine löschen" class="machine-delete-icon"><ion-icon name="trash-outline"></ion-icon></div>'
    + '</div>'

    $('.swal2-actions').append(machinesEditElement);
    $('.swal2-confirm').hide();


    $('.machine-add-icon').click(() => {
      Swal.fire({
        html: `<p class="edit-title">Eine neue Maschine hinzufügen</p>`
        + '     <div class="edit-option-row">'
        + '         <div>'
        + '             <select id="machinetype">'
        + '                 <option value="F">Fräsmaschine</option>'
        + '                 <option value="D">Drehmaschine</option>'
        + '                 <option value="B">Bohrmaschine</option>'
        + '             </select>'
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + '<div class="edit-options-container">'
        + ' <div class="edit-option">'
        + '     <div class="edit-option-row">'
        + '         <div>'
        + `             <input id="machine-number" title="Geben Sie hier die Nummer der neuen Maschine ein" min="1" step="1" type="number"/>`
        + '         </div>'
        + '     </div>'
        + ' </div>'
        + ' <p id="machine-add-error"></p>'
        + '</div>',
        showCancelButton: true,
        width: '90%',
        customClass: 'swal',
        cancelButtonColor: 'lightgrey',
        cancelButtonText: 'Abbrechen', 
        confirmButtonText: 'Speichern',
        confirmButtonColor: 'rgb(0, 30, 80)',
        reverseButtons: true,
        preConfirm: () => {
          valid = true; 

          const machineId = $('#machinetype').val() + $('#machine-number').val();

          if(!/^[0-9]+$/.test($('#machine-number').val())) {
            valid = false;
            $('#machine-add-error').text(`Ungültige Maschinennummer`);
            $('#machine-add-error').slideDown();
            $('#machine-number').addClass('errorBorder');
          } else {
            $('#machine-add-error').slideDown();
            $('#machine-number').removeClass('errorBorder');
          }

          if(allMachines.includes(machineId)) {
            valid = false
            $('#machine-add-error').text(`Maschine ${machineId} existiert bereits`);
            $('#machine-add-error').slideDown();
          }

          if(valid) return true
          else return false
        }
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
              url: "/home/addMachine",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ data: {machineId: $('#machinetype').val() + $('#machine-number').val()}}),
              success: function (response) {
                Swal.fire({
                  title: "Die Maschine wurde erfolgreich hinzugefügt",
                  icon: "success",
                  allowOutsideClick: false,
                  showCloseButton: false,
                  showCancelButton: false,
                  showConfirmButton: false,
                  background: "#f6f8fa",
                  timer: 2000,
                }).then(() => {
                  openParkView(true, false, false);
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
            openParkView(true);
          }
      })
    })

    $('.machine-edit-icon').click(() => {
      if($('.machine-edit-bubble:visible').length == 0)
      {
        $('.machine-delete-bubble').hide();
        $('.machine-delete-icon').css("background-color", "rgb(0, 30,80");
        $('.machine-edit-bubble').show();
        $('.machine-edit-icon').css("background-color", "#02ccfd");
      } else {
        $('.machine-edit-bubble').hide();
        $('.machine-edit-icon').css("background-color", "rgb(0, 30,80");
      }
    })

    $('.machine-delete-icon').click(() => {
      
      if($('.machine-delete-bubble:visible').length == 0)
      {
        $('.machine-edit-bubble').hide();
        $('.machine-edit-icon').css("background-color", "rgb(0, 30,80");
        $('.machine-delete-bubble').show();
        $('.machine-delete-icon').css("background-color", "#f25902");
      } else {
        $('.machine-delete-bubble').hide();
        $('.machine-delete-icon').css("background-color", "rgb(0, 30,80");
      }
    })
    
  } else {

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
        } else if(isAdmin) {
          Swal.close()
        } else {
          createBooking();
        }
      }
    })
  }


  Opentip.styles.maschineInfoStyle = {
    extends: "alert",
    stem: true,
    tipJoint: "bottom",
    background: "rgb(0, 30, 80)",
    borderColor: "rgb(0, 30, 80)",
    borderRadius: 10,
  };
  
  getMachines(placeholderMachine, adminEdit, adminDelete);
}

const  createBooking = (machines, edit) => {

  machines ? machines : machines = "";

  dates = {};
  
  Swal.fire({
    html: '<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="maschine">Maschine:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input class="option-field" id="current-machines" type="text" placeholder="${machines}" name="maschine" disabled/>`
    + '         </div>'
    + '         <div>'
    + `             <button id="maschine-change-btn" type="button" onClick="openParkView(false, false, false, '${machines}')">Auswählen</button>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="from">Von:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input class="option-field" type="text" id="from-date-picker" name="from" disabled/>`
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
    + `             <input class="option-field" type="text" id="to-date-picker" name="to" disabled />`
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
    + ' <p id="booking-create-error"></p>'
    + '</div>',
    showCancelButton: true,
    width: '90%',
    customClass: 'swal',
    cancelButtonColor: 'lightgrey',
    cancelButtonText: 'Abbrechen', 
    confirmButtonText: 'Speichern',
    confirmButtonColor: 'rgb(0, 30, 80)',
    reverseButtons: true,
    preConfirm: () => {
      valid = true;
      
      if($('#current-machines').attr('placeholder') === "" && !dates.beginDate && !dates.endDate) {
        valid = false;
        $('.edit-options-container input').addClass('errorBorder');
        $('#booking-create-error').text("Bitte füllen Sie alle Felder aus");
        $('#booking-create-error').slideDown();
      } else {
        if(!dates.endDate) {
          valid = false;
          $('#to-date-picker').addClass('errorBorder');
          $('#booking-create-error').text("Bitte wählen Sie ein Enddatum aus");
          $('#booking-create-error').slideDown();
        } else {
          $('#to-date-picker').removeClass('errorBorder');
        }
        if(!dates.beginDate) {
          valid = false;
          $('#from-date-picker').addClass('errorBorder');
          $('#booking-create-error').text("Bitte wählen Sie ein Startdatum aus");
          $('#booking-create-error').slideDown();
        } else {
          $('#from-date-picker').removeClass('errorBorder');
        }
        if(!$('#current-machines').attr('placeholder')) {
          valid = false;
          $('#current-machines').addClass('errorBorder');
          $('#booking-create-error').text("Bitte wählen Sie eine Maschine aus");
          $('#booking-create-error').slideDown();
        } else {
          $('#current-machines').removeClass('errorBorder');
        }
      }

      if(valid) return true;
      else return false; 
    }
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

  currentEditElement = checkEventType(event);
  const element = checkEventType(event);
  
  const currentMachine = element.children[element.children.length - 4];
  const currentFromDate = element.children[element.children.length - 3];
  const currentToDate = element.children[element.children.length - 2];
  
  dates.beginDate = currentFromDate.innerText;
  dates.endDate = currentToDate.innerText;

  Swal.fire({
    html: `<p class="edit-title">Buchung ${element.children[element.children.length - 5].innerText} bearbeiten</p>`
    +'<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div class="label-container">'
    + '             <label for="maschine">Maschine:</label>'
    + '         </div>'
    + '         <div>'
    + `             <input id="current-machines" type="text" name="maschine" placeholder="${machines ? machines : currentMachine.innerText}" disabled/>`
    + '         </div>'
    + '         <div>'
    + `             <button id="maschine-change-btn" type="button" onClick="openParkView(false, false, false, '${machines ? machines : currentMachine.innerText}', true)">Ändern</button>`
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

      if($('#current-machines').attr('placeholder') !== currentMachine.innerText)
        Object.assign(updateOptions, {machines : $('#current-machines').attr('placeholder')});
      if(dates.beginDate !== $('#from-date-picker').attr("placeholder")) {
        Object.assign(updateOptions, {beginDate: dates.beginDate});
      }
      if(dates.endDate !== $('#to-date-picker').attr("placeholder")) {
        Object.assign(updateOptions, {endDate: dates.endDate});
      }
      dates = {};

      if(Object.keys(updateOptions).length >= 2) {

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
          if($('#edit-btn').hasClass('off')) {
            toggleBookingEditMode();
          }
        }); 
      }
    } else {
      dates = {};
      if(picker)
        picker.close();
    }
  })

}

const editUser = (event) => {
  
  const element = checkEventType(event);

  const currentUserLastname = element.children[0].innerText;
  const currentUserFirstname = element.children[1].innerText;
  const currentUserUserId = element.children[2].innerText;
  const currentUserRole = element.children[3].innerText;
  let currentUserProfession = element.children[4].innerText;
  const currentUserApprenticeyear = element.children[5].innerText;
  const currentUserPermission = element.children[6].innerText;

  Swal.fire({
    html: `<p class="edit-title">${currentUserUserId}'s Nutzerdaten bearbeiten</p>`
    + '<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + `             <input id="lastname" type="text" name="lastname" placeholder="${currentUserLastname}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + `             <input id="firstname" type="text" name="firstname" placeholder="${currentUserFirstname}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + `             <input id="userId" type="text" name="userId" minLength="7" maxLength="7" style="text-transform:uppercase" placeholder="${currentUserUserId}"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
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
    + '         <div>'
    + '             <select id="apprenticeyear" name="apprenticeyear">'
    + '             </select>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + '             <select id="permissionclass" name="permissionclass">'
    + '                 <option value="3">Alle Rechte</option>'
    + '                 <option value="2">Begrenzte Rechte</option>'
    + '                 <option value="1">Standard Rechte</option>'
    + '             </select>'
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <p id="permission-edit-warning"><b>VORSICHT: Inkorrekte Rechtevergabe kann zu Missbrauch des Systems führen!</b></p>'
    + ' <p id="user-edit-error"></p>'
    + '</div>',
    showCancelButton: true,
    width: '90%',
    customClass: 'swal',
    cancelButtonColor: 'lightgrey',
    cancelButtonText: 'Abbrechen', 
    confirmButtonText: 'Speichern',
    confirmButtonColor: 'rgb(0, 30, 80)',
    reverseButtons: true,
    preConfirm: () => {
      valid = true;
      if($('#lastname').val().length >= 1 && $('#lastname').val() !== $('#lastname').attr('placeholder')) {
        if(!/^[a-zA-Z]+$/.test($('#lastname').val())) {
          valid = false;
          $('#user-edit-error').text('Der Nachname darf nur Buchstaben enthalten');
          $('#lastname').addClass('errorBorder');
          $('#user-edit-error').slideDown();
        } else {
          $('#lastname').removeClass('errorBorder');
        }
      }
      if($('#firstname').val().length >= 1 && $('#firstname').val() !== $('#firstname').val() !== $('#firstname').attr('placeholder')) {
        if(!/^[a-zA-Z]+$/.test($('#firstname').val())) {
          valid = false;
          $('#user-edit-error').text('Der Vorname darf nur Buchstaben enthalten');
          $('#firstname').addClass('errorBorder');
          $('#user-edit-error').slideDown();
        } else {
          $('#firstname').removeClass('errorBorder');
        }
      }
      if($('#userId').val().length >= 1 && $('#userId').val() !== $('#userId').attr('placeholder')) {
        if($('#userId').val().length < 7) {
          valid = false;
          $('#user-edit-error').text('Die UserID muss 7 Zeichen lang sein');
          $('#userId').addClass('errorBorder');
          $('#user-edit-error').slideDown();
        } else if(!/^[a-zA-Z0-9]+$/.test($('#userId').val())) {
          $('#user-edit-error').text('Die UserID darf nur Buchstaben und Zahlen enthalten');
          $('#userId').addClass('errorBorder');
          $('#user-edit-error').slideDown();
        } else {
          $('#userId').removeClass('errorBorder');
        }
      }

      if(valid) return true;
      else return false;
    },
  }).then((result) => {
    if (result.isConfirmed) {

      const updateOptions = {};

      if(currentUserProfession === "ANDERE") currentUserProfession = "OTHER";

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
      if(currentUserProfession !== $('#profession').val()) {
          Object.assign(updateOptions, {profession: $('#profession').val()});
      }
      if(currentUserApprenticeyear !== $('#apprenticeyear').val()) {
        Object.assign(updateOptions, {apprenticeyear: $('#apprenticeyear').val()});
      }
      if(currentUserRole !== $('#role').val()) {
        if($('#role').val() === "ABBA" || $('#role').val() === "FACH") {
          Object.assign(updateOptions, {role: $('#role').val()});
          Object.assign(updateOptions, {profession: $('#role').val()});
          Object.assign(updateOptions, {apprenticeyear: "0"});
        } else if($('#role').val() === "AZB"){
          if(currentUserProfession !== $('#profession').val()) {
            if($('#profession').val() === 'ANDERE')
              Object.assign(updateOptions, {profession: "OTHER"});
            else
              Object.assign(updateOptions, {profession: $('#profession').val()});
    
          }
          if(currentUserApprenticeyear !== $('#apprenticeyear').val()) {
            Object.assign(updateOptions, {apprenticeyear: $('#apprenticeyear').val()});
          }
        }
      }
      if(currentUserPermission !== $('#permissionclass').val()) {
        Object.assign(updateOptions, {permissionClass: $('#permissionclass').val()});
      }

      if(Object.keys(updateOptions).length >= 2) {
        $.ajax({
          url: "/home/updateUser",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ data: updateOptions }),
          success: function (response) {
            Swal.fire({
              title: "Die Nutzerdaten wurden erfolgreich aktualisiert",
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

  $('#permissionclass').val(element.children[6].innerText);

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

  $('#permissionclass').change(() => {
    $('#permission-edit-warning').slideDown();
  })

}

const editUserPassword = (event) => {

  const element = checkEventType(event);  

  const currentUserUserId = element.children[2].innerText;

  Swal.fire({
    html: `<p class="edit-title">${currentUserUserId}'s Passwort zurücksetzen</p>`
    + '<div class="edit-options-container">'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + `             <input id="password" type="password" name="password" placeholder="Neues Passwort"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <div class="edit-option">'
    + '     <div class="edit-option-row">'
    + '         <div>'
    + `             <input id="passwordrepeat" type="password" name="passwordrepeat" placeholder="Neues Passwort wiederholen"/>`
    + '         </div>'
    + '     </div>'
    + ' </div>'
    + ' <p id="user-edit-error"></p>'
    + '</p>',
    showCancelButton: true,
    width: '90%',
    customClass: 'swal',
    cancelButtonColor: 'lightgrey',
    cancelButtonText: 'Abbrechen', 
    confirmButtonText: 'Speichern',
    confirmButtonColor: 'rgb(0, 30, 80)',
    reverseButtons: true,
    preConfirm: () => {
      valid = true;

      if($('#password').val().length < 8) {
        valid = false;
        $('#user-edit-error').text("Bitte Benutze mindestens 8 Zeichen");
        $('#password').addClass('errorBorder');
        $('#user-edit-error').slideDown();
      }
      if($('#passwordrepeat').val().length < 8) {
        valid = false;
        $('#user-edit-error').text("Bitte Benutze mindestens 8 Zeichen");
        $('#passwordrepeat').addClass('errorBorder');
        $('#user-edit-error').slideDown();
      }
      if($('#password').val() !== $('#passwordrepeat').val()) {
        valid = false;
        $('#user-edit-error').text("Die Passwörter stimmen nicht überein");
        $('#password').addClass('errorBorder');
        $('#passwordrepeat').addClass('errorBorder');
        $('#user-edit-error').slideDown();
      } 
      
      if(valid)return true
      else return false;
    },
  }).then((result) => {
    if (result.isConfirmed) {

      const updateOptions = {};

      Object.assign(updateOptions, {userIdToEdit: currentUserUserId});
      Object.assign(updateOptions, {password: $('#password').val()});

      $.ajax({
        url: "/home/updateUserPassword",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ data: updateOptions}),
        success: function (response) {
          Swal.fire({
            title: "Das Passwort wurde erfolgreich aktualisiert",
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
      openUserView(true);
    }
  })
}

const checkEventType = (event) => {
  if($(event.target).is("div")) {
    element = event.target.parentNode.parentNode.parentNode;
  } else if ($(event.target).is("ion-icon")) {
    element = event.target.parentNode.parentNode.parentNode.parentNode;
  }

  return element;
}

const comparer = (index) => {
  return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
  }
}
const getCellValue = (row, index) => { 
  return $(row).children('td').eq(index).text() 
}

const deleteBooking = (event) => {

  const element = checkEventType(event);

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
          $('#edit-btn').text('Buchungen verwalten');
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
        $('#edit-btn').text('Buchungen verwalten');
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
        $('#edit-btn').text('Buchungen verwalten');
    }
  } else {
    $('#edit-btn').removeClass('on');
    $('#edit-btn').addClass('off')
    $('.edit-icons-header').hide();
    $('.booking-edit-icons-cell').hide();
    $('#edit-btn').text('Buchungen verwalten');
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

const getMachines = (placeholderMachine, adminEdit, adminDelete) => {
  
  $.ajax({
    url: "/home/getMachines",
    method: "POST",
    contentType: "application/json",
    success: function (response) {

      allMachines = [];

      let infoContentHtml;
      const weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

      for(var i = 0; i < response.length; i++) {
        allMachines.push(response[i].machineId);

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

          $(`#${response[i].machineId}`).append('<div class="machine-delete-bubble"></div>');
          $(`#${response[i].machineId}`).append('<div class="machine-edit-bubble"></div>');

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

        $('.machine-delete-bubble').append('<ion-icon name="close-outline"></ion-icon>');
        $('.machine-edit-bubble').append('<ion-icon name="pencil-outline"></ion-icon>');

        if(adminEdit) $('.machine-edit-icon').click();
        if(adminDelete) $('.machine-delete-icon').click();

        $('.machine-edit-bubble').click((event) => {
          
          const targetMachine = $(event.target).parents().closest('.maschine');

          const statusClass = targetMachine.attr('class').split(/\s+/)[2];


          Swal.fire({
            html: `<p class="edit-title" style="margin-top: 15px;">Maschine ${targetMachine.attr('id')} Status ändern</p>`
            +'<div class="edit-options-container">'
            + ' <div class="edit-option">'
            + '     <div class="edit-option-row">'
            + '         <div>'
            + '             <select id="machinestatus">'
            + '                 <option value="F">Funktionsfähig</option>'
            + '                 <option value="B">Außer Betrieb</option>'
            + '             </select>'
            + '         </div>'
            + '     </div>'
            + ' </div>'
            + '</div>',
            showCancelButton: true,
            width: '50%',
            customClass: 'small-swal',
            cancelButtonColor: 'lightgrey',
            cancelButtonText: 'Abbrechen', 
            confirmButtonText: 'Speichern',
            confirmButtonColor: 'rgb(0, 30, 80)',
            reverseButtons: true,
          }).then((result) => {
            if(result.isConfirmed) {
              
              if($('#machinestatus').val() !== statusClass.charAt(statusClass.length - 1).toUpperCase()) {

                $.ajax({
                  url: "/home/updateMachine",
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({ data: {machineId: targetMachine.attr('id'), status: $('#machinestatus').val()} }),
                  success: function (response) {
                    Swal.fire({
                      title: "Die Maschine wurde erfolgreich aktualisiert",
                      icon: "success",
                      allowOutsideClick: false,
                      showCloseButton: false,
                      showCancelButton: false,
                      showConfirmButton: false,
                      background: "#f6f8fa",
                      timer: 2000,
                    }).then(() => {
                      openParkView(true);
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
                  openParkView(true, true, false);
                });
              }

            } else {
              openParkView(true, true, false);
            }
          })


          $('#machinestatus').val(statusClass.charAt(statusClass.length - 1).toUpperCase());

        })

        $('.machine-delete-bubble').click((event) => {
          let targetMachine = $(event.target).parents().closest('.maschine');

          Swal.fire({
            title: `Wollen Sie Maschine ${targetMachine.attr('id')} wirklich löschen?`, 
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightgrey',
            cancelButtonText: 'Abbrechen', 
            confirmButtonText: 'Löschen',
            confirmButtonColor: 'rgb(0, 30, 80)',
            reverseButtons: true,
          }).then((result) => {
            if(result.isConfirmed) {
              $.ajax({
                url: "/home/deleteMachine",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ data: {machineId: targetMachine.attr('id')} }),
                success: function (response) {
                  Swal.fire({
                    title: "Die Maschine wurde erfolgreich gelöscht",
                    icon: "success",
                    allowOutsideClick: false,
                    showCloseButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    background: "#f6f8fa",
                    timer: 2000,
                  }).then(() => {
                    openParkView(true);
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
              });
            } else {
              openParkView(true, false, true);
            }
          })
        })

        if(placeholderMachine !== '') {
          $(`#${placeholderMachine}`).addClass('selected');
      
          machines.push(placeholderMachine);
        }

        $('.status-f').click((e) => {
          if($(e.target).hasClass('status-f')) {   
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
    html: '<div id="main-info-container">'
    + `       <p class="chart-title">Statistiken</p>`
    + '       <div class="info-container">'
    + '           <div class="statistic-information"></div>'
    + '           <div class="stat-line"></div>'
    + '           <div class="chart-buttons">'
    + '             <div>'
    + `               <button id="profession-chart-btn" type="button">Berufsgruppen</button>`
    + '             </div>'
    + '             <div>'
    + `               <button id="role-chart-btn" type="button">Rollen</button>`
    + '             </div>'
    + '             <div>'
    + `               <button id="time-chart-btn" type="button">Zeitraum</button>`
    + '             </div>'
    + '           </div>'
    + '       </div>'
    + '    </div>',
    showCancelButton: false,
    showConfirmButton: false,
    width: '50%',
    customClass: 'small-swal',
  })

  $('#profession-chart-btn').click(() => {
    openChartView("Buchungen der Maschinen pro Beruf", "profession");
  });

  $('#role-chart-btn').click(() => {
    openChartView("Buchungen der Maschinen pro Rolle", "role");
  });

  $('#time-chart-btn').click(() => {
    openChartView("Buchungen der Maschinen pro Monat", "time");
  });

  getTextStats();
}

const openChartView = (title, searchData) => {
  let searchYear = parseInt(new Date().getFullYear());
  Swal.fire({
    html: '<div id="main-chart-container">'
    + `       <p class="chart-title">${title}</p>`
    + '       <div class="chart-icons-container">'
    + '           <div title="Balkendiagramm anzeigen" class="bar-icon active-chart"><ion-icon name="bar-chart-outline"></ion-icon></div>'
    + '           <div title="Tortendiagramm anzeigen" class="pie-icon inactive-chart"><ion-icon name="pie-chart-outline"></ion-icon></div>'
    + '       </div>' 
    + '       <div class="chart-yearswitcher-container">'
    + '          <div class="mc-select__year center-year">'
    + '             <button id="year-prev" class="mc-select__nav posauto mc-select__nav--prev">'
    + '                 <svg class="icon-angle icon-angle--left" viewBox="0 0 256 512" width="10px" height="100%">'
    + '                     <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>'
    + '                 </svg>'
    + '             </button>'
    + `             <div id="mc-current--year" class="mc-select__data current-year mc-select__data--year" tabindex="0" aria-label="Click to select year" aria-haspopup="true" aria-expanded="true" aria-controls="mc-month-year__preview"><span>${new Date().getFullYear()}</span></div>`
    + '             <button id="year-next" class="mc-select__nav posauto mc-select__nav--next">'
    + '                 <svg class="icon-angle icon-angle--right" viewBox="0 0 256 512" width="10px" height="100%">'
    + '                     <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>'
    + '                 </svg>'
    + '             </button>'
    + '          </div>'
    + '       </div>' 
    + '       <div> <p id="nothing-found-info-text" style="color: rgb(0, 30, 80); display: none;"><b>Es konnten keine Daten gefunden werden!</b></p></div>'
    + '       <div id="chart-container">'     
    + '           <canvas id="chart" width="400" height="400"></canvas>'
    + '       </div>'
    + '    </div>',
    showCancelButton: false,
    showConfirmButton: false,
    width: '90%',
    customClass: 'swal',
  }).then(() => {
    $('#statistic-btn').click();
  })

  $('#year-prev').click(() => {
    if($('#mc-current--year').text() > 2022) {
      $('#mc-current--year').text((parseInt($('#mc-current--year').text()) - 1).toString());
      getStatisticsData("line", false, searchData, parseInt($('#mc-current--year').text()));
    }
  })

  $('#year-next').click(() => {
    if($('#mc-current--year').text() < parseInt(new Date().getFullYear()) + 3) {
      $('#mc-current--year').text((parseInt($('#mc-current--year').text()) + 1).toString());
      getStatisticsData("line", false, searchData, parseInt($('#mc-current--year').text()));
    }
  })

  $('.bar-icon').click(() => {    
    if($('.bar-icon').hasClass('inactive-chart')) {
      $('.bar-icon').addClass('active-chart').removeClass('inactive-chart');
      $('.pie-icon').addClass('inactive-chart').removeClass('active-chart');

      getStatisticsData("bar", false, searchData, searchYear);
    }
  })
  
  $('.pie-icon').click(() => {    
    if($('.pie-icon').hasClass('inactive-chart')) {
      $('.pie-icon').addClass('active-chart').removeClass('inactive-chart');
      $('.bar-icon').addClass('inactive-chart').removeClass('active-chart');

      getStatisticsData("pie", true, searchData, searchYear);
    }
  })

  getStatisticsData("bar", false, searchData, searchYear);
};

const getTextStats = () => {
  $.ajax({
  url: "/home/getTextStats",
    method: "POST",
    contentType: "application/json",
    success: function (response) {
      $('.statistic-information').append(`<p class="stat-text">Anzahl aller Buchungen: <b style="color: #009879">${response[0].allTimeBookings}</b></p>`);
      $('.statistic-information').append(`<p class="stat-text">Anzahl der Registrierten Benutzer: <b style="color: #009879">${response[1]}</b></p>`);
      $('.statistic-information').append(`<p class="stat-text">Anzahl der der Fräsmaschienen: <b style="color: #009879">${response[2]}</b></p>`);
      $('.statistic-information').append(`<p class="stat-text">Anzahl der der Drehmaschienen: <b style="color: #009879">${response[3]}</b></p>`);
      $('.statistic-information').append(`<p class="stat-text">Anzahl der der Bohrmaschienen: <b style="color: #009879">${response[4]}</b></p>`);
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
};

const getStatisticsData = (chartType, displayLabel, searchData, searchYear) => {
  $.ajax({
    url: "/home/getStatisticData",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ searchData: searchData, searchYear: searchYear}), 
    success: function (response) {
      let labeltext = " Buchungen";
      let data = [];
      let labels = [];
      let datasetColor = "#02ccfd";
      let month = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September',    
      'Oktober','November','Dezember'];

      if(searchData == "profession") {
        response.statisticsLabel.shift();
        response.statisticsNumbers.shift();
      }

      if (searchData == "time") {
        chartType = "line";
        interset = false;
        $(".chart-icons-container").css("display", "none");
      } else {
        $(".chart-yearswitcher-container").css("display", "none");
        interset = true;
        datasetColor =
        [
          'rgb(0, 30, 80)',
          '#123C61',
          '#185183',
          '#206AAC',
          '#2782D2',
          '#2C93EE',
          '#02ccfd'
        ];
      }
      
      response.statisticsLabel.forEach(function (element, i) {
        labels[i] = " " + (searchData == "time" ? month[element.statisticLabel - 1] : element.statisticLabel);
      });
      
      response.statisticsNumbers.forEach(function (element, i) {
        data[i] = element.allTimeBookings;
      });
      
      if (searchData == "profession") labels[labels.length - 1] = " ANDERE";
      if (searchData == "role") labels[0] = " ALLE";

      if(!data.length == 0) {
        buildChart(chartType, labels, data, labeltext, displayLabel, datasetColor, interset);
        $('#nothing-found-info-text').hide();
        $('#chart').show();
      } else {
        $('#nothing-found-info-text').show();
        $('#chart').hide();
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

const buildChart = (type, labels, data, labeltext, displayLabel, datasetColor, interset) => {
  let chartStatus = Chart.getChart("chart");
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
            backgroundColor: datasetColor,
            borderRadius: 10,
            borderSkipped: false,
            pointRadius: 6,
            pointHoverRadius: 7
        }]
      },  
      options: {
        interaction: {
          intersect: interset,
          mode: 'index',
        },
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
            },
            callbacks: {
              title: customTitleTooltip
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
                  precision: 0
                },
            },
            x: {
              display: !displayLabel,
              ticks: {
                display: !displayLabel,
                color: 'rgb(0, 30, 80)',
                font: {
                  size: 15,
                  family: 'VW Head, sans-serif'
                },
              },
              grid: {
                lineWidth: 0
              }
            }
        }
    }
  });
}

const customTitleTooltip = () => {
  return ""
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
        + `   <td style="display: none;">${user.permissionClass}</td>`
        + '   <td class="user-edit-icons-cell">'
        + '       <div class="edit-icons-container">'
        + '           <div title="Passwort des Nutzers ändern" class="user-password-icon"><ion-icon name="keypad-outline"></ion-icon></div>'
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

      $('.user-password-icon').click((event) => {
        editUserPassword(event);
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

    
     if($('#user-btn').length < 1) {
       $('.option-button-container').prepend(adminButtons);
   
       $('#edit-btn').text("Buchungen verwalten");
   
       $('#machine-btn').click(() => {
         openParkView(true)
       })
   
       $('#statistic-btn').click(() => {
         openStatisticView();
       });
   
       $('#user-btn').click(() => {
         openUserView();
       })
     }
    
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
    + '               <th title="Nach Nachname Sortieren">Nachname</th>'
    + '               <th title="Nach Vorname Sortieren">Vorname</th>'
    + '               <th title="Nach UserID Sortieren">UserID</th>'
    + '               <th title="Nach Role Sortieren">Role</th>'
    + '               <th title="Nach Beruf Sortieren">Beruf</th>'
    + '               <th title="Nach Einstellungsjahr Sortieren">Einstellungsjahr</th>'
    + '               <th style="display: none;"></th>'
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

  addThEventListeners('user-table');

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

const addThEventListeners = (table) => {
  $(`.${table} th`).click(function(e){

    let currentTableClass = $(e.target).parents().closest('table').attr('class')

    if(!$(this).hasClass('active-sort-header')) {
      $(`.${currentTableClass} th`).removeClass('active-sort-header');
      $(this).addClass('active-sort-header');
    }
    
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
  })
}

// Function calls
hasPermission("3", "buildView");

addThEventListeners('my-bookings-table');

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

$("[type='number']").keypress(function (evt) {
  evt.preventDefault();
});

$(document).keydown(function(event) {
  if(event.key === "Escape" && $('#edit-btn').hasClass('on')) {
    toggleBookingEditMode();
  }
})