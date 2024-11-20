import CalendarHead from './CalendarHead';
import MemberCalendars from './MemberCalendars';

const Calendar = () => (
  <div className="snap-x overflow-x-scroll p-2">
    <table className="w-full">
      <CalendarHead />
      <MemberCalendars />
    </table>
  </div>
);

export default Calendar;
