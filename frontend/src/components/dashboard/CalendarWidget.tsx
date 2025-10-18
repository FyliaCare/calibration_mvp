import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface CalendarEvent {
  date: string; // YYYY-MM-DD format
  type: 'overdue' | 'due-soon' | 'scheduled' | 'completed';
  count: number;
  items: string[];
}

interface CalendarWidgetProps {
  events?: CalendarEvent[];
}

export const CalendarWidget = ({ events = [] }: CalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventForDate = (day: number): CalendarEvent | undefined => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date === dateStr);
  };

  const getEventDot = (event: CalendarEvent) => {
    const colors = {
      'overdue': 'bg-red-500',
      'due-soon': 'bg-yellow-500',
      'scheduled': 'bg-blue-500',
      'completed': 'bg-green-500',
    };
    return colors[event.type];
  };

  const isToday = (day: number) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  // Mock events for demonstration
  const mockEvents: CalendarEvent[] = [
    { date: '2025-10-18', type: 'overdue', count: 3, items: ['DMM-2500', 'PG-1000', 'TS-550'] },
    { date: '2025-10-19', type: 'due-soon', count: 2, items: ['TC-100', 'VM-200'] },
    { date: '2025-10-20', type: 'scheduled', count: 5, items: ['Equipment A', 'Equipment B', 'Equipment C', 'Equipment D', 'Equipment E'] },
    { date: '2025-10-21', type: 'scheduled', count: 3, items: ['Equipment F', 'Equipment G', 'Equipment H'] },
    { date: '2025-10-22', type: 'scheduled', count: 4, items: ['Equipment I', 'Equipment J', 'Equipment K', 'Equipment L'] },
    { date: '2025-10-25', type: 'due-soon', count: 6, items: ['Various equipment'] },
    { date: '2025-10-28', type: 'scheduled', count: 2, items: ['Equipment M', 'Equipment N'] },
  ];

  const displayEvents = events.length > 0 ? events : mockEvents;

  return (
    <Card className="border-2 border-indigo-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Calibration Calendar</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day labels */}
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const event = getEventForDate(day);
            const todayClass = isToday(day);

            return (
              <button
                key={day}
                className={`aspect-square p-1 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 relative ${
                  todayClass
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : event
                    ? 'bg-gray-50'
                    : 'text-gray-700'
                }`}
                title={event ? `${event.count} items ${event.type}` : undefined}
              >
                <span className="relative z-10">{day}</span>
                
                {/* Event indicator dots */}
                {event && !todayClass && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <div className={`w-1 h-1 rounded-full ${getEventDot(event)}`} />
                    {event.count > 1 && (
                      <div className={`w-1 h-1 rounded-full ${getEventDot(event)}`} />
                    )}
                    {event.count > 2 && (
                      <div className={`w-1 h-1 rounded-full ${getEventDot(event)}`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-600">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Due Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">Completed</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Next 7 Days</div>
          <div className="space-y-1">
            {displayEvents.slice(0, 3).map((event, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-700">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  event.type === 'overdue' ? 'bg-red-100 text-red-700' :
                  event.type === 'due-soon' ? 'bg-yellow-100 text-yellow-700' :
                  event.type === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.count} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
