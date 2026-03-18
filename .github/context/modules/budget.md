# Budget Module

## budget.types.ts
- BudgetType: 'monthly' | 'category'
- Budget: domain entity
- BudgetStatus: spent/remaining/percentage
- BudgetAlertLevel: 'safe' | 'warning' | 'exceeded'
- CreateBudgetInput / UpdateBudgetInput

## budget.model.ts
- createBudget(): builds new entity
- createBudgetStatus(): calculates progress
- getMonthDateRange(): current month bounds

## budget.repository.ts
- insert() / update() / delete()
- findById() / findAll() / findByType()
- findActive(): budgets for date
- findByCategory(): category budget
- findMonthlyBudget(): current monthly

## budget.service.ts
- add() / edit() / remove()
- getById() / getAll() / getActive()
- getStatus(): single budget progress
- getCategoryBudgetStatus(): category progress
- getAllStatuses(): all progress
- getActiveAlerts(): warning/exceeded only
- createMonthlyBudget(): upsert monthly
- createCategoryBudget(): new category budget

## budget.mapper.ts
- mapRowToBudget(): DB → domain

