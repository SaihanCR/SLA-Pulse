import companiesRepository from "../repositories/companies.repository.js";

class CompaniesService {


  //logica de company_code
  generateCompanyCode(companyName) {
    // Genera el código de la compañía basado en el nombre

    const words = companyName.trim().toUpperCase().split(" ");

    let prefix = "";

    if (words.length >= 2) {
      // Primera letra de las dos primeras palabras
      prefix = words[0][0] + words[1][0];
    } else {
      const word = words[0];

      if (word.length >= 2) {
        prefix = word.substring(0, 2);
      } else {
        prefix = word[0];
      }
    }

    // Genera número random de 6 dígitos
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return `${prefix}${randomNumber}`;
  }

  //
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

    // Normaliza a MAYÚSCULA
    companyData.company_name = companyData.company_name.toUpperCase();

    // Genera automáticamente el company_code
    companyData.company_code = this.generateCompanyCode(companyData.company_name);

    return await companiesRepository.create(companyData);
  }

  async updateCompany(companyId, companyData) {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    if (!companyData) {
      throw new Error("Company data is required");
    }

    // Si viene el nombre, lo normaliza
    if (companyData.company_name) {
      companyData.company_name = companyData.company_name.toUpperCase();
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