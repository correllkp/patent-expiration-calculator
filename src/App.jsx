import { useState } from 'react';
import { Calculator, Calendar, FileText, AlertTriangle, CheckCircle2, Info, ExternalLink, BookOpen, Shield } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [patentType, setPatentType] = useState('utility');
  const [filingDate, setFilingDate] = useState('');
  const [hasDomesticBenefit, setHasDomesticBenefit] = useState(false);
  const [eefd, setEefd] = useState('');
  const [grantDate, setGrantDate] = useState('');
  const [hasTerminalDisclaimer, setHasTerminalDisclaimer] = useState(false);
  const [tdExpirationDate, setTdExpirationDate] = useState('');
  const [results, setResults] = useState(null);

  const calculatePatentTerm = () => {
    if (!filingDate || !grantDate) {
      alert('Please enter both filing date and grant date');
      return;
    }

    const filing = new Date(filingDate);
    const grant = new Date(grantDate);
    const effectiveFilingDate = hasDomesticBenefit && eefd ? new Date(eefd) : filing;
    
    let expirationDate;
    let termBasis = '';
    let termYears = 0;
    
    if (patentType === 'design') {
      const mayThirteen2015 = new Date('2015-05-13');
      termYears = filing >= mayThirteen2015 ? 15 : 14;
      expirationDate = new Date(grant);
      expirationDate.setFullYear(expirationDate.getFullYear() + termYears);
      termBasis = `${termYears} years from grant date (design patent)`;
    } else {
      const june71995 = new Date('1995-06-08');
      
      if (filing >= june71995) {
        termYears = 20;
        expirationDate = new Date(effectiveFilingDate);
        expirationDate.setFullYear(expirationDate.getFullYear() + 20);
        termBasis = hasDomesticBenefit && eefd ? 
          '20 years from Earliest Effective Filing Date' : 
          '20 years from filing date';
      } else {
        termYears = 17;
        expirationDate = new Date(grant);
        expirationDate.setFullYear(expirationDate.getFullYear() + 17);
        termBasis = '17 years from grant date (pre-GATT)';
      }
    }
    
    if (hasTerminalDisclaimer && tdExpirationDate) {
      const tdDate = new Date(tdExpirationDate);
      if (tdDate < expirationDate) {
        expirationDate = tdDate;
        termBasis += ' (limited by terminal disclaimer)';
      }
    }
    
    let maintenanceFees = null;
    if (patentType !== 'design') {
      maintenanceFees = [
        {
          label: 'First Fee (3.5 years)',
          windowStart: new Date(grant.getFullYear() + 3, grant.getMonth(), grant.getDate()),
          deadline: new Date(grant.getFullYear() + 4, grant.getMonth(), grant.getDate()),
        },
        {
          label: 'Second Fee (7.5 years)',
          windowStart: new Date(grant.getFullYear() + 7, grant.getMonth(), grant.getDate()),
          deadline: new Date(grant.getFullYear() + 8, grant.getMonth(), grant.getDate()),
        },
        {
          label: 'Third Fee (11.5 years)',
          windowStart: new Date(grant.getFullYear() + 11, grant.getMonth(), grant.getDate()),
          deadline: new Date(grant.getFullYear() + 12, grant.getMonth(), grant.getDate()),
        }
      ];
    }
    
    const today = new Date();
    const daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));
    const yearsUntilExpiration = (daysUntilExpiration / 365.25).toFixed(1);
    
    setResults({
      expirationDate: expirationDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      termBasis,
      termYears,
      maintenanceFees,
      daysUntilExpiration,
      yearsUntilExpiration,
      isExpired: expirationDate < today
    });
    
    setActiveTab('results');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-100 p-3 rounded-lg">
                <Calculator className="w-8 h-8 text-brand-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Patent Expiration Calculator
                </h1>
                <p className="text-gray-600">Professional tool for patent term calculations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`tab-button ${activeTab === 'calculator' ? 'tab-button-active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calculator
              </div>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`tab-button ${activeTab === 'results' ? 'tab-button-active' : ''}`}
              disabled={!results}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Results
              </div>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`tab-button ${activeTab === 'guide' ? 'tab-button-active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Guide
              </div>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`tab-button ${activeTab === 'services' ? 'tab-button-active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Professional Services
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="professional-card">
                <div className="info-box mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Important Disclaimer</p>
                      <p>This calculator provides estimates based on standard rules. For reexaminations or reissues, use the original patent information. Consult a patent professional for precise calculations including PTA/PTE.</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Patent Details</h2>

                <div className="space-y-6">
                  <div>
                    <label className="form-label">Patent Type</label>
                    <select 
                      className="form-input"
                      value={patentType}
                      onChange={(e) => setPatentType(e.target.value)}
                    >
                      <option value="utility">Utility Patent</option>
                      <option value="design">Design Patent</option>
                      <option value="plant">Plant Patent</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Filing Date</label>
                      <input 
                        type="date"
                        className="form-input"
                        value={filingDate}
                        onChange={(e) => setFilingDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="form-label">Grant Date (Issue Date)</label>
                      <input 
                        type="date"
                        className="form-input"
                        value={grantDate}
                        onChange={(e) => setGrantDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="checkbox"
                        id="domesticBenefit"
                        checked={hasDomesticBenefit}
                        onChange={(e) => setHasDomesticBenefit(e.target.checked)}
                        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                      />
                      <label htmlFor="domesticBenefit" className="font-semibold text-gray-900">
                        Claims Domestic Benefit
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Check if this patent claims priority to a continuation, continuation-in-part, or divisional application
                    </p>

                    {hasDomesticBenefit && (
                      <div className="pl-7">
                        <label className="form-label">Earliest Effective Filing Date (EEFD)</label>
                        <input 
                          type="date"
                          className="form-input"
                          value={eefd}
                          onChange={(e) => setEefd(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          The filing date of the first application in the priority chain
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="checkbox"
                        id="terminalDisclaimer"
                        checked={hasTerminalDisclaimer}
                        onChange={(e) => setHasTerminalDisclaimer(e.target.checked)}
                        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                      />
                      <label htmlFor="terminalDisclaimer" className="font-semibold text-gray-900">
                        Has Terminal Disclaimer
                      </label>
                    </div>

                    {hasTerminalDisclaimer && (
                      <div className="pl-7">
                        <label className="form-label">TD Expiration Date</label>
                        <input 
                          type="date"
                          className="form-input"
                          value={tdExpirationDate}
                          onChange={(e) => setTdExpirationDate(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Expiration date of the reference patent
                        </p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={calculatePatentTerm}
                    className="btn-calculate w-full flex items-center justify-center gap-2 mt-8"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Patent Expiration
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="professional-card bg-gradient-to-br from-brand-50 to-purple-50 border-brand-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Need Expert Assistance?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Professional patent services for prosecution, portfolio management, and IP strategy.
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://patentwerks.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-md hover:shadow transition group"
                  >
                    <span className="font-semibold text-brand-600">PatentWerks.ai</span>
                    <ExternalLink className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition" />
                  </a>
                  <a 
                    href="https://ipservices.us" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-md hover:shadow transition group"
                  >
                    <span className="font-semibold text-brand-600">IP Services</span>
                    <ExternalLink className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition" />
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Reference</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">Utility Patents</p>
                    <p className="text-gray-600">20 years from filing date</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Design Patents</p>
                    <p className="text-gray-600">15 years from grant (post-2015)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Plant Patents</p>
                    <p className="text-gray-600">20 years from filing date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && results && (
          <div className="space-y-6">
            <div className="result-box">
              <div className="flex items-start gap-4 mb-4">
                {results.isExpired ? (
                  <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {results.isExpired ? 'Patent Has Expired' : 'Patent Expiration Date'}
                  </h2>
                  <p className="text-4xl font-bold text-brand-600 mb-4">
                    {results.expirationDate}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Term Basis</p>
                      <p className="font-semibold text-gray-900">{results.termBasis}</p>
                    </div>
                    {!results.isExpired && (
                      <div>
                        <p className="text-gray-600">Time Remaining</p>
                        <p className="font-semibold text-gray-900">
                          {results.yearsUntilExpiration} years ({results.daysUntilExpiration} days)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {results.maintenanceFees && !results.isExpired && (
              <div className="professional-card">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-brand-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Maintenance Fee Schedule</h3>
                </div>
                
                <div className="info-box mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Payment Windows:</strong> Fees may be paid without surcharge during the 6-month window before each deadline. 
                    A 6-month grace period with surcharge follows each deadline.
                  </p>
                </div>

                <div className="space-y-4">
                  {results.maintenanceFees.map((fee, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{fee.label}</p>
                          <p className="text-sm text-gray-600">Payment window opens {formatDate(fee.windowStart)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Grace period deadline</p>
                          <p className="text-lg font-bold text-brand-600">{formatDate(fee.deadline)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>Critical Reminder:</strong> Missing a maintenance fee deadline will cause your patent to expire prematurely. 
                    Consider using{' '}
                    <a href="https://ipservices.us" className="text-brand-600 hover:underline font-semibold">
                      professional patent services
                    </a>{' '}
                    to track and manage these important deadlines.
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="professional-card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Verify calculation with USPTO records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Set calendar reminders for maintenance fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Review patent for any PTA or PTE adjustments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Consider professional portfolio management</span>
                  </li>
                </ul>
              </div>

              <div className="professional-card bg-brand-50">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Support</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get expert help managing your patent portfolio, including deadline tracking, strategic advice, and prosecution support.
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://patentwerks.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-md hover:shadow transition"
                  >
                    <span className="font-semibold text-brand-600">Explore PatentWerks.ai</span>
                    <ExternalLink className="w-4 h-4 text-brand-600" />
                  </a>
                  <a 
                    href="https://ipservices.us" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-md hover:shadow transition"
                  >
                    <span className="font-semibold text-brand-600">Visit IP Services</span>
                    <ExternalLink className="w-4 h-4 text-brand-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="professional-card">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Patent Terms</h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Utility and Plant Patents</h3>
                  <p className="mb-2">
                    For patents filed on or after June 8, 1995, the term is 20 years from the earliest effective filing date. 
                    This means if you claim priority to an earlier application (through a continuation, CIP, or divisional), 
                    the patent term runs from that earlier date.
                  </p>
                  <p>
                    Patents filed before June 8, 1995 have a term of 17 years from the grant date under the pre-GATT rules.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Design Patents</h3>
                  <p className="mb-2">
                    Design patents have simpler term calculations based solely on grant date:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Filed on or after May 13, 2015: 15 years from grant</li>
                    <li>Filed before May 13, 2015: 14 years from grant</li>
                  </ul>
                  <p className="mt-2">
                    Design patents do not require maintenance fees, making them simpler to maintain.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Terminal Disclaimers</h3>
                  <p>
                    A terminal disclaimer is a statement by a patent applicant that they are willing to dedicate to the public 
                    a portion of the patent term. This is commonly used to overcome obviousness-type double patenting rejections 
                    when related patents would otherwise have staggered expiration dates. Professional guidance from{' '}
                    <a href="https://patentwerks.ai" className="text-brand-600 hover:underline font-semibold">
                      patent experts
                    </a>{' '}
                    can help navigate these complex scenarios.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Patent Term Adjustments (PTA)</h3>
                  <p>
                    The USPTO may grant patent term adjustments to compensate for delays during prosecution. These adjustments 
                    are not included in this calculator's estimates. Review your patent's file wrapper or consult with{' '}
                    <a href="https://ipservices.us" className="text-brand-600 hover:underline font-semibold">
                      IP professionals
                    </a>{' '}
                    for precise PTA calculations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Patent Term Extensions (PTE)</h3>
                  <p>
                    Certain patents covering FDA-regulated products may be eligible for patent term extensions under 35 U.S.C. § 156 
                    to compensate for regulatory review periods. This calculator does not account for PTE, which requires separate 
                    application and approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="professional-card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance Fee Strategy</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Strategic management of maintenance fees can significantly impact your IP portfolio's value and cost-effectiveness.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Evaluate commercial value before each fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Consider licensing opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Assess competitive landscape</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>Review litigation potential</span>
                  </li>
                </ul>
              </div>

              <div className="professional-card bg-brand-50">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Portfolio Management</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Managing multiple patents requires sophisticated tracking and strategic planning to maximize ROI.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Professional services like{' '}
                  <a href="https://patentwerks.ai" className="text-brand-600 hover:underline font-semibold">
                    PatentWerks.ai
                  </a>{' '}
                  and{' '}
                  <a href="https://ipservices.us" className="text-brand-600 hover:underline font-semibold">
                    IP Services
                  </a>{' '}
                  provide comprehensive portfolio management, including automated deadline tracking, strategic analysis, 
                  and cost optimization.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Patent Services</h2>
              <p className="text-xl text-gray-600">
                Expert support for all aspects of your intellectual property needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="professional-card bg-gradient-to-br from-brand-50 to-purple-50 border-brand-200">
                <div className="mb-6">
                  <div className="bg-brand-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    AI-POWERED SOLUTIONS
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">PatentWerks.ai</h3>
                  <p className="text-gray-700 mb-4">
                    Cutting-edge AI-powered patent services combining human expertise with advanced technology 
                    for superior results in patent prosecution and portfolio management.
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>AI-assisted patent drafting and prosecution</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Automated prior art searching and analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Intelligent portfolio optimization</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Strategic IP landscape analysis</span>
                  </li>
                </ul>

                <a 
                  href="https://patentwerks.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-calculate w-full flex items-center justify-center gap-2"
                >
                  Visit PatentWerks.ai
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="professional-card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="mb-6">
                  <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    COMPREHENSIVE SERVICES
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">IP Services</h3>
                  <p className="text-gray-700 mb-4">
                    Full-spectrum intellectual property services delivered by experienced professionals 
                    with deep expertise across all aspects of patent and trademark law.
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Patent and trademark prosecution</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Portfolio management and deadline tracking</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Freedom-to-operate and infringement analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>IP strategy and commercialization consulting</span>
                  </li>
                </ul>

                <a 
                  href="https://ipservices.us" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm hover:shadow-md w-full flex items-center justify-center gap-2"
                >
                  Visit IP Services
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="professional-card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Professional Patent Services?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-brand-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Expertise</h4>
                  <p className="text-sm text-gray-600">
                    Registered patent attorneys and agents with extensive technical and legal experience
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-brand-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Peace of Mind</h4>
                  <p className="text-sm text-gray-600">
                    Never miss critical deadlines with professional tracking and reminder systems
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-brand-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Strategic Value</h4>
                  <p className="text-sm text-gray-600">
                    Maximize ROI through informed decisions about prosecution, maintenance, and licensing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              This calculator provides estimates based on standard patent term rules. For official calculations, 
              consult the USPTO or a registered patent professional.
            </p>
            <p>
              Professional services:{' '}
              <a href="https://patentwerks.ai" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-semibold">
                PatentWerks.ai
              </a>
              {' '} | {' '}
              <a href="https://ipservices.us" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-semibold">
                IP Services
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
