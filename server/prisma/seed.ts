import {PrismaClient} from '@prisma/client';
import bcrypt from "bcrypt";
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const operations = [
        {name: "Criado"},
        {name: "Excluído"},
        {name: "Termos Atualizados"},
        {name: "Atualização de Permissões"},
        {name: "SID Atualizado"},
        {name: "Usuario Atualizado"},
        {name: "Setor criado"},
        {name: "Grupo criado"},
        {name: "Setor Atualizado"},
        {name: "Grupo Atualizado"},
        {name: "Restaurado"},
    ]

    const departments = [
        {name: 'ATJ - Assessoria Técnica do Juridica'},
        {name: 'CCP - Câmara de Conciliação de Precatórios'},
        {name: 'CAF - Coordenadoria de Assuntos Fiscais'},
        {name: 'CEJ - Coordenadoria de Estudos Jurídicos'},
        {name: 'CGTI - Coordenadoria de Gestão Estratégica e Tecnologia da Informação'},
        {name: 'CRR - Coordenadoria de Recursos'},
        {name: 'CCON - Coordenadoria do Consultivo'},
        {name: 'CPAS - Coordenadoria do Passivo'},
        {name: 'CJUD- Coordenadoria Judicial'},
        {name: 'DG - Diretoria Geral'},
        {name: 'GP - Gabinete da Procuradora-Geral do Estado'},
        {name: 'NAS - Núcleo Administrativo Setorial'},
        {name: 'NCS - Núcleo de Comunicação Social'},
        {name: 'NII - Núcleo de Informática e Informações'},
        {name: 'NICS - Núcleo de Integridade e Compliance Setorial'},
        {name: 'NPS - Núcleo de Planejamento Setorial'},
        {name: 'NRHS - Núcleo de Recursos Humanos Setorial'},
        {name: 'NFS - Núcleo Fazendário Setorial'},
        {name: 'PRA - Procuradoria Administrativa'},
        {name: 'PAM - Procuradoria Ambiental'},
        {name: 'PRC - Procuradoria Consultiva de Aquisições e Serviços'},
        {name: 'PCP - Procuradoria Consultiva de Concessões, Convênios e Parcerias'},
        {name: 'PCO - Procuradoria Consultiva de Obras e Serviços de Engenharia'},
        {name: 'PCRH - Procuradoria Consultiva de Recursos Humanos'},
        {name: 'PCG - Procuradoria Consultiva junto à Governadoria'},
        {name: 'PDA - Procuradoria da Dívida Ativa'},
        {name: 'PAC - Procuradoria de Ações Coletivas'},
        {name: 'PRE - Procuradoria de Execuções, Precatórios e Cálculos'},
        {name: 'PHG - Procuradoria de Honorários da Gratuidade da Justiça'},
        {name: 'PRS - Procuradoria de Saúde'},
        {name: 'PSU - Procuradoria de Sucessões'},
        {name: 'PCF - Procuradoria do Contencioso Fiscal'},
        {name: 'PRP - Procuradoria do Patrimônio'},
        {name: 'PRF - Procuradoria Funcional'},
        {name: 'PPF - Procuradoria Previdenciária Funcional'},
        {name: 'BSB - Procuradoria Brasília'},
        {name: 'APU- Procuradoria Regional de Apucarana'},
        {name: 'CMOU - Procuradoria Regional de Campo Mourão'},
        {name: 'CSC - Procuradoria Regional de Cascavel'},
        {name: 'CPC - Procuradoria Regional de Cornélio Procópio'},
        {name: 'FOZ - Procuradoria Regional de Foz do Iguaçu'},
        {name: 'FBEL - Procuradoria Regional de Francisco Beltrão'},
        {name: 'GRP - Procuradoria Regional de Guarapuava'},
        {name: 'JAC - Procuradoria Regional de Jacarezinho'},
        {name: 'LON - Procuradoria Regional de Londrina'},
        {name: 'MGA - Procuradoria Regional de Maringá'},
        {name: 'PNV - Procuradoria Regional de Paranavaí'},
        {name: 'PBC - Procuradoria Regional de Pato Branco'},
        {name: 'PGO - Procuradoria Regional de Ponta Grossa'},
        {name: 'UMU - Procuradoria Regional de Umuarama'},
        {name: 'UVA - Procuradoria Regional de União da Vitória'},
        {name: 'PRT - Procuradoria Trabalhista'},
        {name: 'SEC - Secretaria'},
        {name: 'EXT - Externo'},
        {name: 'CG - Corregedoria-Geral'},
        {name: 'PRC - Procuradoria Consultiva'},
        {name: 'ADV - Consultivo Autarquias'},
        {name: 'Padrão'}
    ];

    const roles = [
        {name: 'Servidor'},
        {name: 'Servidor(Comissão)'},
        {name: 'Procurador'},
        {name: 'Terceirizado'},
        {name: 'Advogado'},
        {name: 'Estagiário'},
        {name: 'Padrão'},
        {name: 'Externo'}
    ];

    const sid = [
        {name: 'TUR'},
        {name: 'TCC'},
        {name: 'Wi-Fi'},
        {name: 'VPN'},
    ]

    const systems = [
        {name: 'Copel'},
        {name: 'Sipro'},
        {name: 'Detran'},
        {name: 'SFEPGE'},
        {name: 'PROAJU'},
        {name: 'INDSEC'},
        {name: 'e-Protocolo'},
        {name: 'Intranet(adm)'},
        {name: 'Internet(adm)'},
        {name: 'Terminal Celepar'},
        {name: 'Ofício Eletrônico/Arisp'},
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
    for (const item of operations) {
        await prisma.operationsTypes.create({
            data: item,
        });
    }
    for (const item of admins) {
        await prisma.admin.create({
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

// Run Seed Script
// npx ts-node seed.ts