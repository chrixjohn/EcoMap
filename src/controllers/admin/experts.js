const Expert = require("../../models/expertModel");
const bcrypt = require("bcrypt");

async function getExperts(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const experts = await Expert.find().select("name email");
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experts", error });
  }
}

async function updateExpert(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const updates = {};

    if (name) {
      updates.name = name;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }
      updates.email = email;
    }

    if (password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and include at least one letter and one number.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedExpert = await Expert.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json(updatedExpert);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
}

async function deleteExpert(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const deletedExpert = await Expert.findByIdAndDelete(id);

    if (!deletedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json({ message: "Expert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}

module.exports = { getExperts, updateExpert, deleteExpert };
