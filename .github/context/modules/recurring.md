# Recurring Module

## recurring.types.ts
- RecurringFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
- RecurringType: 'expense' | 'income'
- WeekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 (0=Sun, 6=Sat)
- RecurringRule: domain entity (includes customDays: WeekDay[] | null)
- RecurringRuleRow: DB row (custom_days stored as JSON string)
- CreateRecurringRuleInput / UpdateRecurringRuleInput (optional customDays)

## recurring.model.ts
- createRecurringRule(): builds new entity (with customDays)
- calculateNextDate(currentDate, frequency, customDays?): computes next occurrence
  - biweekly: +14 days
  - quarterly: +3 months
  - custom: finds next matching weekday from customDays
- calculatePreviousDate(currentDate, frequency, customDays?): computes previous occurrence (for undo/revert)
- findNextCustomDay() / findPrevCustomDay(): helpers for custom weekday logic

## recurring.repository.ts
- insert() / update() / delete()
- findById() / findAll()
- findActive(): enabled rules only
- findDue(): rules needing processing
- setActive(): enable/disable
- updateNextDate(): advance schedule

## recurring.service.ts
- add() / edit() / remove()
- getById() / getAll() / getActive()
- getDue(): rules ready to execute
- pause() / resume(): toggle active
- skipNext(): advance without creating
- processDue(): generate transactions

## recurring.mapper.ts
- mapRowToRecurringRule(): DB → domain

