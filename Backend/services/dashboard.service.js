
import mongoose from 'mongoose'
import { Record } from '../models/record.js';


export const getDashboardSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(String(userId));

  const baseMatch = {
    $match: {
      createdBy: userObjectId,
      isDeleted: false,
    },
  };

  const [
    totalsResult,
    categoryTotals,
    monthlyTrends,
    recentTransactions,
  ] = await Promise.all([
    // 1. Total income, expenses and net balance
    Record.aggregate([
      baseMatch,
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),

    // 2. Category-wise totals (per type)
    Record.aggregate([
      baseMatch,
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          categories: {
            $push: {
              category: '$_id.category',
              total: '$total',
              count: '$count',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // 3. Monthly trends -- last 12 months
    Record.aggregate([
      baseMatch,
      {
        $match: {
          date: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          entries: {
            $push: {
              type: '$_id.type',
              total: '$total',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          entries: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]),

    // 4. Most recent 5 transactions
    Record.find({ createdBy: userObjectId, isDeleted: false })
      .sort({ date: -1 })
      .limit(5)
      .select('amount type category date note')
      .lean(),
  ]);

  // Totals result
  const totalsMap = totalsResult.reduce((acc, item) => {
    acc[item._id] = { total: item.total, count: item.count };
    return acc;
  }, {});

  const totalIncome = totalsMap.income?.total || 0;
  const totalExpenses = totalsMap.expense?.total || 0;
  const netBalance = totalIncome - totalExpenses;

  // category totals
  const categoryBreakdown = categoryTotals.reduce((acc, item) => {
    acc[item._id] = item.categories.sort((a, b) => b.total - a.total);
    return acc;
  }, {});

  // Monthly Trends
  const trends = monthlyTrends.map((month) => {
    const income = month.entries.find((e) => e.type === 'income')?.total || 0;
    const expense = month.entries.find((e) => e.type === 'expense')?.total || 0;
    return {
      year: month.year,
      month: month.month,
      income,
      expense,
      net: income - expense,
    };
  });

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netBalance,
      totalIncomeCount: totalsMap.income?.count || 0,
      totalExpenseCount: totalsMap.expense?.count || 0,
    },
    categoryBreakdown,
    monthlyTrends: trends,
    recentTransactions,
  };
};

