import NextAuth, { Awaitable, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../helpers/auth';
import { connectToDatabase } from '../../../helpers/db';

export default NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: { label: 'password', type: 'password'}
            },
            authorize: async(credentials) => {
                if(typeof credentials?.password  !== 'string' || typeof credentials?.email !== 'string'){
                    throw new Error('Invalid inputs');
                }

                const client = await connectToDatabase();

                const usersCollection = client.db().collection('users');

                const user = await usersCollection.findOne({email: credentials.email});

                if(!user){
                    client.close();
                    throw new Error('No user found!');
                }

                if(typeof user.password !== 'string'){
                    throw new Error('user password is not a string ' + typeof user.password);
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if(!isValid){
                    client.close();
                    throw new Error('Invalid inputs');
                }

                client.close();

                return { email: user.email } as Awaitable<User>;

            }
        })
    ]
});