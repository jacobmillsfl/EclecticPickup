import React, { useState } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());

  // Extract current year and month from currentDate
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Create an array representing the days of the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Function to handle next month
  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextDate = new Date(prevDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  };

  // Function to handle previous month
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevDateCopy = new Date(prevDate);
      prevDateCopy.setMonth(prevDateCopy.getMonth() - 1);
      return prevDateCopy;
    });
  };

  // Function to handle day click
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.button} onClick={prevMonth}>
          &#x2190; {/* Left arrow */}
        </button>
        <h2 style={styles.title}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
        <button style={styles.button} onClick={nextMonth}>
          &#x2192; {/* Right arrow */}
        </button>
      </div>
      <div style={styles.daysGrid}>
        {/* Render day labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} style={styles.dayLabel}>{day}</div>
        ))}
        {/* Fill in blank spaces for the first week */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={i} style={styles.emptyDay}></div>
        ))}
        {/* Render days of the month */}
        {daysArray.map((day) => (
          <div
            key={day}
            style={{
              ...styles.day,
              ...(day === selectedDay && styles.selectedDay)
            }}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: '#FFF',
    padding: '1rem',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.375rem',
    width: '100%',
    maxWidth: 'calc((100% - 1rem) / 3)',
    margin: '0 auto',
    marginTop: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#3B82F6',
    color: '#FFF',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
  },
  dayLabel: {
    textAlign: 'center' as const,
  },
  emptyDay: {
    // Adjust size as needed
    width: '2.5rem',
    height: '2.5rem',
  },
  day: {
    textAlign: 'center' as const,
    cursor: 'pointer',
    // Adjust size and other properties as needed
    width: '2.5rem',
    height: '2.5rem',
    lineHeight: '2.5rem',
    borderRadius: '0.25rem',
  },
  selectedDay: {
    backgroundColor: '#3B82F6',
    color: '#FFF',
  },
};

export default Calendar;