import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '..';
import { membersSelector } from '../membersSlice';
import { roomSelector } from '../roomSlice';
import dayTypeToRatio from '../../util/dayTypeToRatio';
import { DayTypes } from '../../types/Day';

export const selectTotalWorkingDays = createSelector(
  (state: AppState) => membersSelector.selectAll(state),
  (members): number =>
    members.reduce(
      (accumulator, member) =>
        accumulator +
        member.days.reduce(
          (acc, day) => acc + 1 * dayTypeToRatio(day.dayType),
          0
        ),
      0
    )
);

export const selectHolidays = createSelector(
  (state: AppState) => roomSelector.value(state).days,
  (days): number =>
    days.filter((day) => day.dayType === DayTypes.Holiday).length
);
