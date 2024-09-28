const mongoose=require('mongoose')

const roleSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        enum: ['Manager', 'Client', 'Livreur'],
        unique: true

    }
})

module.exports=mongoose.model('Role',roleSchema)