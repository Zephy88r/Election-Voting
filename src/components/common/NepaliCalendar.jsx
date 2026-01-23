import { useState, useRef, useEffect } from 'react';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import './NepaliCalendar.css';

const NepaliCalendar = ({ value, onChange, placeholder, className, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const bsToday = adToBs(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    const [year, month] = bsToday.split('-').map(Number);
    return { year, month };
  });
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  const nepaliMonths = [
    'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];

  // Real Nepali calendar data with actual days per month for different years
  const getRealDaysInMonth = (year, month) => {
    try {
      // Try to convert the last possible day of the month to AD
      // Start with 32 and work backwards to find the actual last day
      for (let day = 32; day >= 28; day--) {
        try {
          const testDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          bsToAd(testDate); // If this doesn't throw, the date exists
          return day;
        } catch {
          continue;
        }
      }
      return 30; // fallback
    } catch {
      return 30; // fallback
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (day) => {
    const selectedDate = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(selectedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const renderCalendar = () => {
    const days = [];
    
    // Get first day of the month in AD to calculate weekday
    const firstDayBS = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-01`;
    let firstDayAD;
    try {
      firstDayAD = bsToAd(firstDayBS);
    } catch {
      firstDayAD = '2024-01-01'; // fallback
    }
    
    const firstDay = new Date(firstDayAD).getDay(); // 0 = Sunday
    const totalDays = getRealDaysInMonth(currentDate.year, currentDate.month);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = value === `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push(
        <button
          key={day}
          type="button"
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="nepali-calendar-container">
      <input
        ref={inputRef}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'YYYY-MM-DD (BS)'}
        className={`nepali-calendar-input ${className || ''} ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      
      {isOpen && (
        <div ref={calendarRef} className="nepali-calendar-dropdown">
          <div className="calendar-header">
            <button type="button" onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
            <div className="month-year-selector">
              <select 
                value={currentDate.month} 
                onChange={(e) => setCurrentDate(prev => ({...prev, month: parseInt(e.target.value)}))}
                className="month-select"
              >
                {nepaliMonths.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <input 
                type="number" 
                value={currentDate.year} 
                onChange={(e) => setCurrentDate(prev => ({...prev, year: parseInt(e.target.value) || prev.year}))}
                className="year-input"
                min="2000"
                max="2100"
              />
            </div>
            <button type="button" onClick={() => navigateMonth(1)} className="nav-btn">›</button>
          </div>
          
          <div className="calendar-grid">
            <div className="weekdays">
              <span>आइत</span>
              <span>सोम</span>
              <span>मंगल</span>
              <span>बुध</span>
              <span>बिहि</span>
              <span>शुक्र</span>
              <span>शनि</span>
            </div>
            
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NepaliCalendar;