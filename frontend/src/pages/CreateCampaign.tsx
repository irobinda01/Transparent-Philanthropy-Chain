import { useState } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { callCreateCampaign } from '../api';
import { useAuth } from '@micro-stacks/react';

export function CreateCampaign() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goalAmount: '',
    deadline: '',
    verifierAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Please connect your wallet first');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const goalUstx = BigInt(parseFloat(formData.goalAmount) * 1000000); // Convert STX to µSTX
      const deadlineDate = new Date(formData.deadline);
      const deadlineBBH = BigInt(Math.floor(deadlineDate.getTime() / 1000)); // Convert to UNIX timestamp
      
      await callCreateCampaign(
        goalUstx,
        deadlineBBH,
        formData.description,
        formData.verifierAddress
      );

      toast.success('Campaign creation transaction submitted!');
      navigate('/');
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast.error('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create a Campaign</h3>
            <p className="mt-1 text-sm text-gray-600">
              Launch a new charitable campaign. Make sure to provide accurate information and set realistic goals.
            </p>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium leading-6 text-gray-900">Guidelines</h4>
              <div className="mt-2 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-500">Set a realistic funding goal</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-500">Choose a trustworthy verifier</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-500">Provide detailed campaign information</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label htmlFor="name" className="label">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="input mt-1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="input"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Briefly describe your campaign's goals and impact.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="goalAmount" className="label">
                      Goal Amount (STX)
                    </label>
                    <input
                      type="number"
                      name="goalAmount"
                      id="goalAmount"
                      required
                      min="0"
                      step="0.1"
                      className="input mt-1"
                      value={formData.goalAmount}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="deadline" className="label">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      required
                      className="input mt-1"
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="verifierAddress" className="label">
                    Verifier's Address
                  </label>
                  <input
                    type="text"
                    name="verifierAddress"
                    id="verifierAddress"
                    required
                    className="input mt-1"
                    placeholder="Enter Stacks address"
                    value={formData.verifierAddress}
                    onChange={handleChange}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    The verifier will be responsible for approving the campaign's success and releasing funds.
                  </p>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}