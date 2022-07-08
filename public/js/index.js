$('#help-btn').click(() => {
    Swal.fire({
        html: '<h1 class="help-title">Registrierung</h1><p class="help-text">Registrierungshilfe hier eingeben</p><h1 class="help-title">Anmeldung</h1><p class="help-text">Registrierungshilfe hier eingeben</p>',
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


