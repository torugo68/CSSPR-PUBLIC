import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const usersFilePath = path.join(__dirname, 'users.json');
const permissionsFilePath = path.join(__dirname, 'permissions.json');
const sidsFilePath = path.join(__dirname, 'sids.json');
const LogsFilePath = path.join(__dirname, 'logs.json');
const DisabledFilePath = path.join(__dirname, 'disabled-users.json');
const DisabledPermissionsFilePath = path.join(__dirname, 'disabled-permissions.json');
const DisabledSidsFilePath = path.join(__dirname, 'disabled-sids.json');

if (!fs.existsSync(usersFilePath)) {
  console.error(`File not found: ${usersFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(permissionsFilePath)) {
  console.error(`File not found: ${permissionsFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(sidsFilePath)) {
  console.error(`File not found: ${sidsFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(LogsFilePath)) {
  console.error(`File not found: ${LogsFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(DisabledFilePath)) {
  console.error(`File not found: ${DisabledFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(DisabledPermissionsFilePath)) {
  console.error(`File not found: ${DisabledPermissionsFilePath}`);
  process.exit(1);
}
if (!fs.existsSync(DisabledSidsFilePath)) {
  console.error(`File not found: ${DisabledSidsFilePath}`);
  process.exit(1);
}

const newUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
const newPermissions = JSON.parse(fs.readFileSync(permissionsFilePath, 'utf8'));
const newSids = JSON.parse(fs.readFileSync(sidsFilePath, 'utf8'));
const newLogs = JSON.parse(fs.readFileSync(LogsFilePath, 'utf8'));
const newDisableds = JSON.parse(fs.readFileSync(DisabledFilePath, 'utf8'));
const newDisabledsPermissions = JSON.parse(fs.readFileSync(DisabledPermissionsFilePath, 'utf8'));
const newDisabledsSids = JSON.parse(fs.readFileSync(DisabledSidsFilePath, 'utf8'));

async function main() {
  const operations = [
    { name: "Criado" },
    { name: "Excluído" },
    { name: "Termos Atualizados" },
    { name: "Atualização de Permissões" },
    { name: "SID Atualizado" },
    { name: "Usuario Atualizado" },
    { name: "Setor criado" },
    { name: "Grupo criado" },
    { name: "Setor Atualizado" },
    { name: "Grupo Atualizado" },
  ]
  
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
    { name: 'Padrão'},
    { name: 'Externo'}
  ];
  
  const sid = [
    { name: 'TUR' },
    { name: 'TCC' },
    { name: 'Wi-Fi' },
    { name: 'VPN' },
  ]
  
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

// dev mode
const admins = [
  {
    username: 'admin',
    password: '$2b$10$a.M4qOUAJbyV40mCJs6uKO2EofDcMu7fsK2th92aDD/aARf4aRMwC',
  }
]

// DISCLAIMER: This is a simple seed script to populate the database with some initial data. Not related to real world data.

for (const item of roles) {
  await prisma.role.create({
    data: item,
  });
}

for (const item of departments) {
  await prisma.department.create({
    data: item,
  });
}
for (const item of sid) {
  await prisma.sid.create({
    data: item,
  });
}
for (const item of systems) {
  await prisma.system.create({
    data: item,
  });
}
for (const item of admins) {
  await prisma.admin.create({
    data: item,
  });
}
for (const item of operations) {
  await prisma.operationsTypes.create({
    data: item,
  });
}
 try {
    for (let i=0; i < newUsers.length; i++) {
        try {
          await prisma.user.create({
            data: {
              id: newUsers[i].id,
              name: newUsers[i].name,
              email: newUsers[i].email,
              roleId: newUsers[i].roleId,
              departmentId: newUsers[i].departmentId,
              createdAt: newUsers[i].createdAt,
            },
          });
        } catch (error) {
          console.error(`EMAIL JA EXISTE!!! ${newUsers[i].email}`);
        }
    }
    console.log("Usuarios criados, total: ", newUsers.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newPermissions.length; i++) {
        try {
          await prisma.permission.create({
            data: {
              userId: newPermissions[i].userId,
              systemId: newPermissions[i].systemId,
            },
          });
        } catch (error) {
          console.error(`ERRO NA PERMISSIAO!!!`);
          console.log(newPermissions[i])
        }
    }
    console.log("Permissoes criadas, total: ", newPermissions.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newSids.length; i++) {
        try {
          const newSid = {
            userId: newSids[i].userId,
            sidId: newSids[i].sidId,
            value: newSids[i].value
          };
        
          // Check if userId exists
          const userExists = await prisma.user.findUnique({
            where: { id: newSid.userId }
          });
        
          if (!userExists) {
            throw new Error(`User with ID ${newSid.userId} does not exist.`);
          }
        
          const sidExists = await prisma.sid.findUnique({
            where: { id: newSid.sidId }
          });
        
          if (!sidExists) {
            throw new Error(`SID with ID ${newSid.sidId} does not exist.`);
          }
        
          await prisma.userSids.create({
            data: newSid,
          });
        } catch (error) {
          console.error(`ERRO NO SID!!! ${newSids[i]} || ${newSids[i].value} || ${newSids[i].userId} || ${newSids[i].userId} || ${error}`);
        }
    }
    console.log("Sids criados, total: ", newSids.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newLogs.length; i++) {
        try {
          const newLog = {
            name: newLogs[i].name,
            email: newLogs[i].email,
            operation: newLogs[i].operationType,
            role: newLogs[i].role,
            adminName: newLogs[i].admin,
            createdAt: new Date(newLogs[i].date),
          };
        
          await prisma.logs.create({
            data: newLog,
          });
        } catch (error) {
          console.error(`ERRO NO Log!!! ${newLogs[i]}`);
          console.error(error);
        }
    }
    console.log("logs criados, total: ", newLogs.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newDisableds.length; i++) {
        try {
          const newUser = {
            name: newDisableds[i].name,
            email: newDisableds[i].email,
            roleId: newDisableds[i].roleId,
            departmentId: newDisableds[i].departmentId,
            deletedAt: new Date(newDisableds[i].deleteAt),
          };
          const oldUser = await prisma.user.findUnique({
            where: { email: newDisableds[i].email }
          });
          if (!oldUser){
            await prisma.user.create({
              data: newUser,
            });
            console.log("CRIADO DESATIVADO ")
          } else {
            console.log("Desativado já existe:")
            console.error(newLogs[i]);
            console.log("OLD: ")
            console.error(oldUser);
          }
        } catch (error) {
          console.error(error);
        }
    }
    console.log("Desativados criados, total: ", newDisableds.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newDisabledsPermissions.length; i++) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: newDisabledsPermissions[i].user.email }
          });

          if (user) {
              if (newDisabledsPermissions[i].systemId) {
                  await prisma.permission.create({
                      data: {
                          userId: user.id,
                          systemId: newDisabledsPermissions[i].systemId,
                      },
                  });
              }
          } else {
            console.log(`User with email ${newDisabledsPermissions[i].email} not found.`);
          }
        } catch (error) {
          console.error(error);
        }
    }
    console.log("Permissoes dos Desativados criados, total: ", newDisabledsPermissions.length);
  } catch (error) {
    console.error(error);
  }

  try {
    for (let i=0; i < newDisabledsSids.length; i++) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: newDisabledsSids[i].user.email }
          });

          if (user) {
              if (newDisabledsSids[i].sidId) {
                  await prisma.userSids.create({
                      data: {
                          userId: user.id,
                          sidId: newDisabledsSids[i].sidId,
                          value: newDisabledsSids[i].value,
                      },
                  });
                  console.log("SID DESATIVADO CRIADO", user.id, newDisabledsSids[i].sidId, newDisabledsSids[i].value)
              }
              else {
                console.log("SID DESATIVADO NAO CRIADO", user.id, newDisabledsSids[i].sidId, newDisabledsSids[i].value)
              }
          } else {
            console.log(`User with email ${newDisabledsSids[i].email} ${newDisabledsSids[i].sidId} not found.`);
          }
        } catch (error) {
          console.error("SID JA EXISTE!!!");
          console.error(error);
        }
    }
  } catch (error) {
    console.error(error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Run Seed Script
// npx ts-node seed.ts