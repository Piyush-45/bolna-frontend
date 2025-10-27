export default function CostBreakdown({ costs, duration }) {
  const costItems = [
    { label: 'Speech-to-Text', sublabel: 'OpenAI Whisper', value: costs.stt, color: 'bg-green-500' },
    { label: 'AI Processing', sublabel: 'GPT-4o', value: costs.llm, color: 'bg-blue-500' },
    { label: 'Text-to-Speech', sublabel: 'Sarvam.ai', value: costs.tts, color: 'bg-orange-500' },
    { label: 'Telephony', sublabel: 'Plivo Voice', value: costs.telephony, color: 'bg-purple-500' },
    { label: 'Infrastructure', sublabel: 'AWS Hosting', value: costs.infrastructure, color: 'bg-red-500', highlight: true },
  ];

  const maxCost = Math.max(...costItems.map(item => item.value));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">💰 Cost Breakdown</h3>

      <div className="space-y-4">
        {costItems.map((item, index) => (
          <div
            key={index}
            className={`${item.highlight ? 'bg-blue-50 -mx-2 px-2 py-2 rounded' : ''}`}
          >
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className={`text-sm font-medium ${item.highlight ? 'text-blue-900' : 'text-gray-700'}`}>
                  {item.label}
                </p>
                {/* <p className={`text-xs ${item.highlight ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.sublabel}
                </p> */}
              </div>
              <span className={`text-sm font-semibold ${item.highlight ? 'text-blue-900' : 'text-gray-900'}`}>
                ${item.value.toFixed(4)}
              </span>
            </div>

            {/* Visual bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxCost) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold text-gray-900">Total Cost</p>
              <p className="text-xs text-gray-500">{duration}s call duration</p>
            </div>
            <span className="text-xl font-bold text-green-600">
              ${costs.total.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* POC Info */}
      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-1">📊 POC Pricing Model</p>
          <p className="text-xs text-blue-700">
            Infrastructure cost: $2.60/call (based on $65/month ÷ 25 calls)
          </p>
        </div>
      </div> */}
    </div>
  );
}
