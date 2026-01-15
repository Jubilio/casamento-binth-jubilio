import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const InviteModal = ({ isOpen, onClose, onSave, invite, isLoading }) => {
  const [formData, setFormData] = useState({
    label: '',
    guests: [],
    max_guests: 1,
    allow_plus_one: false
  });
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestType, setNewGuestType] = useState('principal'); // 'principal' or 'companion'
  const [inviteType, setInviteType] = useState('individual'); // 'individual', 'plus-one', 'group'

  useEffect(() => {
    if (invite) {
      setFormData({
        label: invite.label || '',
        guests: invite.guests || [],
        max_guests: invite.max_guests || 1,
        allow_plus_one: invite.allow_plus_one || false
      });
      
      // Infer invite type
      if (invite.max_guests > 2) setInviteType('group');
      else if (invite.max_guests === 2 && invite.allow_plus_one) setInviteType('plus-one');
      else setInviteType('individual');

    } else {
      setFormData({
        label: '',
        guests: [],
        max_guests: 1,
        allow_plus_one: false
      });
      setInviteType('individual');
    }
    setNewGuestName('');
    setNewGuestType('principal');
  }, [invite, isOpen]);

  // Logic moved to button click handlers to avoid useEffect loops

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    
    if (formData.guests.some(g => g.name.toLowerCase() === newGuestName.trim().toLowerCase())) {
      toast.error('Este convidado já está na lista.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, { name: newGuestName.trim(), type: newGuestType, status: 'pending' }]
    }));
    setNewGuestName('');
    setNewGuestType('principal');
  };

  const handleRemoveGuest = (index) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error('O nome do convite (label) é obrigatório.');
      return;
    }
    if (formData.guests.length === 0) {
      toast.error('Adicione pelo menos um convidado.');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gold p-6 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-2xl font-serif font-bold">
                {invite ? '📝 Editar Convite' : '✉️ Novo Convite'}
              </h3>
              <p className="text-white/80 text-sm">Configure os detalhes e os limites</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none transition-transform hover:rotate-90"
            >
              &times;
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* Label */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Mesa/Grupo
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-colors"
                placeholder="Ex: Família Silva"
                required
              />
            </div>

            {/* Invite Type & Rules */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de Convite</label>
               <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                        setInviteType('individual');
                        if (!invite) setFormData(prev => ({ ...prev, max_guests: 1, allow_plus_one: false }));
                    }}
                    className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        inviteType === 'individual'
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase">Individual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                        setInviteType('plus-one');
                         if (!invite) setFormData(prev => ({ ...prev, max_guests: 2, allow_plus_one: true }));
                    }}
                    className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        inviteType === 'plus-one'
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <Heart className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase">Casal/+1</span>
                  </button>

                   <button
                    type="button"
                    onClick={() => {
                        setInviteType('group');
                         if (!invite && formData.max_guests < 3) setFormData(prev => ({ ...prev, max_guests: 5, allow_plus_one: false }));
                    }}
                    className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        inviteType === 'group'
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase">Família</span>
                  </button>
               </div>
               
               {/* Max Guests Input - Shown for clarity */}
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                   <label className="text-sm text-gray-600 font-medium">Limite Total de Pessoas:</label>
                   <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.max_guests}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) }))}
                        className="w-20 px-3 py-1 border-2 border-gray-300 rounded-lg text-center font-bold text-gray-800 focus:border-gold focus:outline-none"
                    />
               </div>
            </div>

            {/* Guests Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Nomes no Convite (Autocomplete)
              </label>
              
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGuest(e)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-colors"
                  placeholder="Nome do convidado..."
                />
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="bg-gold text-white px-4 py-2 rounded-xl hover:bg-opacity-90 font-bold"
                >
                  +
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 max-h-[150px] overflow-y-auto border-2 border-dashed border-gray-200">
                {formData.guests.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-xs italic">Nenhum nome adicionado.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.guests.map((guest, index) => (
                      <div key={index} className="bg-white border text-gray-700 px-3 py-1.5 rounded-lg flex items-center justify-between shadow-sm">
                        <span className="text-sm">{guest.name}</span>
                        <button type="button" onClick={() => handleRemoveGuest(index)} className="text-gray-400 hover:text-red-500">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InviteModal;
