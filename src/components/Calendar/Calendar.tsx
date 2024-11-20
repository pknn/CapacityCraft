import CalendarHead from './CalendarHead';
import MemberCalendars from './MemberCalendars';

const Calendar = () => (
  <div className="snap-x overflow-x-scroll pb-8">
    <table className="w-full">
      <CalendarHead />
      <MemberCalendars />
    </table>
  </div>
);

export default Calendar;
