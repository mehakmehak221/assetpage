'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lead, QueryLeadsDto, CreateLeadDto, UpdateLeadDto } from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { LeadFilters } from '@/components/dashboard/agent/crm/LeadFilters';
import { LeadTable } from '@/components/dashboard/agent/crm/LeadTable';
import { CreateLeadModal } from '@/components/dashboard/agent/crm/CreateLeadModal';
import { EditLeadModal } from '@/components/dashboard/agent/crm/EditLeadModal';
import { DeleteLeadModal } from '@/components/dashboard/agent/crm/DeleteLeadModal';
import { LeadDetailsDrawer } from '@/components/dashboard/agent/crm/LeadDetailsDrawer';
import { Users, UserPlus, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/providers/LocaleProvider';

interface LeadStats {
  totalAssigned: number;
  newLeads: number;
  inContact: number;
  converted: number;
}

export default function AgentLeadsPage() {
  const { t } = useI18n();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<LeadStats>({
    totalAssigned: 0,
    newLeads: 0,
    inContact: 0,
    converted: 0,
  });

  const [filters, setFilters] = useState<QueryLeadsDto>({ page: 1, limit: 10 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadForEdit, setLeadForEdit] = useState<Lead | null>(null);
  const [leadForDelete, setLeadForDelete] = useState<Lead | null>(null);


  const fetchStats = useCallback(async () => {
    try {
      const res = await agentCrmApi.getLeads({ page: 1, limit: 9999 });
      const allLeads = res.items;
      setStats({
        totalAssigned: res.total,
        newLeads: allLeads.filter((l) => l.status === 'NEW').length,
        inContact: allLeads.filter(
          (l) => l.status === 'CONTACTED' || l.status === 'INTERESTED'
        ).length,
        converted: allLeads.filter(
          (l) => l.status === 'INVESTED' || l.status === 'CLOSED'
        ).length,
      });
    } catch (err) {
      console.error('Failed to fetch lead stats:', err);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await agentCrmApi.getLeads(filters);
      setLeads(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = (newFilters: Partial<QueryLeadsDto>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset page on filter change unless page itself changed
    }));
  };

  const handleCreateLead = async (data: CreateLeadDto) => {
    await agentCrmApi.createLead(data);
    // Refresh both the paginated list and the KPI stats
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handleEditLead = async (data: UpdateLeadDto) => {
    if (!leadForEdit) return;
    await agentCrmApi.updateLead(leadForEdit.id, data);
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  const handleDeleteLead = async () => {
    if (!leadForDelete) return;
    const deletedName = leadForDelete.name;
    await agentCrmApi.deleteLead(leadForDelete.id);
    if (selectedLeadId === leadForDelete.id) {
      setSelectedLeadId(null);
    }
    await Promise.all([fetchLeads(), fetchStats()]);
    
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: {
          message: `"${deletedName}" has been permanently deleted.`,
          type: "success",
        },
      })
    );
  };

  return (
    <div className="min-h-screen p-3.5 sm:p-6 lg:p-8 max-w-[1200px] mx-auto font-montserrat space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className="px-2.5 py-1 rounded-md bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] font-bold uppercase tracking-widest">
            {t("Agent Panel")}
          </span>
          <span className="text-xs text-[var(--sidebar-text)] opacity-60">• {t("Lead Pipeline")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {t("Assigned Leads & CRM")}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--sidebar-text)] opacity-60 mt-1">
          {t("Manage your investor prospects, track status transitions, add notes, and schedule follow-ups.")}
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Assigned */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">{stats.totalAssigned}</p>
            <p className="text-[9px] sm:text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider truncate">{t("Total Leads")}</p>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">{stats.newLeads}</p>
            <p className="text-[9px] sm:text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider truncate">{t("New Leads")}</p>
          </div>
        </div>

        {/* In Contact */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">{stats.inContact}</p>
            <p className="text-[9px] sm:text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider truncate">{t("In Contact")}</p>
          </div>
        </div>

        {/* Converted */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] border border-[var(--color-primary-300)]/25 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">{stats.converted}</p>
            <p className="text-[9px] sm:text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider truncate">{t("Converted")}</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <LeadFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isLoading={isLoading}
      />

      {/* Leads Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        onSelectLead={(lead) => setSelectedLeadId(lead.id)}
        onEditLead={(lead) => setLeadForEdit(lead)}
        onDeleteLead={(lead) => setLeadForDelete(lead)}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md text-xs">
          <span className="text-[var(--sidebar-text)] opacity-60 font-medium">
            {t("Page {page} of {totalPages} ({total} total leads)", { page: filters.page || 1, totalPages, total })}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={(filters.page || 1) <= 1}
              onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
              className="p-2 rounded-md border border-[var(--sidebar-border)] text-[var(--sidebar-text)] disabled:opacity-30 hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={(filters.page || 1) >= totalPages}
              onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
              className="p-2 rounded-md border border-[var(--sidebar-border)] text-[var(--sidebar-text)] disabled:opacity-30 hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <EditLeadModal
        isOpen={leadForEdit !== null}
        lead={leadForEdit}
        onClose={() => setLeadForEdit(null)}
        onSubmit={handleEditLead}
      />

      <DeleteLeadModal
        isOpen={leadForDelete !== null}
        lead={leadForDelete}
        onClose={() => setLeadForDelete(null)}
        onConfirm={handleDeleteLead}
      />

      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onLeadUpdated={fetchLeads}
        onDeleteLead={(lead) => setLeadForDelete(lead)}
      />
    </div>
  );
}
