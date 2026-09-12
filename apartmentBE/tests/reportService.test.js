jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const pool = require('../src/config/database');
const ReportService = require('../src/services/reportService');

describe('ReportService.getDashboardData (regression for BUG-02)', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('aggregates counts, financials and chart data in the shape the frontend expects', async () => {
    // Order must match the queries inside ReportService.getDashboardData
    pool.query
      .mockResolvedValueOnce([[{ total: 60 }]])   // apartments
      .mockResolvedValueOnce([[{ total: 12 }]])   // residents
      .mockResolvedValueOnce([[{ total: 13 }]])   // employees
      .mockResolvedValueOnce([[{ total: 2 }]])    // services
      .mockResolvedValueOnce([[{ total: 10 }]])   // tasks
      .mockResolvedValueOnce([[{
        total: 3, totalPaid: '150000', totalUnpaid: '50000', paidCount: '2', unpaidCount: '1'
      }]])                                        // bills aggregate
      .mockResolvedValueOnce([[{ month: '2024-01', revenue: '150000' }]]) // monthlyRevenue
      .mockResolvedValueOnce([[{ status: 'Còn trống', count: 24 }]])      // occupancyData
      .mockResolvedValueOnce([[{ status: 'Đã hoàn thành', count: 3 }]]);  // taskData

    const data = await ReportService.getDashboardData();

    expect(data.counts).toEqual({
      apartments: 60, residents: 12, employees: 13, bills: 3, services: 2, tasks: 10
    });
    expect(data.financial).toEqual({
      totalPaid: 150000, totalUnpaid: 50000, paidCount: '2', unpaidCount: '1'
    });
    expect(data.charts.monthlyRevenue).toEqual([{ month: '2024-01', revenue: 150000 }]);
    expect(data.charts.occupancyData).toEqual([{ status: 'Còn trống', count: 24 }]);
    expect(data.charts.taskData).toEqual([{ status: 'Đã hoàn thành', count: 3 }]);
  });

  it('wraps a query failure in a descriptive error instead of crashing silently', async () => {
    pool.query.mockRejectedValueOnce(new Error('connection lost'));

    await expect(ReportService.getDashboardData()).rejects.toThrow(/connection lost/);
  });
});
