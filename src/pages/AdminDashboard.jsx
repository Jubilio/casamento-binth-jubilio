import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Users, 
  User, 
  Check, 
  X, 
  LogOut, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit2, 
  MessageSquare,
  Search,
  Share2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, onAuthStateChange, signOut } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import InviteModal from '../components/InviteModal';
import TableManagement from '../components/TableManagement';
import SeatingChart from '../components/SeatingChart';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  /* eslint-disable no-unused-vars */
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  /* eslint-enable no-unused-vars */
  const [rsvps, setRSVPs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'invites', 'rsvps', 'stats'
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState(null);
  
  // Custom Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    isDangerous: false
  });

  // Check authentication state
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchRSVPs(), fetchInvites()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchRSVPs = async () => {
    // Join with invites to get Label
    const { data, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        table_assignment,
        invites ( label, token )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching RSVPs:", error);
      return;
    }
    
    // Flatten data for easier display
    const flattened = data.map(r => ({
      ...r,
      guestName: r.guest_name || 'Desconhecido',
      inviteLabel: r.invites?.label || 'Sem Convite',
      tableAssignment: r.table_assignment,
      timestamp: new Date(r.created_at)
    }));
    
    setRSVPs(flattened);
  };

  const fetchInvites = async () => {
    setIsLoadingInvites(true);
    const { data, error } = await supabase
      .from('invites')
      .select(`
        *,
        guests (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching invites:", error);
    } else {
      setInvites(data);
    }
    setIsLoadingInvites(false);
  };


  const handleOpenAddModal = () => {
    setEditingInvite(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (invite) => {
    setEditingInvite(invite);
    setIsModalOpen(true);
  };

  const handleSaveInvite = async (formData) => {
    setIsLoading(true);
    try {
      let inviteId = editingInvite?.id;

      if (editingInvite) {
        // Update invite
        const { error } = await supabase
          .from('invites')
          .update({ 
              label: formData.label,
              max_guests: formData.max_guests,
              allow_plus_one: formData.allow_plus_one
          })
          .eq('id', inviteId);
        if (error) throw error;
      } else {
        // Create new invite
        const token = Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data, error } = await supabase
          .from('invites')
          .insert([{
            token,
            label: formData.label,
            max_guests: formData.max_guests,
            allow_plus_one: formData.allow_plus_one,
            event: 'Casamento Binth & Jubilio',
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // +90 days
          }])
          .select()
          .single();
        
        if (error) throw error;
        inviteId = data.id;
      }

      // Sync Guests
      // Strategy: Delete all existing guests for this invite (if update) and re-insert?
      // Or smarter diff? 
      // For simplicity in this admin tool: 
      // 1. Get existing IDs? 
      // Let's go simple: 
      // If editing, we might lose RSVP links if we delete guests! 
      // CRITICAL: Cannot just delete guests if they have RSVPs.
      
      // Better strategy:
      // We only ADD new guests or specific Remove.
      // The modal currently sends a full list. 
      // Let's try to just ADD new ones and nothing else for now to be safe?
      // Or if the user removed one in the UI, we try to delete it.

      // Sync Guests (Optional now for robust logic, but kept for autocomplete)
      if (editingInvite) {
          const newNames = formData.guests.map(g => g.name);
          const toDelete = (editingInvite.guests || []).filter(g => !newNames.includes(g.name));
          for (const g of toDelete) {
              await supabase.from('guests').delete().eq('id', g.id);
          }
      }

      for (const guest of formData.guests) {
          if (editingInvite) {
              const existing = (editingInvite.guests || []).find(g => g.name === guest.name);
              if (!existing) {
                  await supabase.from('guests').insert([{ invite_id: inviteId, name: guest.name, type: 'principal' }]);
              }
          } else {
              await supabase.from('guests').insert([{ invite_id: inviteId, name: guest.name, type: 'principal' }]);
          }
      }

      setIsModalOpen(false);
      fetchData(); // Refresh all
    } catch (error) {
      console.error("Error saving invite:", error);
      toast.error("Erro ao salvar convite: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvite = (inviteId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Convite?',
      message: 'Tem certeza que deseja apagar este convite? Isso apagará também os convidados e confirmações associadas.',
      confirmText: 'Sim, Excluir',
      isDangerous: true,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase.from('invites').delete().eq('id', inviteId);
          if (error) throw error;
          toast.success("Convite excluído com sucesso.");
          fetchData();
        } catch (error) {
          console.error("Error deleting invite:", error);
          toast.error("Erro ao deletar convite.");
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- STATS ---
  const stats = React.useMemo(() => {
      const totalInvites = invites.length;
      const totalGuestsListed = invites.reduce((acc, inv) => acc + (inv.max_guests || 0), 0);
      const confirmedGuests = rsvps.filter(r => r.attending).reduce((acc, r) => acc + r.guests_count, 0);
      const declinedGuests = rsvps.filter(r => !r.attending).length; 
      return { totalInvites, totalGuestsListed, confirmedGuests, declinedGuests };
  }, [invites, rsvps]);


  const copyLink = (token) => {
      const url = `${window.location.origin}/rsvp?token=${token}`;
      navigator.clipboard.writeText(url);
  };

  const sendWhatsApp = (invite) => {
    const baseUrl = `${window.location.origin}/rsvp?token=${invite.token}`;
    const guestsNames = invite.guests?.map(g => g.name).join(', ') || invite.label;
    
    const message = `Olá ${guestsNames}! 🥂✨\n\nPreparamos um convite especial para o nosso casamento. Para vê-lo e confirmar sua presença, basta acessar o link abaixo:\n\n${baseUrl}\n\nFicaremos muito felizes com a sua presença! 🤍`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="bg-gradient-to-r from-gold to-yellow-500 p-3 rounded-xl shadow-lg shadow-gold/20">
                <Users className="text-white w-8 h-8" />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Gestão de Convites</h1>
                <p className="text-gray-500 font-medium">Controle de acesso do casamento</p>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button
              onClick={() => fetchData()}
              disabled={isRefreshing}
              className={`bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-purple-500 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Gerados</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.totalInvites}</p>
            <p className="text-gray-500 text-sm">Convites Enviados</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-blue-500 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Capacidade</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.totalGuestsListed}</p>
            <p className="text-gray-500 text-sm">Máximo de Pessoas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-green-500 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                 <div className="bg-green-100 p-3 rounded-lg">
                    <Check className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Confirmados</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.confirmedGuests}</p>
            <p className="text-gray-500 text-sm">Vão Comparecer</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-red-500 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                    <X className="text-red-500 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Recusados</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.declinedGuests}</p>
            <p className="text-gray-500 text-sm">Não Comparecerão</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
           <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'overview' ? 'border-gold text-gold' : 'border-transparent text-gray-500'
            }`}
          >
            Convites & Tokens
          </button>
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`pb-4 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'rsvps' ? 'border-gold text-gold' : 'border-transparent text-gray-500'
            }`}
          >
            Confirmações (RSVPs)
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`pb-4 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'management' ? 'border-gold text-gold' : 'border-transparent text-gray-500'
            }`}
          >
            Gestão de Mesas
          </button>
          <button
            onClick={() => setActiveTab('seating')}
            className={`pb-4 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'seating' ? 'border-gold text-gold' : 'border-transparent text-gray-500'
            }`}
          >
            Mapa de Assentos
          </button>
        </div>

        {/* --- INVITES TAB --- */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Convites Enviados</h2>
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-opacity-90 font-bold shadow-md"
                        >
                            + Criar Novo Convite
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Mesa Reservada</th>
                                    <th className="px-6 py-3">Token</th>
                                    <th className="px-6 py-3">Convidados (Dicas)</th>
                                    <th className="px-6 py-3 text-center">Limite</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invites.map(invite => (
                                    <tr key={invite.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{invite.label || 'Sem nome'}</td>
                                        <td className="px-6 py-4 font-mono text-sm bg-gray-50 p-2 rounded w-min whitespace-nowrap">
                                            {invite.token}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {(invite.guests || []).map(g => g.name).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gold">
                                            {invite.max_guests}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Status logic simplified: Check if there's any RSVP for this invite */}
                                            {rsvps.some(r => r.invite_id === invite.id) ? (
                                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Respondido</span>
                                            ) : (
                                                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Pendente</span>
                                            )}
                                        </td>
                                         <td className="px-6 py-4 flex gap-3 items-center">
                                            <button 
                                                onClick={() => copyLink(invite.token)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
                                                title="Copiar Link"
                                            >
                                                🔗 Copiar
                                            </button>
                                            <button 
                                                onClick={() => sendWhatsApp(invite)}
                                                className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center gap-1"
                                                title="Enviar via WhatsApp"
                                            >
                                                💬 WhatsApp
                                            </button>
                                             <button 
                                                onClick={() => handleOpenEditModal(invite)}
                                                className="text-gray-400 hover:text-gold transition-colors"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteInvite(invite.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Excluir"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {invites.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Nenhum convite criado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- RSVPS TAB --- */}
        {activeTab === 'rsvps' && (
             <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Lista de Confirmações</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Nome Principal</th>
                                <th className="px-6 py-3">Convite Origem</th>
                                <th className="px-6 py-3">Presença</th>
                                <th className="px-6 py-3">Qtd</th>
                                <th className="px-6 py-3">Telefone</th>
                                <th className="px-6 py-3">Mensagem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rsvps.map(rsvp => (
                                <tr key={rsvp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{rsvp.guestName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{rsvp.inviteLabel || 'Sem Mesa'}</td>
                                    <td className="px-6 py-4">
                                         <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                              rsvp.attending
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                          >
                                            {rsvp.attending ? 'Sim' : 'Não'}
                                          </span>
                                    </td>
                                    <td className="px-6 py-4">{rsvp.guests_count}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{rsvp.phone}</td>
                                    <td className="px-6 py-4 text-sm italic text-gray-600 max-w-xs truncate">{rsvp.message}</td>
                                </tr>
                            ))}
                             {rsvps.length === 0 && (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Nenhuma resposta recebida ainda.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
        )}

        {/* --- SEATING CHART TAB --- */}
        {activeTab === 'seating' && <SeatingChart rsvps={rsvps} guestGroups={invites} />}
        
        {/* --- TABLE MANAGEMENT TAB --- */}
        {activeTab === 'management' && <TableManagement rsvps={rsvps} guestGroups={invites} />}

      </div>

      <InviteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvite}
        invite={editingInvite}
        isLoading={isLoading}
      />

      {/* --- CONFIRM MODAL --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 overflow-hidden relative"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${confirmModal.isDangerous ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{confirmModal.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {confirmModal.message}
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg active:scale-95 ${
                  confirmModal.isDangerous 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                    : 'bg-gold hover:bg-gold/90 shadow-gold/20'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

