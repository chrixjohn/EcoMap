const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expertSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic: {
    type: String,
    default:
      "https://www.iihm.ac.in/wp-content/uploads/2019/01/Mubeena-768x768.jpg",
  },
});

expertSchema.pre("findOneAndDelete", async function (next) {
  try {
    const expert = await this.model.findOne(this.getQuery());
    if (expert) {
      const occurrences = await mongoose
        .model("Occurrence")
        .find({ expertId: expert._id });

      const spotIds = occurrences.map((occurrence) => occurrence.spotId);

      await mongoose
        .model("Upload")
        .updateMany(
          { _id: { $in: spotIds } },
          { $set: { status: "archived" } }
        );

      await mongoose.model("Occurrence").deleteMany({ expertId: expert._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Expert = mongoose.model("Expert", expertSchema);
module.exports = Expert;
