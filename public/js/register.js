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