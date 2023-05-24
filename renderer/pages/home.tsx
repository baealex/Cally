import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Movement } from '../components/movement';
import { Calendar } from '../components/calendar';

function Home() {
  const [year, setYear] = React.useState(2021);
  const [month, setMonth] = React.useState(10);

  return (
    <>
      <Movement canMove={true} left={0} top={0} onMove={(left, top) => {}}>
        <Calendar
          year={year}
          month={month}
          onDateClick={(date) => {}}
          onDateChange={(year, month) => {
            setYear(year);
            setMonth(month);
          }} />
      </Movement>
      <style jsx>{`
        :global(body) {
          background: url('/images/example.jpg') no-repeat center center fixed;
          background-size: cover;
        }
      `}</style>
    </>
  );
};

export default Home;
