import {prisma} from '../db';


export const getAllWordsByCollectionId = async (id:string): Promise<any>=>{
    return await prisma.word.findMany({
        where: { collectionId: id },
        include:{
            collection: false
        }
    });
}

export const createNewWord = async (wordData:any)=>{
    return await prisma.collection.create({data: wordData});
}

export const updateWord = async (id:string, wordData:any)=>{
    return await prisma.collection.update({
        where:{
            id: id
        },
        data:wordData
    })
}

export const deleteWordById = async (id: string)=>{
    await prisma.collection.delete({
        where:{
            id: id
        }
    });
}