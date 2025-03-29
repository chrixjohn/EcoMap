const mongoose = require("mongoose");

const occurrenceSchema = new mongoose.Schema(
  {
    spotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },
    speciesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Species",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      default: null,
    },
  },
  { timestamps: true }
);

const Occurrence = mongoose.model("Occurrence", occurrenceSchema);
module.exports = Occurrence;
occurrenceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const occurrence = await this.model.findOne(this.getQuery());
    if (occurrence) {
      // Update status of related upload
      await mongoose.model("Upload").updateOne(
        { _id: occurrence.spotId },
        { $set: { status: "archived" } } // Change 'archived' to your desired status
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});
