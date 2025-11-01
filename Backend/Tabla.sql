create table RegistrationUsers(
                              id int auto_increment primary key not null,
                              UserName varchar(50) collate utf16_bin,
                              Email varchar(255) not null unique,
                              password varchar(255) not null,
                              Registration_Date timestamp default current_timestamp not null
);

CREATE TABLE tasks(
					id INT AUTO_INCREMENT PRIMARY KEY,
					user_id INT NOT NULL,
					task_text VARCHAR(500) NOT NULL,
					completed BOOLEAN DEFAULT FALSE,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (user_id) REFERENCES RegistrationUsers(id) ON DELETE CASCADE
);