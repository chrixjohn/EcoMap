const User = require('../../models/userModel');
async function getUsers (req, res)  {
    try {
      // Fetch experts and select only the 'name' and 'email' fields

      const users = await User.find().select('name email'); // Only return name and email
      res.status(200).json(users); // Send the experts as a JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching experts', error });
    }
  };

  module.exports = {getUsers}