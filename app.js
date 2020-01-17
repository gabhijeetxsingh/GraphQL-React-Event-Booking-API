const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose= require("mongoose");
const graphiQLSchema= require("./graphql/schema/index");
const graphiQLResolvers= require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use("/graphql", graphqlHttp({
    schema : graphiQLSchema,
    rootValue : graphiQLResolvers,
    graphiql : true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqleventapp-l3opj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log("DB connected")
    app.listen(4000);
})
.catch((err)=>{
    console.log(err)
})
