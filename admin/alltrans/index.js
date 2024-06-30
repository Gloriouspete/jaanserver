const { AllTran } = require("../../services/worker.js");
async function Alltrans(req, res) {
  try {
    const result = await AllTran();
    if (result) {
      return res.status(200).json({
        success: true,
        message: "This Admin not found",
        data: result,
      });
    }
    else {
      return res.status(200).json({
        success: false,
        message: "This Admin not found",
        data: null,
      });
    }
  } catch (error) {
    console.log("error is here");
  }
}

module.exports = Alltrans;