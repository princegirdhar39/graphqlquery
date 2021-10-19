const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType ,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull 
} = graphql;


const CompanyType = new GraphQLObjectType({
    name: 'company',
    fields: () => ( {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue,args) {
                return axios.get(`http:localhost:3000/companies/${parentValue.id}/users`,{ proxy: { host: '127.0.0.1', port: 3000 } })

                .then(res => res.data);
            }

        }


    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ( {
        id: {type: GraphQLString} ,
        firstName: {type: GraphQLString } ,
        age: {type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue,args) {
                console.log(parentValue,args);
               return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
               .then(res => res.data );

            }
        }

    })

}) ;
//rootquery is the entry popint into our data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            //it returns the data that represents user object
            
            resolve(parentValue,args) {
                // return _.find(users, {id: args.id});
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(res => res.data);



            }
        },
        company: {
        type: CompanyType,
        args: {id: {type: GraphQLString} },
        resolve(parentValue,args) {
            return axios.get(`http://localhost:3000/companies/${args.id}`)
            .then(res => res.data);
        }
    }


    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType ,
            args: {
                firstName : {type: new GraphQLNonNull( GraphQLString)},
                age: {type: new GraphQLNonNull( GraphQLInt) },
                companyId: {type: new GraphQLNonNull( GraphQLString)}
            },
            resolve(parentValue,{firstName,age}) {
                return axios.post('http://localhost:3000/users',{firstName,age })
                .then(res=>res.data);

            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}

            },
            resolve(parentValue,{id}) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                .then(res => res.data);
            }

        },
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString},


            },
            resolve(parentValue,args) {
               return axios.patch(`http://localhost:3000/users/${args.id}`,args)
                .then(res => res.data);
            }
        }
    }

});
module.exports =  new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});

//fragments 
//fragmant companydetails on company {
   //name etc
// }
