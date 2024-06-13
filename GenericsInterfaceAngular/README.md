# Generics
Este proyecto es una aplicación que implementa operaciones CRUD (Crear, Leer, Actualizar, Eliminar) utilizando Angular. Proporciona una interfaz de usuario atractiva para interactuar con una API  y realizar operaciones básicas de gestión de datos.

### Índice

1. [Instalación](#1-instalación)
2. [Cambiar la aplicación](#2-cambiar-la-aplicación)
3. [Comunicación con Servicios de back-end mediante HTTP](#3-comunicación-con-servicios-de-back-end-mediante-http)
4. [Configuración para la comunicación con el servidor](#4-configuración-para-la-comunicación-con-el-servidor)
5. [Comandos Básicos para Angular](#5-comándos-básicos-para-angular-)
6. [Migración de Node.js a Angular](#6-migración-de-nodejs-a-angular)
7. [Tutoriales](#tutoriales-)
8. [Errores y Soluciones](#8-errores-y-soluciones)
9. [Licencia](#licencia)
10. [Contacto](#contacto)
## 1. Instalación
Para poder crear un proyecto en angular hay que hacer los siguientes pasos:

1. Instalar Angular CLI
   ``` bash
    npm install @angular/cli -g

2. Ejecutar el comando CLI  y asignale un nombre como se muestra a continuación.

    ``` bash
    ng new -miproyecto

3. Una vez que ejecutes el comando ng new, se verá información sobre las funciones que desea incluir en su primer proyecto de aplicación. Presione Entrar o Volver para aceptar el valor predeterminado.

4. Para levantar la aplicación lo que tenemos que hacer es ir al directorio de tu espacio de trabajo y utilizar este comando:

    ``` bash
   cd -miproyecto
   ng serve --open
   
5. El comando ng serve crea la aplicación, inicia el servidor de desarrollo y observa los archivos de origen. Cuando realiza un cambio en un archivo que se está viendo, se realizará una reconstrucción en el archivo modificado.
6. Utizar el siguiente comando para desacargas las dependencias
      ``` bash
   npm install
7. Instalar bootstrap con el siguiente comando:
      ``` bash
   npm install bootstrap

## 2. Cambiar la aplicación

Para hacer algunos cambios en la aplicación de inicio, abrimos el proyecto en su editor de texto favorito o IDE y vaya a src/app.
Donde encontrarás AppComponent donde está dividido en tres archivos:

1. app.component.ts donde este es el código para la clase de componentes escrita en TypeScript.
2. app.component.html, este es el componente Plantillas escrito en HTML
3. app.component.css, este CSS es solo para este componente.

Recomendamos para crear los servicios y componentes necesarios el plugin Angular Schematic

## 3. Comunicación con Servicios de back-end mediante HTTP

El servicio de cliente HTTP ofrece las siguientes características principales.
1. La capacidad de solicitar objetos de respuesta con tipo
2. Manejo de errores optimizado
3. Características de capacidad de prueba
4. Intercepción de solicitudes y respuestas.

## 4.  Configuración para la comunicación con el servidor

1. Antes de poder usar , debe importar el archivo . La mayoría de las aplicaciones lo hacen en la raíz.HttpClientHttpClientModuleAppModule
app.module.ts 

   ``` bash
      import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';
      import { HttpClientModule } from '@angular/common/http';

      @NgModule({
      imports: [
      BrowserModule,
      // import HttpClientModule after BrowserModule.
      HttpClientModule,
      ],
      declarations: [
       AppComponent,
      ],
       bootstrap: [ AppComponent ]
       })
       export class AppModule {}
2. A continuación, puede insertar el servicio como una dependencia de una clase de aplicación, como se muestra en el ejemplo siguiente.HttpClientConfigService

   app/config/config.service.ts (extracto):

      ``` bash
         import { Injectable } from '@angular/core';
         import { HttpClient } from '@angular/common/http';

         @Injectable()
         export class ConfigService {
         constructor(private http: HttpClient) { }
         }
3. El servicio hace uso de observables para todas las transacciones. Debe importar los símbolos observables y de operador de RxJS que aparecen en los fragmentos de código de ejemplo. Estas importaciones son típicas.HttpClientConfigService
      ``` bash
         import { Observable, throwError } from 'rxjs';
         import { catchError, retry } from 'rxjs/operators';

## 5. Comándos Básicos para Angular 
 
1. Lanzar un servidor y abril el navegador por defecto automáticamente
   ``` bash
   ng serve -o
   
2. Angular utiliza por defecto el puerto 4200. Si quieres utilizar otro, podemos hacer:
   ``` bash
   ng serve --port=3500
   
3. Para omitir dependencias externas al crear un nuevo proyecto
      ``` bash
   ng new nuevoproyecto --skip-install
 
4. Para limpiar la caché
   ``` bash
   npm cache clean

## 6. Migración de Node.js a Angular

1. **Copiar archivos estáticos**: Mueve los archivos estáticos (como HTML, CSS, imágenes, etc.) del frontend de Node.js al directorio correspondiente en el nuevo proyecto de Angular.
2. **Refactorización de código JavaScript/TypeScript**: Convierte el código JavaScript del frontend de Node.js a TypeScript compatible con Angular.
3. **Instalación de dependencias**: Instala las dependencias necesarias para el proyecto de Angular.
4. **Configuración del enrutamiento**: Configura el enrutamiento de la aplicación en el archivo `app-routing.module.ts` para que coincida con la estructura de rutas del frontend de Node.js.
5. **Integración con API REST**:Actualiza las llamadas a la API REST para que coincidan con la nueva estructura del proyecto de Angular. Puedes utilizar servicios Angular para manejar las llamadas HTTP.
6. **Pruebas y Depuración**: Realiza pruebas exhaustivas en la aplicación migrada para asegurarte de que funcione correctamente. Utiliza herramientas de depuración de Angular para solucionar cualquier problema que surja.
7. **Optimización de rendimiento**: Implementa técnicas de optimización de rendimiento en la aplicación Angular, como lazy loading, optimización de imágenes, etc.

## 7. Tutoriales 
[Tutorial de SpringBoot con Angular](https://youtu.be/zTSDxPFacGg?si=EOyqAqD_uKPcJBRm)

[Tutorial de conectar Angular con Sping](https://codingpotions.com/angular-servicios-llamadas-http)

## 8. Errores y Soluciones

1. Error de Cors: es un mecanismo que permite que un recurso restringido en una página web sea solicitado desde otro dominio diferente al dominio desde el cual se sirvió el recurso. No hemos conseguido solucionarlo aunque los métodos utilizados son estos:
      - Crear proxy.conf.json
      - Modificar el package.json debido al método start que está por defecto
      -  Uso de la función Access-Control-Allow-Origin:*



## 9. Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## 10.  Contacto

Para cualquier duda, no dudes en contactar con nosotros:
- navarrovegaalberto@gmail.com
- alejandro1052004@gmail.com
- joseluisgonzalezalamo@gmail.com
- eXdesy@gmail.com
- nicolascarlosdavid@gmail.com
