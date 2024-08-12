import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  const sid = [
    { name: 'TCC' },
    { name: 'TUR' },
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
  const users = [
    {
      name: 'Victor Marques',
      email: 'victor.marques@pge.pr.gov.br',
      roleId: 1,
      departmentId: 56
    },
    {
      name: 'Paulo Gomes',
      email: 'paulo-gomes@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Maria Silva',
      email: 'maria-silva@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'João Souza',
      email: 'joao-souza@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Ana Oliveira',
      email: 'ana-oliveira@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Carlos Lima',
      email: 'carlos-lima@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Fernanda Costa',
      email: 'fernanda-costa@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Ricardo Pereira',
      email: 'ricardo-pereira@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Juliana Santos',
      email: 'juliana-santos@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Roberto Almeida',
      email: 'roberto-almeida@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    },
    {
      name: 'Patricia Rodrigues',
      email: 'patricia-rodrigues@pge.pr.gov.br',
      roleId: Math.floor(Math.random() * 7) + 1,
      departmentId: Math.floor(Math.random() * 55) + 1
    }
  ]

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

  for (const item of users) {
    await prisma.user.create({
      data: item,
    });
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

// 6. Run Seed Script
// npx ts-node seed.ts