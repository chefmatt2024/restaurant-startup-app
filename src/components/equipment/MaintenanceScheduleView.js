import React, { useMemo } from 'react';
import SectionCard from '../ui/SectionCard';
import { Calendar, Wrench, AlertCircle } from 'lucide-react';

const FREQUENCY_ORDER = { daily: 1, weekly: 2, monthly: 3, quarterly: 4, annual: 5 };
const FREQUENCY_LABELS = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual' };

/**
 * Compute next due date from lastCompleted + frequency
 */
const getNextDue = (lastCompleted, frequency) => {
  if (!frequency || !lastCompleted) return null;
  const d = new Date(lastCompleted);
  switch (frequency) {
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'annual': d.setFullYear(d.getFullYear() + 1); break;
    default: return null;
  }
  return d.toISOString().slice(0, 10);
};

const MaintenanceScheduleView = ({ equipmentData }) => {
  const bidSheet = Array.isArray(equipmentData?.bidSheet) ? equipmentData.bidSheet : [];
  const customEquipment = Array.isArray(equipmentData?.customEquipment) ? equipmentData.customEquipment : [];

  const allEquipmentWithMaintenance = useMemo(() => {
    const items = [];
    [...bidSheet, ...customEquipment].forEach((eq) => {
      const schedule = eq.maintenanceSchedule || {};
      const nextDue = schedule.nextDue || (schedule.lastCompleted && schedule.frequency
        ? getNextDue(schedule.lastCompleted, schedule.frequency)
        : null);
      const hasMaintenance = eq.maintenance || schedule.frequency || nextDue;
      if (hasMaintenance) {
        items.push({
          ...eq,
          _nextDue: nextDue,
          _frequency: schedule.frequency,
          _lastCompleted: schedule.lastCompleted,
        });
      }
    });
    return items.sort((a, b) => {
      if (!a._nextDue) return 1;
      if (!b._nextDue) return -1;
      return new Date(a._nextDue) - new Date(b._nextDue);
    });
  }, [bidSheet, customEquipment]);

  const overdue = useMemo(() =>
    allEquipmentWithMaintenance.filter(eq => eq._nextDue && new Date(eq._nextDue) < new Date()),
    [allEquipmentWithMaintenance]
  );
  const upcoming = useMemo(() =>
    allEquipmentWithMaintenance.filter(eq => eq._nextDue && new Date(eq._nextDue) >= new Date()),
    [allEquipmentWithMaintenance]
  );
  const noSchedule = useMemo(() =>
    allEquipmentWithMaintenance.filter(eq => !eq._nextDue && !eq._frequency),
    [allEquipmentWithMaintenance]
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Equipment Maintenance Schedule"
        description="Track maintenance tasks and upcoming service dates for your equipment."
        color="orange"
      >
        {allEquipmentWithMaintenance.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No equipment with maintenance info</p>
            <p className="text-sm text-gray-500 mt-1">
              Add equipment in the Equipment tab and set maintenance requirements to see schedules here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {overdue.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4" /> Overdue ({overdue.length})
                </h3>
                <div className="space-y-2">
                  {overdue.map((eq) => (
                    <div
                      key={eq.id}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{eq.name}</p>
                        <p className="text-sm text-gray-600">{eq.maintenance || 'No description'}</p>
                      </div>
                      <div className="text-right text-sm">
                        {eq._frequency && (
                          <span className="text-gray-600">{FREQUENCY_LABELS[eq._frequency]}</span>
                        )}
                        {eq._nextDue && (
                          <p className="text-red-600 font-medium">
                            Due {new Date(eq._nextDue).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" /> Upcoming ({upcoming.length})
                </h3>
                <div className="space-y-2">
                  {upcoming.map((eq) => (
                    <div
                      key={eq.id}
                      className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{eq.name}</p>
                        <p className="text-sm text-gray-600">{eq.maintenance || 'No description'}</p>
                      </div>
                      <div className="text-right text-sm">
                        {eq._frequency && (
                          <span className="text-gray-600">{FREQUENCY_LABELS[eq._frequency]}</span>
                        )}
                        {eq._nextDue && (
                          <p className="text-amber-700 font-medium">
                            Due {new Date(eq._nextDue).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {noSchedule.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Maintenance notes (no schedule)</h3>
                <div className="space-y-2">
                  {noSchedule.map((eq) => (
                    <div
                      key={eq.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{eq.name}</p>
                        <p className="text-sm text-gray-600">{eq.maintenance || 'No description'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default MaintenanceScheduleView;
