import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../helpers/db";
import { hashPassword } from "../../../helpers/auth"
import bcrypt from 'bcrypt';

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        email: string;
        password: string;
    }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST"){
        return;
    }

    const { email, password } = req.body;

    if(!email || !email.includes('@') || !password || password.trim().length < 7){
        res.status(422).json({message: 'Invalid input'})
        return;
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({email: email})

    if(existingUser){
        res.status(422).json({message: 'User already exists'});
        client.close();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword
    });

    res.status(201).json({message: 'Created user'});
    client.close();
}

export default handler;