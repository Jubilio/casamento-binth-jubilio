import React, { useState } from 'react';
import { User, Users, Move, CheckCircle, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const TableManagement = ({ rsvps, guestGroups }) => {
  const [selectedRsvp, setSelectedRsvp] = useState(null);

  // Tables are our Invites (using their labels)
  const tables = guestGroups || [];

  // Categorize RSVPs
  const confirmedRSVPs = rsvps.filter(r => r.attending);
  
  // Get guests assigned to a specific table (via tableAssignment column)
  const getTableGuests = (tableLabel) => {
    return confirmedRSVPs.filter(r => r.tableAssignment === tableLabel);
  };

  // RSVPs not yet assigned to a table
  const unassignedRSVPs = confirmedRSVPs.filter(r => !r.tableAssignment);

  const handleAssignToTable = async (tableLabel) => {
    if (!selectedRsvp) return;

    try {
      const { error } = await supabase
        .from('rsvps')
        .update({ table_assignment: tableLabel })
        .eq('id', selectedRsvp.id);

      if (error) throw error;

      toast.success(`✅ ${selectedRsvp.guestName} atribuído(a) à ${tableLabel}`);
      setSelectedRsvp(null);
    } catch (err) {
      console.error("Error updating assignment:", err);
      toast.error("Erro ao atribuir mesa.");
    } finally {
      // Done
    }
  };

  const handleUnassign = async (rsvpId) => {
    try {
      const { error } = await supabase
        .from('rsvps')
        .update({ table_assignment: null })
        .eq('id', rsvpId);

      if (error) throw error;
      toast.success(`✅ Convidado removido da mesa.`);
    } catch (err) {
      console.error("Error unassigning:", err);
      toast.error("Erro ao remover da mesa.");
    } finally {
        // Done
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Feedback */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gold">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Organização de Assentos</h2>
            <p className="text-gray-500">Distribua os convidados confirmados pelas mesas (Labels)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Waiting List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-2 mb-4">
               <HelpCircle className="text-orange-500 w-5 h-5" />
               <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm">Aguardando Atribuição ({unassignedRSVPs.length})</h3>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {unassignedRSVPs.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-10 h-10 text-green-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm italic">Todos os confirmados estão sentados!</p>
                  </div>
                ) : (
                  unassignedRSVPs.map(rsvp => (
                    <div 
                      key={rsvp.id}
                      onClick={() => setSelectedRsvp(selectedRsvp?.id === rsvp.id ? null : rsvp)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                        selectedRsvp?.id === rsvp.id 
                        ? 'border-gold bg-gold/5 ring-4 ring-gold/10' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{rsvp.guestName}</p>
                          <p className="text-xs text-gray-500">Original: {rsvp.inviteLabel}</p>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-bold">
                           {rsvp.guests_count} pes.
                        </span>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Tables Grid */}
        <div className="lg:col-span-8 space-y-4">
           {selectedRsvp && (
             <div className="bg-gold/10 border-2 border-dashed border-gold rounded-2xl p-4 text-center animate-pulse mb-4">
                <p className="text-gold font-bold">
                   Selecione uma mesa abaixo para sentar <span className="underline">{selectedRsvp.guestName}</span>
                </p>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map(table => {
                const guestsInTable = getTableGuests(table.label);
                const currentCount = guestsInTable.reduce((acc, g) => acc + g.guests_count, 0);
                const isFull = currentCount >= table.max_guests;

                return (
                  <div 
                    key={table.id}
                    onClick={() => selectedRsvp && handleAssignToTable(table.label)}
                    className={`bg-white rounded-2xl shadow-md border-2 transition-all p-5 relative overflow-hidden ${
                      selectedRsvp 
                        ? isFull 
                          ? 'opacity-50 cursor-not-allowed border-red-100' 
                          : 'border-blue-400 bg-blue-50/30 cursor-pointer hover:scale-[1.02]' 
                        : 'border-transparent hover:border-gray-100'
                    }`}
                  >
                    {/* Progress Bar Top */}
                    <div className="absolute top-0 left-0 h-1 bg-gold transition-all" style={{ width: `${Math.min(100, (currentCount/table.max_guests)*100)}%` }}></div>

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{table.label}</h4>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                           <Users className="w-3 h-3" />
                           <span>Capacidade: {table.max_guests}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {currentCount} / {table.max_guests}
                      </div>
                    </div>

                    <div className="space-y-2">
                       {guestsInTable.map(guest => (
                         <div key={guest.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg group">
                            <span className="text-sm font-medium text-gray-700">{guest.guestName}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] text-gray-400">{guest.guests_count} pes.</span>
                               <button 
                                onClick={(e) => { e.stopPropagation(); handleUnassign(guest.id); }}
                                className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                               >
                                 &times;
                               </button>
                            </div>
                         </div>
                       ))}
                       {guestsInTable.length === 0 && (
                         <p className="text-xs text-gray-300 italic text-center py-4">Mesa vazia</p>
                       )}
                    </div>
                    
                    {selectedRsvp && !isFull && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 opacity-0 hover:opacity-100 transition-opacity">
                        <Move className="text-blue-500 w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
