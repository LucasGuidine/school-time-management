import { ReportsService } from './reports.service';
describe('ReportsService (unit)', () => {
  it('should compute reports calling repository', async () => {
    const repoMock = {
      getProfessorHours: jest
        .fn()
        .mockResolvedValue([{ professorId: 1, name: 'Gira', hours: 4 }]),
      getRoomsSchedulesForDay: jest.fn().mockResolvedValue([]),
    };
    const service = new ReportsService(repoMock as any);
    const hrs = await service.getProfessorHours();
    expect(hrs).toEqual([{ professorId: 1, name: 'Gira', hours: 4 }]);
    expect(repoMock.getProfessorHours).toHaveBeenCalled();
  });
});
