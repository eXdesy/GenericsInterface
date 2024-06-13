// Obtener el mensaje del servidor desde el elemento HTML oculto
function showContent(page) {
  var mainContent = document.getElementById("formContent");
  var content = "";
  // Dependiendo de la opción seleccionada, cargar el contenido apropiado
  switch (page) {
    case 'serverError':
      content = `
        <div class="serverError">
          <h1 class="error-code">500</h1>
        </div>
        <div class="content-error">
          <h2>Oops! Parece que el servidor se ha caido :(</h2>
          <p>Estamos trabajando en ello, intentalo de nuevo mas tarde!</p>
          <a href="/login" class="back-button">Pagina de inicio</a>
        </div>
        `;
      break;

    case 'clientError':
      content = `
      <div class="clientError">
        <h1 class="error-code">404</h1>
      </div>
      <div class="content-error">
        <h2>Oops! Algo ha sido mal :(</h2>
        <p>El cliente no responde, intentalo de nuevo mas tarde!</p>
        <a href="/login" class="back-button">Pagina de inicio</a>
      </div>
      `;
      break;
    
    case 'error':
      content = `
        <div class="error">
          <h2>Oops! Algo ha sido mal, intentalo de nuevo mas tarde!</h2>
          <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
            <div class="wheel"></div>
            <div class="hamster">
              <div class="hamster__body">
                <div class="hamster__head">
                  <div class="hamster__ear"></div>
                  <div class="hamster__eye"></div>
                  <div class="hamster__nose"></div>
                </div>
                <div class="hamster__limb hamster__limb--fr"></div>
                <div class="hamster__limb hamster__limb--fl"></div>
                <div class="hamster__limb hamster__limb--br"></div>
                <div class="hamster__limb hamster__limb--bl"></div>
                <div class="hamster__tail"></div>
              </div>
            </div>
            <div class="spoke"></div>
          </div>
          <a href="/login" class="back-button">Pagina de inicio</a>
        </div>
        `;
      break;
    
    case 'fa2Register':
      content = `
        <div class="fa2Register">
          <div class="content-error">
            <h2>Te registraste de forma correcta :)</h2>
            <p>Escanea codigo QR y espera que te acepten para iniciar sesion!</p>
          </div>
        </div>
      `;
      break;

    case 'register':
      content = `
        <div class="register">
          <img src="resources/lib/img/successful-page.png"/>
          <div class="content-error">
            <h2>Te registraste de forma correcta :)</h2>
            <p>Espera que te acepten y inicia sesion!</p>
            <a class="back-button" href="/login">Pagina de inicio</a></li>
          </div>
        </div>
      `;
      break;

    case 'fa2Error':
      content = `
        <div class="fa2Error">
          <div class="content-error">
            <h2>Oops! Algo ha ido mal al generar el código QR :(</h2>
            <p>Intenta de nuevo o contacta con soporte!</p>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
              <div class="wheel"></div>
              <div class="hamster">
                <div class="hamster__body">
                  <div class="hamster__head">
                    <div class="hamster__ear"></div>
                    <div class="hamster__eye"></div>
                    <div class="hamster__nose"></div>
                  </div>
                  <div class="hamster__limb hamster__limb--fr"></div>
                  <div class="hamster__limb hamster__limb--fl"></div>
                  <div class="hamster__limb hamster__limb--br"></div>
                  <div class="hamster__limb hamster__limb--bl"></div>
                  <div class="hamster__tail"></div>
                </div>
              </div>
              <div class="spoke"></div>
            </div>
            <a class="back-button" href="/login">Pagina de inicio</a></li>
          </div>
        </div>
      `;
      break;

    case 'authError':
      content = `
        <div class="authError">
          <div class="content-error">
            <h2>No estas verificado todavia :(</h2>
            <p>Espera que te verificen o registra de nuevo!</p>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
              <div class="wheel"></div>
              <div class="hamster">
                <div class="hamster__body">
                  <div class="hamster__head">
                    <div class="hamster__ear"></div>
                    <div class="hamster__eye"></div>
                    <div class="hamster__nose"></div>
                  </div>
                  <div class="hamster__limb hamster__limb--fr"></div>
                  <div class="hamster__limb hamster__limb--fl"></div>
                  <div class="hamster__limb hamster__limb--br"></div>
                  <div class="hamster__limb hamster__limb--bl"></div>
                  <div class="hamster__tail"></div>
                </div>
              </div>
              <div class="spoke"></div>
            </div>
            <a class="back-button" href="/login">Pagina de inicio</a></li>
          </div>
        </div>
      `;
      break;  
  }
  // Actualizar el contenido de <main>
  mainContent.innerHTML = content;
}

async function check() {
  const otp = document.getElementById('otp').value;

  try {
    const response = await fetch('/check-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp })
    });

    if (response.ok) {
      location.href = '/login';
    } else {
      showToast('Error');
    }
  } catch (error) {
    showToast('Error');
  }
}

function showToast(message) {
  let toastBox = document.getElementById('toastBox');
  let toast = document.createElement('div');
  toast.classList.add('toast');
  let content = "";

  switch (message) {
    case 'Error':
      content = '<i class="fa-solid fa-circle-xmark"></i> Código OTP incorrecto. Por favor, inténtalo de nuevo.';
      break;
  }

  toast.innerHTML = content;
  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 6000);
}