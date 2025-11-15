"use client"
import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  Send,
  Building2,
  Wallet,
  TrendingUp,
  ShoppingCart,
  Fuel,
  DollarSign,
  Utensils,
  Film,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Eye,
  EyeOff,
  Plus,
  MoreHorizontal,
  Download,
  Search,
  Ghost,
  Loader2
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const BankApp = () => {
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openCreateBubble, setOpenCreateBubble] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [bubbleV, setBV] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [transferAmount, setTransferAmount] = useState('');
  const router = useRouter();
const [selectedBubble, setSelectedBubble] = useState('');
  
  // State for new bubble form
  const [newBubbleInitialBalance, setNewBubbleInitialBalance] = useState('');

  const quickActions = [
    { name: 'Transfer', icon: Send },
    { name: 'Deposit', icon: Plus }
  ];
const depositToBubble = async () => {
  try {
    const response = await fetch(`/api/bubbles/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedBubble,
        amount: parseFloat(transferAmount)
      }),
    });
    
    if (response.ok) {
      const updatedBubble = await response.json();
      
      const bubblesResponse = await fetch(`/api/bubbles/user/${user.uid}`);
        if (bubblesResponse.ok) {
          const bubblesData = await bubblesResponse.json();
          setBubbles(bubblesData);
          setBV(new Array(bubblesData.length).fill(false));
          const total = bubblesData.reduce((sum, bubble) => sum + parseFloat(bubble.balance || 0), 0);
          setTotalBalance(total);
        }
      setTransferAmount('');
      setSelectedBubble('');
      setOpenTransfer(false);
    } else {
      const errorData = await response.json();
      console.error('Error depositing to bubble:', errorData);
      alert('Failed to deposit: ' + (errorData.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error depositing to bubble:', error);
    alert('Network error: ' + error.message);
  }
};
  useEffect(() => {
    if (!user) {return;};

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const bubblesResponse = await fetch(`/api/bubbles/user/${user.uid}`);
        if (bubblesResponse.ok) {
          const bubblesData = await bubblesResponse.json();
          setBubbles(bubblesData);
          setBV(new Array(bubblesData.length).fill(false));
          const total = bubblesData.reduce((sum, bubble) => sum + parseFloat(bubble.balance || 0), 0);
          setTotalBalance(total);
        }
        setTransactions([
          {
            id: 1,
            name: 'Whole Foods Market',
            amount: -127.45,
            category: 'Groceries',
            icon: ShoppingCart,
            date: 'Today, 2:34 PM'
          },
          {
            id: 2,
            name: 'Shell Gas Station',
            amount: -52.30,
            category: 'Transportation',
            icon: Fuel,
            date: 'Today, 10:15 AM'
          },
          {
            id: 3,
            name: 'Direct Deposit',
            amount: 4250.00,
            category: 'Income',
            icon: DollarSign,
            date: 'Nov 13, 9:00 AM'
          },
          {
            id: 4,
            name: 'Prime Steakhouse',
            amount: -89.50,
            category: 'Dining',
            icon: Utensils,
            date: 'Nov 12, 7:30 PM'
          },
          {
            id: 5,
            name: 'Netflix Subscription',
            amount: -15.99,
            category: 'Entertainment',
            icon: Film,
            date: 'Nov 12, 12:00 PM'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);
  const createNewBubble = async () => {
    try {
      const response = await fetch('/api/bubbles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.uid
        }),
      });
      
      if (response.ok) {
        const newBubble = await response.json();
        await fetch('/api/bubbles/topup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newBubble.id,
            amount: parseFloat(newBubbleInitialBalance)
          })
        })

        const lst = await fetch(`/api/bubbles/user/${user.uid}`, {
          method: 'GET'
        })
        const lstes = await lst.json()
        
        setBubbles(lstes);
        setBV([...bubbleV, false]);
        setNewBubbleInitialBalance('');
        setOpenCreateBubble(false);
        const total = lstes.reduce((sum, bubble) => sum + parseFloat(bubble.balance || 0), 0);
        setTotalBalance(total);
      } else {
        const errorData = await response.json();
        console.error('Error creating bubble:', errorData);
        alert('Failed to create bubble: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating bubble:', error);
      alert('Network error: ' + error.message);
    }
  };

  const deleteBubble = async (id) => {
    try {
      const response = await fetch(`/api/bubbles/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBubbles(bubbles.filter(bubble => bubble.id !== id));
        setBV(bubbleV.filter((_, index) => bubbles.findIndex(b => b.id === id) !== index));
      const total = bubbles.filter(bubble => bubble.id !== id).reduce((sum, bubble) => sum + parseFloat(bubble.balance || 0), 0);
  setTotalBalance(total);
}
    } catch (error) {
      console.error('Error deleting bubble:', error);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#386FA4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center align-bottom justify-center">
                <Ghost className="w-8 h-10 text-[#386FA4]" />
              </div>
              <span className="text-2xl font-semibold align-baseline">BubbleID</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-zinc-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Good {(new Date()).getHours() < 6 ? "night" : (new Date()).getHours() < 12 ? "morning" : (new Date()).getHours() < 18 ? "afternoon" : "evening"}, {user?.email?.split('@')[0] || 'User'}
            </h1>
          </div>
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-2.5 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            {balanceVisible ? (
              <Eye className="w-5 h-5 text-zinc-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-[#386FA4] rounded-3xl p-8 mb-8">
          <p className="text-cyan-100 text-sm mb-2">Total Bubble Balance</p>
          {balanceVisible ? (
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          ) : (
            <h2 className="text-5xl font-bold text-white mb-6">
              ••••••
            </h2>
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => setOpenCreateBubble(true)}
              className="flex-1 bg-white/25 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-7 h-7 font-bold" />
              <span className="text-lg">New</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Active bubbles</h3>

          {bubbles.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Ghost className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
              <p>No bubbles yet. Create your first bubble!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bubbles.map((bubble, index) => (
                <div
                  key={bubble.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors duration-200 flex flex-col"
                >
                  <div className="flex">
                  <span className="text-sm w-full text-zinc-500 mb-2">
                    {new Date(bubble.createdAt).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                  <span className={"text-sm "+ (bubble.status == "active" ? "text-green-500" : "text-red-500")}>{bubble.status == "active" ? "Active" : "Inactive"}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div 
                      onClick={() => navigator.clipboard.writeText(bubble.id)} 
                      className="w-full sm:text-lg px-3 py-1.5 bg-zinc-800 rounded-lg flex items-center justify-center font-medium text-white cursor-pointer"
                    >
                      {bubbleV[index] ? bubble.id : "••••••••••••••••••••••••"}
                    </div>
                    <button 
                      onClick={() => setBV(bv => {
                        return bv.map((c, i) => {
                          if (i == index){ return !c}
                          else {return c;}
                        })
                      })} 
                      className="bg-zinc-600 h-full px-5 rounded"
                    >
                      {bubbleV[index] ? <EyeOff/> : <Eye/>}
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center mb-3">
                    <p className="text-3xl font-bold text-white">
                      ${parseFloat(bubble.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBubble(bubble.id)}
                    className="mt-auto text-sm text-red-500 hover:text-red-400 self-end"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex space-x-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => action.name === 'Transfer' && setOpenTransfer(true)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="text-sm text-zinc-400 block">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <button className="text-sm text-cyan-500 hover:text-cyan-400">View all</button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
            {transactions.map((transaction) => {
              const Icon = transaction.icon;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{transaction.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${transaction.amount > 0 ? 'text-cyan-500' : 'text-white'
                      }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">{transaction.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {openTransfer && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Deposit to Bubble</h3>
        <button
          onClick={() => setOpenTransfer(false)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Select Bubble</label>
          <select 
            value={selectedBubble}
            onChange={(e) => setSelectedBubble(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white transition-colors"
          >
            <option value="">Choose a bubble</option>
            {bubbles.map((bubble) => (
              <option key={bubble.id} value={bubble.id}>
                {bubble.id.substring(0, 8)}... - ${parseFloat(bubble.balance || 0).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setOpenTransfer(false)}
          className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-xl font-medium text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={depositToBubble}
          disabled={!selectedBubble || !transferAmount || parseFloat(transferAmount) <= 0}
          className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          Deposit
        </button>
      </div>
    </div>
  </div>
)}

      {/* Create Bubble Modal */}
      {openCreateBubble && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Create New Bubble</h3>
              <button
                onClick={() => setOpenCreateBubble(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Initial Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="number"
                    value={newBubbleInitialBalance}
                    onChange={(e) => setNewBubbleInitialBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setOpenCreateBubble(false)}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-xl font-medium text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewBubble}
                className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default BankApp;