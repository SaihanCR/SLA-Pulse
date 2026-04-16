import ticketOptionsRepository from "../repositories/ticketOptions.repository.js";

const getTicketOptions = async () => {
  const [companies, departments, priorities, statuses, slas] =
    await Promise.all([
      ticketOptionsRepository.fetchCompanies(),
      ticketOptionsRepository.fetchDepartments(),
      ticketOptionsRepository.fetchPriorities(),
      ticketOptionsRepository.fetchStatuses(),
      ticketOptionsRepository.fetchSlas(),
    ]);

  return {
    companies,
    departments,
    priorities,
    statuses,
    slas,
  };
};

export default {
  getTicketOptions,
};