import mongoose from 'mongoose';

const configSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        value: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

configSchema.statics.get = async function(key, def_value) {
    let user = await this.findOne({
        key: key
    });

    if (!user) {
        this.insertOne(def_value);
        return def_value;
    }
};

configSchema.statics.update = async function(key, value) {
    await this.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        _ => {}
    )
};

const Configuration = mongoose.model('Configuration', configSchema);

export default Configuration;
