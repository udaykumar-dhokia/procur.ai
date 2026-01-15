import RFP from "./rfp.model.js";

class RFPDao {
  async create(payload) {
    return await RFP.create(payload);
  }

  async findById(rfpId) {
    return await RFP.findById(rfpId);
  }
}

export default new RFPDao();
