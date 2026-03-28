import { useState, useEffect } from "react";

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  const [truckPos, setTruckPos] = useState(0);

  const isBefore = tab === "before";

  // タブ切り替えでリセット
  useEffect(() => {
    setStep(0);
    setTruckPos(0);
  }, [tab]);

  // step 1 のみアニメーション（トラック走行）
  useEffect(() => {
    if (step !== 1) return;
    if (truckPos >= 100) {
      setStep(2);
      return;
    }
    const t = setTimeout(() => setTruckPos(p => p + 3), 30);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  const next = () => setStep(s => s + 1);
  const reset = () => { setStep(0); setTruckPos(0); };

  // ステップごとのラベル
  const stepLabels = isBefore
    ? ["配送する", "CO₂が発生する", "報告を求める", "結果"]
    : ["配送する", "CO₂が発生する", "証明する", "結果"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        <h1 className="text-center text-lg font-bold text-gray-900 mb-1">
          Scope3 CO₂ 可視化
        </h1>
        <p className="text-center text-xs text-gray-400 mb-5">
          同じサプライチェーンで、何が変わるか
        </p>

        {/* タブ */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setTab("before")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              isBefore ? "bg-white text-[#D85A30] shadow-sm" : "text-gray-400"
            }`}
          >
            従来
          </button>
          <button
            onClick={() => setTab("after")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              !isBefore ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-400"
            }`}
          >
            hydeの世界
          </button>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < step
                  ? isBefore ? "bg-[#D85A30] text-white" : "bg-[#1D9E75] text-white"
                  : i === step
                  ? "bg-gray-300 text-white"
                  : "bg-gray-100 text-gray-300"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-px ${i < step ? (isBefore ? "bg-[#D85A30]" : "bg-[#1D9E75]") : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Step 0: 配送前 */}
          {step === 0 && (
            <div className="p-6 text-center">
              <div className="flex justify-center gap-8 mb-4">
                <div><div className="text-3xl">🌾</div><div className="text-xs text-gray-400">農場</div></div>
                <div className="text-gray-300 self-center text-xl">→</div>
                <div><div className="text-3xl">🏭</div><div className="text-xs text-gray-400">加工</div></div>
                <div className="text-gray-300 self-center text-xl">→</div>
                <div><div className="text-3xl">🏪</div><div className="text-xs text-gray-400">カスミ</div></div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                農場から加工場を経てカスミに届く。<br />
                この物流でCO₂が発生する。
              </p>
              <button onClick={next}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer ${
                  isBefore ? "bg-slate-700 hover:bg-slate-600" : "bg-[#1D9E75] hover:bg-[#178a63]"
                }`}>
                配送を開始する →
              </button>
            </div>
          )}

          {/* Step 1: 配送中 */}
          {step === 1 && (
            <div className="p-6">
              <div className="flex justify-between items-center px-1 mb-1">
                <span className="text-lg">🌾</span>
                <span className="text-lg">🏭</span>
                <span className="text-lg">🏪</span>
              </div>
              <div className="relative h-12 bg-gray-50 rounded-lg mb-3">
                <div className="absolute top-1/2 left-3 right-3 h-px bg-gray-200 -translate-y-1/2" />
                <div className="absolute top-1/2 -translate-y-1/2 text-xl"
                  style={{ left: `${Math.min(truckPos, 88)}%`, transition: "none" }}>
                  🚛
                </div>
              </div>
              <p className="text-center text-sm text-gray-400">配送中…CO₂が発生しています</p>
            </div>
          )}

          {/* Step 2: CO2が発生した */}
          {step === 2 && (
            <div className="p-6">
              <p className="text-center text-sm text-gray-500 mb-4">
                配送完了。各社でCO₂が発生した。
              </p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {["農場", "加工", "物流"].map((name, i) => (
                  <div key={i} className={`text-center p-3 rounded-xl ${
                    isBefore ? "bg-gray-50" : "bg-[#1D9E75]/5"
                  }`}>
                    <div className="text-xs text-gray-400 mb-1">{name}</div>
                    {isBefore ? (
                      <div className="font-mono font-bold text-xl text-gray-800">
                        {[12.4, 18.5, 31.2][i]}
                        <span className="text-[10px] font-normal text-gray-400 ml-0.5">kg</span>
                      </div>
                    ) : (
                      <div className="text-2xl">🔒</div>
                    )}
                  </div>
                ))}
              </div>

              <div className={`text-center text-sm p-3 rounded-lg mb-4 ${
                isBefore ? "bg-yellow-50 text-yellow-700" : "bg-[#1D9E75]/5 text-[#1D9E75]"
              }`}>
                {isBefore
                  ? "⚠ CO₂の実数値が丸見えになっている"
                  : "🔒 CO₂の実数値は暗号化されている"
                }
              </div>

              <div className="text-center">
                <button onClick={next}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer ${
                    isBefore ? "bg-slate-700 hover:bg-slate-600" : "bg-[#1D9E75] hover:bg-[#178a63]"
                  }`}>
                  {isBefore ? "報告を求める →" : "証明を開始する →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 報告 or 証明 */}
          {step === 3 && (
            <div className="p-6">
              {isBefore ? (
                <>
                  <p className="text-center text-sm font-bold text-gray-700 mb-4">
                    「CO₂排出量を教えてください」
                  </p>
                  <div className="space-y-3 mb-5">
                    {[
                      { who: "🌾 農場", say: "企業秘密なので見せられません" },
                      { who: "🏭 加工", say: "競合に知られたくありません" },
                      { who: "🚛 物流", say: "改ざんされないか心配です" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-[#D85A30]/5 rounded-xl">
                        <span className="shrink-0">{r.who}</span>
                        <span className="text-sm text-gray-600 flex-1">「{r.say}」</span>
                        <span className="text-[#D85A30] font-bold text-sm shrink-0">✕</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center text-sm font-bold text-gray-700 mb-4">
                    数値を見せずに、基準適合を証明する
                  </p>
                  <div className="space-y-3 mb-5">
                    {[
                      { tag: "hyde", color: "#378ADD", icon: "🔐",
                        title: "改ざん防止",
                        text: "センサーがTPMチップで署名。人間は触れない。" },
                      { tag: "argo", color: "#1D9E75", icon: "✓",
                        title: "ゼロ知識証明",
                        text: "数値を見せずに「基準以下」だけを証明。" },
                      { tag: "plat", color: "#7F77DD", icon: "🔒",
                        title: "暗号のまま集計",
                        text: "暗号文のまま足し算。中身は誰にも見えない。" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: s.color + "08" }}>
                        <span className="text-xl shrink-0">{s.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                              style={{ backgroundColor: s.color }}>{s.tag}</span>
                            <span className="text-sm font-bold text-gray-700">{s.title}</span>
                          </div>
                          <div className="text-xs text-gray-500">{s.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="text-center">
                <button onClick={next}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer ${
                    isBefore ? "bg-[#D85A30] hover:bg-[#c04e28]" : "bg-[#1D9E75] hover:bg-[#178a63]"
                  }`}>
                  結果を見る →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: 結果 */}
          {step === 4 && (
            <div className={`p-6 ${isBefore ? "" : "bg-slate-900 text-white"}`}>
              {isBefore ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">😔</div>
                  <div className="text-xl font-bold text-[#D85A30] mb-2">集計できない</div>
                  <p className="text-sm text-gray-500 mb-2">
                    「見せてください」と頼む限り、<br />
                    サプライヤーは協力できない。
                  </p>
                  <div className="bg-[#D85A30]/5 rounded-xl p-3 text-xs text-gray-500">
                    報告率: 0 / 3社 → Scope3 算定不可
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#5EDDA8] mb-2">
                    全社適合 ✓
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    CO₂の実数値は<strong className="text-white">誰にも見えていない</strong>。<br />
                    それでも<strong className="text-white">集計できた</strong>。
                  </p>
                  <div className="flex justify-center gap-3 mb-3">
                    {["🌾 農場", "🏭 加工", "🚛 物流"].map((who, i) => (
                      <div key={i} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                        <div className="text-sm">{who}</div>
                        <div className="text-[#5EDDA8] font-bold text-lg">✓</div>
                        <div className="text-[10px] text-slate-500">数値: 非公開</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-xs text-slate-400 text-left space-y-1">
                    <div>✓ 数値を<strong className="text-white">見せずに</strong>証明した</div>
                    <div>✓ 暗号文のまま<strong className="text-white">集計</strong>した</div>
                    <div>✓ データは<strong className="text-white">改ざん不可能</strong></div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <button onClick={reset}
                  className={`px-4 py-1.5 rounded-lg text-xs cursor-pointer ${
                    isBefore ? "bg-gray-100 text-gray-500" : "bg-white/10 text-slate-300"
                  }`}>
                  ↺ 最初から
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 一言サマリー */}
        <div className={`text-center mt-3 text-xs font-medium ${
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
