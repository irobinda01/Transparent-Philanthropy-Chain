import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';

export function CampaignDetails() {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual data fetching
  const campaign = {
    title: 'Education for All',
    description: 'Help provide education to underprivileged children',
    goalAmount: 100000,
    raisedAmount: 65000,
    deadline: '2025-12-31',
    verifier: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    charity: 'Education Foundation',
    status: 'active',
    proofHash: null,
  };

  const handleDonate = async () => {
    setIsSubmitting(true);
    try {
      // Implement donation logic
    } catch (error) {
      console.error('Donation failed:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Campaign Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {campaign.title}
            </h1>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Active Campaign
              </span>
            </div>
          </div>

          <div className="prose prose-blue prose-lg">
            <p>{campaign.description}</p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%</span>
            </div>
            <div className="mt-2 relative">
              <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{
                    width: `${Math.min(
                      (campaign.raisedAmount / campaign.goalAmount) * 100,
                      100
                    )}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 rounded-full transition-all duration-500"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>{campaign.raisedAmount.toLocaleString()} STX raised</span>
              <span>Goal: {campaign.goalAmount.toLocaleString()} STX</span>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="border-t border-b border-gray-200 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Charity</dt>
                <dd className="mt-1 text-sm text-gray-900">{campaign.charity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Verifier</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">
                  {campaign.verifier}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(campaign.deadline).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {campaign.status}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Donation Form */}
        <div className="mt-10 lg:mt-0 lg:col-start-2 lg:sticky lg:top-6">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Make a Donation</h2>
            <div className="mt-4">
              <label htmlFor="amount" className="label">
                Amount (STX)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="input"
                  placeholder="Enter amount in STX"
                />
              </div>
            </div>
            <Button
              className="w-full mt-6"
              onClick={handleDonate}
              isLoading={isSubmitting}
              disabled={!donationAmount || isSubmitting}
            >
              Donate Now
            </Button>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Your donation will be held in escrow until the campaign is verified
            </p>
          </div>

          {/* Activity Feed */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-4 flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="py-4 animate-fade-in">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100">
                          <span className="text-sm font-medium leading-none text-primary-700">
                            {item}
                          </span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          Anonymous donated 1,000 STX
                        </p>
                        <p className="text-sm text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}