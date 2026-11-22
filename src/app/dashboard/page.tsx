'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { PresetSidebar } from '@/components/dashboard/PresetSidebar';
import { ConfigForm } from '@/components/dashboard/ConfigForm';
import { OutputWorkbench } from '@/components/dashboard/OutputWorkbench';
import { RulesetItem } from '@/lib/schemas/ruleset.schema';
import {
  ProjectPhase,
  TechStack,
  TaskCategory,
  GuardrailReport,
} from '@/lib/schemas/guardrail.schema';

export default function DashboardPage() {
  const [presets, setPresets] = useState<RulesetItem[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [loadingPresets, setLoadingPresets] = useState(true);

  // Form states
  const [phase, setPhase] = useState<ProjectPhase>('mvp');
  const [stack, setStack] = useState<TechStack>('nextjs');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('api_route');
  const [taskDescription, setTaskDescription] = useState(
    'Build POST /api/analyze public endpoint with Zod input validation and sliding rate limiter.'
  );
  const [targetPath, setTargetPath] = useState('/src/app/api/analyze/route.ts');

  // Analysis result
  const [report, setReport] = useState<GuardrailReport | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Toast & Preset notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  // Fetch presets on load
  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await fetch('/api/rulesets');
        if (res.ok) {
          const data: RulesetItem[] = await res.json();
          setPresets(data);
          if (data.length > 0) {
            selectPreset(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load presets:', err);
      } finally {
        setLoadingPresets(false);
      }
    }

    loadPresets();
  }, []);

  function selectPreset(preset: RulesetItem) {
    setActivePresetId(preset.id);
    setPhase(preset.phase);
    setStack(preset.stack);
    setTaskCategory(preset.taskCategory);
    setTaskDescription(preset.taskDescription);
    setTargetPath(preset.targetPath || '');
  }

  function handleNewPreset() {
    setActivePresetId(null);
    setPhase('mvp');
    setStack('nextjs');
    setTaskCategory('api_route');
    setTaskDescription('');
    setTargetPath('');
    setReport(null);
  }

  async function handleDeletePreset(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/rulesets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPresets((prev) => prev.filter((p) => p.id !== id));
        if (activePresetId === id) {
          handleNewPreset();
        }
        showToast('Preset deleted.');
      }
    } catch {
      showToast('Failed to delete preset.');
    }
  }

  async function runAnalysis() {
    if (!taskDescription || taskDescription.trim().length < 12) {
      showToast('Task description must be at least 12 characters.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          stack,
          taskCategory,
          taskDescription,
          targetPath: targetPath || undefined,
        }),
      });

      if (res.ok) {
        const data: GuardrailReport = await res.json();
        setReport(data);
      } else {
        const err = await res.json();
        showToast(`Analysis Error: ${err.message || 'Validation failed'}`);
      }
    } catch {
      showToast('Network error while running analysis.');
    } finally {
      setEvaluating(false);
    }
  }

  async function savePreset() {
    const name = prompt('Enter a name for this guardrail preset:', `${stack.toUpperCase()} ${phase.toUpperCase()} Rule`);
    if (!name || name.trim().length < 2) return;

    try {
      const res = await fetch('/api/rulesets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phase,
          stack,
          taskCategory,
          taskDescription,
          targetPath: targetPath || undefined,
        }),
      });

      if (res.ok) {
        const created: RulesetItem = await res.json();
        setPresets((prev) => [created, ...prev]);
        setActivePresetId(created.id);
        showToast('Preset saved successfully.');
      } else {
        const err = await res.json();
        showToast(`Save failed: ${err.message}`);
      }
    } catch {
      showToast('Network error saving preset.');
    }
  }

  // Keyboard shortcut listener: Cmd/Ctrl + Enter to run analysis
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runAnalysis();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, stack, taskCategory, taskDescription, targetPath]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-ink-primary">
      {/* Top Bar */}
      <header className="h-14 border-b border-border-subtle bg-bg-elevated px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <span className="text-border-subtle">/</span>
          <div className="text-xs font-mono font-semibold text-ink-secondary truncate max-w-[200px] sm:max-w-xs">
            {activePresetId
              ? presets.find((p) => p.id === activePresetId)?.name || 'Custom Spec'
              : 'Unsaved Guardrail Draft *'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <div className="text-xs font-mono px-3 py-1 rounded bg-accent-soft text-accent-primary border border-accent-border animate-fade-in">
              {toastMessage}
            </div>
          )}
          <Link
            href="/"
            className="text-xs font-mono text-ink-secondary hover:text-ink-primary hidden sm:inline"
          >
            Landing
          </Link>
          <Link
            href="/login"
            className="px-3 py-1.5 rounded bg-surface-inset border border-border-strong text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Switch Account
          </Link>
        </div>
      </header>

      {/* Main Split Workbench */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Presets */}
        <PresetSidebar
          presets={presets}
          activePresetId={activePresetId}
          onSelectPreset={selectPreset}
          onNewPreset={handleNewPreset}
          onDeletePreset={handleDeletePreset}
          loading={loadingPresets}
        />

        {/* Center/Left Pane: Configuration Form (45%) */}
        <div className="w-full md:w-[45%] border-r border-border-subtle overflow-y-auto">
          <ConfigForm
            phase={phase}
            setPhase={setPhase}
            stack={stack}
            setStack={setStack}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            targetPath={targetPath}
            setTargetPath={setTargetPath}
            onRunAnalysis={runAnalysis}
            onSavePreset={savePreset}
            loading={evaluating}
          />
        </div>

        {/* Right Pane: Live Output Workbench (55%) */}
        <div className="w-full md:w-[55%] flex-1 overflow-hidden">
          <OutputWorkbench report={report} loading={evaluating} />
        </div>
      </div>
    </div>
  );
}
