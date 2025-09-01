Notebook Scraper API

API simples em Node.js que retorna notebooks de um site de teste com título e preço, podendo filtrar por marca.

Tecnologias

Node.js

Express

Axios

Cheerio

Como usar

Instale as dependências:

npm install


Rode o servidor:

node index.js

Endpoints

GET / → Testa se o servidor está rodando

GET /notebooks?brand=nome_da_marca → Lista notebooks.

brand é opcional e permite filtrar notebooks pela marca (ex.: ?brand=lenovo)
