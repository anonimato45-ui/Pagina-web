create table RegistrationUsers(
                              id int auto_increment primary key not null,
                              UserName varchar(50) collate utf16_bin,
                              Email varchar(255) not null unique,
                              password varchar(255) not null,
                              Registration_Date timestamp default current_timestamp not null
);