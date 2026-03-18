import companiesRepository from "../repositories/companies.repository.js";

class CompaniesService {

  async getAllCompanies(options = {}) {
    return await companiesRepository.getAll(options);
  }

  async getCompanyById(companyId) {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    return await companiesRepository.getById(companyId);
  }

  async createCompany(companyData) {
    if (!companyData) {
      throw new Error("Company data is required");
    }

    if (!companyData.company_name) {
      throw new Error("Company name is required");
    }

    if (!companyData.company_code) {
      throw new Error("Company code is required");
    }

    return await companiesRepository.create(companyData);
  }

  async updateCompany(companyId, companyData) {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    if (!companyData) {
      throw new Error("Company data is required");
    }

    return await companiesRepository.update(companyId, companyData);
  }

  async deleteCompany(companyId) {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    return await companiesRepository.delete(companyId);
  }
}

export default new CompaniesService();