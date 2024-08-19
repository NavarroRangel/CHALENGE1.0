// src/pages/result/[makeId]/[year].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import axios from 'axios';
import React from 'react';

interface ResultProps {
  makeId: string;
  year: number;
}

const VehicleTypes = dynamic(() => import('../../../pages/VehicleTypes'), {
  suspense: true,
});

const Result: NextPage<ResultProps> = ({ makeId, year }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Vehicle Models</h1>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-lg font-semibold mb-4">Selected Vehicle Make ID: {makeId}</p>
        <p className="text-lg font-semibold mb-6">Selected Model Year: {year}</p>

        <React.Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <VehicleTypes makeId={makeId} year={year} />
        </React.Suspense>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    const makes = response.data.Results;

    const years = Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => 2015 + i);

    const paths = makes.flatMap((make: any) =>
      years.map((year) => ({
        params: {
          makeId: make.MakeId.toString(),
          year: year.toString(),
        },
      }))
    );

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<ResultProps> = async (context) => {
  const { makeId, year } = context.params as { makeId: string; year: string };

  return {
    props: {
      makeId,
      year: parseInt(year),
    },
    revalidate: 60,
  };
};

export default Result;
