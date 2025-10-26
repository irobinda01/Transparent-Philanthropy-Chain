import React from 'react';
import { Link } from 'react-router-dom';

type CampaignCardProps = {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  verifier: string;
};

export function CampaignCard({
  id,
  title,
  description,
  goalAmount,
  raisedAmount,
  deadline,
  verifier,
}: CampaignCardProps) {
  const progress = Math.min((raisedAmount / goalAmount) * 100, 100);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            <Link to={`/campaign/${id}`} className="hover:text-primary-600">
              {title}
            </Link>
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-1 relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              />
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <dt className="font-medium text-gray-900">Goal</dt>
            <dd>{goalAmount.toLocaleString()} STX</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Raised</dt>
            <dd>{raisedAmount.toLocaleString()} STX</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Deadline</dt>
            <dd>{new Date(deadline).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Verifier</dt>
            <dd className="truncate" title={verifier}>
              {verifier.slice(0, 8)}...{verifier.slice(-4)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            to={`/campaign/${id}`}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}