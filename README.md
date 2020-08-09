<p align="center">
  <img src="https://raw.githubusercontent.com/zumapi/zum-server/master/zum.png" alt="logo">
</p>

### Warning : Work in progress

*This is the raw source code for zum server. Zum aims to be an all in one open source solution for authentication and user management. It is created using Node JS.*

### Features
* Exposes an easy to use client facing api.
* Integrates seamlessly with mongodb database. You only need to change the connection string in the ```dbconf``` file.
* HTTPS support. You need to specify the path to your certificates in the ```server``` file.
* Mail support and email verification using sendgrid. You will need to specify the api key in the ```mailer``` file.
* Customizable user schema. Change the schema by editting the ```models``` file in the ```db``` section.
* Passwords are stored in the form of salted hashes by default.
* All sensitive communication with the server is carried out using signed json web tokens.
