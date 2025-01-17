const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        daysOfWeek: {
            type: Map,
            of: String,
            required: false
        },
        timeframeNote: {
            type: String,
            required: false
        },
        priority: {
            type: Number,
            required: false
        },
        content: {
            type: String,
            required: true
        },
    },
    { timestamps: true },
);



/*const Admin = new Schema(
    {
    
    }
)*/
const Image = new Schema(
    {
        patiend_Id:{
            type: String,
            require: true

        },
        exam_Id:{
            type: String,
            require: true

        },
        png_filename:{
            type: String,
            require: true

        },
        key_findings:{
            type: String,
            require: true

        },
    },
    {timestamps: true},
    
);

module.exports = mongoose.model('item', Item);
module.exports = mongoose.model('image', Image);
