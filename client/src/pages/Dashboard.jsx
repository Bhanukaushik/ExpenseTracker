import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import SummaryChart from "../components/charts/SummaryChart";
import { expensesAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { Plus, Filter, Search, Trash2, RefreshCw, Edit3 } from "lucide-react";
import { format } from "date-fns";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Salary",
  "Investment",
  "Other",
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ category: "", month: "" });
  const { user, logout } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;

    setDataLoading(true);
    setLoading(true);

    try {
      const [expensesRes, summaryRes, statsRes] = await Promise.allSettled([
        expensesAPI.getAll(),
        expensesAPI.summary(),
        expensesAPI.statistics(),
      ]);

      if (expensesRes.status === "fulfilled") {
        setExpenses(expensesRes.value.data || []);
      }
      if (summaryRes.status === "fulfilled") {
        setSummary(summaryRes.value.data);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
      }

      toast.success("Dashboard loaded successfully!");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }
    try {
      setLoading(true);
      const res = await expensesAPI.search(searchTerm);
      setExpenses(res.data);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const params = { ...filter };
      if (filter.month) params.month = filter.month;
      const res = await expensesAPI.filter(params);
      setExpenses(res.data);
    } catch (error) {
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (confirm("Delete all expenses? This cannot be undone.")) {
      try {
        setLoading(true);
        await expensesAPI.deleteAll();
        fetchData();
        toast.success("All expenses deleted");
      } catch (error) {
        toast.error("Delete failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this expense?")) {
      try {
        await expensesAPI.deleteById(id);
        fetchData();
        toast.success("Expense deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSubmitExpense = async (e, isEdit = false) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const expenseData = {
        name: formData.get("name"),
        category: formData.get("category"),
        amount: parseFloat(formData.get("amount")),
        date: formData.get("date"),
        description: formData.get("description") || "",
      };

      if (isEdit && editingExpense) {
        await expensesAPI.update(editingExpense._id, expenseData);
        toast.success("Expense updated!");
      } else {
        await expensesAPI.create(expenseData);
        toast.success("Expense added successfully!");
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setEditingExpense(null);
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error(isEdit ? "Update failed" : "Add failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-primary-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Welcome back, {user?.name || "User"}!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRefresh}
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={dataLoading}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${dataLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  onClick={() => setShowAddModal(true)}
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2 shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-8 text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  ${summary?.totalAmount?.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  Total Expenses
                </div>
              </Card>
              <Card className="p-8 text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {summary?.expenseCount || 0}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  Transactions
                </div>
              </Card>
              <Card className="p-8 text-center lg:text-left bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  $
                  {summary
                    ? (
                        summary.totalAmount /
                        Math.max(summary.expenseCount || 1, 1)
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm opacity-90 uppercase tracking-wide font-medium">
                  Avg Expense
                </div>
              </Card>
            </div>

            {/* Quick Actions + Chart */}
            <div className="grid lg:grid-cols-4 gap-8 mb-8">
              <Card className="lg:col-span-1 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} size="sm" className="px-4">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <select
                    value={filter.category}
                    onChange={(e) =>
                      setFilter({ ...filter, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleFilter}
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    Apply Filter
                  </Button>
                  <Button
                    onClick={handleDeleteAll}
                    variant="danger"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              </Card>
              <div className="lg:col-span-3">
                <SummaryChart data={summary?.categories || []} />
              </div>
            </div>

            {/* Recent Transactions Table */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Recent Transactions
                  <span className="text-sm text-gray-500 font-normal">
                    ({expenses.length} total)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.slice(0, 10).map((expense) => (
                      <tr
                        key={expense._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {expense.name}
                          </div>
                          {expense.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {expense.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-lg font-bold text-gray-900">
                            ${expense.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {format(new Date(expense.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center gap-2 justify-center">
                            {/* EDIT BUTTON */}
                            <button
                              onClick={() => handleEdit(expense)}
                              className="p-2 h-9 w-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 hover:shadow-md transition-all duration-200 flex items-center justify-center shadow-sm border border-gray-200"
                              title="Edit expense"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5h3m1.5-3l-1.5-1.5L4 13.5V8l5.5-5.5m4.232 4.232L20.5 18.5"
                                />
                              </svg>
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="p-2 h-9 w-9 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900 hover:shadow-md transition-all duration-200 flex items-center justify-center shadow-sm border border-red-200"
                              title="Delete expense"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No expenses found.{" "}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowAddModal(true)}
                          >
                            Add your first expense
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expense"
        size="lg"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => handleSubmitExpense(e, false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Lunch at cafe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount *
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right text-2xl font-bold"
              placeholder="0.00"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                name="date"
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                placeholder="Optional details..."
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" size="lg">
              Save Expense
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingExpense(null);
        }}
        title="Edit Expense"
        size="lg"
      >
        {editingExpense && (
          <form
            className="space-y-6"
            onSubmit={(e) => handleSubmitExpense(e, true)}
          >
            <input type="hidden" name="_id" value={editingExpense._id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={editingExpense.name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editingExpense.category}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={editingExpense.amount}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right text-2xl font-bold"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  defaultValue={format(
                    new Date(editingExpense.date),
                    "yyyy-MM-dd"
                  )}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={editingExpense.description}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                variant="success"
              >
                Update Expense
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingExpense(null);
                }}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
