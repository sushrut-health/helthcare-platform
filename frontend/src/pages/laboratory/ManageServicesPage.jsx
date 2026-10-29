import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { TestTube2, Plus, Check, Edit, IndianRupee, Home, Save, CheckCircle2 } from 'lucide-react';

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [testsCatalog, setTestsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const [srvRes, tstRes] = await Promise.all([
        api.get('/laboratories/services'),
        api.get('/directory/tests')
      ]);
      if (srvRes.success) setServices(srvRes.services);
      if (tstRes.success) setTestsCatalog(tstRes.tests);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleUpdatePrice = async (service, newPrice) => {
    try {
      await api.post('/laboratories/services', {
        testId: service.test_id,
        price: newPrice,
        isAvailable: service.is_available,
        homeCollectionAvailable: service.home_collection_available
      });
      await loadServices();
      setMessage(`Price updated for ${service.test_name}.`);
      setEditingService(null);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const handleToggleHomePickup = async (service) => {
    try {
      await api.post('/laboratories/services', {
        testId: service.test_id,
        price: service.price,
        isAvailable: service.is_available,
        homeCollectionAvailable: !service.home_collection_available
      });
      await loadServices();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading laboratory services & test pricing..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Test Catalogue</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Laboratory Diagnostic Offerings</h1>
          <p className="text-xs text-slate-500">Configure center pricing and sample collection options for tests</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                <th className="py-3 px-4">Test Name & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Specimen Type</th>
                <th className="py-3 px-4">Home Collection</th>
                <th className="py-3 px-4">Test Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(srv => {
                const isEditing = editingService?.id === srv.id;

                return (
                  <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{srv.test_name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{srv.test_id_code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {srv.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {srv.sample_type}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleHomePickup(srv)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${srv.home_collection_available ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                      >
                        <Home className="w-3 h-3" />
                        {srv.home_collection_available ? 'Home Pickup Enabled' : 'At Center Only'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            defaultValue={srv.price}
                            id={`price-${srv.id}`}
                            className="w-20 px-2 py-1 rounded border border-slate-300 font-bold"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-slate-800 text-sm flex items-center">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {srv.price}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              const val = document.getElementById(`price-${srv.id}`).value;
                              handleUpdatePrice(srv, val);
                            }}
                            className="btn-primary text-xs py-1 px-2.5"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingService(null)}
                            className="btn-secondary text-xs py-1 px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingService(srv)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit Fee
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
