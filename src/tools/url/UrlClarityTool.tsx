'use client';

import { useAppShell } from '@/components/shell/AppShell';
import { decodeNTimes, inspectUrl, sortQueryParamsByKey, type InspectResult, type QueryParam } from '@/lib/url/inspect';
import { getUrlExample, UrlInputSection, type UrlSortMode } from '@/tools/url/components/UrlInputSection';
import { UrlInspectorPanel } from '@/tools/url/components/UrlInspectorPanel';
import { UrlOverviewPanel } from '@/tools/url/components/UrlOverviewPanel';
import { safeExternalHref } from '@/tools/url/utils/safeExternalHref';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  sort: 'clarity-tools.url.sort',
  plus: 'clarity-tools.url.plusAsSpace',
} as const;

function readStoredSort(): UrlSortMode | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEYS.sort);
  return v === 'key' || v === 'original' ? v : null;
}

function readStoredBool(key: string): boolean | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(key);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
}

export function UrlClarityTool() {
  const { lang, openTool, takeTransferredInput } = useAppShell();

  const [sortMode, setSortMode] = useState<UrlSortMode>(() => readStoredSort() ?? 'original');
  const [plusAsSpace, setPlusAsSpace] = useState<boolean>(() => readStoredBool(STORAGE_KEYS.plus) ?? true);

  const [input, setInput] = useState(() => takeTransferredInput('url') ?? '');
  const [selectedParamIndex, setSelectedParamIndex] = useState<number | null>(null);

  const [extraDecodeCount, setExtraDecodeCount] = useState(0);
  const [showJson, setShowJson] = useState(false);
  const [showNestedUrl, setShowNestedUrl] = useState(false);

  const inspected = useMemo<InspectResult>(() => inspectUrl(input, { plusAsSpace }), [input, plusAsSpace]);

  const locale = lang === 'ko' ? 'ko-KR' : 'en-US';

  const displayedParams = useMemo<QueryParam[]>(() => {
    if (!inspected.ok) return [];
    const params = inspected.value.query.params;
    return sortMode === 'key' ? sortQueryParamsByKey(params, locale) : params;
  }, [inspected, sortMode, locale]);

  const selectedParam = useMemo<QueryParam | null>(() => {
    if (!inspected.ok) return null;
    if (selectedParamIndex == null) return null;
    return inspected.value.query.params.find((p) => p.index === selectedParamIndex) ?? null;
  }, [inspected, selectedParamIndex]);

  const inspectorValue = useMemo(() => {
    if (!selectedParam) return null;
    return decodeNTimes(selectedParam.value.decoded.text, extraDecodeCount, {
      plusAsSpace,
    });
  }, [selectedParam, extraDecodeCount, plusAsSpace]);

  const jsonPreview = useMemo(() => {
    if (!showJson || !inspectorValue) return null;
    const raw = inspectorValue.text.trim();
    try {
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return null;
    }
  }, [showJson, inspectorValue]);

  const nestedUrlPreview = useMemo(() => {
    if (!showNestedUrl || !inspectorValue) return null;
    return inspectUrl(inspectorValue.text, { plusAsSpace });
  }, [showNestedUrl, inspectorValue, plusAsSpace]);

  const hasInput = input.trim().length > 0;

  // Persist per-tool prefs (lightweight)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.sort, sortMode);
    window.localStorage.setItem(STORAGE_KEYS.plus, String(plusAsSpace));
  }, [sortMode, plusAsSpace]);

  const showAssumedHttpsHint = inspected.ok && inspected.value.assumptions.length > 0;

  const onSelectParam = (index: number) => {
    setSelectedParamIndex(index);
    setExtraDecodeCount(0);
    setShowJson(false);
    setShowNestedUrl(false);
  };

  const onChangeInput = (value: string) => {
    setInput(value);
    setSelectedParamIndex(null);
    setExtraDecodeCount(0);
    setShowJson(false);
    setShowNestedUrl(false);
  };

  const onUseExample = () => {
    onChangeInput(getUrlExample());
  };

  const onClear = () => {
    onChangeInput('');
  };

  return (
    <div className="space-y-6">
      <UrlInputSection
        lang={lang}
        input={input}
        onChangeInput={onChangeInput}
        onUseExample={onUseExample}
        onClear={onClear}
        canClear={hasInput}
        sortMode={sortMode}
        onChangeSortMode={setSortMode}
        plusAsSpace={plusAsSpace}
        onChangePlusAsSpace={setPlusAsSpace}
        showAssumedHttpsHint={showAssumedHttpsHint}
      />

      <main className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <UrlOverviewPanel
          lang={lang}
          hasInput={hasInput}
          inspected={inspected}
          sortMode={sortMode}
          displayedParams={displayedParams}
          selectedParamIndex={selectedParamIndex}
          onSelectParam={onSelectParam}
        />

        <UrlInspectorPanel
          lang={lang}
          selectedParam={selectedParam}
          extraDecodeCount={extraDecodeCount}
          onDecodeAgain={() => setExtraDecodeCount((c) => c + 1)}
          showJson={showJson}
          onToggleShowJson={() => setShowJson((v) => !v)}
          showNestedUrl={showNestedUrl}
          onToggleShowNestedUrl={() => setShowNestedUrl((v) => !v)}
          inspectorValue={inspectorValue}
          jsonPreview={jsonPreview}
          nestedUrlPreview={nestedUrlPreview}
          onOpenJsonViewer={() => (inspectorValue?.text ? openTool('json', inspectorValue.text) : undefined)}
          onOpenRedirectTracker={() => (inspectorValue?.text ? openTool('redirect', inspectorValue.text) : undefined)}
          inspectorExternalHref={inspectorValue?.text ? safeExternalHref(inspectorValue.text) : null}
        />
      </main>
    </div>
  );
}
