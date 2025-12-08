CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author TEXT ,
	url TEXT NOT NULL,
	title TEXT NOT NULL,
	likes INT DEFAULT 0
)

INSERT INTO blogs (author, url, title) VALUES 
('Vi', 'https://meublog.com/index.html', 'Como Estudar 12h/dia sem Endoidar'),
('Lucas', 'https://exmplo.net/index.html', 'Armlock da Guarda');
