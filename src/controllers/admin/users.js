const User = require("../../models/userModel");
async function getUsers(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const users = await User.find({ status: "approved" }).select("name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}

async function pendingUsers(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const users = await User.find({ status: "pending" }).select("name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}

async function approveUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error approving user", error });
  }
}

async function rejectUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User rejected successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting user", error });
  }
}

async function updateUser(req, res) {
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

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}

module.exports = {
  getUsers,
  pendingUsers,
  approveUser,
  rejectUser,
  updateUser,
  deleteUser,
};
