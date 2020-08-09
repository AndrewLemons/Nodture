# Nodture 
<img src='https://img.shields.io/github/last-commit/andrewlemons/nodture?style=flat-square'> <img src='https://img.shields.io/github/languages/top/andrewlemons/nodture?style=flat-square'> <image src='https://img.shields.io/github/license/andrewlemons/nodture?style=flat-square'><br>
Nodture is a simple, self-hosted, photo storage solution. Its goal is to be a privacy-conscious alternative to services like Google Photos.

## Install
All instructions assume that you have Git, Node JS, NPM, and MySQL installed. Please follow their respective guides.

1. Create a MySQL user and database for Nodture to use.  
  `$ sudo mysql`  
  `mysql> CREATE DATABASE nodture;`  
  `mysql> CREATE USER 'nodtureuser'@'localhost' IDENTIFIED BY 'password';`  
  `mysql> GRANT ALL PRIVILEGES ON nodture.* TO 'nodtureuser'@'localhost' IDENTIFIED BY 'password';`  
  `mysql> EXIT;`
  
2. Install Nodture.  
  `$ cd ~`  
  `$ git clone https://github.com/AndrewLemons/Nodture.git`  
  `$ cd Nodture`  
  `$ npm install`
  
3. Modify the config file to suit your needs.  
  `$ nano config.js.example`  
  *Modify mysql and storage dir settings, resave the file as config.js.*
  
3. Use PM2 to start Nodture.  
  `$ npm install pm2 -g` *You may need to use sudo*  
  `$ sudo pm2 start server.js`  
  `$ sudo pm2 startup`  
  `$ sudo pm2 save`  
  
4. Open nodture by visiting `http://IP:PORT/`. Have fun!
