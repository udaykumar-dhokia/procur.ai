import Vendor from "./vendor.model.js";

class VendorDAO {
  async findAll() {
    return Vendor.find({});
  }

  async create(payload) {
    return Vendor.create(payload);
  }

  async findByEmail(email: string) {
    return Vendor.findOne({ email });
  }

  async delete(id) {
    return Vendor.findByIdAndDelete(id);
  }
}

export default new VendorDAO();
