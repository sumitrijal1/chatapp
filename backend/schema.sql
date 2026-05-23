CREATE TABLE IF NOT EXISTS users(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('private', 'group') NOT NULL,
    name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_members(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    deleted_at TIMESTAMP NULL,
    UNIQUE(chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    chat_id      INT NOT NULL,
    sender_id    INT NOT NULL,
    content      TEXT NOT NULL,
    image_url    VARCHAR(255) NULL,
    sent_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP NULL,
    forwarded_from INT NULL,
    reply_to     INT NULL,
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (forwarded_from) REFERENCES messages(id),
    FOREIGN KEY (reply_to) REFERENCES messages(id)
);

CREATE TABLE IF NOT EXISTS message_deletes(
    message_id INT,
    user_id    INT,
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);