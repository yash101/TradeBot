const mongoose = require('mongoose');

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
    let conf = await this.findOne({
        key: key
    });

    if (!conf) {
        let ins = {
            key: key,
            value: def_value
        };

        this.insertOne(ins);

        return ins;
    }

    return conf;
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

module.exports = Configuration;
