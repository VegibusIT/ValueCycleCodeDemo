import { useState, useEffect } from "react";

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  const [truckPos, setTruckPos] = useState(0);

  const isBefore = tab === "before";

  useEffect(() => { setStep(0); setTruckPos(0); }, [tab]);

  useEffect(() => {
    if (step !== 1) return;
    if (truckPos >= 100) { setStep(2); return; }
    const t = setTimeout(() => setTruckPos(p => p + 1), 40);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  const next = () => setStep(s => s + 1);
  const reset = () => { setStep(0); setTruckPos(0); };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Scope3 CO₂ サプライチェーン可視化
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              同じサプライチェーンで、何が変わるか
            </p>
          </div>

          {/* タブ */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button onClick={() => setTab("before")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isBefore ? "bg-white text-[#D85A30] shadow-sm" : "text-gray-400"
              }`}>
              従来のやり方
            </button>
            <button onClick={() => setTab("after")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                !isBefore ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-400"
              }`}>
              hydeの世界
            </button>
          </div>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2 mb-6">
          {["配送する", "CO₂が発生", isBefore ? "報告を求める" : "証明する", "結果"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                i < step
                  ? isBefore ? "bg-[#D85A30] text-white" : "bg-[#1D9E75] text-white"
                  : i === step
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-300"
              }`}>
                <span>{i < step ? "✓" : i + 1}</span>
                <span>{label}</span>
              </div>
              {i < 3 && <div className={`w-8 h-px ${
                i < step ? (isBefore ? "bg-[#D85A30]" : "bg-[#1D9E75]") : "bg-gray-200"
              }`} />}
            </div>
          ))}
        </div>

        {/* ===== Step 0: 配送前 ===== */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10">
            <div className="flex items-center justify-center gap-12 mb-8">
              {[
                { emoji: "🌾", name: "農場", desc: "原材料を生産" },
                { emoji: "🏭", name: "加工場", desc: "カット・パック" },
                { emoji: "🏪", name: "カスミ", desc: "店頭で販売" },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl mb-2">{node.emoji}</div>
                    <div className="font-bold text-gray-900">{node.name}</div>
                    <div className="text-xs text-gray-400">{node.desc}</div>
                  </div>
                  {i < 2 && <div className="text-3xl text-gray-300">→</div>}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-500 mb-6">
                この物流の各段階でCO₂が発生する。Scope3ではサプライチェーン全体の排出量を集計する必要がある。
              </p>
              <button onClick={next}
                className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                  isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"
                }`}>
                配送を開始する →
              </button>
            </div>
          </div>
        )}

        {/* ===== Step 1: 配送中 ===== */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10">
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-3xl">🌾</span>
              <span className="text-3xl">🏭</span>
              <span className="text-3xl">🏪</span>
            </div>
            <div className="relative h-16 bg-gray-50 rounded-xl mb-4">
              <div className="absolute top-1/2 left-6 right-6 h-px bg-gray-200 -translate-y-1/2" />
              <div className="absolute top-1/2 -translate-y-1/2 text-3xl"
                style={{ left: `${Math.min(truckPos, 90)}%`, transition: "none" }}>
                🚛
              </div>
            </div>
            <p className="text-center text-gray-400">配送中…各地点でCO₂が発生しています</p>
          </div>
        )}

        {/* ===== Step 2: CO2発生 — 各社の視点 ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: "🌾", name: "農場", input: "栽培面積・肥料・燃料", co2: "12.4", unit: "kg-CO₂/t" },
                { emoji: "🏭", name: "加工場", input: "電力・冷蔵・廃棄量", co2: "18.5", unit: "kg-CO₂/t" },
                { emoji: "🚛", name: "物流", input: "距離・積載率・車種", co2: "31.2", unit: "kg-CO₂/t" },
              ].map((company, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* ヘッダー */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{company.emoji}</span>
                      <span className="font-bold text-gray-900">{company.name}</span>
                    </div>
                  </div>

                  {/* 入力データ */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">入力データ</div>
                    <div className="text-sm text-gray-600">{company.input}</div>
                  </div>

                  {/* 算出されたCO2 */}
                  <div className="p-4">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">算出CO₂</div>
                    {isBefore ? (
                      <div>
                        <div className="font-mono font-bold text-2xl text-gray-900">
                          {company.co2}
                          <span className="text-xs font-normal text-gray-400 ml-1">{company.unit}</span>
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">⚠ この数値が外部に見える</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl">🔒</div>
                        <div className="text-xs text-[#1D9E75] mt-1">暗号化済み — 自社以外には見えない</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* カスミの視点 */}
            <div className={`rounded-2xl border p-6 ${
              isBefore ? "bg-white border-gray-200" : "bg-white border-[#1D9E75]/20"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏪</span>
                <span className="font-bold text-gray-900">カスミから見えるもの</span>
              </div>
              {isBefore ? (
                <div className="grid grid-cols-3 gap-4">
                  {["農場: 12.4 kg", "加工: 18.5 kg", "物流: 31.2 kg"].map((val, i) => (
                    <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                      <div className="font-mono font-bold text-gray-800">{val}</div>
                      <div className="text-[10px] text-yellow-600 mt-1">全社の数値が丸見え</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {["農場", "加工", "物流"].map((name, i) => (
                    <div key={i} className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-xl p-3 text-center">
                      <div className="text-xl mb-1">🔒</div>
                      <div className="text-xs text-[#1D9E75] font-bold">{name}: 基準以下 ✓</div>
                      <div className="text-[10px] text-gray-400 mt-1">数値は見えない</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <button onClick={next}
                className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                  isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"
                }`}>
                {isBefore ? "Scope3集計を試みる →" : "集計を実行する →"}
              </button>
            </div>
          </div>
        )}

        {/* ===== Step 3: 報告 or 証明 ===== */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {isBefore ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  「排出量を教えてください」
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Scope3算定のため、各サプライヤーにCO₂の実数値を要求した
                </p>
                <div className="max-w-2xl mx-auto space-y-3 mb-6">
                  {[
                    { who: "🌾 農場", say: "企業秘密です。競合に知られたら価格交渉で不利になります。" },
                    { who: "🏭 加工場", say: "うちだけ数値が高く見えたら、取引を切られるかもしれない。" },
                    { who: "🚛 物流", say: "データが改ざんされないか心配です。責任を負いたくない。" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[#D85A30]/5 rounded-xl">
                      <span className="text-lg shrink-0">{r.who}</span>
                      <span className="text-sm text-gray-600 flex-1">「{r.say}」</span>
                      <span className="text-[#D85A30] font-bold shrink-0">✕ 拒否</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  数値を見ずに、基準適合を証明する
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  ブロックチェーンで10年以上使われてきた暗号技術を組み合わせる
                </p>
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      tag: "hyde", color: "#378ADD", icon: "🔐",
                      title: "改ざん防止",
                      text: "センサーがTPMチップで電子署名。データは生まれた瞬間から改ざん不可能。",
                      origin: "TEE技術 — Intel SGX等でブロックチェーンのノード保護に使用されてきた",
                    },
                    {
                      tag: "argo", color: "#1D9E75", icon: "✓",
                      title: "ゼロ知識証明",
                      text: "数値を見せずに「基準値以下である」ことだけを数学的に証明。",
                      origin: "ZKP — Zcash(2016年〜)やEthereum L2で毎日数百万件処理されている技術",
                    },
                    {
                      tag: "plat", color: "#7F77DD", icon: "🔒",
                      title: "暗号のまま集計",
                      text: "暗号化されたまま足し算。復号しても合計しか分からない。",
                      origin: "FHE — Web3のプライバシー保護投票やオークションで実用化が進む技術",
                    },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl border p-5"
                      style={{ borderColor: s.color + "30", backgroundColor: s.color + "05" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: s.color }}>{s.tag}</span>
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{s.title}</div>
                      <p className="text-sm text-gray-600 mb-3">{s.text}</p>
                      <div className="text-[10px] text-gray-400 bg-white/50 rounded-lg p-2">
                        📎 {s.origin}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="text-center">
              <button onClick={next}
                className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                  isBefore ? "bg-[#D85A30] hover:bg-[#c04e28]" : "bg-[#1D9E75] hover:bg-[#178a63]"
                }`}>
                結果を見る →
              </button>
            </div>
          </div>
        )}

        {/* ===== Step 4: 結果 ===== */}
        {step === 4 && (
          <div className={`rounded-2xl p-10 ${
            isBefore ? "bg-white border border-gray-200" : "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          }`}>
            {isBefore ? (
              <div className="text-center max-w-lg mx-auto">
                <div className="text-5xl mb-4">😔</div>
                <div className="text-2xl font-bold text-[#D85A30] mb-3">Scope3 集計不可</div>
                <p className="text-gray-500 mb-6">
                  「見せてください」と頼む限り、サプライヤーは協力できない。<br />
                  実数値の開示を求めるアプローチには構造的な限界がある。
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["🌾 農場", "🏭 加工", "🚛 物流"].map((who, i) => (
                    <div key={i} className="bg-[#D85A30]/5 rounded-xl p-4 text-center">
                      <div>{who}</div>
                      <div className="text-[#D85A30] font-bold text-xl mt-1">✕</div>
                      <div className="text-[10px] text-gray-400 mt-1">報告拒否</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center max-w-2xl mx-auto">
                <div className="text-4xl font-bold text-[#5EDDA8] mb-3">
                  サプライチェーン全体 — 基準適合 ✓
                </div>
                <p className="text-slate-400 mb-6">
                  CO₂の実数値は誰にも見えていない。それでも集計できた。
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { who: "🌾 農場", input: "栽培・肥料データ" },
                    { who: "🏭 加工", input: "電力・冷蔵データ" },
                    { who: "🚛 物流", input: "距離・燃料データ" },
                  ].map((c, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="text-lg mb-1">{c.who}</div>
                      <div className="text-[#5EDDA8] font-bold text-2xl">✓</div>
                      <div className="text-[10px] text-slate-500 mt-1">CO₂: 非公開</div>
                      <div className="text-[10px] text-slate-600 mt-1">入力: {c.input}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-5 text-left grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>✓ 各社の数値を<strong className="text-white">見せずに</strong>証明した</div>
                  <div>✓ 暗号文のまま<strong className="text-white">集計</strong>した</div>
                  <div>✓ データは<strong className="text-white">改ざん不可能</strong></div>
                  <div>✓ 全社が<strong className="text-white">安心して参加</strong>できた</div>
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <button onClick={reset}
                className={`px-5 py-2 rounded-lg text-sm cursor-pointer ${
                  isBefore ? "bg-gray-100 text-gray-500" : "bg-white/10 text-slate-300"
                }`}>
                ↺ 最初から
              </button>
            </div>
          </div>
        )}

        {/* フッターサマリー */}
        <div className={`text-center mt-4 text-sm font-bold ${
          isBefore ? "text-[#D85A30]" : "text-[#1D9E75]"
        }`}>
          {isBefore
            ? "見せてください → 見せたくない → 集計できない"
            : "見なくても証明できる → 見なくても集計できる"
          }
        </div>

      </div>
    </div>
  );
}
