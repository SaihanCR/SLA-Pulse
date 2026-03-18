import companiesRepository from '../../repositories/companies.repository.js';
import rolesRepository from '../../repositories/roles.repository.js';
import departmentsRepository from '../../repositories/departments.repository.js';
import usersRepository from '../../repositories/users.repository.js';
import prioritiesRepository from '../../repositories/priorities.repository.js';
import slasRepository from '../../repositories/slas.repository.js';
import ticketStatusesRepository from '../../repositories/ticketStatuses.repository.js';
import ticketsRepository from '../../repositories/tickets.repository.js';
import ticketTrackingRepository from '../../repositories/ticketTracking.repository.js';
import alertsRepository from '../../repositories/alerts.repository.js';

async function testRepositoriesData() {
  const repositories = [
    { name: 'companies', repo: companiesRepository },
    { name: 'roles', repo: rolesRepository },
    { name: 'departments', repo: departmentsRepository },
    { name: 'users', repo: usersRepository },
    { name: 'priorities', repo: prioritiesRepository },
    { name: 'slas', repo: slasRepository },
    { name: 'ticket_statuses', repo: ticketStatusesRepository },
    { name: 'tickets', repo: ticketsRepository },
    { name: 'ticket_tracking', repo: ticketTrackingRepository },
    { name: 'alerts', repo: alertsRepository }
  ];

  for (const item of repositories) {
    try {
      const data = await item.repo.getAll();

      console.log(`Tabla: ${item.name} | OK | registros: ${data.length}`);
      console.log(data);
      console.log('--------------------------------------------------\n\n');
    } catch (error) {
      console.log(`Tabla: ${item.name} | ERROR`);
      console.error(error.message);
      console.log('--------------------------------------------------');
    }
  }
}

testRepositoriesData();
// run =  npm run test:data