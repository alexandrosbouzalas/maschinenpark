$('#help-btn').click(() => {
    Swal.fire({
        html: ` <h1 class="help-title">Registrieren</h1>
                  <p class="help-text">Durch drücken auf den "Registrieren" Button kannst du dich an diesem System registrieren, falls du dich hier noch nie angemeldet hast</p>
                <h1 class="help-title">Anmelden</h1>
                  <p class="help-text">Falls du dich an diesem System schonmal registriert hast, kannst du dich nun hier, durch drücken auf den "Anmelden" button, mit deiner, bei "Registrieren" benutzen User ID und dem dort festgelegten Passwort anmelden</p>
                <h1 class="last-help-text">Wende dich bei weiteren Fragen an Fokko Trei</h1>`,
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


