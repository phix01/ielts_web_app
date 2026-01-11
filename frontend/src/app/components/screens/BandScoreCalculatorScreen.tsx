import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

function roundIelts(value: number) {
  // Round to nearest 0.5 following IELTS rules
  const floor = Math.floor(value);
  const frac = value - floor;
  if (frac < 0.25) return Math.round(floor * 2) / 2.0;
  if (frac < 0.75) return floor + 0.5;
  return Math.round((floor + 1) * 2) / 2.0;
}

// Simple demo mapping: 0..40 -> 0.0..9.0 approximately
const buildLinearMapping = (maxCorrect = 40) => {
  const map: number[] = [];
  for (let i = 0; i <= maxCorrect; i++) {
    const band = Math.round(((i / maxCorrect) * 9.0) * 2) / 2; // steps of 0.5
    map.push(band);
  }
  return map;
};

const LISTENING_MAP = buildLinearMapping(40);
const GENERAL_READING_MAP = buildLinearMapping(40);
const ACADEMIC_READING_MAP = buildLinearMapping(40);

export default function BandScoreCalculatorScreen() {
  const [listeningCorrect, setListeningCorrect] = useState<number | ''>('');
  const [listeningBand, setListeningBand] = useState<number | null>(null);

  const [gReadingCorrect, setGReadingCorrect] = useState<number | ''>('');
  const [gReadingBand, setGReadingBand] = useState<number | null>(null);

  const [aReadingCorrect, setAReadingCorrect] = useState<number | ''>('');
  const [aReadingBand, setAReadingBand] = useState<number | null>(null);

  const bands = Array.from({ length: 19 }, (_, i) => i * 0.5); // 0..9 by 0.5
  const [lSel, setLSel] = useState<number | ''>('');
  const [rSel, setRSel] = useState<number | ''>('');
  const [wSel, setWSel] = useState<number | ''>('');
  const [sSel, setSSel] = useState<number | ''>('');
  const [overall, setOverall] = useState<number | null>(null);

  const calcBandFromMap = (correct: number, map: number[]) => {
    const c = Math.max(0, Math.min(map.length - 1, Math.round(correct)));
    return map[c];
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold uppercase">IELTS BAND SCORE CALCULATORS</h1>
        <p className="text-sm text-gray-600">Use the IELTS Band score calculators below to calculate your score.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="border border-orange-200">
            <CardHeader>
              <CardTitle>Listening Score Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <input type="number" min={0} max={40} value={listeningCorrect as any} onChange={(e) => setListeningCorrect(e.target.value === '' ? '' : Math.max(0, Math.min(40, parseInt(e.target.value || '0'))))} className="border px-3 py-2 rounded w-32" />
                <div className="text-sm text-gray-600">of 40</div>
                <div className="flex-1" />
                <button onClick={() => { setListeningBand(listeningCorrect === '' ? null : calcBandFromMap(Number(listeningCorrect), LISTENING_MAP)); }} className="px-3 py-2 bg-green-600 text-white rounded">Calculate</button>
                <button onClick={() => { setListeningCorrect(''); setListeningBand(null); }} className="px-3 py-2 bg-gray-700 text-white rounded">Reset</button>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {listeningBand != null ? <div>Estimated band: <span className="font-semibold">{listeningBand.toFixed(1)}</span></div> : <div className="text-xs text-gray-500">Note: Band conversion table is for demo purposes.</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardHeader>
              <CardTitle>General Reading Score Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <input type="number" min={0} max={40} value={gReadingCorrect as any} onChange={(e) => setGReadingCorrect(e.target.value === '' ? '' : Math.max(0, Math.min(40, parseInt(e.target.value || '0'))))} className="border px-3 py-2 rounded w-32" />
                <div className="text-sm text-gray-600">of 40</div>
                <div className="flex-1" />
                <button onClick={() => { setGReadingBand(gReadingCorrect === '' ? null : calcBandFromMap(Number(gReadingCorrect), GENERAL_READING_MAP)); }} className="px-3 py-2 bg-green-600 text-white rounded">Calculate</button>
                <button onClick={() => { setGReadingCorrect(''); setGReadingBand(null); }} className="px-3 py-2 bg-gray-700 text-white rounded">Reset</button>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {gReadingBand != null ? <div>Estimated band: <span className="font-semibold">{gReadingBand.toFixed(1)}</span></div> : <div className="text-xs text-gray-500">Note: Band conversion table is for demo purposes.</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardHeader>
              <CardTitle>Academic Reading Score Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <input type="number" min={0} max={40} value={aReadingCorrect as any} onChange={(e) => setAReadingCorrect(e.target.value === '' ? '' : Math.max(0, Math.min(40, parseInt(e.target.value || '0'))))} className="border px-3 py-2 rounded w-32" />
                <div className="text-sm text-gray-600">of 40</div>
                <div className="flex-1" />
                <button onClick={() => { setAReadingBand(aReadingCorrect === '' ? null : calcBandFromMap(Number(aReadingCorrect), ACADEMIC_READING_MAP)); }} className="px-3 py-2 bg-green-600 text-white rounded">Calculate</button>
                <button onClick={() => { setAReadingCorrect(''); setAReadingBand(null); }} className="px-3 py-2 bg-gray-700 text-white rounded">Reset</button>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {aReadingBand != null ? <div>Estimated band: <span className="font-semibold">{aReadingBand.toFixed(1)}</span></div> : <div className="text-xs text-gray-500">Note: Band conversion table is for demo purposes.</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="border border-orange-200 h-full">
            <CardHeader>
              <CardTitle>Overall Band Score Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Listening Band</label>
                  <select value={lSel as any} onChange={(e) => setLSel(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full border rounded px-2 py-2 mt-1">
                    <option value="">Select</option>
                    {bands.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Reading Band</label>
                  <select value={rSel as any} onChange={(e) => setRSel(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full border rounded px-2 py-2 mt-1">
                    <option value="">Select</option>
                    {bands.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Writing Band</label>
                  <select value={wSel as any} onChange={(e) => setWSel(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full border rounded px-2 py-2 mt-1">
                    <option value="">Select</option>
                    {bands.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Speaking Band</label>
                  <select value={sSel as any} onChange={(e) => setSSel(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full border rounded px-2 py-2 mt-1">
                    <option value="">Select</option>
                    {bands.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
                  </select>
                </div>

                <div className="flex space-x-2 mt-2">
                  <button onClick={() => {
                    const vals = [lSel, rSel, wSel, sSel].map(v => v === '' ? null : Number(v));
                    if (vals.some(v => v == null)) { setOverall(null); return; }
                    const avg = (vals[0]! + vals[1]! + vals[2]! + vals[3]!) / 4.0;
                    setOverall(roundIelts(avg));
                  }} className="px-3 py-2 bg-green-600 text-white rounded">Calculate</button>
                  <button onClick={() => { setLSel(''); setRSel(''); setWSel(''); setSSel(''); setOverall(null); }} className="px-3 py-2 bg-gray-700 text-white rounded">Reset</button>
                </div>

                <div className="mt-4">
                  {overall != null ? <div className="text-lg font-semibold">Overall band: {overall.toFixed(1)}</div> : <div className="text-sm text-gray-500">Select all four bands to calculate overall score.</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
