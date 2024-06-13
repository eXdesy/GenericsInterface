const express = require("express");
const bodyParser = require('body-parser');
const expressSession = require("express-session");
const flash = require('express-flash');
const bcrypt = require("bcryptjs");
const axios = require('axios');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const dotenv = require("dotenv");
const qr = require('qrcode');
const speakeasy = require('speakeasy');

dotenv.config();
const app = express();

// MIDDLEWARES
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(expressSession({
  secret:"secret",
  resave:true,
  saveUninitialized:true
}));
app.use("/resources", express.static("src"));
app.use("/resources", express.static(__dirname + "/src"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// VARIABLES
const API_URL = process.env.API_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
let authToken;
let secret2fa;

// ROUTES
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/home', (req, res) => {
  if (authToken) {
    res.render('home');
  } else {
    res.redirect('/login');
  }
});
app.get('/user', (req, res) => {
  if (authToken) {
    // res.render('user');
    res.render('user');
  } else {
    res.redirect('/login');
  }
});
app.get('/test', (req, res) => {
  res.render('test');
});

// SECURITY
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, checkAuth } = req.body;

    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      correo: email,
      contrasena: password,
      mfaEnabled: checkAuth
    };

    const response = await axios.post(`http://api-gateway:8084/auth/register`, newUser);
    const userData = response.data;

    if (userData) {
      console.log("Response Data:", userData);
      secret2fa = userData.secret;

      if (checkAuth && userData.secret) {
        // Generamos el URL para el código QR compatible con Google Authenticator
        const otpAuthUrl = speakeasy.otpauthURL({
          secret: userData.secret,
          label: `${email}`,
          issuer: 'GENERICS'
        });

        // Generamos el código QR usando el URL generado
        qr.toDataURL(otpAuthUrl, (err, qrCode) => {
          if (err) {
            res.render('check', { message: 'fa2Error' });
          } else {
            res.render('check', { message: 'fa2Register', qrCode: qrCode });
          }
        });
      } else {
        res.render('check', { message: 'register' });
      }
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log('Error interno del servidor: '+error.message);
        res.render('check', { message: 'serverError' });
      } else if (error.response.status === 400) {
        console.log('Error interno del cliente: '+error.message);
        res.render('check', { message: 'clientError' });
      }
    } else {
      console.log('Error inesperado: '+error.message);
      res.render('check', { message: 'error' });
    }
  }
});
app.post('/check-2fa', async (req, res) => {
  try {
    const sec = secret2fa;
    const otp = req.body.otp;

    const result = await check2FA(sec, otp);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/auth', async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    authToken = await loginWithJwt(email, password, otp);

    if (authToken) {
      res.redirect('/home');
    } else {
      console.log('Código OTP incorrecto. Por favor, inténtalo de nuevo.: '+error.message);
      res.render('check', { message: 'authError' });
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 500) {
        console.log('Error interno del servidor: '+err.message);
        res.render('check', { message: 'serverError' });
      } else if (err.response.status === 400) {
        console.log('Error interno del cliente: '+err.message);
        res.render('check', { message: 'clientError' });
      }
    } else {
      console.log('Error inesperado: '+err.message);
      res.render('check', { message: 'error' });
    }
  }
});

async function loginWithJwt(correo, contrasena, otp) {
  try {
    const response = await axios.post("http://api-gateway:8084/auth/login", {
      correo: correo,
      contrasena: contrasena
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JWT_SECRET
      }
    });

    if (response.status === 200) {
      const data = response.data;

      if (data.mfaEnabled) {
        if (!data.secretImageUri) {
          throw new Error('El servidor no proporcionó el URI de la imagen secreta para 2FA.');
        }

        await check2FA(data.secretImageUri, otp);
      }

      const authToken = data.token;
      return authToken;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Fallo al iniciar sesión con JWT');
  }
}
async function check2FA(sec, otp) {
  try {
    const tokenValidates = speakeasy.totp.verify({
      secret: sec,
      encoding: 'ascii',
      token: otp
    });

    if (!tokenValidates) {
      return null
    } else {
      return tokenValidates;
    }
  } catch (error) {
    throw new Error('Fallo al iniciar sesión con JWT');
  }
}

