const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const speciesSchema = new mongoose.Schema({
  common_name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  taxonomy_class: { type: String, default: null },
  conservation_status: { type: String, default: null },
  image: { type: String, required: true },
});

speciesSchema.pre("findOneAndDelete", async function (next) {
  try {
    const species = await this.model.findOne(this.getQuery());
    if (species) {
      // Find related occurrences
      const occurrences = await mongoose
        .model("Occurrence")
        .find({ speciesId: species._id });

      // Extract spotIds from occurrences
      const spotIds = occurrences.map((occurrence) => occurrence.spotId);

      // Update status of related uploads using spotIds
      await mongoose
        .model("Upload")
        .updateMany(
          { _id: { $in: spotIds } },
          { $set: { status: "archived" } }
        );

      // Delete related occurrences
      await mongoose.model("Occurrence").deleteMany({ speciesId: species._id });

      // Delete the image from Cloudinary
      // if (species.image) {
      //   console.log("Image found");
      //   const publicId = 'species/' + species.image.split('/species/')[1].split('.')[0];
      //   console.log(publicId);
      //   await cloudinary.uploader.destroy(publicId);
      //   console.log("Image deleted");
      //   species.image = null;
      //   await species.save();
      //   console.log("Image null from species");
      // }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Species = mongoose.model("Species", speciesSchema);
module.exports = Species;
