/* eslint react/prop-types: */
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/fi";
import "./DateTimeRangePicker.css";
import { useEffect } from "react";

const DateTimeRangePicker = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onlyDate = false, // allows to re-use the component with only date picker without time
}) => {

  useEffect(() => {
    if (startTime && endTime && startTime.isAfter(endTime)) {
      console.log("invalid time range");
      setEndTime(startTime);
    }
  }, [startTime, endTime, setStartTime, setEndTime]);

  if (onlyDate) {
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
          <div className="datePickers">
            <DatePicker
              value={startTime}
              onChange={setStartTime}
              label="Aloituspäivä"
            />
            <DatePicker
              value={endTime}
              onChange={setEndTime}
              label="Lopetuspäivä"
            />
          </div>
        </LocalizationProvider>
      </div>
    );
  }
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
        <div className="datePickers">
          <DateTimePicker
            value={startTime}
            onChange={setStartTime}
            ampm={false}
            label="Aloitusajankohta ja -aika"
          />
          <DateTimePicker
            value={endTime}
            onChange={setEndTime}
            ampm={false}
            label="Lopetusajankohta ja -aika"
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default DateTimeRangePicker;
