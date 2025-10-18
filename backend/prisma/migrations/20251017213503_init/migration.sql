-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "industry" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "category" TEXT NOT NULL,
    "calibrationInterval" INTEGER NOT NULL,
    "lastCalibrationDate" DATETIME,
    "nextCalibrationDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT,
    "clientId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "equipment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "calibration_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordNumber" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "calibrationDate" DATETIME NOT NULL,
    "nextDueDate" DATETIME NOT NULL,
    "technicianId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "certificateNumber" TEXT,
    "certificateUrl" TEXT,
    "asFoundCondition" TEXT,
    "asLeftCondition" TEXT,
    "standardsUsed" TEXT,
    "environmentalConditions" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "calibration_records_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "calibration_records_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "calibration_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "assignedTo" TEXT,
    "notes" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "calibration_schedules_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "clients_companyName_idx" ON "clients"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_equipmentId_key" ON "equipment"("equipmentId");

-- CreateIndex
CREATE INDEX "equipment_equipmentId_idx" ON "equipment"("equipmentId");

-- CreateIndex
CREATE INDEX "equipment_clientId_idx" ON "equipment"("clientId");

-- CreateIndex
CREATE INDEX "equipment_status_idx" ON "equipment"("status");

-- CreateIndex
CREATE INDEX "equipment_nextCalibrationDate_idx" ON "equipment"("nextCalibrationDate");

-- CreateIndex
CREATE UNIQUE INDEX "calibration_records_recordNumber_key" ON "calibration_records"("recordNumber");

-- CreateIndex
CREATE INDEX "calibration_records_recordNumber_idx" ON "calibration_records"("recordNumber");

-- CreateIndex
CREATE INDEX "calibration_records_equipmentId_idx" ON "calibration_records"("equipmentId");

-- CreateIndex
CREATE INDEX "calibration_records_calibrationDate_idx" ON "calibration_records"("calibrationDate");

-- CreateIndex
CREATE INDEX "calibration_records_nextDueDate_idx" ON "calibration_records"("nextDueDate");

-- CreateIndex
CREATE INDEX "calibration_schedules_equipmentId_idx" ON "calibration_schedules"("equipmentId");

-- CreateIndex
CREATE INDEX "calibration_schedules_scheduledDate_idx" ON "calibration_schedules"("scheduledDate");

-- CreateIndex
CREATE INDEX "calibration_schedules_status_idx" ON "calibration_schedules"("status");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
