const Upload = require("../../models/uploadModel");
const Occurrence = require("../../models/occurenceModel");
async function getUpload(req, res) {
  try {
    const data = await Upload.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data", err });
  }
}

async function getlistUpload(req, res) {
  try {
    const { page = 1, limit = 25 } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 25;
    const maxLimit = 25;
    const finalLimit = parsedLimit > maxLimit ? maxLimit : parsedLimit;

    const totalItems = await Upload.countDocuments({ status: "waiting" });
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

    const uploads = await Upload.find({ status: "waiting" })
      .sort({ date: -1 })
      .skip((parsedPage - 1) * finalLimit)
      .limit(finalLimit)
      .exec();

    res.status(200).json({
      page: parsedPage,
      limit: finalLimit,
      totalItems,
      totalPages,
      data: uploads,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error retrieving upload details",
      error,
    });
  }
}

async function getUploadById(req, res) {
  const { id } = req.params;

  try {
    const upload = await Upload.findById(id).populate("user", "name email");

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    res.json(upload);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving upload details",
      error,
    });
  }
}

async function saveUpload(req, res) {
  const { spotId, speciesId, userId } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const newOccurrence = new Occurrence({
      spotId,

      speciesId,

      userId,

      expertId: user.id,
    });

    await newOccurrence.save();
    await Upload.findByIdAndUpdate(spotId, { status: "approved" });
    res.status(201).json({
      message: "Spotting saved successfully to Occurrence ",
      occurrence: newOccurrence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving Spotting to Occurrence",
      error,
    });
  }
}

async function rejectUpload(req, res) {
  const { spotId } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    await Upload.findByIdAndUpdate(spotId, { status: "declined" });
    res.status(201).json({ message: "Upload rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving occurrence", error });
  }
}

module.exports = {
  getUpload,
  getlistUpload,
  getUploadById,
  saveUpload,
  rejectUpload,
};
