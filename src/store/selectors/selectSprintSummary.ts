import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '..';
import { membersSelector } from '../membersSlice';
import { roomSelector } from '../roomSlice';

export const selectTotalWorkingDays = createSelector(
  (state: AppState) => membersSelector.selectAll(state),
  (members): number =>
    members.reduce(
      (accumulator, member) =>
        accumulator + member.days.filter((day) => !day.isNonWorkingDay).length,
      0
    )
);

export const selectHolidays = createSelector(
  (state: AppState) => roomSelector.value(state).days,
  (days): number => days.filter((day) => day.isNonWorkingDay).length
);
