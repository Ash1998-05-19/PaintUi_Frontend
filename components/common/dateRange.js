import { ToastContainer, toast } from "react-toastify";

export default function DateRange({
  setFromDate,
  setToDate,
  startDate,
  endDate,
  // setIsRefresh
}) {
  const handleEndDateFocus = (e) => {
    if (!startDate) {
      e.preventDefault();
      toast.error("Please select a start date first!");
    }
  };
  
  return (
    <>
      <div id="date-rangepicker" className="flex mb-5 flex-col justify-start">
        <div className="relative">
        <label className="block text-gray-700">From Transaction Date:</label>
          <input
            name="start"
            type="date"
            className="block text-gray-700 w-full"
            placeholder="Select date start"
            value={startDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        
        <div className="relative mt-2">
        <label className="block text-gray-700">To Transaction Date:</label>
          <input
            name="end"
            type="date"
            className="block text-gray-700 w-full"
            placeholder="Select date end"
            value={endDate}
            onChange={(e) => setToDate(e.target.value)}
            onFocus={handleEndDateFocus}
            disabled={!startDate}
          />
          
        </div>
        
        
      </div>
    </>
  );
}
