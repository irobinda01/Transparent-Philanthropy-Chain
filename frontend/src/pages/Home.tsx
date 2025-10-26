import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { CampaignCard } from '../components/CampaignCard';
import { SearchBar } from '../components/SearchBar';
import { getCampaigns } from '../contract-calls';
import toast from 'react-hot-toast';

type Campaign = {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  verifier: string;
  status: 'active' | 'completed' | 'expired';
};

export function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const fetchedCampaigns = await getCampaigns();
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        toast.error('Failed to load campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-primary-700 py-16 sm:py-24">
        <div className="absolute inset-0">
          <div className="bg-primary-800 h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Transparent Philanthropy Chain
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
              Support verified charitable campaigns with full transparency and accountability
            </p>
            <div className="mt-10 max-w-sm mx-auto flex justify-center gap-3">
              <Button variant="secondary" size="lg">
                View Campaigns
              </Button>
              <Button variant="outline" size="lg" className="bg-white">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchBar />
          <div className="flex space-x-2">
            <select className="input">
              <option value="all">All Categories</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="environment">Environment</option>
            </select>
            <select className="input">
              <option value="newest">Newest First</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="most-funded">Most Funded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg" />
              </div>
            ))
          ) : campaigns.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
              <div className="mt-6">
                <Button>Create Campaign</Button>
              </div>
            </div>
          ) : (
            // Campaign cards
            campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))
          )}
        </div>
      </div>

      {/* Load More Button */}
      {campaigns.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            Load More Campaigns
          </Button>
        </div>
      )}
    </div>
  );
}