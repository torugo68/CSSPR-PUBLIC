const mysql = require('mysql2');
const fs = require('fs');

const departments = [
    { name: 'ATJ - Assessoria Técnica do Juridica' },
    { name: 'CCP - Câmara de Conciliação de Precatórios' },
    { name: 'CAF - Coordenadoria de Assuntos Fiscais' },
    { name: 'CEJ - Coordenadoria de Estudos Jurídicos' },
    { name: 'CGTI - Coordenadoria de Gestão Estratégica e Tecnologia da Informação' },
    { name: 'CRR - Coordenadoria de Recursos' },
    { name: 'CCON - Coordenadoria do Consultivo' },
    { name: 'CPAS - Coordenadoria do Passivo' },
    { name: 'CJUD- Coordenadoria Judicial' },
    { name:  'DG - Diretoria Geral' },
    { name:  'GP - Gabinete da Procuradora-Geral do Estado' },
    { name:  'NAS - Núcleo Administrativo Setorial' },
    { name:  'NCS - Núcleo de Comunicação Social' },
    { name:  'NII - Núcleo de Informática e Informações' },
    { name:  'NICS - Núcleo de Integridade e Compliance Setorial' },
    { name:  'NPS - Núcleo de Planejamento Setorial' },
    { name:  'NRHS - Núcleo de Recursos Humanos Setorial' },
    { name:  'NFS - Núcleo Fazendário Setorial' },
    { name:  'PRA - Procuradoria Administrativa' },
    { name:  'PAM - Procuradoria Ambiental' },
    { name:  'PRC - Procuradoria Consultiva de Aquisições e Serviços' },
    { name:  'PCP - Procuradoria Consultiva de Concessões, Convênios e Parcerias' },
    { name:  'PCO - Procuradoria Consultiva de Obras e Serviços de Engenharia' },
    { name:  'PCRH - Procuradoria Consultiva de Recursos Humanos' },
    { name:  'PCG - Procuradoria Consultiva junto à Governadoria' },
    { name:  'PDA - Procuradoria da Dívida Ativa' },
    { name:  'PAC - Procuradoria de Ações Coletivas' },
    { name:  'PRE - Procuradoria de Execuções, Precatórios e Cálculos' },
    { name:  'PHG - Procuradoria de Honorários da Gratuidade da Justiça' },
    { name:  'PRS - Procuradoria de Saúde' },
    { name:  'PSU - Procuradoria de Sucessões' },
    { name:  'PCF - Procuradoria do Contencioso Fiscal' },
    { name:  'PRP - Procuradoria do Patrimônio' },
    { name:  'PRF - Procuradoria Funcional' },
    { name:  'PPF - Procuradoria Previdenciária Funcional' },
    { name:  'BSB - Procuradoria Brasília' },
    { name:  'APU- Procuradoria Regional de Apucarana' },
    { name:  'CMOU - Procuradoria Regional de Campo Mourão' },
    { name:  'CSC - Procuradoria Regional de Cascavel' },
    { name:  'CPC - Procuradoria Regional de Cornélio Procópio' },
    { name:  'FOZ - Procuradoria Regional de Foz do Iguaçu' },
    { name:  'FBEL - Procuradoria Regional de Francisco Beltrão' },
    { name:  'GRP - Procuradoria Regional de Guarapuava' },
    { name:  'JAC - Procuradoria Regional de Jacarezinho' },
    { name:  'LON - Procuradoria Regional de Londrina' },
    { name:  'MGA - Procuradoria Regional de Maringá' },
    { name:  'PNV - Procuradoria Regional de Paranavaí' },
    { name:  'PBC - Procuradoria Regional de Pato Branco' },
    { name:  'PGO - Procuradoria Regional de Ponta Grossa' },
    { name:  'UMU - Procuradoria Regional de Umuarama' },
    { name:  'UVA - Procuradoria Regional de União da Vitória' },
    { name:  'PRT - Procuradoria Trabalhista' },
    { name:  'SEC - Secretaria' },
    { name:  'EXT - Externo' },
    { name:  'CG - Corregedoria-Geral' },
    { name:  'PRC - Procuradoria Consultiva' },
    { name:  'ADV - Consultivo Autarquias' },
    { name: 'Padrão'}
  ];

  const roles = [
    { name: 'Servidor' },
    { name: 'Servidor(Comissão)' },
    { name: 'Procurador' },
    { name: 'Terceirizado' },
    { name: 'Advogado' },
    { name: 'Estagiário' },
    { name: 'Padrão'}
  ];

  const systems = [
    { name: 'Copel' },
    { name: 'Sipro' },
    { name: 'Detran' },
    { name: 'SFEPGE' },
    { name: 'PROAJU' },
    { name: 'INDSEC' },
    { name: 'e-Protocolo' },
    { name: 'Intranet(adm)' },
    { name: 'Internet(adm)' },
    { name: 'Terminal Celepar' },
    { name: 'Ofício Eletrônico/Arisp' },
  ]

let newUsers = []
let newPermissions = []

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }

    console.log('Connected to MySQL!');

    connection.query('SELECT * from controlesistema.usuarios', (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return;
        }

        for (let i=0; i < results.length; i++) {
            const dateString = results[i].data_create;
            const date = new Date(dateString);
            const timestamp = date.getTime();

            const newUser = {
                id: results[i].id,
                name: results[i].nome,
                email: results[i].email,
                roleId: roles.findIndex(role => role.name === results[i].grupo) + 1,
                departmentId: departments.findIndex(setor => setor.name === results[i].setor) + 1,
                createAt: timestamp 
        };  
        newUsers.push(newUser)
    }

    connection.query ('SELECT * FROM controlesistema.permissoes', (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return;
        }

        for (let i=0; i < results.length; i++) {
            if (results[i].permissao === 1) {
                const newPermission = {
                    userId: results[i].id_usuario,
                    systemId: systems.findIndex(system => system.name === results[i].sistemas) + 1,
                }
                newPermissions.push(newPermission)
            }
        }
        const permissionsData = JSON.stringify(newPermissions, null, 2);
        fs.writeFileSync('prisma/permissions.json', permissionsData, 'utf8');
    })
    const usersData = JSON.stringify(newUsers, null, 2);
    fs.writeFileSync('prisma/users.json', usersData, 'utf8');

    console.log('Users have been exported to users.json');
    console.log('Permissions have been exported to permissions.json');
    connection.release();

    pool.end((err) => {
        if (err) {
            console.error('Error closing the pool:', err);
        } else {
            console.log('Pool closed.');
        }
    });
    })

});
