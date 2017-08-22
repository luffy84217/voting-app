'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollSchema = new Schema({
    title: String,
    options: [{ name: String, votes: Number }],
    voter: [String]
});

pollSchema.set('versionKey', false);

module.exports = mongoose.model('Poll', pollSchema);