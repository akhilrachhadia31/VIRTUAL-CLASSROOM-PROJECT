import mongoose,{Schema} from "mongoose";   

const lessonSchema = new Schema({
    title: {
        type: String, 
        required : true
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    reference: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Resource'
    }],
    
},{timestamps:true});

export const Lesson = mongoose.model('Lesson', lessonSchema);

