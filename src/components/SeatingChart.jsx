import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SeatingChart = ({ rsvps }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);

  // Fetch tables from Supabase
  const fetchTables = useCallback(async () => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching tables:", error);
    } else {
      setTables(data || []);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Build table data with guests
  const tableData = tables.map((table, idx) => {
    const guestsInTable = rsvps.filter(r => r.attending && r.tableAssignment === table.name);
    const confirmedCount = guestsInTable.reduce((sum, r) => sum + (r.guests_count || 0), 0);
    
    let status = 'empty';
    if (confirmedCount >= table.capacity) status = 'full';
    else if (confirmedCount > 0) status = 'partial';

    return {
      ...table,
      index: idx,
      confirmedCount,
      status,
      guests: guestsInTable
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'full': return 'bg-green-500 border-green-600 text-white shadow-green-200';
      case 'partial': return 'bg-blue-500 border-blue-600 text-white shadow-blue-200';
      default: return 'bg-white border-gray-200 text-gray-400';
    }
  };

  // Helper to generate seats with guest names
  const getSeats = (tableGuests, capacity) => {
    const seats = Array(capacity).fill(null);
    let seatIndex = 0;

    tableGuests.forEach(rsvp => {
      for (let i = 0; i < rsvp.guests_count; i++) {
        if (seatIndex < capacity) {
          seats[seatIndex] = i === 0 ? rsvp.guestName : `${rsvp.guestName} (Acomp.)`;
          seatIndex++;
        }
      }
    });

    return seats;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">Mapa do Salão</h2>
          <p className="text-gray-500">Cada mesa possui capacidade para <span className="font-bold text-gold">10 lugares</span></p>
        </div>
        <div className="flex gap-4 p-2 bg-gray-50 rounded-xl">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Cheia
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div> Ocupada
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div> Vazia
           </div>
        </div>
      </div>

      {tableData.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Nenhuma mesa criada ainda.</p>
          <p className="text-gray-300 text-sm">Vá para "Gestão de Mesas" para criar mesas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {tableData.map((table) => (
            <motion.div
              key={table.id}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setSelectedTable(table)}
              className={`
                relative aspect-square rounded-[2.5rem] border-2 shadow-lg cursor-pointer
                flex flex-col items-center justify-center text-center p-4 transition-all
                ${getStatusColor(table.status)}
              `}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-20">
                 <Users className="w-8 h-8" />
              </div>

              <h3 className="font-bold text-xs leading-tight mb-2 uppercase tracking-tighter">
                {table.name}
              </h3>
              
              <div className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-full">
                 <span className="text-xs font-black">{table.confirmedCount}</span>
                 <span className="text-[10px] opacity-60">/ {table.capacity}</span>
              </div>
              
              {/* Minimal Seats Preview Around the card */}
              <div className="absolute inset-0 pointer-events-none">
                  {[...Array(table.capacity)].map((_, i) => {
                      const angle = (i * (360 / table.capacity)) * (Math.PI / 180);
                      const x = Math.cos(angle) * 45;
                      const y = Math.sin(angle) * 45;
                      const isOccupied = i < table.confirmedCount;
                      return (
                          <div 
                              key={i} 
                              style={{ 
                                  left: `calc(50% + ${x}%)`, 
                                  top: `calc(50% + ${y}%)`,
                                  transform: 'translate(-50%, -50%)'
                              }}
                              className={`absolute w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-white' : 'bg-gray-200 border border-gray-300'}`}
                          />
                      );
                  })}
              </div>

              {/* Table Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gold text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-white">
                {table.index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal - Detailed Table View */}
      <AnimatePresence>
        {selectedTable && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" 
            onClick={() => setSelectedTable(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedTable(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-gradient-to-br from-gold/10 to-transparent p-10 text-center border-b border-gray-100">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gold mb-3">Mesa Reservada</p>
                <h3 className="text-4xl font-serif font-bold italic text-gray-800 mb-2">
                  {selectedTable.name}
                </h3>
                <div className="flex justify-center gap-2 mt-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                    selectedTable.status === 'full' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {selectedTable.confirmedCount} / {selectedTable.capacity} Lugares Ocupados
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                {/* Visual Seat Representation */}
                <div className="grid grid-cols-2 gap-3">
                  {getSeats(selectedTable.guests, selectedTable.capacity).map((guestName, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        guestName 
                          ? 'bg-blue-50 border-blue-100 ring-1 ring-blue-50' 
                          : 'bg-gray-50 border-dashed border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        guestName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${guestName ? 'text-blue-900' : 'text-gray-400 italic'}`}>
                          {guestName || 'Lugar Disponível'}
                        </p>
                      </div>
                      {guestName && <User className="w-3 h-3 text-blue-300 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-[10px] text-gray-400 mt-8 font-medium uppercase tracking-widest">
                  Toque fora para fechar o mapa
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatingChart;
