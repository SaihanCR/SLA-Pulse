import BaseRepository from './baseRepository.js';

class CompaniesRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla companies
    super('companies', 'company_id');
  }
}

export default new CompaniesRepository();