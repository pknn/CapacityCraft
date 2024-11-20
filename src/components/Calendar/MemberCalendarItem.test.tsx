import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemberCalendarItem from './MemberCalendarItem';
import { Day, DayTypes } from '../../types/Day';

describe('MemberCalendarItem', () => {
  const mockOnClick = vi.fn();

  const createDay = (
    dayType: (typeof DayTypes)[keyof typeof DayTypes]
  ): Day => ({
    date: '2024-01-01',
    dayType,
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  );

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering states', () => {
    it('renders full working day correctly', () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.FullDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass(
        'rounded',
        'border',
        'border-stone-200',
        'cursor-pointer',
        'bg-stone-300'
      );
    });

    it('renders half day correctly', () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.HalfDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('bg-stone-500', 'cursor-pointer');
    });

    it('renders global off day correctly', () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.Weekend)}
            memberDay={createDay(DayTypes.FullDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('cursor-not-allowed', 'bg-stone-700');
    });

    it('renders personal off day correctly', () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.Holiday)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('cursor-pointer', 'bg-stone-700');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicking on working day', async () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.FullDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      await userEvent.click(screen.getByRole('cell'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('prevents click on global off day', async () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.Weekend)}
            memberDay={createDay(DayTypes.FullDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      await userEvent.click(screen.getByRole('cell'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('allows click on personal off day when global day is working', async () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.Holiday)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      await userEvent.click(screen.getByRole('cell'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Style combinations', () => {
    const testCases = [
      {
        name: 'global weekend + member full day',
        global: DayTypes.Weekend,
        member: DayTypes.FullDay,
        expectedClasses: ['cursor-not-allowed', 'bg-stone-700'],
      },
      {
        name: 'global holiday + member half day',
        global: DayTypes.Holiday,
        member: DayTypes.HalfDay,
        expectedClasses: ['cursor-not-allowed', 'bg-stone-700'],
      },
      {
        name: 'global full day + member holiday',
        global: DayTypes.FullDay,
        member: DayTypes.Holiday,
        expectedClasses: ['cursor-pointer', 'bg-stone-700'],
      },
      {
        name: 'both full working days',
        global: DayTypes.FullDay,
        member: DayTypes.FullDay,
        expectedClasses: ['cursor-pointer', 'bg-stone-300'],
      },
    ];

    testCases.forEach(({ name, global, member, expectedClasses }) => {
      it(`applies correct classes for ${name}`, () => {
        render(
          <TestWrapper>
            <MemberCalendarItem
              globalDay={createDay(global)}
              memberDay={createDay(member)}
              onClick={mockOnClick}
            />
          </TestWrapper>
        );

        const cell = screen.getByRole('cell');
        expectedClasses.forEach((className) => {
          expect(cell).toHaveClass(className);
        });
      });
    });
  });

  describe('Base styles', () => {
    it('always includes base classes', () => {
      render(
        <TestWrapper>
          <MemberCalendarItem
            globalDay={createDay(DayTypes.FullDay)}
            memberDay={createDay(DayTypes.FullDay)}
            onClick={mockOnClick}
          />
        </TestWrapper>
      );

      const cell = screen.getByRole('cell');
      const baseClasses = ['rounded', 'border', 'border-stone-200'];
      baseClasses.forEach((className) => {
        expect(cell).toHaveClass(className);
      });
    });
  });
});
