import { MongoClient } from "mongodb";

export async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb+srv://adminuser:wXwEjlEtGlygdG6E@cluster0.engzx7h.mongodb.net/?retryWrites=true&w=majority')

    return client;
}