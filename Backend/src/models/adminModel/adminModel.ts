import mongoose,{Document} from "mongoose";

export interface IAdmin extends Document{
    id:string;
    email:string;
    role:string;
    password:string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
    email: {
        type :String,
        required:true
    },
    role:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        required:true
    }
})

export const Admin = mongoose.model<IAdmin>('admin',adminSchema,'admin')