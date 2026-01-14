import Manager from "./manager.model.js";

class ManagerDAO {
  async create(payload) {
    return Manager.create(payload);
  }

  async fetchByEmail(email: string) {
    return Manager.findOne({ email });
  }

  async delete(id) {
    return Manager.findByIdAndDelete(id);
  }
}

export default new ManagerDAO();
