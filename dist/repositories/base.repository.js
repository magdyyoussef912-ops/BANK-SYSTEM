"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    _model;
    constructor(_model) {
        this._model = _model;
    }
    async create(data) {
        return this._model.create(data);
    }
    async findById(id) {
        return this._model.findById(id);
    }
    async findOne({ filter, projection }) {
        return this._model.findOne(filter, projection);
    }
    async find({ filter, projection, options }) {
        return this._model.find(filter, projection)
            .sort(options?.sort)
            .skip(options?.skip)
            .limit(options?.limit)
            .populate(options?.populate);
    }
    async findByIdAndUpdate({ id, update, options }) {
        return this._model.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    async findOneAndUpdate({ filter, update, options }) {
        return this._model.findOneAndUpdate(filter, update, { new: true, ...options });
    }
    async findOneAndDelete({ filter, options }) {
        return this._model.findOneAndDelete(filter, { new: true, ...options });
    }
    async aggregate(pipeline) {
        return this._model.aggregate(pipeline);
    }
    async deleteOne({ filter }) {
        return this._model.deleteOne(filter);
    }
    async deleteMany({ filter }) {
        return this._model.deleteMany(filter);
    }
    async updateOne({ filter, update, options = {} }) {
        return this._model.updateOne(filter, update, options);
    }
    async updateMany({ filter, update, options = {} }) {
        return this._model.updateMany(filter, update, options);
    }
}
exports.default = BaseRepository;
