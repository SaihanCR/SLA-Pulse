import supabase from '../../config/supabase.js';

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


async function getTableStructure(tableName) {

  const { data, error } = await supabase.rpc('get_table_structure', {
    p_table_name: tableName
  });

  if (error) {
    throw new Error(`Error obteniendo estructura de ${tableName}`);
  }

  return data;
}


async function testRepositories() {

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

      console.log('\n======================================');
      console.log(`Tabla: ${item.name}`);

      const structure = await getTableStructure(item.name);

      console.log('\nEstructura:');

      structure.forEach(col => {
        console.log(`${col.column_name} | ${col.data_type}`);
      });

      const data = await item.repo.getAll();

      console.log(`\nDatos (${data.length} registros):`);
      console.log(data);

      console.log('======================================');

    } catch (error) {

      console.error(`Error en ${item.name}:`, error.message);

    }

  }

}

testRepositories();
// run = npm run test:data