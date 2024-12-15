import {prisma} from "../db";

export const findCollectionByName = async (collectionName: string): Promise<any> => {
    await prisma.collection.findUnique({
        where:{
            name: collectionName,
        }
    });
}

export const createNewCollection = async (collectionData)=> {
    return await prisma.collection.create({data: collectionData});
}

export const getAllCollections = async () : Promise<any[]> => {
    return await prisma.collection.findMany({});
}

export const getCollectionById = async (id: string): Promise<any> => {
    return prisma.collection.findUnique({
        where: {
            id: id
        }
    });
}

export const getCollectionByIdWithWords = async (id: string): Promise<any> => {
    return await prisma.collection.findUnique({
        where:{
            id: id
        },
        include:{
            words: true
        }
    });
}

export const deleteCollectionById = async (id: string): Promise<any> => {
    return await prisma.collection.delete({
        where:{
            id: id
        }
    });
}

export const updateCollectionById = async (id: string, updatedCollection: any): Promise<any> => {
    await prisma.collection.update({
        where:{
            id: id
        },
        data:  {
            updatedAt: new Date(),
            name: updatedCollection.name,
            status: updatedCollection.status,
            description: updatedCollection.description,
            isPassed: updatedCollection.isPassed,
            isPracticed: updatedCollection.isPracticed

        }
    });
}