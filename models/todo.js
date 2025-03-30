import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    }
    
}, { timestamps: true }); 

const Tododb = mongoose.model("Tododb", TodoSchema);

export default Tododb;
