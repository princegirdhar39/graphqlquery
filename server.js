const express = require('express');

const expressGraphQL = require('express-graphql').graphqlHTTP;//compatibility layer between graphql and express
const app = express();
const schema = require('./schema/schema');
//if any request comes into our app looking for /graphql we want the graphql librRY to handle it

app.use('/graphql',expressGraphQL({
    schema,
    graphiql: true,

}));    


app.listen(4000, () => {
    console.log('port running on port 4000');
})









