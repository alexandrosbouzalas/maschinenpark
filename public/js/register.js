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
        html: '<h1 class="help-title">Info zur Registrierung </h1><p class="help-text">Anmeldungshilfe hier eingeben</p>',
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
      $(this).removeClass("inputBorder");
      $(this).addClass("errorBorder");
      $("#message")
        .html("Bitte fülle alle Felder aus")
        .addClass("errorText");
    } else {
      $(this).removeClass("errorBorder");
    }
  });
  if (valid) checkInput();
});

function checkInput() {
  var valid = true;
  $("[required]").each(function () {
    if (
      $(this).attr("id") === "email" &&
      (!$(this).val() || !checkPattern($(this).attr("id")))
    ) {
      valid = false;
      var message;

      if ($(this).val().length < 8)
        message = "Bitte benutze mindestens 8 Zeichen";

      $("#message").html(message).addClass("errorText");
      $("#password").removeClass("inputBorder");
      $("#password").addClass("errorBorder");
      $("#passwordRepeat").removeClass("inputBorder");
      $("#passwordRepeat").addClass("errorBorder");
    }
    if ($("#password").val() !== $("#passwordRepeat").val()) {
      valid = false;
      $("#message").html("Passwörter passen nicht zusammen").addClass("errorText");
      $("#password").removeClass("inputBorder");
      $("#password").addClass("errorBorder");
      $("#passwordRepeat").removeClass("inputBorder");
      $("#passwordRepeat").addClass("errorBorder");
    }
  });
  if (valid) verifySuccess();
}

const verifySuccess = () => {
  data = {};

  const formData = new FormData(document.querySelector("form"));
  for (var pair of formData.entries()) {
    if (pair[0] === "lastname") Object.assign(data, { lastname: pair[1] });
    if (pair[0] === "firstname") Object.assign(data, { firstname: pair[1] });
    if (pair[0] === "userId") Object.assign(data, { userId: pair[1] });
    if (pair[0] === "password") Object.assign(data, { password: pair[1] });
    if (pair[0] === "role") Object.assign(data, { role: pair[1] });
    if (pair[0] === "profession") Object.assign(data, { profession : pair[1] });
    if (pair[0] === "apprenticeyear") Object.assign(data, { apprenticeyear: pair[1] }); 
  }

  console.log(data);

  $.ajax({
    url: "/register",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ data: data }),
    success: function (response) {
      Swal.fire({
        title: `Du hast dich erfolgreich registriert`,
        icon: "success",
        allowOutsideClick: false,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        width: "50%",
        background: "#f1f4f6",
        confirmButtonColor: "#007bff",
      }).then(() => {
        window.location = "/home";
      });
    },
    error: function (err) {
      Swal.fire({
        title: err.responseJSON.msg,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
        background: "#f1f4f6",
        width: "50%",
      });
    },
  });
};
