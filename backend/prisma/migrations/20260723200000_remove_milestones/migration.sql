-- Migrate existing milestones to tasks
INSERT INTO "Task" ("id", "title", "status", "completedAt", "dueDate", "userId", "goalId", "createdAt", "updatedAt")
SELECT
  m."id",
  m."title",
  CASE WHEN m."completed" THEN 'COMPLETED'::"TaskStatus" ELSE 'PENDING'::"TaskStatus" END,
  m."completedAt",
  m."dueDate",
  g."userId",
  m."goalId",
  m."createdAt",
  m."updatedAt"
FROM "GoalMilestone" m
INNER JOIN "Goal" g ON g."id" = m."goalId";

-- Drop GoalMilestone foreign key, index, and table
DROP INDEX "GoalMilestone_goalId_idx";
ALTER TABLE "GoalMilestone" DROP CONSTRAINT "GoalMilestone_goalId_fkey";
DROP TABLE "GoalMilestone";
