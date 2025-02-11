const Species = require("../../models/speciesModel");
async function getSpecies(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized." });
        }
        const species = await Species.find();
        res.status(200).json(species);
    } catch (error) {
        res.status(500).json({ message: "Error fetching species", error });
    }
}

module.exports = { getSpecies };
