const mongoose = require('mongoose');
const Role = require('../model/roleModel');
const connectDB = require('../db/dbconnect');

const initRoles = async () => {
  await connectDB();

  const roles = ['Manager', 'Client', 'Livreur'];

  for (let role of roles) {
    try {
      await Role.create({ name: role });
      console.log(`Created role: ${role}`);
    } catch (error) {
      if (error.code === 11000) {
        console.log(`Role already exists: ${role}`);
      } else {
        console.error(`Error creating role ${role}:`, error);
      }
    }
  }

  mongoose.connection.close();
};

initRoles();