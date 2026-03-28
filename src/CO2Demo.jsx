import { useState, useEffect, useRef } from "react";

// 各社が持つデータ項目
const dataFields = [
  { key: "product", label: "品種名", example: ["トマト", "冷蔵便", "カット野菜", "チルド便"] },
  { key: "origin", label: "産地 / 拠点", example: ["茨城県", "関東圏", "千葉県", "関東圏"] },
  { key: "price", label: "取引価格", example: ["¥280/kg", "¥45,000/便", "¥320/kg", "¥38,000/便"], sensitive: true },
  { key: "pesticide", label: "農薬使用量", example: ["3.2 L/ha", "—", "1.8 L/ha", "—"], sensitive: true },
  { key: "co2", label: "CO₂排出量", example: ["12.4 kg", "15.8 kg", "18.5 kg", "15.4 kg"], sensitive: true },
  { key: "energy", label: "エネルギー使用量", example: ["840 kWh", "320 L軽油", "1,200 kWh", "280 L軽油"], sensitive: true },
];

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  const [truckPos, setTruckPos] = useState(0);
  const [sendProgress, setSendProgress] = useState([0, 0, 0, 0]);
  const bottomRef = useRef(null);

  const isBefore = tab === "before";

  useEffect(() => { setStep(0); setTruckPos(0); setSendProgress([0, 0, 0, 0]); }, [tab]);

  // Step 2: トラック走行
  useEffect(() => {
    if (step !== 2) return;
    if (truckPos >= 100) { setStep(3); return; }
    const t = setTimeout(() => setTruckPos(p => p + 1), 40);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  // Step 5: 送信アニメーション
  useEffect(() => {
    if (step !== 5) return;
    const interval = setInterval(() => {
      setSendProgress(prev => {
        const next = [...prev];
        let allDone = true;
        for (let i = 0; i < 4; i++) {
          const delay = i * 20;
          if (next[i] < 100) {
            if (next[i] === 0 && i > 0 && prev[i - 1] < delay) { allDone = false; continue; }
            next[i] = Math.min(next[i] + 2, 100);
            allDone = false;
          }
        }
        if (allDone) { clearInterval(interval); setTimeout(() => setStep(6), 400); }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step > 0) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
  }, [step]);

  const next = () => setStep(s => s + 1);
  const reset = () => { setStep(0); setTruckPos(0); setSendProgress([0, 0, 0, 0]); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const companies = [
    { emoji: "🌾", name: "農場", co2: 12.4, cooperates: true },
    { emoji: "🚛", name: "物流A", co2: 15.8, cooperates: false },
    { emoji: "🏭", name: "加工場", co2: 18.5, cooperates: true },
    { emoji: "🚛", name: "物流B", co2: 15.4, cooperates: false },
  ];
  const totalCo2 = companies.reduce((s, c) => s + c.co2, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ValueCycleCode</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isBefore
              ? "見せてください → 見せたくない → 集計できない"
              : "何を見せるか選べる → 全員が参加できる → 集計できる"
            }</p>
          </div>
          <div className="flex rounded-xl bg-gray-100 p-1 shrink-0">
            <button onClick={() => setTab("before")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isBefore ? "bg-white text-[#D85A30] shadow-sm" : "text-gray-400"
              }`}>従来</button>
            <button onClick={() => setTab("after")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                !isBefore ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-400"
              }`}>hydeの世界</button>
          </div>
        </div>

        {/* ===== Step 0: サプライチェーン ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">サプライチェーン</h2>
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            {companies.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                </div>
                <div className="text-xl text-gray-300">→</div>
              </div>
            ))}
            <div className="text-center">
              <div className="text-3xl mb-1">🏪</div>
              <div className="font-bold text-gray-900 text-sm">小売</div>
              <div className="text-xs text-gray-400">Scope3集計</div>
            </div>
          </div>
          {step === 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">各段階でCO₂が発生する。Scope3ではサプライチェーン全体の排出量を集計する必要がある。</p>
              <button onClick={next} className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"}`}>
                {isBefore ? "報告を依頼する →" : "契約を結ぶ →"}
              </button>
            </div>
          )}
        </div>

        {/* ===== Step 1: 契約フェーズ ===== */}
        {step >= 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ① {isBefore ? "報告依頼 — 「全部見せてください」" : "データ共有契約 — 何を見せて、何を隠すか"}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {isBefore
                ? "従来は全データの開示を求めるしかなかった。"
                : "hydeの世界では、項目ごとに「公開」「証明のみ」「暗号集計」を選べる。"}
            </p>

            {/* データ項目テーブル */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">データ項目</th>
                    {companies.map((c, i) => (
                      <th key={i} className="text-center py-2 px-3 text-gray-500 font-medium">
                        {c.emoji} {c.name}
                      </th>
                    ))}
                    <th className="text-center py-2 px-3 text-gray-500 font-medium">🏪 小売が見る</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFields.map((field, fi) => (
                    <tr key={fi} className="border-b border-gray-50">
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-gray-700">{field.label}</span>
                        {field.sensitive && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-600">機密</span>
                        )}
                      </td>
                      {companies.map((_, ci) => (
                        <td key={ci} className="text-center py-2.5 px-3">
                          <span className="font-mono text-xs text-gray-600">{field.example[ci]}</span>
                        </td>
                      ))}
                      <td className="text-center py-2.5 px-3">
                        {isBefore ? (
                          // 従来: 全部見える or 拒否
                          field.sensitive ? (
                            <span className="text-xs px-2 py-1 rounded bg-[#D85A30]/10 text-[#D85A30] font-bold">
                              全開示を要求
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                              公開
                            </span>
                          )
                        ) : (
                          // hyde: 項目ごとに選べる
                          field.key === "co2" || field.key === "energy" ? (
                            <span className="text-xs px-2 py-1 rounded bg-[#7F77DD]/10 text-[#7F77DD] font-bold">
                              🔒 暗号集計
                            </span>
                          ) : field.sensitive ? (
                            <span className="text-xs px-2 py-1 rounded bg-[#1D9E75]/10 text-[#1D9E75] font-bold">
                              ✓ 証明のみ
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                              公開
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 凡例 */}
            {!isBefore && (
              <div className="flex gap-4 mt-4 text-xs text-gray-500 justify-center">
                <span><span className="inline-block w-3 h-3 rounded bg-gray-100 mr-1" /> 公開 — そのまま見える</span>
                <span><span className="inline-block w-3 h-3 rounded bg-[#1D9E75]/20 mr-1" /> 証明のみ — 基準適合だけ証明、数値は非公開</span>
                <span><span className="inline-block w-3 h-3 rounded bg-[#7F77DD]/20 mr-1" /> 暗号集計 — 暗号化したまま合計、個社値は非公開</span>
              </div>
            )}

            {step === 1 && (
              <div className="text-center mt-6">
                <button onClick={next} className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"}`}>
                  配送を開始する →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 2: 配送中 ===== */}
        {step >= 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">② 配送</h2>
            <div className="flex justify-between items-center px-4 mb-1 text-sm text-gray-400">
              <span>🌾 農場</span><span>🚛</span><span>🏭 加工場</span><span>🚛</span><span>🏪 小売</span>
            </div>
            <div className="relative h-12 bg-gray-50 rounded-xl">
              <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-200 -translate-y-1/2" />
              <div className="absolute top-1/2 -translate-y-1/2 text-2xl"
                style={{ left: `${Math.min(step === 2 ? truckPos : 90, 90)}%`, transition: "none" }}>🚛</div>
            </div>
            {step === 2 && <p className="text-center text-sm text-gray-400 mt-2">配送中…CO₂が発生しています</p>}
          </div>
        )}

        {/* ===== Step 3: 各社がデータ入力（平文） ===== */}
        {step >= 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">③ 各社がデータを入力</h2>
            <p className="text-sm text-gray-400 mb-4">この時点では各社の手元に平文（そのままの数値）がある。</p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {companies.map((c, ci) => (
                <div key={ci} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {dataFields.map((f, fi) => (
                      <div key={fi} className="flex justify-between text-xs">
                        <span className="text-gray-400">{f.label}</span>
                        <span className="font-mono text-gray-700">{f.example[ci]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 text-center">👀 自社のみ閲覧可</div>
                </div>
              ))}
            </div>

            {step === 3 && (
              <div className="text-center">
                <button onClick={() => setStep(4)} className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"}`}>
                  {isBefore ? "小売に報告する →" : "契約に従って暗号化・送信する →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 4: 暗号化処理（hydeのみ可視化） ===== */}
        {step >= 4 && !isBefore && (
          <div className="bg-white rounded-2xl border border-[#1D9E75]/20 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">④ 契約に従って暗号化</h2>
            <p className="text-sm text-gray-400 mb-4">各項目が契約通りに処理される。</p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {companies.map((c, ci) => (
                <div key={ci} className="rounded-xl border border-[#1D9E75]/20 p-4 bg-[#1D9E75]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {dataFields.map((f, fi) => (
                      <div key={fi} className="flex justify-between text-xs">
                        <span className="text-gray-400">{f.label}</span>
                        {f.key === "co2" || f.key === "energy" ? (
                          <span className="text-[#7F77DD] font-bold">🔒 暗号化</span>
                        ) : f.sensitive ? (
                          <span className="text-[#1D9E75] font-bold">✓ 証明生成</span>
                        ) : (
                          <span className="font-mono text-gray-700">{f.example[ci]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {step === 4 && (
              <div className="text-center">
                <button onClick={() => setStep(5)} className="px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer bg-[#1D9E75] hover:bg-[#178a63]">
                  送信する →
                </button>
              </div>
            )}
          </div>
        )}

        {/* 従来: step4で拒否を表示してからstep5へ */}
        {step >= 4 && isBefore && step < 5 && (
          <div className="bg-[#D85A30]/5 rounded-2xl border border-[#D85A30]/20 p-6">
            <h2 className="text-lg font-bold text-[#D85A30] mb-4">④ 一部の企業がデータ送信を拒否</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {companies.map((c, i) => (
                <div key={i} className={`rounded-xl border p-4 text-center ${
                  c.cooperates ? "bg-white border-green-200" : "bg-white border-[#D85A30]/30"
                }`}>
                  <div className="text-2xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-sm text-gray-900">{c.name}</div>
                  {c.cooperates ? (
                    <div className="mt-2">
                      <div className="text-green-600 font-bold">送信OK</div>
                      <div className="font-mono text-xs text-gray-600 mt-1">{c.co2} kg</div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-[#D85A30] font-bold text-lg">🚫</div>
                      <div className="text-[#D85A30] font-bold text-sm">送りません！</div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {i === 1 ? "運賃交渉で不利になる" : "改ざんが心配"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setStep(6)} className="px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer bg-[#D85A30] hover:bg-[#c04e28]">
                結果を見る →
              </button>
            </div>
          </div>
        )}

        {/* ===== Step 5: 送信アニメーション（hydeのみ） ===== */}
        {step >= 5 && !isBefore && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {isBefore ? "④ 小売へ送信" : "⑤ 小売へ送信"}
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {companies.map((c, i) => (
                <div key={i} className="text-center">
                  <div className={`rounded-xl border p-3 mb-2 ${isBefore ? "border-gray-200" : "border-[#1D9E75]/20"}`}>
                    <div className="text-lg">{c.emoji} {c.name}</div>
                  </div>
                  <div className="relative h-28 flex justify-center">
                    <div className="w-px h-full bg-gray-200" />
                    {sendProgress[i] > 0 && sendProgress[i] < 100 && (
                      <div className="absolute w-full flex justify-center"
                        style={{ top: `${sendProgress[i]}%`, transform: "translateY(-50%)" }}>
                        <div className={`px-2 py-1 rounded text-xs font-bold text-white ${isBefore ? "bg-gray-700" : "bg-[#1D9E75]"}`}>
                          {isBefore ? `${c.co2}kg` : "🔒"}
                        </div>
                      </div>
                    )}
                    {!isBefore && (
                      <div className="absolute top-[15%] -translate-y-1/2 flex items-center gap-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          sendProgress[i] > 15 ? "bg-[#1D9E75] text-white" : "bg-gray-100 text-gray-300"
                        }`}>🔐</div>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-xl border p-3 mt-2 ${
                    sendProgress[i] >= 100
                      ? isBefore ? "border-yellow-300 bg-yellow-50" : "border-[#1D9E75]/30 bg-[#1D9E75]/5"
                      : "border-gray-100 bg-gray-50"
                  }`}>
                    <div className="text-xs text-gray-400 mb-1">🏪 小売</div>
                    {sendProgress[i] >= 100 ? (
                      isBefore ? (
                        <div className="font-mono font-bold text-sm text-gray-900">{c.co2} kg</div>
                      ) : (
                        <div className="text-lg">🔒</div>
                      )
                    ) : (
                      <div className="text-gray-300 text-xs">…</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== Step 6: 結果 ===== */}
        {step >= 6 && (
          <>
            {isBefore ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">⑤ 結果</h2>
                <p className="text-sm text-gray-400 mb-4">協力してくれる会社もあるが、拒否する会社もある。</p>
                <div className="space-y-3 mb-6 max-w-2xl">
                  {[
                    { ok: true, say: "うちは出せます" },
                    { ok: false, say: "排出量を知られたら運賃交渉で不利になる" },
                    { ok: true, say: "透明性は大事なので協力します" },
                    { ok: false, say: "改ざんが心配。責任を負いたくない" },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${r.ok ? "bg-green-50" : "bg-[#D85A30]/5"}`}>
                      <span className="text-lg shrink-0">{companies[i].emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-700">{companies[i].name}</div>
                        <div className="text-sm text-gray-600">「{r.say}」</div>
                      </div>
                      {r.ok ? <span className="text-green-600 font-bold shrink-0">○</span> : <span className="text-[#D85A30] font-bold shrink-0">✕</span>}
                    </div>
                  ))}
                </div>
                <div className="bg-[#D85A30]/5 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">😔</div>
                  <div className="text-xl font-bold text-[#D85A30] mb-2">Scope3 集計不完全</div>
                  <p className="text-sm text-gray-500 mb-4">一社でも欠けるとサプライチェーン全体の算定ができない。</p>
                  <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                    {companies.map((c, i) => (
                      <div key={i} className={`rounded-xl p-3 text-center border ${c.cooperates ? "bg-white border-green-200" : "bg-white border-[#D85A30]/20"}`}>
                        <div>{c.emoji} {c.name}</div>
                        {c.cooperates ? <div className="text-green-600 font-bold text-xl">○</div> : <div className="text-[#D85A30] font-bold text-xl">✕</div>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    報告率: {companies.filter(c => c.cooperates).length}/{companies.length}社 → <strong className="text-[#D85A30]">全体集計は不可能</strong>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <button onClick={reset} className="px-5 py-2 rounded-lg text-sm cursor-pointer bg-gray-100 text-gray-500">↺ 最初から</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 結果 */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
                  <h2 className="text-lg font-bold text-white mb-4">⑥ 結果</h2>
                  <div className="text-center mb-6">
                    <div className="text-sm text-slate-400 mb-1">サプライチェーン CO₂ 集計値</div>
                    <div className="text-6xl font-bold text-[#5EDDA8] my-2">
                      {totalCo2.toFixed(1)}<span className="text-2xl ml-1">kg</span>
                    </div>
                    <div className="text-sm text-slate-400">{companies.length}社合計 — 基準適合 ✓</div>
                  </div>

                  {/* 小売が見えるもの */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="text-sm font-bold text-white mb-3">🏪 小売が見えるもの</div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-1.5 text-slate-400">項目</th>
                          {companies.map((c, i) => <th key={i} className="text-center py-1.5 text-slate-400">{c.emoji} {c.name}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {dataFields.map((f, fi) => (
                          <tr key={fi} className="border-b border-white/5">
                            <td className="py-1.5 text-slate-300">{f.label}</td>
                            {companies.map((_, ci) => (
                              <td key={ci} className="text-center py-1.5">
                                {f.key === "co2" || f.key === "energy" ? (
                                  <span className="text-[#7F77DD]">🔒</span>
                                ) : f.sensitive ? (
                                  <span className="text-[#5EDDA8]">✓</span>
                                ) : (
                                  <span className="text-slate-300">{f.example[ci]}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="border-t border-white/20">
                          <td className="py-2 text-white font-bold">CO₂合計</td>
                          <td colSpan={4} className="text-center py-2 text-[#5EDDA8] font-bold text-lg">
                            {totalCo2.toFixed(1)} kg（暗号文から復号した合計値のみ）
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-left grid grid-cols-2 gap-2 text-sm text-slate-300 max-w-lg mx-auto">
                    <div>✓ <strong className="text-white">合計値</strong>は分かる</div>
                    <div>✓ <strong className="text-white">個社の内訳</strong>は見えない</div>
                    <div>✓ 機密データは<strong className="text-white">契約通りに保護</strong></div>
                    <div>✓ 全社が<strong className="text-white">安心して参加</strong>できた</div>
                  </div>

                  <div className="text-center mt-6">
                    <button onClick={reset} className="px-5 py-2 rounded-lg text-sm cursor-pointer bg-white/10 text-slate-300">↺ 最初から</button>
                  </div>
                </div>

                {/* なぜできるのか */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">なぜ、数値を見せずに集計できるのか？</h2>
                  <p className="text-sm text-gray-400 mb-6">3つの暗号技術の組み合わせ。すべてブロックチェーンで10年以上の実績がある。</p>
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#378ADD] flex items-center justify-center text-white font-bold text-sm shrink-0">hyde</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">データが本物であることを保証する</div>
                        <p className="text-sm text-gray-600 mb-2">各社のIoTセンサーに搭載されたTPMチップが、計測した瞬間にデータに電子署名する。<strong>機械が直接署名する</strong>ので改ざんが検知できる。</p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">📎 TEE — Intel SGX等でブロックチェーンのノード保護に使われてきた技術</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#1D9E75] flex items-center justify-center text-white font-bold text-sm shrink-0">argo</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">数値を見せずに「基準以下」を証明する</div>
                        <p className="text-sm text-gray-600 mb-2">「私の年収は500万以上です」と証明したいとき、給与明細を見せなくても数学的に証明できる技術。同じ原理で<strong>CO₂が基準値以下であることだけ</strong>を証明する。</p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">📎 ZKP — Zcash（2016年〜）やEthereum L2で毎日数百万件処理されている技術</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#7F77DD] flex items-center justify-center text-white font-bold text-sm shrink-0">plat</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">暗号化したまま足し算する</div>
                        <p className="text-sm text-gray-600 mb-2">通常、暗号データを足すには復号が必要。準同型暗号（FHE）は<strong>暗号文のまま足し算</strong>ができる。復号しても合計値しか分からない。</p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">📎 FHE — Web3のプライバシー保護投票やオンチェーンオークションで実用化が進む技術</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
