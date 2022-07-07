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