const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.classSchedule.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subjectPrerequisite.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.room.deleteMany();
  await prisma.building.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.title.deleteMany();
  await prisma.department.deleteMany();

  await prisma.department.createMany({
    data: [
      { name: 'Ciências Exatas' },
      { name: 'Ciências Humanas' },
      { name: 'Engenharias' },
      { name: 'Saúde' },
      { name: 'Tecnologia' },
    ],
  });

  const [cienciasExatas, cienciasHumanas, engenharias, saude, tecnologia] =
    await prisma.department.findMany();

  await prisma.title.createMany({
    data: [
      { name: 'Diretor' },
      { name: 'Coordenador' },
      { name: 'Professor Doutor' },
      { name: 'Professor Mestre' },
      { name: 'Professor Especialista' },
    ],
  });

  const [coordenador, doutor, mestre, especialista] =
    await prisma.title.findMany();

  await prisma.professor.createMany({
    data: [
      {
        name: 'Prof. Girafales',
        departmentId: cienciasExatas.id,
        titleId: doutor.id,
      },
      {
        name: 'Prof. Florinda',
        departmentId: cienciasHumanas.id,
        titleId: coordenador.id,
      },
      {
        name: 'Prof. Inocêncio',
        departmentId: engenharias.id,
        titleId: mestre.id,
      },
      { name: 'Prof. Clotilde', departmentId: saude.id, titleId: doutor.id },
      {
        name: 'Prof. Barriga',
        departmentId: tecnologia.id,
        titleId: especialista.id,
      },
      {
        name: 'Prof. Madruga',
        departmentId: cienciasExatas.id,
        titleId: mestre.id,
      },
    ],
  });

  const professorList = await prisma.professor.findMany();

  await prisma.building.createMany({
    data: [
      { name: 'Bloco A - Ciências' },
      { name: 'Bloco B - Humanas' },
      { name: 'Bloco C - Engenharias' },
      { name: 'Bloco D - Saúde' },
      { name: 'Bloco E - Tecnologia' },
    ],
  });

  const buildingList = await prisma.building.findMany();

  await prisma.room.createMany({
    data: [
      { name: 'Sala 101', buildingId: buildingList[0].id },
      { name: 'Sala 102', buildingId: buildingList[0].id },
      { name: 'Laboratório 201', buildingId: buildingList[0].id },
      { name: 'Sala 301', buildingId: buildingList[1].id },
      { name: 'Auditório B1', buildingId: buildingList[1].id },
      { name: 'Laboratório C101', buildingId: buildingList[2].id },
      { name: 'Sala C201', buildingId: buildingList[2].id },
      { name: 'Laboratório Anatomia', buildingId: buildingList[3].id },
      { name: 'Sala D101', buildingId: buildingList[3].id },
      { name: 'Laboratório Informática', buildingId: buildingList[4].id },
      { name: 'Sala E201', buildingId: buildingList[4].id },
    ],
  });

  const roomList = await prisma.room.findMany();

  await prisma.subject.createMany({
    data: [
      {
        code: 'MAT101',
        name: 'Matemática Básica',
        professorId: professorList[0].id,
        buildingId: buildingList[0].id,
      },
      {
        code: 'POR201',
        name: 'Literatura Brasileira',
        professorId: professorList[1].id,
        buildingId: buildingList[1].id,
      },
      {
        code: 'ENG301',
        name: 'Cálculo I',
        professorId: professorList[2].id,
        buildingId: buildingList[2].id,
      },
      {
        code: 'BIO401',
        name: 'Anatomia Humana',
        professorId: professorList[3].id,
        buildingId: buildingList[3].id,
      },
      {
        code: 'TEC501',
        name: 'Programação Web',
        professorId: professorList[4].id,
        buildingId: buildingList[4].id,
      },
      {
        code: 'FIS101',
        name: 'Física Geral',
        professorId: professorList[5].id,
        buildingId: buildingList[0].id,
      },
    ],
  });

  const subjectList = await prisma.subject.findMany();

  await prisma.subjectPrerequisite.createMany({
    data: [
      {
        subjectId: subjectList[2].id,
        prerequisiteId: subjectList[0].id,
      },
      {
        subjectId: subjectList[4].id,
        prerequisiteId: subjectList[0].id,
      },
    ],
  });

  await prisma.class.createMany({
    data: [
      {
        subjectId: subjectList[0].id,
        year: 2025,
        semester: 2,
        code: 'MAT101-A',
      },
      {
        subjectId: subjectList[0].id,
        year: 2025,
        semester: 2,
        code: 'MAT101-B',
      },
      {
        subjectId: subjectList[1].id,
        year: 2025,
        semester: 2,
        code: 'POR201-A',
      },
      {
        subjectId: subjectList[2].id,
        year: 2025,
        semester: 2,
        code: 'ENG301-A',
      },
      {
        subjectId: subjectList[3].id,
        year: 2025,
        semester: 2,
        code: 'BIO401-A',
      },
      {
        subjectId: subjectList[4].id,
        year: 2025,
        semester: 2,
        code: 'TEC501-A',
      },
      {
        subjectId: subjectList[5].id,
        year: 2025,
        semester: 2,
        code: 'FIS101-A',
      },
    ],
  });

  const classList = await prisma.class.findMany();

  await prisma.classSchedule.createMany({
    data: [
      {
        classId: classList[0].id,
        roomId: roomList[0].id,
        dayOfWeek: 1,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },
      {
        classId: classList[0].id,
        roomId: roomList[0].id,
        dayOfWeek: 3,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },

      {
        classId: classList[1].id,
        roomId: roomList[1].id,
        dayOfWeek: 2,
        startTime: '14:00:00',
        endTime: '16:00:00',
      },
      {
        classId: classList[1].id,
        roomId: roomList[1].id,
        dayOfWeek: 4,
        startTime: '14:00:00',
        endTime: '16:00:00',
      },

      {
        classId: classList[2].id,
        roomId: roomList[3].id,
        dayOfWeek: 1,
        startTime: '10:00:00',
        endTime: '12:00:00',
      },
      {
        classId: classList[2].id,
        roomId: roomList[3].id,
        dayOfWeek: 5,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },

      {
        classId: classList[3].id,
        roomId: roomList[5].id,
        dayOfWeek: 2,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },
      {
        classId: classList[3].id,
        roomId: roomList[5].id,
        dayOfWeek: 4,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },

      {
        classId: classList[4].id,
        roomId: roomList[7].id,
        dayOfWeek: 3,
        startTime: '14:00:00',
        endTime: '17:00:00',
      },

      {
        classId: classList[5].id,
        roomId: roomList[9].id,
        dayOfWeek: 1,
        startTime: '16:00:00',
        endTime: '18:00:00',
      },
      {
        classId: classList[5].id,
        roomId: roomList[9].id,
        dayOfWeek: 3,
        startTime: '16:00:00',
        endTime: '18:00:00',
      },
      {
        classId: classList[5].id,
        roomId: roomList[9].id,
        dayOfWeek: 5,
        startTime: '16:00:00',
        endTime: '18:00:00',
      },

      {
        classId: classList[6].id,
        roomId: roomList[2].id,
        dayOfWeek: 2,
        startTime: '19:00:00',
        endTime: '22:00:00',
      },
      {
        classId: classList[6].id,
        roomId: roomList[2].id,
        dayOfWeek: 6,
        startTime: '08:00:00',
        endTime: '11:00:00',
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