// ENDPOINTS
app.post('/createUser', async (req, res) => {
  try {
    // Obtener los datos del formulario desde el cuerpo de la solicitud
    const { firstName, lastName, age, email, address, mobile, password } = req.body;

    // Crear un objeto con los datos del nuevo usuario
    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      edad: age,
      correo: email,
      direccion: address,
      telefono: mobile,
      contrasena: password,
    };

    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para crear el usuario
    const response = await axios.post(`${API_URL}/crear`, newUser, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Verificar si se creó correctamente
    if (response.status === 201) {
      res.redirect('/user');
    } else {
      res.status(500).send('Error al crear el usuario');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

app.post('/editUser', async (req, res) => {
  try {
    const email = req.body.email;
    // Obtener los datos del formulario desde el cuerpo de la solicitud
    const user = req.body.data;

    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para editar el usuario
    const response = await axios.put(`${API_URL}/editar/${email}`, user, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Verificar si se editó correctamente
    if (response.status === 200) {
      res.redirect('/user');
    } else {
      res.status(500).send('Error al editar el usuario');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }
  }
});

app.post('/deleteUser', async (req, res) => {
  try {
    const email = req.body.email;
    // Llamar a la API de SpringBoot para eliminar el usuario
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }
    // Llamar a la API de SpringBoot para eliminar el usuario
    const response = await axios.delete(`${API_URL}/borrar/${email}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    // Verificar si se eliminó correctamente
    if (response.status === 200) {
      res.redirect('/user');
    } else {
      res.status(500).send('Error al eliminar el usuario');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

app.post('/getUser', async (req, res) => {
  try {
    const { searchBy, searchTerm } = req.body;

    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para buscar el usuario según el campo y el término de búsqueda
    const response = await axios.get(`${API_URL}/${searchBy}/${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const userData = response.data; // Acceder directamente a response.data 

    // Verificar si se encontraron datos del usuario
    if (userData) {
      // Enviar los datos del usuario como respuesta en formato JSON
      res.status(200).json(userData);
    } else {
      // Si no se encontró el usuario, enviar un mensaje de error
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

app.post('/getUserRegister', async (req, res) => {
  try {
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para obtener los usuarios con estado false
    const response = await axios.get(`${API_URL}/pendientes`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const userData = response.data;

    // Verificar si se encontraron datos de usuarios con estado false
    if (userData) {
      // Enviar los datos de usuarios como respuesta en formato JSON
      res.status(200).json(userData);
    } else {
      // Si no se encontraron usuarios, enviar un mensaje de error
      res.status(404).send('Usuarios no encontrados');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: ' + error.message);
      } else {
        res.status(400).send('Error interno del cliente: ' + error.message);
      }
    } else {
      res.send('Error inesperado: ' + error.message);
    }
  }
});

app.post('/checkRegister', async (req, res) => {
  try {
    const { email } = req.body;

    // Llamar a la API de SpringBoot para aprobar el usuario
    const response = await axios.put(`${API_URL}/aprobar/${email}?estado=true`, null, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });

    // Verificar si se aprobó correctamente
    if (response.status === 200) {
        res.status(200).send('Usuario aprobado exitosamente');
    } else {
        res.status(500).send('Error al aprobar el usuario');
    }
  } catch (error) {
      if (error.response) {
          if (error.response.status === 500) {
              res.status(500).send('Error interno del servidor: ' + error.message);
          } else {
              res.status(400).send('Error interno del cliente: ' + error.message);
          }
      } else {
          res.status(500).send('Error inesperado: ' + error.message);
      }
  }
});

// START SERVER
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+ PORT + "/login");
  console.log("API URL is " + API_URL);
})