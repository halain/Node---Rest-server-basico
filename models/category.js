    
const { Schema, model} =require('mongoose');

const CategorySchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


CategorySchema.methods.toJSON = function() {
    const { __v, estado, ...category} = this.toObject();
    return category;
}


module.exports = model('Category', CategorySchema);

