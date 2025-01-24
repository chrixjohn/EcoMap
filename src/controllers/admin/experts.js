const Expert = require('../../models/expertModel');
async function getExperts (req, res)  {
    try {
      // Fetch experts and select only the 'name' and 'email' fields
      const user = req.user; // Retrieved from middleware
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      const experts = await Expert.find().select('name email'); // Only return name and email
      res.status(200).json(experts); // Send the experts as a JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching experts', error });
    }
  };

  module.exports = {getExperts}