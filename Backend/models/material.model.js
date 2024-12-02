import mongoose,{Schema} from "mongoose";

const materialSchema = new Schema({
    title: {
        type: String, 
        required : true
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    description: {
        type: String,
        required : true
    },
    file: {
        type: String, 
        required: true
    },
},{timestamps:true});

export const Material = mongoose.model('Material',materialSchema);