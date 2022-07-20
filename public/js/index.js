$('#help-btn').click(() => {
    Swal.fire({
        html: ` <h1 class="help-title">Registrieren</h1>
                  <p class="help-text">Durch drücken auf den "Registrieren" Knopf können Sie sich an diesem System registrieren.</p>
                <h1 class="help-title">Anmelden</h1>
                  <p class="help-text">Falls Sie sich an diesem System schon einmal registriert haben, können Sie sich mit Hilfe des "Anmelden" Knopfs, mit Ihrer, bei "Registrieren" benutzen User ID und dem dort festgelegten Passwort anmelden.</p>
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

$('#register-btn').click(() => {
    window.location.pathname = 'register';
})

$('#login-btn').click(() => {
    window.location.pathname = 'login';
})


