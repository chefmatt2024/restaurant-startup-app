import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calculator, MapPin, DollarSign, TrendingUp, AlertTriangle, Info, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FormField from '../ui/FormField';

const RentCalculator = () => {
  const { state, actions } = useApp();
  const data = state.financialData;
  const [squareFootage, setSquareFootage] = useState(data?.restaurantOperations?.squareFootage || 2000);
  const [rentPerSqFt, setRentPerSqFt] = useState(data?.operatingExpenses?.rentPerSqFt || 45);
  const [leaseTerm, setLeaseTerm] = useState(5); // years
  const [annualIncrease, setAnnualIncrease] = useState(3); // percentage
  const [location, setLocation] = useState('boston'); // boston, cambridge, somerville, etc.
  const [includeCam, setIncludeCam] = useState(true); // Common Area Maintenance
  const [camPerSqFt, setCamPerSqFt] = useState(8); // CAM charges per sq ft
  const [includeUtilities, setIncludeUtilities] = useState(false);
  const [utilitiesPerSqFt, setUtilitiesPerSqFt] = useState(8);

  // Location-based rent benchmarks (per sq ft annually) - constant object
  const locationBenchmarks = useMemo(() => ({
    boston: { min: 35, avg: 45, max: 65, name: 'Boston' },
    cambridge: { min: 40, avg: 50, max: 70, name: 'Cambridge' },
    somerville: { min: 30, avg: 40, max: 55, name: 'Somerville' },
    brookline: { min: 38, avg: 48, max: 68, name: 'Brookline' },
    newton: { min: 35, avg: 45, max: 60, name: 'Newton' },
    other: { min: 25, avg: 35, max: 50, name: 'Other' }
  }), []);

  // Calculate rent projections
  const rentCalculations = useMemo(() => {
    const baseRent = squareFootage * rentPerSqFt;
    const camCost = includeCam ? squareFootage * camPerSqFt : 0;
    const utilitiesCost = includeUtilities ? squareFootage * utilitiesPerSqFt : 0;
    const baseTotal = baseRent + camCost + utilitiesCost;

    // Calculate year-by-year with increases
    const yearlyBreakdown = [];
    let totalRent = 0;

    for (let year = 1; year <= leaseTerm; year++) {
      // Base rent with compound growth
      const yearRent = baseRent * Math.pow(1 + annualIncrease / 100, year - 1);
      
      // CAM and utilities with compound growth (matching base rent)
      const yearCam = includeCam ? squareFootage * camPerSqFt * Math.pow(1 + annualIncrease / 100, year - 1) : 0;
      const yearUtilities = includeUtilities ? squareFootage * utilitiesPerSqFt * Math.pow(1 + annualIncrease / 100, year - 1) : 0;
      
      const yearTotal = yearRent + yearCam + yearUtilities;
      
      yearlyBreakdown.push({
        year,
        baseRent: yearRent,
        cam: yearCam,
        utilities: yearUtilities,
        total: yearTotal,
        monthly: yearTotal / 12
      });

      totalRent += yearTotal;
    }

    const monthlyAverage = totalRent / (leaseTerm * 12);
    const annualAverage = totalRent / leaseTerm;

    // Calculate rent as percentage of revenue (if revenue data exists)
    // Try to get from dailySalesProjections calculation or revenue data
    const ops = state.financialData?.restaurantOperations || {};
    const seats = ops.seats || 50;
    const avgCheck = (ops.averageCheck?.dinner || 32) + (ops.averageCheck?.lunch || 18);
    const weeklyRevenue = seats * 0.8 * 2.0 * avgCheck * 7; // rough estimate
    const annualRevenue = weeklyRevenue * 52;
    const rentPercentage = annualRevenue > 0 ? (annualAverage / annualRevenue) * 100 : 0;

    // Industry benchmarks
    const benchmark = locationBenchmarks[location];
    const benchmarkRent = squareFootage * benchmark.avg;
    const vsBenchmark = rentPerSqFt - benchmark.avg;

    return {
      baseRent,
      camCost,
      utilitiesCost,
      baseTotal,
      monthlyAverage,
      annualAverage,
      totalRent,
      yearlyBreakdown,
      rentPercentage,
      benchmark,
      benchmarkRent,
      vsBenchmark,
      monthlyBase: baseRent / 12,
      monthlyTotal: baseTotal / 12
    };
  }, [squareFootage, rentPerSqFt, leaseTerm, annualIncrease, includeCam, camPerSqFt, includeUtilities, utilitiesPerSqFt, location, state.financialData]);

  const handleApplyToFinancials = () => {
    // Update the financial data with calculated rent
    actions.updateFinancialData('operatingExpenses', {
      rent: rentCalculations.annualAverage,
      rentPerSqFt: rentPerSqFt,
      squareFootage: squareFootage
    });
    
    if (includeUtilities) {
      actions.updateFinancialData('operatingExpenses', {
        utilities: rentCalculations.utilitiesCost
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <Calculator className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Rent Calculator</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Calculate your restaurant rent costs based on square footage, location, and lease terms. 
          Industry standard: Rent should be 6-10% of gross revenue.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  const benchmark = locationBenchmarks[e.target.value];
                  setRentPerSqFt(benchmark.avg);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(locationBenchmarks).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">
                Range: ${locationBenchmarks[location].min}-${locationBenchmarks[location].max}/sq ft/year
              </div>
            </div>

            <FormField
              label="Square Footage"
              type="number"
              value={squareFootage}
              onChange={(value) => setSquareFootage(parseFloat(value) || 0)}
              placeholder="2000"
            />

            <FormField
              label="Rent per Sq Ft (Annual)"
              type="number"
              value={rentPerSqFt}
              onChange={(value) => setRentPerSqFt(parseFloat(value) || 0)}
              placeholder="45"
            />

            <FormField
              label="Lease Term (Years)"
              type="number"
              value={leaseTerm}
              onChange={(value) => setLeaseTerm(parseInt(value) || 1)}
              placeholder="5"
            />

            <FormField
              label="Annual Rent Increase (%)"
              type="number"
              step="0.1"
              value={annualIncrease}
              onChange={(value) => setAnnualIncrease(parseFloat(value) || 0)}
              placeholder="3"
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeCam}
                  onChange={(e) => setIncludeCam(e.target.checked)}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Include CAM (Common Area Maintenance)</span>
              </label>
              {includeCam && (
                <FormField
                  label="CAM per Sq Ft (Annual)"
                  type="number"
                  value={camPerSqFt}
                  onChange={(value) => setCamPerSqFt(parseFloat(value) || 0)}
                  placeholder="8"
                />
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeUtilities}
                  onChange={(e) => setIncludeUtilities(e.target.checked)}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Include Utilities in Rent</span>
              </label>
              {includeUtilities && (
                <FormField
                  label="Utilities per Sq Ft (Annual)"
                  type="number"
                  value={utilitiesPerSqFt}
                  onChange={(value) => setUtilitiesPerSqFt(parseFloat(value) || 0)}
                  placeholder="8"
                />
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Annual Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Rent:</span>
                  <span className="font-semibold">{formatCurrency(rentCalculations.baseRent)}</span>
                </div>
                {includeCam && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CAM:</span>
                    <span className="font-semibold">{formatCurrency(rentCalculations.camCost)}</span>
                  </div>
                )}
                {includeUtilities && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilities:</span>
                    <span className="font-semibold">{formatCurrency(rentCalculations.utilitiesCost)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Annual:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(rentCalculations.annualAverage)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm font-medium text-gray-700">Monthly Average:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(rentCalculations.monthlyAverage)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Rent Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">vs {locationBenchmarks[location].name} Benchmark:</span>
                  <span className={`font-semibold ${rentCalculations.vsBenchmark > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {rentCalculations.vsBenchmark > 0 ? '+' : ''}{formatCurrency(rentCalculations.vsBenchmark * squareFootage)}/year
                  </span>
                </div>
                {rentCalculations.rentPercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">% of Revenue:</span>
                    <span className={`font-semibold ${rentCalculations.rentPercentage > 10 ? 'text-red-600' : rentCalculations.rentPercentage < 6 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {rentCalculations.rentPercentage.toFixed(1)}%
                    </span>
                  </div>
                )}
                {rentCalculations.rentPercentage > 10 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                      <span className="text-xs text-yellow-800">
                        Rent exceeds 10% of revenue. Consider negotiating or finding a better location.
                      </span>
                    </div>
                  </div>
                )}
                {rentCalculations.rentPercentage > 0 && rentCalculations.rentPercentage < 6 && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-xs text-blue-800">
                        Rent is below 6% of revenue - excellent ratio for profitability.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleApplyToFinancials}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Apply to Financial Projections
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rent Trend Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Rent Trend Over Lease Term
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={rentCalculations.yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="baseRent" stroke="#3b82f6" strokeWidth={2} name="Base Rent" />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total Rent" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rent Breakdown Pie Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
              Annual Rent Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Base Rent', value: rentCalculations.baseRent },
                    ...(includeCam ? [{ name: 'CAM', value: rentCalculations.camCost }] : []),
                    ...(includeUtilities ? [{ name: 'Utilities', value: rentCalculations.utilitiesCost }] : [])
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Base Rent', value: rentCalculations.baseRent },
                    ...(includeCam ? [{ name: 'CAM', value: rentCalculations.camCost }] : []),
                    ...(includeUtilities ? [{ name: 'Utilities', value: rentCalculations.utilitiesCost }] : [])
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Comparison */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Location Comparison</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={Object.entries(locationBenchmarks).map(([key, value]) => {
              const isCurrent = key === location;
              return {
                location: value.name,
                min: value.min * squareFootage,
                avg: value.avg * squareFootage,
                max: value.max * squareFootage,
                current: isCurrent ? rentCalculations.baseRent : undefined
              };
            }).filter(item => item.current !== undefined || true)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="location" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip formatter={(value) => value ? formatCurrency(value) : ''} />
              <Legend />
              <Bar dataKey="min" fill="#e5e7eb" name="Min Rent" />
              <Bar dataKey="avg" fill="#3b82f6" name="Avg Rent" />
              <Bar dataKey="max" fill="#1e40af" name="Max Rent" />
              <Bar dataKey="current" fill="#10b981" name="Your Rent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Negotiation Tips */}
        {rentCalculations.rentPercentage > 10 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Negotiation Tips
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Request a longer lease term in exchange for lower rent</li>
              <li>Negotiate CAM caps to limit annual increases</li>
              <li>Ask for rent-free months during build-out period</li>
              <li>Propose percentage rent (rent based on sales) instead of fixed rent</li>
              <li>Request tenant improvement allowance from landlord</li>
            </ul>
          </div>
        )}

        {/* Year-by-Year Breakdown */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Year-by-Year Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Base Rent</th>
                  {includeCam && <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">CAM</th>}
                  {includeUtilities && <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Utilities</th>}
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Annual</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rentCalculations.yearlyBreakdown.map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">{year.year}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.baseRent)}</td>
                    {includeCam && <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.cam)}</td>}
                    {includeUtilities && <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.utilities)}</td>}
                    <td className="px-4 py-2 text-sm font-semibold text-right">{formatCurrency(year.total)}</td>
                    <td className="px-4 py-2 text-sm text-right text-green-600">{formatCurrency(year.monthly)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-2 text-sm font-bold">Total</td>
                  <td className="px-4 py-2 text-sm font-bold text-right">{formatCurrency(rentCalculations.yearlyBreakdown.reduce((sum, y) => sum + y.baseRent, 0))}</td>
                  {includeCam && <td className="px-4 py-2 text-sm font-bold text-right">{formatCurrency(rentCalculations.yearlyBreakdown.reduce((sum, y) => sum + y.cam, 0))}</td>}
                  {includeUtilities && <td className="px-4 py-2 text-sm font-bold text-right">{formatCurrency(rentCalculations.yearlyBreakdown.reduce((sum, y) => sum + y.utilities, 0))}</td>}
                  <td className="px-4 py-2 text-sm font-bold text-right">{formatCurrency(rentCalculations.totalRent)}</td>
                  <td className="px-4 py-2 text-sm font-bold text-right">{formatCurrency(rentCalculations.monthlyAverage)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculator;

