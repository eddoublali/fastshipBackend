const express=require("express");
const Joi = require("joi");
const { types, boolean } = require("joi");
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email: {
      type:String,
      required:true,
      trim:true,
      minlength:5,
      maxlength:100,
      unique:true
    },
    username: {
      type:String,
      required:true,
      trim:true,
      minlength:2,
      maxlength:200,
    },
    password:  {
      type:String,
      required:true,
      trim:true,

    },
    isAdmin:{
      type:Boolean,
      default:false
    }
  },{timestamps:true});
  
  // Create a model from the schema
  const User = mongoose.model('User', UserSchema);
    //validateRegisterUser
  const validateRegisterUser = (obj) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(100).required(), // User's name
      username: Joi.string().min(2).max(200).required(), // User's name
      password: Joi.string().min(6).required(), // User's name
      });
      return schema.validate(obj)
    }
    //validateloginUser
  const validateLoginUser = (obj) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(100).required(), // User's name
      password: Joi.string().min(6).required(), // User's name
      });
      return schema.validate(obj)
    }
      //validateUpgdatUser
      const validateUpdateUser = (obj) => {
        const schema = Joi.object({
          email: Joi.string().min(5).max(100), // User's name
          username: Joi.string().min(2).max(200), // User's name
          password: Joi.string().min(6)// User's name
          });
          return schema.validate(obj)
        }
  module.exports = {
    User,
    validateRegisterUser,
    validateUpdateUser,
    validateLoginUser

  };