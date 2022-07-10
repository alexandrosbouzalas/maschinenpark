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

  if ($("#userId").val().length < 7) {
      valid = false;
      $("#message").html("Die UserId besteht aus 7 Zeichen").addClass("errorText");
      $("#userId").removeClass("inputBorder");
      $("#userId").addClass("errorBorder");
  }
  if (valid) checkInput();
  });

function checkInput() {
  var valid = true;

  $("[required]").each(function () {
    if (
      $(this).attr("id") === "userId" && (!$(this).val())
    ) {
      $("#message").addClass("errorText");

      valid = false;
      $("#message").html("Invalid format");
      $(this).removeClass("inputBorder");
      $(this).addClass("errorBorder");
    }
    if (
      $(this).attr("id") === "password" &&
      (!$(this).val() || $(this).val().length < 8)
    ) {
      $("#message").addClass("errorText");

      valid = false;
      var message = "Das Passwort besteht aus mindestens 8 Zeichen";

      $("#message").html(message);
      $("#password").removeClass("inputBorder");
      $("#password").addClass("errorBorder");
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
          background: "#f1f4f6",
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
          background: "#f1f4f6",
          confirmButtonColor: "#007bff",
        });
      } catch {
        Swal.fire({
          title: "There was an error processing your request",
          icon: "error",
          allowOutsideClick: false,
          confirmButtonText: "OK",
          background: "#f1f4f6",
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