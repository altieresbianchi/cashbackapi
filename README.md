# Cashback API
API Cashback.

# Ambiente Demonstração
- **Localhost:** http://localhost:8080/api
- **Remoto:** https://cashbackapi.herokuapp.com/api

# Collection Postman
https://www.getpostman.com/collections/c20c6a727886b1d6f22e

Configuração do Environment:
- **BASE_DOMAIN** *(URL do ambiente)*
- **TOKEN** *(Token gerado no login)*

# Endpoints
**Home**
- **GET**  **/v1/** *(Endpoint base)*

**Login**
- **POST**  **/v1/login** *(Login de revendedor (Parâmetros: cpf, senha))*

**Revendedor**
- **GET**    **/v1/revendedores/** *(Lista de revendedores cadastrados)*
- **GET**    **/v1/revendedores/:cpf** *(Busca revendedor pelo cpf)*
- **GET**    **/v1/revendedores/:cpf/cashback** *(Busca o cashback total do revendedor pelo cpf)*
- **POST**   **/v1/revendedores/** *(Cadastra um novo revendedor (Parâmetros: cpf, nome, email, senha))*
- **PUT**    **/v1/revendedores/:cpf** *(Edita um revendedor (Parâmetros: nome, email, senha))*
- **DELETE**  **/v1/revendedores/:cpf** *(Exclui um revendedor)*

**Compra**
- **GET**    **/v1/compras/** *(Lista de compras cadastradas)* 
- **GET**    **/v1/compras/:codigo** *(Busca compra pelo código)*
- **POST**   **/v1/compras/** *(Cadastra uma nova compra (Parâmetros: codigo, cpf, valor, data))*
- **PUT**    **/v1/compras/:codigo** *(Edita uma compra (Parâmetros: valor, status, data))*
- **DELETE**  **/v1/compras/:codigo** *(Exclui uma compra)*

**Cashback**
- **GET**  **/v1/cashback/:cpf** *(Retorna o saldo de cashback do revendedor buscando pelo CPF na API externa fornecida pelo solicitante)*

&nbsp;
&nbsp;
