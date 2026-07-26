-- AlterEnum
ALTER TYPE "HabitFrequency" ADD VALUE 'BIWEEKLY';

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "daysOfWeek" JSONB;
