import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useStacks';
import { getDonationsByUser } from '../contract-calls';
import { callRefund } from '../api';
import toast from 'react-hot-toast';

type Donation = {
  id: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  date: string;
  status: 'active' | 'released' | 'refunded';
};

export function MyDonations() {
  const [isLoading, setIsLoading] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const { address } = useAuth();

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true);
      try {
        if (address) {
          const fetchedDonations = await getDonationsByUser(address);
          setDonations(fetchedDonations);
        }
      } catch (error) {
        console.error('Failed to load donations:', error);
        toast.error('Failed to load donations');
      } finally {
        setIsLoading(false);
      }
    };

    loadDonations();
  }, [address]);

  const handleRefund = async (donationId: string) => {
    setIsLoading(true);
    try {
      await callRefund(BigInt(donationId));
      toast.success('Refund request submitted');
      // Reload donations after refund
      const fetchedDonations = await getDonationsByUser(address!);
      setDonations(fetchedDonations);
    } catch (error) {
      console.error('Refund failed:', error);
      toast.error('Failed to request refund');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">My Donations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your donations across different campaigns.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Campaign
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount (STX)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <Link
                          to={`/campaign/${donation.campaignId}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {donation.campaignName}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.amount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(donation.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {donation.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefund(donation.id)}
                            isLoading={isLoading}
                          >
                            Request Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {donations.length === 0 && (
        <div className="text-center py-12">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start by making your first donation!</p>
          <div className="mt-6">
            <Link to="/">
              <Button>View Campaigns</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}