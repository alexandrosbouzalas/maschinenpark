$('#help-btn').click(() => {
    Swal.fire({
        html: ` <h1 class="help-title">Info zur Anmeldung</h1>
                  <p class="help-text">Da es sich hier um ein Offlinesystem handelt, musst du dich hier auch einmal unabhängig von VW registrieren</p>`,
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

$('#password-forgot').click(() => {

    if($('#password-reset-info:visible').length == 0){
        $('#password-reset-info').slideDown();
    } else {
        $('#password-reset-info').slideUp();
    }
})

$("#submit-btn").on("click", function () {
  let valid = true;
  $("[required]").each(function () {
    if ($(this).is(":invalid")) {
      valid = false;
      if($(this).attr("id") === "userId" && $("#userId").val().length >= 1) {

          $("#message").html("Die UserID besteht aus 7 Zeichen").addClass("errorText");
          $("#userId").removeClass("inputBorder");
          $("#userId").addClass("errorBorder");
      } 
      else if ($(this).attr("id") === "userId" && $("#userId").val().length == 0){
        $("#userId").removeClass("inputBorder");
        $("#userId").addClass("errorBorder");
        $("#password").removeClass("inputBorder");
        $("#password").addClass("errorBorder");
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
      valid = false;
      var message;

      if ($(this).val().length < 8 && $(this).val().length >= 1) {

        message = "Das Passwort besteht aus mindestens 8 Zeichen";
  
        $("#message").html(message).addClass("errorText");
        $("#password").removeClass("inputBorder");
        $("#password").addClass("errorBorder");
      } else if($(this).val().length == 0){
        message = "Bitte fülle aller Felder aus";
  
        $("#message").html(message).addClass("errorText");
        $("#password").removeClass("inputBorder");
        $("#password").addClass("errorBorder");
      } else {
        $("#password").addClass("inputBorder");
        $("#password").removeClass("errorBorder");
        valid = true;
      }
    }
  });
  if (valid) verifySuccess();
}

const verifySuccess = () => {
  $("#message").html("").removeClass("errorText");

  data = {};

  const formData = new FormData(document.querySelector("form"));
  for (var pair of formData.entries()) {
    if (pair[0] === "userId") Object.assign(data, { userId: pair[1].toUpperCase() });
    if (pair[0] === "password") Object.assign(data, { password: pair[1] });
  }

  $.ajax({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ data: data }),
    success: function (response) {
        Swal.fire({
          title: `Willkommen zurück`,
          icon: "success",
          allowOutsideClick: false,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          background: "#f6f8fa",
          timer: 2000,
        }).then(() => {
          window.location = "/home";
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
          background: "#f6f8fa",
          confirmButtonColor: "#007bff",
        });
      } catch {
        Swal.fire({
          title: "Es ist ein unerwarteter Fehler aufgetreten",
          icon: "error",
          allowOutsideClick: false,
          confirmButtonText: "OK",
          background: "#f6f8fa",
          confirmButtonColor: "#007bff",
        });
      }
    },
  });
};

$(document).keydown(function(event) {
  if(event.key === "Enter" && ($("#userId").is(":focus") || $("#password").is(":focus"))) {
    $('#submit-btn').click();
  }
})