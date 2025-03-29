const Occurrence = require("../../models/occurenceModel");
const Upload = require("../../models/uploadModel");
const Species = require("../../models/speciesModel");

async function getOccurrencesOfExpert(req, res) {
  const user = req.user; // Retrieved from middleware
  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const occurrences = await Occurrence.find({
      expertId: user.id,
    }).populate("spotId speciesId expertId userId");

    if (occurrences.length === 0) {
      return res
        .status(404)
        .json({ message: "No occurrences found for this user" });
    }

    res.status(200).json(occurrences);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving occurrences",
      error,
    });
  }
}

async function getOccurrenceById(req, res) {
  const { id } = req.params;

  try {
    const occurrence = await Occurrence.findById(id)
      .populate("spotId")
      .populate("speciesId")
      .populate("userId", "name email")
      .populate("expertId", "name email");

    if (!occurrence) {
      return res.status(404).json({ message: "Occurrence not found" });
    }
    res.json(occurrence);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving occurrence details",
      error,
    });
  }
}

async function getOccurrence(req, res) {
  try {
    const {
      searchTerm,
      startDate,
      endDate,
      sortBy,
      page = 1,
      limit = 25,
    } = req.query;

    // Convert page & limit to integers and enforce a max limit
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 25;
    const maxLimit = 25;
    const finalLimit = parsedLimit > maxLimit ? maxLimit : parsedLimit;

    const query = {};

    // Apply date filters
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (searchTerm) {
      query.speciesId = {
        $in: await Species.find({
          common_name: { $regex: searchTerm, $options: "i" },
        }).distinct("_id"),
      };
    }

    // Sorting logic
    const sortOption = {};
    if (sortBy === "recent") {
      sortOption.createdAt = -1;
    } else if (sortBy === "oldest") {
      sortOption.createdAt = 1;
    }

    // Fetch total count before applying pagination
    const totalItems = await Occurrence.countDocuments(query);
    console.log(totalItems);
    const totalPages = Math.ceil(totalItems / finalLimit);

    if (parsedPage > totalPages && totalPages !== 0) {
      return res.status(500).json({
        page: parsedPage,
        limit: finalLimit,
        totalItems,
        totalPages,
        message: "Page number exceeds total pages available.",
      });
    }

    // Fetch paginated occurrences
    const occurrences = await Occurrence.find(query)
      .populate({
        path: "spotId",
        select: "image",
      })
      .populate({
        path: "speciesId",
        select: "common_name",
      })
      .sort(sortOption)
      .skip((parsedPage - 1) * finalLimit)
      .limit(finalLimit)
      .exec();

    // Filter out occurrences where speciesId is null
    const filteredOccurrences = occurrences.filter((o) => o.speciesId !== null);

    // If no matching occurrences are found
    if (filteredOccurrences.length === 0) {
      return res.status(200).json({
        message: "No occurrences found matching the criteria.",
      });
    }

    // Return response with pagination info
    res.status(200).json({
      page: parsedPage,
      limit: finalLimit,
      totalItems: totalItems,
      totalPages: totalPages,
      data: filteredOccurrences,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error retrieving occurrence details",
      error,
    });
  }
}

async function updateOccurrence(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const updatedOccurrence = await Occurrence.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedOccurrence) {
      return res.status(404).json({ message: "Occurrence not found" });
    }
    res.status(200).json(updatedOccurrence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete occurrence
async function deleteOccurrence(req, res) {
  try {
    const { id } = req.params;
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const deletedOccurrence = await Occurrence.findByIdAndDelete(id);
    if (!deletedOccurrence) {
      return res.status(404).json({ message: "Occurrence not found" });
    }
    res.status(200).json({ message: "Occurrence deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getOccurrencesOfExpert,
  getOccurrenceById,
  getOccurrence,
  updateOccurrence,
  deleteOccurrence,
};
