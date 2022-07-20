const currentYear = new Date().getFullYear();

for (var i = currentYear; i >= currentYear - 5; i--) {
  $('#apprenticeyear').append(`<option value="${i}">${i}</option>`)
}


$(document).ready(() => {
  Swal.fire({
    title: 'Wichtige Information',
    html: "<p class='top-info-text'>Missbrauch dieses Systems kann zu unvorhersehbaren Folgen führen.</br></br>Bitte verantwortungsvoll benutzen.</p></br></br><p class='bottom-info-text'>Für mehr Informationen wenden Sie sich an Ihren Meister / Ausbilder.</p>",
    icon: 'warning',
    width: "90%",
    customClass: 'swal',
    showCancelButton: false,
    confirmButtonColor: 'rgb(0, 30, 80)',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Verstanden',
    cancelButtonText: 'Abbrechen',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey : false,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  })
})

$('#help-btn').click(() => {
    Swal.fire({
        html: ` <h1 class="help-title">Info zur Registrierung</h1>
                  <p class="help-text">Benutzen Sie bei der Registrierung nur <b><u>Ihre echten Daten.</u></b></p></br>
                  <p class="help-text">Die <b><u>UserID</u></b> besteht aus <b><u>sieben (7)</u></b> Zeichen. <b><u>VW\\ wird bei dieser Registrierung nicht benötigt.</u></b></p></br>
                  <p class="help-text">Das <b><u>Passwort</u></b> muss aus mindestens <b><u>acht (8) Zeichen</u></b> bestehen.</p></br>
                <h1 class="help-title">Administrationsrechte</h1>
                  <p class="help-text">Falls Sie höhere Administrationsrechte benötigen, wenden Sie sich an <b><u>Fokko Trei</u></b></p>
                <h1 class="last-help-text"><b style="color: #f25902;">Bei Fragen / Problemen wenden Sie sich an <u>Fokko Trei</u></b></h1>`,

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

$('#back-btn').click((event) => {
    event.preventDefault();
    window.location.href = "/";
})

$("#submit-btn").on("click", function () {
  let valid = true;
  $("[required]").each(function () {
    if ($(this).is(":invalid") || !$(this).val()) {
     
      valid = false;
      if($(this).attr("id") === "userId") {
        if ($("#userId").val().length < 7) {
          $("#message").html("Die UserID besteht aus 7 Zeichen").addClass("errorText");
          $("#userId").removeClass("inputBorder");
          $("#userId").addClass("errorBorder");
        }
      } else {
        $(this).removeClass("inputBorder");
        $(this).addClass("errorBorder");
        $("#message")
          .html("Bitte fülle alle Felder aus")
          .addClass("errorText");
      }
    } else {
      $(this).removeClass("errorBorder");
    }
  });
  if (valid) checkInput();
});

function checkInput() {
  var valid = true;

  $("[required]").each(function () {
    valid = true;
    if ($(this).attr("id") === "password") {
      var message;
      
      if ($(this).val().length < 8) {
        valid = false;

        message = "Bitte benutze mindestens 8 Zeichen";
  
        $("#message").html(message).addClass("errorText");
        $("#password").removeClass("inputBorder");
        $("#password").addClass("errorBorder");
      }
    }
    if ($(this).attr("id") === "passwordRepeat") {
      var message;
      
      if ($('#password').val().length < 8) {
        valid = false;

        message = "Bitte benutze mindestens 8 Zeichen";
  
        $("#message").html(message).addClass("errorText");
        $("#password").removeClass("inputBorder");
        $("#password").addClass("errorBorder");
        $("#passwordRepeat").removeClass("inputBorder");
        $("#passwordRepeat").addClass("errorBorder");
      }
    }
    if ($("#password").val() !== $("#passwordRepeat").val()) {
      valid = false;
      $("#message").html("Passwörter stimmen nicht überein").addClass("errorText");
      $("#password").removeClass("inputBorder");
      $("#password").addClass("errorBorder");
      $("#passwordRepeat").removeClass("inputBorder");
      $("#passwordRepeat").addClass("errorBorder");
    } 

  });
  if (valid) verifySuccess();
}

const verifySuccess = () => {

  $("#message").html("").removeClass("errorText");

  data = {};

  let role;

  const formData = new FormData(document.querySelector("form"));
  for (var pair of formData.entries()) {
    if (pair[0] === "lastname") Object.assign(data, { lastname: pair[1] });
    if (pair[0] === "firstname") Object.assign(data, { firstname: pair[1] });
    if (pair[0] === "userId") Object.assign(data, { userId: pair[1].toUpperCase() });
    if (pair[0] === "password") Object.assign(data, { password: pair[1] });
    if (pair[0] === "role") {
      Object.assign(data, { role: pair[1] });
      role = pair[1];
    }
    if (pair[0] === "profession") {

      let profession = "AZB";

      if(role === "AZB")
        profession = pair[1];
      else if (role === "AUSB" || role === "ABBA")
        profession = role;

      Object.assign(data, { profession : profession });
    }
    if (pair[0] === "apprenticeyear") {

      let apprenticeyear;

      if(role === "AZB")
        apprenticeyear = pair[1];
      else if (role === "AUSB" || role === "ABBA")
        apprenticeyear = "0";

      Object.assign(data, { apprenticeyear: apprenticeyear }); 
    }
  }

  $.ajax({
    url: "/register",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ data: data }),
    success: function (response) {
      Swal.fire({
        title: `Sie haben sich erfolgreich registriert`,
        icon: "success",
        allowOutsideClick: false,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        background: "#f6f8fa",
        timer: 2000,
      }).then(() => {
        window.location = "/login";
      });
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
};

$('#role').change(() => {

  if($('#role').val() === "AUSB" || $('#role').val() === "ABBA") {
    $('#profession').parents().closest('.input-field').slideUp();
    $('#apprenticeyear').parents().closest('.input-field').slideUp();
  } else if($('#role').val() === "AZB") {
    $('#profession').parents().closest('.input-field').slideDown();
    $('#apprenticeyear').parents().closest('.input-field').slideDown();
  }
})

$(document).keydown(function(event) {
  if(event.key === "Enter" && ($('input').is(":focus"))) {
    $('#submit-btn').click();
  }
})