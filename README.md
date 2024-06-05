# Proyecto Ingenieria de Software - Gestion Total
### Proposito
Este es un proyecto de prueba para practicar los principios de la Ingenieria de Software, por lo que no es un producto final funcional; Mas bien es un producto que puede ser utilizado para fines academicos, por este motivo a lo largo del respositorio se tienen credenciales por defecto para poder probar de manera correcta el codigo.
###### Grupo de desarrollo
- Isabela Sanchez Saavedra (Analista)
- Isabela Mosquera Fernández (Analista)
- Miguel Angel Calambas (Desarrollador)
- Esteban Santiago Escandon (Desarrollador)
- Julian David Meneses (Tester)
## Requisitos  para ejecución
#### 1.  NODEJS
	Se tiene que verificar que npm funcione correctamente: Si ejecutas `npm --version`, deberia de salirte la verson actual de npm. Si no es asi verifica la instalacion correcta de Nodejs junto con npm.
#### 2. Git (Opcional).
	Para descargar este respositorio, puedes utilizar git para su descarga, o descargar el mismo .zip del proyecto.
### 3. OracleSQL.
	Este proyecto usa como base de datos oracleSQL por lo que es fundamental que este instalado. Por defecto tiene como usuario `BDDII` y contraseña `oracle`.
## Instalacion dependencias y configuracion.
	Para instalar las dependencias primero debe estar dentro de la raiz del respositorio descargado. Posteriormente puede ejecutar cualquiera de los siguientes comandos:
	- `npm i`
	- `npm install`
	Tambien es necesario que cree la base de datos en el usuario antes dicho. Para esto existen dos archivos. sql ubicados en la raiz; Deberá ejecutar los dos archivos para que se cree de manera correcta la base de datos y este tenga el funcionamiento esperado.
##Ejecucion proyecto
	Para poder ejecutar el proyecto primero necesita abrir dos ventas (Es necesario ya que se necesita ejecutar el fronend y el backend), y en cada una se ejecutara un comando diferente, es completamente necesario que las dos se esten ejecutando en paralelo para el correcto funcionamiento del proyecto. De esta manera tendria que ejecutar los siguientes comandos:
	### 1. Terminal 1
			`npm run dev`

		Si todo ha funcionado correctamente deberia de aparecer en la consola un mensaje paraecido al siguiente:

		.\prueabFuncionalidades>npm run dev

		> prueabfuncionalidades@0.0.0 dev
		> vite
		✔ Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw
		Re-optimizing dependencies because lockfile has changed

		  VITE v5.2.8  ready in 5266 ms

		  ➜  Local:   http://localhost:5173/
		  ➜  Network: use --host to expose
		  ➜  press h + enter to show help
	### 2. Terminal 2
			`npm run back`
		Si todo ha funcionado correctamente deberia de aparecer un mensaje diciendo lo siguiente:
	`Servidor Express escuchando en http://localhost:3001`

	Por ultimo para abrir y utilizar el proyecto debera de abrir la URL dada por la primera terminal y podra acceder a todas las funcionalidades.c