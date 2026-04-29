import { HydratedDocument, Model, MongooseUpdateQueryOptions , PipelineStage, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";




class BaseRepository<TDocument>{

    constructor(protected readonly _model:Model<TDocument>){ }


    async create(data:Partial<TDocument>) : Promise< HydratedDocument<TDocument>>{
        return this._model.create(data)
    }

    async findById (id:Types.ObjectId):Promise< HydratedDocument<TDocument>| null>{
        return this._model.findById(id)
    }

    async findOne ({filter,projection}:{filter: QueryFilter<TDocument>,projection?: ProjectionType<TDocument>}):Promise< HydratedDocument<TDocument>| null>{
        return this._model.findOne(filter,projection)
    }

    async find ({
        filter,
        projection,
        options
    }:
        {
            filter: QueryFilter<TDocument>,
            projection?: ProjectionType<TDocument>,
            options?: QueryOptions<TDocument>
        }):
        Promise< HydratedDocument<TDocument>[] | []>{
        return this._model.find(filter,projection)
        .sort(options?.sort)
        .skip(options?.skip!)
        .limit(options?.limit!)
        .populate(options?.populate as PopulateOptions)
    }


    async findByIdAndUpdate ({
        id,
        update,
        options
    }:
        {
            id?: Types.ObjectId,
            update: UpdateQuery<TDocument>,
            options?: QueryOptions<TDocument>
        }):
        Promise< HydratedDocument<TDocument>[] | null>{
        return this._model.findByIdAndUpdate(id,update,{new:true,...options})
    }

    async findOneAndUpdate ({
        filter,
        update,
        options
    }:
        {
            filter: QueryFilter<TDocument>,
            update: UpdateQuery<TDocument>,
            options?: QueryOptions<TDocument>
        }):
        Promise< HydratedDocument<TDocument> | null>{
        return this._model.findOneAndUpdate(filter,update,{new:true,...options})
    }

    async findOneAndDelete ({
        filter,
        options
    }:
        {
            filter: QueryFilter<TDocument>,
            options?: QueryOptions<TDocument>
        }):
        Promise< HydratedDocument<TDocument>[] | null>{
        return this._model.findOneAndDelete(filter,{new:true,...options})
    }

    async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
        return this._model.aggregate(pipeline)
    }

    async deleteOne ({filter}: {filter: QueryFilter<TDocument>}):Promise<any>{
        return this._model.deleteOne(filter)
    }

    
    async deleteMany ({filter}: {filter: QueryFilter<TDocument>}):Promise<any>{
        return this._model.deleteMany(filter)
    }
    
    async updateOne ({filter,update,options={}}: {filter: QueryFilter<TDocument>,update: UpdateQuery<TDocument>,options?:  MongooseUpdateQueryOptions<TDocument> & any}):Promise<any>{
        return this._model.updateOne(filter,update,options)
    } 
    
    async updateMany ({filter,update,options={}}: {filter: QueryFilter<TDocument>,update: UpdateQuery<TDocument>,options?: MongooseUpdateQueryOptions<TDocument> & any}):Promise<any>{
        return this._model.updateMany(filter,update,options)
    }
    
}

export default BaseRepository