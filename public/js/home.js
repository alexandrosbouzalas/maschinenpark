setInterval(() => {
    var daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    var currentdate = new Date(); 
    var datetime = daysOfWeek[currentdate.getDay() - 1] + " - "
                + currentdate.getDate() + "/" 
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " - "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

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

$('.edit-icon').click((event) => {

    

    let element;

    if($(event.target).is("div")) {
        element = event.target.parentNode.parentNode.parentNode
    } else if ($(event.target).is("ion-icon")) {
        element = event.target.parentNode.parentNode.parentNode.parentNode
    }

    let currentMachine = element.childNodes[3];

    Swal.fire({
        html: '<div class="edit-options-container">'
        + ' <div class="edit-option">'
        + '     <div>'
        + '         <label for="maschine">Maschine:</label>'
        + `         <input id="current-maschine" type="text" name="maschine" placeholder="${currentMachine.innerText}" disabled/>`
        + '         <button id="maschine-change-btn" type="button">Neue Auswahl</button>'
        + '     </div>'
        + ' </div>'
        + ' <div class="edit-option">'
        + '     <div>'
        + '         <label for="from">Von:</label>'
        + '         <input type="text" name="from"/><ion-icon id="from-calendar" name="calendar-outline"></ion-icon>'
        + '     </div>'
        + ' </div>'
        + ' <div class="edit-option">'
        + '     <div>'
        + '         <label for="to">Bis:</label>'
        + '         <input type="text" name="to"/><ion-icon id="to-calendar" name="calendar-outline"></ion-icon>'
        + '     </div>'
        + ' </div>'
        + '</div>',
        showCancelButton: true,
        width: '90%',
        customClass: 'swal',
        cancelButtonColor: 'grey',
        cancelButtonText: 'Abbrechen', 
        confirmButtonText: 'Speichern',
        confirmButtonColor: 'rgb(0, 30, 80)',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            
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
        text: "Wollen Sie diese Buchung wirklich löschen?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: 'grey',
        confirmButtonText: 'Löschen',
        confirmButtonColor: 'rgb(0, 30, 80)',
        cancelButtonText: 'Abbrechen', 
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          element.remove();
          if($('#table-body')[0].rows.length == 1) {
            $('#nobookings-info').show();
            $('#edit-btn').css('background-color', 'grey');
            $('#edit-btn').css('cursor', 'not-allowed');  
          }
        }
      })
})


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

$(document).ready(() => {
    if($('#table-body')[0].rows.length == 1) {
        $('#nobookings-info').show();
        $('#edit-btn').css('background-color', 'grey');
        $('#edit-btn').css('cursor', 'not-allowed'); 
    }

})