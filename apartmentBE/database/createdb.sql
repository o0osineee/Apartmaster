use apartmaster;
CREATE TABLE Role (
                      roleId INT PRIMARY KEY AUTO_INCREMENT,
                      name VARCHAR(100) NOT NULL UNIQUE ,
                      description TEXT,
                      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Permission (
                            permissionId INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL UNIQUE ,
                            description TEXT,
                            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Department (
                            departmentId INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL UNIQUE ,
                            description TEXT,
                            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Role_Department_Permission (
                                            roleId INT NOT NULL,
                                            departmentId INT NOT NULL,
                                            permissionId INT NOT NULL,
                                            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                            isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
                                            PRIMARY KEY (roleId, departmentId, permissionId),
                                            FOREIGN KEY (roleId) REFERENCES Role(roleId),
                                            FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
                                            FOREIGN KEY (permissionId) REFERENCES Permission(permissionId)
) ENGINE=InnoDB;
CREATE TABLE Employee (
                          employeeId INT PRIMARY KEY AUTO_INCREMENT,
                          idNumber VARCHAR(50) NOT NULL UNIQUE ,
                          fullName VARCHAR(100) NOT NULL,
                          gender VARCHAR(50),
                          birthDate DATE,
                          phone VARCHAR(20),
                          email VARCHAR(100),
                          startDate DATE NOT NULL,
                          endDate DATE,
                          username VARCHAR(100) NOT NULL UNIQUE,
                          password TEXT NOT NULL,
                          status BOOLEAN NOT NULL DEFAULT TRUE,
                          roleId INT NOT NULL,
                          departmentId INT NOT NULL,
                          FOREIGN KEY (roleId) REFERENCES Role(roleId),
                          FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
                          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE Task (
                      taskId INT PRIMARY KEY AUTO_INCREMENT,
                      title VARCHAR(255) NOT NULL,
                      description TEXT,
                      deadline DATE,
                      status VARCHAR(50),
                      departmentId INT NOT NULL,
                      employeeId INT,
                      FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
                      FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
                      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Resident (
                          residentId INT PRIMARY KEY AUTO_INCREMENT,
                          fullName VARCHAR(100) NOT NULL,
                          birthDate DATE,
                          gender VARCHAR(50),
                          idNumber VARCHAR(50) NOT NULL UNIQUE ,
                          phone VARCHAR(20),
                          email VARCHAR(100),
                          username VARCHAR(100) NOT NULL UNIQUE,
                          password TEXT NOT NULL,
                          status BOOLEAN NOT NULL DEFAULT TRUE,
                          roleId INT NOT NULL,
                          FOREIGN KEY (roleId) REFERENCES Role(roleId),
                          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Apartment (
                           apartmentId INT PRIMARY KEY AUTO_INCREMENT,
                           code VARCHAR(50) NOT NULL UNIQUE,
                           building VARCHAR(50) NOT NULL,
                           floor INT NOT NULL,
                           area FLOAT,
                           status VARCHAR(50),
                           contract TEXT,
                           createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Resident_Apartment (
                                    residentId INT NOT NULL,
                                    apartmentId INT NOT NULL,
                                    PRIMARY KEY (residentId, apartmentId),
                                    FOREIGN KEY (residentId) REFERENCES Resident(residentId),
                                    FOREIGN KEY (apartmentId) REFERENCES Apartment(apartmentId),
                                    isOwner BOOLEAN NOT NULL DEFAULT FALSE,
                                    moveInDate DATE,
                                    moveOutDate DATE,
                                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    isDeleted BOOLEAN NOT NULL DEFAULT FALSE


) ENGINE=InnoDB;
CREATE TABLE Repair (
                        repairId INT PRIMARY KEY AUTO_INCREMENT,
                        title VARCHAR(100) NOT NULL,
                        description TEXT,
                        status VARCHAR(50),
                        residentId INT NOT NULL,
                        employeeId INT,
                        FOREIGN KEY (residentId) REFERENCES Resident(residentId),
                        FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
                        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Maintenance (
                             maintenanceId INT PRIMARY KEY AUTO_INCREMENT,
                             title VARCHAR(100) NOT NULL,
                             description TEXT,
                             time DATETIME,
                             status VARCHAR(50),
                             employeeId INT NOT NULL,
                             FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
                             createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Vehicle (
                         vehicleId INT PRIMARY KEY AUTO_INCREMENT,
                         licensePlate VARCHAR(50) NOT NULL UNIQUE,
                         type VARCHAR(50),
                         residentId INT NOT NULL,
                         FOREIGN KEY (residentId) REFERENCES Resident(residentId),
                         createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Fee (
                     feeId INT PRIMARY KEY AUTO_INCREMENT,
                     name VARCHAR(100) NOT NULL UNIQUE,
                     type VARCHAR(100) NOT NULL,
                     price DECIMAL(10,2) NOT NULL,
                     createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                     isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Service (
                         serviceId INT PRIMARY KEY AUTO_INCREMENT,
                         name VARCHAR(100) NOT NULL UNIQUE ,
                         description TEXT,
                         feeId INT NOT NULL,
                         FOREIGN KEY (feeId) REFERENCES Fee(feeId),
                         createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         isDeleted BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB;
CREATE TABLE Service_Resident (
                                  serviceId INT NOT NULL,
                                  residentId INT NOT NULL,
                                  PRIMARY KEY (serviceId, residentId),
                                  FOREIGN KEY (serviceId) REFERENCES Service(serviceId),
                                  FOREIGN KEY (residentId) REFERENCES Resident(residentId),
                                  startDate DATE,
                                  endDate DATE,
                                  rating INT,
                                  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  isDeleted BOOLEAN NOT NULL DEFAULT FALSE


) ENGINE=InnoDB;
CREATE TABLE Complaint (
                           complaintId INT PRIMARY KEY AUTO_INCREMENT,
                           title VARCHAR(255),
                           content TEXT,
                           status VARCHAR(50),
                           residentId INT,
                           departmentId INT,
                           FOREIGN KEY (residentId) REFERENCES Resident(residentId),
                           FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
                           createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           isDeleted BOOLEAN NOT NULL DEFAULT FALSE


) ENGINE=InnoDB;
CREATE TABLE Bill (
                      billId INT PRIMARY KEY AUTO_INCREMENT,
                      month VARCHAR(20),
                      money DECIMAL(10,2),
                      isPaid BOOLEAN DEFAULT FALSE NOT NULL,
                      paymentMethod VARCHAR(100),
                      apartmentId INT NOT NULL,
                      FOREIGN KEY (apartmentId) REFERENCES Apartment(apartmentId),
                      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      isDeleted BOOLEAN NOT NULL DEFAULT FALSE


) ENGINE=InnoDB;
CREATE TABLE Apartment_Fee (
                               apartmentId INT NOT NULL,
                               feeId INT NOT NULL,
                               PRIMARY KEY (apartmentId, feeId),
                               FOREIGN KEY (apartmentId) REFERENCES Apartment(apartmentId),
                               FOREIGN KEY (feeId) REFERENCES Fee(feeId),
                               amount INT,
                               createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               isDeleted BOOLEAN NOT NULL DEFAULT FALSE
)ENGINE=InnoDB;
CREATE TABLE Report (
                        reportId INT PRIMARY KEY AUTO_INCREMENT,
                        content TEXT,
                        employeeId INT NOT NULL,
                        FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
                        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        isDeleted BOOLEAN NOT NULL DEFAULT FALSE
)ENGINE=InnoDB;
CREATE TABLE Notification (
                              notificationId INT PRIMARY KEY AUTO_INCREMENT,
                              title VARCHAR(100) NOT NULL,
                              content TEXT,
                              status VARCHAR(50),
                              employeeId INT NOT NULL,
                              FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
                              createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              isDeleted BOOLEAN NOT NULL DEFAULT FALSE
)ENGINE=InnoDB;





